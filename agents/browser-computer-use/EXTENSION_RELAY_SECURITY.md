---
title: Extension Relay Security
category: Agents
sub_category: Browser and Computer Use
confidence: high
verified: true
last_reviewed: 2026-08-07
---

# Extension Relay Security

## Trust model

```text
Local agent process          trusted only within its granted workspace/runtime scope
Local relay                  privileged transport boundary
Extension service worker     privileged browser-extension authority
Content script               lower-trust page-adjacent component
Web page                     untrusted environment
```

A page must never gain local-agent authority merely because its content script can send a message.

## Registration and pairing

Require an explicit pairing or authentication step before a local relay accepts an extension connection.

The pairing design should provide:

- high-entropy secret or user-mediated pairing;
- local-only storage with restrictive permissions;
- short-lived session token after pairing;
- origin and extension identity validation;
- token rotation on restart or explicit reset;
- rejection before allocating expensive WebSocket/session state.

## Tab authorization

A connected extension is not permission to control every tab.

Maintain explicit tab records:

```json
{
  "tabId": 42,
  "origin": "https://example.com",
  "enabled": true,
  "role": "execution",
  "registeredAt": "...",
  "lastSeenAt": "..."
}
```

Validate each command against the current tab record, target origin, requested capability, and operation ownership.

## Message schema

Every message must have a versioned envelope:

```json
{
  "version": 1,
  "requestId": "...",
  "operationId": "...",
  "tabId": 42,
  "type": "browser.snapshot",
  "payload": {},
  "timestamp": "..."
}
```

Reject:

- unknown versions or types;
- missing identifiers;
- oversized payloads;
- stale or replayed requests;
- mismatched tab/origin;
- actions outside registered capabilities;
- unvalidated page-derived command data.

## Content-script boundary

Chrome guidance treats content scripts as less trustworthy than the extension service worker. Therefore:

- sanitize and validate all content-script messages;
- keep privileged decisions outside the content script;
- never evaluate page-provided strings as code;
- prefer isolated execution worlds;
- use the main world only when necessary and with narrower capabilities;
- avoid returning secrets or broad privileged data to page-adjacent code;
- render returned text safely rather than injecting arbitrary HTML.

## Permission minimization

- request only required host permissions;
- prefer user-enabled origins/tabs;
- make active permissions visible;
- separate observation from mutation permissions;
- revoke tab authority on disable, navigation outside scope, closure, or disconnect;
- avoid permanent broad origin access when session-scoped access is enough.

## Connection lifecycle

Support both one-time requests and long-lived channels, but explicitly handle:

- service-worker suspension/restart;
- page reload;
- frame replacement;
- tab closure;
- browser restart;
- duplicate connections;
- relay restart;
- pending request cancellation;
- heartbeat/last-seen expiration.

When a tab or connection disappears, reject all bound pending operations with a typed error rather than leaving promises unresolved.

## Action evidence

A response should include:

```json
{
  "requestId": "...",
  "operationId": "...",
  "tabId": 42,
  "origin": "https://example.com",
  "status": "completed",
  "result": {},
  "observedAt": "..."
}
```

Do not accept success without verifying the response belongs to the same operation, tab, and origin.

## Relay UI

Expose:

- relay connected/disconnected;
- extension paired/unpaired;
- enabled tabs and origins;
- selected control/execution role;
- last heartbeat;
- pending operation count;
- rejected message reason;
- revoke/disconnect control.

Do not represent transport connectivity as proof that browser actions work. Provide a separate live test that registers a tab, obtains a snapshot, performs a harmless action, and captures fresh evidence.
