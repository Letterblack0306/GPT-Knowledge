---
title: UI System Architecture
category: UI
sub_category: Architecture
confidence: high
verified: true
last_reviewed: 2026-08-07
applicable_to:
  - desktop
  - web
  - mobile
  - complex applications
---

# UI System Architecture

UI architecture connects design intent to maintainable implementation. It prevents duplicate controls, stale bindings, disconnected screens, inconsistent state, and layout drift.

## Core separation

A maintainable UI separates:

```text
Domain state
Application actions
View models
Components
Layout
Platform adapters
```

### Domain state

The source of truth for meaningful product state.

Examples:

- selected workspace
- browser connection
- sync operation
- audit result
- provider configuration

### Application actions

Operations users can request.

Examples:

- chooseWorkspace
- startBrowser
- stopBrowser
- startSync
- runAudit

### View models

Translate domain state into presentation-ready state.

A view model should answer:

- which controls are enabled
- which status text is shown
- which errors are visible
- which progress value is displayed

### Components

Render state and emit user intent. Components should not independently invent application rules.

### Layout

Defines placement, sizing, collapse, responsive adaptation, and persistence.

### Platform adapters

Wrap native capabilities such as:

- file/folder pickers
- process launching
- secure storage
- notifications
- window state

## Single source of truth

Do not represent the same state independently in multiple modules.

Bad:

```text
browserRunning in header
browserConnected in panel
browserStatus in footer
runtimeBrowserState in diagnostics
```

when these can disagree.

Prefer one canonical browser state with derived presentation.

## Action pipeline

Every interactive action should follow:

```text
User intent
→ input validation
→ application action
→ backend/platform operation
→ canonical state update
→ view-model update
→ rendered feedback
```

Errors travel through the same pipeline.

## Feature module boundary

A feature module may own:

- view template or component tree
- local presentation state
- event bindings
- view-model mapping
- feature-specific styles
- feature tests

It should not duplicate:

- global services
- provider stores
- workspace state
- browser lifecycle ownership
- shared status logic

## UI contract registry

For complex applications, maintain a registry describing each user-facing control:

```json
{
  "controlId": "startSync",
  "feature": "workspace-sync",
  "action": "startSync",
  "requiredState": ["destinationValid", "syncStopped"],
  "resultState": "syncRunning",
  "errorState": "syncFailed"
}
```

This enables automated checks for:

- duplicate IDs
- missing elements
- missing handlers
- unreachable actions
- actions without visible results
- disabled controls without reasons

## State machine for operations

Long-running features should use explicit state machines.

Example:

```text
UNCONFIGURED
→ READY
→ STARTING
→ RUNNING
→ STOPPING
→ STOPPED
→ FAILED
```

Do not infer operational state from button text or the presence of a process ID alone.

## Rendering rule

Render from current state rather than applying scattered DOM mutations.

Prefer:

```text
state changed
→ render affected view
```

over unrelated handlers directly editing many elements.

## Event ownership

Each event should have one authoritative owner.

Examples:

- browser lifecycle: BrowserService
- workspace selection: WorkspaceService
- sync lifecycle: WorkspaceSyncService
- audit lifecycle: AuditService

The UI subscribes to state or events; it does not create parallel lifecycle logic.

## Supporting telemetry

Logs, traces, activity, and evidence should share a structured event model.

```json
{
  "timestamp": "",
  "source": "",
  "level": "",
  "operationId": "",
  "message": "",
  "details": {}
}
```

Different views may filter the same event source rather than maintaining unrelated arrays.

## Layout architecture

Layout configuration should declare:

- region
- placement
- order
- visibility
- minimum size
- default size
- collapsibility
- persistence key

Validation must reject:

- duplicate IDs
- duplicate order where prohibited
- missing required regions
- unreachable visible modules
- overlapping placements

## Native adapter rule

UI code should request capabilities through a narrow adapter.

Example:

```text
ui.chooseDestination()
→ platform.pickFolder()
→ selected path
```

Do not expose raw IPC channel names throughout renderer code.

## Error architecture

Use typed errors or normalized failure results.

```json
{
  "code": "DESTINATION_NOT_WRITABLE",
  "message": "The selected destination cannot be written.",
  "details": {},
  "retryable": true
}
```

The UI maps technical failures to useful recovery guidance while retaining expandable details.

## Verification layers

### Static contract checks

- duplicate element IDs
- layout validity
- registered feature factories
- required scripts/styles
- syntax

### Component tests

- initial rendering
- state transitions
- validation
- keyboard operation
- failure presentation

### Integration tests

- event binding to real application action
- backend result updates canonical state
- stop/cancel works
- settings persist

### Runtime proof

- launch application
- complete the user workflow
- inspect visible state
- verify output and error recovery

A passing static audit does not prove a usable feature.

## Architecture review questions

1. What owns the canonical state?
2. What owns the lifecycle?
3. Can two views disagree?
4. Does every action produce visible feedback?
5. Are native capabilities abstracted?
6. Can disconnected controls be detected automatically?
7. Are supporting events unified?
8. Are operation states explicit?
9. Does the implementation match the user workflow?
10. Is runtime proof available?
