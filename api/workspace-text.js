import { createSign } from 'node:crypto';

const REPO = 'Letterblack0306/GPT-Knowledge';
const BRANCH = 'main';
const APP_ID = '4665407';
const INSTALLATION_ID = '155292453';
const ALLOWED_PROJECTS = new Set(['lbe', 'access-browser-agent', 'brew', 'looptool']);
const ALLOWED_KINDS = new Set(['notes', 'documents']);
const ALLOWED_EXTENSIONS = new Set(['.md', '.txt', '.json']);
const ROOT = 'project-engineering/projects/workspace-content';

function send(res, status, body) {
  res.status(status).setHeader('content-type', 'application/json; charset=utf-8');
  res.send(JSON.stringify(body));
}

function apiHeaders(token) {
  return {
    authorization: `Bearer ${token}`,
    accept: 'application/vnd.github+json',
    'x-github-api-version': '2022-11-28',
    'user-agent': 'gpt-knowledge-workspace'
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
  try {
    jwt = createAppJwt(privateKey);
  } catch {
    return { token: null, error: 'GITHUB_APP_PRIVATE_KEY_INVALID' };
  }

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
  const project = String(value || '');
  return ALLOWED_PROJECTS.has(project) ? project : null;
}

function normalizeKind(value) {
  const kind = String(value || '');
  return ALLOWED_KINDS.has(kind) ? kind : null;
}

function normalizeName(value) {
  const name = String(value || '').trim();
  if (!name || name.length > 120) return null;
  if (name.includes('/') || name.includes('\\') || name.includes('..')) return null;
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._ -]*$/.test(name)) return null;
  const lower = name.toLowerCase();
  return [...ALLOWED_EXTENSIONS].some(ext => lower.endsWith(ext)) ? name : null;
}

function pathFor(project, kind, name = '') {
  const base = `${ROOT}/${project}/${kind}`;
  return name ? `${base}/${name}` : base;
}

export default async function handler(req, res) {
  const project = normalizeProject(req.method === 'GET' ? req.query?.project : req.body?.project);
  const kind = normalizeKind(req.method === 'GET' ? req.query?.kind : req.body?.kind);
  if (!project) return send(res, 400, { ok: false, error: 'INVALID_PROJECT' });
  if (!kind) return send(res, 400, { ok: false, error: 'INVALID_KIND' });

  const auth = await installationToken();
  if (!auth.token) return send(res, 502, { ok: false, error: auth.error, ...(auth.detail ? { detail: auth.detail } : {}) });
  const authHeaders = apiHeaders(auth.token);

  if (req.method === 'GET') {
    const rawName = req.query?.name;
    if (rawName) {
      const name = normalizeName(rawName);
      if (!name) return send(res, 400, { ok: false, error: 'INVALID_NAME' });
      const path = pathFor(project, kind, name);
      const { response, body, error } = await githubJson(`https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`, { headers: authHeaders });
      if (error) return send(res, 502, { ok: false, error: 'GITHUB_TRANSPORT_FAILED' });
      if (response.status === 404) return send(res, 404, { ok: false, error: 'NOT_FOUND' });
      if (!response.ok) return send(res, 502, { ok: false, error: 'GITHUB_READ_FAILED', detail: body?.message || `GitHub HTTP ${response.status}` });
      const content = Buffer.from(String(body.content || '').replace(/\n/g, ''), 'base64').toString('utf8');
      return send(res, 200, { ok: true, project, kind, name, path, sha: body.sha || null, content });
    }

    const path = pathFor(project, kind);
    const { response, body, error } = await githubJson(`https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`, { headers: authHeaders });
    if (error) return send(res, 502, { ok: false, error: 'GITHUB_TRANSPORT_FAILED' });
    if (response.status === 404) return send(res, 200, { ok: true, project, kind, files: [] });
    if (!response.ok || !Array.isArray(body)) return send(res, 502, { ok: false, error: 'GITHUB_LIST_FAILED', detail: body?.message || `GitHub HTTP ${response.status}` });
    const files = body.filter(item => item?.type === 'file' && normalizeName(item.name)).map(item => ({ name: item.name, path: item.path, sha: item.sha, size: item.size })).sort((a, b) => a.name.localeCompare(b.name));
    return send(res, 200, { ok: true, project, kind, files });
  }

  if (req.method !== 'POST') {
    res.setHeader('allow', 'GET, POST');
    return send(res, 405, { ok: false, error: 'METHOD_NOT_ALLOWED' });
  }

  const saveKey = String(process.env.WORKSPACE_SAVE_KEY || '');
  if (!saveKey) return send(res, 503, { ok: false, error: 'SAVE_NOT_CONFIGURED' });
  if (req.headers['x-workspace-save-key'] !== saveKey) return send(res, 401, { ok: false, error: 'UNAUTHORIZED' });

  const name = normalizeName(req.body?.name);
  if (!name) return send(res, 400, { ok: false, error: 'INVALID_NAME', allowed_extensions: [...ALLOWED_EXTENSIONS] });
  const content = String(req.body?.content ?? '');
  if (Buffer.byteLength(content, 'utf8') > 1024 * 1024) return send(res, 413, { ok: false, error: 'CONTENT_TOO_LARGE', max_bytes: 1048576 });
  if (name.toLowerCase().endsWith('.json')) {
    try { JSON.parse(content); } catch { return send(res, 400, { ok: false, error: 'INVALID_JSON' }); }
  }

  const path = pathFor(project, kind, name);
  const apiUrl = `https://api.github.com/repos/${REPO}/contents/${path}`;
  const currentResult = await githubJson(`${apiUrl}?ref=${BRANCH}`, { headers: authHeaders });
  if (currentResult.error) return send(res, 502, { ok: false, error: 'GITHUB_TRANSPORT_FAILED' });
  if (!currentResult.response.ok && currentResult.response.status !== 404) return send(res, 502, { ok: false, error: 'GITHUB_READ_FAILED', detail: currentResult.body?.message || `GitHub HTTP ${currentResult.response.status}` });

  const payload = {
    message: `workspace: save ${project} ${kind}/${name}`,
    content: Buffer.from(content, 'utf8').toString('base64'),
    branch: BRANCH,
    ...(currentResult.response.ok ? { sha: currentResult.body.sha } : {})
  };
  const writeResult = await githubJson(apiUrl, {
    method: 'PUT',
    headers: { ...authHeaders, 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (writeResult.error) return send(res, 502, { ok: false, error: 'GITHUB_TRANSPORT_FAILED' });
  if (!writeResult.response.ok) return send(res, 502, { ok: false, error: 'GITHUB_WRITE_FAILED', detail: writeResult.body?.message || `GitHub HTTP ${writeResult.response.status}` });

  return send(res, 200, {
    ok: true,
    project,
    kind,
    name,
    path,
    commit: writeResult.body?.commit?.sha || null,
    file_sha: writeResult.body?.content?.sha || null
  });
}
