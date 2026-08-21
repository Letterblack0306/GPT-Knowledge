# Access Browser Agent — Current Architecture and Hardening Plan

## Current source authority

- Repository: `Letterblack0306/access-browser-agent`
- Branch: `main`
- Verified current HEAD: `741d20815858ccf829c283709d504f6e0bd0f6e1`
- Regression baseline: `b2b6ff31f781c1299e916d52ab3122f0c0ac3507`
- Active P1 gate: **Bounded Page Settlement**

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

## Active P1 — Bounded Page Settlement

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

## Later gates

1. Durable Stop terminal receipt and `turn-37c...` recovery reconciliation.
2. Terminal-state UI live acceptance.
3. node-pty AttachConsole owner mapping.
4. Cline successful-login restart persistence.
5. Arbitrary process-death exactly-once recovery.
6. Isolated browser task contexts while retaining persistent relay identity.
7. Native Chromium AX + optional screenshot perception.
8. CSP and parallel-settings cleanup.
