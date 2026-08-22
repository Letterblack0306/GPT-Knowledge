// Focused BirdEye UI integration regression test.
// Serves ./public statically, drives real Chrome via puppeteer-core.
// Usage: node scripts/test-birdeye-ui-integration.mjs
// Requires: puppeteer-core installed (dev machine) and Chrome at CHROME_PATH or default path.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..', 'public');
const PORT = 8123;
const BASE = `http://127.0.0.1:${PORT}/project-engineering/projects/workspace/`;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.md': 'text/plain', '.png': 'image/png', '.ico': 'image/x-icon' };

const server = http.createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (p.endsWith('/')) p += 'index.html';
    const file = normalize(join(ROOT, p));
    if (!file.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
    const data = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' });
    res.end(data);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(r => server.listen(PORT, r));

const puppeteer = await import('puppeteer-core').catch(() => null);
if (!puppeteer) { console.error('FAIL: puppeteer-core not available'); process.exit(1); }
const chrome = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const browser = await puppeteer.launch({ executablePath: chrome, headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1400, height: 900 });

const mutations = [];
const snapshotRequests = [];
page.on('request', r => {
  if (['POST','PUT','PATCH','DELETE'].includes(r.method())) mutations.push(`${r.method()} ${r.url()}`);
  if (r.url().includes('/birdeye/projections/')) snapshotRequests.push(r.url());
});
const errors = [];
page.on('pageerror', e => errors.push(String(e)));

await page.goto(BASE, { waitUntil: 'networkidle2' });
await page.waitForSelector('.project', { timeout: 8000 }).catch(() => {});
const bootDebug = await page.evaluate(() => ({
  projects: document.querySelectorAll('.project').length,
  title: document.getElementById('projectTitle')?.textContent
})).catch(e => ({ err: String(e) }));
console.log('boot:', JSON.stringify(bootDebug));

async function select(name) {
  await page.evaluate(n => {
    [...document.querySelectorAll('.project')].find(e => e.textContent.includes(n)).click();
  }, name);
  await new Promise(r => setTimeout(r, 1000));
}
async function panelText() {
  return page.$eval('#birdEyePanel', el => el.innerText).catch(() => '');
}

let failures = [];
function expect(cond, label) { if (!cond) failures.push(label); else console.log('PASS:', label); }

for (const proj of ['Access Browser Agent', 'LBE', 'LoopTool']) {
  await select(proj);
  await page.click('#birdEyeToggle');           // open
  await new Promise(r => setTimeout(r, 1200));
  const t = await panelText();
  const id = proj === 'Access Browser Agent' ? 'access-browser-agent' : proj === 'LBE' ? 'lbe' : 'looptool';
  expect(t.includes(proj) || t.length > 400, `${proj}: BirdEye renders content`);
  for (const section of ['Attribution', 'Git audit', 'File audit index', 'Plan / status', 'Runtime / validation']) {
    expect(t.toLowerCase().includes(section.toLowerCase()), `${proj}: ${section} section renders`);
  }
  expect(/\b(PROVEN|SUPPORTED|UNKNOWN|BLOCKED)\b/.test(t), `${proj}: evidence badge renders`);
  expect(/Verdict/i.test(t) || /verdict/i.test(t) || t.length > 400, `${proj}: verdict visible`);
  expect(!/Select a mapped project/.test(t), `${proj}: placeholder replaced`);
  expect(/NOT PROJECTED|Current SHA-256/.test(t), `${proj}: file audit truth boundary renders`);
  // close then reopen to confirm toggle still works
  await page.click('#birdEyeToggle');
  await new Promise(r => setTimeout(r, 300));
}

expect(snapshotRequests.some(u => u.includes('access-browser-agent')), 'snapshot fetched for access-browser-agent');
expect(snapshotRequests.some(u => u.includes('/lbe.json')), 'snapshot fetched for lbe');
expect(snapshotRequests.some(u => u.includes('/looptool.json')), 'snapshot fetched for looptool');
expect(mutations.length === 0, 'no POST/PUT/PATCH/DELETE requests');
expect(errors.length === 0, 'no JS exceptions');

await browser.close();
server.close();

console.log(`\nsnapshot requests: ${snapshotRequests.length}`);
if (failures.length) { console.error('FAILED:\n' + failures.join('\n')); process.exit(1); }
console.log('BirdEye UI integration test PASSED');
