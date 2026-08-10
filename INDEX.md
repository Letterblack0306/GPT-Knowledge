# Knowledge Router

`knowledge-index.json` is the canonical machine-readable routing manifest. This file is the human-readable companion.

Use the smallest relevant knowledge set. Do not preload every domain.

## Project or feature work — FIRST REFERENCE

For any project or feature implementation, extension, replacement, integration, migration, planning, or learning task, load first:

- `project-engineering/project-feature-implementation-plan.md`

This is the cross-domain pre-route. It requires the agent to learn the active project/feature from the live repository and runtime before fixing an implementation boundary, then define observable requirements, acceptance criteria, ownership, dependencies, implementation order, validation, and recovery where needed.

Use it before agent, browser, UI, provider, branding, motion, or other domain-specific implementation knowledge.

```text
Project / feature request
  -> project-feature-implementation-plan.md
  -> establish project + revision + runtime identity
  -> learn current feature owner / flow / state / evidence
  -> define requirement + acceptance contract
  -> map impact and dependencies
  -> load only relevant domain knowledge
  -> implement smallest architecture-consistent change
  -> validate at the evidence level required by the claim
  -> preserve only durable learned project facts
```

The implementation plan does not override live project truth. If its predicted owner, file, dependency, or sequence is disproven by inspection, update the plan and follow the evidence.

### LBE Persistent Agent project status

For questions specifically about the current LBE Guard Inspector / reasoning-layer workspace, its implementation progress, canonical local workspace, merged milestones, or next roadmap boundary, additionally load:

- `project-engineering/projects/lbe-persistent-agent-wall-status.md`

This is a dated project-status record, not runtime truth. Revalidate the live repository branch, `HEAD`, working tree, source, and tests before making or judging changes.

## Browser or CDP work

Load:

- `browser-agents/browser-access-tooling-and-evidence.md`
- `ui-engineering/runtime-accessibility-and-shell-integration.md` when UI/runtime wiring is involved
- `local-models/lm-studio-runtime-and-agent-integration.md` only when the provider is LM Studio

When this is project or feature implementation work, use the project/feature first-reference route above before loading these documents.

Skip motion-design and branding domains unless the task explicitly involves them.

## Agent architecture, debugging, tooling, or execution

Load one canonical guide first after the project/feature pre-route when applicable:

- `ai-agents/unified-agent-engineering-methods.md`

This guide consolidates repository cognition, debugging, execution, approvals, validation, memory, skills, provider/tool integration, autonomous runtime behavior, recovery, and completion methods.

**Do not select a method by upstream repository name.** Classify the actual failure or requirement, choose the appropriate method from the unified guide, then inspect source-specific research only when concrete implementation detail is needed.

Source-specific notes under `ai-agents/studies/` and `ai-agents/cli-agent-reference-study-map.md` are research provenance, not primary operating routes.

### Letterblack governance/debugging route

Load `ai-agents/letterblack-governance-debugging-references.md` only when the proven failure involves execution authority, policy boundaries, workspace guards, current-HEAD proof, blocked actions, completion claims, or governance behavior.

That reference routes selectively to:

- **LBE Core** — https://github.com/Letterblack0306/LetterBlack-LBE-Core — execution-boundary/controller/adapter/host authority and governed proof.
- **LB Guards & Rules** — https://github.com/Letterblack0306/LB_Guards_Rules — workspace trust, guard contracts, policy profiles, and proof bound to the active Git `HEAD`.

Do not preload either repository for ordinary debugging. First classify the failure and inspect the live project/runtime; consult the relevant governance repository only when that boundary is actually implicated.

### Examples

```text
Wrong file / duplicate implementation
  -> project/feature plan first when part of implementation work
  -> unified guide
  -> repository cognition + active-owner tracing

Unknown bug cause
  -> unified guide
  -> evidence capture + hypothesis-driven diagnosis

Tests pass but feature fails
  -> project/feature plan first when changing the feature
  -> unified guide
  -> active-path tracing + runtime/user-visible validation

Repeated or unsafe execution
  -> unified guide
  -> operation identity + authority + retry/idempotency analysis
  -> Letterblack governance reference only if LBE/guards own the boundary

Provider/tool appears configured but does not work
  -> unified guide
  -> capability/health/permission validation

Guard blocks commit/push/DONE or proof looks stale
  -> unified guide
  -> Letterblack governance debugging reference
  -> LB Guards & Rules current guard/profile/proof path

Agent action is allowed/denied/incomplete unexpectedly
  -> unified guide
  -> Letterblack governance debugging reference
  -> LBE Core current controller/adapter/host path

Agent reports done too early
  -> unified guide
  -> completion predicate + evidence ladder
```

Only after choosing the method should a source implementation be consulted, for example Aider for repo-map implementation ideas, Claude Code for interactive investigation patterns, Codex for execution/approval patterns, Hermes for persistence/skills, LobeHub for provider/knowledge registries, or OpenHands for event-driven autonomous runtime patterns.

## LM Studio or local-provider work

Load:

- `local-models/lm-studio-runtime-and-agent-integration.md`
- `ai-agents/unified-agent-engineering-methods.md` when provider health, capability routing, tool execution, recovery, or validation behavior is involved

Use the project/feature first-reference route before these when implementing or learning a project feature.

## Telegram integration work

Load:

- `telegram/telegram-platform-integration.md`
- `ai-agents/unified-agent-engineering-methods.md` when Telegram capability health, execution, recovery, permissions, or validation behavior is involved

Start by distinguishing the required Telegram authority:

```text
bot-facing HTTP behavior
  -> Bot API

self-hosted bot endpoint / local-file and webhook capabilities
  -> local telegram-bot-api server

full Telegram client behavior / direct Telegram API
  -> MTProto + current TL schema
```

Do not treat the Bot API, local Bot API server, and MTProto as interchangeable surfaces. Revalidate the current Telegram API layer and upstream deployment limits before implementation because these are time-sensitive.

Use the project/feature first-reference route before this when implementing or learning a project feature.

## Letterblack product UI / branding

Start with the project/feature first-reference route when this is implementation or feature-learning work, then load:

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

Use the project/feature first-reference route before these when implementing or learning a project feature.

## Motion design

Load:

- `motion-design/house-style.md`
- only the linked palette, production, pattern, visual-style, or data-in-motion documents needed for the current deliverable

Project-specific `design.md` takes precedence over house style.

For implementation of motion tooling, automation, templates, extensions, or project features, use the project/feature first-reference route before motion-domain guidance.

## Selection rules

- Prefer `knowledge-index.json` for deterministic routing.
- For any project or feature implementation/planning/learning task, load `project-engineering/project-feature-implementation-plan.md` before domain-specific knowledge.
- For LBE Persistent Agent status/progress/workspace questions, load `project-engineering/projects/lbe-persistent-agent-wall-status.md` after the project/feature first reference, then verify the live repo before acting.
- Learn the active project/feature from live source/runtime evidence before fixing the plan boundary.
- Prefer one canonical entry document per active domain.
- For agent work, choose methods by failure class and evidence, not by source repository.
- For Telegram work, distinguish Bot API, local Bot API server, and MTProto/TL-schema requirements before choosing implementation authority.
- Load the Letterblack governance debugging reference only when authority, policy, guard, or proof boundaries are implicated.
- Source-specific studies are optional provenance and implementation references.
- Do not load the Adobe UI reference for every Letterblack UI task; use it only when source patterns or icons are relevant.
- Stop loading when enough knowledge exists to inspect and reason about the live project.
- When documents conflict with runtime evidence, runtime evidence wins.
- If routing is uncertain, inspect the project first instead of broad-loading knowledge.

## Typical routes

```text
New project feature
  -> project-engineering/project-feature-implementation-plan.md
  -> learn project/revision/runtime + nearest active architecture
  -> define observable acceptance criteria
  -> route to required domains only
  -> implement + validate real path

Existing feature learning
  -> project-engineering/project-feature-implementation-plan.md
  -> build feature learning record from live source/runtime
  -> identify authoritative owner, flow, state, tests, evidence, and parallel paths
  -> load domain knowledge only after the boundary is known

LBE Persistent Agent status / next step
  -> project-engineering/project-feature-implementation-plan.md
  -> project-engineering/projects/lbe-persistent-agent-wall-status.md
  -> verify current branch, HEAD, status, source, and tests
  -> continue only from the verified roadmap boundary

Repository bug / debugging
  -> project-feature plan first when the bug fix changes a project/feature
  -> ai-agents/unified-agent-engineering-methods.md
  -> classify failure
  -> choose diagnostic method
  -> inspect live repository/runtime
  -> governance reference only if authority/guards/proof are involved
  -> source-specific study only if implementation detail is needed

Agent architecture
  -> project-engineering/project-feature-implementation-plan.md when building/changing a project feature
  -> ai-agents/unified-agent-engineering-methods.md
  -> choose methods/contracts required by the actual system

Telegram integration
  -> project-engineering/project-feature-implementation-plan.md when changing a project feature
  -> telegram/telegram-platform-integration.md
  -> choose Bot API vs local Bot API server vs MTProto/TL schema from the actual requirement
  -> verify endpoint/session/schema-layer/runtime evidence

Letterblack UI design
  -> project-engineering/project-feature-implementation-plan.md when implementing a product feature
  -> letterblack-branding/industrial-dark-ui-system.md
  -> ui-screen-system.md only when screen/layout design is needed
  -> adobe-ai-generations-ui-reference.md only for existing UI/icon patterns

Browser UI audit
  -> project-feature plan first when the audit leads to project implementation
  -> browser-agents
  -> ui-engineering
  -> letterblack-branding only when the product is Letterblack-branded
  -> Letterblack governance reference only if a browser action is being blocked/governed or proof boundaries are involved

Motion graphics deliverable
  -> motion-design/house-style
  -> only the required optional motion document
```
