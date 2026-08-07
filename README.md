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
→ consolidate overlapping methods
→ document evidence and applicability
→ apply to a project
→ validate in runtime
→ promote reusable lessons back here
```

## Agent engineering entry point

Use [`ai-agents/unified-agent-engineering-methods.md`](ai-agents/unified-agent-engineering-methods.md) as the **single canonical agent-engineering guide**.

It consolidates techniques learned from Aider, Claude Code, Codex, Hermes, LobeHub, OpenHands, and the existing cross-project studies into problem-driven methods for:

- repository cognition and structural discovery;
- hypothesis-driven debugging;
- controlled execution and approvals;
- runtime/user-visible validation;
- duplicate-authority and regression scanning;
- state, memory, skills, and checkpoints;
- providers, models, tools, MCP, and integrations;
- autonomous action/observation loops;
- recovery, retry, and completion evidence.

The canonical rule is **method first, source second**. Diagnose the actual failure or requirement, choose the appropriate method from the unified guide, then consult a source-specific study only when concrete implementation detail is useful.

Documents under `ai-agents/studies/`, `ai-agents/cli-agent-reference-study-map.md`, and `ai-agents/reference-derived-agent-architecture.md` remain research provenance and implementation references. They are not competing operating modes.

## Letterblack branding entry point

Use [`letterblack-branding/industrial-dark-ui-system.md`](letterblack-branding/industrial-dark-ui-system.md) as the canonical Letterblack product UI/branding guide. It defines the Industrial Dark palette, typography, density, cockpit layout, state semantics, interaction behavior, component language, icon rules, and evidence-aware UI principles.

Use [`letterblack-branding/ui-screen-system.md`](letterblack-branding/ui-screen-system.md) when screen families or the operational component vocabulary are needed. Use [`letterblack-branding/adobe-ai-generations-ui-reference.md`](letterblack-branding/adobe-ai-generations-ui-reference.md) only when inspecting reusable UI/token/icon patterns from `Adobe_AI_Generations-04`; that repository is a reference implementation, not canonical brand truth.

## Browser knowledge entry point

Use [`browser-agents/browser-access-tooling-and-evidence.md`](browser-agents/browser-access-tooling-and-evidence.md) for browser transports, target identity, inspect/action/capture tools, DOM annotation, host-browser trust bridges, screenshots, evidence, lifecycle, permissions, and validation.

## Local-model knowledge entry point

Use [`local-models/lm-studio-runtime-and-agent-integration.md`](local-models/lm-studio-runtime-and-agent-integration.md) for LM Studio server configuration, authentication, model discovery and lifecycle, stateful chats, tool calling, structured output, MCP controls, multi-machine proxy routing, performance tuning, and provider health evidence.

When agent-side provider routing, health, permissions, recovery, or validation is involved, pair it with the unified agent-engineering guide rather than loading a provider-project study directly.

## Motion-design entry point

Use [`motion-design/house-style.md`](motion-design/house-style.md) as the default starting point for motion-design and video-composition work when project-specific direction is not available. Project-specific brand direction takes precedence.

## Current knowledge domains

- `ai-agents/` — unified agent engineering methods plus source-specific research provenance.
- `letterblack-branding/` — canonical Industrial Dark Letterblack UI branding, operational screen system, UI/icon reference catalogue.
- `browser-agents/` — browser access models, CDP and connector patterns, target management, browser tools, security, screenshots, and verification.
- `local-models/` — local-provider runtimes, model lifecycle, inference configuration, health checks, tool calling, structured output, and multi-machine routing.
- `ui-engineering/` — validated runtime UI integration and shell behavior.
- `motion-design/` — canonical creative direction, palettes, composition patterns, motion systems, captions, and visual styles.

## Knowledge quality rules

Every durable knowledge entry should identify, where applicable:

- source;
- confidence;
- verification status or review date;
- applicability;
- limitations;
- related evidence.

Claims must remain bounded to what has actually been researched or proven. Upstream reference projects evolve, so source-specific details must be revalidated before being treated as current implementation truth.
