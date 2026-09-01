# GPT-Knowledge

A versioned, reusable engineering knowledge base for research-backed design, development, debugging, validation, agent architecture, browser automation, local-model integration, Letterblack product design, and creative technology workflows.

## Load order

Always begin with [`000_START_HERE.md`](000_START_HERE.md), then use [`knowledge-index.json`](knowledge-index.json) for deterministic routing or [`INDEX.md`](INDEX.md) as its human-readable companion.

Do not preload every domain. Knowledge guides decisions; it does not replace live workspace or runtime inspection.

## Letterblack MCP ecosystem entry point

Use [`project-engineering/letterblack-mcp-ecosystem-and-routing.md`](project-engineering/letterblack-mcp-ecosystem-and-routing.md) when a task needs to determine **which component should be used and which source owns the truth**.

Current validated client direction:

```text
Codex / Cline / OpenCode / Gemini / Antigravity / Claude
                            │
                            └──> BirdEye MCP
                                  ├── workspace query
                                  ├── memory query
                                  └── skills query

Skills
  -> canonical curated reasoning/workflow corpus
  -> skill-gallery-router may guide where to look
  -> actual curated retrieval uses BirdEye MCP skills(query/fetch/status)

GPT-Knowledge
  -> durable project/method/status/reference projection and routing

BirdEye MCP
  -> consolidated client-facing Letterblack MCP route
  -> current local evidence/index
  -> GPT-Knowledge route/read access
  -> Memory query/read access
  -> consolidated Skills retrieval
  -> workspace/revision identity
  -> governed local execution
  -> EYES/derived query health where active

Memory
  -> canonical historical conversations/messages/provenance
  -> accessed through BirdEye in the validated client topology

GitHub
  -> canonical remote repository/branch/commit/PR/check truth

Runtime / Browser / Provider
  -> live behavior proof
```

The validated MCP Local architecture reports **52 required PASS / 0 FAIL** and keeps BirdEye as the consolidated enabled Letterblack MCP route for the checked clients. Duplicate direct Memory routes, separate Skills routes, broad filesystem bypasses, and legacy competing MCP routes are absent or disabled.

BirdEye may expose a capability without becoming the canonical owner of the underlying source. Memory remains the historical owner, Skills remain the curated methodology/content owner, GPT-Knowledge remains the durable project/method projection owner, and GitHub remains remote repository truth.

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

For Letterblack debugging involving authority, guards, policy, proof, blocked actions, or completion boundaries, selectively load [`ai-agents/letterblack-governance-debugging-references.md`](ai-agents/letterblack-governance-debugging-references.md). It routes to [LBE Core](https://github.com/Letterblack0306/LetterBlack-LBE-Core) for governed execution boundaries and [LB Guards & Rules](https://github.com/Letterblack0306/LB_Guards_Rules) for workspace trust, guard contracts, and current-HEAD proof. It is optional and must not be preloaded for unrelated debugging.

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

- `ai-agents/` — unified agent engineering methods plus source-specific research provenance and selective Letterblack governance/debugging references.
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