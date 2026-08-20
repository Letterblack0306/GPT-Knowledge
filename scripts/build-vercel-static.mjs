import { cp, mkdir, rm, readFile, writeFile } from 'node:fs/promises';

const out = new URL('../public/', import.meta.url);
const source = new URL('../project-engineering/', import.meta.url);

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(source, new URL('./project-engineering/', out), { recursive: true });

const workspaceHtml = new URL('./project-engineering/projects/workspace/index.html', out);
let html = await readFile(workspaceHtml, 'utf8');
const syncTag = '<script src="./repo-sync.js"></script>';
if (!html.includes(syncTag)) {
  html = html.replace('</body>', `${syncTag}\n</body>`);
  await writeFile(workspaceHtml, html, 'utf8');
}
