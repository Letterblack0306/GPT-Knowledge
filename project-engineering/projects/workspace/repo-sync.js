(() => {
  const API = '/api/save-workspace-state';
  const REMOTE_STATE = id => `../workspace-state/${id}.json`;
  const originalSelect = window.select;
  const originalPutState = window.putState;
  let saveButton;
  let syncBadge;

  function setSync(text, mode = '') {
    if (!syncBadge) return;
    syncBadge.textContent = text;
    syncBadge.dataset.mode = mode;
    syncBadge.style.borderColor = mode === 'ok' ? '#35634e' : mode === 'error' ? '#6b3b3b' : '#283240';
    syncBadge.style.color = mode === 'ok' ? '#65d29a' : mode === 'error' ? '#e07a7a' : '#778392';
  }

  function stateKeyFor(id) {
    return `${STORE_PREFIX}${id}`;
  }

  function cleanForRepo(state) {
    return {
      done: state?.done || {},
      pin: state?.pin || null,
      notes: Array.isArray(state?.notes) ? state.notes : [],
      phaseNotes: state?.phaseNotes || {},
      refs: state?.refs || {}
    };
  }

  async function hydrateFromRepo(id) {
    const localKey = stateKeyFor(id);
    let local = null;
    try { local = JSON.parse(localStorage.getItem(localKey) || 'null'); } catch {}
    if (local?._dirty) {
      setSync('LOCAL CHANGES', '');
      return;
    }

    try {
      const r = await fetch(`${REMOTE_STATE(id)}?v=${Date.now()}`);
      if (r.status === 404) {
        setSync('NOT SAVED', '');
        return;
      }
      if (!r.ok) throw new Error(`state ${r.status}`);
      const remote = await r.json();
      const next = {
        ...emptyState(),
        done: remote.done || {},
        pin: remote.pin || null,
        notes: Array.isArray(remote.notes) ? remote.notes : [],
        phaseNotes: remote.phaseNotes || {},
        refs: remote.refs || {},
        _dirty: false,
        _repoSavedAt: remote.saved_at || null
      };
      localStorage.setItem(localKey, JSON.stringify(next));
      setSync(remote.saved_at ? 'REPO SYNCED' : 'REPO STATE', 'ok');
    } catch (error) {
      console.warn('[workspace repo sync] hydrate failed', error);
      setSync('SYNC UNKNOWN', 'error');
    }
  }

  window.putState = function patchedPutState(state) {
    const next = { ...state, _dirty: true };
    localStorage.setItem(stateKey(), JSON.stringify(next));
    setSync('LOCAL CHANGES', '');
  };

  window.select = async function patchedSelect(id) {
    await hydrateFromRepo(id);
    return originalSelect(id);
  };

  async function saveToRepo() {
    if (!active) return;
    let key = sessionStorage.getItem('lb-workspace-save-key') || '';
    if (!key) {
      key = prompt('Workspace save key');
      if (!key) return;
      sessionStorage.setItem('lb-workspace-save-key', key);
    }

    saveButton.disabled = true;
    setSync('SAVING…', '');
    try {
      const state = getState();
      const r = await fetch(API, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-workspace-save-key': key
        },
        body: JSON.stringify({ project: active, state: cleanForRepo(state) })
      });
      const result = await r.json().catch(() => ({}));
      if (r.status === 401) {
        sessionStorage.removeItem('lb-workspace-save-key');
        throw new Error('Invalid workspace save key');
      }
      if (!r.ok || !result.ok) throw new Error(result.error || `Save failed (${r.status})`);
      const next = { ...getState(), _dirty: false, _repoSavedAt: new Date().toISOString() };
      localStorage.setItem(stateKey(), JSON.stringify(next));
      setSync('SAVED TO REPO', 'ok');
      saveButton.title = result.commit ? `Committed ${result.commit.slice(0, 8)}` : 'Saved to GPT-Knowledge';
    } catch (error) {
      console.error('[workspace repo sync] save failed', error);
      setSync(error.message === 'Invalid workspace save key' ? 'BAD SAVE KEY' : 'SAVE FAILED', 'error');
      alert(error.message || 'Save failed');
    } finally {
      saveButton.disabled = false;
    }
  }

  function installUi() {
    const right = document.querySelector('.top-right');
    if (!right || document.getElementById('saveRepo')) return;

    saveButton = document.createElement('button');
    saveButton.className = 'top-action';
    saveButton.id = 'saveRepo';
    saveButton.textContent = 'Save to GPT-Knowledge';
    saveButton.onclick = saveToRepo;

    syncBadge = document.createElement('span');
    syncBadge.className = 'badge';
    syncBadge.id = 'repoSyncState';
    syncBadge.textContent = 'LOCAL ONLY';

    right.insertBefore(saveButton, right.firstChild);
    right.insertBefore(syncBadge, saveButton.nextSibling);
  }

  installUi();

  // load() has already been declared by the workspace script but normally has not
  // completed network work by the time this script executes. If a project is already
  // active, preserve local edits and only report their state; next project selection
  // will hydrate from the committed JSON before rendering.
  if (active) {
    const s = getState();
    setSync(s?._dirty ? 'LOCAL CHANGES' : (s?._repoSavedAt ? 'REPO SYNCED' : 'LOCAL ONLY'), s?._repoSavedAt && !s?._dirty ? 'ok' : '');
  }
})();
