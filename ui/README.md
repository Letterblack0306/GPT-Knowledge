# Universal UI Knowledge

This area stores design knowledge that applies across application types: desktop tools, web apps, dashboards, creative software, configuration utilities, browser agents, and IDE-like workbenches.

The structure is domain-first rather than product-first.

## Sections

- `principles/` — hierarchy, information architecture, cognitive load, consistency, progressive disclosure.
- `layout/` — navigation, sidebars, panels, toolbars, status bars, responsive and resizable layouts.
- `components/` — buttons, forms, tables, trees, tabs, dialogs, pickers, search, notifications, progress.
- `states/` — empty, loading, success, warning, error, offline, validation, blocked, partial.
- `workflows/` — settings, file management, configuration, search, authentication, audit, import/export.
- `accessibility/` — keyboard, focus, semantics, ARIA patterns, contrast, reduced motion.
- `checklists/` — implementation and audit checklists.

## Core rule

A UI is not complete because it renders. It is complete only when:

1. the user understands what the feature does;
2. every control is connected to a real operation;
3. loading, success, partial, blocked, and failure states are visible;
4. the layout remains usable under resize and realistic content;
5. accessibility and keyboard behavior are verified;
6. runtime evidence proves the workflow works.
