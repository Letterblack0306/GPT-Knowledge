/* BirdEye project audit/evidence surface for LB Workspace.
 *
 * Render-only. This module never executes commands, never writes plan truth,
 * and only displays repository-backed BirdEye evidence produced locally by:
 *
 *   python birdeye_projection.py export <projectId> --out <snapshot>.json
 *
 * No webhook is used or assumed.
 */
(() => {
  const SNAPSHOT = id => `../birdeye/projections/${encodeURIComponent(id)}.json`;
  const LEVELS = {
    PROVEN: { color: 'var(--green)', label: 'PROVEN' },
    SUPPORTED: { color: 'var(--blue)', label: 'SUPPORTED' },
    UNKNOWN: { color: 'var(--amber)', label: 'UNKNOWN' },
    BLOCKED: { color: 'var(--red)', label: 'BLOCKED' }
  };

  let button;
  let panel;
  let activeProjectId = null;
  let cache = new Map();

  function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function levelBadge(level) {
    const cfg = LEVELS[level] || LEVELS.UNKNOWN;
    return `<span class="be-level" style="border-color:${cfg.color};color:${cfg.color}">${esc(cfg.label)}</span>`;
  }

  function short(sha) {
    return sha ? String(sha).slice(0, 8) : '—';
  }

  function row(label, value) {
    return `<div class="be-row"><span>${esc(label)}</span><b>${value}</b></div>`;
  }

  function listBlock(title, items) {
    if (!items || !items.length) return '';
    return `<div class="be-list"><b>${esc(title)} (${items.length})</b><ul>${items.slice(0, 40).map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>`;
  }

  function setSync(text, mode = '') {
    if (!button) return;
    button.dataset.mode = mode;
    button.textContent = `BirdEye · ${text}`;
  }

  async function loadSnapshot(id) {
    if (cache.has(id)) return cache.get(id);
    try {
      const r = await fetch(`${SNAPSHOT(id)}?v=${Date.now()}`, { cache: 'no-store' });
      if (r.status === 404) {
        const none = { missing: true };
        cache.set(id, none);
        return none;
      }
      if (!r.ok) throw new Error(`status ${r.status}`);
      const data = await r.json();
      cache.set(id, data);
      return data;
    } catch (error) {
      console.warn('[birdeye-ui] snapshot unavailable', error);
      const broken = { broken: true };
      cache.set(id, broken);
      return broken;
    }
  }

  function renderGit(p) {
    const g = p.git || {};
    if (!g.isRepository && !g.workspaceRoot) {
      return row('Workspace root', 'not configured') + row('Evidence', levelBadge(g.evidenceLevel));
    }
    return [
      row('Branch', esc(g.branch ?? '—')),
      row('HEAD', `<code>${esc(short(g.head))}</code>`),
      row('Repository root', esc(g.repositoryRoot ?? g.workspaceRoot ?? '—')),
      row('Upstream', esc(g.upstreamRef ?? 'not tracked')),
      row('Ahead / behind', `${esc(g.ahead ?? 0)} / ${esc(g.behind ?? 0)}`),
      row('Dirty state', g.dirty ? '<span style="color:var(--amber)">DIRTY</span>' : '<span style="color:var(--green)">CLEAN</span>'),
      row('Changed paths', esc(g.changedPathCount ?? 0)),
      row('Staged / modified / untracked',
        `${esc((g.stagedPaths||[]).length)} / ${esc((g.modifiedPaths||[]).length)} / ${esc((g.untrackedPaths||[]).length)}`),
      row('Evidence', levelBadge(g.evidenceLevel))
    ].join('') +
      listBlock('Modified', g.modifiedPaths) +
      listBlock('Untracked', g.untrackedPaths) +
      listBlock('Staged', g.stagedPaths);
  }

    window.__birdEyeInternals = { loadSnapshot, setSync, cache };

  function renderPlan(p) {
    const s = p.planStatus || {};
    const authoritative = s.authoritative === true;
    return [
      row('Plan state', authoritative
        ? '<span style="color:var(--green)">DOCUMENTED_CURRENT</span>'
        : `<span style="color:var(--amber)">${esc(s.planState ?? '—')}</span>`),
      row('Authoritative', authoritative ? 'yes' : 'no'),
      row('Document', esc(s.planDocument ? 'registered' : 'missing')),
      row('Revision', `<code>${esc(s.documentRevision ?? '—')}</code>`),
      row('Last verified', esc(s.lastVerified ?? '—')),
      row('Active gate', esc(s.activeGate ?? '—')),
      row('Next single question', esc(s.nextSingleQuestion ?? '—'))
    ].join('');
  }

  function renderRuntime(p) {
    const r = p.runtime || {};
    if (!r.source) return row('Runtime source', 'not configured') + row('Evidence', levelBadge(r.evidenceLevel));
    return row('Source', esc(r.source)) + row('Evidence', levelBadge(r.evidenceLevel));
  }

  function renderAttribution(p) {
    const a = p.attribution || {};
    return [
      row('Project', esc(a.projectName ?? a.projectId)),
      row('Workspace id', esc(a.workspaceId)),
      row('Repository', esc(a.repository ?? '—')),
      row('Observed at', esc(a.observedAt ?? '—')),
      row('Request id', esc(a.requestId ?? 'direct audit')),
      row('Verdict', esc(p.verdict ?? '—'))
    ].join('');
  }

  function renderPanel(id) {
    if (!panel) return;
    if (!id) {
      panel.innerHTML = '<div class="be-card"><p>Select a mapped project to inspect its BirdEye evidence.</p></div>';
      return;
    }
    const p = cache.get(id);
    if (!p) { panel.innerHTML = '<div class="be-card"><p>Loading…</p></div>'; return; }
    if (p.missing) {
      setSync('NO EVIDENCE', '');
      panel.innerHTML = `<div class="be-card"><p>No repository-backed BirdEye snapshot exists for <b>${esc(id)}</b>.</p>
        <p class="be-note">Generate it locally:<br><code>python birdeye_projection.py export ${esc(id)}</code></p></div>`;
      return;
    }
    if (p.broken) {
      setSync('SYNC UNKNOWN', 'error');
      panel.innerHTML = '<div class="be-card"><p>BirdEye evidence could not be loaded.</p></div>';
      return;
    }
    setSync('REPO STATE', 'ok');
    const verdictTone = p.verdict === 'PASS' ? 'var(--green)' : p.verdict === 'FAIL' ? 'var(--red)' : 'var(--amber)';
    panel.innerHTML = `
      <div class="be-head">
        <div><b>BirdEye</b><span>Centralised audit + evidence surface</span></div>
        <span class="badge" style="border-color:${verdictTone};color:${verdictTone}">${esc(p.verdict)}</span>
        ${levelBadge((p.git||{}).evidenceLevel)}
      </div>
      <div class="be-grid">
        <section><h3>Attribution</h3>${renderAttribution(p)}</section>
        <section><h3>Git audit</h3>${renderGit(p)}</section>
        <section><h3>Plan / status</h3>${renderPlan(p)}</section>
        <section><h3>Runtime / validation</h3>${renderRuntime(p)}</section>
      </div>
      <p class="be-note">Read-only projection. The project repository remains the authority; no webhook is used.</p>`;
  }

  async function refresh() {
    const id = window.active || activeProjectId
      || (document.querySelector('.project.active') ? location.hash.slice(1) : null);
    if (!id) { renderPanel(null); return; }
    activeProjectId = id;
    setSync('LOADING…', '');
    await loadSnapshot(id);
    renderPanel(id);
  }

  function openPanel() {
    panel.classList.toggle('open');
    refresh();
  }

  function installUi() {
    const badges = document.querySelector('.top .badges');
    if (!badges || document.getElementById('birdEyeToggle')) return;

    button = document.createElement('button');
    button.className = 'top-action';
    button.id = 'birdEyeToggle';
    button.textContent = 'BirdEye';
    button.onclick = openPanel;

    panel = document.createElement('aside');
    panel.className = 'be-panel';
    panel.id = 'birdEyePanel';

    badges.insertBefore(button, badges.firstChild);
    document.body.appendChild(panel);

    renderPanel(null);

    if (typeof window.selectProject === 'function' || typeof window.select === 'function') {
      const original = window.selectProject || window.select;
      const patched = function patchedSelect(id) {
        activeProjectId = id;
        const result = original(id);
        Promise.resolve(result).finally(refresh);
        return result;
      };
      if (window.selectProject) window.selectProject = patched; else window.select = patched;
    }
    refresh();
  }

  function boot() {
    injectStyles();
    installUi();
  }

  function injectStyles() {
    if (document.getElementById('birdeye-ui-styles')) return;
    const style = document.createElement('style');
    style.id = 'birdeye-ui-styles';
    style.textContent = `
#birdEyeToggle{border:1px solid var(--line);background:#121923;color:#c8dcff;border-radius:999px;padding:5px 11px;font-size:10px;cursor:pointer}
#birdEyeToggle[data-mode=ok]{border-color:var(--green);color:var(--green)}
#birdEyeToggle[data-mode=error]{border-color:var(--red);color:var(--red)}
.be-panel{position:fixed;top:70px;right:-560px;width:520px;max-width:92vw;bottom:0;background:var(--panel);border-left:1px solid var(--line);padding:16px;overflow:auto;z-index:40;transition:right .2s ease}
.be-panel.open{right:0}
.be-head{display:flex;align-items:center;gap:10px;margin-bottom:14px}
.be-head b{display:block;font-size:14px}
.be-head span{display:block;color:var(--muted);font-size:10px}
.be-grid{display:flex;flex-direction:column;gap:12px}
.be-grid section{border:1px solid var(--line);border-radius:10px;padding:10px 12px;background:var(--panel2)}
.be-grid h3{margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}
.be-row{display:flex;justify-content:space-between;gap:10px;padding:3px 0;font-size:11px;border-bottom:1px dashed #1c2431}
.be-row:last-child{border-bottom:none}
.be-row span{color:var(--muted)}
.be-row b{text-align:right;font-weight:500;word-break:break-word}
.be-level{border:1px solid var(--line);border-radius:999px;padding:2px 7px;font-size:9px;margin-left:auto}
.be-list{margin-top:8px;font-size:10px}
.be-list b{color:var(--muted);font-size:9px;text-transform:uppercase}
.be-list ul{margin:4px 0 0;padding-left:16px;color:#aeb8c4}
.be-note{color:var(--muted);font-size:10px;margin-top:12px}
.be-note code{background:#0a0d12;border:1px solid var(--line);border-radius:6px;padding:1px 5px;font-size:10px}
.be-card{border:1px solid var(--line);border-radius:10px;padding:12px;font-size:11px}`;
    document.head.appendChild(style);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();