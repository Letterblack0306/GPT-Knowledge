# Access Browser Agent — Current State

Date: 2026-08-21

## Source authority

- Repository: `Letterblack0306/access-browser-agent`
- Branch: `main`
- Verified HEAD used for this checkpoint: `b2b6ff31f781c1299e916d52ab3122f0c0ac3507`
- Active engineering gate: **P1 Runtime Progress / Re-entry Contract**

Current repository source, local runtime evidence and acceptance results remain authoritative over this projection.

## Overall classification

**RUNTIME_NO_PROGRESS_CONTRACT_PROVEN_ABSENT_IMPLEMENTATION_PENDING**

Access is already a structured asynchronous agent/tool runtime with explicit durable lifecycle state, typed governed tools, execution evidence, bounded provider context and browser ownership. The missing invariant is deterministic **material-progress reconciliation** between a completed tool observation and the next provider reasoning call.

## Newly proven live failure

Current-head live turn `turn-37c41f6e450f190f` repeatedly completed `browserConversationRead`, returned to provider reasoning and requested another `browserConversationRead` without reaching terminal progress.

This was not the earlier renderer event-dispatch defect: semantic `execution.tool.started` and `execution.tool.completed` were visibly flowing, so UI event dispatch remains **PROVEN_CURRENT_LIVE**.

The turn later remained durably recorded as `executing`, creating a new recovery-required record.

## Newly proven regression gap

A focused regression was added:

`test/agent-runtime-no-progress-smoke.js`

Commit:

`b2b6ff31f781c1299e916d52ab3122f0c0ac3507`

Expected contract:

```text
initial successful observation
→ first identical duplicate: transient runtime warning
→ second identical duplicate: blocked / no_progress_stagnation
→ no fourth provider completion
```

Actual current behavior:

```text
actual   = completed
expected = blocked
```

Classification:

**RUNTIME_NO_PROGRESS_CONTRACT = PROVEN_ABSENT**

This proves the current runtime can continue provider-driven repetition until the model eventually stops or the global tool-call budget is exhausted.

## Exact active fix scope

### Add

- stable normalized tool arguments;
- stable normalized bounded observation output;
- SHA-256 observation fingerprint;
- consecutive duplicate counter scoped to the active step;
- transient provider-facing `RUNTIME_NO_STATE_CHANGE` notice after the first duplicate;
- `runtime.no_progress` event/evidence;
- `no_progress_stagnation` blocker after the second duplicate.

### Change

- provider re-entry should use a transient warning on the first duplicate;
- the second duplicate should intercept before another `provider.complete()`;
- the 40-call budget remains a final safety fuse, not progress detection.

### Remove

- reliance on the provider/model to notice identical observations without runtime help.

### Do not touch

- reasoning ownership;
- `newSession:false` continuation;
- Browser Relay exact-chat transport;
- provider selection/readiness semantics;
- durable tool evidence;
- terminal-state renderer source;
- browser settlement/profile/perception code during this Phase-1 patch.

## Browser architecture findings

### DOM/context extraction — good

`browserSnapshot` does not send raw HTML. It returns bounded visible text and a bounded visible interactive inventory using temporary `aa-N` refs for links, buttons, inputs, textareas, selects, role-based controls, contenteditable nodes and tabindex elements.

### Page readiness/settlement — insufficient

Navigation currently waits for `document.readyState` to become `interactive` or `complete`. Ordinary DOM click then uses a fixed `100 ms` delay before observing URL/title/readyState and explicitly reports downstream outcome as unverified.

No source proof currently establishes:

- SPA router completion;
- hydration completion;
- DOM mutation quiet period;
- bounded network/activity settlement;
- automatic settled snapshot revision.

This is the next P1 browser hardening gate after progress reconciliation.

### Browser state isolation — partial

Managed Chrome uses a reusable Access-owned `--user-data-dir`. Persistent identity is correct for ChatGPT/provider transport login, but general browser-tool tasks currently lack a separate ephemeral task-context lifecycle.

Target architecture should preserve the relay profile while isolating task cookies/storage/cache.

### Accessibility/visual perception — partial

Current semantics are DOM-derived from aria-label/title/innerText/value/placeholder plus element metadata and rectangles. This is not a native Chromium Accessibility tree. Native bounded AX extraction and optional screenshots remain P2 hardening.

## Pending P1/P2 work

1. **P1 Runtime Progress / Re-entry Contract** — active.
2. **P1 Bounded Page Settlement** — replace readyState + fixed sleep as primary settlement.
3. **P1 Durable Stop terminal receipt** — prove Stop writes durable stopped/cancelled state and clears executing ambiguity.
4. **P1 turn-37c recovery** — unresolved until explicit recovery receipt.
5. **P1 Terminal-state UI live acceptance** — source proven, live terminal outcome still blocked by runtime termination control.
6. **P1 node-pty AttachConsole owner map** — occurrence proven, causality unproven.
7. **P1 Cline successful-login restart persistence**.
8. **P1 Arbitrary process-death exactly-once recovery**.
9. **P1/P2 Isolated task browser contexts**.
10. **P2 Native AX + optional screenshot perception**.
11. **P2 CSP inline-style cleanup**.
12. **P2 Parallel settings cleanup after compatibility scan**.

## Closed/proven work retained

- provider-context amplification repair — live revalidated;
- Cline auth source authority repair — source/regression proven;
- candidate readiness without provider activation — proven;
- post-result continuation A→B→C — current-live proven;
- terminal-state renderer source repair — source/regression proven;
- preload semantic event normalization — current-live proven;
- earlier `turn-1f8...` ambiguous recovery — quarantined/cleared.

## Current acceptance criterion

The next implementation gate passes only when:

- `agent-runtime-no-progress-smoke.js` passes;
- initial + two duplicate observations yield `blocked / no_progress_stagnation`;
- no fourth provider completion occurs;
- runtime warning is transient and absent from durable conversation history;
- existing failed-tool adaptation and agent runtime resilience tests still pass.

## Explicit non-goals

Do not:

- increase the tool budget as a stagnation fix;
- replace reasoning with a deterministic workflow machine;
- add semantic objective envelopes/classifiers;
- weaken Browser Loop provider readiness;
- alter provider timeout values to force acceptance;
- switch providers automatically;
- reset the persistent ChatGPT transport login per task;
- perform broad renderer rewrites.
