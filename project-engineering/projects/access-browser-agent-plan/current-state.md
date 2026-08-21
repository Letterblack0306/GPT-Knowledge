# Access Browser Agent — Current State

Date: 2026-08-21

## Source authority

- Repository: `Letterblack0306/access-browser-agent`
- Branch: `main`
- Verified HEAD used for this checkpoint: `741d20815858ccf829c283709d504f6e0bd0f6e1`
- Baseline regression HEAD: `b2b6ff31f781c1299e916d52ab3122f0c0ac3507`
- Active engineering gate: **P1 Runtime Progress / Re-entry Contract**

Current repository source, local runtime evidence and acceptance results remain authoritative over this projection.

## Current source transition

```text
BASE: b2b6ff31f781c1299e916d52ab3122f0c0ac3507
HEAD: 741d20815858ccf829c283709d504f6e0bd0f6e1
COMMITS AHEAD: 1
FILES CHANGED: 1
```

Diff boundary:

```text
src/agent/executive/LiveAgentCore.js
+53
-5
```

Commit:

`741d20815858ccf829c283709d504f6e0bd0f6e1` — `fix: stop repeated identical tool observations`

No Browser Relay, renderer, browser settlement, browser context isolation, provider selection, or session-continuity code changed in this source transition.

## Overall classification

**RUNTIME_PROGRESS_REENTRY_SOURCE_IMPLEMENTED_REGRESSION_PENDING**

The pre-fix defect remains proven at `b2b6ff3`: repeated identical successful tool observations could re-enter the provider loop without deterministic material-progress reconciliation.

The bounded P1.1 source implementation is now committed at `741d208`. It is **not yet accepted as proven** because matching local regression evidence has not yet been returned for the current head.

## Proven baseline defect

Live turn `turn-37c41f6e450f190f` repeatedly completed `browserConversationRead`, returned to provider reasoning and requested another `browserConversationRead` without terminal progress.

Focused regression:

`test/agent-runtime-no-progress-smoke.js`

Baseline commit:

`b2b6ff31f781c1299e916d52ab3122f0c0ac3507`

Expected contract:

```text
initial successful observation
→ first identical duplicate: transient runtime warning
→ second identical duplicate: blocked / no_progress_stagnation
→ no fourth provider completion
```

Baseline result:

```text
actual   = completed
expected = blocked
```

Classification at baseline:

**RUNTIME_NO_PROGRESS_CONTRACT = PROVEN_ABSENT**

## P1.1 source implementation now present

`741d208` adds only the deterministic reconciliation primitives in `LiveAgentCore.js`:

### Added

- stable normalized argument/output fingerprinting;
- SHA-256 observation fingerprint;
- consecutive duplicate count scoped to the active step;
- transient provider-facing `RUNTIME_NO_STATE_CHANGE` notice after first duplicate;
- `runtime.no_progress` event;
- `no_progress_stagnation` blocker after second duplicate.

### Changed

- provider re-entry may receive one transient system notice on first duplicate;
- second duplicate intercepts before another `provider.complete()`;
- global 40-tool budget remains the final safety fuse.

### Preserved

- reasoning ownership;
- `newSession:false` continuation;
- Browser Relay transport semantics;
- provider selection/readiness;
- durable tool evidence;
- browser settlement/profile/perception implementation.

## Current gate classification

**SOURCE_IMPLEMENTED_REGRESSION_PENDING**

This does not yet mean:

`PROVEN_SOURCE_AND_LOCAL_REGRESSION`

The active gate remains open until current-head validation proves the implementation contract.

## Required P1.1 acceptance

The next validation must prove:

- `node --check src/agent/executive/LiveAgentCore.js` passes;
- `test/agent-runtime-no-progress-smoke.js` passes;
- initial observation + two identical duplicates yields `blocked / no_progress_stagnation`;
- no fourth provider completion occurs;
- `RUNTIME_NO_STATE_CHANGE` remains transient and absent from durable conversation history;
- existing `agent-runtime-resilience-smoke.js` still passes;
- existing failed-tool adaptation remains intact.

If any of these fail, P1.1 remains open.

## Browser architecture findings retained

### DOM/context extraction — proven bounded

`browserSnapshot` avoids raw HTML. It returns bounded visible text plus a bounded visible interactive inventory using temporary `aa-N` refs.

### Page readiness/settlement — still insufficient

Navigation waits for `document.readyState` to become `interactive` or `complete`. Ordinary DOM click uses a fixed `100 ms` delay before observing URL/title/readyState and reports downstream outcome as unverified.

No current source proof establishes:

- SPA router completion;
- hydration completion;
- DOM mutation quiet period;
- bounded network/activity settlement;
- automatic settled snapshot revision.

This remains the next P1 browser hardening gate **after** progress reconciliation is proven.

### Browser state isolation — partial

Managed Chrome uses a reusable Access-owned `--user-data-dir`. Persistent identity remains correct for ChatGPT/provider transport login, while general browser-tool tasks still lack a separate ephemeral task-context lifecycle.

### Accessibility/visual perception — partial

Current semantics are DOM-derived, not a native Chromium Accessibility tree. Native bounded AX extraction and optional screenshot perception remain P2 hardening.

## Pending P1/P2 work

1. **P1 Runtime Progress / Re-entry Contract** — source implemented at `741d208`, local regression pending.
2. **P1 Bounded Page Settlement** — implementation not started.
3. **P1 Durable Stop terminal receipt** — live acceptance open.
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
