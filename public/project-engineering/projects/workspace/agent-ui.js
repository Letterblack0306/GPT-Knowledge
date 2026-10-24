/* Live Agent panel — additive only.
 *
 * Renders only for the Access Browser Agent workspace. Talks only to the LAN
 * Live Agent Gateway (outbound WS); browsers may submit instructions only,
 * never raw tool calls.
 */
(() => {
  const GATEWAY_WS = (() => {
    if (window.LB_AGENT_GATEWAY_WS) return window.LB_AGENT_GATEWAY_WS;
    const secure = location.protocol === 'https:' ? 'wss' : 'ws';
    return `${secure}://${location.hostname}:8081/ws/browser`;
  })();
  const PROJECT_ID = 'access-browser-agent';
  const STYLE_ID = 'lb-agent-ui-style';

  let ws = null;
  let sessionId = sessionStorage.getItem('lb-agent-session-id') || null;
  let lastSequence = 0;
  let pendingInstruction = null;
  const toolBoxes = new Map();

  function esc(s) {
    return String(s ?? '').replace(/[&<>\"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c]));
  }

  function $(id) { return document.getElementById(id); }
  function currentProjectId() {
    if (window.__workspaceCurrentProjectId) return String(window.__workspaceCurrentProjectId);
    return (location.hash || `#${PROJECT_ID}`).slice(1) || PROJECT_ID;
  }
  function isAccessProject() { return currentProjectId() === PROJECT_ID; }
  function setStatus(text, ok) { const el = $('lb-agent-status'); if (el) { el.textContent = text; el.className = ok ? 'ok' : 'bad'; } }
  function send(obj) { if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(obj)); }
  function addMsg(cls, text) {
    const t = $('lb-agent-transcript'); if (!t) return;
    const div = document.createElement('div');
    div.className = `lb-agent-msg ${cls}`;
    div.textContent = text;
    t.appendChild(div);
  }
  function toolEl(name) {
    const t = $('lb-agent-transcript'); if (!t) return { badge: null, pre: null };
    const d = document.createElement('details');
    d.className = 'lb-agent-tool';
    const s = document.createElement('summary');
    const n = document.createElement('span'); n.className = 'tname'; n.textContent = name || '?';
    const b = document.createElement('span'); b.className = 'badge'; b.textContent = 'RUNNING';
    s.append(n, b);
    const pre = document.createElement('pre');
    d.append(s, pre);
    t.appendChild(d);
    return { badge: b, pre };
  }

  function ensureStyle() {
    if ($(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
#lb-agent-section{margin:40px 42px 60px;border:1px solid var(--line);border-radius:18px;background:#0b0f15cc;padding:16px;text-align:left}
#lb-agent-section h2{margin:0 0 10px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
#lb-agent-status{font-size:9px;border:1px solid var(--line);border-radius:999px;padding:2px 8px;margin-left:8px}
#lb-agent-status.ok{color:var(--green)} #lb-agent-status.bad{color:var(--red)}
#lb-agent-controls{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
#lb-agent-controls select,#lb-agent-controls input,#lb-agent-controls button{background:var(--panel2);border:1px solid var(--line);color:var(--text);padding:8px 12px;border-radius:8px;font-size:12px}
#lb-agent-input{flex:1;min-width:240px}
.lb-agent-msg{margin:8px 0;padding:8px 12px;border-radius:8px;background:#0e131a;border-left:3px solid #303948;white-space:pre-wrap;font-size:11px}
.lb-agent-msg.user{border-left-color:var(--blue)}
.lb-agent-msg.assistant{border-left-color:var(--green)}
.lb-agent-msg.final{border-left-color:var(--amber);background:#151208}
.lb-agent-msg.err{border-left-color:var(--red);color:#ffb3ac}
.lb-agent-tool{margin:8px 0;border:1px solid var(--line);border-radius:8px;overflow:hidden}
.lb-agent-tool summary{cursor:pointer;padding:7px 12px;background:#0e131a;display:flex;gap:10px;align-items:center;list-style:none}
.lb-agent-tool summary::before{content:'\\25B8'}
.lb-agent-tool[open] summary::before{content:'\\25BE'}
.lb-agent-tool .tname{font-weight:600;color:var(--amber)}
.lb-agent-tool .badge{font-size:9px;padding:1px 7px;border-radius:999px;border:1px solid var(--line)}
.lb-agent-tool pre{margin:0;padding:8px 12px;font-size:10px;overflow-x:auto;background:#090c11}`;
    document.head.appendChild(style);
  }

  function build() {
    if (!isAccessProject()) return;
    const board = document.querySelector('.board');
    if (!board || $('lb-agent-section')) return;
    ensureStyle();

    const section = document.createElement('section');
    section.id = 'lb-agent-section';
    section.innerHTML = `
      <h2>Agent <span id="lb-agent-status">connecting…</span></h2>
      <div id="lb-agent-controls">
        <input id="lb-agent-input" placeholder="Instruction for the Access Browser Agent (e.g. Check why xxxxx might have an issue)">
        <button id="lb-agent-run">Run</button>
        <button id="lb-agent-cancel">Cancel</button>
      </div>
      <div id="lb-agent-transcript"></div>`;
    board.appendChild(section);

    $('lb-agent-run').onclick = () => {
      const content = $('lb-agent-input').value.trim();
      if (!content || !ws || ws.readyState !== WebSocket.OPEN) return;
      if (!sessionId) {
        pendingInstruction = content;
        send({ type: 'session.create', project: currentProjectId() });
      } else {
        send({ type: 'instruction.submit', session_id: sessionId, content });
      }
      $('lb-agent-input').value = '';
    };
    $('lb-agent-cancel').onclick = () => sessionId && send({ type: 'session.cancel', session_id: sessionId });
    $('lb-agent-input').addEventListener('keydown', e => { if (e.key === 'Enter') $('lb-agent-run').click(); });
  }

  function handleEvent(ev) {
    if (typeof ev.sequence !== 'number' || ev.sequence <= lastSequence) return;
    lastSequence = ev.sequence;
    switch (ev.type) {
      case 'session.created': addMsg('', `Session created (${ev.payload.project})`); break;
      case 'instruction.accepted': addMsg('user', ev.payload.content); break;
      case 'assistant.started': break;
      case 'assistant.text.delta': addMsg('assistant', ev.payload.text); break;
      case 'tool.requested': case 'tool.started':
        toolBoxes.set(ev.sequence, toolEl(ev.payload.name));
        break;
      case 'tool.completed': case 'tool.failed': {
        const seqs = [...toolBoxes.keys()];
        const box = toolBoxes.get(seqs[seqs.length - 1]);
        if (box?.badge) {
          const failed = ev.type === 'tool.failed';
          box.badge.textContent = failed ? 'FAILED' : 'COMPLETE';
          box.badge.style.color = failed ? 'var(--red)' : 'var(--green)';
          box.pre.textContent = failed
            ? String(ev.payload.error)
            : JSON.stringify(ev.payload.result ?? ev.payload, null, 2).slice(0, 8000);
        }
        break;
      }
      case 'session.completed': addMsg('final', 'Final: ' + (ev.payload.final_answer || '(empty)')); break;
      case 'session.failed': addMsg('err', `SESSION FAILED [${ev.payload.code}] ${ev.payload.error || ''}`); break;
      case 'session.cancelled': addMsg('err', 'Session cancelled.'); break;
      default: break;
    }
  }

  function handle(msg) {
    if (typeof msg.sequence === 'number') return void handleEvent(msg);
    switch (msg.type) {
      case 'session.created':
        sessionId = msg.session.session_id;
        sessionStorage.setItem('lb-agent-session-id', sessionId);
        if (pendingInstruction) {
          const content = pendingInstruction; pendingInstruction = null;
          setTimeout(() => send({ type: 'instruction.submit', session_id: sessionId, content }), 50);
        }
        break;
      case 'session.error': addMsg('err', `Gateway: ${msg.error}`); break;
    }
  }

  function disconnect() {
    if (!ws) return;
    const socket = ws;
    ws = null;
    socket.onclose = null;
    try { socket.close(); } catch {}
  }

  function connect() {
    if (!$('lb-agent-section') || !isAccessProject()) return;
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return;
    try { ws = new WebSocket(GATEWAY_WS); } catch { return setStatus('gateway unreachable', false); }
    ws.onopen = () => setStatus(sessionId ? 'connected' : 'connected · gateway', true);
    ws.onclose = () => {
      ws = null;
      setStatus('gateway offline', false);
      if (isAccessProject()) setTimeout(connect, 4000);
    };
    ws.onerror = () => setStatus('gateway error', false);
    ws.onmessage = e => { try { handle(JSON.parse(e.data)); } catch {} };
  }

  function syncProjectPanel() {
    if (isAccessProject()) {
      build();
      connect();
      return;
    }
    disconnect();
    $('lb-agent-section')?.remove();
  }

  function boot() { syncProjectPanel(); }

  window.addEventListener('hashchange', () => setTimeout(syncProjectPanel, 0));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
