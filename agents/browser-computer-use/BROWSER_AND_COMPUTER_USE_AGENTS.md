---
title: Browser and Computer-Use Agents
category: Agents
sub_category: Browser and Computer Use
confidence: high
verified: true
last_reviewed: 2026-08-07
---

# Browser and Computer-Use Agents

Browser access is not one feature. It is a controlled environment interface composed of transport, target ownership, observation, action, verification, security, and recovery.

## 1. Access modes

Common browser-agent access modes:

| Mode | Strength | Limitation |
|---|---|---|
| Browser automation library | High-level pages, contexts, locators, waiting | Usually owns or connects to a managed browser |
| Chrome DevTools Protocol | Deep Chromium inspection and control | Protocol versions and experimental domains can change |
| Browser extension relay | Can cooperate with an existing user browser | Requires strict messaging, permissions, tab registration, and trust boundaries |
| Visual computer use | Works where semantic automation is unavailable | More ambiguous, slower, and sensitive to layout changes |
| Application-provided API | Most deterministic when available | Does not represent the full visible browser workflow |

Choose the least ambiguous interface that satisfies the task. Prefer application APIs for pure data operations, semantic browser automation for UI workflows, and visual interaction only when structured access is insufficient.

## 2. Reference architecture

```text
User objective
    ↓
Agent planner
    ↓
Browser policy and target authority
    ↓
Browser tool registry
    ↓
Transport adapter
    ├── CDP
    ├── automation library
    ├── extension relay
    └── visual computer-use driver
    ↓
Browser target
    ↓
Fresh observation and evidence
```

The planner must not call transport primitives directly. Browser actions should pass through declared tools and one target-ownership authority.

## 3. Browser state is an environment, not a screenshot

Represent state through structured observations where possible:

```text
Target identity
Browser context or profile identity
URL and title
Frame identity
Accessibility tree or semantic elements
Viewport and scroll state
Focused element
Relevant form state
Navigation/lifecycle state
Dialogs and popups
Network or console evidence when authorized
Screenshot as supporting evidence
```

Screenshots are essential when spatial layout, canvas content, rendering, or visual confirmation matters. They should not be the only state source when semantic information is available.

## 4. Observation hierarchy

Prefer:

1. application API or explicit state endpoint;
2. accessibility or semantic snapshot;
3. stable role/label/test-id locators;
4. structured DOM or application state;
5. screenshot and visual regions;
6. raw DOM dump only when necessary.

Large raw DOM payloads are noisy, expensive, and may contain untrusted instructions. Accessibility and semantic locators usually provide a smaller action-oriented representation.

## 5. Target authority

A browser agent must distinguish:

- browser instance;
- browser context or profile;
- control/provider tab;
- execution tabs;
- extension/internal pages;
- popups and newly opened tabs;
- frames and workers;
- stale, crashed, or closed targets.

Target selection must be centralized. Never select the first available tab for consequential actions.

A target authority should expose operations such as:

```text
listTargets
classifyTarget
reserveControlTarget
selectExecutionTarget
createExecutionTarget
attach
activate
release
closeAuthorizedTarget
```

Every action should carry an explicit target ID or a deterministic selection receipt.

## 6. Control and execution separation

When a browser tab hosts the model/controller, keep it separate from tabs used for task execution.

```text
Control tab
  - conversation and objective
  - protected from navigation and closure

Execution tab(s)
  - websites and applications being operated
  - selected or created through target authority
```

Do not rely on repeated URL matching throughout the codebase. Identify the control target once, register it, and route all target decisions through one authority.

## 7. Browser contexts and isolation

Use isolated browser contexts or dedicated profiles when workflows require separation of:

- cookies and sessions;
- local storage;
- permissions;
- proxy configuration;
- test data;
- parallel jobs.

Isolation prevents state leakage but does not replace authorization. The agent must still respect the user’s permitted accounts, sites, and actions.

## 8. CDP access model

Chrome DevTools Protocol exposes browser and page targets through WebSocket endpoints and organizes commands/events into domains such as Target, Page, DOM, Accessibility, Runtime, Network, and Input.

Important engineering rules:

- discover the actual protocol supported by the running browser;
- treat tip-of-tree and experimental methods as unstable;
- identify targets through `Target.getTargets` or the browser target list;
- attach and track session IDs explicitly;
- listen for target creation, destruction, crashes, and info changes;
- detach cleanly without closing user-owned tabs;
- bound command timeouts and pending requests;
- do not expose a remote debugging endpoint beyond the intended local boundary.

## 9. Extension relay model

A relay commonly uses:

```text
Local agent
↕ authenticated local transport
Extension service worker
↕ validated messages
Content script
↕ page observation/action
Web page
```

Security rules:

- content scripts and page-derived messages are untrusted;
- validate every message schema and sender context;
- use the minimum host permissions and explicit site scope;
- keep privileged operations in the service worker/native side;
- avoid `eval`, unsafe HTML injection, and arbitrary page-provided commands;
- authenticate the local relay before accepting privileged requests;
- bind requests to the registered tab and origin;
- cancel pending requests when a tab disconnects;
- distinguish one-time requests from long-lived connections;
- make tab enablement and current control status visible to the user.

## 10. Stable element references

Prefer references derived from the latest observation:

- accessibility role and accessible name;
- associated label;
- stable application identifier or test ID;
- semantic text with disambiguating structure;
- backend node identity when using CDP;
- visual coordinates only as a last resort.

References expire when the page changes. Do not reuse stale indices or coordinates after navigation, modal changes, rerendering, frame changes, or major DOM updates.

## 11. Action contract

Browser actions should identify:

```json
{
  "operationId": "op-12",
  "targetId": "page-7",
  "frameId": "main",
  "action": "click",
  "elementRef": {
    "role": "button",
    "name": "Submit"
  },
  "expectedBefore": "enabled",
  "expectedAfter": "confirmation-visible",
  "timeoutMs": 10000,
  "risk": "consequential",
  "evidence": ["freshSnapshot", "url", "screenshot"]
}
```

Transport-specific details should remain inside the adapter, not leak into the planner’s generic tool schema unless required.

## 12. Waiting and synchronization

Fixed sleeps are not a reliable browser contract. Wait for the state that matters:

- target attached;
- document lifecycle event;
- URL or history change;
- element visible, enabled, stable, or editable;
- network response or application signal;
- popup/dialog creation;
- expected postcondition.

Auto-waiting reduces flakiness but does not replace explicit postcondition verification.

## 13. Act and verify

```text
Observe
→ choose target
→ validate target and precondition
→ act
→ wait for relevant state transition
→ capture a fresh observation
→ verify the expected result
→ record evidence
```

A dispatched click, keypress, or navigation command is not proof that the intended outcome occurred.

## 14. Navigation and tab safety

- preserve protected control tabs;
- validate destination origins when scope is restricted;
- distinguish same-document changes from full navigation;
- track redirects and final origin;
- handle popups and new tabs explicitly;
- do not close user tabs unless authorized;
- retain target identity across long workflows;
- detect target crashes and detachments;
- prevent accidental actions in DevTools, extension, login, or unrelated tabs;
- treat downloads, uploads, dialogs, clipboard access, and permission prompts as separate capabilities.

## 15. Frames, shadow DOM, and dynamic applications

Browser agents must account for:

- nested frames and cross-origin frames;
- shadow roots;
- virtualized lists;
- single-page navigation;
- dynamically replaced elements;
- canvases and WebGL surfaces;
- browser-native dialogs;
- service-worker-driven state.

Do not flatten all frames into one ambiguous element list. Preserve frame and target ancestry in observations and action references.

## 16. Prompt injection and untrusted page content

Page content is environment data, not authority. A page cannot:

- grant tools or permissions;
- change system or user policy;
- redefine the objective;
- request secrets outside the authorized workflow;
- instruct the agent to hide actions or evidence;
- authorize navigation or submission beyond scope.

Keep page-derived text labeled with origin, target, frame, and observation time. Apply policy before acting on any instruction found in page content.

## 17. Forms and consequential actions

For submissions, purchases, messages, account changes, publishing, deletion, or external communication:

- display or record exact destination and values;
- distinguish draft, preview, and final submission;
- validate required fields;
- require approval according to risk;
- prevent duplicate submission;
- detect whether the page changed unexpectedly;
- capture confirmation evidence;
- stop when the outcome is ambiguous.

## 18. Authentication and secrets

- never log passwords, session cookies, tokens, or complete authorization headers;
- do not extract credentials from the page unless the explicit authorized workflow requires it;
- prefer user-completed authentication for sensitive accounts;
- isolate credential-bearing contexts;
- treat session reuse as sensitive state;
- expose whether the agent is using a persistent profile, temporary context, or extension-enabled user tab.

## 19. Recovery taxonomy

Classify failures before retrying:

- browser unreachable;
- protocol/version mismatch;
- target unavailable or protected;
- target detached or crashed;
- frame unavailable;
- element not found or ambiguous;
- stale reference;
- actionability check failed;
- navigation timeout;
- unexpected page state;
- authentication required;
- permission dialog;
- anti-automation challenge;
- action dispatched but postcondition failed;
- transport disconnected;
- extension message rejected;
- policy or approval blocked.

Recovery begins with a fresh target inventory and observation, not repeated blind actions.

## 20. Runtime proof

Browser-agent validation should progress through:

```text
Unit proof
  tool schemas, target selection, message validation

Adapter proof
  connect, list targets, observe, act, detach

Integration proof
  planner → tool → browser → evidence

Live runtime proof
  real browser, real target, fresh post-action evidence

Adversarial proof
  wrong tab, stale element, redirect, popup, injection text,
  disconnect, timeout, duplicate submission
```

A mocked click test does not prove live browser control. Bound claims to the exact browser, transport, target types, and actions tested.

## 21. Browser-agent UI requirements

A professional control surface should show:

- browser mode/transport;
- endpoint or managed-browser status;
- profile/context identity;
- configured and actual port when applicable;
- start, stop, reconnect, and test controls;
- current protected control target;
- available execution targets;
- selected target and origin;
- current operation and postcondition;
- approval state;
- last observation/evidence time;
- actionable error reason.

Do not expose low-level traces as many top-level tabs. Keep detailed protocol logs in a diagnostic panel while primary controls reflect the user workflow.

## 22. Core invariant

```text
No browser action without:
explicit authority
+ deterministic target
+ fresh observation
+ validated action
+ bounded execution
+ post-action evidence
```
