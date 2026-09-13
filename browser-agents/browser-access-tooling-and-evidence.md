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

## 12. Access Browser Agent current verified project status — 2026-09-13

Repository:

```text
Letterblack0306/Accecc_Browser_Agent
```

Current verified remote commit:

```text
3ed538c9c2820db66758c399b1545bb1e9be376d
Use Cline provider config and harden run state
```

The commit is present on `origin/main` and introduces source-level integration for:

- Cline-managed provider configuration through `ClineProviderConfigStore`;
- protection against copying Cline-managed profiles into local IDE provider settings;
- local runtime run-state hardening via shared terminal/run status ownership;
- stop/cancel epoch invalidation to prevent stale loop continuation after cancellation boundaries;
- additional provider/run-state contract tests;
- ignore rules for local provider/runtime settings that may contain credentials or machine-local paths.

Reported local validation for this commit before push:

```text
npm run check:agent-led                  PASS
node --test test/run-state-contract-smoke.js   3/3 PASS
node test/e2e-live-runtime.js            60/60 PASS
changed-file syntax checks               PASS
git diff --cached --check                PASS
```

These validations establish source/runtime-contract confidence for the tested paths, but they do **not** establish complete product acceptance.

Current evidence classification:

```text
source commit on remote main            PROVEN
Cline provider-config integration       IMPLEMENTED
run-state hardening                     IMPLEMENTED
contract/smoke test coverage            PASS (reported local execution)
real Cline provider health              UNVERIFIED
rendered Electron UI acceptance         UNVERIFIED
installed end-user UX acceptance        UNVERIFIED
```

The remaining live blocker reported from the workspace is dependency corruption / failed dependency reinstall on Windows (`errno -4094`), which prevents using the current environment as proof of real Cline provider health and rendered Electron UI behavior.

Two intentionally excluded local artifacts were reported after the commit:

```text
.agent/audit/
access-agent-2026-09-12T02-29-20-315Z-1c169114.jsonl
```

They were not committed or pushed.

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
