# Browser Chat DOM Discovery and CDP Patterns

## Purpose

Historical reference patterns for browser-based AI conversation automation.

This document records reusable mechanisms discovered from development experiments. It is not implementation proof for any current project. Current repository source, runtime evidence, and tests remain authoritative.

## Core Pattern

Browser conversation automation should be modeled as:

```
Chrome instance
    ↓
CDP connection
    ↓
Browser contexts/pages
    ↓
Conversation identity validation
    ↓
DOM observation
    ↓
Composer interaction
    ↓
Delivery confirmation
```

## Target Discovery

Do not assume the active tab is the correct conversation.

Preferred flow:

```
all browser pages
    ↓
URL/provider identity filtering
    ↓
conversation candidate selection
    ↓
verified target
```

## DOM Discovery Strategy

Avoid relying on one fragile selector.

Use ordered evidence layers:

1. Verified selectors from live inspection.
2. Fallback selectors for UI drift.
3. Whole-page marker scanning for known protocol envelopes.

Example:

```
assistant message
    ↓
selector candidates
    ↓
visible text extraction
    ↓
protocol marker detection
```

## State Detection

Prefer actual state observables over visual guesses.

Examples:

Preferred:

- streaming/state attributes exposed by the UI.
- target identity information.
- transport state.

Fallback:

- stop buttons.
- button availability.
- DOM presence.

## Composer Interaction

Before sending:

```
find composer
    ↓
visible?
    ↓
enabled?
    ↓
insert text
    ↓
send action
    ↓
verify result
```

Contenteditable editors such as ProseMirror may require input events rather than simple value assignment.

## Evidence Classification

Every selector or interaction method should record:

```
verified:
  live DOM inspected

inferred:
  based on similar UI patterns

unknown:
  requires runtime validation
```

## Architecture Rule

Browser automation is a transport mechanism, not the source of truth.

Maintain separate identities:

- conversation/chat ID
- browser target ID
- runtime session ID
- operation/tool ID
- delivery correlation ID

A successful DOM interaction does not prove correct conversation delivery unless identity and delivery evidence match.

## Historical Reference

Sources include development experiments using CDP + Playwright browser loops for AI chat interfaces.

Use this knowledge to guide investigation and testing, not to replace current implementation verification.
