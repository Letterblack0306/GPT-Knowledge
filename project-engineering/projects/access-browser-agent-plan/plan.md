# Access Browser Agent — Current Architecture and Hardening Plan

## Current source authority

- Repository: `Letterblack0306/access-browser-agent`
- Branch: `main`
- Verified current HEAD: `26c72b455de71d6ff5d8505888c6dfd6304bec65`
- Regression baseline: `b2b6ff31f781c1299e916d52ab3122f0c0ac3507`
- Active P1 gate: **Terminal-state UI live acceptance**

This page is a GPT-Knowledge projection. Current source, local runtime evidence and acceptance results remain authoritative.

## Engineering workflow authority — BirdEye first

Canonical project method:

`project-engineering/projects/access-browser-agent-plan/birdeye-first-engineering-workflow.md`

Before any plan or source mutation:

```text
GPT-Knowledge route/current gate
→ inspect existing BirdEye MCP/index/workspace capabilities
→ verify GitHub main SHA + exact diff
→ use existing BirdEye validation profile for local behavioral proof when available
→ classify only the tested gate
→ synchronize GPT-Knowledge
→ verify Vercel/live projection
→ only then continue
```

Planning must classify capabilities as:

```text
EXISTING + PROVEN
EXISTING BUT NOT YET VERIFIED LIVE
MISSING — IMPLEMENTATION REQUIRED
```

Only the third category authorizes a new capability plan. BirdEye's MCP surface, incremental watcher/shared SQLite index, configured local validation bridge and GitHub polling bridge are already proven from current BirdEye source. A webhook/trigger is **not yet proven from current BirdEye remote main** and must be checked in the active installation before relying on it or declaring it missing.

LoopTool is not the default local evidence path. Use it only when BirdEye cannot provide the required configured validation, or when explicitly testing LoopTool/its relay transport.

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

GitHub `main` is four commits ahead of the historical validation head `0048d0d`, ending at `26c72b45`:

- `1880e402` — IDE reference styling;
- `0ca41939` — activity rail adapter;
- `f78821d6` — IDE shell reference structure styles;
- `26c72b45` — activity rail and stylesheet wiring in `electron/index.html`.

Changed source files are `electron/index.html`, `electron/rebuild-ide-reference.css`, `electron/rebuild-ide-reference.js`, and `electron/rebuild-ui-stability.css`.

The UI source implementation is present and the new activity-rail JavaScript syntax check passes. At current head, `npm run check:rebuild` fails in `rebuild-agent-truth-observability-smoke.js`, while `npm run check` fails in `browser-tool-evals` (`expected UNVERIFIED`, received `SETTLED`). Existing rendered/live evidence remains tied to `0048d0d`; current-head rendered and live acceptance are not yet proven.

## Active P1 — Terminal-state UI live acceptance

Historical source and rendered regressions are proven at `0048d0d`. Current UI source is at `26c72b45`, so rendered and live acceptance must be revalidated at the current head. The previous live Electron/CDP acceptance booted the renderer, runtime, browser and relay, but the saved ChatGPT target was non-idle and immediately entered `lifecycle=executing`. The required `waiting_for_instruction` checkpoint was therefore not observable.

Classification: **HISTORICAL_SOURCE_AND_RENDERED_REGRESSION_PROVEN_CURRENT_HEAD_UI_REVALIDATION_REQUIRED_LIVE_ACCEPTANCE_BLOCKED_BY_NON_IDLE_TARGET**

Next acceptance question: can the existing acceptance at current head `26c72b45` run against an explicitly idle/baselined ChatGPT target so `waiting_for_instruction` and current-head terminal UI presentation are observable?

The current-head acceptance configured the saved target and reached renderer/runtime/browser readiness, but relay start was blocked by durable `executing` state on non-idle turn `turn-9590b53b5c1a3a8f`. The existing recovery path quarantined it successfully with receipt `41329076dd7257bf609064d84f3852e7083a41ebf48cddb5f0b7db673ff2cd71` and cleared ambiguity. Do not patch product source to satisfy a contaminated target. Use the existing `ACCESS_AGENT_ACCEPTANCE_CHAT_URL` or saved exact browser target configuration when a clean idle/baselined target is available.

## Later gates

1. node-pty AttachConsole owner mapping.
2. Cline successful-login restart persistence.
3. Arbitrary process-death exactly-once recovery.
4. Isolated browser task contexts while retaining persistent relay identity.
5. Native Chromium AX + optional screenshot perception.
6. CSP and parallel-settings cleanup.
