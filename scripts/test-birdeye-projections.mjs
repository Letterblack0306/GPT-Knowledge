import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve, relative, isAbsolute } from 'node:path';

// Focused validation: BirdEye deployment projection chain.
// 1. source projection exists (project-engineering/projects/birdeye/projections)
// 2. build output exists (public/project-engineering/projects/birdeye/projections)
// 3. public copy is byte-identical to the source copy
// 4. deployed-relative path matches what birdeye-ui.js actually fetches

import { fileURLToPath } from 'node:url';
const repoRoot = fileURLToPath(new URL('../', import.meta.url));
const pe = (...p) => resolve(repoRoot, 'project-engineering', ...p);
const pub = (...p) => resolve(repoRoot, 'public', ...p);

const ids = ['access-browser-agent', 'lbe', 'looptool'];
const sha256 = buf => createHash('sha256').update(buf).digest('hex');
let failed = false;
const check = (ok, label) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${label}`);
  if (!ok) failed = true;
};

const uiSource = await readFile(pe('projects/workspace/birdeye-ui.js'), 'utf8');
const snapshotMatch = uiSource.match(/SNAPSHOT\s*=\s*id\s*=>\s*`([^`]+)`/);
check(Boolean(snapshotMatch), 'birdeye-ui.js declares a SNAPSHOT path template');

for (const id of ids) {
  const relFromWorkspace = snapshotMatch[1].replace('${encodeURIComponent(id)}', encodeURIComponent(id));
  // Deployed-relative path: birdeye-ui.js is served from
  // /project-engineering/projects/workspace/, so ../birdeye/... resolves to
  // public/project-engineering/projects/birdeye/projections/<id>.json
  const expectedPublicPath = pub('project-engineering/projects/workspace', relFromWorkspace);
  const sourceBuf = await readFile(pe('projects/birdeye/projections', `${id}.json`));
  const publicBuf = await readFile(expectedPublicPath);
  check(sha256(sourceBuf) === sha256(publicBuf),
    `${id}: public copy byte-identical to tracked source at ${relative(repoRoot, expectedPublicPath)}`);
  JSON.parse(publicBuf.toString('utf8'));
  check(true, `${id}: public copy parses as valid JSON`);
}

if (failed) {
  console.error('BirdEye projection validation FAILED');
  process.exit(1);
}
console.log('BirdEye projection validation PASSED');
