# Access Browser Agent — Current Architecture and Hardening Plan

## Current source authority

- Repository: `Letterblack0306/access-browser-agent`
- Branch: `main`
- Verified current HEAD used for this plan: `b2b6ff31f781c1299e916d52ab3122f0c0ac3507`
- Active P1 gate: **Runtime Progress / Re-entry Contract**

This page is a GPT-Knowledge projection. Current source, local runtime evidence and acceptance results remain authoritative.

## Current architecture classification

**STRUCTURED_AGENT_LOOP / PARTIAL_CLOSED_LOOP**

Access already has the correct separation of responsibilities:

```text
Browser/provider instruction
        ↓
Browser Relay transport
        ↓
AgentSessionRuntime / LiveAgentCore
        ↓
provider reasoning
        ↓
typed governed tool execution
        ↓
durable tool observation + execution evidence
        ↓
provider reasoning re-entry
```

The reasoning model owns strategy and tool choice. The runtime owns governed execution, lifecycle and completion truth.

The missing production invariant is **material progress reconciliation** between a completed tool observation and the next provider reasoning call.

## Newly proven defect

### Repeated successful observations can loop without material progress

A current-head live turn repeatedly executed:

```text
browserConversationRead
→ completed
→ provider.complete()
→ browserConversationRead
→ completed
→ provider.complete()
→ ...
```

The runtime had no deterministic rule asking whether the new observation materially differed from the previous observation.

A regression was added at:

`test/agent-runtime-no-progress-smoke.js`

Commit:

`b2b6ff31f781c1299e916d52ab3122f0c0ac3507`

The regression expected:

```text
initial observation
→ first identical duplicate: warning/re-entry
→ second identical duplicate: BLOCKED / no_progress_stagnation
```

Current source instead returned `completed`, proving the no-progress contract is absent.

Classification: **RUNTIME_NO_PROGRESS_CONTRACT = PROVEN_ABSENT**.

## P1 — Runtime Progress / Re-entry Contract

### Exact question

> Can identical tool observations be detected between `execution.tool.completed` and the next `provider.complete()` without taking reasoning ownership away from the model or polluting durable conversation history?

### ADD

Add only the deterministic progress primitives required for that contract:

- stable normalization of tool arguments;
- stable normalization of bounded tool output;
- SHA-256 observation fingerprint;
- consecutive duplicate-observation counter scoped to the active step;
- transient provider-facing `RUNTIME_NO_STATE_CHANGE` notice after the first duplicate;
- `runtime.no_progress` event/evidence;
- `no_progress_stagnation` blocker after the second duplicate.

### CHANGE

Change only the provider re-entry boundary:

- first duplicate may re-enter reasoning with one transient runtime notice;
- second duplicate must stop before another `provider.complete()`;
- the existing 40-tool budget remains a final safety fuse, not the primary progress detector.

### REMOVE

Remove the architectural dependency on:

> “the model will notice that the observation is identical and stop itself.”

Do **not** remove reasoning autonomy.

### DO NOT TOUCH in this phase

- `newSession:false` continuation semantics;
- Browser Relay exact-chat transport;
- provider selection/readiness authority;
- durable tool evidence;
- terminal-state renderer source;
- browser settlement implementation;
- browser profile lifecycle;
- accessibility/perception implementation.

### Acceptance contract

The gate passes only when:

1. `agent-runtime-no-progress-smoke.js` passes;
2. initial observation + two identical duplicates results in `blocked / no_progress_stagnation`;
3. no fourth provider completion occurs;
4. the first duplicate warning is provider-facing but **not durable conversation history**;
5. existing failed-tool adaptation still works;
6. existing runtime resilience regression still passes.

## P1 — Bounded Page Settlement

### Proven current weakness

`browser-tool-runtime.js` currently:

- waits for `document.readyState === interactive|complete` on navigation;
- uses a fixed `100 ms` wait after ordinary DOM click;
- returns downstream action outcome as `UNVERIFIED`.

This does not prove SPA hydration, async fetch completion or DOM stability.

### ADD

- navigation transition detection;
- bounded DOM mutation quiet window;
- bounded network/activity settlement where meaningful;
- page/snapshot revision after settled transition;
- explicit settlement timeout classification.

### CHANGE

- strengthen `_waitReady()` beyond document-ready-state-only semantics;
- replace fixed `wait(100)` as the primary downstream settlement mechanism.

### REMOVE

- arbitrary sleep as a proxy for downstream success.

### DO NOT TOUCH

- protected ChatGPT transport target isolation;
- HTTP/HTTPS safety restrictions;
- fresh-snapshot-after-action requirement.

## P1/P2 — Browser Context Isolation

### Proven current state

Managed Chrome uses a reusable Access-owned `--user-data-dir` profile. That is useful and necessary for persistent ChatGPT transport login, but it also means general browser tools can inherit cookies/storage/cache across unrelated agent tasks.

### Target architecture

```text
Managed Chrome
├─ Persistent Relay Context
│  └─ ChatGPT/provider transport identity
└─ Ephemeral Task Context
   ├─ task cookies
   ├─ local/session storage
   ├─ IndexedDB/cache
   └─ deterministic reset/close
```

### ADD

- task-context create/reset/close lifecycle or equivalent;
- task-scoped cookie/storage/cache isolation;
- explicit task context identity in browser evidence.

### CHANGE

General browser-tool tabs should use task isolation instead of implicitly sharing all persistent relay profile state.

### REMOVE

The assumption that one persistent browser state domain is appropriate for both transport identity and arbitrary browsing.

### DO NOT TOUCH

Persistent relay login/profile continuity.

## P2 — Accessibility + Visual Dual Perception

### Proven current state

`browserSnapshot` already avoids raw HTML. It emits:

- bounded visible text;
- visible actionable elements;
- temporary `aa-N` refs;
- tag/role/name/href/input metadata;
- bounding rectangles.

The current semantic name is DOM-derived from aria-label/title/innerText/value/placeholder. It is not a native Chromium accessibility tree.

### ADD

- bounded CDP AX tree / `Accessibility.getFullAXTree` equivalent;
- mapping from AX semantics to safe actionable refs;
- optional `browserScreenshot` for CSS/layout/canvas verification.

### CHANGE

The current custom DOM semantic projection should become a supporting/fallback representation, not the only semantic source.

### REMOVE

Do not describe current `aa-N` DOM extraction as a native accessibility tree.

## Other current P1 items

### Durable Stop terminal receipt

Live acceptance still needs to prove Agent Stop produces a durable `stopped/cancelled` terminal state and does not leave the Browser Relay journal in `executing`.

### turn-37c recovery

`turn-37c41f6e450f190f` remains unresolved until an explicit recovery-reconciliation receipt is observed.

### Terminal-state UI live acceptance

Source/regression is already proven. Resume BLOCKED / FAILED / STOPPED live rendering acceptance only after runtime termination/reconciliation is controlled.

### node-pty AttachConsole failure

Observed after a prolonged runtime. Occurrence is proven; causal ownership is not. Keep separate until source/runtime evidence establishes ownership.

## Existing closed proof

- provider context compaction — current-live revalidated;
- Cline auth source/persistence authority repair — source/regression proven;
- candidate provider readiness without activation — proven;
- post-result continuation — current-live proven;
- terminal-state renderer source — source/regression proven;
- semantic agent-event dispatch — current-live proven;
- earlier `turn-1f8...` recovery — quarantined/cleared.

## Work order

1. **P1 — Runtime Progress / Re-entry Contract** — active now.
2. **P1 — Bounded Page Settlement**.
3. **P1 — Durable Stop + current recovery acceptance**.
4. **P1 — Terminal-state UI live acceptance**.
5. **P1/P2 — Isolated browser task contexts**.
6. **P1 — Cline auth successful-login restart persistence**.
7. **P1 — Arbitrary process-death exactly-once recovery**.
8. **P2 — Native AX + optional screenshot perception**.
9. **P2 — CSP cleanup / parallel settings cleanup after active runtime gates**.

## Non-goals

Do not solve the current problem by:

- adding semantic objective classifiers;
- reintroducing rigid Plan → Approve → Execute orchestration;
- weakening Browser Loop readiness checks;
- changing provider timeout values;
- switching providers automatically;
- resetting the persistent ChatGPT transport profile per task;
- increasing the tool budget instead of detecting stagnation;
- broad renderer rewrites.
