import { cp, mkdir, rm, writeFile } from 'node:fs/promises';

const out = new URL('../public/', import.meta.url);
const source = new URL('../project-engineering/', import.meta.url);

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(source, new URL('./project-engineering/', out), { recursive: true });

// The workspace now reads plan/status JSON directly from the deployed repository
// projection. Do not inject the legacy repo-sync.js adapter: it depends on the
// previous localStorage UI contract and would create a second, stale state path.
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

await writeFile(new URL('./index.html', out), rootIndex, 'utf8');
