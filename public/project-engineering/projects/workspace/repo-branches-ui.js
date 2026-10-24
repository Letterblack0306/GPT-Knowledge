/* Repo-branches panel for LB Workspace — additive only.
 *
 * Repurposes the right-hand "status" column into a collapsible "Repo branches"
 * canvas: one branch row per registered project, reading each project's
 * source_repo / source_branch / source_head / verified_at from its status.json.
 * The panel can be folded to a slim tab and unfolded again (persisted).
 *
 * Rendering only. Reads the top-level registry / currentProject / currentStatus
 * that the inline bootstrap exposes in the shared global scope.
 */
(() => {
  const COLLAPSE_KEY = 'lb-repo-branches-collapsed';

  const appEl = () => document.querySelector('.app');
  const branchList = () => document.getElementById('branchList');
  const toggleBtn = () => document.getElementById('branchToggle');

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const sh = sha => sha ? String(sha).slice(0, 8) : '—';
  const projects = () => (typeof registry !== 'undefined' && registry && registry.projects) || [];
  const activeId = () => {
    try { if (currentProject && currentProject.id) return currentProject.id; } catch (_) {}
    return null;
  };

  const style = () => {
    if (document.getElementById('lbBranchesCss')) return;
    const st = document.createElement('style');
    st.id = 'lbBranchesCss';
    st.textContent = [
      '.app{grid-template-columns:230px 1fr var(--status-w,340px)}',
      '.status{padding:18px 14px;overflow:hidden;transition:min-width .18s ease,width .18s ease}',
      '.status-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px}',
      '.status-head h2{margin:0;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);font-weight:800}',
      '#branchToggle{border:1px solid #2f3c4c;background:#121923;color:#bcd5ff;border-radius:8px;padding:4px 9px;font-size:12px;line-height:1;cursor:pointer;flex:none}',
      '#branchToggle:hover{border-color:#526f9b}',
      '.app.status-collapsed{--status-w:32px}',
      '.app.status-collapsed .status{width:32px;padding:0}',
      '.app.status-collapsed .status-head{justify-content:center;padding:8px 0}',
      '.app.status-collapsed .status-head h2,.app.status-collapsed .status>.sub,.app.status-collapsed #statusContent{display:none}',
      '.app.status-collapsed #branchToggle{writing-mode:vertical-lr;transform:rotate(180deg);padding:8px 4px;letter-spacing:.12em;border-radius:6px}',
      '.branch{border:1px solid var(--line);border-radius:10px;background:var(--panel2);padding:9px 11px;margin-bottom:9px;box-shadow:0 4px 14px #0004}',
      '.branch.active{border-color:var(--blue);box-shadow:0 0 0 2px #7da9ff22}',
      '.branch-top{display:flex;justify-content:space-between;align-items:baseline;gap:8px}',
      '.branch-repo{font-size:10px;color:var(--text);font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.branch-name{font-size:8px;color:var(--blue);border:1px solid #2d3a4b;border-radius:999px;padding:1px 7px;white-space:nowrap;flex:none}',
      '.branch-meta{display:flex;justify-content:space-between;gap:8px;margin-top:7px}',
      '.branch-meta code{font-size:9px;color:var(--muted)}',
      '.branch-meta span{font-size:9px;color:var(--muted)}',
      '.branch-class{font-size:8px;color:var(--amber);margin-top:7px;line-height:1.4;letter-spacing:.02em}',
      '.branch-missing{color:var(--muted);font-size:10px;border:1px dashed var(--line);border-radius:10px;padding:14px;text-align:center}'
    ].join('\n');
    document.head.appendChild(st);
  };
const setCollapsed = collapsed => {
    const app = appEl();
    const btn = toggleBtn();
    if (app) app.classList.toggle('status-collapsed', collapsed);
    if (btn) { btn.textContent = collapsed ? '»' : '«'; btn.setAttribute('aria-expanded', String(!collapsed)); btn.title = collapsed ? 'Unfold panel' : 'Fold panel'; }
    try { localStorage.setItem(COLLAPSE_KEY, collapsed ? '1' : '0'); } catch (_) {}
  };

  async function statusOf(project) {
    if (!project || !project.status_file) return null;
    try {
      const r = await fetch(project.status_file + (project.status_file.includes('?') ? '&' : '?') + 'v=' + Date.now(), { cache: 'no-store' });
      if (!r.ok) return null;
      return await r.json();
    } catch (_) { return null; }
  }

  function branchRow(project, data, active) {
    const repo = data?.source_repo || project.id;
    const branch = data?.source_branch || '—';
    const head = data?.source_head;
    const verified = data?.verified_at || '';
    const cls = data?.overall_classification || '';
    return `<div class="branch ${active ? 'active' : ''}">`
      + `<div class="branch-top"><span class="branch-repo">${esc(repo)}</span><span class="branch-name">${esc(branch)}</span></div>`
      + `<div class="branch-meta"><code>${esc(sh(head))}</code><span>${esc(verified.slice(0, 16))}</span></div>`
      + (cls ? `<div class="branch-class">${esc(cls)}</div>` : '')
      + `</div>`;
  }

  let renderedFor = null;
  async function render() {
    const list = branchList();
    const ps = projects();
    if (!list || !ps.length) return;

    const key = ps.map(p => p.id).join(',') + '|' + (activeId() || '');
    if (key === renderedFor) return;
    renderedFor = key;

    const active = activeId();
    const chunks = await Promise.all(ps.map(async p => ({ p, d: await statusOf(p) })));
    list.innerHTML = chunks.map(({ p, d }) => branchRow(p, d, p.id === active)).join('')
      || '<div class="branch-missing">No project repo data.</div>';
  }

  const boot = () => {
    style();
    setCollapsed(localStorage.getItem(COLLAPSE_KEY) === '1');
    const btn = toggleBtn();
    if (btn) btn.onclick = () => setCollapsed(!appEl().classList.contains('status-collapsed'));
    if (!projects().length) { setTimeout(boot, 150); return; }
    render();
    window.addEventListener('hashchange', () => { renderedFor = null; render(); });
    setInterval(() => { renderedFor = null; render(); }, 8000);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();