import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { posix as path } from 'node:path';

const repoRoot = process.cwd();

const ROUTING_SURFACES = [
  'README.md',
  '000_START_HERE.md',
  'INDEX.md',
  'knowledge-index.json',
  'knowledge-sections.json',
  'skills/INDEX.md',
];

const NON_DOMAIN_ROOTS = new Set(['GPT_Ref']);

function trackedFiles() {
  return execFileSync('git', ['ls-files'], {
    cwd: repoRoot,
    encoding: 'utf8',
  })
    .split(/\r?\n/)
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => value.replaceAll('\\', '/'));
}

function readText(rel) {
  return readFileSync(path.join(repoRoot.replaceAll('\\', '/'), rel), 'utf8');
}

function isRequiredRouteTarget(rel) {
  if (/^\d{3}_[^/]+\.md$/i.test(rel) && rel !== '000_START_HERE.md') {
    return true;
  }

  return /^skills\/[^/]+\/SKILL\.md$/i.test(rel);
}

function normalizeReference(value) {
  return String(value)
    .replaceAll('\\', '/')
    .replace(/^\.\//, '')
    .split('#', 1)[0]
    .split('?', 1)[0];
}

function documentedKnowledgeDomains(readme) {
  const heading = '## Current knowledge domains';
  const start = readme.indexOf(heading);
  if (start < 0) throw new Error(`README missing heading: ${heading}`);

  const section = readme.slice(start + heading.length).split(/\n##\s+/, 1)[0];
  const domains = [];

  for (const match of section.matchAll(/^- `([^`/]+)\/`\s+—/gm)) {
    const root = match[1];
    if (!NON_DOMAIN_ROOTS.has(root)) domains.push(root);
  }

  if (domains.length === 0) {
    throw new Error('README Current knowledge domains section contains no routable domains');
  }

  return [...new Set(domains)].sort();
}

const files = trackedFiles();
const fileSet = new Set(files);

for (const surface of ROUTING_SURFACES) {
  if (!fileSet.has(surface)) {
    throw new Error(`routing surface missing: ${surface}`);
  }
}

const routingText = ROUTING_SURFACES
  .map((surface) => `\n# ${surface}\n${readText(surface)}`)
  .join('\n')
  .replaceAll('\\', '/');

const required = files.filter(isRequiredRouteTarget).sort();
const missing = [];

for (const rel of required) {
  const normalized = normalizeReference(rel);
  if (!routingText.includes(normalized)) missing.push(rel);
}

const knowledgeIndex = JSON.parse(readText('knowledge-index.json'));
const domainManifest = knowledgeIndex?.domains;
if (!domainManifest || typeof domainManifest !== 'object' || Array.isArray(domainManifest)) {
  throw new Error('knowledge-index.json must contain a domains object');
}

const readmeDomains = documentedKnowledgeDomains(readText('README.md'));
const domainErrors = [];
let canonicalTargetCount = 0;

for (const domain of readmeDomains) {
  const entry = domainManifest[domain];
  if (!entry || typeof entry !== 'object') {
    domainErrors.push(`${domain}: missing from knowledge-index.json domains`);
    continue;
  }

  const canonical = Array.isArray(entry.canonical) ? entry.canonical : [];
  if (canonical.length === 0) {
    domainErrors.push(`${domain}: canonical route is empty`);
    continue;
  }

  for (const rawTarget of canonical) {
    const target = normalizeReference(rawTarget);
    canonicalTargetCount += 1;

    if (!target) {
      domainErrors.push(`${domain}: canonical target is empty`);
      continue;
    }

    if (!fileSet.has(target)) {
      domainErrors.push(`${domain}: canonical target is not a tracked file: ${target}`);
      continue;
    }

    if (!target.startsWith(`${domain}/`)) {
      domainErrors.push(`${domain}: canonical target escapes its domain root: ${target}`);
    }

    if (target.includes('/studies/')) {
      domainErrors.push(`${domain}: research study cannot be the canonical domain entry: ${target}`);
    }
  }
}

if (missing.length > 0 || domainErrors.length > 0) {
  console.error('ROUTING_INTEGRITY_FAIL');

  if (missing.length > 0) {
    console.error('Required route targets not referenced by a documented routing surface:');
    for (const rel of missing) console.error(`- ${rel}`);
  }

  if (domainErrors.length > 0) {
    console.error('Canonical domain routing errors:');
    for (const error of domainErrors) console.error(`- ${error}`);
  }

  process.exit(1);
}

console.log(
  `ROUTING_INTEGRITY_PASS required=${required.length} domains=${readmeDomains.length} canonicalTargets=${canonicalTargetCount} surfaces=${ROUTING_SURFACES.length}`,
);
