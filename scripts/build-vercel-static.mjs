import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('../', import.meta.url));
const out = resolve(repoRoot, 'public');
const projectEngineeringRoot = resolve(repoRoot, 'project-engineering');
const workspaceRoot = resolve(projectEngineeringRoot, 'projects/workspace');
const outProjectEngineeringRoot = resolve(out, 'project-engineering');
const outWorkspaceRoot = resolve(outProjectEngineeringRoot, 'projects/workspace');

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

// Publish the workspace application itself.
await cp(workspaceRoot, outWorkspaceRoot, { recursive: true });

// Publish the BirdEye projection snapshots fetched by birdeye-ui.js via
// `../birdeye/projections/<projectId>.json` relative to the workspace root.
const birdeyeProjectionsSource = resolve(projectEngineeringRoot, 'projects/birdeye/projections');
const birdeyeProjectionsOut = resolve(outProjectEngineeringRoot, 'projects/birdeye/projections');
await mkdir(birdeyeProjectionsOut, { recursive: true });
for (const entry of await readdir(birdeyeProjectionsSource)) {
  if (!entry.endsWith('.json')) continue;
  await cp(resolve(birdeyeProjectionsSource, entry), resolve(birdeyeProjectionsOut, entry));
}

// Publish only repository files explicitly referenced by the workspace registry.
// This keeps Vercel a projection of workspace-relevant evidence instead of a
// mirror of the whole project-engineering knowledge tree.
const registry = JSON.parse(await readFile(resolve(workspaceRoot, 'projects.json'), 'utf8'));
const referenceFields = ['plan_file', 'status_file', 'references_file', 'reference', 'canvas_file'];
const copied = new Set();

for (const project of registry.projects ?? []) {
  for (const field of referenceFields) {
    const value = project?.[field];
    if (typeof value !== 'string' || !value.trim()) continue;

    const source = resolve(workspaceRoot, value);
    const rel = relative(projectEngineeringRoot, source);
    if (!rel || rel.startsWith('..') || isAbsolute(rel)) {
      throw new Error(`Workspace reference escapes project-engineering: ${value}`);
    }
    if (copied.has(rel)) continue;

    const destination = resolve(outProjectEngineeringRoot, rel);
    await mkdir(dirname(destination), { recursive: true });
    await cp(source, destination, { recursive: true });
    copied.add(rel);
  }
}

const rootIndex = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="refresh" content="0;url=/project-engineering/projects/workspace/">
<title>Letterblack Project Workspace</title>
<script>location.replace('/project-engineering/projects/workspace/')</script>
</head>
<body><a href="/project-engineering/projects/workspace/">Open Letterblack Project Workspace</a></body>
</html>\n`;

await writeFile(resolve(out, 'index.html'), rootIndex, 'utf8');
