import { copyFile, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, extname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const repoRoot = fileURLToPath(new URL('../', import.meta.url));
const out = resolve(repoRoot, 'public');
const rawRoot = resolve(out, 'raw');
const externalRoot = resolve(repoRoot, '.external-src');

const allowedExtensions = new Set([
  '.md', '.txt', '.json', '.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.py',
  '.html', '.css', '.yml', '.yaml', '.toml', '.ini', '.cfg', '.sh', '.ps1',
  '.bat', '.rs', '.go', '.java', '.c', '.h', '.cpp', '.hpp', '.xml', '.sql'
]);

const excludedDirectories = new Set([
  '.git', '.vercel', '.external-src', 'node_modules', 'public', 'release', 'dist',
  'build', 'coverage', '.cache'
]);

const excludedFiles = new Set(['package-lock.json']);
const sensitivePathParts = [
  /(^|\/).env(?:\.|$)/i,
  /(^|\/)secrets?(\/|$)/i,
  /(^|\/)credentials?(\/|$)/i,
  /(^|\/)private[-_.]?keys?(\/|$)/i,
  /(^|\/)id_rsa(?:\.|$)/i,
  /(^|\/)id_ed25519(?:\.|$)/i
];

const sensitiveContentPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bgithub_pat_[A-Za-z0-9_]{20,}\b/,
  /\bghp_[A-Za-z0-9]{20,}\b/,
  /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/,
  /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/
];

const maxFileBytes = 2 * 1024 * 1024;

function webPath(path) {
  return path.split(sep).join('/');
}

function languageFor(path) {
  const ext = extname(path).toLowerCase();
  return ({
    '.py': 'python', '.js': 'javascript', '.mjs': 'javascript', '.cjs': 'javascript',
    '.ts': 'typescript', '.tsx': 'tsx', '.jsx': 'jsx', '.json': 'json',
    '.md': 'markdown', '.html': 'html', '.css': 'css', '.yml': 'yaml', '.yaml': 'yaml',
    '.sh': 'shell', '.ps1': 'powershell', '.rs': 'rust', '.go': 'go', '.sql': 'sql'
  })[ext] || 'text';
}

function isSensitivePath(path) {
  return sensitivePathParts.some(pattern => pattern.test(path));
}

async function isSensitiveContent(path) {
  try {
    const text = await readFile(path, 'utf8');
    return sensitiveContentPatterns.some(pattern => pattern.test(text));
  } catch {
    return true;
  }
}

async function collectTextFiles(dir, files = [], baseDir = dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && excludedDirectories.has(entry.name)) continue;
    const full = resolve(dir, entry.name);

    if (entry.isDirectory()) {
      await collectTextFiles(full, files, baseDir);
      continue;
    }

    if (!entry.isFile() || excludedFiles.has(entry.name)) continue;

    const rel = webPath(relative(baseDir, full));
    if (isSensitivePath(rel)) continue;

    const ext = extname(entry.name).toLowerCase();
    if (!allowedExtensions.has(ext)) continue;

    const info = await stat(full);
    if (info.size > maxFileBytes) continue;
    if (await isSensitiveContent(full)) continue;

    files.push({ full, size: info.size, rel });
  }

  return files;
}

async function downloadPrivateRepo(owner, repo, ref, destination) {
  const token = process.env.GITHUB_TOKEN?.trim();
  if (!token) {
    return { ok: false, reason: 'GITHUB_TOKEN_NOT_SET' };
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/tarball/${encodeURIComponent(ref)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'gpt-k-readonly-builder',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      redirect: 'follow'
    }
  );

  if (!response.ok) {
    return { ok: false, reason: `GITHUB_HTTP_${response.status}` };
  }

  await rm(destination, { recursive: true, force: true });
  await mkdir(destination, { recursive: true });

  const archive = resolve(externalRoot, `${repo}.tar.gz`);
  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(archive, bytes);
  await execFileAsync('tar', ['-xzf', archive, '-C', destination, '--strip-components=1']);
  await rm(archive, { force: true });

  return { ok: true };
}

async function publishFile(item, exposedPath, sourceRepo, catalog) {
  const destination = resolve(rawRoot, ...exposedPath.split('/'));
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(item.full, destination);

  catalog.push({
    repository: sourceRepo,
    path: exposedPath,
    source_path: item.rel,
    raw: '/raw/' + exposedPath.split('/').map(encodeURIComponent).join('/'),
    language: languageFor(item.rel),
    bytes: item.size
  });
}

await rm(out, { recursive: true, force: true });
await rm(externalRoot, { recursive: true, force: true });
await mkdir(rawRoot, { recursive: true });
await mkdir(externalRoot, { recursive: true });

const catalog = [];
const sources = [];

const gptkFiles = await collectTextFiles(repoRoot, [], repoRoot);
for (const item of gptkFiles) {
  await publishFile(item, item.rel, 'Letterblack0306/GPT-Knowledge', catalog);
}

sources.push({
  repository: 'Letterblack0306/GPT-Knowledge',
  status: 'included',
  files: gptkFiles.length
});

const brewDir = resolve(externalRoot, 'brew');
const brewFetch = await downloadPrivateRepo('Letterblack0306', 'brew', 'main', brewDir);

if (brewFetch.ok) {
  const brewFiles = await collectTextFiles(brewDir, [], brewDir);

  for (const item of brewFiles) {
    await publishFile(
      item,
      `repos/brew/${item.rel}`,
      'Letterblack0306/brew',
      catalog
    );
  }

  sources.push({
    repository: 'Letterblack0306/brew',
    status: 'included',
    files: brewFiles.length
  });
} else {
  sources.push({
    repository: 'Letterblack0306/brew',
    status: 'skipped',
    reason: brewFetch.reason,
    files: 0
  });
}

catalog.sort((a, b) => a.path.localeCompare(b.path));

await writeFile(resolve(out, 'catalog.json'), JSON.stringify({
  mode: 'read-only',
  generated_at: new Date().toISOString(),
  sources,
  files: catalog
}, null, 2) + '\n', 'utf8');

const html = String.raw`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>GPT-K · Read-only Source</title>
<style>
:root{color-scheme:dark;--bg:#0d0f12;--panel:#13161b;--line:#272c35;--muted:#8f98a7;--text:#eef1f5;--accent:#b9c6d8}
*{box-sizing:border-box}html,body{height:100%;margin:0}body{font:14px/1.45 ui-monospace,SFMono-Regular,Consolas,"Liberation Mono",monospace;background:var(--bg);color:var(--text)}
.shell{height:100%;display:grid;grid-template-columns:minmax(260px,350px) 1fr}
.sidebar{border-right:1px solid var(--line);background:var(--panel);display:flex;flex-direction:column;min-height:0}
.brand{padding:16px;border-bottom:1px solid var(--line)}.brand strong{display:block;font-size:15px}.brand span{color:var(--muted);font-size:12px}
.search{padding:12px;border-bottom:1px solid var(--line)}input{width:100%;padding:9px 10px;background:#0b0d10;color:var(--text);border:1px solid var(--line);border-radius:6px;outline:none}
.files{overflow:auto;padding:6px}.group-label{padding:10px 8px 4px;color:#7f8998;font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase}.file{display:block;width:100%;border:0;background:transparent;color:#cfd5de;text-align:left;padding:7px 8px;border-radius:5px;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font:inherit}.file:hover,.file.active{background:#20252d;color:#fff}
.main{min-width:0;display:flex;flex-direction:column;min-height:0}.top{min-height:58px;padding:11px 16px;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:14px}.path{min-width:0;flex:1}.path strong{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.meta{color:var(--muted);font-size:12px}
.raw{color:var(--accent);text-decoration:none;border:1px solid var(--line);border-radius:6px;padding:7px 9px;white-space:nowrap}.raw[aria-disabled="true"]{visibility:hidden}
.viewer{overflow:auto;flex:1}.code{margin:0;padding:16px 0;counter-reset:line;min-width:max-content}.line{display:block;padding:0 18px 0 70px;position:relative;white-space:pre}.line:before{counter-increment:line;content:counter(line);position:absolute;left:0;width:54px;text-align:right;color:#5f6977;user-select:none}.empty{padding:24px;color:var(--muted)}
@media(max-width:760px){.shell{grid-template-columns:1fr}.sidebar{height:40vh;border-right:0;border-bottom:1px solid var(--line)}}
</style>
</head>
<body>
<div class="shell">
  <aside class="sidebar">
    <div class="brand"><strong>GPT-K Source</strong><span>READ ONLY · GPT-K + Brew source projection</span></div>
    <div class="search"><input id="search" type="search" placeholder="Filter files…" autocomplete="off"></div>
    <div id="files" class="files" aria-label="Source files"></div>
  </aside>
  <main class="main">
    <header class="top">
      <div class="path"><strong id="path">Select a file</strong><span id="meta" class="meta">No execution, editing, upload, save, or mutation controls are exposed.</span></div>
      <a id="raw" class="raw" aria-disabled="true" target="_blank" rel="noopener">Raw text</a>
    </header>
    <div class="viewer"><pre id="code" class="code"><span class="empty">Choose a source file from the left.</span></pre></div>
  </main>
</div>
<script>
const filesEl=document.getElementById('files');
const searchEl=document.getElementById('search');
const pathEl=document.getElementById('path');
const metaEl=document.getElementById('meta');
const rawEl=document.getElementById('raw');
const codeEl=document.getElementById('code');
let catalog=[];let selected='';

function formatBytes(n){if(n<1024)return n+' B';if(n<1048576)return (n/1024).toFixed(1)+' KB';return (n/1048576).toFixed(1)+' MB'}
function groupFor(file){
  if(file.path.startsWith('GPT_Ref/'))return 'GPT Reference (GPT_Ref)';
  if(!file.path.includes('/'))return 'GPT-K Root';
  return file.path.split('/',1)[0];
}
function renderList(){
  const q=searchEl.value.trim().toLowerCase();
  const visible=catalog.filter(f=>!q||f.path.toLowerCase().includes(q)||(f.repository||'').toLowerCase().includes(q));
  const groups=new Map();
  for(const f of visible){const g=groupFor(f);if(!groups.has(g))groups.set(g,[]);groups.get(g).push(f)}
  const ordered=[...groups.entries()].sort(([a],[b])=>a==='GPT Reference (GPT_Ref)'?-1:b==='GPT Reference (GPT_Ref)'?1:a.localeCompare(b));
  const nodes=[];
  for(const [group,items] of ordered){
    const label=document.createElement('div');label.className='group-label';label.textContent=group;nodes.push(label);
    for(const f of items){const b=document.createElement('button');b.className='file'+(f.path===selected?' active':'');b.type='button';b.textContent=f.path;b.title=(f.repository?f.repository+' · ':'')+f.path;b.onclick=()=>openFile(f);nodes.push(b)}
  }
  filesEl.replaceChildren(...nodes);
}
async function openFile(file,push=true){
  selected=file.path;renderList();pathEl.textContent=file.path;metaEl.textContent=(file.repository||'source')+' · '+file.language+' · '+formatBytes(file.bytes);
  rawEl.href=file.raw;rawEl.setAttribute('aria-disabled','false');codeEl.textContent='Loading…';
  try{
    const r=await fetch(file.raw,{cache:'no-store'});if(!r.ok)throw new Error('HTTP '+r.status);
    const text=await r.text();const lines=text.replace(/\r\n/g,'\n').split('\n');
    codeEl.replaceChildren(...lines.map(line=>{const s=document.createElement('span');s.className='line';s.textContent=line||' ';return s}));
    if(push){const u=new URL(location.href);u.searchParams.set('file',file.path);history.replaceState(null,'',u)}
  }catch(err){codeEl.textContent='Unable to read '+file.path+': '+err.message}
}
searchEl.addEventListener('input',renderList);
fetch('/catalog.json',{cache:'no-store'}).then(r=>r.json()).then(data=>{
  catalog=Array.isArray(data.files)?data.files:[];renderList();
  const requested=new URL(location.href).searchParams.get('file');
  const initial=catalog.find(f=>f.path===requested)||catalog.find(f=>f.path==='GPT_Ref/GPT_REF.md')||catalog.find(f=>f.path==='000_START_HERE.md')||catalog[0];
  if(initial)openFile(initial,false);
}).catch(err=>{filesEl.textContent='Catalog unavailable: '+err.message});
</script>
</body>
</html>`;

await writeFile(resolve(out, 'index.html'), html + '\n', 'utf8');

const sourceSummary = sources.map(source =>
  `${source.repository}=${source.status}:${source.files}${source.reason ? ':' + source.reason : ''}`
).join(' | ');

console.log(`Published ${catalog.length} read-only source files. ${sourceSummary}`);
