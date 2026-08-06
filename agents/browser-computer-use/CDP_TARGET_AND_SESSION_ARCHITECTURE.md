---
title: CDP Target and Session Architecture
category: Agents
sub_category: Browser and Computer Use
confidence: high
verified: true
last_reviewed: 2026-08-07
---

# CDP Target and Session Architecture

## Purpose

Chrome DevTools Protocol provides low-level instrumentation for Chromium. A production agent must wrap it behind target, session, timeout, and evidence abstractions rather than exposing raw commands directly to planning logic.

## Connection layers

```text
Browser process
  ↓ /json/version
Browser WebSocket endpoint
  ↓ Target discovery
Target IDs
  ↓ attachToTarget
Session IDs
  ↓ domain commands/events
Page, Runtime, DOM, Accessibility, Network, Input
```

Do not confuse browser endpoint identity, target identity, and attached session identity.

## Startup proof

A port being open is insufficient. Verify:

1. the configured host/port resolves;
2. `/json/version` returns a valid browser payload;
3. a browser WebSocket URL is present;
4. target discovery succeeds;
5. the required page can be identified;
6. attach and a harmless observation command succeed.

## Target registry

Maintain a runtime registry:

```json
{
  "targetId": "...",
  "type": "page",
  "url": "...",
  "title": "...",
  "browserContextId": "...",
  "openerId": "...",
  "role": "control|execution|internal|unknown",
  "protected": true,
  "attachedSessionId": "...",
  "lastSeenAt": "..."
}
```

Update it from target-created, target-info-changed, target-destroyed, attached, detached, and crashed events.

## Target manager invariant

Only one authority may decide:

- which target is protected;
- which target is selected for execution;
- when a target may be created;
- when a target may be activated or closed;
- how popups inherit operation ownership.

Do not duplicate target heuristics across navigation, screenshot, agent, and relay modules.

## Session discipline

- attach explicitly and store the returned session ID;
- prefer flat session routing when supported;
- route responses to the correct pending request;
- remove pending requests on timeout or detach;
- detach without closing the target unless closure is authorized;
- treat repeated detach events as possible;
- re-observe after reconnect rather than assuming page state survived.

## Protocol compatibility

CDP tip-of-tree changes frequently and does not guarantee backward compatibility. Production adapters should:

- inspect the running browser's protocol description where needed;
- avoid depending on experimental commands without capability checks;
- maintain adapter-level compatibility tests;
- return `unsupported_capability` rather than silently falling back to incorrect behavior.

## Observation domains

Useful domain responsibilities:

- `Target`: discovery, attachment, creation, lifecycle;
- `Page`: navigation, lifecycle, frames, screenshot, dialogs;
- `Accessibility`: semantic action-oriented tree;
- `DOM`/`DOMSnapshot`: structured document inspection;
- `Runtime`: controlled expression evaluation;
- `Network`: request/response evidence and debugging;
- `Input`: low-level mouse/keyboard/touch dispatch;
- `Log`/`Console`: diagnostics.

Enable only the domains needed for the current operation and disable expensive domains when finished.

## Runtime evaluation

Arbitrary `Runtime.evaluate` is a high-authority capability. Constrain it by:

- explicit tool registration;
- allowed target and origin;
- bounded expression size and timeout;
- result serialization limits;
- no secret extraction;
- no page-derived code execution;
- evidence of expression and returned result;
- separate approval for consequential scripts.

## Navigation proof

A navigation command response does not mean the final page is ready. Observe:

- frame/navigation identifier;
- lifecycle state;
- redirects and final URL;
- target replacement or popup creation;
- expected semantic element or application signal.

## Shutdown

On cancellation or application exit:

1. stop issuing new commands;
2. reject pending requests with typed cancellation;
3. detach sessions;
4. close only agent-owned targets/contexts when configured;
5. stop an agent-owned browser process;
6. leave user-owned browser tabs and processes intact.
