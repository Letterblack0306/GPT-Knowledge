---
title: Information Architecture
category: UI
sub_category: Architecture
confidence: high
verified: true
last_reviewed: 2026-08-07
applicable_to:
  - desktop
  - web
  - mobile
  - complex tools
---

# Information Architecture

Information architecture defines what users see, how content is grouped, and how they move through the product.

## Start from user goals

Map the interface from real tasks, not source folders or backend services.

For each task record:

```text
Goal
Inputs
Decisions
Primary action
Supporting actions
Progress
Result
Recovery
```

## Primary navigation rule

Primary navigation is reserved for major, recurring user destinations.

A destination qualifies when it:

- represents a distinct user goal
- is used frequently enough to justify persistent access
- contains more than a single command
- cannot be expressed more clearly as a contextual panel or dialog

Do not create primary destinations for:

- logs
- traces
- runtime internals
- evidence receipts
- implementation modules
- one-button utilities
- transient status

## Recommended hierarchy

```text
Application
├─ Primary destinations
│  ├─ Goal A
│  ├─ Goal B
│  └─ Goal C
├─ Contextual tools
├─ Supporting panel
└─ Global settings
```

## Destination budget

Treat primary navigation as limited space.

Default target:

- 3–5 primary destinations for focused tools
- 5–7 only for broad professional applications
- more than 7 requires evidence that the destinations are distinct and frequently used

The number is not an absolute law. It is a review trigger.

## Group by workflow

Related configuration and action must remain together.

Example:

```text
Browser connection
├─ provider
├─ endpoint
├─ model
├─ browser executable
├─ profile
├─ port
├─ test
├─ start/stop
└─ status
```

Splitting these across Browser, Runtime, Settings, Logs, and Activity forces users to reconstruct the workflow.

## Supporting information

Use a unified supporting region for information needed during work but not used to navigate the product.

Suitable sections:

```text
Problems
Output
Activity
Evidence
Diagnostics
```

The panel should be:

- collapsible
- resizable
- persistent across related tasks
- hidden when empty if that improves focus
- able to surface errors automatically without stealing permanent navigation space

## Progressive disclosure levels

### Level 1 — essential

Visible by default:

- required inputs
- primary action
- current state
- important result

### Level 2 — common secondary

Available nearby:

- filters
- presets
- optional configuration
- recent history

### Level 3 — advanced

Placed in expandable sections or dedicated dialogs:

- raw payloads
- technical identifiers
- timeouts
- protocol details
- diagnostic traces

## Naming rules

Navigation labels should describe user concepts.

Prefer nouns for destinations:

```text
Files
Browser
Source Control
Workspace Tools
Settings
```

Prefer verbs for commands:

```text
Choose folder
Test connection
Start sync
Run audit
```

Avoid labels that describe implementation categories without user meaning:

```text
Runtime
Trace
Evidence
Modules
Services
```

unless the product’s users explicitly work with those concepts.

## Empty destinations are defects

A destination must not open to an unexplained blank region.

Every empty state states:

1. what this area is for
2. why it is empty
3. what action populates it
4. whether a prerequisite is missing

## Navigation validation

For every destination verify:

- there is a clear user goal
- its controls are functional
- its state survives switching when appropriate
- keyboard navigation works
- selected state is visible
- duplicate functionality is absent
- user can return to prior context without losing work
