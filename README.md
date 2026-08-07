# GPT-Knowledge

A versioned, reusable engineering knowledge base for research-backed design, development, debugging, validation, agent architecture, browser automation, local-model integration, Letterblack product design, and creative technology workflows.

## Load order

Always begin with [`000_START_HERE.md`](000_START_HERE.md), then use [`knowledge-index.json`](knowledge-index.json) for deterministic routing or [`INDEX.md`](INDEX.md) as its human-readable companion.

Do not preload every domain. Knowledge guides decisions; it does not replace live workspace or runtime inspection.

## Purpose

This repository stores reusable knowledge rather than project-specific implementation details.

```text
Research
→ extract universal principles
→ document evidence and applicability
→ apply to a project
→ validate in runtime
→ promote reusable lessons back here
```

## Letterblack branding entry point

Use [`letterblack-branding/industrial-dark-ui-system.md`](letterblack-branding/industrial-dark-ui-system.md) as the canonical Letterblack product UI/branding guide. It defines the Industrial Dark palette, typography, density, cockpit layout, state semantics, interaction behavior, component language, icon rules, and evidence-aware UI principles.

Use [`letterblack-branding/ui-screen-system.md`](letterblack-branding/ui-screen-system.md) when screen families or the operational component vocabulary are needed. Use [`letterblack-branding/adobe-ai-generations-ui-reference.md`](letterblack-branding/adobe-ai-generations-ui-reference.md) only when inspecting reusable UI/token/icon patterns from `Adobe_AI_Generations-04`; that repository is a reference implementation, not canonical brand truth.

## Agent architecture entry point

Use [`ai-agents/cli-agent-reference-study-map.md`](ai-agents/cli-agent-reference-study-map.md) as the current agent-architecture router. It assigns each reference project to the subsystem where it is most useful:

- **Aider** → repository cognition, repo maps, selective context, Git-aware editing.
- **Codex** → execution, sandboxing, approvals, execution/validation evidence.
- **Hermes** → persistent agent behavior, memory, skills, toolsets, checkpoints, delegation.
- **LobeHub** → providers, models, configuration, custom endpoints, knowledge, MCP/integration registries.
- **OpenHands** → autonomous software-engineering runtime, typed events, workspace abstraction, remote execution.

Load only the matching deep study from `ai-agents/studies/` rather than all five by default. Use [`ai-agents/reference-derived-agent-architecture.md`](ai-agents/reference-derived-agent-architecture.md) when broader cross-project control-plane, identity, observability, deployment, or capability-registry patterns are needed.

## Browser knowledge entry point

Use [`browser-agents/browser-access-tooling-and-evidence.md`](browser-agents/browser-access-tooling-and-evidence.md) for browser transports, target identity, inspect/action/capture tools, DOM annotation, host-browser trust bridges, screenshots, evidence, lifecycle, permissions, and validation.

## Local-model knowledge entry point

Use [`local-models/lm-studio-runtime-and-agent-integration.md`](local-models/lm-studio-runtime-and-agent-integration.md) for LM Studio server configuration, authentication, model discovery and lifecycle, stateful chats, tool calling, structured output, MCP controls, multi-machine proxy routing, performance tuning, and provider health evidence.

When designing provider/model registries or custom endpoint abstractions, additionally load [`ai-agents/studies/lobehub-provider-integration-architecture.md`](ai-agents/studies/lobehub-provider-integration-architecture.md).

## Motion-design entry point

Use [`motion-design/house-style.md`](motion-design/house-style.md) as the default starting point for motion-design and video-composition work when project-specific direction is not available. Project-specific brand direction takes precedence.

## Current knowledge domains

- `letterblack-branding/` — canonical Industrial Dark Letterblack UI branding, operational screen system, UI/icon reference catalogue.
- `ai-agents/` — agent control planes, coding-agent reference studies, repository cognition, execution, memory/skills, provider architecture, autonomous SWE runtimes, permissions, delegation, and evidence-first completion.
- `browser-agents/` — browser access models, CDP and connector patterns, target management, browser tools, security, screenshots, and verification.
- `local-models/` — local-provider runtimes, model lifecycle, inference configuration, health checks, tool calling, structured output, and multi-machine routing.
- `ui-engineering/` — validated runtime UI integration and shell behavior.
- `motion-design/` — canonical creative direction, palettes, composition patterns, motion systems, captions, and visual styles.

Additional reusable domains may be added when they have a canonical entry point and deterministic router metadata.

## Knowledge quality rules

Every durable knowledge entry should identify, where applicable:

- source;
- confidence;
- verification status or review date;
- applicability;
- limitations;
- related evidence.

Claims must remain bounded to what has actually been researched or proven. Upstream reference projects evolve, so source-specific details must be revalidated before being treated as current implementation truth.
