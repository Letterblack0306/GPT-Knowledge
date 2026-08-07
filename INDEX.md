# Knowledge Router

`knowledge-index.json` is the canonical machine-readable routing manifest. This file is the human-readable companion.

Use the smallest relevant knowledge set. Do not preload every domain.

## Browser or CDP work

Load:

- `browser-agents/browser-access-tooling-and-evidence.md`
- `ui-engineering/runtime-accessibility-and-shell-integration.md` when UI/runtime wiring is involved
- `local-models/lm-studio-runtime-and-agent-integration.md` only when the provider is LM Studio

Skip motion-design and branding domains unless the task explicitly involves them.

## Agent architecture or tooling

Start with:

- `ai-agents/cli-agent-reference-study-map.md`

Then load only the study matching the subsystem:

- repository cognition, repo maps, context selection, Git-aware editing -> `ai-agents/studies/aider-repository-cognition.md`
- command/file execution, sandbox, approvals, execution evidence -> `ai-agents/studies/codex-execution-validation.md`
- persistent memory, skills, toolsets, checkpoints, delegation -> `ai-agents/studies/hermes-memory-skills-agent-loop.md`
- providers, models, custom endpoints, knowledge, MCP/integration registries -> `ai-agents/studies/lobehub-provider-integration-architecture.md`
- autonomous SWE loop, typed events, workspaces, remote execution -> `ai-agents/studies/openhands-autonomous-swe-runtime.md`

Load `ai-agents/reference-derived-agent-architecture.md` only when broader cross-project control-plane, identity, capability-registry, observability, or deployment patterns are needed.

## LM Studio or local-provider work

Load:

- `local-models/lm-studio-runtime-and-agent-integration.md`
- `ai-agents/studies/lobehub-provider-integration-architecture.md` when provider/model registry, custom endpoint, model discovery, or normalized health architecture is in scope

## Letterblack product UI / branding

Start with:

- `letterblack-branding/industrial-dark-ui-system.md`

Then load only what the task needs:

- screen families, cockpit composition, component vocabulary -> `letterblack-branding/ui-screen-system.md`
- reusable CSS/token patterns or icon catalogue from Adobe AI Generations -> `letterblack-branding/adobe-ai-generations-ui-reference.md`
- runtime shell/accessibility integration -> `ui-engineering/runtime-accessibility-and-shell-integration.md`

The Letterblack branding guide is canonical. `Adobe_AI_Generations-04` is a reference implementation and asset source; it does not override the canonical guide.

## UI engineering

Load:

- `ui-engineering/runtime-accessibility-and-shell-integration.md`
- `letterblack-branding/industrial-dark-ui-system.md` only for Letterblack-branded products
- project-specific design guidance when present

## Motion design

Load:

- `motion-design/house-style.md`
- only the linked palette, production, pattern, visual-style, or data-in-motion documents needed for the current deliverable

Project-specific `design.md` takes precedence over house style.

## Selection rules

- Prefer `knowledge-index.json` for deterministic routing.
- Prefer one canonical entry document per active domain.
- Follow optional documents only when the current task needs their detail.
- Do not load all five agent studies merely because the task concerns an agent.
- Do not load the Adobe UI reference for every Letterblack UI task; use it only when source patterns or icons are relevant.
- Stop loading when enough knowledge exists to inspect and reason about the live project.
- When documents conflict with runtime evidence, runtime evidence wins.
- If routing is uncertain, inspect the project first instead of broad-loading knowledge.

## Typical routes

```text
Letterblack UI design
  -> letterblack-branding/industrial-dark-ui-system.md
  -> ui-screen-system.md only when screen/layout design is needed
  -> adobe-ai-generations-ui-reference.md only for existing UI/icon patterns

Repository-wide duplicate/parallel-structure bug
  -> ai-agents/cli-agent-reference-study-map.md
  -> ai-agents/studies/aider-repository-cognition.md

Execution/approval failure
  -> ai-agents/cli-agent-reference-study-map.md
  -> ai-agents/studies/codex-execution-validation.md

Persistent agent memory/skills design
  -> ai-agents/cli-agent-reference-study-map.md
  -> ai-agents/studies/hermes-memory-skills-agent-loop.md

Provider/model integration
  -> local-models when provider is LM Studio
  -> ai-agents/studies/lobehub-provider-integration-architecture.md

Autonomous software-engineering runtime
  -> ai-agents/cli-agent-reference-study-map.md
  -> ai-agents/studies/openhands-autonomous-swe-runtime.md

Browser UI audit
  -> browser-agents
  -> ui-engineering
  -> letterblack-branding only when the product is Letterblack-branded

Motion graphics deliverable
  -> motion-design/house-style
  -> only the required optional motion document
```
