/* Live canvas arrangement for LB Workspace — additive only.
 * Converts flex-lane plan nodes in #board into freely draggable cards,
 * redraws SVG edges as cards move (connected nodes stay connected), and
 * renders the right-hand "Current state" notes as draggable cards on the
 * same canvas. Arrangements persist per project in localStorage.
 */
(() => {
  const KEY = 'lb-canvas-layout-v1:';
  const board = () => document.getElementById('board');
  const pid = () => (window.currentProject && window.currentProject.id) || 'default';
  const key = () => KEY + pid();
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  let lay = null;
  let box = null;
  let dragging = null;

  const loadLayout = () => {
    try { const o = JSON.parse(localStorage.getItem(key()));
      if (o && typeof o === 'object') return { nodes: o.nodes || {}, cards: o.cards || {}, show: !!o.show }; } catch (_) {}
    return { nodes: {}, cards: {}, show: true };
  };
  const saveLayout = () => {
    const l = loadLayout();
    document.querySelectorAll('#board [data-node-id]').forEach(el => {
      if (el.style.position !== 'absolute') return;
      l.nodes[el.dataset.nodeId] = { x: Math.round(parseFloat(el.style.left)), y: Math.round(parseFloat(el.style.top)) };
    });
    document.querySelectorAll('.state-card').forEach(el => {
      if (el.dataset.key) l.cards[el.dataset.key] = { x: Math.round(parseFloat(el.style.left)), y: Math.round(parseFloat(el.style.top)) };
    });
    if (box) l.cards['__box'] = { x: Math.round(parseFloat(box.style.left)), y: Math.round(parseFloat(box.style.top)) };
    try { localStorage.setItem(key(), JSON.stringify(l)); } catch (_) {}
  };
  const drawEdges = () => { if (typeof window.drawEdges === 'function') window.drawEdges(); };

    const layerEl = () => {
    if (!lay || !document.body.contains(lay)) { lay = document.createElement('div'); lay.id = 'canvasLayer'; lay.className = 'canvas-layer';
      lay.style.cssText = 'position:absolute;left:0;top:0;width:2400px;height:1400px;z-index:14'; board().appendChild(lay); }
    return lay;
  };

  const grab = (el, kind, ident) => {
    el.addEventListener('pointerdown', e => {
      if (e.button !== 0 || el.style.position !== 'absolute') return;
      dragging = { el, kind, id: ident, ox: e.clientX - parseFloat(el.style.left), oy: e.clientY - parseFloat(el.style.top), moved: false };
      el.classList.add('dragging'); e.preventDefault();
      try { el.setPointerCapture(e.pointerId); } catch (_) {}
    }, true);
    el.addEventListener('pointermove', e => {
      if (!dragging || dragging.el !== el) return;
      const x = Math.max(0, Math.round(e.clientX - dragging.ox));
      const y = Math.max(0, Math.round(e.clientY - dragging.oy));
      if (!dragging.moved && (x !== parseFloat(el.style.left) || y !== parseFloat(el.style.top))) dragging.moved = true;
      el.style.left = x + 'px'; el.style.top = y + 'px';
      if (dragging.kind === 'n') drawEdges();
    });
    const stop = e => {
      if (!dragging || dragging.el !== el) return;
      const moved = dragging.moved; const kind = dragging.kind; const id = dragging.id;
      el.classList.remove('dragging'); dragging = null;
      try { el.releasePointerCapture(e.pointerId); } catch (_) {}
      saveLayout();
      if (!moved && kind === 'n' && typeof window.openNode === 'function' && !window.getSelection()?.toString()) window.openNode(id);
    };
    el.addEventListener('pointerup', stop, true);
    el.addEventListener('pointercancel', stop, true);
  };

  const tone = (x, kind) => {
    if (kind === 'c') return 'closed';
    if (kind === 'h') return 'history';
    const t = `${x?.classification || ''} ${x?.status || ''} ${x?.title || ''}`.toLowerCase();
    return /fail|failure|blocked|defect|issue|error|timeout|inconclusive/.test(t) ? 'issue' : 'pending';
  };
const cardHTML = (x, kind) => `<div class="meta">${esc(x.priority || x.classification || kind)}</div><b>${esc(x.title || '')}</b>${x.detail ? `<p>${esc(x.detail)}</p>` : ''}`;

  const buildCards = (saved, ax) => {
    const cs = window.currentStatus;
    if (!cs) return;
    layerEl();
    if (!lay) return;
    box = document.createElement('div');
        box.id = 'stateBox'; box.className = 'state-box draggable';
    box.style.position = 'absolute';
    const bp = saved.cards['__box'] || { x: ax, y: 40 };
    box.style.left = bp.x + 'px'; box.style.top = bp.y + 'px';
    const hd = document.createElement('div');
    hd.className = 'state-box-title'; hd.textContent = 'CURRENT STATE';
    box.appendChild(hd);
    grab(box, 'b', '__box');
    let i = 0;
    const push = (label, items, kind) => {
      const g = document.createElement('div');
      g.className = 'state-group'; g.innerHTML = `<span class="state-h">${esc(label)}</span>`;
      box.appendChild(g);
      (items || []).forEach(x => {
        const id = `state:${kind}:${i++}`;
        const c = document.createElement('div');
                c.className = `state-card ${tone(x, kind)} draggable`;
        c.dataset.key = id;
        let cx = bp.x, cy = bp.y + 90 + i * 118;
        if (saved.cards[id]) { cx = bp.x + (saved.cards[id].x - bp.x); cy = bp.y + (saved.cards[id].y - bp.y); }
        c.style.left = cx + 'px'; c.style.top = cy + 'px';
        c.innerHTML = cardHTML(x, kind);
        grab(c, 's', id);
        box.appendChild(c);
      });
    };
    if (cs.next_acceptance) push('ACTIVE GATE', [{ classification: 'NEXT ACCEPTANCE', title: cs.next_acceptance.question, detail: cs.next_acceptance.observable }], 'p');
    push('PENDING / ISSUES', cs.pending, 'p');
    push('COMPLETED / WORKING', cs.closed, 'c');
    push('HISTORICAL PROOF', cs.supported_historical, 'h');
    lay.appendChild(box);
    saveLayout();
  };

  const showCards = saved => { if (!document.getElementById('stateBox')) buildCards(saved, (saved.cards['__box'] && saved.cards['__box'].x) || 980); };
  const hideCards = () => { if (box && box.parentNode) box.parentNode.removeChild(box); box = null; };

  const arrange = () => {
    const bd = board();
    if (!bd) return;
    const flow = [...bd.querySelectorAll('.node[data-node-id]')].filter(n => n.style.position !== 'absolute');
    if (!flow.length) return;
    const saved = loadLayout();
    const o = { x: bd.getBoundingClientRect().left, y: bd.getBoundingClientRect().top };
    layerEl();
    flow.forEach(el => {
      const id = el.dataset.nodeId;
      if (!saved.nodes[id]) { const r = el.getBoundingClientRect(); saved.nodes[id] = { x: Math.round(r.left - o.x), y: Math.round(r.top - o.y) }; }
      const p = saved.nodes[id];
      el.style.position = 'absolute'; el.style.left = p.x + 'px'; el.style.top = p.y + 'px';
      el.style.margin = '0'; el.style.width = '132px';
      el.classList.add('draggable');
      el.onclick = null;
      grab(el, 'n', id);
      if (window.openNode) el.addEventListener('dblclick', () => window.openNode(id));
      lay.appendChild(el);
    });
    const lanes = document.getElementById('lanes');
    if (lanes) lanes.style.display = 'none';
    let mr = 40;
    flow.forEach(el => { const r = parseFloat(el.style.left); if (r + 132 > mr) mr = r + 132; });
    if (saved.show && !document.getElementById('stateBox')) buildCards(saved, mr + 60);
    try { localStorage.setItem(key(), JSON.stringify(saved)); } catch (_) {}
    drawEdges();
  };

  const reconcile = () => {
    const bd = board();
    if (!bd) return;
    const hasFlow = [...bd.querySelectorAll('.node[data-node-id]')].filter(n => n.style.position !== 'absolute').length > 0;
    if (hasFlow) arrange();
  };
const toolbar = () => {
    let t = document.getElementById('canvasTool');
    if (t) return t;
    t = document.createElement('div');
    t.id = 'canvasTool'; t.className = 'canvas-tool';
    t.style.cssText = 'position:absolute;right:356px;bottom:16px;z-index:40;display:flex;gap:8px;padding:6px 10px';
    const btn = document.createElement('button'); btn.id = 'ctCards'; btn.textContent = 'State cards';
    const reset = document.createElement('button'); reset.id = 'ctReset'; reset.textContent = 'Reset layout';
    reset.title = 'Restore the original lane layout for this project';
    t.append(btn, reset);
    const host = document.querySelector('.main');
    if (host) host.appendChild(t);
    const refresh = () => { const cb = document.getElementById('ctCards'); if (cb) cb.textContent = (loadLayout().show ? 'Hide state cards' : 'State cards'); };
    btn.onclick = () => { const s = loadLayout(); s.show = !s.show;
      try { localStorage.setItem(key(), JSON.stringify(s)); } catch (_) {}
      if (s.show) showCards(s); else hideCards(); refresh(); };
    reset.onclick = () => { try { localStorage.removeItem(key()); } catch (_) {} location.reload(); };
    return t;
  };

  const css = (() => {
    if (document.getElementById('lbCanvasCss')) return;
    const st = document.createElement('style'); st.id = 'lbCanvasCss';
    st.textContent = [
      '.canvas-layer{position:absolute;left:0;top:0;z-index:14}',
      '#canvasLayer .draggable{cursor:grab;user-select:none;touch-action:none}',
      '#canvasLayer .draggable.dragging{cursor:grabbing;z-index:99}',
      '.state-box{min-width:260px;background:transparent}',
      '.state-box-title{font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:#778392;font-weight:800;margin-bottom:4px;background:#0a0d12;border:1px solid #283240;border-radius:999px;padding:4px 9px}',
      '.state-group{margin-top:6px;font-size:8px;letter-spacing:.08em;color:#526071;text-transform:uppercase}',
      '.state-card{width:260px;border:1px solid #202a36;border-radius:12px;background:#0d1219;padding:12px;font-size:10px;box-shadow:0 10px 26px #0006}',
      '.state-card .meta{font-size:8px;letter-spacing:.08em;color:#8694a6;text-transform:uppercase;margin-bottom:4px}',
      '.state-card b{display:block;font-size:11px;margin:2px 0 4px;line-height:1.3}',
      '.state-card p{font-size:10px;color:#8794a4;margin:4px 0 0;line-height:1.4}',
      '.state-card.pending{border-color:#f0bd63;background:#19150d}',
      '.state-card.issue{border-color:#ef7f7f;background:#1b1011}',
      '.state-card.closed{border-color:#65d29a;background:#0e1914}',
      '.state-card.history{border-color:#5d5682;background:#14131d}',
      '.canvas-tool button{border:1px solid #2f3c4c;background:#121923;color:#bcd5ff;border-radius:999px;padding:6px 11px;font-size:10px;cursor:pointer}'
    ].join('\n');
    document.head.appendChild(st);
  })();

  const start = () => {
    css;
    arrange();
    toolbar();
    if (loadLayout().show) showCards(loadLayout());
    const cb = document.getElementById('ctCards');
    if (cb) cb.textContent = (loadLayout().show ? 'Hide state cards' : 'State cards');
    const bd = board();
    const ob = new MutationObserver(() => { if (bd !== board()) return; reconcile(); });
    if (bd) ob.observe(bd, { childList: true, subtree: true, attributeFilter: ['class'] });
  };

  const boot = () => { if (!board()) setTimeout(boot, 120); else start(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else setTimeout(boot, 250);
})();