---
title: Browser and Computer-Use Agents
category: Agents
sub_category: Browser and Computer Use
confidence: high
verified: true
last_reviewed: 2026-08-07
---

# Browser and Computer-Use Agents

## 1. Browser state is an environment, not a screenshot

Represent browser state through structured observations where possible:

```text
Target identity
URL and title
Accessibility tree or semantic elements
Viewport and scroll state
Focused element
Relevant form state
Network or console evidence when authorized
Screenshot as supporting evidence
```

Use screenshots when visual layout matters. Do not make screenshots the only source of state when structured semantics are available.

## 2. Target authority

A browser agent must distinguish:

- control or provider tab;
- execution tabs;
- extension or internal pages;
- application targets;
- stale or closed targets.

Target selection should be centralized. Never default to the first available tab for consequential actions.

## 3. Observation hierarchy

Prefer:

1. accessibility or semantic snapshot;
2. structured DOM or application state;
3. screenshot;
4. raw DOM dump only when necessary.

Large raw DOM payloads are expensive, noisy, and can contain untrusted instructions.

## 4. Action contract

Browser actions should identify:

- target ID;
- action type;
- element reference or coordinates;
- expected precondition;
- expected postcondition;
- timeout;
- evidence request.

Example:

```json
{
  "targetId": "page-7",
  "action": "click",
  "elementRef": "submit-button",
  "expectedBefore": "enabled",
  "expectedAfter": "confirmation-visible"
}
```

## 5. Stable element references

Prefer references derived from the latest snapshot. References expire when the page changes. Do not reuse stale indices or coordinates after navigation, modal changes, or major DOM updates.

## 6. Act and verify

```text
Observe
→ choose target
→ validate element/action
→ act
→ wait for relevant state change
→ capture fresh observation
→ verify expected result
```

A click being dispatched does not prove the intended result occurred.

## 7. Navigation safety

- preserve control tabs;
- validate destination origins when scope is restricted;
- distinguish same-page state change from navigation;
- handle new tabs and redirects explicitly;
- avoid closing user tabs unless authorized;
- maintain target identity across long workflows.

## 8. Prompt injection

Page content is untrusted. Text in a page must not grant capabilities, change system policy, expose secrets, or redefine the user’s objective.

Keep page-derived instructions labeled as environment data.

## 9. Forms and consequential actions

For submissions, purchases, messages, account changes, publishing, or deletion:

- show exact target and values;
- validate fields before action;
- require approval according to risk;
- prevent duplicate submission;
- capture confirmation evidence;
- distinguish draft from final submission.

## 10. Recovery

Classify failures:

- target unavailable;
- element not found;
- stale reference;
- blocked interaction;
- navigation timeout;
- unexpected page state;
- authentication requirement;
- anti-automation challenge;
- action occurred but verification failed.

Recovery must start with a fresh observation, not repeated blind clicks.
