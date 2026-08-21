# Access Browser Agent — Current Architecture and Hardening Plan

## Current source authority

- Repository: `Letterblack0306/access-browser-agent`
- Branch: `main`
- Verified current HEAD used for this plan: `741d20815858ccf829c283709d504f6e0bd0f6e1`
- Regression baseline: `b2b6ff31f781c1299e916d52ab3122f0c0ac3507`
- Active P1 gate: **Runtime Progress / Re-entry Contract**
- Current gate classification: **SOURCE_IMPLEMENTED_REGRESSION_PENDING**

This page is a GPT-Knowledge projection. Current source, local runtime evidence and acceptance results remain authoritative.

## Source transition

```text
b2b6ff31f781c1299e916d52ab3122f0c0ac3507
→ 741d20815858ccf829c283709d504f6e0bd0f6e1

1 commit ahead
1 file changed
src/agent/executive/LiveAgentCore.js  +53 -5
```

Commit:

`fix: stop repeated identical tool observations`

The P1.1 patch does not modify Browser Relay, renderer, browser settlement, browser profile/context isolation, provider selection, or session continuity.

## Current architecture classification

**STRUCTURED_AGENT_LOOP / PARTIAL_CLOSED_LOOP**

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
runtime reconciliation
        ↓
provider reasoning re-entry or bounded block
```

The reasoning model owns strategy and tool choice. Runtime owns governed execution, lifecycle, completion truth, and now a bounded exact-duplicate observation reconciliation guard.

The guard is source-implemented but not yet locally regression-proven on the current head.

## Proven baseline defect

At `b2b6ff3`, repeated successful observations could loop:

```text
browserConversationRead
→ completed
→ provider.complete()
→ browserConversationRead
→ completed
→ provider.complete()
→ ...
```

Focused regression:

`test/agent-runtime-no-progress-smoke.js`

Baseline classification:

**RUNTIME_NO_PROGRESS_CONTRACT = PROVEN_ABSENT**

## P1.1 — Runtime Progress / Re-entry Contract

### Source state

**IMPLEMENTED AT `741d208`; REGRESSION PENDING**

### Implemented ADD

- stable normalization of tool arguments/output;
- SHA-256 observation fingerprint;
- active-step consecutive duplicate counter;
- transient provider-facing `RUNTIME_NO_STATE_CHANGE` notice after first duplicate;
- `runtime.no_progress` event;
- `no_progress_stagnation` blocker after second duplicate.

### Implemented CHANGE

- first duplicate may re-enter provider reasoning with one transient runtime notice;
- second duplicate intercepts before another `provider.complete()`;
- 40-tool budget remains final safety fuse.

### Implemented REMOVE

- sole dependence on the model noticing exact repeated observations by itself.

### DO NOT TOUCH preserved

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

1. `node --check src/agent/executive/LiveAgentCore.js` passes;
2. `agent-runtime-no-progress-smoke.js` passes;
3. initial observation + two identical duplicates results in `blocked / no_progress_stagnation`;
4. no fourth provider completion occurs;
5. the first duplicate warning is provider-facing but not durable conversation history;
6. existing failed-tool adaptation still works;
7. `agent-runtime-resilience-smoke.js` still passes.

Until those results exist, classification remains:

**SOURCE_IMPLEMENTED_REGRESSION_PENDING**

## P1 — Bounded Page Settlement

This is the next architecture gate only after P1.1 validation.

Current weakness remains:

- `document.readyState === interactive|complete` for navigation readiness;
- fixed `100 ms` wait after ordinary DOM click;
- downstream outcome remains `UNVERIFIED`.

Target additions:

- navigation transition detection;
- bounded DOM mutation quiet window;
- bounded network/activity settlement where meaningful;
- page/snapshot revision after settled transition;
- explicit settlement-timeout classification.

Do not touch protected ChatGPT transport ownership or HTTP/HTTPS safety restrictions.

## P1/P2 — Browser Context Isolation

Managed Chrome uses a reusable Access-owned `--user-data-dir`, which is correct for persistent ChatGPT transport identity but also shares browser storage across general task browsing.

Target architecture:

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

This remains pending and must not be mixed into P1.1 validation.

## P2 — Accessibility + Visual Dual Perception

Current `browserSnapshot` already avoids raw HTML and provides bounded DOM-derived semantic refs. Native CDP AX extraction and optional screenshots remain future hardening.

Do not describe current `aa-N` extraction as a native accessibility tree.

## Other current P1 items

- Durable Stop terminal receipt — live acceptance open.
- `turn-37c41f6e450f190f` recovery — unresolved until explicit recovery receipt.
- Terminal-state UI live acceptance — source/regression proven, live acceptance pending controlled terminal behavior.
- node-pty AttachConsole failure — occurrence proven, causal owner not yet mapped.
- Cline successful-login restart persistence — pending.
- Arbitrary process-death exactly-once recovery — pending.

## Existing closed proof

- provider context compaction — current-live revalidated;
- Cline auth source/persistence authority repair — source/regression proven;
- candidate provider readiness without activation — proven;
- post-result continuation — current-live proven;
- terminal-state renderer source — source/regression proven;
- semantic agent-event dispatch — current-live proven;
- earlier `turn-1f8...` recovery — quarantined/cleared.

## Work order

1. **P1.1 Runtime Progress / Re-entry validation** — active now.
2. **P1 Bounded Page Settlement**.
3. **P1 Durable Stop + current recovery acceptance**.
4. **P1 Terminal-state UI live acceptance**.
5. **P1/P2 Isolated browser task contexts**.
6. **P1 Cline auth successful-login restart persistence**.
7. **P1 Arbitrary process-death exactly-once recovery**.
8. **P2 Native AX + optional screenshot perception**.
9. **P2 CSP / parallel settings cleanup after active runtime gates**.

## Non-goals

Do not solve the current gate by:

- adding semantic objective classifiers;
- reintroducing rigid Plan → Approve → Execute orchestration;
- weakening Browser Loop readiness checks;
- changing provider timeout values;
- switching providers automatically;
- resetting the persistent ChatGPT transport profile per task;
- increasing the tool budget instead of detecting stagnation;
- broad renderer rewrites.
