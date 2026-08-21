(() => {
  const API = '/api/workspace-text';
  const KEY_STORAGE = 'lb-workspace-save-key';
  let kind = 'notes';
  let selectedName = null;
  let loadedSha = null;

  const style = document.createElement('style');
  style.textContent = `
    .workspace-text-btn{border:1px solid #283240;border-radius:999px;padding:5px 9px;background:#0f141b;color:#aeb8c4;font:inherit;font-size:9px;cursor:pointer}.workspace-text-btn:hover{border-color:#526f9b;color:#dce8ff}
    .plan-truth-badge{border:1px solid #435064;border-radius:999px;padding:5px 8px;font-size:9px;font-weight:800;letter-spacing:.03em;white-space:nowrap}.plan-truth-badge.documented{border-color:#65d29a;color:#8ee0b3;background:#0e1914}.plan-truth-badge.pending{border-color:#f0bd63;color:#f5cc79;background:#19150d}.plan-truth-badge.stale,.plan-truth-badge.blocked{border-color:#ef7f7f;color:#f4a0a0;background:#1b1011}.plan-truth-badge.none{color:#8794a4;background:#0f141b}
    .plan-truth-card{border:1px solid #2b3542;border-radius:12px;background:#0d1219;padding:12px;margin-bottom:12px}.plan-truth-card.documented{border:2px solid #65d29a;background:#0e1914}.plan-truth-card.pending{border:2px solid #f0bd63;background:#19150d}.plan-truth-card.stale,.plan-truth-card.blocked{border:2px solid #ef7f7f;background:#1b1011}.plan-truth-card .pt-label{font-size:8px;letter-spacing:.1em;text-transform:uppercase;color:#778392;margin-bottom:7px}.plan-truth-card .pt-state{font-size:11px;font-weight:800;margin-bottom:8px}.plan-truth-card.documented .pt-state{color:#d7f6e5}.plan-truth-card.pending .pt-state{color:#ffe3a3}.plan-truth-card.stale .pt-state,.plan-truth-card.blocked .pt-state{color:#ffd0d0}.plan-truth-grid{display:grid;grid-template-columns:94px minmax(0,1fr);gap:5px 8px;font-size:9px}.plan-truth-grid dt{color:#647184}.plan-truth-grid dd{margin:0;color:#9eabb9;overflow-wrap:anywhere}.plan-truth-grid a{color:#9ec0ff;text-decoration:none}.plan-truth-grid a:hover{text-decoration:underline}.plan-truth-warning{margin-top:8px;padding-top:8px;border-top:1px solid #2b3542;color:#9aa6b4;font-size:9px;line-height:1.45}
    .wt-backdrop{position:fixed;inset:0;background:#0009;z-index:40;display:none;align-items:center;justify-content:center;padding:24px}.wt-backdrop.open{display:flex}
    .wt-panel{width:min(980px,96vw);height:min(720px,92vh);display:grid;grid-template-rows:auto 1fr;border:1px solid #2a3543;border-radius:16px;background:#090c11;box-shadow:0 32px 100px #000c;overflow:hidden}
    .wt-head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid #222b37}.wt-head-left{display:flex;align-items:center;gap:12px}.wt-title{font-weight:800}.wt-project{font-size:10px;color:#778392}.wt-close{border:0;background:transparent;color:#8895a5;font-size:20px;cursor:pointer}
    .wt-body{display:grid;grid-template-columns:250px 1fr;min-height:0}.wt-side{border-right:1px solid #222b37;padding:12px;overflow:auto}.wt-tabs{display:flex;gap:6px;margin-bottom:10px}.wt-tab{flex:1;border:1px solid #252e3a;background:#0d1219;color:#8290a0;border-radius:8px;padding:8px;font-size:10px;cursor:pointer}.wt-tab.active{border-color:#526f9b;color:#b9d2ff;background:#0d1520}
    .wt-new{width:100%;border:1px solid #2f3c4c;background:#121923;color:#dce8f7;border-radius:8px;padding:9px;margin-bottom:10px;cursor:pointer}.wt-list{display:flex;flex-direction:column;gap:5px}.wt-file{border:1px solid transparent;background:transparent;color:#9aa6b4;border-radius:7px;padding:9px;text-align:left;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.wt-file:hover{background:#0f141b}.wt-file.active{background:#121923;border-color:#2d3a4b;color:#fff}
    .wt-editor{display:grid;grid-template-rows:auto 1fr auto;min-width:0;min-height:0}.wt-toolbar{display:grid;grid-template-columns:minmax(0,1fr) 100px auto;gap:8px;padding:12px;border-bottom:1px solid #222b37}.wt-name,.wt-ext{border:1px solid #293341;background:#0d1117;color:#eef3f8;border-radius:8px;padding:9px 10px;outline:none}.wt-name:focus,.wt-ext:focus{border-color:#526f9b}.wt-text{width:100%;height:100%;resize:none;border:0;outline:0;background:#080a0e;color:#dbe4ee;padding:18px;font:12px/1.6 ui-monospace,SFMono-Regular,Consolas,monospace;tab-size:2}.wt-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 12px;border-top:1px solid #222b37}.wt-status{font-size:10px;color:#778392;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.wt-save{border:1px solid #45658e;background:#132033;color:#bcd5ff;border-radius:8px;padding:8px 13px;cursor:pointer}.wt-save:disabled{opacity:.45;cursor:not-allowed}.wt-error{color:#ef8c8c}.wt-ok{color:#70d3a1}
    @media(max-width:720px){.wt-body{grid-template-columns:1fr}.wt-side{display:none}.wt-toolbar{grid-template-columns:1fr 90px}.wt-save{grid-column:1/-1}.wt-panel{height:94vh}}
  `;
  document.head.appendChild(style);

  const backdrop = document.createElement('div');
  backdrop.className = 'wt-backdrop';
  backdrop.innerHTML = `
    <section class="wt-panel" role="dialog" aria-modal="true" aria-label="Workspace notes and documents">
      <header class="wt-head"><div class="wt-head-left"><div class="wt-title">Workspace Text</div><div class="wt-project" id="wtProject">—</div></div><button class="wt-close" id="wtClose" aria-label="Close">×</button></header>
      <div class="wt-body">
        <aside class="wt-side">
          <div class="wt-tabs"><button class="wt-tab active" data-kind="notes">Notes</button><button class="wt-tab" data-kind="documents">Documents</button></div>
          <button class="wt-new" id="wtNew">+ New text file</button>
          <div class="wt-list" id="wtList"></div>
        </aside>
        <main class="wt-editor">
          <div class="wt-toolbar"><input class="wt-name" id="wtName" placeholder="filename" maxlength="110"><select class="wt-ext" id="wtExt"><option value=".md">.md</option><option value=".txt">.txt</option><option value=".json">.json</option></select><button class="wt-save" id="wtSave">Save to repo</button></div>
          <textarea class="wt-text" id="wtText" spellcheck="false" placeholder="Select a file or create a new one…"></textarea>
          <div class="wt-foot"><div class="wt-status" id="wtStatus">GitHub main is the storage authority.</div><div style="font-size:9px;color:#526071">Markdown · TXT · JSON · max 1 MB</div></div>
        </main>
      </div>
    </section>`;
  document.body.appendChild(backdrop);

  const q = id => document.getElementById(id);
  const projectLabel = q('wtProject');
  const listEl = q('wtList');
  const nameEl = q('wtName');
  const extEl = q('wtExt');
  const textEl = q('wtText');
  const saveEl = q('wtSave');
  const statusEl = q('wtStatus');

  function projectId() { return currentProject?.id || null; }
  function setStatus(text, cls = '') { statusEl.className = `wt-status ${cls}`; statusEl.textContent = text; }
  function splitName(filename) {
    const m = String(filename || '').match(/^(.*?)(\.md|\.txt|\.json)$/i);
    return m ? { base: m[1], ext: m[2].toLowerCase() } : { base: filename || '', ext: '.md' };
  }
  function fullName() {
    const base = nameEl.value.trim().replace(/\.(md|txt|json)$/i, '');
    return `${base}${extEl.value}`;
  }

  async function api(url, options) {
    const response = await fetch(url, options);
    const body = await response.json().catch(() => ({}));
    if (!response.ok || body.ok === false) {
      const error = new Error(body.error || `HTTP_${response.status}`);
      error.body = body;
      error.status = response.status;
      throw error;
    }
    return body;
  }

  function resetEditor() {
    selectedName = null;
    loadedSha = null;
    nameEl.value = '';
    extEl.value = '.md';
    textEl.value = '';
    [...listEl.children].forEach(x => x.classList.remove('active'));
    setStatus('New file. Choose a name and save to GitHub main.');
  }

  async function loadList() {
    const project = projectId();
    if (!project) return;
    projectLabel.textContent = `${currentProject.name} · ${kind}`;
    listEl.innerHTML = '<div style="padding:10px;color:#667384;font-size:10px">Loading…</div>';
    try {
      const data = await api(`${API}?project=${encodeURIComponent(project)}&kind=${encodeURIComponent(kind)}`);
      listEl.innerHTML = '';
      if (!data.files.length) listEl.innerHTML = '<div style="padding:10px;color:#667384;font-size:10px">No files yet.</div>';
      for (const file of data.files) {
        const button = document.createElement('button');
        button.className = 'wt-file';
        button.textContent = file.name;
        button.title = file.path;
        button.onclick = () => openFile(file.name, button);
        listEl.appendChild(button);
      }
    } catch (error) {
      listEl.innerHTML = '<div class="wt-error" style="padding:10px;font-size:10px">Failed to load repo files.</div>';
      setStatus(error.message, 'wt-error');
    }
  }

  async function openFile(name, button) {
    const project = projectId();
    setStatus(`Loading ${name}…`);
    try {
      const data = await api(`${API}?project=${encodeURIComponent(project)}&kind=${encodeURIComponent(kind)}&name=${encodeURIComponent(name)}`);
      selectedName = name;
      loadedSha = data.sha || null;
      const parts = splitName(name);
      nameEl.value = parts.base;
      extEl.value = parts.ext;
      textEl.value = data.content || '';
      [...listEl.children].forEach(x => x.classList.remove('active'));
      button?.classList.add('active');
      setStatus(`${data.path} · loaded from GitHub main`, 'wt-ok');
    } catch (error) {
      setStatus(error.message, 'wt-error');
    }
  }

  async function save() {
    const project = projectId();
    if (!project) return;
    const name = fullName();
    if (!name || name.startsWith('.')) return setStatus('Enter a filename.', 'wt-error');

    let key = sessionStorage.getItem(KEY_STORAGE) || '';
    if (!key) {
      key = window.prompt('Workspace save key (kept only for this browser session):') || '';
      if (!key) return setStatus('Save cancelled: key required.', 'wt-error');
      sessionStorage.setItem(KEY_STORAGE, key);
    }

    saveEl.disabled = true;
    setStatus(`Saving ${name} to GitHub main…`);
    try {
      const data = await api(API, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-workspace-save-key': key },
        body: JSON.stringify({ project, kind, name, content: textEl.value })
      });
      selectedName = name;
      loadedSha = data.file_sha || null;
      setStatus(`Saved · commit ${(data.commit || '').slice(0, 10)} · ${data.path}`, 'wt-ok');
      await loadList();
      const match = [...listEl.children].find(x => x.textContent === name);
      match?.classList.add('active');
    } catch (error) {
      if (error.status === 401) sessionStorage.removeItem(KEY_STORAGE);
      setStatus(error.status === 401 ? 'Invalid save key. It was cleared; save again to retry.' : error.message, 'wt-error');
    } finally {
      saveEl.disabled = false;
    }
  }

  function openPanel() {
    if (!projectId()) return;
    projectLabel.textContent = `${currentProject.name} · ${kind}`;
    backdrop.classList.add('open');
    resetEditor();
    loadList();
  }

  function installButton() {
    const badges = document.querySelector('.badges');
    if (!badges || document.getElementById('workspaceTextBtn')) return;
    const button = document.createElement('button');
    button.id = 'workspaceTextBtn';
    button.className = 'workspace-text-btn';
    button.textContent = 'NOTES / DOCS';
    button.title = 'Edit repo-backed project notes and text documents';
    button.onclick = openPanel;
    badges.prepend(button);
  }

  function planTruthData() {
    const explicit = currentStatus?.plan_truth || currentPlan?.plan_truth || null;
    if (explicit) {
      return {
        state: String(explicit.state || 'DOCUMENTATION_PENDING'),
        document: explicit.document || currentProject?.plan_file || '',
        revision: explicit.document_revision || explicit.revision || currentStatus?.source_head || '',
        verifiedAt: explicit.verified_at || currentStatus?.verified_at || '',
        activeGate: explicit.active_gate || currentStatus?.active?.id || currentPlan?.active_node || currentProject?.active_node || '',
        nextQuestion: explicit.next_single_question || currentStatus?.next_acceptance?.question || '',
        source: 'explicit plan_truth metadata'
      };
    }
    if (!currentProject?.mapped || !currentProject?.plan_file) {
      return { state:'NO_ACTIVE_PLAN', document:'', revision:'', verifiedAt:currentStatus?.verified_at || '', activeGate:'', nextQuestion:'', source:'project registry' };
    }
    return {
      state:'DOCUMENTATION_PENDING',
      document:currentProject.plan_file,
      revision:currentStatus?.source_head || '',
      verifiedAt:currentStatus?.verified_at || '',
      activeGate:currentStatus?.active?.id || currentPlan?.active_node || currentProject?.active_node || '',
      nextQuestion:currentStatus?.next_acceptance?.question || '',
      source:'plan/status files exist but plan_truth metadata is not declared'
    };
  }

  function planTruthTone(state) {
    if (state === 'DOCUMENTED_CURRENT') return 'documented';
    if (state === 'DOCUMENTED_STALE') return 'stale';
    if (state === 'DOCUMENTATION_BLOCKED' || state === 'PLAN_OWNER_MISSING') return 'blocked';
    if (state === 'NO_ACTIVE_PLAN') return 'none';
    return 'pending';
  }

  function planHref(path) {
    const value = String(path || '');
    if (!value) return '';
    try { return new URL(value, location.href).toString(); } catch { return ''; }
  }

  function renderPlanTruth() {
    const badges = document.querySelector('.badges');
    const statusRoot = document.getElementById('statusContent');
    if (!badges || !statusRoot) return;
    const data = planTruthData();
    const tone = planTruthTone(data.state);

    let badge = document.getElementById('planTruthBadge');
    if (!badge) {
      badge = document.createElement('span');
      badge.id = 'planTruthBadge';
      badges.prepend(badge);
    }
    badge.className = `plan-truth-badge ${tone}`;
    badge.textContent = `PLAN · ${data.state}`;
    badge.title = data.state === 'DOCUMENTED_CURRENT'
      ? 'The active plan is explicitly documented in the repository-backed project projection.'
      : 'Plan truth is not currently classified as DOCUMENTED_CURRENT.';

    let card = document.getElementById('planTruthCard');
    if (!card) {
      card = document.createElement('section');
      card.id = 'planTruthCard';
      statusRoot.prepend(card);
    }
    const href = planHref(data.document);
    const documentValue = data.document
      ? (href ? `<a href="${href}" target="_blank" rel="noopener">${String(data.document).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</a>` : String(data.document))
      : '—';
    const escText = value => String(value || '—').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    card.className = `plan-truth-card ${tone}`;
    card.innerHTML = `
      <div class="pt-label">Plan truth</div>
      <div class="pt-state">${escText(data.state)}</div>
      <dl class="plan-truth-grid">
        <dt>Plan document</dt><dd>${documentValue}</dd>
        <dt>Revision</dt><dd>${escText(data.revision)}</dd>
        <dt>Last verified</dt><dd>${escText(data.verifiedAt)}</dd>
        <dt>Active gate</dt><dd>${escText(data.activeGate)}</dd>
        <dt>Next question</dt><dd>${escText(data.nextQuestion)}</dd>
      </dl>
      <div class="plan-truth-warning">${data.state === 'DOCUMENTED_CURRENT'
        ? 'Repository-backed plan metadata is the durable planning projection. Chat text is not the plan authority.'
        : `Not authoritative as current plan truth. Source: ${escText(data.source)}.`}</div>`;
  }

  function watchPlanTruth() {
    let lastKey = '';
    const refresh = () => {
      const key = [currentProject?.id,currentStatus?.verified_at,currentStatus?.source_head,currentStatus?.plan_truth?.state,currentPlan?.plan_truth?.state,currentPlan?.active_node].join('|');
      if (key !== lastKey) { lastKey = key; renderPlanTruth(); }
    };
    refresh();
    const observer = new MutationObserver(refresh);
    const classBadge = document.getElementById('classBadge');
    const verifiedAt = document.getElementById('verifiedAt');
    if (classBadge) observer.observe(classBadge,{childList:true,subtree:true,characterData:true});
    if (verifiedAt) observer.observe(verifiedAt,{childList:true,subtree:true,characterData:true});
    window.addEventListener('hashchange',()=>setTimeout(refresh,0));
  }

  q('wtClose').onclick = () => backdrop.classList.remove('open');
  backdrop.addEventListener('click', e => { if (e.target === backdrop) backdrop.classList.remove('open'); });
  q('wtNew').onclick = resetEditor;
  saveEl.onclick = save;
  document.querySelectorAll('.wt-tab').forEach(button => button.onclick = () => {
    kind = button.dataset.kind;
    document.querySelectorAll('.wt-tab').forEach(x => x.classList.toggle('active', x === button));
    resetEditor();
    loadList();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && backdrop.classList.contains('open')) backdrop.classList.remove('open'); });

  installButton();
  watchPlanTruth();

  const actionsScript = document.createElement('script');
  actionsScript.src = './workspace-actions-ui.js';
  actionsScript.dataset.workspaceExtension = 'governed-actions';
  document.body.appendChild(actionsScript);
})();
