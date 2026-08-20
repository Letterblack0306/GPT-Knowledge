(() => {
  const API = '/api/workspace-text';
  const KEY_STORAGE = 'lb-workspace-save-key';
  let kind = 'notes';
  let selectedName = null;
  let loadedSha = null;

  const style = document.createElement('style');
  style.textContent = `
    .workspace-text-btn{border:1px solid #283240;border-radius:999px;padding:5px 9px;background:#0f141b;color:#aeb8c4;font:inherit;font-size:9px;cursor:pointer}.workspace-text-btn:hover{border-color:#526f9b;color:#dce8ff}
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
})();
