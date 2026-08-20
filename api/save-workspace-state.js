const REPO = 'Letterblack0306/GPT-Knowledge';
const BRANCH = 'main';
const ALLOWED_PROJECTS = new Set(['lbe', 'access-browser-agent', 'brew']);

function send(res, status, body) {
  res.status(status).setHeader('content-type', 'application/json; charset=utf-8');
  res.send(JSON.stringify(body));
}

function sanitizeState(input) {
  const state = input && typeof input === 'object' ? input : {};
  const clean = {
    schema_version: 1,
    saved_at: new Date().toISOString(),
    done: {},
    pin: typeof state.pin === 'string' ? state.pin.slice(0, 200) : null,
    notes: [],
    phaseNotes: {},
    refs: {}
  };

  if (state.done && typeof state.done === 'object') {
    for (const [key, value] of Object.entries(state.done).slice(0, 500)) {
      clean.done[String(key).slice(0, 200)] = Boolean(value);
    }
  }

  if (state.phaseNotes && typeof state.phaseNotes === 'object') {
    for (const [key, value] of Object.entries(state.phaseNotes).slice(0, 500)) {
      clean.phaseNotes[String(key).slice(0, 200)] = String(value ?? '').slice(0, 12000);
    }
  }

  if (state.refs && typeof state.refs === 'object') {
    for (const [key, values] of Object.entries(state.refs).slice(0, 500)) {
      clean.refs[String(key).slice(0, 200)] = Array.isArray(values)
        ? values.slice(0, 100).map(v => String(v).slice(0, 4000))
        : [];
    }
  }

  if (Array.isArray(state.notes)) {
    clean.notes = state.notes.slice(0, 500).map(note => ({
      id: String(note?.id ?? '').slice(0, 200),
      x: Number.isFinite(Number(note?.x)) ? Number(note.x) : 0,
      y: Number.isFinite(Number(note?.y)) ? Number(note.y) : 0,
      text: String(note?.text ?? '').slice(0, 12000),
      phase: typeof note?.phase === 'string' ? note.phase.slice(0, 200) : null
    }));
  }

  return clean;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('allow', 'POST');
    return send(res, 405, { ok: false, error: 'METHOD_NOT_ALLOWED' });
  }

  const githubToken = process.env.GITHUB_TOKEN;
  const saveKey = process.env.WORKSPACE_SAVE_KEY;
  if (!githubToken || !saveKey) {
    return send(res, 503, { ok: false, error: 'SAVE_NOT_CONFIGURED' });
  }

  const suppliedKey = req.headers['x-workspace-save-key'];
  if (typeof suppliedKey !== 'string' || suppliedKey !== saveKey) {
    return send(res, 401, { ok: false, error: 'UNAUTHORIZED' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const project = String(body.project || '');
  if (!ALLOWED_PROJECTS.has(project)) {
    return send(res, 400, { ok: false, error: 'INVALID_PROJECT' });
  }

  const state = sanitizeState(body.state);
  const path = `project-engineering/projects/workspace-state/${project}.json`;
  const apiUrl = `https://api.github.com/repos/${REPO}/contents/${path}`;
  const headers = {
    authorization: `Bearer ${githubToken}`,
    accept: 'application/vnd.github+json',
    'x-github-api-version': '2022-11-28',
    'user-agent': 'gpt-knowledge-workspace'
  };

  let sha;
  const current = await fetch(`${apiUrl}?ref=${encodeURIComponent(BRANCH)}`, { headers });
  if (current.ok) {
    const existing = await current.json();
    sha = existing.sha;
  } else if (current.status !== 404) {
    const text = await current.text();
    return send(res, 502, { ok: false, error: 'GITHUB_READ_FAILED', detail: text.slice(0, 500) });
  }

  const payload = {
    message: `workspace: save ${project} annotations`,
    content: Buffer.from(JSON.stringify({ project, ...state }, null, 2) + '\n', 'utf8').toString('base64'),
    branch: BRANCH,
    ...(sha ? { sha } : {})
  };

  const write = await fetch(apiUrl, {
    method: 'PUT',
    headers: { ...headers, 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const result = await write.json().catch(() => ({}));
  if (!write.ok) {
    return send(res, 502, { ok: false, error: 'GITHUB_WRITE_FAILED', detail: result?.message || 'Unknown GitHub error' });
  }

  return send(res, 200, {
    ok: true,
    project,
    path,
    commit: result?.commit?.sha || null,
    file_sha: result?.content?.sha || null
  });
}
