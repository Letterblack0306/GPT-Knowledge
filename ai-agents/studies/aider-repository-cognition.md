# Aider Study — Repository Cognition and Git-Aware Editing

## Knowledge metadata

- Source project: `Aider-AI/aider`
- Primary sources: official Aider documentation (`repomap`, `git`, `edit-formats`, `chat-modes`, command reference)
- Last reviewed: 2026-08-07
- Confidence: high for documented behavior
- Applies to: coding agents, repository discovery, context selection, structured edits, Git safety

## Core pattern

Aider is a strong reference for repository awareness without placing the entire codebase into model context. Its repository map provides a concise structural representation containing files, important definitions, classes, methods, functions, signatures, and selected critical lines.

```text
Git repository
  -> enumerate relevant files
  -> parse symbols and definitions
  -> construct dependency/reference graph
  -> rank task-relevant structure
  -> fit selected structure to context budget
  -> model identifies files requiring deeper inspection
  -> load/edit only necessary files
```

Repository-wide awareness and file-level context are different layers. A coding agent should distinguish known files, mapped files, fully inspected files, editable files, changed files, and validated files.

## Context selection

For large repositories Aider ranks portions of the map using relationships between source files and fits the selected information to a token budget. This avoids two failure modes: inspecting only an obvious target and missing parallel implementations, or dumping the whole repository into context and reducing model focus.

Reusable model:

```text
structural repo map
  + task-relevant full source
  + on-demand expansion
```

## Edit contracts

Aider supports several model-facing edit formats, including full-file and diff/search-replace forms. The reusable principle is deterministic mutation:

```text
reasoning result
  -> edit representation
  -> parser/validator
  -> workspace mutation
  -> diff
  -> validation/error feedback
```

Edit representation should be a model/provider capability rather than a universal assumption.

## Architect/editor separation

Architect mode separates solution reasoning from mechanical editing. This demonstrates that decision quality and edit-format reliability are distinct responsibilities even when one model eventually performs both.

## Git lifecycle

Aider integrates Git into editing: it preserves pre-existing dirty changes, records agent edits, exposes diffs, and supports undo. Reusable rules are:

1. Capture pre-edit Git state.
2. Separate pre-existing user changes from agent-authored changes.
3. Never overwrite uncommitted work merely because a file is in scope.
4. Associate mutations with a visible diff.
5. Preserve rollback capability.
6. Do not treat a commit as proof that behavior works.

## Adopt

- structural repository map separate from full source context;
- relevance-ranked context selection;
- explicit context budget;
- on-demand source expansion;
- deterministic edit application;
- model-specific editing strategy;
- visible diff and rollback;
- protection of pre-existing work.

## Do not copy blindly

- fixed token budgets;
- one-repository-only assumptions;
- automatic committing as a universal policy;
- a specific ranking algorithm without measuring it against target repositories.

## Design takeaway

A coding agent should maintain a refreshable structural model of the repository, use that model to select evidence, and promote files from mapped -> inspected -> editable only as the task requires.

## Sources

- https://aider.chat/docs/repomap.html
- https://aider.chat/docs/git.html
- https://aider.chat/docs/more/edit-formats.html
- https://aider.chat/docs/usage/modes.html
- https://aider.chat/docs/usage/commands.html
