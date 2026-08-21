import { createSign, randomUUID } from 'node:crypto';
import { WORKSPACE_SAVE_KEY as REPO_WORKSPACE_SAVE_KEY } from './workspace-config.js';

const REPO = 'Letterblack0306/GPT-Knowledge';
const BRANCH = 'main';
const APP_ID = '4665407';
const INSTALLATION_ID = '155308247';
const ROOT = 'project-engineering/projects/workspace-actions';
const ALLOWED_PROJECTS = new Set(['lbe', 'access-browser-agent', 'brew', 'looptool']);
const ALLOWED_CAPABILITIES = new Set([
  'project.audit',
  'project.verify',
  'project.report-evidence',
  'issue.inspect'
]);

function send(res, status, body) {
  res.status(status).setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  res.send(JSON.stringify(body));
}

function apiHeaders(token) {
  return {
    authorization: `Bearer ${token}`,
    accept: 'application/vnd.github+json',
    'x-github-api-version': '2022-11-28',
    'user-agent': 'gpt-knowledge-workspace-actions'
  };
}

function base64url(value) {
  return Buffer.from(value).toString('base64url');
}

function normalizePrivateKey(value) {
  const raw = String(value || '').trim().replace(/\\n/g, '\n');
  if (!raw) return null;
  if (raw.includes('-----BEGIN')) return raw;
  const compact = raw.replace(/\s+/g, '');
  if (!/^MII[A-Za-z0-9+/=]+$/.test(compact)) return null;
  const lines = compact.match(/.{1,64}/g) || [];
  return `-----BEGIN RSA PRIVATE KEY-----\n${lines.join('\n')}\n-----END RSA PRIVATE KEY-----`;
}

function createAppJwt(privateKey) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({ iat: now - 60, exp: now + 540, iss: APP_ID }));
  const signingInput = `${header}.${payload}`;
  const signer = createSign('RSA-SHA256');
  signer.update(signingInput);
  signer.end();
  const signature = signer.sign(privateKey).toString('base64url');
  return `${signingInput}.${signature}`;
}

async function githubJson(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const body = await response.json().catch(() => ({}));
    return { response, body, error: false };
  } catch {
    return { response: null, body: {}, error: true };
  }
}

async function installationToken() {
  const privateKey = normalizePrivateKey(process.env.GITHUB_APP_PRIVATE_KEY || process.env.GITHUB_TOKEN);
  if (!privateKey) return { token: null, error: 'GITHUB_APP_PRIVATE_KEY_NOT_CONFIGURED' };
  let jwt;
  try { jwt = createAppJwt(privateKey); }
  catch { return { token: null, error: 'GITHUB_APP_PRIVATE_KEY_INVALID' }; }
  const { response, body, error } = await githubJson(
    `https://api.github.com/app/installations/${INSTALLATION_ID}/access_tokens`,
    { method: 'POST', headers: apiHeaders(jwt) }
  );
  if (error) return { token: null, error: 'GITHUB_APP_TRANSPORT_FAILED' };
  if (!response.ok || !body?.token) {
    return { token: null, error: 'GITHUB_APP_AUTH_FAILED', detail: body?.message || `GitHub HTTP ${response.status}` };
  }
  return { token: body.token, error: null };
}

function normalizeProject(value) {
  const project = String(value || '').trim();
  return ALLOWED_PROJECTS.has(project) ? project : null;
}

function normalizeCapability(value) {
  const capability = String(value || '').trim();
  return ALLOWED_CAPABILITIES.has(capability) ? capability : null;
}

function cleanText(value, max = 2000) {
  const text = String(value || '').trim();
  return text.slice(0, max);
}

function requestPath(project, id) {
  return `${ROOT}/${project}/requests/${id}.json`;
}

function resultPath(project, id) {
  return `${ROOT}/${project}/results/${id}.json`;
}

async function readContent(token, path) {
  const { response, body, error } = await githubJson(
    `https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`,
    { headers: apiHeaders(token) }
  );
  if (error) return { ok: false, status: 502, error: 'GITHUB_TRANSPORT_FAILED' };
  if (response.status === 404) return { ok: false, status: 404, error: 'NOT_FOUND' };
  if (!response.ok) return { ok: false, status: 502, error: 'GITHUB_READ_FAILED', detail: body?.message || `GitHub HTTP ${response.status}` };
  try {
    return {
      ok: true,
      sha: body.sha || null,
      value: JSON.parse(Buffer.from(String(body.content || '').replace(/\n/g, ''), 'base64').toString('utf8'))
    };
  } catch {
    return { ok: false, status: 502, error: 'ACTION_JSON_INVALID' };
  }
}

async function listDirectory(token, path) {
  const { response, body, error } = await githubJson(
    `https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`,
    { headers: apiHeaders(token) }
  );
  if (error) return { ok: false, error: 'GITHUB_TRANSPORT_FAILED' };
  if (response.status === 404) return { ok: true, items: [] };
  if (!response.ok || !Array.isArray(body)) return { ok: false, error: 'GITHUB_LIST_FAILED', detail: body?.message || `GitHub HTTP ${response.status}` };
  return { ok: true, items: body.filter(x => x?.type === 'file' && x.name.endsWith('.json')) };
}

async function writeContent(token, path, value, message, sha = null) {
  const payload = {
    message,
    content: Buffer.from(`${JSON.stringify(value, null, 2)}\n`, 'utf8').toString('base64'),
    branch: BRANCH,
    ...(sha ? { sha } : {})
  };
  const { response, body, error } = await githubJson(
    `https://api.github.com/repos/${REPO}/contents/${path}`,
    {
      method: 'PUT',
      headers: { ...apiHeaders(token), 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    }
  );
  if (error) return { ok: false, error: 'GITHUB_TRANSPORT_FAILED' };
  if (!response.ok) return { ok: false, error: 'GITHUB_WRITE_FAILED', detail: body?.message || `GitHub HTTP ${response.status}` };
  return { ok: true, commit: body?.commit?.sha || null, file_sha: body?.content?.sha || null };
}

async function pendingForProject(token, project, limit = 20) {
  const requests = await listDirectory(token, `${ROOT}/${project}/requests`);
  if (!requests.ok) return requests;
  const results = await listDirectory(token, `${ROOT}/${project}/results`);
  if (!results.ok) return results;
  const completed = new Set(results.items.map(x => x.name.replace(/\.json$/, '')));
  const candidates = requests.items
    .filter(x => !completed.has(x.name.replace(/\.json$/, '')))
    .sort((a, b) => b.name.localeCompare(a.name))
    .slice(0, limit);
  const values = [];
  for (const item of candidates) {
    const read = await readContent(token, `${ROOT}/${project}/requests/${item.name}`);
    if (read.ok) values.push(read.value);
  }
  return { ok: true, items: values };
}

async function recentForProject(token, project, limit = 12) {
  const requests = await listDirectory(token, `${ROOT}/${project}/requests`);
  if (!requests.ok) return requests;
  const names = requests.items.sort((a, b) => b.name.localeCompare(a.name)).slice(0, limit);
  const out = [];
  for (const item of names) {
    const id = item.name.replace(/\.json$/, '');
    const req = await readContent(token, requestPath(project, id));
    if (!req.ok) continue;
    const result = await readContent(token, resultPath(project, id));
    out.push({ request: req.value, result: result.ok ? result.value : null });
  }
  return { ok: true, items: out };
}

export default async function handler(req, res) {
  const auth = await installationToken();
  if (!auth.token) return send(res, 502, { ok: false, error: auth.error, ...(auth.detail ? { detail: auth.detail } : {}) });
  const token = auth.token;

  if (req.method === 'GET') {
    const state = String(req.query?.state || 'recent');
    const project = req.query?.project ? normalizeProject(req.query.project) : null;
    if (req.query?.project && !project) return send(res, 400, { ok: false, error: 'INVALID_PROJECT' });
    const projects = project ? [project] : [...ALLOWED_PROJECTS];
    const items = [];
    for (const id of projects) {
      const result = state === 'pending' ? await pendingForProject(token, id) : await recentForProject(token, id);
      if (!result.ok) return send(res, 502, { ok: false, error: result.error, ...(result.detail ? { detail: result.detail } : {}) });
      if (state === 'pending') items.push(...result.items);
      else items.push(...result.items.map(x => ({ project: id, ...x })));
    }
    return send(res, 200, { ok: true, state, items });
  }

  if (req.method !== 'POST') {
    res.setHeader('allow', 'GET, POST');
    return send(res, 405, { ok: false, error: 'METHOD_NOT_ALLOWED' });
  }

  const saveKey = String(process.env.WORKSPACE_SAVE_KEY || REPO_WORKSPACE_SAVE_KEY || '');
  if (!saveKey) return send(res, 503, { ok: false, error: 'SAVE_NOT_CONFIGURED' });
  if (req.headers['x-workspace-save-key'] !== saveKey) return send(res, 401, { ok: false, error: 'UNAUTHORIZED' });

  const operation = String(req.body?.operation || 'request');
  if (operation === 'request') {
    const project = normalizeProject(req.body?.project);
    const capability = normalizeCapability(req.body?.capability);
    if (!project) return send(res, 400, { ok: false, error: 'INVALID_PROJECT' });
    if (!capability) return send(res, 400, { ok: false, error: 'INVALID_CAPABILITY', allowed: [...ALLOWED_CAPABILITIES] });
    const objective = cleanText(req.body?.objective, 2000);
    if (capability === 'issue.inspect' && !objective) return send(res, 400, { ok: false, error: 'OBJECTIVE_REQUIRED' });
    const id = `${Date.now()}-${randomUUID()}`;
    const request = {
      contract: 'lb-workspace-action/v1',
      request_id: id,
      project,
      capability,
      objective,
      scope: cleanText(req.body?.scope, 500) || 'current-workspace',
      requested_by: cleanText(req.body?.requested_by, 120) || 'lb-workspace-browser',
      execution_policy: 'read-only-evidence',
      created_at: new Date().toISOString()
    };
    const write = await writeContent(token, requestPath(project, id), request, `workspace action: request ${project} ${capability}`);
    if (!write.ok) return send(res, 502, { ok: false, error: write.error, ...(write.detail ? { detail: write.detail } : {}) });
    return send(res, 200, { ok: true, request, commit: write.commit });
  }

  if (operation === 'result') {
    const project = normalizeProject(req.body?.project);
    const id = cleanText(req.body?.request_id, 160);
    if (!project || !id || !/^[0-9]+-[0-9a-f-]+$/i.test(id)) return send(res, 400, { ok: false, error: 'INVALID_RESULT_IDENTITY' });
    const requestRead = await readContent(token, requestPath(project, id));
    if (!requestRead.ok) return send(res, 404, { ok: false, error: 'REQUEST_NOT_FOUND' });
    const existing = await readContent(token, resultPath(project, id));
    const result = {
      contract: 'lb-workspace-action-result/v1',
      request_id: id,
      project,
      requested_capability: requestRead.value.capability,
      resolved_capability: cleanText(req.body?.resolved_capability, 120),
      status: cleanText(req.body?.status, 40) || 'completed',
      classification: cleanText(req.body?.classification, 160),
      executor: cleanText(req.body?.executor, 120) || 'looptool-local-bridge',
      executor_instance: cleanText(req.body?.executor_instance, 160),
      workspace_identity: req.body?.workspace_identity && typeof req.body.workspace_identity === 'object' ? req.body.workspace_identity : null,
      resolved_operations: Array.isArray(req.body?.resolved_operations) ? req.body.resolved_operations.map(x => cleanText(x, 300)).slice(0, 30) : [],
      evidence: req.body?.evidence && typeof req.body.evidence === 'object' ? req.body.evidence : {},
      error: cleanText(req.body?.error, 2000) || null,
      started_at: cleanText(req.body?.started_at, 80) || null,
      completed_at: new Date().toISOString()
    };
    const write = await writeContent(token, resultPath(project, id), result, `workspace action: result ${project} ${id}`, existing.ok ? existing.sha : null);
    if (!write.ok) return send(res, 502, { ok: false, error: write.error, ...(write.detail ? { detail: write.detail } : {}) });
    return send(res, 200, { ok: true, result, commit: write.commit });
  }

  return send(res, 400, { ok: false, error: 'INVALID_OPERATION' });
}
