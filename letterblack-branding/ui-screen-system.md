# Letterblack UI Screen System

## Source

This document preserves the supplied LetterBlack UI screen family and machine-readable component model as a design-system reference. The visual rules are defined by `industrial-dark-ui-system.md`.

## Screen family

### Main Workspace / AI Operating Dashboard

- top bar: brand, active project, mode, health, notifications, settings;
- left sidebar: project switcher, explorer, recent sessions, saved views;
- center: chat/editor, execution cards, live output, diff/browser/code preview;
- right sidebar: main agent, subagents, current task, tool routing, memory, health;
- bottom dock: terminal, logs, event stream, errors, validation results.

Primary purpose: daily chat + execution + control in one cockpit.

### Project Dashboard

Contains project overview, goal/phase, last successful run, blockers, memory summary, adapter status, recent jobs, risks/governance, health, execution status, constraints, fix patterns, approvals.

### Chat + Agent Console

Conversation history, active thread, agent tree, messages, code, file-write events, attachments, and agent states including thinking, executing, blocked, and completed.

### Execution Timeline / Job Monitor

Job identity/state, step timeline, inspector, related files, tool output, retry/cancel/rerun, parallel branches, child jobs, and audit-safe result payloads.

### Debug Lab

Environment/connector list, browser/runtime preview, inspector, logs/console/assertions, screenshot capture, DOM/UI verification, network/console errors, and step-linked evidence.

### Memory Panel

Stable memory, working memory, learned patterns, pinned notes, context-injection preview, search, source and confidence visibility.

### Tools / Connectors

Local/browser/file/API tools, model providers, plugins; each tool exposes name, type, enabled state, health, permission scope, last used, and failures.

### API / Model Routing Settings

Cloud/local providers, routing strategy, fallback order, credential status, project restrictions, and task/model assignments.

### Audit Ledger

Filterable events for intent, plan, execution, tools, results, memory writes, policy blocks and human override.

### Workspace Settings

Theme, density, layout, font size, keybindings, project mode, notification behavior.

## Machine-oriented UI model

```json
{
  "system": {
    "name": "LetterBlack UI System",
    "version": "1.0.0",
    "theme": "industrial-dark",
    "modes": ["chat", "coding", "debug", "project"]
  },
  "tokens": {
    "colors": {
      "bg": "#0b0b0c",
      "panel": "#141416",
      "panelAlt": "#1c1c1f",
      "border": "#2a2a2d",
      "text": "#e1e1e6",
      "muted": "#8e8e93",
      "accent": "#ff3b3b",
      "success": "#4ade80",
      "warn": "#ffb347",
      "error": "#ff3b3b"
    },
    "sizes": {
      "topbar": 40,
      "statusbar": 22,
      "tab": 28,
      "radius": 6,
      "gap": 8,
      "leftSidebar": 240,
      "rightSidebar": 340,
      "bottomDock": 240
    }
  },
  "stateTruth": {
    "uiMustReflectRealState": true,
    "uiMustNotInventExecutionState": true,
    "uiMustExposeErrors": true,
    "uiMustSupportProjectScoping": true,
    "uiMustSupportAgentVisibility": true
  }
}
```

## Component vocabulary

```text
brand.header
project.switcher
file.explorer
chat.thread
chat.messageList
chat.input
execution.panel
agent.sidebar
agent.tree
terminal.panel
statusbar
project.overview
project.healthCard
execution.summary
memory.snapshot
risk.panel
recent.jobs
job.header
timeline.steps
step.inspector
tool.output
job.controls
environment.list
browser.preview
dom.inspector
console.logs
assertion.results
memory.stable
memory.working
memory.patterns
memory.search
memory.contextInjection
tool.cards
connector.cards
tool.toggle
permission.scope
health.indicator
provider.list
localModel.list
routing.rules
fallback.order
api.maskedKey
task.modelAssignment
audit.table
audit.filters
audit.detail
event.trace
theme.selector
density.selector
font.controls
keybindings
notification.settings
```

## Build priority

```text
Phase 1
  Main Workspace
  Chat Console
  Execution Monitor

Phase 2
  Project Dashboard
  Tools & Connectors
  API & Model Settings

Phase 3
  Debug Lab
  Memory Panel
  Audit Ledger
  Workspace Settings
```

This screen model is platform-independent. It can inform Figma, web, native desktop, extension, or embedded tooling implementations without prescribing a specific runtime technology.
