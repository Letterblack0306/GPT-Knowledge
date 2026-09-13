import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import process from 'node:process';

const root = process.cwd();
const refDir = resolve(root, 'GPT_Ref');
const manifestPath = resolve(refDir, 'agent-references.json');
const humanPath = resolve(refDir, 'GPT_REF.md');

const allowedFiles = new Set(['GPT_REF.md', 'README.md', 'agent-references.json']);
const files = (await readdir(refDir)).sort();
const unexpected = files.filter((name) => !allowedFiles.has(name));
if (unexpected.length) {
  throw new Error(`GPT_Ref contains non-catalogue files: ${unexpected.join(', ')}`);
}

for (const required of allowedFiles) {
  if (!files.includes(required)) throw new Error(`Missing GPT_Ref/${required}`);
}

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
if (manifest.schema_version !== 1) throw new Error('Unsupported GPT_Ref manifest schema_version');
if (!Array.isArray(manifest.references) || manifest.references.length === 0) {
  throw new Error('GPT_Ref manifest must contain references');
}

const human = await readFile(humanPath, 'utf8');
const ids = new Set();
const repos = new Set();
const urls = new Set();

for (const entry of manifest.references) {
  for (const field of ['id', 'name', 'repository', 'url', 'default_branch', 'status', 'adopt', 'avoid']) {
    if (typeof entry[field] !== 'string' || !entry[field].trim()) {
      throw new Error(`Reference ${entry.id || '<unknown>'} missing ${field}`);
    }
  }
  if (!Array.isArray(entry.primary_uses) || entry.primary_uses.length === 0) {
    throw new Error(`Reference ${entry.id} missing primary_uses`);
  }
  if (!Array.isArray(entry.gptk_studies)) {
    throw new Error(`Reference ${entry.id} missing gptk_studies array`);
  }
  if (!/^https:\/\/github\.com\/[^/]+\/[^/]+\/?$/.test(entry.url)) {
    throw new Error(`Reference ${entry.id} has non-canonical GitHub URL: ${entry.url}`);
  }
  if (entry.url !== `https://github.com/${entry.repository}`) {
    throw new Error(`Reference ${entry.id} repository/url mismatch`);
  }
  if (ids.has(entry.id)) throw new Error(`Duplicate reference id: ${entry.id}`);
  if (repos.has(entry.repository.toLowerCase())) throw new Error(`Duplicate repository: ${entry.repository}`);
  if (urls.has(entry.url.toLowerCase())) throw new Error(`Duplicate URL: ${entry.url}`);
  ids.add(entry.id);
  repos.add(entry.repository.toLowerCase());
  urls.add(entry.url.toLowerCase());

  if (!human.includes(entry.url)) {
    throw new Error(`GPT_REF.md does not include ${entry.url}`);
  }
}

const forbiddenHumanMarkers = [
  'project-engineering/projects/brew/',
  'CURRENT_POSITION.md',
  'continuation-gate.json',
  'runtime-health-report',
  'memory export',
];
for (const marker of forbiddenHumanMarkers) {
  if (human.includes(marker)) {
    throw new Error(`GPT_REF.md contains project/status material marker: ${marker}`);
  }
}

console.log(`GPT_Ref catalogue valid: ${manifest.references.length} curated repositories, ${files.length} allowed files.`);
