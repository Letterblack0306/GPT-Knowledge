import { createSign, randomUUID } from 'node:crypto';

const DEFAULT_REPOSITORY = 'Letterblack0306/Letterblack_BirdEye';
const DEFAULT_BRANCH = 'runtime/dev-main';
const DEFAULT_MACHINE_ID = 'dev-main';
const DEFAULT_APP_ID = '4665407';
const DEFAULT_INSTALLATION_ID = '155308247';
const MAX_FILES = 100;
const REQUEST_TTL_MS = 5 * 60 * 1000;

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  res.end(JSON.stringify(body));
}

function config() {
  return {
    repository: process.env.BIRDEYE_REPOSITORY || DEFAULT_REPOSITORY,
    branch: process.env.BIRDEYE_RUNTIME_BRANCH || DEFAULT_BRANCH,
    machineId: process.env.BIRDEYE_MACHINE_ID || DEFAULT_MACHINE_ID,
    token: process.env.BIRDEYE_GITHUB_TOKEN || '',
    appPrivateKey: process.env.GITHUB_APP_PRIVATE_KEY || '',
    appId: process.env.BIRDEYE_GITHUB_APP_ID || DEFAULT_APP_ID,
    installationId: process.env.BIRDEYE_GITHUB_INSTALLATION_ID || DEFAULT_INSTALLATION_ID,
    workspaceAllowlist: new Set(
      String(process.env.BIRDEYE_WORKSPACE_IDS || '')
        .split(',')
        .map(v => v.trim())
        .filter(Boolean)
    ),
  };
}

function availability(cfg) {
  const missing = [];
  if (!cfg.token && !cfg.appPrivateKey) {
    missing.push('BIRDEYE_GITHUB_TOKEN or GITHUB_APP_PRIVATE_KEY');
  }
  return { available: missing.length === 0, missing };
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

function base64url(value) {
  return Buffer.from(value).toString('base64url');
}

function createAppJwt(privateKey, appId) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({ iat: now - 60, exp: now + 540, iss: appId }));
  const signingInput = `${header}.${payload}`;
  const signer = createSign('RSA-SHA256');
  signer.update(signingInput);
  signer.end();
  return `${signingInput}.${signer.sign(privateKey).toString('base64url')}`;
}

function apiHeaders(token) {
  return {
    accept: 'application/vnd.github+json',
    authorization: `Bearer ${token}`,
    'content-type': 'application/json',
    'user-agent': 'Letterblack-GPT-Knowledge-BirdEye/1',
    'x-github-api-version': '2022-11-28',
  };
}

async function authToken(cfg) {
  if (cfg.token) return cfg.token;
  const privateKey = normalizePrivateKey(cfg.appPrivateKey);
  if (!privateKey) throw new Error('GITHUB_APP_PRIVATE_KEY is invalid');
  const jwt = createAppJwt(privateKey, cfg.appId);
  const response = await fetch(
    `https://api.github.com/app/installations/${encodeURIComponent(cfg.installationId)}/access_tokens`,
    { method: 'POST', headers: apiHeaders(jwt) }
  );
  const body = await response.json().catch(() => ({}));
  if (!response.ok || !body?.token) {
    throw new Error(`GitHub App authentication failed: ${body?.message || response.status}`);
  }
  return body.token;
}

function validWorkspaceId(value, cfg) {
  if (typeof value !== 'string' || !/^[a-zA-Z0-9._-]{1,80}$/.test(value)) return false;
  return cfg.workspaceAllowlist.size === 0 || cfg.workspaceAllowlist.has(value);
}

function normalizeFiles(value) {
  if (!Array.isArray(value) || value.length < 1 || value.length > MAX_FILES) {
    throw new Error(`files must contain between 1 and ${MAX_FILES} paths`);
  }
  const out = [];
  const seen = new Set();
  for (const raw of value) {
    if (typeof raw !== 'string' || !raw.trim()) throw new Error('file paths must be non-empty strings');
    const path = raw.trim().replace(/\\/g, '/');
    if (path.startsWith('/') || /^[a-zA-Z]:\//.test(path)) throw new Error('file paths must be workspace-relative');
    const parts = path.split('/').filter(Boolean);
    if (!parts.length || parts.some(part => part === '..' || part === '.')) {
      throw new Error('file path traversal is not allowed');
    }
    const normalized = parts.join('/');
    if (!seen.has(normalized)) {
      seen.add(normalized);
      out.push(normalized);
    }
  }
  return out;
}

async function github(cfg, token, method, path, body) {
  const encodedPath = path.split('/').map(encodeURIComponent).join('/');
  const url = `https://api.github.com/repos/${cfg.repository}/contents/${encodedPath}?ref=${encodeURIComponent(cfg.branch)}`;
  const response = await fetch(url, {
    method,
    headers: apiHeaders(token),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (response.status === 404) return null;
  const text = await response.text();
  let payload = null;
  try { payload = text ? JSON.parse(text) : null; } catch { payload = { message: text }; }
  if (!response.ok) {
    const message = payload?.message || `${response.status} ${response.statusText}`;
    throw new Error(`BirdEye GitHub request failed: ${message}`);
  }
  return payload;
}

async function readJson(cfg, token, path) {
  const item = await github(cfg, token, 'GET', path);
  if (!item) return null;
  if (!item.content) throw new Error(`BirdEye response has no content: ${path}`);
  return JSON.parse(Buffer.from(String(item.content).replace(/\n/g, ''), 'base64').toString('utf8'));
}

async function writeJson(cfg, token, path, value, message) {
  const encoded = Buffer.from(`${JSON.stringify(value, null, 2)}\n`, 'utf8').toString('base64');
  await github(cfg, token, 'PUT', path, {
    branch: cfg.branch,
    message,
    content: encoded,
  });
}

async function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 64 * 1024) throw new Error('request body too large');
  }
  return raw ? JSON.parse(raw) : {};
}

export default async function handler(req, res) {
  const cfg = config();
  const ready = availability(cfg);
  if (!ready.available) {
    return json(res, 503, {
      ok: false,
      state: 'LIVE_LOCAL_UNAVAILABLE',
      reason: 'BirdEye live bridge authentication is not configured on the deployment.',
      missing: ready.missing,
    });
  }

  try {
    const token = await authToken(cfg);

    if (req.method === 'POST') {
      const body = await parseBody(req);
      const workspaceId = body?.workspaceId;
      if (!validWorkspaceId(workspaceId, cfg)) {
        return json(res, 400, { ok: false, error: 'workspaceId is invalid or not allowed' });
      }
      const files = normalizeFiles(body?.files);
      const requestId = `ui-file-state-${Date.now()}-${randomUUID()}`;
      const created = new Date();
      const request = {
        schemaVersion: 1,
        requestId,
        createdAt: created.toISOString(),
        expiresAt: new Date(created.getTime() + REQUEST_TTL_MS).toISOString(),
        workspaceId,
        operation: 'workspace_file_state',
        scope: { files },
        mutationAllowed: false,
      };
      await writeJson(
        cfg,
        token,
        `requests/pending/${requestId}.json`,
        request,
        `bird-eye: request live file state for ${workspaceId}`
      );
      return json(res, 202, {
        ok: true,
        state: 'PENDING',
        requestId,
        workspaceId,
        machineId: cfg.machineId,
        runtimeBranch: cfg.branch,
        fileCount: files.length,
      });
    }

    if (req.method === 'GET') {
      const requestId = typeof req.query?.requestId === 'string' ? req.query.requestId : '';
      if (!/^ui-file-state-[a-zA-Z0-9._-]+$/.test(requestId)) {
        return json(res, 400, { ok: false, error: 'valid requestId is required' });
      }
      const result = await readJson(
        cfg,
        token,
        `responses/${cfg.machineId}/${requestId}/result.json`
      );
      if (!result) {
        return json(res, 202, { ok: true, state: 'PENDING', requestId });
      }
      const files = Array.isArray(result?.fileState?.files) ? result.fileState.files : [];
      return json(res, 200, {
        ok: result.status === 'completed',
        state: result.status === 'completed' ? 'LIVE_LOCAL_AVAILABLE' : 'LIVE_LOCAL_UNAVAILABLE',
        requestId,
        workspaceId: result.workspaceId || result?.fileState?.workspaceId || null,
        machineId: result.machineId || cfg.machineId,
        sourceHead: result?.fileState?.sourceHead || result?.git?.head || null,
        observedAt: result?.fileState?.observedAt || result.completedAt || null,
        verdict: result.verdict || null,
        files,
        error: result.error || null,
      });
    }

    res.setHeader('allow', 'GET, POST');
    return json(res, 405, { ok: false, error: 'method not allowed' });
  } catch (error) {
    return json(res, 500, {
      ok: false,
      state: 'LIVE_LOCAL_UNAVAILABLE',
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
