# GPT-Knowledge

A versioned, reusable engineering knowledge base for research-backed design, development, debugging, validation, agent architecture, browser automation, and creative technology workflows.

## Purpose

This repository stores reusable knowledge rather than project-specific implementation details.

The operating cycle is:

```text
Research
→ extract universal principles
→ document evidence and applicability
→ apply to a project
→ validate in runtime
→ promote reusable lessons back here
```

## Initial knowledge domains

- `ui/` — universal UI and UX principles, layout, components, states, workflows, accessibility, and audit methods.
- `agents/` — agent foundations, architecture, tools, context, memory, safety, evaluation, multi-agent systems, browser access, and operations.
- `engineering/` — debugging, testing, validation, runtime, Git, and fast-fail practices.
- `browser/` — CDP, browser agents, automation, and target management.
- `creative/` — motion graphics, VFX, generative image/video, After Effects, Blender, and related workflows.
- `collaboration/` — GitHub-backed remote/local collaboration, BirdEye evidence exchange, tool discovery, and bounded workspace diagnosis.
- `repositories/` — a sanitized registry of Letterblack repositories currently accessible through the linked GitHub connector.
- `references/` — source-specific notes from established design systems and technical platforms.
- `templates/` — reusable decision, component, audit, research, and review templates.
- `lessons/` — validated patterns, mistakes, discoveries, and corrections promoted from real projects.

## Collaboration model

Use the correct authority for each question:

```text
GitHub       → remote repository, branch, PR, diff, and CI evidence
BirdEye      → current indexed local workspace and local validation evidence
MCP          → controlled local tools and resources
GPT-Knowledge → reusable methods, architecture, and decision guidance
```

The GitHub-backed BirdEye request queue is documented in `collaboration/GITHUB_BACKED_LOCAL_WORKSPACE_BRIDGE.md`. Tool-selection guidance is documented in `collaboration/TOOL_DISCOVERY_AND_USE_REMINDER.md`.

## Repository registry boundary

The repository registry is an access snapshot, not authority to modify every listed project. Before using any repository, inspect its own README, instructions, active branch, issue scope, target files, and validation contracts. Private source content and secrets must never be copied into this knowledge repository.

## Knowledge quality rules

Every durable knowledge entry should identify:

- source
- confidence
- verification status
- last reviewed date
- applicability
- limitations
- related evidence

Claims must remain bounded to what has actually been researched or proven.
