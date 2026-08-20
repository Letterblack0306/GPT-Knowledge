import { cp, mkdir, rm } from 'node:fs/promises';

const out = new URL('../public/', import.meta.url);
const source = new URL('../project-engineering/', import.meta.url);

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(source, new URL('./project-engineering/', out), { recursive: true });
