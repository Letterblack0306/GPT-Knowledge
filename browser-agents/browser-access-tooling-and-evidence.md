# Browser Access, Tooling, and Evidence Patterns

## Scope

This document extracts reusable browser-agent patterns from:

- `agent0ai/agent-zero`
- `NousResearch/hermes-agent`
- `openclaw/openclaw`
- `openai/codex`

The emphasis is browser access, target control, tooling, safety, evidence, and integration with a broader agent runtime.

## 1. Browser access is a capability, not a UI panel

A Browser tab in the UI is not proof that the agent has browser access. Browser capability is proven only when the runtime can:

1. discover a browser backend;
2. prove a healthy connection;
3. enumerate targets/pages;
4. select an explicit target;
5. execute a browser action;
6. verify the visible outcome;
7. record evidence.

The UI should display the currently active browser backend, connection state, target identity, and last verified action.

## 2. Support multiple browser access models behind one contract

Reference systems expose several access patterns:

- built-in browser inside an isolated environment;
- host-browser access through a connector;
- cloud browser through a provider gateway;
- browser-adjacent device nodes or companion surfaces;
- editor or terminal workflows that can invoke browser tools.

Normalize them behind a transport-neutral contract:

```text
connect
health
list_targets
select_target
navigate
snapshot_dom
capture_screenshot
query
act
upload
read_console
read_network
close_target
disconnect
```

The active backend may be CDP, Playwright, Puppeteer, Browser Use, an extension relay, or a proprietary connector. Tool callers should not need backend-specific branching for basic operations.

## 3. Target discovery must be explicit

Never assume the first tab is the intended page.

A browser target record should include:

```text
targetId
browserInstanceId
sessionId
type
title
url
origin
createdAt
lastSeenAt
attached
active
```

The user or agent must select a target before actions that could affect a page. Selection state must survive only while the target remains valid.

## 4. Separate inspect, act, and capture tools

Agent Zero's browser annotation model demonstrates the value of turning page elements into inspect, change, lift, or comment directives. The reusable lesson is that browser work should not be one generic `browser` tool.

Recommended tool classes:

### Navigation

- open URL;
- go back/forward;
- reload;
- create or close tab.

### Inspection

- DOM snapshot;
- accessibility tree;
- computed style;
- parent chain;
- framework hints;
- element bounds;
- page metadata.

### Action

- click;
- type;
- select;
- drag;
- scroll;
- upload;
- execute bounded script.

### Capture

- screenshot;
- element crop;
- full-page image;
- DOM artifact;
- console log;
- network trace.

### Review and annotation

- attach comment to element;
- identify component boundary;
- record requested change;
- link annotation to source target and screenshot.

These actions should have distinct schemas and evidence outputs.

## 5. DOM annotation is an instruction interface

Agent Zero treats browser elements as addressable objects for inspect, change, lift, and comment workflows. This is a strong pattern for UI review and implementation tasks.

A portable annotation record should include:

```text
annotationId
targetId
pageUrl
frameId
selector strategy
DOM path
accessible name
bounding box
screenshot reference
instruction type
user note
createdAt
status
linked implementation operation
```

Selectors alone are brittle. Store several anchors: semantic role, text, DOM path, attributes, and geometry.

## 6. Bring-your-own-browser requires an explicit trust bridge

Agent Zero's host connector and OpenClaw's nodes illustrate a recurring pattern: the core agent may run in one environment while controlled capabilities live on another machine.

A host-browser bridge should have:

- explicit pairing or authentication;
- per-capability grants;
- visible active connection;
- revocation;
- endpoint discovery without fixed ports;
- bounded reconnect;
- local confirmation for sensitive actions;
- no silent fallback to a different browser.

The agent must distinguish:

```text
isolated browser
host browser
remote browser
cloud browser
```

because their data exposure and authority differ.

## 7. Browser security starts with untrusted input

OpenClaw explicitly warns that inbound messages are untrusted. Browser pages are also untrusted input. A page may contain prompt injection, deceptive controls, malicious downloads, or instructions that conflict with the user's objective.

Required controls:

- never treat page text as system instruction;
- separate observed content from trusted policy;
- require approval for credential entry, purchases, destructive actions, external sharing, and downloads that execute;
- constrain script execution;
- block navigation to disallowed schemes;
- isolate secrets from page-visible context;
- redact sensitive data in logs and screenshots;
- record origin and target for every browser action.

## 8. Browser actions need postcondition verification

A successful API call is not enough.

Examples:

```text
click succeeded
→ verify expected element state, URL, dialog, or content change

navigate succeeded
→ verify final URL and page readiness

type succeeded
→ verify field value

upload succeeded
→ verify filename or upload state

capture succeeded
→ verify image exists, dimensions are valid, and target identity matches
```

## 9. Access Browser Agent: local reasoning agent + browser/provider instruction boundary

For the Access Browser Agent project, the documented concept is a **single authoritative local agent lifecycle** for coding and development work.

The local agent is the reasoning and development authority:

```text
Browser / instruction provider
        ↓
transport
        ↓
Local AgentSessionRuntime / LiveAgentCore
        ↓
reasoning + coding / development
        ↓
controlled capabilities
```

The browser/provider conversation is the **instruction source and delivery surface**. It supplies the natural-language turn/context to the local reasoning agent and receives the resulting work/output back through the transport boundary.

The browser/provider side is not a second reasoning agent and must not become a second autonomous BrowserLoop with its own reasoning, retries, semantic interpretation, or completion authority.

The governing architectural rule is:

> **Agents reason; bridges transport. Governance constrains authority without becoming a second reasoning engine.**

For this project, that means:

- the local `AgentSessionRuntime` / `LiveAgentCore` remains the single reasoning lifecycle;
- the browser/provider channel observes, transports, preserves identity/order, journals, deduplicates, and delivers;
- browser access remains a capability available to the local agent rather than the agent brain;
- governance limits authority and side effects without replacing agent reasoning;
- ordinary natural-language assistant turns are transported without requiring a semantic instruction envelope;
- any structured transport path remains an explicit protocol rather than a substitute for general agent reasoning.

The Browser Loop is therefore a transport/integration boundary around the local agent, not a second agent architecture.

## 10. Access Browser Agent phased capability model

The Access Browser Agent project documents a phased development order. The project plan is the authority for project-specific scope and acceptance; this section records the reusable knowledge needed to reason about that architecture.

The documented sequence is:

```text
Phase 0 → clean-baseline re-audit
Phase 1 → browser capability authority
Phase 2 → read-only browser tools
Phase 3 → verified browser actions
Phase 4 → evidence/artifact integration
Phase 5 → provider adapters
Phase 6 → provider-driven loop
Phase 7 → browser UI
Skills   → procedural inspection/recovery knowledge, not new runtime authorities
```

The architecture remains one local reasoning lifecycle throughout these phases. Capability scope grows around the agent; it does not create additional reasoning lifecycles inside browser tabs, provider adapters, or transport bridges.

Project-specific implementation and current-status claims must be verified against the Access Browser Agent repository and its current project documentation. This GPT-Knowledge section does not replace live repository or runtime evidence.

## 11. Browser-agent evidence rule

For Access Browser Agent work, distinguish clearly between:

```text
instruction source
→ transport
→ local agent reasoning
→ selected capability
→ real observation
→ result/evidence
→ delivery
```

Do not infer that a browser capability is implemented merely because a provider adapter, endpoint, UI panel, class, or tool schema exists.

A capability is considered implemented only when it is:

- registered;
- reachable;
- executable;
- validated;
- evidenced.

End-to-end claims require a correlated real user/runtime path and must not be inferred from disconnected component tests.

## 12. Access Browser Agent current verified project status — 2026-09-16

Repository:

```text
Letterblack0306/Accecc_Browser_Agent
```

Desktop handoff branch:

```text
fix/browser-target-role-routing-20260916
```

Current verified remote head:

```text
37b8d5becb42556b4a361fbfa13773f46a3fe610
fix: complete managed chrome launcher integration
```

Branch state verified on GitHub at handoff:

```text
base main: 3ed538c9c2820db66758c399b1545bb1e9be376d
branch ahead of main: 2 commits
branch behind main: 0 commits
```

The two handoff commits are:

```text
73671d528e43c5d55257ad1cd947da7c465d4d8b
feat: bind browser actions to target roles

37b8d5becb42556b4a361fbfa13773f46a3fe610
fix: complete managed chrome launcher integration
```

### Implemented on the handoff branch

Source review verifies the following implementation exists on the branch:

- explicit browser target roles: `instruction` and `work`;
- target selection by `targetId`, exact `targetUrl`, or `targetRole`;
- fail-closed handling for unassigned/missing requested targets;
- live browser tool exposure for `browse`, `snapshot`, `click`, `type`, `press`, and `waitForChange`;
- tool correlation through `sessionId`, `turnId`, and `toolCallId`;
- post-action verification for navigation, click, typing, key press, and state-change waits;
- repeated-action non-progress detection with terminal `BLOCKED_NON_PROGRESS` behavior;
- renderer/main IPC for target listing and role assignment;
- managed-Chrome launcher helpers `validateBrowserExecutableSetting`, `isCdpEndpointAlive`, and `normalizeDebugPort`;
- configured debug-port propagation into Chrome launch arguments;
- launcher smoke coverage wired into the normal `npm test` → `npm run check` → `check:agent-led` path.

### Current evidence classification

```text
remote handoff branch exists                         PROVEN
remote head 37b8d5b exists                          PROVEN
branch +2 / behind 0 relative to main               PROVEN
instruction/work target-role routing                IMPLEMENTED
click/type/press/waitForChange live tool surface    IMPLEMENTED
non-progress guard                                  IMPLEMENTED
tool correlation                                    IMPLEMENTED
managed Chrome missing-helper integration           FIXED
debug-port source propagation                       FIXED
launcher smoke in standard check path               IMPLEMENTED
reported local npm test / full check                REPORTED PASS
GitHub commit status contexts for 37b8d5b           NONE OBSERVED
real visible ChatGPT → site → ChatGPT E2E            UNVERIFIED
concurrent multi-session target-role isolation       UNVERIFIED
```

### Remaining source/test gaps noted at handoff

The branch should not be treated as final product acceptance yet.

1. `test/chrome-launcher-smoke.js` verifies debug-port normalization and CDP endpoint liveness, but does not directly capture `spawn()` arguments and assert that `launchManagedChrome(..., 9222)` emits `--remote-debugging-port=9222`.
2. `test/runtime-hardening-regression.js` exists but was not observed in the normal `npm test` chain at the verified handoff commit.
3. `validateBrowserExecutableSetting()` verifies existence/file-ness for explicit paths but does not establish browser identity or an approved Chrome/Chromium/Edge allowlist.
4. The visible two-target workflow remains the final acceptance gate:

```text
ChatGPT instruction target
→ receive/read instruction
→ preserve exact instruction target
→ operate a separate external work target
→ observe/verify work result
→ return to exact ChatGPT target
→ type report
→ send
→ verify report delivery/state change
→ continue from new instruction
```

### Laptop → desktop handoff state

The Browser Agent changes were produced/verified on the laptop and preserved remotely before cleanup.

User-reported laptop cleanup:

```text
REMOVED
D:\Repos\Browsers agent\_Accecc_Browser_Agent_remote_check_20260916

REMAINING LAPTOP FOLDERS
D:\Repos\Browsers agent\Browser_Access
D:\Repos\Browsers agent\codex-research
```

The removed folder was a redundant verification clone. The GitHub branch above is the preserved development handoff and should be treated as the remote continuation point for desktop work.

Desktop continuation invariant:

```text
fetch origin
→ switch to fix/browser-target-role-routing-20260916
→ fast-forward/verify HEAD 37b8d5becb42556b4a361fbfa13773f46a3fe610
→ verify clean working tree
→ continue development from that state
```

Do not infer deletion of any remaining laptop folder merely because the remote branch exists. Cleanup status for laptop-local paths is user-reported unless separately verified on that machine.

### Status interpretation rule

Do not promote this Browser Agent status into LBE acceptance. `Accecc_Browser_Agent` and the LBE repositories are separate projects with separate product/runtime acceptance gates.

For Browser Agent, distinguish:

```text
FUNCTIONAL PASS
= a bounded tested capability behaves correctly

INTEGRATION PASS
= it works through the actual Browser Agent product path

INSTALLED PASS
= it works from the real installed artifact/environment

USER-FLOW PASS
= a normal user can reach and operate it without internal setup knowledge

UX PASS
= the rendered interaction is clear, predictable, and operationally usable
```

A feature must not be described as fully working merely because one bounded test says PASS. Final product claims require claim-matched installed and user-visible evidence.

## 13. Browser Agent truth-reconciliation rule — 2026-09-16

Project truth must be reconciled from multiple evidence classes rather than copied from one source.

Authoritative evidence inputs:

```text
1. current Browser Agent repository state
   - commits / refs / source files / tests

2. current real-machine runtime evidence
   - rendered Electron UI
   - real workspace path
   - real managed Chrome/CDP process
   - actual logs and failure receipts

3. GPT-Knowledge project records
   - distilled architecture/status/history

4. synced Google Drive chat/session history
   - chat_Print dated ChatGPT exports
   - Browser Agent sync manifest
   - historical conversation context and prior decisions
```

Google Drive chat/session exports are **historical evidence**, not automatic current truth. They are used to recover prior intent, decisions, earlier status claims, and contradictions. An older chat statement must not override newer repository or runtime evidence.

Likewise, repository implementation is not automatically runtime proof. Source can establish `IMPLEMENTED`; only claim-matched real execution can establish `PROVEN` runtime behavior.

When sources disagree, preserve the disagreement explicitly:

```text
repo says X
chat history says Y
runtime shows Z
→ classify each source by date/scope/evidence
→ do not silently reconcile
→ current claim follows the strongest claim-matched evidence
```

For Browser Agent work, check the current repository and relevant Drive chat/session records before updating GPT-K when the historical context can materially affect the conclusion.

### Current live-runtime failure evidence

Latest user-provided real Electron runtime evidence shows two active failures:

```text
Workspace UI/runtime state: C:\
agent:start error: EPERM: operation not permitted, mkdir 'C:\'

managed Chrome:
Chrome exited early (code 0)
repeated launch retries failed
```

Classification:

```text
real Electron UI launched                 PROVEN
Electron preload API available            PROVEN
PTY shell launched                        PROVEN
intended Browser Agent workspace binding  FAIL
agent:start real path                     FAIL
managed Chrome real launch                FAIL
ChatGPT → work target → ChatGPT E2E        BLOCKED
product acceptance                        NOT PASSED
```

Current debugging doctrine is failure-focused:

```text
observed failure
→ trace exact runtime owner/call path
→ prove wrong state/value and its origin
→ identify falsifier
→ make smallest correct fix
→ rerun the same real path
→ prove that specific failure disappeared
```

Do not spend acceptance effort re-proving already-passed smoke/unit/headless checks. Smoke or synthetic tests may support diagnosis, but they cannot substitute for real-machine UI/runtime acceptance.
