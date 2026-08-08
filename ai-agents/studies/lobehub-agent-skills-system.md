# LobeHub Agent Skills System — Reusable Engineering Patterns

## Knowledge metadata

- Last reviewed: 2026-08-08
- Upstream: `lobehub/lobehub` canary branch, `.agents/skills/`
- Purpose: extract reusable engineering patterns from LobeHub's agent skill system without turning GPT-Knowledge into a mirror of LobeHub-specific implementation details
- Canonical status: source-specific study / implementation evidence only
- Primary canonical guide: `ai-agents/unified-agent-engineering-methods.md`
- Trust rule: validate current upstream files and the target repository before applying any concrete path, command, schema, or framework-specific detail

## Why this study exists

LobeHub's `.agents/skills/` tree contains many high-value engineering procedures, but most are tightly coupled to LobeHub's repository structure, packages, runtime, product surfaces, and release process. Copying every skill as an independent operating method would recreate the exact fragmentation GPT-Knowledge is designed to avoid.

The reusable value is the **pattern behind each skill**:

```text
specific upstream skill
  -> identify the engineering problem it solves
  -> separate general method from repository-specific mechanics
  -> integrate the general method into the existing problem-driven agent workflow
  -> keep upstream details only as provenance / implementation examples
```

Do not route an agent to a LobeHub skill merely because the task name sounds similar. Route by the proven problem class first.

---

# 1. Upstream skill inventory by engineering concern

The canary `.agents/skills/` tree reviewed on 2026-08-08 includes these skill families.

## Agent runtime, execution, and durable outputs

- `agent-runtime-hooks`
- `agent-signal`
- `agent-work`
- `agent-tracing`
- `heterogeneous-agent`
- `builtin-tool`
- `chat-sdk`
- `response-compliance`

Reusable themes:

- explicit runtime lifecycle hooks;
- typed signals/events instead of hidden side effects;
- durable registration of work products;
- operation/tool-call identity for idempotency;
- full execution snapshots for debugging;
- common contracts across heterogeneous agent backends;
- tool capability registries;
- output/response validation as a separate layer.

## Testing, audit, and review

- `agent-testing`
- `agent-testing-bot`
- `testing`
- `deep-review`
- `skills-audit`

Reusable themes:

- distinguish unit, integration, runtime, and user-visible proof;
- test the agent loop as behavior, not only helper functions;
- use independent verification for high-risk review findings;
- prune irrelevant review dimensions instead of running every check blindly;
- treat agent instructions and skills as executable behavior that can regress;
- audit skill freshness when code or architecture changes invalidate procedural knowledge.

## Debugging and diagnosis

- `debug-frontend-with-browser`
- `debug-package`
- `agent-tracing`

Reusable themes:

- reproduce first;
- observe the earliest incorrect state;
- inspect the active runtime path, not only source presence;
- use browser/runtime evidence for UI defects;
- use package boundary and dependency evidence for module defects;
- preserve step-level traces including messages, tools available, tool calls, results, context, cost, and completion reason.

## Project and delivery workflow

- `project-overview`
- `pr`
- `docs-changelog`
- `version-release`
- `linear`

Reusable themes:

- establish project/revision identity before work;
- keep issue/PR state synchronized with actual implementation state;
- separate code completion from release readiness;
- maintain changelog/provenance from validated changes;
- treat external workflow state as evidence, not as a substitute for repository/runtime proof.

## Architecture and data flow

- `data-fetching-architecture`
- `store-data-structures`
- `trpc-router`
- `spa-routes`
- `db-migrations`
- `drizzle`
- `upstash-workflow`

Reusable themes:

- define single ownership for each data path;
- use registries/adapters where capability families must stay synchronized;
- distinguish read compatibility from write-path evolution;
- migration safety requires locking/idempotency/reversibility analysis;
- route/config changes require compatibility checks across all consumers.

## UI and product design

- `design-prototype`
- `product-design`
- `ux`
- `ux-audit`
- `modal`
- `hotkey`
- `desktop`
- `react`
- `zustand`
- `i18n`

Reusable themes:

- treat interaction states as part of correctness;
- validate empty/loading/error/confirmation flows;
- audit keyboard and modal behavior as control-flow concerns;
- keep state ownership explicit;
- check desktop/web compatibility where the same feature spans shells;
- localization is a contract, not post-processing.

## Provider / configuration / metadata extension

- `add-provider-doc`
- `add-setting-env`
- `model-bank-metadata`

Reusable themes:

- adding a provider or setting is a multi-surface change;
- registry entry, configuration, documentation, validation, and UI exposure must stay aligned;
- configured does not imply reachable, authenticated, capable, or healthy.

## Repository-specific skills with narrower transfer value

- `cli`
- `typescript`

These can contain useful conventions, but their exact rules should not become universal GPT-Knowledge policy unless independently justified by the target repository.

---

# 2. Strong reusable pattern: durable Agent Work registry

LobeHub's `agent-work` skill demonstrates a useful architecture for tracking outputs created or modified by an agent.

The transferable pattern is:

```text
resource identity
  + operation/tool-call identity
  + version/provenance record
  + success gate
  + idempotent registration
  + retrievable evidence
```

## General contract

A durable work record should separate the stable resource from the events that changed it.

```text
Work
  resourceType
  resourceId
  scopeId
  currentVersionId

WorkVersion
  workId
  operationId
  toolCallId
  action
  sourceMessageId
  producer
  resultRef
  validationRefs
  usageSnapshot
  createdAt
```

## Why this matters

Without this separation, an agent can:

- create duplicate cards/records on retry;
- lose provenance across edits;
- claim work that came from a read-only tool call;
- confuse cumulative usage snapshots with per-action cost;
- fail to connect a final assistant message to the actual produced artifact.

## General rules

1. Pick a resource identity that every execution surface can produce.
2. Register only work-producing mutations, not every query/read.
3. Gate registration on proven execution success.
4. Make retries idempotent using operation/tool-call identity.
5. Store provenance independently from the resource itself.
6. Attach work to an explicit completion/assistant-message anchor.
7. Do not mark a registration lifecycle complete if any required sub-registration failed.
8. Treat CLI parsing or post-hoc scanners as recovery adapters, not as the primary authority when structured tool results exist.

This pattern is directly relevant to persistent agents, coding agents, artifact-producing systems, and systems that need evidence-safe completion claims.

---

# 3. Strong reusable pattern: execution snapshots and trace-first debugging

LobeHub's `agent-tracing` skill reinforces a critical debugging rule: debugging an agent without the exact step context is mostly speculation.

## Minimum useful execution snapshot

```text
traceId
operationId
workspaceId
revision
provider
model
startedAt
completedAt
completionReason
steps[]
```

Each step should capture enough evidence to answer:

```text
What did the agent know?
Which tools were available?
What did it call?
With which arguments?
What result returned?
What state changed?
Why did it continue or stop?
```

Recommended step fields:

```text
stepIndex
stepType
input/message context reference
processed LLM payload reference
system/context snapshot reference
tool manifests available
tool calls
tool results
runtime events
execution time
usage/cost
error
```

## Partial traces are first-class

Do not only write a trace after successful completion. Persist partial/in-progress evidence so crashes, deadlocks, interruptions, approval waits, and max-step failures remain diagnosable.

## Heavy context should not pollute runtime state

Large diagnostic payloads can be stored through a side-channel or trace store rather than being pushed through the primary state/event transport. Runtime state should remain operational; tracing can be richer and more expensive.

## Debugging order

```text
inspect trace overview
  -> identify failing / suspicious step
  -> inspect final model payload for that step
  -> compare available tools with actual calls
  -> inspect arguments + result
  -> compare state before/after
  -> locate earliest wrong state
  -> then inspect source owner
```

This extends the canonical GPT-Knowledge rule: **runtime evidence must decide where source inspection begins.**

---

# 4. Strong reusable pattern: multi-dimensional review with independent verification

LobeHub's `deep-review` skill provides a strong review architecture. The most reusable parts are not its exact dimension files; they are the control rules.

## Review modes should match risk

A normal change does not always need an expensive multi-agent review. Use a light review for ordinary diffs and a deep review when risk, breadth, or explicit request justifies it.

## Deep review control pattern

```text
scope diff exactly
  -> select applicable review dimensions
  -> run independent reviewers
  -> verify candidate findings independently
  -> classify confirmed / false-positive / needs-more-context
  -> globally deduplicate overlapping findings
  -> report severity + likelihood + release impact
```

## Why independent verification matters

A reviewer that sees only a diff can invent defects because required context is missing. A coding agent that reviews its own patch can self-approve its assumptions.

For high-risk review:

- writer and reviewer should be logically independent;
- candidate findings should be falsified against full context;
- use discrete verdicts rather than confidence-sounding percentages;
- distinguish newly introduced problems from pre-existing ones;
- calibrate style/design findings to the existing codebase, while keeping security rules strict.

## Useful generic dimensions

The exact list is project-dependent, but a mature review can consider:

- correctness/logic;
- architecture/reuse;
- security;
- performance;
- compatibility;
- release risk;
- UX;
- observability;
- workflow/CI state;
- test adequacy;
- agent-skill/instruction freshness.

Do not force irrelevant dimensions. Pruning is part of correctness because noise lowers review precision.

---

# 5. Strong reusable pattern: skill freshness is a software-maintenance problem

LobeHub treats changes to agent instructions and skills as executable behavior, not harmless documentation. GPT-Knowledge should do the same.

## Skill freshness trigger

Whenever a change modifies any of the following, check whether procedural knowledge is now stale:

```text
runtime lifecycle
tool registry or schema
provider/model integration
workspace layout
commands / CLI flags
approval behavior
validation commands
test structure
release workflow
UI execution surface
state or persistence model
```

## Skill audit questions

```text
Does the skill still point to the active owner?
Does it assume a command or path that no longer exists?
Does it omit a newly required validation step?
Does it prescribe a workflow that bypasses the current authority boundary?
Does it claim completion at a weaker evidence level than the runtime now requires?
Does another skill contradict it?
Is the skill too repository-specific to remain canonical?
```

## Rule

A skill change is not complete merely because the Markdown parses. It must be reviewed as behavioral configuration and checked against the live repository/runtime it governs.

---

# 6. Strong reusable pattern: heterogeneous agent backends need one normalized contract

LobeHub has explicit support for heterogeneous agents and multiple execution surfaces. The reusable principle is that backend diversity must not leak into system truth.

Normalize every agent backend into a common operation model:

```text
AgentBackendAdapter
  startOperation()
  provideContext()
  exposeCapabilities()
  streamEvents()
  requestApproval()
  executeTool()
  reportUsage()
  reportCompletion()
  recoverOperation()
```

The core runtime should consume normalized states such as:

```text
RECEIVED
DISCOVERING
DIAGNOSING
READY_TO_ACT
APPROVAL_REQUIRED
EXECUTING
OBSERVING
VALIDATING
COMPLETE
BLOCKED
RETRYABLE_FAILURE
```

Do not build separate truth semantics for local CLI agents, hosted agents, browser agents, or model-provider-specific agents.

Adapters may differ; completion, evidence, authority, and operation identity should not.

---

# 7. Strong reusable pattern: registries should fail closed when capability families drift

Several LobeHub skills rely on centralized registries and type-level alignment. The transferable method is useful anywhere provider/tool/work-type families evolve.

Prefer:

```text
DeclaredCapabilityIds
  <-> AdapterRegistry
  <-> ValidatorRegistry
  <-> UI/descriptor registry
  <-> health/capability discovery
```

The system should detect drift when a capability is declared but no adapter/handler/descriptor exists.

Useful enforcement mechanisms include:

- compile-time exhaustive maps;
- startup validation;
- schema validation;
- contract tests;
- capability-health checks;
- explicit compatibility gates for old clients.

This is stronger than relying on documentation to keep registries synchronized.

---

# 8. Strong reusable pattern: compatibility gates for evolving agent surfaces

LobeHub's work registry shows a broader compatibility principle: new runtime-visible types or payloads can break older clients even when the server is correct.

When evolving an agent/runtime contract, ask:

```text
Can an older client parse this type?
Can a non-gateway/legacy runtime handle it?
Can desktop/web/mobile shells render it?
Can old persisted data be read by new code?
Can new persisted data be read by released code?
```

Use opt-in/read-path compatibility gates when necessary rather than silently exposing unknown payload shapes to released consumers.

This is especially important for:

- new work/artifact types;
- new tool result shapes;
- new completion reasons;
- new message metadata;
- new persisted state fields;
- new provider/model capability descriptors.

---

# 9. Strong reusable pattern: browser/UI debugging must prove the user-visible path

The `debug-frontend-with-browser`, `ux`, and `ux-audit` skill families reinforce the existing GPT-Knowledge validation ladder.

For user-facing behavior:

```text
source exists
  != component renders
  != interaction fires
  != backend request succeeds
  != state updates correctly
  != user-visible requirement is satisfied
```

A UI bug fix should normally verify:

- target page/screen actually uses the changed component/path;
- initial state;
- user action;
- network/tool/runtime consequence;
- resulting state;
- visible feedback;
- error/empty/loading variants when relevant.

Browser automation is an evidence instrument, not a replacement for understanding ownership.

---

# 10. Strong reusable pattern: release risk is separate from code correctness

A change can be logically correct and still be unsafe to release.

Release review should separately inspect:

- irreversible state or migrations;
- persisted payload shape drift;
- queues/cron/background work already in flight;
- config/environment dependencies;
- outbound side effects;
- shared package/API contracts;
- prompt/tool-description changes that alter agent behavior;
- high-frequency UI/runtime surfaces;
- CI and preview state;
- rollback/recovery feasibility.

Do not collapse release-readiness into unit-test success.

---

# 11. Integration with GPT-Knowledge canonical methods

The upstream skills extend the existing unified guide; they do not create a new routing branch.

Use this mapping:

| Proven problem | Canonical method | LobeHub-derived implementation evidence |
|---|---|---|
| Agent says done but output provenance is unclear | completion predicate + evidence ladder | durable Work registry + message anchor |
| Retries duplicate external changes | operation identity + idempotency | resource/version dedup model |
| Tool call behavior is unexplained | trace-first debugging | execution snapshots with available-tools vs actual-calls comparison |
| Agent crashes mid-run and evidence disappears | recovery/state tracing | partial snapshots before completion |
| Review findings contain hallucinated bugs | independent verification | reviewer -> verifier -> dedupe pipeline |
| Agent reviewed its own patch too generously | independent reviewer stance | anti-self-approval separation |
| Skill instructions drift from repository reality | knowledge freshness audit | treat skills as executable behavior |
| Multiple agent backends report different states | normalized runtime contract | heterogeneous adapter model |
| New capability added but one registry is missing | capability registry validation | exhaustive registry alignment |
| New server payload breaks old client | compatibility analysis | opt-in/read-path compatibility gate |
| UI test passes but user flow fails | user-visible validation | browser/UX evidence path |
| Correct patch is still risky to deploy | release-risk review | separate release dimension |

---

# 12. What should NOT be imported as universal policy

Do not copy these categories directly into canonical GPT-Knowledge unless the target repository independently requires them:

- exact LobeHub package paths;
- Bun-specific commands;
- LobeHub database table names;
- LobeHub-only CLI syntax;
- product-specific provider names;
- exact Electron compatibility assumptions;
- exact React/Zustand/tRPC/Drizzle conventions;
- internal issue identifiers or deployment layout;
- repository-specific naming standards.

They are examples, not universal architecture.

---

# 13. Recommended usage for Letterblack projects

For Brew, Access Browser Agent, LBE, BirdEye, or other Letterblack agent systems, use the patterns only after validating the target architecture.

Particularly relevant candidates are:

1. **Execution snapshot contract** for agent/tool/message/runtime debugging.
2. **Durable Work + WorkVersion model** for artifact/PR/file/task provenance.
3. **Independent deep-review verification** for high-risk autonomous changes.
4. **Skill freshness audit** whenever runtime/tool/provider behavior changes.
5. **Normalized heterogeneous backend adapter** for LM Studio/local/hosted/CLI agents.
6. **Capability registry drift checks** for providers, tools, adapters, and UI descriptors.
7. **Read compatibility gates** when persisted/runtime-visible schemas evolve.

Do not implement these because LobeHub has them. Implement them only where the target system has the corresponding proven problem.

---

# 14. Upstream source map

Primary upstream source:

- `https://github.com/lobehub/lobehub/tree/canary/.agents/skills`

High-value source skills reviewed directly for this study:

- `.agents/skills/agent-work/SKILL.md`
- `.agents/skills/agent-tracing/SKILL.md`
- `.agents/skills/deep-review/SKILL.md`

The remaining skill names were reviewed from the upstream skills inventory and classified by engineering concern. Exact implementation details should be opened and revalidated only when that specific problem is in scope.

## Final rule

**Import engineering principles, not repository-specific rituals.**

LobeHub's skills are strongest when treated as evidence for durable patterns: explicit lifecycle, traceability, idempotent work registration, independent verification, skill freshness, normalized backends, registry alignment, compatibility gates, and user-visible proof.
