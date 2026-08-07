# GPT-Knowledge

A versioned, reusable engineering knowledge base for research-backed design, development, debugging, validation, agent architecture, browser automation, local-model integration, and creative technology workflows.

## Load order

Always begin with [`000_START_HERE.md`](000_START_HERE.md), then use [`INDEX.md`](INDEX.md) to load only the smallest relevant knowledge set.

Do not preload every domain. Knowledge guides decisions; it does not replace live workspace or runtime inspection.

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

## Canonical motion-design entry point

Use [`motion-design/house-style.md`](motion-design/house-style.md) as the default starting point for motion-design and video-composition work when a project-specific `design.md` is not available. Project-specific brand direction takes precedence; house style fills gaps and routes to palettes, composition patterns, visual styles, data treatment, typography, motion, captions, and transitions.

## Agent and browser knowledge entry points

Use these as the current canonical starting points for agent/runtime and browser-tooling design:

- [`ai-agents/reference-derived-agent-architecture.md`](ai-agents/reference-derived-agent-architecture.md) — control planes, sessions, tools, skills, memory, projects, delegation, deployment backends, observability, and bounded recovery.
- [`browser-agents/browser-access-tooling-and-evidence.md`](browser-agents/browser-access-tooling-and-evidence.md) — browser transports, target identity, inspect/action/capture tools, DOM annotation, host-browser trust bridges, screenshots, evidence, lifecycle, permissions, and validation.

These documents are reference-derived from `openai/codex`, `openclaw/openclaw`, `agent0ai/agent-zero`, and `NousResearch/hermes-agent`. They extract reusable principles rather than treating any one repository as the required architecture.

## Local-model knowledge entry point

Use [`local-models/lm-studio-runtime-and-agent-integration.md`](local-models/lm-studio-runtime-and-agent-integration.md) for LM Studio server configuration, authentication, model discovery and lifecycle, JIT loading, TTL and Auto-Evict, stateful chats, tool calling, structured output, MCP controls, multi-machine proxy routing, performance tuning, and provider health evidence.

## Initial knowledge domains

- `ui/` — universal UI and UX principles, layout, components, states, workflows, accessibility, and audit methods.
- `ui-engineering/` — validated runtime UI integration and shell behavior.
- `engineering/` — debugging, testing, validation, runtime, Git, and fast-fail practices.
- `ai-agents/` — agent architecture, planning, memory, tools, skills, permissions, delegation, deployment, and evidence-first execution.
- `browser-agents/` — browser access models, CDP and connector patterns, target management, browser tools, security, screenshots, and verification.
- `local-models/` — local-provider runtimes, model lifecycle, inference configuration, health checks, tool calling, structured output, and multi-machine routing.
- `creative/` — motion graphics, VFX, generative image/video, After Effects, Blender, and related workflows.
- `motion-design/` — canonical creative direction, palettes, composition patterns, motion systems, captions, and visual styles.
- `references/` — source-specific notes from established design systems and technical platforms.
- `templates/` — reusable decision, component, audit, research, and review templates.
- `lessons/` — validated patterns, mistakes, discoveries, and corrections promoted from real projects.

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
