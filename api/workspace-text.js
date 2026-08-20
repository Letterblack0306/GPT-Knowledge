const REPO = 'Letterblack0306/GPT-Knowledge';
const BRANCH = 'main';
const ALLOWED_PROJECTS = new Set(['lbe', 'access-browser-agent', 'brew', 'looptool']);
const ALLOWED_KINDS = new Set(['notes', 'documents']);
const ALLOWED_EXTENSIONS = new Set(['.md', '.txt', '.json']);
const ROOT = 'project-engineering/projects/workspace-content';

function send(res, status, body) {
  res.status(status).setHeader('content-type', 'application/json; charset=utf-8');
  res.send(JSON.stringify(body));
}

function cleanToken(value) {
  return String(value || '').trim();
}

function headers(token) {
  return {
    authorization: `Bearer ${cleanToken(token)}`,
    accept: 'application/vnd.github+json',
    'x-github-api-version': '2022-11-28',
    'user-agent': 'gpt-knowledge-workspace'
  };
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
  const ext = [...ALLOWED_EXTENSIONS].find(x => lower.endsWith(x));
  return ext ? name : null;
}

function pathFor(project, kind, name = '') {
  const base = `${ROOT}/${project}/${kind}`;
  return name ? `${base}/${name}` : base;
}

async function githubJson(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const body = await response.json().catch(() => ({}));
    return { response, body, error: null };
  } catch (error) {
    return { response: null, body: {}, error };
  }
}

export default async function handler(req, res) {
  const githubToken = cleanToken(process.env.GITHUB_TOKEN);
  if (!githubToken) return send(res, 503, { ok: false, error: 'GITHUB_NOT_CONFIGURED' });

  const project = normalizeProject(req.method === 'GET' ? req.query?.project : req.body?.project);
  const kind = normalizeKind(req.method === 'GET' ? req.query?.kind : req.body?.kind);
  if (!project) return send(res, 400, { ok: false, error: 'INVALID_PROJECT' });
  if (!kind) return send(res, 400, { ok: false, error: 'INVALID_KIND' });

  const authHeaders = headers(githubToken);

  if (req.method === 'GET') {
    const rawName = req.query?.name;
    if (rawName) {
      const name = normalizeName(rawName);
      if (!name) return send(res, 400, { ok: false, error: 'INVALID_NAME' });
      const path = pathFor(project, kind, name);
      const url = `https://api.github.com/repos/${REPO}/contents/${path}?ref=${encodeURIComponent(BRANCH)}`;
      const { response, body, error } = await githubJson(url, { headers: authHeaders });
      if (error) return send(res, 502, { ok: false, error: 'GITHUB_TRANSPORT_FAILED', detail: error.message });
      if (response.status === 404) return send(res, 404, { ok: false, error: 'NOT_FOUND' });
      if (!response.ok) return send(res, 502, { ok: false, error: 'GITHUB_READ_FAILED', detail: body?.message || 'Unknown GitHub error' });
      const content = Buffer.from(String(body.content || '').replace(/\n/g, ''), 'base64').toString('utf8');
      return send(res, 200, { ok: true, project, kind, name, path, sha: body.sha || null, content });
    }

    const path = pathFor(project, kind);
    const url = `https://api.github.com/repos/${REPO}/contents/${path}?ref=${encodeURIComponent(BRANCH)}`;
    const { response, body, error } = await githubJson(url, { headers: authHeaders });
    if (error) return send(res, 502, { ok: false, error: 'GITHUB_TRANSPORT_FAILED', detail: error.message });
    if (response.status === 404) return send(res, 200, { ok: true, project, kind, files: [] });
    if (!response.ok || !Array.isArray(body)) return send(res, 502, { ok: false, error: 'GITHUB_LIST_FAILED', detail: body?.message || 'Unknown GitHub error' });
    const files = body
      .filter(item => item?.type === 'file' && normalizeName(item.name))
      .map(item => ({ name: item.name, path: item.path, sha: item.sha, size: item.size }))
      .sort((a, b) => a.name.localeCompare(b.name));
    return send(res, 200, { ok: true, project, kind, files });
  }

  if (req.method !== 'POST') {
    res.setHeader('allow', 'GET, POST');
    return send(res, 405, { ok: false, error: 'METHOD_NOT_ALLOWED' });
  }

  const saveKey = String(process.env.WORKSPACE_SAVE_KEY || '');
  if (!saveKey) return send(res, 503, { ok: false, error: 'SAVE_NOT_CONFIGURED' });
  const suppliedKey = req.headers['x-workspace-save-key'];
  if (typeof suppliedKey !== 'string' || suppliedKey !== saveKey) return send(res, 401, { ok: false, error: 'UNAUTHORIZED' });

  const name = normalizeName(req.body?.name);
  if (!name) return send(res, 400, { ok: false, error: 'INVALID_NAME', allowed_extensions: [...ALLOWED_EXTENSIONS] });
  const content = String(req.body?.content ?? '');
  if (Buffer.byteLength(content, 'utf8') > 1024 * 1024) return send(res, 413, { ok: false, error: 'CONTENT_TOO_LARGE', max_bytes: 1048576 });

  if (name.toLowerCase().endsWith('.json')) {
    try { JSON.parse(content); }
    catch { return send(res, 400, { ok: false, error: 'INVALID_JSON' }); }
  }

  const path = pathFor(project, kind, name);
  const apiUrl = `https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha;
  const currentResult = await githubJson(`${apiUrl}?ref=${encodeURIComponent(BRANCH)}`, { headers: authHeaders });
  if (currentResult.error) return send(res, 502, { ok: false, error: 'GITHUB_TRANSPORT_FAILED', detail: currentResult.error.message });
  const current = currentResult.response;
  if (current.ok) {
    sha = currentResult.body.sha;
  } else if (current.status !== 404) {
    return send(res, 502, { ok: false, error: 'GITHUB_READ_FAILED', detail: currentResult.body?.message || 'Unknown GitHub error' });
  }

  const payload = {
    message: `workspace: save ${project} ${kind}/${name}`,
    content: Buffer.from(content, 'utf8').toString('base64'),
    branch: BRANCH,
    ...(sha ? { sha } : {})
  };
  const { response: write, body: result, error: writeError } = await githubJson(apiUrl, {
    method: 'PUT',
    headers: { ...authHeaders, 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (writeError) return send(res, 502, { ok: false, error: 'GITHUB_TRANSPORT_FAILED', detail: writeError.message });
  if (!write.ok) return send(res, 502, { ok: false, error: 'GITHUB_WRITE_FAILED', detail: result?.message || 'Unknown GitHub error' });

  return send(res, 200, {
    ok: true,
    project,
    kind,
    name,
    path,
    commit: result?.commit?.sha || null,
    file_sha: result?.content?.sha || null
  });
}
