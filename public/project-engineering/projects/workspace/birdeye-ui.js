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
  let inspectorNodes = new Map();

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

  function auditStateBadge(state) {
    const normalized = String(state || 'UNKNOWN').toUpperCase();
    const tone = normalized === 'UNCHANGED' ? 'var(--green)'
      : normalized === 'CHANGED' || normalized === 'INVALIDATED' ? 'var(--amber)'
      : 'var(--muted)';
    return `<span class="be-audit-state" style="border-color:${tone};color:${tone}">${esc(normalized)}</span>`;
  }

  function renderFileAudit(p) {
    const index = p.fileIndex;
    const changedPaths = (p.git || {}).changedPaths || [];

    if (!index || !Array.isArray(index.files)) {
      return [
        row('Index state', '<span style="color:var(--amber)">NOT PROJECTED</span>'),
        row('Git changed paths', esc(changedPaths.length)),
        row('Content hashes', 'unavailable'),
        row('Analysis freshness', 'unavailable'),
        row('Dependency invalidation', 'unavailable'),
        changedPaths.length
          ? listBlock('Changed paths awaiting file-index evidence', changedPaths)
          : '',
        '<p class="be-note">BirdEye currently projects repository-level Git evidence only. No per-file hash, prior-analysis record, dependency graph, or invalidation result was supplied.</p>'
      ].join('');
    }

    const files = index.files;
    const counts = files.reduce((out, file) => {
      const state = String(file.state || 'UNKNOWN').toUpperCase();
      out[state] = (out[state] || 0) + 1;
      return out;
    }, {});
    const fileCards = files.slice(0, 40).map(file => {
      const dependencies = Array.isArray(file.dependencies) ? file.dependencies : [];
      const invalidated = Array.isArray(file.invalidatedConclusions) ? file.invalidatedConclusions : [];
      return `<div class="be-file">
        <div class="be-file-head"><code>${esc(file.path ?? 'unknown path')}</code>${auditStateBadge(file.state)}</div>
        ${row('Current SHA-256', `<code>${esc(short(file.contentSha256))}</code>`)}
        ${row('Analyzed SHA-256', `<code>${esc(short(file.lastAnalyzedSha256))}</code>`)}
        ${row('Last analyzed', esc(file.lastAnalyzedAt ?? '—'))}
        ${row('Dependencies / invalidations', `${esc(dependencies.length)} / ${esc(invalidated.length)}`)}
      </div>`;
    }).join('');

    return [
      row('Index state', levelBadge(index.evidenceLevel)),
      row('Source', esc(index.source ?? '—')),
      row('Observed at', esc(index.observedAt ?? '—')),
      row('Files', esc(files.length)),
      row('Unchanged / changed / invalidated',
        `${esc(counts.UNCHANGED || 0)} / ${esc(counts.CHANGED || 0)} / ${esc(counts.INVALIDATED || 0)}`),
      fileCards || '<p class="be-note">The projected file index contains no file records.</p>',
      '<p class="be-note">An unchanged hash permits skipping content reread only when dependency, configuration, plan, test, and runtime-evidence links remain valid.</p>'
    ].join('');
  }

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

  function edgeBadge(level) {
    const normalized = String(level || 'UNKNOWN').toUpperCase();
    const tones = {
      PROVEN: 'var(--green)',
      DOCUMENTED: 'var(--blue)',
      INFERRED: 'var(--amber)',
      UNKNOWN: 'var(--muted)'
    };
    const tone = tones[normalized] || tones.UNKNOWN;
    return `<span class="be-edge-level" style="border-color:${tone};color:${tone}">${esc(tones[normalized] ? normalized : 'UNKNOWN')}</span>`;
  }

  function gitPathState(g, path) {
    if ((g.stagedPaths || []).includes(path)) return 'STAGED';
    if ((g.modifiedPaths || []).includes(path)) return 'MODIFIED';
    if ((g.untrackedPaths || []).includes(path)) return 'UNTRACKED';
    return 'CHANGED';
  }

  function registerNode(id, title, kind, evidence, details) {
    const node = { id, title, kind, evidence, details };
    inspectorNodes.set(id, node);
    return `<button type="button" class="be-node" data-be-node="${esc(id)}">
      <span>${esc(kind)}</span><b>${esc(title)}</b>${edgeBadge(evidence)}
    </button>`;
  }

  function inspectorHtml(node) {
    if (!node) return '<p class="be-note">Select an evidence node to inspect its projected facts.</p>';
    const details = Object.entries(node.details || {})
      .map(([label, value]) => row(label, esc(value ?? '—')))
      .join('');
    return `<div class="be-inspector-head"><div><span>${esc(node.kind)}</span><b>${esc(node.title)}</b></div>${edgeBadge(node.evidence)}</div>
      ${details || '<p class="be-note">No additional projected facts are available.</p>'}`;
  }

  function renderEvidenceGraph(p) {
    inspectorNodes = new Map();
    const a = p.attribution || {};
    const g = p.git || {};
    const s = p.planStatus || {};
    const r = p.runtime || {};
    const projectEvidence = a.projectId && a.observedAt ? 'PROVEN' : 'UNKNOWN';
    const planEvidence = s.authoritative === true ? 'DOCUMENTED' : 'UNKNOWN';
    const repositoryEvidence = g.isRepository ? (g.evidenceLevel || 'UNKNOWN') : 'UNKNOWN';
    const runtimeEvidence = r.evidenceLevel || 'UNKNOWN';
    const fileIndex = p.fileIndex && Array.isArray(p.fileIndex.files) ? p.fileIndex.files : [];
    const changedPaths = g.changedPaths || [];

    const projectNode = registerNode('project', a.projectName || a.projectId || 'Project', 'PROJECT', projectEvidence, {
      'Project id': a.projectId,
      'Workspace id': a.workspaceId,
      'Repository': a.repository,
      'Observed at': a.observedAt,
      'Verdict': p.verdict
    });
    const planNode = registerNode('plan', s.activeGate || 'Plan / status', 'PLAN', planEvidence, {
      'Plan state': s.planState,
      'Document': s.planDocument ? 'registered' : 'missing',
      'Revision': s.documentRevision,
      'Last verified': s.lastVerified,
      'Next question': s.nextSingleQuestion
    });
    const repositoryNode = registerNode('repository', g.branch || 'Repository', 'GIT', repositoryEvidence, {
      'Repository root': g.repositoryRoot || g.workspaceRoot,
      'Branch': g.branch,
      'HEAD': g.head,
      'Upstream': g.upstreamRef || 'not tracked',
      'Dirty': g.dirty === true ? 'yes' : g.dirty === false ? 'no' : 'unknown',
      'Changed paths': g.changedPathCount,
      'Observed at': g.observedAt
    });
    const runtimeNode = registerNode('runtime', r.source || 'Runtime evidence', 'RUNTIME', runtimeEvidence, {
      'Source': r.source || 'not configured',
      'Observed at': r.observedAt,
      'Reason': r.reason,
      'Evidence': runtimeEvidence
    });

    const fileNodes = changedPaths.slice(0, 20).map((path, index) => {
      const indexed = fileIndex.find(file => file.path === path);
      const id = `file-${index}`;
      return `<div class="be-file-edge">${edgeBadge(repositoryEvidence)}
        ${registerNode(id, path, gitPathState(g, path), repositoryEvidence, {
          'Path': path,
          'Git state': gitPathState(g, path),
          'Current SHA-256': indexed?.contentSha256 || 'not projected',
          'Analyzed SHA-256': indexed?.lastAnalyzedSha256 || 'not projected',
          'Last analyzed': indexed?.lastAnalyzedAt || 'not projected',
          'Dependencies': Array.isArray(indexed?.dependencies) ? indexed.dependencies.length : 'not projected',
          'Invalidated conclusions': Array.isArray(indexed?.invalidatedConclusions) ? indexed.invalidatedConclusions.length : 'not projected'
        })}
      </div>`;
    }).join('');

    return `<div class="be-evidence-graph">
      <div class="be-graph-root">${projectNode}</div>
      <div class="be-graph-branches">
        <div class="be-graph-branch">${edgeBadge(planEvidence)}${planNode}</div>
        <div class="be-graph-branch">${edgeBadge(repositoryEvidence)}${repositoryNode}
          ${fileNodes ? `<div class="be-file-nodes">${fileNodes}</div>` : '<p class="be-note">No changed paths projected.</p>'}
        </div>
        <div class="be-graph-branch">${edgeBadge(runtimeEvidence)}${runtimeNode}</div>
      </div>
    </div>
    <div class="be-inspector" aria-live="polite">
      ${inspectorHtml(inspectorNodes.get('project'))}
    </div>`;
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
        <section><h3>Evidence graph</h3>${renderEvidenceGraph(p)}</section>
        <section><h3>Git audit</h3>${renderGit(p)}</section>
        <section><h3>File audit index</h3>${renderFileAudit(p)}</section>
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
    panel.addEventListener('click', event => {
      const target = event.target.closest('[data-be-node]');
      if (!target || !panel.contains(target)) return;
      const node = inspectorNodes.get(target.dataset.beNode);
      const inspector = panel.querySelector('.be-inspector');
      if (!node || !inspector) return;
      panel.querySelectorAll('.be-node.selected').forEach(item => item.classList.remove('selected'));
      target.classList.add('selected');
      inspector.innerHTML = inspectorHtml(node);
    });

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
.be-audit-state{border:1px solid var(--line);border-radius:4px;padding:2px 6px;font-size:9px;white-space:nowrap}
.be-file{margin-top:8px;border-top:1px solid var(--line);padding-top:8px}
.be-file-head{display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:4px}
.be-file-head code{font-size:10px;word-break:break-all}
.be-evidence-graph{display:flex;flex-direction:column;gap:8px}
.be-graph-root{display:flex;justify-content:center}
.be-graph-branches{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.be-graph-branch{position:relative;display:flex;flex-direction:column;align-items:stretch;gap:5px;border-top:1px solid var(--line);padding-top:7px;min-width:0}
.be-edge-level{align-self:center;border:1px solid var(--line);border-radius:4px;padding:1px 5px;font-size:8px;letter-spacing:.06em}
.be-node{width:100%;min-height:48px;border:1px solid var(--line);border-radius:6px;background:#10141b;color:var(--text);padding:7px;text-align:left;cursor:pointer;display:flex;flex-direction:column;gap:3px;overflow:hidden}
.be-node:hover,.be-node.selected{border-color:var(--blue);background:#141b25}
.be-node:focus-visible{outline:2px solid var(--blue);outline-offset:2px}
.be-node>span{font-size:8px;color:var(--muted);letter-spacing:.08em}
.be-node>b{font-size:10px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.be-node .be-edge-level{align-self:flex-start}
.be-file-nodes{display:flex;flex-direction:column;gap:5px;margin-top:3px;padding-left:8px;border-left:1px solid var(--line)}
.be-file-edge{display:flex;flex-direction:column;gap:3px}
.be-file-edge>.be-edge-level{align-self:flex-start}
.be-file-edge .be-node{min-height:42px}
.be-inspector{margin-top:10px;border-top:1px solid var(--line);padding-top:9px}
.be-inspector-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:6px}
.be-inspector-head div{display:flex;flex-direction:column;gap:2px;min-width:0}
.be-inspector-head span{font-size:8px;color:var(--muted);letter-spacing:.08em}
.be-inspector-head b{font-size:11px;overflow-wrap:anywhere}
@media(max-width:760px){.be-graph-branches{grid-template-columns:1fr}}
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
