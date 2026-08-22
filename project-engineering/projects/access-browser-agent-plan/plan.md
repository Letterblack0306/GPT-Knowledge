# Access Browser Agent — Current Architecture and Hardening Plan

## Current source authority

- Repository: `Letterblack0306/access-browser-agent`
- Branch: `main`
- Verified current HEAD: `b8edf1314c222652483974cf13eb00f6b790330d`
- Regression baseline: `b2b6ff31f781c1299e916d52ab3122f0c0ac3507`
- Current gate: **Terminal-state UI live acceptance — proven**

This page is a GPT-Knowledge projection. Current source, local runtime evidence and acceptance results remain authoritative.

## Projection boundary

This plan is alignment/navigation state only. The working product repository and its runtime are authoritative. The product scope retained here is the local IDE, local agent, managed browser, provider/runtime, editor, terminal and MCP surfaces.

External BirdEye/workspace-handoff UI nodes were removed from the product. Do not reintroduce them through this projection.

For source changes:

```text
inspect the live repository and runtime
→ verify GitHub main SHA + exact diff
→ run the smallest relevant checks, then authoritative project checks
→ classify only the tested gate
→ synchronize GPT-Knowledge as a projection
→ verify the published projection
```

Planning must classify capabilities as:

```text
EXISTING + PROVEN
EXISTING BUT NOT YET VERIFIED LIVE
MISSING — IMPLEMENTATION REQUIRED
```

Only the third category authorizes a new capability plan. This projection does not create product authority, runtime state, or external UI requirements.

## Closed P1.1 — Runtime Progress / Re-entry Contract

Source transition:

```text
b2b6ff31f781c1299e916d52ab3122f0c0ac3507
→ 741d20815858ccf829c283709d504f6e0bd0f6e1

1 commit ahead
1 file changed
src/agent/executive/LiveAgentCore.js  +53 -5
```

Local validation:

```text
node --check src/agent/executive/LiveAgentCore.js  PASS
node test/agent-runtime-no-progress-smoke.js      PASS
node test/agent-runtime-resilience-smoke.js       PASS
```

Command hash:

`7DF5420CB2BB58ED745B58933DBAA4A382443A5F64758FC765EB149FE8067E60`

Classification:

**P1_1_RUNTIME_PROGRESS_REENTRY = PROVEN_SOURCE_AND_LOCAL_REGRESSION**

The implementation preserves reasoning ownership, `newSession:false`, Browser Relay transport semantics, durable tool evidence and provider authority.

## Closed P1.2 — Bounded Page Settlement

Source and browser-tool-runtime regression proof is current at `0048d0dceb062fbabb06423dfa419a6050a4713e`.

### Current source gap

`src/browser/browser-tool-runtime.js` currently uses:

- `document.readyState === interactive|complete` for navigation readiness;
- a fixed `wait(100)` after ordinary DOM click;
- `downstreamOutcome: UNVERIFIED` after that fixed wait.

Those observables are too weak for modern dynamic pages and do not prove DOM, SPA, hydration, or async activity settlement.

### Engineering question

> What bounded transition observable can replace fixed post-click sleeping without forcing permanent-network-idle semantics on pages that legitimately keep streams/WebSockets open?

### Falsifier

If ordinary action success still depends primarily on a fixed sleep, or if the runtime re-enters observation before a bounded navigation/DOM/activity settlement condition is reached, the settlement contract remains absent.

### Required workflow before implementation

The source/test owners are already mapped. The next proof is **not** to invent another execution mechanism. First inspect the active BirdEye installation/configuration for the exact Access workspace:

```text
1. exact configured workspace root
2. watcher coverage for that root
3. existing validation profiles
4. whether browser-tool-runtime-smoke.js is already included
5. active request bridge runtime branch/path
6. whether the active installation uses polling only, webhook/trigger, or both
```

Then choose only:

```text
REUSE EXISTING PROFILE
or
MINIMALLY EXTEND EXISTING PROFILE
or
MISSING CAPABILITY — only if evidence proves it absent
```

After that:

```text
define focused settlement regression + falsifier
→ prove baseline failure
→ only then change source
```

### Intended ADD

- navigation transition detection;
- bounded DOM mutation quiet window;
- bounded network/activity settlement where meaningful;
- page/snapshot state revision after settlement;
- explicit settlement-timeout classification.

### Intended CHANGE

- strengthen `_waitReady()` beyond document-ready-state-only semantics;
- replace fixed `wait(100)` as the primary downstream settlement mechanism.

### Intended REMOVE

- arbitrary sleep as a proxy for downstream success.

### DO NOT TOUCH

- protected ChatGPT transport target ownership;
- HTTP/HTTPS safety restrictions;
- persistent relay login/profile continuity;
- P1.1 progress/re-entry behavior;
- renderer/event-dispatch source.

## Source UI update — IDE reference shell alignment

GitHub `main` is now at product head `b8edf13`, ahead of the historical validation head `0048d0d`:

- `1880e402` — IDE reference styling;
- `0ca41939` — activity rail adapter;
- `f78821d6` — IDE shell reference structure styles;
- `26c72b45` — activity rail and stylesheet wiring in `electron/index.html`.

Changed source files include the IDE reference shell files plus the external-surface removal and current UI smoke-contract files: `electron/index.html`, `electron/main.js`, `electron/preload.js`, `electron/rebuild-renderer.js`, `electron/renderer.js`, `electron/rebuild-ide-reference.css`, `electron/rebuild-ide-reference.js`, `electron/rebuild-ui-stability.css`, `src/system/ui-id-registry.js`, and the focused UI smoke tests.

The IDE shell/activity-rail UI source is present, external BirdEye/workspace-handoff UI surfaces are removed, and the settled-turn delivery ownership fix is integrated. The focused UI smoke suite, `npm run check:rebuild`, `npm run check`, and the bounded Electron/CDP acceptance pass at product head `b8edf13`.

## Closed P1 — Terminal-state UI live acceptance

The product source is now at `b8edf13`, integrating the IDE shell/activity-rail UI changes through `26c72b45`, the settled-turn delivery ownership fix at `5fcda7d`, and removal of external BirdEye/workspace-handoff UI surfaces. Full local checks and focused UI smoke tests pass at the current product head. The bounded Electron/CDP acceptance passed all eight steps against the saved exact ChatGPT target after LM Studio `qwen/qwen3-vl-8b` passed its capability probe with a 120-second step budget.

Classification: **CURRENT_HEAD_SOURCE_LOCAL_CHECKS_AND_LIVE_ACCEPTANCE_PROVEN**

Acceptance result: `npm run acceptance:ui` with `ACCESS_AGENT_ACCEPTANCE_STEP_TIMEOUT_MS=120000` passed `renderer-cdp-ready`, `renderer-runtime-api-ready`, `chat-target-configured`, `click-loop-start-and-wait`, `click-check-target-and-preserve-identity`, `click-loop-stop-and-wait`, `click-stop-all-and-wait`, and `final-clean-state`.

The current-head acceptance configured the saved target and reached renderer/runtime/browser readiness, but relay start was blocked by durable `executing` state on non-idle turn `turn-9590b53b5c1a3a8f`. The existing recovery path quarantined it successfully with receipt `41329076dd7257bf609064d84f3852e7083a41ebf48cddb5f0b7db673ff2cd71` and cleared ambiguity. Do not patch product source to satisfy a contaminated target. Use the existing `ACCESS_AGENT_ACCEPTANCE_CHAT_URL` or saved exact browser target configuration when a clean idle/baselined target is available.

## Later gates

1. node-pty AttachConsole owner mapping.
2. Cline successful-login restart persistence.
3. Arbitrary process-death exactly-once recovery.
4. Isolated browser task contexts while retaining persistent relay identity.
5. Native Chromium AX + optional screenshot perception.
6. CSP and parallel-settings cleanup.
