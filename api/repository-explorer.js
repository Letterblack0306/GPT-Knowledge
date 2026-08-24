import { createSign } from 'node:crypto';

const APP_ID = '4665407';
const INSTALLATION_ID = '155308247';
const DEFAULT_BRANCH = 'main';
const MAX_TREE_ITEMS = 400;

function send(res, status, body) {
  res.status(status).setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  res.send(JSON.stringify(body));
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
  const input = `${header}.${payload}`;
  const signer = createSign('RSA-SHA256');
  signer.update(input);
  signer.end();
  return `${input}.${signer.sign(privateKey).toString('base64url')}`;
}

function headers(token) {
  return {
    authorization: `Bearer ${token}`,
    accept: 'application/vnd.github+json',
    'x-github-api-version': '2022-11-28',
    'user-agent': 'gpt-knowledge-repository-explorer'
  };
}

async function json(url, token) {
  try {
    const response = await fetch(url, { headers: headers(token) });
    const body = await response.json().catch(() => ({}));
    return { response, body };
  } catch {
    return { response: null, body: {} };
  }
}

async function installationToken() {
  const key = normalizePrivateKey(process.env.GITHUB_APP_PRIVATE_KEY);
  if (!key) return null;
  let jwt;
  try { jwt = createAppJwt(key); } catch { return null; }
  try {
    const response = await fetch(`https://api.github.com/app/installations/${INSTALLATION_ID}/access_tokens`, {
      method: 'POST',
      headers: headers(jwt)
    });
    const body = await response.json().catch(() => ({}));
    return response.ok ? body.token || null : null;
  } catch {
    return null;
  }
}

function safeRepo(value) {
  const repo = String(value || '').trim();
  return /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo) ? repo : null;
}

function safeRef(value) {
  const ref = String(value || DEFAULT_BRANCH).trim();
  return /^[A-Za-z0-9._\/-]{1,200}$/.test(ref) ? ref : DEFAULT_BRANCH;
}

function normalizeTree(items) {
  const root = [];
  const dirs = new Map([['', root]]);
  const sorted = [...items].sort((a, b) => String(a.path).localeCompare(String(b.path)));
  for (const item of sorted.slice(0, MAX_TREE_ITEMS)) {
    const parts = String(item.path || '').split('/').filter(Boolean);
    if (!parts.length) continue;
    let parent = root;
    let prefix = '';
    for (let i = 0; i < parts.length; i++) {
      const name = parts[i];
      const path = prefix ? `${prefix}/${name}` : name;
      const last = i === parts.length - 1;
      if (!last) {
        if (!dirs.has(path)) {
          const node = { type: 'tree', name, path, children: [] };
          parent.push(node);
          dirs.set(path, node.children);
        }
        parent = dirs.get(path);
      } else {
        parent.push({ type: item.type === 'tree' ? 'tree' : 'blob', name, path, sha: item.sha || null, size: item.size ?? null, children: item.type === 'tree' ? [] : undefined });
      }
      prefix = path;
    }
  }
  return root;
}

async function readLinks(repo, ref, token) {
  const candidates = [
    'project-engineering/projects/lbe-plan-canvas/status.json',
    'project-engineering/projects/lbe-plan-canvas/plan.json'
  ];
  const links = [];
  for (const path of candidates) {
    const { response, body } = await json(`https://api.github.com/repos/Letterblack0306/GPT-Knowledge/contents/${path}?ref=main`, token);
    if (!response?.ok || !body?.content) continue;
    try {
      const value = JSON.parse(Buffer.from(String(body.content).replace(/\n/g, ''), 'base64').toString('utf8'));
      const walk = (node, key = '') => {
        if (Array.isArray(node)) return node.forEach(x => walk(x, key));
        if (!node || typeof node !== 'object') return;
        for (const [k, v] of Object.entries(node)) {
          if (typeof v === 'string' && /^https?:\/\//i.test(v)) {
            links.push({ label: k.replace(/_/g, ' '), url: v, source: path });
          } else walk(v, k);
        }
      };
      walk(value);
    } catch {}
  }
  const seen = new Set();
  return links.filter(link => !seen.has(link.url) && seen.add(link.url)).slice(0, 30);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return send(res, 405, { ok: false, error: 'METHOD_NOT_ALLOWED' });
  const repo = safeRepo(req.query?.repo);
  const ref = safeRef(req.query?.ref);
  if (!repo) return send(res, 400, { ok: false, error: 'REPO_REQUIRED' });

  const token = await installationToken();
  if (!token) return send(res, 503, { ok: false, error: 'GITHUB_APP_AUTH_UNAVAILABLE' });

  const [repoR, branchesR, prsR, issuesR, treeR, links] = await Promise.all([
    json(`https://api.github.com/repos/${repo}`, token),
    json(`https://api.github.com/repos/${repo}/branches?per_page=100`, token),
    json(`https://api.github.com/repos/${repo}/pulls?state=open&per_page=50`, token),
    json(`https://api.github.com/repos/${repo}/issues?state=open&per_page=50`, token),
    json(`https://api.github.com/repos/${repo}/git/trees/${encodeURIComponent(ref)}?recursive=1`, token),
    readLinks(repo, ref, token)
  ]);

  if (!repoR.response?.ok) return send(res, repoR.response?.status || 502, { ok: false, error: 'REPOSITORY_UNAVAILABLE', detail: repoR.body?.message || null });

  const branches = Array.isArray(branchesR.body) ? branchesR.body.map(b => ({ name: b.name, sha: b.commit?.sha || null, protected: Boolean(b.protected) })) : [];
  const prs = Array.isArray(prsR.body) ? prsR.body.map(p => ({ number: p.number, title: p.title, url: p.html_url, head: p.head?.ref || null, base: p.base?.ref || null, draft: Boolean(p.draft) })) : [];
  const issues = Array.isArray(issuesR.body) ? issuesR.body.filter(i => !i.pull_request).map(i => ({ number: i.number, title: i.title, url: i.html_url })) : [];
  const treeItems = Array.isArray(treeR.body?.tree) ? treeR.body.tree : [];

  return send(res, 200, {
    ok: true,
    repository: {
      full_name: repoR.body.full_name || repo,
      url: repoR.body.html_url || `https://github.com/${repo}`,
      default_branch: repoR.body.default_branch || DEFAULT_BRANCH,
      private: Boolean(repoR.body.private),
      ref
    },
    branches,
    pull_requests: prs,
    issues,
    links,
    tree: normalizeTree(treeItems),
    tree_truncated: Boolean(treeR.body?.truncated) || treeItems.length > MAX_TREE_ITEMS
  });
}
