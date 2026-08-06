---
title: Browser Access Modes
category: Agents
sub_category: Browser and Computer Use
confidence: high
verified: true
last_reviewed: 2026-08-07
---

# Browser Access Modes

## Decision rule

Choose the narrowest, most deterministic interface that still represents the required workflow.

```text
Need data only?
  → use an authorized application API when available

Need browser UI semantics?
  → use locator/accessibility-driven automation

Need Chromium internals or an existing debug browser?
  → use CDP

Need cooperation with the user's existing browser tabs?
  → use an authenticated extension relay

Need to operate a canvas, remote desktop, or unsupported UI?
  → use visual computer interaction with stronger verification
```

## Managed automation browser

Best for:

- isolated tasks;
- repeatable workflows;
- deterministic context creation;
- locator-based interaction;
- test and validation harnesses.

Required controls:

- explicit browser/context lifecycle;
- persistent versus temporary profile selection;
- downloads/uploads policy;
- popup and new-page handling;
- clean shutdown and cancellation.

## Chrome DevTools Protocol

Best for:

- attaching to Chromium;
- target discovery;
- accessibility/DOM/network/runtime inspection;
- screenshots and page lifecycle events;
- preserving an existing controlled Chrome session.

Risks:

- remote debugging exposure;
- protocol-version differences;
- target/session confusion;
- experimental domain instability;
- accidentally controlling the wrong tab.

## Extension relay

Best for:

- user-enabled existing tabs;
- browser cooperation without launching a separate browser;
- explicit origin/tab authorization;
- browser environments where direct remote debugging is unsuitable.

Risks:

- extension permissions;
- compromised/untrusted page and content-script messages;
- service-worker lifetime;
- tab disconnects;
- cross-origin and frame scope;
- ambiguous control ownership.

## Visual computer use

Best for:

- canvas-heavy applications;
- remote desktops;
- browser-native surfaces not exposed semantically;
- fallback when DOM/accessibility access is insufficient.

Additional requirements:

- viewport and scale calibration;
- fresh screenshot before each consequential action;
- coordinate confidence;
- post-action visual verification;
- prevention of repeated blind clicks;
- stronger approval for ambiguous targets.

## Hybrid systems

A robust agent may combine modes:

```text
API for data
+ semantic browser tools for navigation/forms
+ screenshot for visual confirmation
+ CDP network/console evidence for debugging
```

The orchestrator should see one normalized browser-tool contract. Transport selection and fallback belong in adapters, not in prompt-level guesses.
