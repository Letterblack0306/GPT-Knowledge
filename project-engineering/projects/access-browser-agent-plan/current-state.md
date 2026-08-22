# Access Browser Agent — Current State

Date: 2026-08-22

## Source authority

- Repository: `Letterblack0306/access-browser-agent`
- Branch: `main`
- Verified HEAD: `b9abac124c0e5036d19bfa902e36fb898ed3c2e6`
- Protected local untracked file: `section_09.md` — preserved, not modified
- Active engineering gate: **P1 Terminal-state UI live acceptance — proven**

Current repository source, local runtime evidence and acceptance results remain authoritative over this projection.

## Projection boundary

GPT-Knowledge is alignment/navigation state only. The working product repository and runtime remain authoritative. The retained product UI scope is the local IDE, local agent, managed browser, provider/runtime, editor, terminal and MCP surfaces. External BirdEye/workspace-handoff UI surfaces were removed from the product.

Source work follows this order:

```text
inspect the live repository and runtime
→ verify GitHub main SHA + diff
→ run focused checks, then authoritative project checks
→ classify only the tested gate
→ sync GPT-Knowledge
→ verify Vercel/live projection
→ only then next change
```

Every future plan must distinguish:

```text
EXISTING + PROVEN
EXISTING BUT NOT YET VERIFIED LIVE
MISSING — IMPLEMENTATION REQUIRED
```

Only `MISSING — IMPLEMENTATION REQUIRED` authorizes designing a new capability. This projection does not create product authority, runtime state, or external UI requirements.

## P1.1 Runtime Progress / Re-entry — CLOSED

Baseline:

`b2b6ff31f781c1299e916d52ab3122f0c0ac3507`

Implementation:

`741d20815858ccf829c283709d504f6e0bd0f6e1`

Exact source diff:

```text
1 commit ahead
1 file changed
src/agent/executive/LiveAgentCore.js  +53 -5
```

Local acceptance command hash:

`7DF5420CB2BB58ED745B58933DBAA4A382443A5F64758FC765EB149FE8067E60`

Observed result:

```text
HEAD = 741d20815858ccf829c283709d504f6e0bd0f6e1
node --check LiveAgentCore.js = PASS
agent-runtime-no-progress-smoke = PASS
agent-runtime-resilience-smoke = PASS
git status = main aligned with origin/main; section_09.md remains untracked
```

Classification:

**P1_1_RUNTIME_PROGRESS_REENTRY = PROVEN_SOURCE_AND_LOCAL_REGRESSION**

This proves the bounded runtime contract for the focused regression: exact repeated observations are intercepted on the second duplicate before another provider completion, the first warning remains transient, and the neighboring failed-tool/resilience behavior still passes.

## Active gate — P1 Bounded Page Settlement

### Proven current weakness

`src/browser/browser-tool-runtime.js` currently has two weak downstream-settlement paths:

- navigation waits for `document.readyState` to become `interactive` or `complete`;
- ordinary DOM click uses a fixed `100 ms` delay and reports downstream outcome as unverified.

This does not prove:

- SPA route completion;
- hydration completion;
- DOM mutation stability;
- bounded network/activity settlement;
- settled snapshot/state revision.

### Source/test owner map — PROVEN

```text
source owner: src/browser/browser-tool-runtime.js
test owner: test/browser-tool-runtime-smoke.js
```

The existing harness already owns protected-target isolation, URL safety, open/navigate/snapshot/click/type/scroll/close behavior. Do not create a duplicate browser-runtime harness.

### Required proof before the regression change

Before deciding how to run the P1.2 regression, inspect the **active BirdEye installation/configuration** for the exact Access workspace and prove:

```text
workspace root mapping
watcher coverage
existing validation profiles
whether browser-tool-runtime-smoke.js is already covered
active request bridge runtime branch/path
polling vs webhook/trigger live behavior
```

Then reuse or minimally extend what exists. Do not design another local execution mechanism unless BirdEye capability is proven missing.

### Intended scope after that proof

ADD:
- navigation transition detection;
- bounded DOM mutation quiet window;
- bounded network/activity settlement where meaningful;
- snapshot/state revision after settled transition;
- explicit timeout classification.

CHANGE:
- replace fixed `wait(100)` as primary downstream settlement;
- strengthen `_waitReady()` beyond document-ready-state-only semantics.

REMOVE:
- arbitrary fixed sleep as downstream-success proxy.

DO NOT TOUCH:
- protected ChatGPT transport target ownership;
- HTTP/HTTPS URL safety rules;
- persistent relay login/profile continuity;
- P1.1 progress guard.

## Pending after settlement

- Durable Stop terminal receipt acceptance;
- `turn-37c...` recovery reconciliation;
- terminal-state UI live acceptance;
- node-pty `AttachConsole` owner mapping (host PTY probe timed out);
- arbitrary process-death exactly-once recovery (not proven);
- isolated browser task contexts (host CDP `Not allowed` blocker);
- native AX + optional screenshot perception (live target creation host blocker; bounded AX source projection implemented);
- CSP and parallel-settings cleanup.
