/* Repo/project truth panel for LB Workspace — render-only.
 *
 * Enhances the right-hand status column with current project truth, selected-node
 * inspection, file-level evidence when projected by status.json, and repository rows.
 * Also enriches canvas node cards using fields already present in plan.json.
 *
 * This file never writes plan/status truth and never invents missing evidence.
 */
(() => {
  const COLLAPSE_KEY = 'lb-repo-branches-collapsed';
  const STYLE_ID = 'lbBranchesCss';

  const appEl = () => document.querySelector('.app');
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

  const style = () => {
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

      '.rp-section{margin-bottom:14px}',
      '.rp-title{font-size:8px;letter-spacing:.14em;text-transform:uppercase;color:#59687a;font-weight:900;margin:0 2px 7px}',
      '.rp-card{border:1px solid #202a36;border-radius:12px;background:#0d1219;padding:11px;margin-bottom:8px}',
      '.rp-card.active{border-color:#526f9b;background:#0d1520}',
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

      '.node{width:168px!important;min-height:136px!important;padding:12px!important}',
      '.node .name{font-size:11px!important;line-height:1.35}',
      '.node .priority{margin-top:6px!important}',
      '.lb-node-extra{margin-top:8px;padding-top:7px;border-top:1px solid #27313e}',
      '.lb-node-summary{font-size:8px;line-height:1.45;color:#7f8d9e;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}',
      '.lb-node-meta{display:flex;gap:5px;flex-wrap:wrap;margin-top:7px}',
      '.lb-node-chip{font-size:6.5px;letter-spacing:.05em;border:1px solid #303b49;border-radius:999px;padding:2px 5px;color:#8898aa}',
      '.lb-node-chip.status{border-color:#42546b;color:#abc2df}',
      '.node.current .lb-node-chip.status{border-color:var(--blue);color:#c6dcff}',
      '.node.blocked .lb-node-chip.status,.node.failed .lb-node-chip.status{border-color:var(--red);color:#f2aaaa}',
      '.node.proven .lb-node-chip.status{border-color:var(--green);color:#9bdcb8}'
    ].join('\n');
    document.head.appendChild(st);
  };

  const setCollapsed = collapsed => {
    const app = appEl();
    const btn = toggleBtn();
    if (app) app.classList.toggle('status-collapsed', collapsed);
    if (btn) {
      btn.textContent = collapsed ? '»' : '«';
      btn.setAttribute('aria-expanded', String(!collapsed));
      btn.title = collapsed ? 'Unfold panel' : 'Fold panel';
    }
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
      + `<div class="branch-meta"><code>${esc(short(head))}</code><span>${esc(String(verified).slice(0, 16))}</span></div>`
      + (cls ? `<div class="branch-class">${esc(cls)}</div>` : '')
      + `</div>`;
  }

  function nodeById(id) {
    const p = plan();
    return (p?.nodes || []).find(n => n.id === id) || null;
  }

  function edgesFor(id) {
    const all = (plan()?.edges || []).map(e => Array.isArray(e) ? { from:e[0], to:e[1], type:'flow' } : e);
    return {
      incoming: all.filter(e => e.to === id),
      outgoing: all.filter(e => e.from === id)
    };
  }

  function currentNodeId() {
    return plan()?.active_node || currentProject?.active_node || null;
  }

  function nodeDetailHtml(node) {
    if (!node) return '<div class="branch-missing">Select a node to inspect its projected evidence.</div>';
    const links = edgesFor(node.id);
    const reqs = Array.isArray(node.pass_requires) ? node.pass_requires : [];
    const statusValue = node.id === currentNodeId() ? 'CURRENT' : (node.status || 'UNSPECIFIED');
    return `<div class="rp-card active">
      <div class="rp-head"><b>${esc(node.title || node.id)}</b><span class="rp-pill ${esc(String(statusValue).toLowerCase())}">${esc(statusValue)}</span></div>
      ${node.summary ? `<div class="rp-summary">${esc(node.summary)}</div>` : ''}
      <dl class="rp-grid">
        <dt>Node ID</dt><dd><code>${esc(node.id)}</code></dd>
        <dt>Lane</dt><dd>${esc(node.lane || '—')}</dd>
        <dt>Priority</dt><dd>${esc(node.priority || '—')}</dd>
        <dt>Parent</dt><dd>${esc(node.parent || '—')}</dd>
        <dt>Incoming</dt><dd>${links.incoming.length ? links.incoming.map(e => esc(e.from)).join(', ') : 'none'}</dd>
        <dt>Outgoing</dt><dd>${links.outgoing.length ? links.outgoing.map(e => esc(e.to)).join(', ') : 'none'}</dd>
      </dl>
      ${reqs.length ? `<ul class="rp-list">${reqs.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
    </div>`;
  }

  function projectTruthHtml() {
    const s = status();
    const p = plan();
    if (!s && !p) return '<div class="branch-missing">No project status loaded.</div>';
    const stage = s?.current_stage || {};
    const current = currentNodeId();
    const nodes = p?.nodes || [];
    const counts = nodes.reduce((a,n) => { const k = String(n.status || (n.id === current ? 'current' : 'unknown')).toUpperCase(); a[k]=(a[k]||0)+1; return a; }, {});
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
    const s = status();
    const pairs = s?.stage_2?.group_1?.pairs;
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
    let truth = document.getElementById('projectTruthPanel');
    if (!truth) {
      truth = document.createElement('div');
      truth.id = 'projectTruthPanel';
      root.prepend(truth);
    }
    let selected = document.getElementById('selectedNodePanel');
    if (!selected) {
      selected = document.createElement('div');
      selected.id = 'selectedNodePanel';
      truth.insertAdjacentElement('afterend', selected);
    }
    let files = document.getElementById('fileEvidencePanel');
    if (!files) {
      files = document.createElement('div');
      files.id = 'fileEvidencePanel';
      selected.insertAdjacentElement('afterend', files);
    }
    return { truth, selected, files };
  }

  let selectedNodeId = null;
  function renderDetailPanels() {
    const panels = ensurePanelStructure();
    if (!panels) return;
    panels.truth.innerHTML = `<div class="rp-section"><div class="rp-title">Project truth</div>${projectTruthHtml()}</div>`;
    const node = nodeById(selectedNodeId || currentNodeId());
    panels.selected.innerHTML = `<div class="rp-section"><div class="rp-title">Selected node</div>${nodeDetailHtml(node)}</div>`;
    panels.files.innerHTML = fileEvidenceHtml();
  }

  function enrichNodeCards() {
    const p = plan();
    if (!p) return;
    const active = currentNodeId();
    document.querySelectorAll('.node[data-node-id]').forEach(card => {
      const id = card.dataset.nodeId;
      const n = nodeById(id);
      if (!n) return;
      let extra = card.querySelector('.lb-node-extra');
      if (!extra) {
        extra = document.createElement('div');
        extra.className = 'lb-node-extra';
        card.appendChild(extra);
      }
      const reqCount = Array.isArray(n.pass_requires) ? n.pass_requires.length : 0;
      const links = edgesFor(id);
      const state = id === active ? 'CURRENT' : String(n.status || 'UNKNOWN').toUpperCase();
      extra.innerHTML = `${n.summary ? `<div class="lb-node-summary">${esc(n.summary)}</div>` : ''}
        <div class="lb-node-meta">
          <span class="lb-node-chip status">${esc(state)}</span>
          ${reqCount ? `<span class="lb-node-chip">${reqCount} requirements</span>` : ''}
          ${(links.incoming.length + links.outgoing.length) ? `<span class="lb-node-chip">${links.incoming.length + links.outgoing.length} links</span>` : ''}
        </div>`;
      card.addEventListener('click', () => {
        selectedNodeId = id;
        setTimeout(renderDetailPanels, 0);
      }, { once:false });
    });
  }

  let renderedFor = null;
  async function renderBranches() {
    const list = branchList();
    const ps = projects();
    if (!list || !ps.length) return;
    const key = ps.map(p => p.id).join(',') + '|' + (activeId() || '');
    if (key === renderedFor) return;
    renderedFor = key;
    const active = activeId();
    const chunks = await Promise.all(ps.map(async p => ({ p, d: await statusOf(p) })));
    list.innerHTML = `<div class="rp-title">Repositories</div>` + (chunks.map(({ p, d }) => branchRow(p, d, p.id === active)).join('')
      || '<div class="branch-missing">No project repo data.</div>');
  }

  function refreshProjection() {
    selectedNodeId = selectedNodeId && nodeById(selectedNodeId) ? selectedNodeId : currentNodeId();
    renderDetailPanels();
    enrichNodeCards();
  }

  function observeBoard() {
    const board = document.getElementById('board');
    if (!board || board.dataset.lbEvidenceObserved) return;
    board.dataset.lbEvidenceObserved = '1';
    const observer = new MutationObserver(() => setTimeout(refreshProjection, 0));
    observer.observe(board, { childList:true, subtree:true });
  }

  const boot = () => {
    style();
    setCollapsed(localStorage.getItem(COLLAPSE_KEY) === '1');
    const btn = toggleBtn();
    if (btn) btn.onclick = () => setCollapsed(!appEl().classList.contains('status-collapsed'));
    if (!projects().length) { setTimeout(boot, 150); return; }
    observeBoard();
    renderBranches();
    setTimeout(refreshProjection, 60);
    window.addEventListener('hashchange', () => {
      renderedFor = null;
      selectedNodeId = null;
      setTimeout(() => { renderBranches(); refreshProjection(); }, 80);
    });
    setInterval(() => {
      renderedFor = null;
      renderBranches();
      refreshProjection();
    }, 8000);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
