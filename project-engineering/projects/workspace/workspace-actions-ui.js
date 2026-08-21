(() => {
  const API = '/api/workspace-actions';
  const KEY_STORAGE = 'lb-workspace-save-key';
  let actionsOpen = false;
  let pollTimer = null;

  const style = document.createElement('style');
  style.textContent = `
    .workspace-action-btn{border:1px solid #283240;border-radius:999px;padding:5px 9px;background:#0f141b;color:#aeb8c4;font:inherit;font-size:9px;cursor:pointer}.workspace-action-btn:hover{border-color:#526f9b;color:#dce8ff}
    .wa-backdrop{position:fixed;inset:0;background:#0009;z-index:45;display:none;align-items:center;justify-content:center;padding:24px}.wa-backdrop.open{display:flex}
    .wa-panel{width:min(1100px,97vw);height:min(760px,94vh);display:grid;grid-template-rows:auto 1fr;border:1px solid #2a3543;border-radius:16px;background:#090c11;box-shadow:0 32px 100px #000c;overflow:hidden}
    .wa-head{display:flex;align-items:center;justify-content:space-between;padding:13px 16px;border-bottom:1px solid #222b37}.wa-head b{font-size:13px}.wa-head span{display:block;color:#778392;font-size:9px;margin-top:2px}.wa-close{border:0;background:transparent;color:#8895a5;font-size:20px;cursor:pointer}
    .wa-body{display:grid;grid-template-columns:330px 1fr;min-height:0}.wa-left{border-right:1px solid #222b37;padding:14px;overflow:auto}.wa-right{padding:14px;overflow:auto}
    .wa-section{border:1px solid #202a36;border-radius:12px;background:#0d1219;padding:12px;margin-bottom:10px}.wa-section h3{font-size:11px;margin:0 0 7px}.wa-section p,.wa-section li{font-size:10px;color:#8794a4}.wa-section ul{margin:6px 0 0;padding-left:17px}.wa-contract{white-space:pre-wrap;font:10px/1.55 ui-monospace,SFMono-Regular,Consolas,monospace;color:#9fb0c4}
    .wa-actions{display:grid;grid-template-columns:1fr 1fr;gap:7px}.wa-cap{border:1px solid #34445a;background:#101823;color:#bdd4f5;border-radius:8px;padding:10px;text-align:left;cursor:pointer}.wa-cap:hover{border-color:#6b8bb5}.wa-cap b{display:block;font-size:10px}.wa-cap span{display:block;color:#77889d;font-size:8px;margin-top:3px}
    .wa-input{width:100%;min-height:90px;border:1px solid #293341;background:#0a0e14;color:#e6edf5;border-radius:8px;padding:10px;resize:vertical;font:11px/1.5 ui-monospace,SFMono-Regular,Consolas,monospace;outline:none}.wa-input:focus{border-color:#526f9b}.wa-submit{width:100%;border:1px solid #45658e;background:#132033;color:#bcd5ff;border-radius:8px;padding:9px 12px;margin-top:8px;cursor:pointer}.wa-submit:disabled{opacity:.45;cursor:not-allowed}.wa-status{font-size:9px;color:#778392;margin-top:7px;min-height:14px}.wa-status.err{color:#ef8c8c}.wa-status.ok{color:#70d3a1}
    .wa-item{border:1px solid #202a36;border-radius:10px;background:#0c1118;padding:11px;margin-bottom:8px}.wa-item.pending{border-color:#8c6841}.wa-item.completed{border-color:#356b51}.wa-item.failed,.wa-item.blocked{border-color:#7f4545}.wa-row{display:flex;gap:8px;justify-content:space-between;align-items:flex-start}.wa-id{font:8px ui-monospace,SFMono-Regular,Consolas,monospace;color:#647387;word-break:break-all}.wa-pill{font-size:8px;border:1px solid #34445a;border-radius:999px;padding:2px 6px;color:#a8b8ca}.wa-title{font-size:10px;font-weight:700;margin:7px 0 4px}.wa-meta{font-size:9px;color:#778392}.wa-evidence{margin-top:8px;white-space:pre-wrap;max-height:220px;overflow:auto;border-top:1px solid #202a36;padding-top:8px;font:9px/1.5 ui-monospace,SFMono-Regular,Consolas,monospace;color:#9fb0c4}
    .wa-guide-button{width:100%;border:1px solid #3b4b61;background:#101722;color:#c5d6eb;border-radius:8px;padding:9px;cursor:pointer;margin-bottom:10px}
    @media(max-width:780px){.wa-body{grid-template-columns:1fr}.wa-left{border-right:0;border-bottom:1px solid #222b37;max-height:48vh}.wa-panel{height:96vh}.wa-actions{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  const backdrop = document.createElement('div');
  backdrop.className = 'wa-backdrop';
  backdrop.innerHTML = `
    <section class="wa-panel" role="dialog" aria-modal="true" aria-label="Governed local evidence actions">
      <header class="wa-head"><div><b>Governed Actions</b><span>Browser intent → durable request → LoopTool local evidence → explicit result</span></div><button class="wa-close" id="waClose" aria-label="Close">×</button></header>
      <div class="wa-body">
        <aside class="wa-left">
          <button class="wa-guide-button" id="waGuide" data-ai-control="read-operating-contract">AI README / OPERATING CONTRACT</button>
          <div class="wa-section" id="waContract" data-ai-contract="lb-workspace-action/v1">
            <h3>Browser AI operating contract</h3>
            <div class="wa-contract">PURPOSE
LB Workspace exposes repository truth plus governed local evidence requests.

RULES FOR ANY BROWSER AI
1. Read the current project state before requesting local evidence.
2. Use only the structured capabilities shown here. Do not invent a command or claim terminal access.
3. A REQUEST is intent only. It does not prove execution.
4. Wait for a RESULT from LoopTool before claiming anything was inspected locally.
5. Compare requested_capability/objective with resolved_operations in the result.
6. If they differ materially, report ACTION_MISMATCH and do not treat the result as satisfying the request.
7. Evidence-only actions do not authorize fixes, edits, reset, merge, rebase, delete, clean, or push.
8. Report only what the returned evidence proves. Preserve UNKNOWN / BLOCKED / UNVERIFIED states.
9. GitHub/project knowledge and local evidence are separate authorities; reconcile them explicitly.
10. For issue.inspect, state the exact issue/question in the objective field.

V1 CAPABILITIES
project.audit — Git identity/status/current remote relationship.
project.verify — audit plus bounded diff/file-state verification.
project.report-evidence — broader read-only evidence bundle for a report.
issue.inspect — bounded source/history search for one stated issue.

EXECUTION BOUNDARY
LoopTool resolves these capabilities into predetermined read-only collectors. This UI never grants arbitrary shell execution.</div>
          </div>
          <div class="wa-section">
            <h3>Request local evidence</h3>
            <div class="wa-actions">
              <button class="wa-cap" data-capability="project.audit" data-ai-action="project.audit"><b>Audit project</b><span>Git/workspace state</span></button>
              <button class="wa-cap" data-capability="project.verify" data-ai-action="project.verify"><b>Verify project</b><span>Audit + bounded diff</span></button>
              <button class="wa-cap" data-capability="project.report-evidence" data-ai-action="project.report-evidence"><b>Report evidence</b><span>Collect evidence; AI writes report</span></button>
              <button class="wa-cap" data-capability="issue.inspect" data-ai-action="issue.inspect"><b>Investigate issue</b><span>Bounded grep/history</span></button>
            </div>
            <div class="wa-meta" style="margin:10px 0 5px">Selected: <b id="waSelected">project.audit</b></div>
            <textarea class="wa-input" id="waObjective" placeholder="Optional audit/report scope. Required for issue.inspect. Example: repeated browserConversationRead without terminal progress"></textarea>
            <button class="wa-submit" id="waSubmit" data-ai-control="submit-governed-action">Create governed request</button>
            <div class="wa-status" id="waStatus"></div>
          </div>
        </aside>
        <main class="wa-right">
          <div class="wa-row" style="margin-bottom:10px"><div><b style="font-size:11px">Action journal</b><div class="wa-meta" id="waProject">—</div></div><button class="workspace-action-btn" id="waRefresh">Refresh</button></div>
          <div id="waList"></div>
        </main>
      </div>
    </section>`;
  document.body.appendChild(backdrop);

  const q = id => document.getElementById(id);
  const selectedEl = q('waSelected');
  const objectiveEl = q('waObjective');
  const statusEl = q('waStatus');
  const listEl = q('waList');
  let capability = 'project.audit';

  function projectId() { return currentProject?.id || null; }
  function setStatus(text, cls = '') { statusEl.className = `wa-status ${cls}`; statusEl.textContent = text || ''; }
  function safeJson(value) { try { return JSON.stringify(value, null, 2); } catch { return String(value); } }
  function escText(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  async function api(url, options) {
    const response = await fetch(url, options);
    const body = await response.json().catch(() => ({}));
    if (!response.ok || body.ok === false) {
      const detail = body.detail ? `: ${body.detail}` : '';
      const error = new Error(`${body.error || `HTTP_${response.status}`}${detail}`);
      error.status = response.status;
      error.body = body;
      throw error;
    }
    return body;
  }

  function choose(next) {
    capability = next;
    selectedEl.textContent = next;
    document.querySelectorAll('.wa-cap').forEach(x => x.style.outline = x.dataset.capability === next ? '1px solid #7da9ff' : '');
    objectiveEl.placeholder = next === 'issue.inspect'
      ? 'Required: state the exact issue/question to inspect locally.'
      : 'Optional scope/question for this evidence request.';
  }

  async function saveKey() {
    let key = sessionStorage.getItem(KEY_STORAGE) || '';
    if (!key) {
      key = window.prompt('Workspace save key (kept only for this browser session):') || '';
      if (key) sessionStorage.setItem(KEY_STORAGE, key);
    }
    return key;
  }

  async function submit() {
    const project = projectId();
    if (!project) return;
    const objective = objectiveEl.value.trim();
    if (capability === 'issue.inspect' && !objective) return setStatus('issue.inspect requires an exact issue/question.', 'err');
    const key = await saveKey();
    if (!key) return setStatus('Request cancelled: save key required.', 'err');
    q('waSubmit').disabled = true;
    setStatus(`Creating ${capability} request…`);
    try {
      const data = await api(API, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-workspace-save-key': key },
        body: JSON.stringify({
          operation: 'request', project, capability, objective,
          scope: 'current-workspace', requested_by: 'lb-workspace-browser-ai-or-user'
        })
      });
      objectiveEl.value = '';
      setStatus(`Queued ${data.request.request_id}`, 'ok');
      await refresh();
    } catch (error) {
      if (error.status === 401) sessionStorage.removeItem(KEY_STORAGE);
      setStatus(error.message, 'err');
    } finally { q('waSubmit').disabled = false; }
  }

  function renderItem(entry) {
    const req = entry.request || {};
    const result = entry.result || null;
    const state = result?.status || 'pending';
    const operations = result?.resolved_operations || [];
    const mismatch = result && result.requested_capability && result.resolved_capability && result.requested_capability !== result.resolved_capability;
    return `<article class="wa-item ${escText(state)}" data-request-id="${escText(req.request_id)}" data-action-state="${escText(state)}">
      <div class="wa-row"><div class="wa-id">${escText(req.request_id)}</div><span class="wa-pill">${escText(state.toUpperCase())}</span></div>
      <div class="wa-title">${escText(req.capability || 'unknown')}</div>
      <div class="wa-meta">Objective: ${escText(req.objective || '—')}</div>
      <div class="wa-meta">Requested: ${escText(req.capability || '—')} · Resolved: ${escText(result?.resolved_capability || 'waiting')}</div>
      ${mismatch ? '<div class="wa-meta" style="color:#ef8c8c;font-weight:700">ACTION_MISMATCH — requested and resolved capabilities differ.</div>' : ''}
      ${result ? `<div class="wa-meta">Classification: ${escText(result.classification || '—')} · Executor: ${escText(result.executor || '—')}</div>
      <div class="wa-evidence">RESOLVED OPERATIONS\n${escText(operations.join('\n') || '—')}\n\nEVIDENCE\n${escText(safeJson(result.evidence || {}))}${result.error ? `\n\nERROR\n${escText(result.error)}` : ''}</div>` : '<div class="wa-evidence">REQUEST RECORDED. LOCAL EXECUTION NOT YET PROVEN.</div>'}
    </article>`;
  }

  async function refresh() {
    const project = projectId();
    if (!project) return;
    q('waProject').textContent = `${currentProject.name} · ${project}`;
    try {
      const data = await api(`${API}?project=${encodeURIComponent(project)}&state=recent&_=${Date.now()}`);
      listEl.innerHTML = data.items.length ? data.items.map(renderItem).join('') : '<div class="wa-section"><p>No action requests yet.</p></div>';
    } catch (error) {
      listEl.innerHTML = `<div class="wa-section"><p style="color:#ef8c8c">${escText(error.message)}</p></div>`;
    }
  }

  function openActions() {
    if (!projectId()) return;
    actionsOpen = true;
    backdrop.classList.add('open');
    refresh();
    clearInterval(pollTimer);
    pollTimer = setInterval(() => { if (actionsOpen) refresh(); }, 5000);
  }

  function closeActions() {
    actionsOpen = false;
    backdrop.classList.remove('open');
    clearInterval(pollTimer);
    pollTimer = null;
  }

  function installButtons() {
    const badges = document.querySelector('.badges');
    if (!badges) return;
    if (!document.getElementById('workspaceActionsBtn')) {
      const button = document.createElement('button');
      button.id = 'workspaceActionsBtn';
      button.className = 'workspace-action-btn';
      button.textContent = 'ACTIONS';
      button.title = 'Create governed LoopTool local evidence requests';
      button.dataset.aiTool = 'governed-local-actions';
      button.onclick = openActions;
      badges.prepend(button);
    }
    if (!document.getElementById('workspaceAiGuideBtn')) {
      const button = document.createElement('button');
      button.id = 'workspaceAiGuideBtn';
      button.className = 'workspace-action-btn';
      button.textContent = 'AI README';
      button.title = 'Operating contract for browser AIs';
      button.dataset.aiTool = 'read-operating-contract';
      button.onclick = openActions;
      badges.prepend(button);
    }
  }

  document.querySelectorAll('.wa-cap').forEach(button => button.onclick = () => choose(button.dataset.capability));
  q('waSubmit').onclick = submit;
  q('waRefresh').onclick = refresh;
  q('waClose').onclick = closeActions;
  q('waGuide').onclick = () => q('waContract').scrollIntoView({ behavior: 'smooth', block: 'start' });
  backdrop.addEventListener('click', event => { if (event.target === backdrop) closeActions(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && actionsOpen) closeActions(); });
  choose('project.audit');
  installButtons();
})();
