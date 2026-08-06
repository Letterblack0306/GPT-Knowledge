---
title: Component and State Contracts
category: UI
sub_category: Components
confidence: high
verified: true
last_reviewed: 2026-08-07
applicable_to:
  - desktop
  - web
  - mobile
  - agent interfaces
---

# Component and State Contracts

A component is not complete when it renders. It is complete when its purpose, behavior, states, accessibility, data contract, and failure handling are defined and verified.

## Component contract

Every interactive component should document:

```text
Purpose
User goal
Inputs
Outputs
Primary action
Secondary actions
Data source
Loading behavior
Validation
Success result
Failure result
Disabled conditions
Keyboard behavior
Accessibility semantics
Telemetry or evidence
Test coverage
```

## Button contract

Every button must answer:

- What exactly happens when pressed?
- Which backend or local handler receives the action?
- Is the action immediate, asynchronous, destructive, or reversible?
- What changes while it runs?
- How is success shown?
- How is failure shown?
- Can the action be cancelled?

Buttons without proven handlers are defects.

## Action hierarchy

### Primary

The main action required to advance the current task.

Use one visually dominant primary action per task region.

### Secondary

Useful alternatives that do not represent the main path.

### Destructive

Actions that delete, overwrite, reset, disconnect, or otherwise create meaningful loss.

Destructive styling must indicate consequence, not merely importance.

### Overflow

Low-frequency actions may be placed in a menu. Do not hide frequent or critical actions in overflow.

## Input contract

Inputs must define:

- label
- required/optional status
- expected format
- initial value
- validation timing
- validation message
- correction path
- persistence behavior

Placeholder text is not a label.

## Picker rule

Use native pickers for file and folder selection where available.

A path field may remain visible for transparency or advanced entry, but should not be the only selection method in user-facing desktop workflows.

Display:

- selected path
- validation state
- accessibility name
- permission or reachability error

## Status contract

A status indicator must state both condition and subject.

Prefer:

```text
Browser: Connected
Sync: Watching
Audit: 12 findings
Provider: Unreachable
```

Avoid unexplained indicators such as a checkmark, colored dot, or generic “Ready”.

Color may reinforce status but must not be the only signal.

## Empty-state contract

Every empty state includes:

1. a concise title
2. the reason the area is empty
3. the action that changes the state
4. prerequisite information when applicable

Example:

```text
No workspace selected
Choose a workspace to browse files and run project tools.
[Choose workspace]
```

## Loading-state contract

Loading states must distinguish:

- initial loading
- background refresh
- long-running operation
- indeterminate waiting
- known progress

Do not replace usable content with a full blank spinner during background refresh.

## Error-state contract

Errors must include:

- what failed
- why, when known
- what remains safe or unchanged
- what the user can do next
- technical details through expandable disclosure when useful

Do not force users to read logs to understand a common error.

## Long-running operation contract

Display:

```text
Operation name
Current state
Current item or phase
Elapsed time when useful
Progress when measurable
Stop/cancel action when supported
Final summary
```

## Table and findings contract

Tables used for files, audits, logs, or records should define:

- column purpose
- sorting
- filtering
- selection
- empty state
- loading state
- row action behavior
- keyboard navigation
- responsive degradation

Technical results should expose file, line, severity, reason, and next action when available.

## Tree-view contract

Trees require:

- expand/collapse state
- selected item
- keyboard navigation
- loading children state
- empty folder state
- inaccessible item state
- refresh behavior
- persisted expansion when appropriate

## Dynamic announcements

Meaningful asynchronous changes should be exposed to assistive technology without moving focus unexpectedly.

Examples:

- validation failure
- connection completed
- audit finished
- sync stopped
- operation failed

## State matrix template

| State | Visible content | Available actions | Accessibility behavior |
|---|---|---|---|
| Initial | Required setup | Configure | Focus starts at first required control |
| Ready | Valid configuration | Start | Primary action enabled |
| Running | Current progress | Stop | State change announced |
| Success | Result summary | View details / Run again | Completion announced |
| Partial | Completed and failed counts | Review failures | Warning semantics |
| Failed | Cause and recovery | Retry / Reconfigure | Error announced |
| Disabled | Reason unavailable | Resolve prerequisite | Disabled reason accessible |

## Proof requirements

A component is considered wired only when evidence shows:

```text
Rendered control
→ event binding
→ validated input
→ backend or local action
→ state update
→ user-visible result
→ failure path
```
