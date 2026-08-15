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

### LBE CLI / provider / mode / agent integration boundary

When work concerns the LBE CLI control plane, provider switching, coding versus audit behavior, pre-authorized edits/rules, external coding-agent integration, terminal relays, persistent sessions across agent/provider changes, request/result envelopes, or the role of a future TUI, additionally load:

- `ai-agents/lbe-cli-control-plane-provider-boundary.md`

This records the accepted separation: LBE remains the stable workspace/governance runtime; the LLM and external coding agent are replaceable participants; the CLI/API are governed entry surfaces; modes are runtime contracts rather than model personalities; terminal execution capability does not itself grant authority; persistent session/completion truth remains with LBE; and user-configured policy determines whether another confirmation is required. Live repository source and active LBE policy remain authoritative for implementation details.

## Agent / LLM reasoning boundary — ALWAYS REMEMBER

Whenever work mentions an **agent, LLM, local LLM, browser-side model, coding agent, relay, bridge, or agent-to-agent transport**, additionally load:

- `ai-agents/agent-reasoning-transport-boundary.md`

Default interpretation: the agent/LLM is a reasoning-capable participant. Do not model it as a mechanical state token that needs a relay/router to decide conversational meaning on its behalf.

The durable rule is:

> **Agents reason; bridges transport. Governance constrains authority, but must not become a second reasoning engine.**

Transport may enforce authentication, workspace isolation, target identity, cancellation, delivery ordering, capability/security boundaries, and technical deduplication. It should not infer whether repeated or reformatted user instructions are semantically new, historical, corrective, redundant, complete, or waiting when the receiving reasoning agent can decide that from preserved conversation and evidence.

Before adding another parser, task-state router, hash classifier, lifecycle label, approval state, or semantic state machine, first prove that the requirement is a hard integrity/security boundary rather than duplicated agent reasoning.

## Letterblack BirdEye local evidence / governed execution


When local workspace state, local-vs-remote drift, workspace/revision identity, indexed file inspection, or governed local execution matters, load:


- `project-engineering/letterblack-birdeye-local-evidence-and-governed-execution.md`


Use the authority split deliberately:


- GPT-Knowledge supplies reusable methods, routing, and durable guidance.
- GitHub supplies canonical remote repository, branch, commit, PR, check, and patch truth.
- BirdEye supplies local indexed evidence, workspace/revision identity, local status/diff evidence, and policy-governed argv execution.
- Runtime-specific tools remain required when the claim needs live behavior or user-visible proof.


BirdEye does not replace GitHub patch flow. A BirdEye policy denial proves only that the operation is not authorized through BirdEye's current boundary; it does not prove the operation is impossible.


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
- `ai-agents/agent-reasoning-transport-boundary.md` whenever an LLM/agent communicates through a relay, bridge, router, provider, browser, CLI, or another agent

This guide consolidates repository cognition, debugging, execution, approvals, validation, memory, skills, provider/tool integration, autonomous runtime behavior, recovery, and completion methods.

**Do not select a method by upstream repository name.** Classify the actual failure or requirement, choose the appropriate method from the unified guide, then inspect source-specific research only when concrete implementation detail is needed.

Source-specific notes under `ai-agents/studies/` and `ai-agents/cli-agent-reference-study-map.md` are research provenance, not primary operating routes.

### Letterblack governance/debugging route

Load `ai-agents/letterblack-governance-debugging-references.md` only when the proven failure involves execution authority, policy boundaries, workspace guards, current-HEAD proof, blocked actions, completion claims, or governance behavior.

That reference routes selectively to:

- **LBE Core** — https://github.com/Letterblack0306/LetterBlack-LBE-Core — execution-boundary/controller/adapter/host authority and governed proof.
- **LB Guards & Rules** — https://github.com/Letterblack0306/LB_Guards_Rules — workspace trust, guard contracts, policy profiles, and proof bound to the active Git `HEAD`.

Do not preload either repository for ordinary debugging. First classify the failure and inspect the live project/runtime; consult the relevant governance repository only when that boundary is actually implicated.


### Repeated audit-failure correction

For agent/runtime audits, “end-to-end” claims, runtime-log reviews, cleanup/reset work, destructive repository operations, force-push decisions, or any review where focused tests may be mistaken for live behavior, additionally load:

- `ai-agents/repeated-audit-failures-and-corrective-method.md`

This record exists because the same evidence failures recurred after the correct general method was already known. Apply it before conclusions or mutations. Its core requirements are:

- lock repository/workspace/revision/runtime identity;
- correlate one real user → active route → agent → tool → result → response path;
- label runtime-confirmed, static-confirmed, suspected, and disproved findings separately;
- do not patch inactive compatibility paths and call the user path fixed;
- do not treat Git tracking, user authorization, or successful focused tests as semantic authority;
- stop on failed dry runs, unresolved destructive targets, or stale force-with-lease state;
- preserve agent reasoning while keeping deterministic execution, security, workspace, validation, and evidence boundaries.

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

Agent/LLM relay or bridge over-classifies messages
  -> agent-reasoning-transport-boundary.md
  -> preserve conversation/session metadata
  -> remove duplicated semantic interpretation from transport
  -> keep hard security/integrity boundaries

LBE CLI/provider/mode architecture or external coding-agent integration
  -> project/feature plan first when implementing
  -> lbe-cli-control-plane-provider-boundary.md
  -> agent-reasoning-transport-boundary.md
  -> inspect current LBE runtime and Core interfaces

Agent reports done too early
  -> unified guide
  -> completion predicate + evidence ladder
```

Only after choosing the method should a source implementation be consulted, for example Aider for repo-map implementation ideas, Claude Code for interactive investigation patterns, Codex for execution/approval patterns, Hermes for persistence/skills, LobeHub for provider/knowledge registries, or OpenHands for event-driven autonomous runtime patterns.

## LM Studio or local-provider work

Load:

- `local-models/lm-studio-runtime-and-agent-integration.md`
- `ai-agents/unified-agent-engineering-methods.md` when provider health, capability routing, tool execution, recovery, or validation behavior is involved
- `ai-agents/agent-reasoning-transport-boundary.md` when the local LLM participates as an agent rather than a passive inference endpoint
- `ai-agents/lbe-cli-control-plane-provider-boundary.md` when the question is specifically how LBE should switch or host providers without changing workspace governance

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
- For LBE CLI/provider/mode/approval/external-agent-integration questions, load `ai-agents/lbe-cli-control-plane-provider-boundary.md` and verify the live LBE runtime/Core implementation before prescribing changes.
- Whenever an agent, LLM, local LLM, relay, bridge, or agent-to-agent transport is in scope, remember `ai-agents/agent-reasoning-transport-boundary.md`: agents reason; bridges transport; governance constrains authority without duplicating cognition.
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

LBE CLI / provider / coding-audit / external-agent boundary
  -> project-engineering/project-feature-implementation-plan.md when implementing
  -> ai-agents/lbe-cli-control-plane-provider-boundary.md
  -> ai-agents/agent-reasoning-transport-boundary.md
  -> verify current LBE Persistent Agent + LBE Core interfaces
  -> preserve stable workspace governance while provider and external agent remain replaceable reasoning participants

Agent / LLM bridge or relay design
  -> ai-agents/agent-reasoning-transport-boundary.md
  -> keep semantic reasoning with the agents
  -> keep transport integrity/security/governance hard boundaries outside the agents
  -> avoid duplicate state machines/classifiers unless a proven non-reasoning requirement needs them

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
  -> ai-agents/agent-reasoning-transport-boundary.md when messages cross relays/bridges/providers/agents
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
