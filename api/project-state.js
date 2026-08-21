import { createSign } from 'node:crypto';

const REPO = 'Letterblack0306/GPT-Knowledge';
const BRANCH = 'main';
const APP_ID = '4665407';
const INSTALLATION_ID = '155308247';

const PROJECTS = Object.freeze({
  lbe: {
    status: 'project-engineering/projects/lbe-plan-canvas/status.json',
    plan: 'project-engineering/projects/lbe-plan-canvas/plan.json'
  },
  'access-browser-agent': {
    status: 'project-engineering/projects/access-browser-agent-plan/status.json',
    plan: 'project-engineering/projects/access-browser-agent-plan/plan.json'
  },
  looptool: {
    status: 'project-engineering/projects/looptool/status.json',
    plan: 'project-engineering/projects/looptool/plan.json'
  }
});

const PLAN_TRUTH_STATES = new Set([
  'NO_ACTIVE_PLAN',
  'CHAT_PROPOSAL_ONLY',
  'DOCUMENTATION_PENDING',
  'DOCUMENTED_CURRENT',
  'DOCUMENTED_STALE',
  'DOCUMENTATION_BLOCKED',
  'PLAN_OWNER_MISSING'
]);

const STATUS_KEYS = new Set([
  'overall_classification',
  'active',
  'pending',
  'closed',
  'proven_findings',
  'hardening_plan',
  'next_acceptance',
  'plan_truth'
]);

const PLAN_KEYS = new Set([
  'active_node',
  'nodes',
  'edges',
  'plan_truth'
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
    'user-agent': 'gpt-knowledge-project-state'
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
  return `${signingInput}.${signer.sign(privateKey).toString('base64url')}`;
}

async function githubJson(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const body = await response.json().catch(() => ({}));
    return { response, body, transportError: false };
  } catch {
    return { response: null, body: {}, transportError: true };
  }
}

async function installationToken() {
  const privateKey = normalizePrivateKey(process.env.GITHUB_APP_PRIVATE_KEY);
  if (!privateKey) return { token: null, error: 'GITHUB_APP_PRIVATE_KEY_NOT_CONFIGURED' };
  let jwt;
  try { jwt = createAppJwt(privateKey); }
  catch { return { token: null, error: 'GITHUB_APP_PRIVATE_KEY_INVALID' }; }
  const { response, body, transportError } = await githubJson(
    `https://api.github.com/app/installations/${INSTALLATION_ID}/access_tokens`,
    { method: 'POST', headers: apiHeaders(jwt) }
  );
  if (transportError) return { token: null, error: 'GITHUB_APP_TRANSPORT_FAILED' };
  if (!response.ok || !body?.token) {
    return { token: null, error: 'GITHUB_APP_AUTH_FAILED', detail: body?.message || `GitHub HTTP ${response.status}` };
  }
  return { token: body.token, error: null };
}

function projectConfig(value) {
  const id = String(value || '').trim();
  return PROJECTS[id] ? { id, ...PROJECTS[id] } : null;
}

function cleanText(value, max = 2000) {
  return String(value ?? '').trim().slice(0, max);
}

function sha40(value) {
  const v = cleanText(value, 40);
  return /^[0-9a-f]{40}$/i.test(v) ? v.toLowerCase() : null;
}

function safeJson(value, depth = 0) {
  if (depth > 8) throw new Error('PATCH_TOO_DEEP');
  if (value === null || typeof value === 'boolean' || typeof value === 'number') return value;
  if (typeof value === 'string') return value.slice(0, 12000);
  if (Array.isArray(value)) {
    if (value.length > 250) throw new Error('PATCH_ARRAY_TOO_LARGE');
    return value.map(x => safeJson(x, depth + 1));
  }
  if (typeof value === 'object') {
    const out = {};
    const entries = Object.entries(value);
    if (entries.length > 120) throw new Error('PATCH_OBJECT_TOO_LARGE');
    for (const [key, item] of entries) {
      if (!/^[A-Za-z0-9_.-]{1,80}$/.test(key)) throw new Error('PATCH_KEY_INVALID');
      out[key] = safeJson(item, depth + 1);
    }
    return out;
  }
  throw new Error('PATCH_VALUE_INVALID');
}

function validatePlanTruth(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('PLAN_TRUTH_INVALID');
  const state = cleanText(value.state, 80);
  if (!PLAN_TRUTH_STATES.has(state)) throw new Error('PLAN_TRUTH_STATE_INVALID');
  return {
    state,
    document: cleanText(value.document, 500),
    document_revision: cleanText(value.document_revision || value.revision, 120),
    verified_at: cleanText(value.verified_at, 80) || new Date().toISOString(),
    active_gate: cleanText(value.active_gate, 240),
    next_single_question: cleanText(value.next_single_question, 3000)
  };
}

function validatePatch(kind, patch) {
  if (!patch || typeof patch !== 'object' || Array.isArray(patch)) throw new Error('PATCH_REQUIRED');
  const allowed = kind === 'status' ? STATUS_KEYS : PLAN_KEYS;
  const out = {};
  for (const [key, value] of Object.entries(patch)) {
    if (!allowed.has(key)) throw new Error(`PATCH_KEY_NOT_ALLOWED:${key}`);
    out[key] = key === 'plan_truth' ? validatePlanTruth(value) : safeJson(value);
  }
  if (!Object.keys(out).length) throw new Error('PATCH_EMPTY');
  return out;
}

function validateEvidence(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('EVIDENCE_REQUIRED');
  const evidence = safeJson(value);
  const hasAnchor = Boolean(
    cleanText(value.command_hash, 160) ||
    cleanText(value.receipt_id, 200) ||
    cleanText(value.commit_sha, 80) ||
    (Array.isArray(value.refs) && value.refs.length)
  );
  if (!hasAnchor) throw new Error('EVIDENCE_ANCHOR_REQUIRED');
  return evidence;
}

async function readJson(token, path) {
  const { response, body, transportError } = await githubJson(
    `https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`,
    { headers: apiHeaders(token) }
  );
  if (transportError) return { ok: false, status: 502, error: 'GITHUB_TRANSPORT_FAILED' };
  if (response.status === 404) return { ok: false, status: 404, error: 'NOT_FOUND' };
  if (!response.ok) return { ok: false, status: 502, error: 'GITHUB_READ_FAILED', detail: body?.message || `GitHub HTTP ${response.status}` };
  try {
    const text = Buffer.from(String(body.content || '').replace(/\n/g, ''), 'base64').toString('utf8');
    return { ok: true, sha: body.sha, value: JSON.parse(text) };
  } catch {
    return { ok: false, status: 502, error: 'PROJECT_JSON_INVALID' };
  }
}

async function writeJson(token, path, value, sha, message) {
  const payload = {
    message,
    content: Buffer.from(`${JSON.stringify(value, null, 2)}\n`, 'utf8').toString('base64'),
    branch: BRANCH,
    sha
  };
  const { response, body, transportError } = await githubJson(
    `https://api.github.com/repos/${REPO}/contents/${path}`,
    {
      method: 'PUT',
      headers: { ...apiHeaders(token), 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    }
  );
  if (transportError) return { ok: false, status: 502, error: 'GITHUB_TRANSPORT_FAILED' };
  if (response.status === 409 || response.status === 422) {
    return { ok: false, status: 409, error: 'PROJECTION_CONFLICT', detail: body?.message || 'Projection changed before write' };
  }
  if (!response.ok) return { ok: false, status: 502, error: 'GITHUB_WRITE_FAILED', detail: body?.message || `GitHub HTTP ${response.status}` };
  return { ok: true, commit: body?.commit?.sha || null, file_sha: body?.content?.sha || null };
}

async function verifySourceRevision(token, sourceRepo, sourceHead) {
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(sourceRepo)) return { ok: false, error: 'SOURCE_REPO_INVALID' };
  const { response, body, transportError } = await githubJson(
    `https://api.github.com/repos/${sourceRepo}/commits/${sourceHead}`,
    { headers: apiHeaders(token) }
  );
  if (transportError) return { ok: false, error: 'SOURCE_VERIFY_TRANSPORT_FAILED' };
  if (!response.ok || String(body?.sha || '').toLowerCase() !== sourceHead) {
    return { ok: false, error: 'SOURCE_REVISION_NOT_VERIFIED', detail: body?.message || `GitHub HTTP ${response.status}` };
  }
  return { ok: true };
}

function mergeProjection(current, patch, meta, kind) {
  const now = new Date().toISOString();
  const next = { ...current, ...patch };
  if (kind === 'status') {
    next.verified_at = now;
    next.source_repo = meta.source_repo;
    next.source_branch = meta.source_branch || current.source_branch || 'main';
    next.source_head = meta.source_head;
    next.last_agent_update = {
      contract: 'lb-project-state-update/v1',
      agent: meta.agent,
      source_repo: meta.source_repo,
      source_head: meta.source_head,
      evidence: meta.evidence,
      updated_at: now
    };
  } else {
    next.last_agent_update = {
      contract: 'lb-project-plan-update/v1',
      agent: meta.agent,
      source_repo: meta.source_repo,
      source_head: meta.source_head,
      evidence: meta.evidence,
      updated_at: now
    };
  }
  return next;
}

export default async function handler(req, res) {
  const auth = await installationToken();
  if (!auth.token) return send(res, 502, { ok: false, error: auth.error, ...(auth.detail ? { detail: auth.detail } : {}) });
  const token = auth.token;

  const project = projectConfig(req.method === 'GET' ? req.query?.project : req.body?.project);
  if (!project) return send(res, 400, { ok: false, error: 'INVALID_OR_UNMAPPED_PROJECT', allowed: Object.keys(PROJECTS) });

  if (req.method === 'GET') {
    const [status, plan] = await Promise.all([readJson(token, project.status), readJson(token, project.plan)]);
    if (!status.ok) return send(res, status.status || 502, { ok: false, error: status.error, ...(status.detail ? { detail: status.detail } : {}) });
    if (!plan.ok) return send(res, plan.status || 502, { ok: false, error: plan.error, ...(plan.detail ? { detail: plan.detail } : {}) });
    return send(res, 200, {
      ok: true,
      contract: 'lb-project-state/v1',
      project: project.id,
      status: { path: project.status, sha: status.sha, value: status.value },
      plan: { path: project.plan, sha: plan.sha, value: plan.value },
      allowed_plan_truth_states: [...PLAN_TRUTH_STATES]
    });
  }

  if (req.method !== 'POST') {
    res.setHeader('allow', 'GET, POST');
    return send(res, 405, { ok: false, error: 'METHOD_NOT_ALLOWED' });
  }

  const saveKey = String(process.env.WORKSPACE_SAVE_KEY || '');
  if (!saveKey) return send(res, 503, { ok: false, error: 'SAVE_NOT_CONFIGURED' });
  if (String(req.headers['x-workspace-save-key'] || '') !== saveKey) return send(res, 401, { ok: false, error: 'UNAUTHORIZED' });

  const kind = cleanText(req.body?.kind, 20);
  if (!['status', 'plan'].includes(kind)) return send(res, 400, { ok: false, error: 'INVALID_KIND', allowed: ['status', 'plan'] });
  const expectedSha = sha40(req.body?.expected_sha);
  if (!expectedSha) return send(res, 400, { ok: false, error: 'EXPECTED_SHA_REQUIRED' });
  const sourceHead = sha40(req.body?.source_head);
  if (!sourceHead) return send(res, 400, { ok: false, error: 'SOURCE_HEAD_REQUIRED' });
  const sourceRepo = cleanText(req.body?.source_repo, 200);
  const agent = cleanText(req.body?.agent, 160);
  if (!sourceRepo || !agent) return send(res, 400, { ok: false, error: 'SOURCE_REPO_AND_AGENT_REQUIRED' });

  let patch;
  let evidence;
  try {
    patch = validatePatch(kind, req.body?.patch);
    evidence = validateEvidence(req.body?.evidence);
  } catch (error) {
    return send(res, 400, { ok: false, error: String(error?.message || 'INVALID_PATCH') });
  }

  const sourceVerification = await verifySourceRevision(token, sourceRepo, sourceHead);
  if (!sourceVerification.ok) return send(res, 409, { ok: false, error: sourceVerification.error, ...(sourceVerification.detail ? { detail: sourceVerification.detail } : {}) });

  const path = kind === 'status' ? project.status : project.plan;
  const current = await readJson(token, path);
  if (!current.ok) return send(res, current.status || 502, { ok: false, error: current.error, ...(current.detail ? { detail: current.detail } : {}) });
  if (String(current.sha).toLowerCase() !== expectedSha) {
    return send(res, 409, {
      ok: false,
      error: 'STALE_PROJECTION_SHA',
      expected_sha: expectedSha,
      current_sha: current.sha,
      message: 'Read the current projection again, reconcile the newer state, then retry.'
    });
  }

  if (kind === 'status' && current.value?.source_repo && current.value.source_repo !== sourceRepo) {
    return send(res, 409, { ok: false, error: 'SOURCE_REPO_MISMATCH', current_source_repo: current.value.source_repo, submitted_source_repo: sourceRepo });
  }

  const next = mergeProjection(current.value, patch, {
    source_repo: sourceRepo,
    source_branch: cleanText(req.body?.source_branch, 120) || 'main',
    source_head: sourceHead,
    agent,
    evidence
  }, kind);

  const write = await writeJson(token, path, next, current.sha, `project state: ${project.id} ${kind} update by ${agent}`);
  if (!write.ok) return send(res, write.status || 502, { ok: false, error: write.error, ...(write.detail ? { detail: write.detail } : {}) });
  return send(res, 200, {
    ok: true,
    contract: 'lb-project-state-update/v1',
    project: project.id,
    kind,
    path,
    commit: write.commit,
    file_sha: write.file_sha,
    source_repo: sourceRepo,
    source_head: sourceHead,
    agent,
    applied_keys: Object.keys(patch)
  });
}
