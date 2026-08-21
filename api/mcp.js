import { createSign } from 'node:crypto';
import { posix as path } from 'node:path';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';

const REPO = 'Letterblack0306/GPT-Knowledge';
const BRANCH = 'main';
const APP_ID = '4665407';
const INSTALLATION_ID = '155308247';
const REGISTRY_PATH = 'project-engineering/projects/workspace/projects.json';
const KNOWLEDGE_INDEX_PATH = 'knowledge-index.json';
const GITHUB_WEB_ROOT = `https://github.com/${REPO}/blob/${BRANCH}`;
const ALLOWED_PROJECTS = new Set(['lbe', 'access-browser-agent', 'brew', 'looptool']);
const ALLOWED_FETCH_EXTENSIONS = new Set(['.md', '.txt', '.json']);

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

function apiHeaders(token) {
  return {
    authorization: `Bearer ${token}`,
    accept: 'application/vnd.github+json',
    'x-github-api-version': '2022-11-28',
    'user-agent': 'gpt-knowledge-mcp'
  };
}

async function githubJson(url, options = {}) {
  const response = await fetch(url, options);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body?.message || `GitHub HTTP ${response.status}`);
    error.code = 'GITHUB_REQUEST_FAILED';
    error.status = response.status;
    throw error;
  }
  return body;
}

async function installationToken() {
  const privateKey = normalizePrivateKey(process.env.GITHUB_APP_PRIVATE_KEY || process.env.GITHUB_TOKEN);
  if (!privateKey) throw Object.assign(new Error('GitHub App private key is not configured.'), { code: 'GITHUB_APP_PRIVATE_KEY_NOT_CONFIGURED' });
  const jwt = createAppJwt(privateKey);
  const body = await githubJson(`https://api.github.com/app/installations/${INSTALLATION_ID}/access_tokens`, {
    method: 'POST',
    headers: apiHeaders(jwt)
  });
  if (!body?.token) throw Object.assign(new Error('GitHub App installation token was not returned.'), { code: 'GITHUB_APP_AUTH_FAILED' });
  return body.token;
}

async function readRepoFile(token, repoPath) {
  const normalized = normalizeRepoPath(repoPath);
  const body = await githubJson(
    `https://api.github.com/repos/${REPO}/contents/${normalized}?ref=${encodeURIComponent(BRANCH)}`,
    { headers: apiHeaders(token) }
  );
  if (body?.type !== 'file') throw Object.assign(new Error('Requested repository path is not a file.'), { code: 'NOT_A_FILE' });
  return {
    path: normalized,
    sha: body.sha || null,
    text: Buffer.from(String(body.content || '').replace(/\n/g, ''), 'base64').toString('utf8')
  };
}

function normalizeRepoPath(value) {
  const raw = String(value || '').trim().replace(/\\/g, '/');
  if (!raw || raw.startsWith('/') || raw.includes('\0')) throw Object.assign(new Error('Invalid repository path.'), { code: 'INVALID_PATH' });
  const normalized = path.normalize(raw);
  if (normalized === '.' || normalized.startsWith('../') || normalized.includes('/../')) {
    throw Object.assign(new Error('Repository path escapes the GPT-Knowledge root.'), { code: 'INVALID_PATH' });
  }
  const ext = path.extname(normalized).toLowerCase();
  if (!ALLOWED_FETCH_EXTENSIONS.has(ext)) throw Object.assign(new Error('Unsupported knowledge file type.'), { code: 'UNSUPPORTED_FILE_TYPE' });
  return normalized;
}

function canonicalUrl(repoPath) {
  return `${GITHUB_WEB_ROOT}/${String(repoPath).split('/').map(encodeURIComponent).join('/')}`;
}

function parseJsonFile(file) {
  try { return JSON.parse(file.text); }
  catch { throw Object.assign(new Error(`Invalid JSON in ${file.path}.`), { code: 'INVALID_REPOSITORY_JSON' }); }
}

async function loadRegistry(token) {
  return parseJsonFile(await readRepoFile(token, REGISTRY_PATH));
}

function resolveRegistryReference(value) {
  const normalized = path.normalize(path.join(path.dirname(REGISTRY_PATH), String(value || '')));
  if (!normalized.startsWith('project-engineering/')) throw Object.assign(new Error('Project registry reference escapes project-engineering.'), { code: 'INVALID_PROJECT_REFERENCE' });
  return normalizeRepoPath(normalized);
}

async function projectRecord(token, projectId) {
  if (!ALLOWED_PROJECTS.has(projectId)) throw Object.assign(new Error('Unknown project.'), { code: 'INVALID_PROJECT' });
  const registry = await loadRegistry(token);
  const record = Array.isArray(registry?.projects) ? registry.projects.find(item => item?.id === projectId) : null;
  if (!record) throw Object.assign(new Error('Project is not registered.'), { code: 'PROJECT_NOT_REGISTERED' });
  return record;
}

function projectSummary(data, project, kind, repoPath) {
  const active = data?.active || null;
  const nextQuestion = data?.next_acceptance?.question || active?.question || null;
  return {
    project,
    kind,
    path: repoPath,
    source_revision: data?.source_head || null,
    classification: data?.overall_classification || active?.classification || null,
    active,
    next_question: nextQuestion,
    data,
    url: canonicalUrl(repoPath)
  };
}

function jsonToolResult(value) {
  return {
    structuredContent: value,
    content: [{ type: 'text', text: JSON.stringify(value) }]
  };
}

function titleFromPath(repoPath) {
  const base = path.basename(repoPath, path.extname(repoPath));
  return base.replace(/[-_]+/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

function collectIndexDocuments(index) {
  const docs = new Map();
  const add = (repoPath, domain, reason) => {
    if (typeof repoPath !== 'string' || !repoPath.trim()) return;
    let normalized;
    try { normalized = normalizeRepoPath(repoPath); } catch { return; }
    if (!docs.has(normalized)) docs.set(normalized, { path: normalized, domain, reasons: new Set() });
    docs.get(normalized).reasons.add(reason);
  };

  for (const repoPath of index?.boot?.always || []) add(repoPath, 'boot', 'always');
  if (index?.boot?.projectFeatureFirst?.canonical) add(index.boot.projectFeatureFirst.canonical, 'project-engineering', 'project-feature-first');

  for (const [domain, config] of Object.entries(index?.domains || {})) {
    for (const repoPath of config?.canonical || []) add(repoPath, domain, 'canonical');
    for (const [label, values] of Object.entries(config?.optional || {})) {
      for (const repoPath of values || []) add(repoPath, domain, label);
    }
  }
  return [...docs.values()].map(item => ({ ...item, reasons: [...item.reasons] }));
}

function scoreDocument(query, doc, index) {
  const normalizedQuery = String(query || '').toLowerCase();
  const tokens = normalizedQuery.split(/[^a-z0-9_.-]+/u).filter(token => token.length > 1);
  let score = 0;
  const haystack = `${doc.path} ${doc.domain} ${doc.reasons.join(' ')}`.toLowerCase();
  for (const token of tokens) if (haystack.includes(token)) score += 4;
  const domain = index?.domains?.[doc.domain];
  for (const trigger of domain?.triggers || []) {
    const lower = String(trigger).toLowerCase();
    if (normalizedQuery.includes(lower)) score += 8;
    else if (tokens.some(token => lower.includes(token))) score += 2;
  }
  if (doc.reasons.includes('canonical')) score += 1;
  return score;
}

async function createServer() {
  const server = new McpServer(
    { name: 'letterblack-gpt-knowledge', version: '0.1.0' },
    {
      instructions: 'Use GPT-Knowledge as durable method/project projection, not live runtime authority. Prefer project_status/project_plan for known projects; use search then fetch for reusable knowledge. Do not infer local/runtime truth from these tools.'
    }
  );

  server.registerTool(
    'project_status',
    {
      title: 'Get project status',
      description: 'Use this when the user needs the canonical GPT-Knowledge current-status projection for a registered Letterblack project.',
      inputSchema: { project: z.enum(['lbe', 'access-browser-agent', 'brew', 'looptool']) },
      outputSchema: {
        project: z.string(),
        kind: z.literal('status'),
        path: z.string(),
        source_revision: z.string().nullable(),
        classification: z.string().nullable(),
        active: z.unknown().nullable(),
        next_question: z.string().nullable(),
        data: z.unknown(),
        url: z.string()
      },
      annotations: { readOnlyHint: true, openWorldHint: false, destructiveHint: false }
    },
    async ({ project }) => {
      const token = await installationToken();
      const record = await projectRecord(token, project);
      if (!record?.status_file) throw Object.assign(new Error('This project has no registered status file.'), { code: 'PROJECT_STATUS_UNAVAILABLE' });
      const repoPath = resolveRegistryReference(record.status_file);
      const data = parseJsonFile(await readRepoFile(token, repoPath));
      return jsonToolResult(projectSummary(data, project, 'status', repoPath));
    }
  );

  server.registerTool(
    'project_plan',
    {
      title: 'Get project plan',
      description: 'Use this when the user needs the canonical GPT-Knowledge plan/map projection for a registered Letterblack project.',
      inputSchema: { project: z.enum(['lbe', 'access-browser-agent', 'brew', 'looptool']) },
      outputSchema: {
        project: z.string(),
        kind: z.literal('plan'),
        path: z.string(),
        source_revision: z.string().nullable(),
        classification: z.string().nullable(),
        active: z.unknown().nullable(),
        next_question: z.string().nullable(),
        data: z.unknown(),
        url: z.string()
      },
      annotations: { readOnlyHint: true, openWorldHint: false, destructiveHint: false }
    },
    async ({ project }) => {
      const token = await installationToken();
      const record = await projectRecord(token, project);
      if (!record?.plan_file) throw Object.assign(new Error('This project has no registered plan file.'), { code: 'PROJECT_PLAN_UNAVAILABLE' });
      const repoPath = resolveRegistryReference(record.plan_file);
      const data = parseJsonFile(await readRepoFile(token, repoPath));
      return jsonToolResult(projectSummary(data, project, 'plan', repoPath));
    }
  );

  server.registerTool(
    'search',
    {
      title: 'Search GPT-Knowledge',
      description: 'Use this when the user needs reusable GPT-Knowledge methods or domain references. Returns deterministic routing results from the existing knowledge index; use fetch for full content.',
      inputSchema: { query: z.string().min(1).max(500) },
      outputSchema: {
        results: z.array(z.object({ id: z.string(), title: z.string(), url: z.string() }))
      },
      annotations: { readOnlyHint: true, openWorldHint: false, destructiveHint: false }
    },
    async ({ query }) => {
      const token = await installationToken();
      const index = parseJsonFile(await readRepoFile(token, KNOWLEDGE_INDEX_PATH));
      const ranked = collectIndexDocuments(index)
        .map(doc => ({ doc, score: scoreDocument(query, doc, index) }))
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score || a.doc.path.localeCompare(b.doc.path))
        .slice(0, 12);
      const results = ranked.map(({ doc }) => ({ id: doc.path, title: titleFromPath(doc.path), url: canonicalUrl(doc.path) }));
      return jsonToolResult({ results });
    }
  );

  server.registerTool(
    'fetch',
    {
      title: 'Fetch GPT-Knowledge document',
      description: 'Use this after search, or with a known canonical GPT-Knowledge path, to retrieve the full text of one knowledge document.',
      inputSchema: { id: z.string().min(1).max(500) },
      outputSchema: {
        id: z.string(),
        title: z.string(),
        text: z.string(),
        url: z.string(),
        metadata: z.record(z.string(), z.unknown()).optional()
      },
      annotations: { readOnlyHint: true, openWorldHint: false, destructiveHint: false }
    },
    async ({ id }) => {
      const token = await installationToken();
      const file = await readRepoFile(token, id);
      const value = {
        id: file.path,
        title: titleFromPath(file.path),
        text: file.text,
        url: canonicalUrl(file.path),
        metadata: { sha: file.sha, repository: REPO, branch: BRANCH }
      };
      return jsonToolResult(value);
    }
  );

  return server;
}

export default async function handler(req, res) {
  if (!['GET', 'POST', 'DELETE'].includes(req.method)) {
    res.setHeader('allow', 'GET, POST, DELETE');
    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
    return;
  }

  const server = await createServer();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  await server.connect(transport);
  try {
    await transport.handleRequest(req, res, req.body);
  } finally {
    await transport.close().catch(() => {});
  }
}
