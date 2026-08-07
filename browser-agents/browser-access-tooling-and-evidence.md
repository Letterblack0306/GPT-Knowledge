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

The verification method should be chosen before the action when possible.

## 9. Screenshots are evidence and memory inputs

Agent Zero keeps browser history screenshots of important steps. A robust browser agent should treat screenshots as first-class artifacts with metadata:

```text
artifactId
sha256
path or object reference
capturedAt
browserInstanceId
targetId
url
viewport
fullPage
source operationId
source toolCallId
redaction state
content summary
```

Screenshots should not be pushed into Git by default. The storage policy may use a local object store, indexed path, or explicit artifact repository. Hashing enables deduplication and stable references.

## 10. Visual and DOM evidence should complement each other

DOM-only proof misses visual overlap, clipping, colors, and rendering failures. Screenshot-only proof misses semantics, hidden state, and exact element identity.

For important browser actions, collect both:

```text
structured state
  DOM/accessibility snapshot
  URL
  selected target
  console/network result

visual state
  screenshot
  element crop when relevant
```

## 11. Browser history must be tied to session identity

Do not store a loose sequence of screenshots without provenance.

Each browser event should carry:

```text
conversationId
sessionId
turnId
operationId
toolCallId
browserInstanceId
targetId
```

This enables replay, audit, and rejection of stale results.

## 12. Browser lifecycle must be configurable and recoverable

Browser configuration should support:

```text
backend type
endpoint or discovery mode
browser executable
profile path
start URL
headless setting
fallback policy
connection timeout
poll interval
reconnect limit
capture directory
```

Do not hardcode ports or machine-specific paths. A fallback backend must be explicit and visible, not automatic and silent.

Lifecycle states should include:

```text
unconfigured
discovering
connecting
ready
degraded
unavailable
reconnecting
stopping
stopped
```

## 13. Browser controls need one authoritative owner

A UI may expose proxy controls, but there should be one authoritative implementation for checking browser health, listing pages, selecting targets, and capturing pages.

Duplicate control trees create:

- duplicate IDs;
- conflicting state;
- inconsistent disabled logic;
- multiple event handlers;
- false health indicators.

Proxy UI controls should invoke the authoritative control or runtime API and subscribe to the same state store.

## 14. Browser tools should be capability-scoped

A useful permission model separates:

```text
read page
navigate
interact
upload local file
download file
execute script
access host browser
access authenticated session
access camera or screen
persist browser profile
```

Granting “browser access” should not imply every capability.

## 15. Validation matrix

A browser-agent implementation is not complete until it proves:

| Area | Required proof |
| --- | --- |
| Backend | connection and health evidence |
| Discovery | target list with stable IDs |
| Selection | selected target shown and enforced |
| Navigation | final URL and readiness verified |
| Inspection | DOM/accessibility result tied to target |
| Action | postcondition verified |
| Screenshot | artifact exists with hash and provenance |
| Failure | bounded retry and explicit reason |
| Stop | active browser work terminates promptly |
| Security | sensitive action reaches approval boundary |
| UI | controls remain clickable and status is truthful |

## Source-derived strengths

### Agent Zero

- built-in browser with live Canvas surface;
- DOM annotation for change, inspect, lift, and comment;
- browser history screenshots;
- host-browser access through a connector;
- support for Chromium-family host browsers;
- visible user intervention.

### Hermes

- cloud-browser access through a tool gateway;
- broad tool configuration and provider flexibility;
- gateway continuity across CLI and messaging;
- explicit security, command approval, and container isolation documentation.

### OpenClaw

- gateway control plane;
- tools and nodes as distributed capabilities;
- camera, screen, and device-local actions;
- pairing and sandboxing concerns;
- untrusted inbound input model.

### Codex

- local-first agent execution;
- terminal, IDE, app, and cloud surfaces;
- skills and repository-scoped workflows;
- a focused pattern for keeping execution visible to the user.

## Design rule

A browser agent should never claim success because a command returned without error. Success requires a verified page-level outcome and attributable evidence.