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
  if (!routingText.includes(normalized)) {
    missing.push(rel);
  }
}

if (missing.length > 0) {
  console.error('ROUTING_INTEGRITY_FAIL');
  console.error('The following required route targets are not referenced by any documented routing surface:');
  for (const rel of missing) console.error(`- ${rel}`);
  process.exit(1);
}

console.log(`ROUTING_INTEGRITY_PASS required=${required.length} surfaces=${ROUTING_SURFACES.length}`);
