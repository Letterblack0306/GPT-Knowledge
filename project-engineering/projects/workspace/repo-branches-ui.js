/* Repo/project truth panel and canvas interactions for LB Workspace — render-only.
 *
 * Keeps repository/project truth in the right column, enriches plan nodes in-place,
 * and provides cursor-centred canvas zoom. Node details expand inside the node card;
 * the legacy floating node drawer is intentionally suppressed.
 *
 * This file never writes plan/status truth and never invents missing evidence.
 */
(() => {
  const COLLAPSE_KEY = 'lb-repo-branches-collapsed';
  const ZOOM_KEY = 'lb-workspace-canvas-zoom';
  const STYLE_ID = 'lbBranchesCss';
  const MIN_ZOOM = 0.55;
  const MAX_ZOOM = 1.65;
  const ZOOM_STEP = 0.10;

  const appEl = () => document.querySelector('.app');
  const canvasEl = () => document.querySelector('.canvas');
  const boardEl = () => document.getElementById('board');
  const branchList = () => document.getElementById('branchList');
  const toggleBtn = () => document.getElementById('branchToggle');
  const statusContent = () => document.getElementById('statusContent');

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const short = sha => sha ? String(sha).slice(0, 10) : '—';
  const projects = () => (typeof registry !== 'undefined' && registry && registry.projects) || [];
  const activeId = () => {
    try { if (currentProject && currentProject.id) return currentProject.id; } catch (_) {}
    return null;
  };
  const plan = () => { try { return currentPlan || null; } catch (_) { return null; } };
  const status = () => { try { return currentStatus || null; } catch (_) { return null; } };

  let zoom = 1;
  let renderedFor = null;

  function style() {
    if (document.getElementById(STYLE_ID)) return;
    const st = document.createElement('style');
    st.id = STYLE_ID;
    st.textContent = [
      '.app{grid-template-columns:230px 1fr var(--status-w,380px)}',
      '.status{padding:16px 14px;overflow:auto;transition:min-width .18s ease,width .18s ease}',
      '.status-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px;position:sticky;top:0;background:#090c11;padding:2px 0 8px;z-index:3}',
      '.status-head h2{margin:0;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);font-weight:800}',
      '#branchToggle{border:1px solid #2f3c4c;background:#121923;color:#bcd5ff;border-radius:8px;padding:4px 9px;font-size:12px;line-height:1;cursor:pointer;flex:none}',
      '#branchToggle:hover{border-color:#526f9b}',
      '.app.status-collapsed{--status-w:32px}',
      '.app.status-collapsed .status{width:32px;padding:0;overflow:hidden}',
      '.app.status-collapsed .status-head{justify-content:center;padding:8px 0}',
      '.app.status-collapsed .status-head h2,.app.status-collapsed .status>.sub,.app.status-collapsed #statusContent{display:none}',
      '.app.status-collapsed #branchToggle{writing-mode:vertical-lr;transform:rotate(180deg);padding:8px 4px;letter-spacing:.12em;border-radius:6px}',
      '.drawer{display:none!important}',

      '.lb-zoom-controls{position:sticky;top:12px;left:12px;z-index:8;display:flex;align-items:center;gap:5px;width:max-content;margin:12px 0 -42px 12px;pointer-events:auto}',
      '.lb-zoom-controls button{width:28px;height:28px;border:1px solid #2d3948;background:#0e151f;color:#b8c7da;border-radius:8px;cursor:pointer;font:700 13px/1 Segoe UI,Arial,sans-serif;box-shadow:0 5px 18px #0007}',
      '.lb-zoom-controls button:hover{border-color:#55729a;color:#e5efff}',
      '.lb-zoom-value{min-width:48px;text-align:center;border:1px solid #283442;background:#0b1119;color:#8090a2;border-radius:8px;padding:6px 7px;font-size:8px;box-shadow:0 5px 18px #0007}',
      '.lb-zoom-hint{font-size:7px;color:#536174;border:1px solid #222d3a;background:#090e15cc;border-radius:999px;padding:4px 7px;white-space:nowrap}',

      '.rp-section{margin-bottom:14px}',
      '.rp-title{font-size:8px;letter-spacing:.14em;text-transform:uppercase;color:#59687a;font-weight:900;margin:0 2px 7px}',
      '.rp-card{border:1px solid #202a36;border-radius:12px;background:#0d1219;padding:11px;margin-bottom:8px}',
      '.rp-card.issue{border-color:#754949;background:#171012}',
      '.rp-card.ok{border-color:#315d46;background:#0d1712}',
      '.rp-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}',
      '.rp-head b{font-size:11px;line-height:1.35;color:#e2eaf3}',
      '.rp-pill{font-size:7px;letter-spacing:.08em;border:1px solid #344154;border-radius:999px;padding:2px 6px;color:#93a3b7;white-space:nowrap}',
      '.rp-pill.current{border-color:var(--blue);color:#bdd3ff}',
      '.rp-pill.fail,.rp-pill.blocked{border-color:var(--red);color:#f3a2a2}',
      '.rp-pill.pass,.rp-pill.proven{border-color:var(--green);color:#91ddb5}',
      '.rp-summary{font-size:9px;line-height:1.5;color:#8593a4;margin-top:7px}',
      '.rp-grid{display:grid;grid-template-columns:92px minmax(0,1fr);gap:5px 8px;margin-top:8px;font-size:8.5px}',
      '.rp-grid dt{color:#5f6e80}.rp-grid dd{margin:0;color:#9ba9b9;overflow-wrap:anywhere}',
      '.rp-grid code{font-size:8px;color:#b7c5d6}',
      '.rp-list{margin:8px 0 0;padding:8px 0 0 16px;border-top:1px solid #202a36;color:#8695a7;font-size:8.5px;line-height:1.45}',
      '.rp-list li{margin:3px 0}',

      '.rp-file{border:1px solid #2a3441;border-radius:10px;background:#0b1016;padding:9px;margin-bottom:7px}',
      '.rp-file.fail{border-color:#693d40;background:#161012}',
      '.rp-file-top{display:flex;gap:7px;align-items:flex-start;justify-content:space-between}',
      '.rp-file-top code{font-size:8px;line-height:1.4;color:#d5dfeb;overflow-wrap:anywhere}',
      '.rp-arrow{color:#536276;font-size:10px;margin:4px 0}',
      '.rp-file-meta{display:grid;grid-template-columns:1fr 1fr;gap:4px 8px;font-size:7.5px;color:#6f7d8e}',
      '.rp-file-meta code{color:#98a7b9;font-size:7.5px}',

      '.branch{border:1px solid var(--line);border-radius:10px;background:var(--panel2);padding:9px 11px;margin-bottom:8px;box-shadow:0 4px 14px #0004}',
      '.branch.active{border-color:var(--blue);box-shadow:0 0 0 2px #7da9ff22}',
      '.branch-top{display:flex;justify-content:space-between;align-items:baseline;gap:8px}',
      '.branch-repo{font-size:9px;color:var(--text);font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.branch-name{font-size:7px;color:var(--blue);border:1px solid #2d3a4b;border-radius:999px;padding:1px 7px;white-space:nowrap;flex:none}',
      '.branch-meta{display:flex;justify-content:space-between;gap:8px;margin-top:6px}',
      '.branch-meta code,.branch-meta span{font-size:8px;color:var(--muted)}',
      '.branch-class{font-size:7.5px;color:var(--amber);margin-top:6px;line-height:1.35;overflow-wrap:anywhere}',
      '.branch-missing{color:var(--muted);font-size:9px;border:1px dashed var(--line);border-radius:10px;padding:12px;text-align:center}',

      '.node{width:178px!important;min-height:132px!important;padding:12px!important;transition:width .16s ease,border-color .16s ease,box-shadow .16s ease}',
      '.node .name{font-size:11px!important;line-height:1.35}',
      '.node .priority{margin-top:6px!important}',
      '.node.lb-expanded{width:340px!important;z-index:5;box-shadow:0 18px 48px #000b}',
      '.lb-node-extra{margin-top:8px;padding-top:7px;border-top:1px solid #27313e}',
      '.lb-node-summary{font-size:8px;line-height:1.45;color:#7f8d9e;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}',
      '.node.lb-expanded .lb-node-summary{-webkit-line-clamp:unset;display:block;color:#9cabbc}',
      '.lb-node-meta{display:flex;gap:5px;flex-wrap:wrap;margin-top:7px}',
      '.lb-node-chip{font-size:6.5px;letter-spacing:.05em;border:1px solid #303b49;border-radius:999px;padding:2px 5px;color:#8898aa}',
      '.lb-node-chip.status{border-color:#42546b;color:#abc2df}',
      '.node.current .lb-node-chip.status{border-color:var(--blue);color:#c6dcff}',
      '.node.blocked .lb-node-chip.status,.node.failed .lb-node-chip.status{border-color:var(--red);color:#f2aaaa}',
      '.node.proven .lb-node-chip.status{border-color:var(--green);color:#9bdcb8}',
      '.lb-node-toggle{margin-top:8px;width:100%;border:1px solid #2a3644;background:#101720;color:#8292a5;border-radius:7px;padding:5px 7px;font-size:7px;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;text-align:left}',
      '.lb-node-toggle:hover{border-color:#4b627f;color:#b7cbe2}',
      '.lb-node-toggle:after{content:"▾";float:right}',
      '.node.lb-expanded .lb-node-toggle:after{content:"▴"}',
      '.lb-node-details{display:none;margin-top:8px;border-top:1px solid #283442;padding-top:8px}',
      '.node.lb-expanded .lb-node-details{display:block}',
      '.lb-node-detail-grid{display:grid;grid-template-columns:78px minmax(0,1fr);gap:4px 7px;font-size:7.5px}',
      '.lb-node-detail-grid dt{color:#617083}.lb-node-detail-grid dd{margin:0;color:#9aa9ba;overflow-wrap:anywhere}',
      '.lb-node-requires{margin:8px 0 0;padding:7px 0 0 15px;border-top:1px solid #26313e;color:#8b9bad;font-size:7.5px;line-height:1.45}',
      '.lb-node-requires li{margin:3px 0}'
    ].join('\n');
    document.head.appendChild(st);
  }

  function setCollapsed(collapsed) {
    const app = appEl();
    const btn = toggleBtn();
    if (app) app.classList.toggle('status-collapsed', collapsed);
    if (btn) {
      btn.textContent = collapsed ? '»' : '«';
      btn.setAttribute('aria-expanded', String(!collapsed));
      btn.title = collapsed ? 'Unfold panel' : 'Fold panel';
    }
    try { localStorage.setItem(COLLAPSE_KEY, collapsed ? '1' : '0'); } catch (_) {}
  }

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
      + `<div class="branch-meta"><code>${esc(short(head))}</code><span>${esc(String(verified).slice(0, 16))}</span></div>`
      + (cls ? `<div class="branch-class">${esc(cls)}</div>` : '')
      + `</div>`;
  }

  function nodeById(id) {
    return (plan()?.nodes || []).find(n => n.id === id) || null;
  }

  function edgesFor(id) {
    const all = (plan()?.edges || []).map(e => Array.isArray(e) ? { from:e[0], to:e[1], type:'flow' } : e);
    return { incoming: all.filter(e => e.to === id), outgoing: all.filter(e => e.from === id) };
  }

  function currentNodeId() {
    try { return plan()?.active_node || currentProject?.active_node || null; } catch (_) { return plan()?.active_node || null; }
  }

  function projectTruthHtml() {
    const s = status();
    const p = plan();
    if (!s && !p) return '<div class="branch-missing">No project status loaded.</div>';
    const stage = s?.current_stage || {};
    const current = currentNodeId();
    const nodes = p?.nodes || [];
    const counts = nodes.reduce((a,n) => {
      const k = String(n.id === current ? 'current' : (n.status || 'unknown')).toUpperCase();
      a[k] = (a[k] || 0) + 1;
      return a;
    }, {});
    return `<div class="rp-card">
      <div class="rp-head"><b>${esc(s?.project || p?.project || currentProject?.name || 'Project')}</b><span class="rp-pill current">CURRENT</span></div>
      <div class="rp-summary">${esc(stage.title || s?.overall_classification || p?.purpose || '')}</div>
      <dl class="rp-grid">
        <dt>Repository</dt><dd>${esc(s?.source_repo || p?.source_repo || '—')}</dd>
        <dt>Branch</dt><dd>${esc(s?.source_branch || p?.source_branch || '—')}</dd>
        <dt>Source HEAD</dt><dd><code>${esc(short(s?.source_head || p?.source_head))}</code></dd>
        <dt>Verified</dt><dd>${esc(s?.verified_at || p?.updated || '—')}</dd>
        <dt>Active node</dt><dd><code>${esc(current || '—')}</code></dd>
        <dt>Node states</dt><dd>${esc(Object.entries(counts).map(([k,v]) => `${k}:${v}`).join(' · ') || '—')}</dd>
      </dl>
      ${stage.reason ? `<div class="rp-summary"><b>Why:</b> ${esc(stage.reason)}</div>` : ''}
      ${stage.next_valid_action ? `<div class="rp-summary"><b>Next:</b> ${esc(stage.next_valid_action)}</div>` : ''}
    </div>`;
  }

  function fileEvidenceHtml() {
    const pairs = status()?.stage_2?.group_1?.pairs;
    if (!Array.isArray(pairs) || !pairs.length) return '';
    return `<div class="rp-section"><div class="rp-title">File evidence · ${pairs.length}</div>${pairs.map(pair => {
      const fail = String(pair.result || '').startsWith('FAIL');
      return `<div class="rp-file ${fail ? 'fail' : ''}">
        <div class="rp-file-top"><code>${esc(pair.source || '—')}</code><span class="rp-pill ${fail ? 'fail' : 'pass'}">${esc(pair.result || '—')}</span></div>
        <div class="rp-arrow">↓ compared with</div>
        <code style="font-size:8px;color:#aebccc;overflow-wrap:anywhere">${esc(pair.target || '—')}</code>
        <div class="rp-file-meta" style="margin-top:7px">
          <span>source bytes</span><code>${esc(pair.source_bytes ?? '—')}</code>
          <span>target bytes</span><code>${esc(pair.target_bytes ?? '—')}</code>
          <span>source SHA</span><code>${esc(short(pair.source_sha256))}</code>
          <span>target SHA</span><code>${esc(short(pair.target_sha256))}</code>
        </div>
      </div>`;
    }).join('')}</div>`;
  }

  function ensurePanelStructure() {
    const root = statusContent();
    if (!root) return null;
    document.getElementById('selectedNodePanel')?.remove();
    let truth = document.getElementById('projectTruthPanel');
    if (!truth) { truth = document.createElement('div'); truth.id = 'projectTruthPanel'; root.prepend(truth); }
    let files = document.getElementById('fileEvidencePanel');
    if (!files) { files = document.createElement('div'); files.id = 'fileEvidencePanel'; truth.insertAdjacentElement('afterend', files); }
    return { truth, files };
  }

  function renderRightPanel() {
    const panels = ensurePanelStructure();
    if (!panels) return;
    panels.truth.innerHTML = `<div class="rp-section"><div class="rp-title">Project truth</div>${projectTruthHtml()}</div>`;
    panels.files.innerHTML = fileEvidenceHtml();
  }

  function nodeDetailHtml(n, links, reqs) {
    return `<div class="lb-node-details">
      <dl class="lb-node-detail-grid">
        <dt>Node ID</dt><dd>${esc(n.id)}</dd>
        <dt>Lane</dt><dd>${esc(n.lane || '—')}</dd>
        <dt>Priority</dt><dd>${esc(n.priority || '—')}</dd>
        <dt>Parent</dt><dd>${esc(n.parent || '—')}</dd>
        <dt>Incoming</dt><dd>${links.incoming.length ? links.incoming.map(e => esc(e.from)).join(', ') : 'none'}</dd>
        <dt>Outgoing</dt><dd>${links.outgoing.length ? links.outgoing.map(e => esc(e.to)).join(', ') : 'none'}</dd>
      </dl>
      ${reqs.length ? `<ol class="lb-node-requires">${reqs.map(x => `<li>${esc(x)}</li>`).join('')}</ol>` : ''}
    </div>`;
  }

  function enrichNodeCards() {
    const p = plan();
    if (!p) return;
    const active = currentNodeId();
    document.querySelectorAll('.node[data-node-id]').forEach(card => {
      const id = card.dataset.nodeId;
      const n = nodeById(id);
      if (!n) return;
      const reqs = Array.isArray(n.pass_requires) ? n.pass_requires : [];
      const links = edgesFor(id);
      const state = id === active ? 'CURRENT' : String(n.status || 'UNKNOWN').toUpperCase();
      let extra = card.querySelector('.lb-node-extra');
      if (!extra) {
        extra = document.createElement('div');
        extra.className = 'lb-node-extra';
        card.appendChild(extra);
      }
      const signature = `${id}|${state}|${reqs.length}|${links.incoming.length}|${links.outgoing.length}|${n.summary || ''}|${n.parent || ''}|${n.priority || ''}`;
      if (extra.dataset.signature !== signature) {
        extra.innerHTML = `${n.summary ? `<div class="lb-node-summary">${esc(n.summary)}</div>` : ''}
          <div class="lb-node-meta">
            <span class="lb-node-chip status">${esc(state)}</span>
            ${reqs.length ? `<span class="lb-node-chip">${reqs.length} requirements</span>` : ''}
            ${(links.incoming.length + links.outgoing.length) ? `<span class="lb-node-chip">${links.incoming.length + links.outgoing.length} links</span>` : ''}
          </div>
          <button type="button" class="lb-node-toggle">Details</button>
          ${nodeDetailHtml(n, links, reqs)}`;
        extra.dataset.signature = signature;
      }
      card.onclick = null;
      if (!card.dataset.lbNodeBound) {
        card.dataset.lbNodeBound = '1';
        card.addEventListener('click', e => {
          if (window.getSelection()?.toString()) return;
          e.preventDefault();
          e.stopPropagation();
          const expanded = !card.classList.contains('lb-expanded');
          document.querySelectorAll('.node.lb-expanded').forEach(other => {
            if (other !== card) other.classList.remove('lb-expanded');
          });
          card.classList.toggle('lb-expanded', expanded);
          setTimeout(redrawEdgesForZoom, 180);
        });
      }
    });
  }

  async function renderBranches() {
    const list = branchList();
    const ps = projects();
    if (!list || !ps.length) return;
    const key = ps.map(p => p.id).join(',') + '|' + (activeId() || '');
    if (key === renderedFor) return;
    renderedFor = key;
    const active = activeId();
    const chunks = await Promise.all(ps.map(async p => ({ p, d: await statusOf(p) })));
    list.innerHTML = `<div class="rp-title">Repositories</div>` + (chunks.map(({ p, d }) => branchRow(p, d, p.id === active)).join('') || '<div class="branch-missing">No project repo data.</div>');
  }

  function redrawEdgesForZoom() {
    const p = plan();
    const svg = document.getElementById('edgeLayer');
    const board = boardEl();
    if (!p || !svg || !board) return;
    const br = board.getBoundingClientRect();
    let out = '<defs><marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 z" fill="#50617a"/></marker></defs>';
    (p.edges || []).map(e => Array.isArray(e) ? { from:e[0], to:e[1], type:'flow' } : e).forEach(e => {
      const a = board.querySelector(`[data-node-id="${CSS.escape(e.from)}"]`);
      const b = board.querySelector(`[data-node-id="${CSS.escape(e.to)}"]`);
      if (!a || !b) return;
      const ar = a.getBoundingClientRect();
      const rr = b.getBoundingClientRect();
      const x1 = (ar.right - br.left) / zoom;
      const y1 = (ar.top + ar.height / 2 - br.top) / zoom;
      const x2 = (rr.left - br.left) / zoom;
      const y2 = (rr.top + rr.height / 2 - br.top) / zoom;
      const bend = Math.max(30, Math.abs(x2 - x1) * .42);
      out += `<path class="edge ${esc(e.type || 'flow')}" d="M ${x1} ${y1} C ${x1+bend} ${y1}, ${x2-bend} ${y2}, ${x2} ${y2}" marker-end="url(#arrow)"/>`;
    });
    svg.innerHTML = out;
  }

  function zoomLabel() {
    const el = document.getElementById('lbZoomValue');
    if (el) el.textContent = `${Math.round(zoom * 100)}%`;
  }

  function applyZoom(next, clientX, clientY) {
    const canvas = canvasEl();
    const board = boardEl();
    if (!canvas || !board) return;
    next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number(next.toFixed(2))));
    if (Math.abs(next - zoom) < 0.001) return;
    const rect = canvas.getBoundingClientRect();
    const mx = Number.isFinite(clientX) ? clientX - rect.left : canvas.clientWidth / 2;
    const my = Number.isFinite(clientY) ? clientY - rect.top : canvas.clientHeight / 2;
    const worldX = (canvas.scrollLeft + mx) / zoom;
    const worldY = (canvas.scrollTop + my) / zoom;
    zoom = next;
    board.style.zoom = String(zoom);
    canvas.scrollLeft = Math.max(0, worldX * zoom - mx);
    canvas.scrollTop = Math.max(0, worldY * zoom - my);
    try { localStorage.setItem(ZOOM_KEY, String(zoom)); } catch (_) {}
    zoomLabel();
    requestAnimationFrame(redrawEdgesForZoom);
  }

  function resetZoom() {
    applyZoom(1);
  }

  function ensureZoomControls() {
    const canvas = canvasEl();
    if (!canvas || document.getElementById('lbZoomControls')) return;
    const controls = document.createElement('div');
    controls.id = 'lbZoomControls';
    controls.className = 'lb-zoom-controls';
    controls.innerHTML = '<button type="button" id="lbZoomOut" title="Zoom out">−</button><span class="lb-zoom-value" id="lbZoomValue">100%</span><button type="button" id="lbZoomIn" title="Zoom in">+</button><button type="button" id="lbZoomReset" title="Reset zoom">↺</button><span class="lb-zoom-hint">wheel = zoom · drag = pan</span>';
    canvas.prepend(controls);
    document.getElementById('lbZoomOut').onclick = e => { e.stopPropagation(); applyZoom(zoom - ZOOM_STEP); };
    document.getElementById('lbZoomIn').onclick = e => { e.stopPropagation(); applyZoom(zoom + ZOOM_STEP); };
    document.getElementById('lbZoomReset').onclick = e => { e.stopPropagation(); resetZoom(); };
    canvas.addEventListener('wheel', e => {
      if (e.target.closest('.lb-zoom-controls')) return;
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.08 : (1 / 1.08);
      applyZoom(zoom * factor, e.clientX, e.clientY);
    }, { passive:false });
    const saved = Number(localStorage.getItem(ZOOM_KEY));
    zoom = Number.isFinite(saved) && saved >= MIN_ZOOM && saved <= MAX_ZOOM ? saved : 1;
    const board = boardEl();
    if (board) board.style.zoom = String(zoom);
    zoomLabel();
  }

  function refreshProjection() {
    renderRightPanel();
    enrichNodeCards();
    ensureZoomControls();
    requestAnimationFrame(redrawEdgesForZoom);
  }

  function observeBoard() {
    const board = boardEl();
    if (!board || board.dataset.lbEvidenceObserved) return;
    board.dataset.lbEvidenceObserved = '1';
    const observer = new MutationObserver(records => {
      const external = records.some(record => [...record.addedNodes].some(node =>
        node.nodeType === 1 && !node.classList?.contains('lb-node-extra') && !node.closest?.('.lb-node-extra')));
      if (external) setTimeout(refreshProjection, 0);
    });
    observer.observe(board, { childList:true, subtree:true });
  }

  function boot() {
    style();
    setCollapsed(localStorage.getItem(COLLAPSE_KEY) === '1');
    const btn = toggleBtn();
    if (btn) btn.onclick = () => setCollapsed(!appEl().classList.contains('status-collapsed'));
    if (!projects().length) { setTimeout(boot, 150); return; }
    observeBoard();
    renderBranches();
    setTimeout(refreshProjection, 80);
    window.addEventListener('hashchange', () => {
      renderedFor = null;
      setTimeout(() => { renderBranches(); refreshProjection(); }, 100);
    });
    window.addEventListener('resize', () => requestAnimationFrame(redrawEdgesForZoom));
    setInterval(() => { renderedFor = null; renderBranches(); renderRightPanel(); }, 8000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();