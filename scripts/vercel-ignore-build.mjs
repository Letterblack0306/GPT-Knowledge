import { readFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const previous = process.env.VERCEL_GIT_PREVIOUS_SHA;
if (!previous || /^0+$/.test(previous)) {
  console.log('No previous successful deployment SHA; build required.');
  process.exit(1);
}

let changed;
try {
  changed = execFileSync('git', ['diff', '--name-only', previous, 'HEAD'], { encoding: 'utf8' })
    .split(/\r?\n/)
    .map(x => x.trim())
    .filter(Boolean);
} catch (error) {
  console.log('Unable to determine changed files; build required.');
  process.exit(1);
}

const alwaysRelevant = [
  'vercel.json',
  'package.json',
  'package-lock.json',
  'scripts/build-vercel-static.mjs',
  'scripts/vercel-ignore-build.mjs'
];
const relevantPrefixes = [
  'api/',
  'project-engineering/projects/workspace/'
];

const registryPath = resolve('project-engineering/projects/workspace/projects.json');
const registry = JSON.parse(await readFile(registryPath, 'utf8'));
const workspaceRoot = resolve('project-engineering/projects/workspace');
const referenced = new Set();
for (const project of registry.projects ?? []) {
  for (const field of ['plan_file', 'status_file', 'references_file', 'reference']) {
    const value = project?.[field];
    if (typeof value !== 'string' || !value.trim()) continue;
    referenced.add(relative(process.cwd(), resolve(workspaceRoot, value)).replaceAll('\\', '/'));
  }
}

const shouldBuild = changed.some(file =>
  alwaysRelevant.includes(file) ||
  relevantPrefixes.some(prefix => file.startsWith(prefix)) ||
  referenced.has(file)
);

if (shouldBuild) {
  console.log('Workspace deployment inputs changed; build required.');
  process.exit(1);
}

console.log('No workspace deployment inputs changed; skipping Vercel build.');
process.exit(0);
