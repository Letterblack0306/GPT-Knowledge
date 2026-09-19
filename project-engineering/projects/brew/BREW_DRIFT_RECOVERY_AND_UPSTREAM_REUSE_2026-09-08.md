# Brew Drift Recovery and Upstream Reuse Audit — 2026-09-08

## Purpose

This record is the current GPT-K projection of the Brew repository drift audit. It is a navigation and engineering reference, not runtime authority.

Authority order remains:

```text
current Brew runtime/source evidence
-> exact repository revision
-> Brew project checkpoints
-> GPT-K projection
-> upstream reference implementations
```

## Current repository refs observed during the audit

- Remote Brew default branch observed during research: `main` at `579e5ee3648a06533d6dc5b110ae64cb1aaf3490`
- Remote architectural branch observed during research: `agent/canonical-runtime-operation-authority-20260812` at `2071e47e2dbc27dbe6e4d5dc9f7efc7d987569eb`
- These are remote reference observations only. They do not establish the current local checkout revision, file set, installed runtime, or live behavior.

## Evidence-boundary correction

This report is **reference/report evidence, not current local-runtime proof**.

Revision-sensitive findings must be resolved against the exact workspace being changed. In particular:

- the remote architectural revision inspected during research contains fail-closed `subagent-engine.mjs` and `team-coordinator.mjs`;
- the current local checkout reported by the implementation agent still has those files missing and produces `ERR_MODULE_NOT_FOUND` through `dispatch-handlers.mjs`;
- therefore the remote finding does **not** invalidate the local failure. It proves only that repository revisions differ;
- local filesystem/import/runtime evidence remains authoritative for the local workspace until its exact HEAD and file set are independently reconciled with the remote revision.

Required classification:

```text
REMOTE_REFERENCE_STATE != LOCAL_WORKSPACE_STATE

remote branch evidence:
  useful for architecture/history/reference comparison

local exact revision + filesystem + runtime:
  authority for local mutation and acceptance
```

Do not patch the local workspace based on a remote file's existence until exact-revision reconciliation proves that the file should be present locally.

## Executive diagnosis

Brew does not primarily need another end-to-end agent framework. Its canonical architecture already converges toward one persistent reasoning agent, one canonical turn/runtime authority, governed tools, evidence, and channel adapters.

The continuing drift is concentrated in secondary/legacy surfaces that retained their own response, routing, provider, or lifecycle semantics after the canonical runtime evolved.

The dominant anti-pattern is:

```text
canonical runtime has the correct invariant
+
secondary adapter reimplements a weaker version
=
split authority and false-success drift
```

## Brew end-state goal

**Brew retains one primary user-facing reasoning authority and may delegate bounded work to subagents, specialist agents, teams, planners, supervisors, temporary workers, or distributed workers when delegation improves capability. Delegates may reason autonomously within assigned scope. The architecture defect to prevent is machine behavior that preempts the primary Brew reasoning path, hard-codes semantic intent/tool choice/completion, or creates competing policy, execution, evidence, persistence, or product-level completion authority. Roadmaps are candidate lists; current runtime behavior and evidence remain authoritative.**

## 2026-09-19 machine-behavior investigation update

A later evidence-driven investigation audited the machine-behavior concern against Brew revision `722fc2386589d115bccfadae687923961f4cca95`.

### Question

> Does active deterministic runtime code semantically intercept ordinary natural-language requests before the reasoning model sees the request and governed capabilities?

### Reported canonical trace at that revision

```text
HTTP / CLI / Telegram
  -> gateway / telegram entry
  -> brew/runner/brew-runner.mjs::runTurn
  -> brew/runtime/agents/agent-tool-loop.mjs::runAgentToolLoop
  -> provider/model reasoning with governed tool catalogue
  -> brew/capabilities/capability-registry.mjs
  -> governed tool execution
  -> receipt/evidence
  -> model continuation/final answer
```

The bounded falsifier used semantically equivalent wording (for example, `check git status` versus `show me the git state`) and looked for deterministic keyword-driven goal/tool/response selection before provider reasoning.

### Classification

`NO_ACTIVE_MACHINE_BEHAVIOR_DEFECT_FOUND_AT_722FC238__REVISION_BOUND`

The reported investigation found:
- no active pre-model semantic interception in the traced canonical path;
- suspect scenario/task/provider/next-action routing modules absent from the active tree or unreachable;
- remaining planner/tool-routing files reported as zero-importer orphans;
- explicit-prefix parsing in an orphaned tool-routing helper did not establish active runtime semantic routing.

This finding does **not** mean all files named planner/agent/team/supervisor/worker are defects. Machine behavior is the issue. Useful bounded delegation is allowed under the 2026-09-19 Brew architecture policy when parent-task scope, policy, side effects, receipts/evidence, persistence, and completion remain governed.

### Evidence boundary

This investigation was reported against Brew `722fc238`. Brew main later advanced to `15b02efa37ee14119f1b5d665381e47b8a85d1c6` with delegation/feature-preservation documentation updates. Therefore the machine-behavior result is strong revision-bound evidence, not automatic current-head installed/runtime proof.

PR #439 is reference context only: it remains an old, heavily diverged open PR and is not the current Brew source authority.

## 2026-09-13 governed-memory acceptance update

The governed-memory amendments were implemented in the existing Brew memory/runtime owners without introducing a second agent, semantic router, or parallel memory subsystem.

### Proven changes

- `brew/agent/memory/memory-record.mjs`
  - `project_fact`, `decision`, and `solution` now require explicit `projectId`.
  - unbound sessions exclude those project classes from active retrieval.
  - unauthorized `verified` records are downgraded to `inferred`.
  - verification-authority metadata is retained.
- `brew/agent/memory/memory-curation-store.mjs`
  - `verifyMemory()` requires validation evidence or explicit user confirmation.
  - `setMemoryState(..., 'verified')` requires the same authority.
  - verification provenance is retained.
- `brew/memory-plus/memory-plus-service.mjs`
  - contract coverage now binds project memory explicitly for reads and writes.
- `brew/runtime/chat/cross-session-search.mjs`
  - supports explicit workspace-root filtering and controlled multi-root retrieval.
  - returned conversations retain workspace provenance.
- `brew/runtime/agents/runner-foundation-integration.mjs`
  - passes active workspace and explicit workspace-root scopes into retrieval.
  - injects project provenance into model context.
  - marks prior conversation as same-workspace evidence.
  - allows explicit caller-provided cross-project comparison scopes without semantic routing.
- `brew/runner/brew-runner.mjs`
  - persists `workspaceRoot` in session/message metadata.
  - supplies project/workspace provenance to reasoning context.

### Governed-memory invariant now enforced

```text
explicit project/workspace binding
  -> trust-state eligibility
  -> expiry/supersession exclusion
  -> same-workspace retrieval by default
  -> ranking/search
  -> provenance-bearing model context
```

Memory remains context, never authority. It cannot grant project identity, workspace authority, provider access, tool availability, permissions, approval, or execution authority. Live runtime/project/capability authorities win over conflicting memory.

### Falsifiers reported passing

- unbound session excludes `project_fact`, `decision`, and `solution`;
- unauthorized verified project memory cannot remain verified;
- same-topic evidence from another workspace is excluded by default;
- workspace provenance is retained on surfaced evidence;
- existing Telegram natural-language requests still reach the canonical runner;
- empty provider responses still fail with `EMPTY_PROVIDER_RESPONSE`;
- no semantic scenario-router remains in the active source tree.

### Validation reported from the exact local implementation pass

```text
focused memory tests     18 passed / 0 failed
full npm test            433 passed / 0 failed / 0 cancelled
full-suite termination   clean (~33s)
check:blockers           PASS
runtime imports          PASS
agent-machine scan       PASS
```

This evidence is user-supplied local-runtime evidence. GPT-K records it as the current reported state; exact local revision/dirty-state/installed-runtime identity still governs any later mutation or release claim.

### Remaining evidence boundaries

- live Telegram acceptance was not rerun in the governed-memory implementation turn;
- installed-runtime acceptance remains unproven;
- CI/release acceptance remains unproven;
- provider-native continuation/crash-resume remains unproven;
- explicit natural-language cross-project comparison is implemented at the retrieval API boundary but not yet proven through live conversational acceptance;
- BirdEye/GPT-Knowledge transport was blocked by `Transport closed` / cache miss;
- Session/Turn/Item lifecycle work remains intentionally not started.

### Current next-gate rule

Do not select a roadmap feature by name. Complete remaining live acceptance first, then inspect the actual lifecycle/persistence owner gap before beginning Session/Turn/Item work.

## P0 active correctness / authority defects

The table below is historical audit context from 2026-09-08. Several items have since been remediated; the 2026-09-13 acceptance update above is newer evidence and overrides stale classifications here where they conflict.

| Responsibility | Brew path | Audit classification | Drift at audit time |
| --- | --- | --- | --- |
| Telegram natural-language handling | `brew/runtime/telegram/telegram-turn.mjs` | ACTIVE_SECOND_RESPONSE_AUTHORITY | Regex/keyword conversational replies bypassed the canonical reasoning turn for greetings, identity, tools, known facts, and workspace questions. |
| Telegram empty completion | `brew/runtime/telegram/telegram-turn.mjs` | ACTIVE_FALSE_SUCCESS_FALLBACK | Could render "The agent completed without a response." instead of preserving an empty-model invariant failure. |
| Provider tool-call no-tool branch | `brew/runtime/server/gateway-server.mjs` | ACTIVE_WEAK_RESPONSE_CONTRACT | Could return `ok:true` with empty `reply` when no tool call existed. |
| Legacy provider fabrication | `brew/start.js` | COMPATIBILITY_DEBT_FALSE_SUCCESS | Historically returned successful `[Brew processed]` output on inference failure; the canonical runner rejected that placeholder. |
| Main-agent direct response | `brew/runtime/main-agent/response-system.mjs` | DUPLICATE_SEMANTIC_SURFACE | Converted `MODEL_RESPONSE_REQUIRED` direct-response failure into successful empty chat at module level. Canonical HTTP aliases already bypassed this subsystem. |
| WhatsApp fallbacks | `brew/gateway/whatsapp/*` | TRANSPORT_ERROR_CONFLATION | Fixed "No response generated" strings blurred empty output, routing failure, and successful assistant output. |
| Generic response fallback | `brew/runtime/response/response-fallback.mjs` | INVALID_AGENT_PROVENANCE | Presented "No response generated" with `source:'agent'` instead of a runtime/provider failure class. |

## Legacy / stale surfaces

| Path | Classification | Required treatment |
| --- | --- | --- |
| `brew/behavior/response-decision-layer.mjs` | ORPHANED_HARDCODED_RESPONDER | Prove no supported consumer, then quarantine/remove. Do not reconnect. |
| `brew/runtime/chat/brew-chat-agent.mjs` | ORPHANED_KEYWORD_RESPONDER | Prove no supported consumer, then quarantine/remove. |
| `brew/runtime/agents/scenario-router.mjs` | REMOVED / no active semantic router in current reported local state | Do not recreate. |
| `brew/runtime/agents/dispatch-handlers.mjs` | LEGACY_DIRECT_HANDLER_SURFACE | Keep disabled/unreachable unless an explicit supported consumer is proven. |
| `subagent-engine.mjs` / `team-coordinator.mjs` | LEGACY / fail-closed-or-absent by revision | Do not restore these exact legacy implementations by name alone. Preserve or recover useful delegated-agent capability through current canonical Brew contracts when consumer/feature evidence supports it. |

## Recovered intended architecture

```text
UI / CLI / Telegram / WhatsApp / API
        |
        v
channel / transport adapter
        |
        v
canonical ingress
        |
        v
Session -> Turn -> ordered runtime items/events
        |
        v
provider/model reasoning
        |
        +--> assistant message
        |
        +--> governed tool request
                  |
                  v
          policy / approval / capability
                  |
                  v
             execution
                  |
                  v
           evidence/observation
                  |
                  +----> provider continuation
        |
        v
normalized final result
        |
        v
channel-specific renderer
```

Semantic reasoning, planning, natural-language interpretation, tool choice, and final conversational wording remain model-owned. Runtime owns identity, policy, execution authority, readiness, persistence, evidence, validation, recovery, and deterministic runtime commands.

## Upstream reference map — reuse before recreation

### Hermes Agent — channels, gateway continuity, narrow core

Repository: `NousResearch/hermes-agent`

Use for:
- one agent core across CLI/messaging/TUI/desktop;
- platform adapters as edge integrations;
- messaging gateway architecture;
- skills, memory, MCP/toolset registration patterns;
- interruption/stop/retry and persistent-agent ergonomics.

Do not copy:
- unbounded or competing multi-agent/subagent authority that takes over Brew's user-level goal or bypasses canonical policy, execution, evidence, persistence, or completion contracts.

Bounded delegated agents/teams are valid when they improve capability and remain correlated to the parent Brew task.

Primary adoption boundary:
```text
Telegram / WhatsApp adapter
-> normalized ingress
-> canonical Brew turn
-> normalized result
-> renderer
```

### Cline — provider/model turn semantics

Repository: `cline/cline`

Use for:
- provider response normalization;
- genuine empty-response retry/failure semantics;
- distinction between empty assistant output and tool-call-only turns;
- provider/model adapters and capability-aware model handling.

Relevant areas:
- SDK LLM provider middleware;
- agent runtime empty-response validation;
- model/provider configuration.

Brew should adapt the invariant, not fork Cline internals:

```text
assistant text empty AND no model tool activity
=> failure / retryable provider outcome
=> never ok:true assistant success

tool call present with empty text
=> valid tool turn
```

### OpenAI Codex — Session/Turn/Item and execution lifecycle

Repository: `openai/codex`

Use for:
- thread/session/turn/item identity;
- model messages separated from runtime/tool/approval events;
- typed execution lifecycle;
- approval and sandbox policy;
- interruption/cancellation;
- observable event protocol.

Adoption rule:
```text
agent_message != runtime_status != provider_error != tool_result != approval != turn_completed
```

### OpenHands — event-driven autonomous SWE runtime

Repository: `OpenHands/OpenHands`

Use for:
- persistent event history as lifecycle authority;
- typed actions and observations;
- workspace abstraction;
- explicit RUNNING / WAITING / FAILED / FINISHED states;
- context/skills separation;
- remote execution as transport, not semantic authority.

Do not recreate:
- another opaque planner/controller state machine alongside the canonical Brew turn.

### LobeHub — provider, model, MCP, knowledge and integration registries

Repository: `lobehub/lobehub`

Use for:
- provider metadata separate from provider runtime behavior;
- model registry and capability metadata;
- configured vs usable/readiness distinction;
- normalized provider errors;
- MCP/integration lifecycle;
- channel/provider independence.

### GPT-K catalogue role

Relevant GPT-K routing documents:
- `ai-agents/cli-agent-reference-study-map.md`
- `ai-agents/reference-derived-agent-architecture.md`
- `ai-agents/professional-agent-runtime-cli-and-provider-architecture.md`
- `ai-agents/agent-reasoning-transport-boundary.md`
- `ai-agents/studies/hermes-memory-skills-agent-loop.md`
- `ai-agents/studies/lobehub-provider-integration-architecture.md`
- `ai-agents/studies/openhands-autonomous-swe-runtime.md`
- `ai-agents/studies/codex-execution-validation.md`

GPT-K routes the question to a suitable upstream; the upstream repository must still be rechecked before copying implementation details.

## Planned/responsibility recovery matrix

| Responsibility | Brew current position | Upstream first reference | Recommendation |
| --- | --- | --- | --- |
| Canonical reasoning loop | Exists and should remain authority | OpenHands + Codex | PRESERVE_AND_CONVERGE |
| Provider/model adapters | Canonical response invariants proven in focused/current regression gates; live continuation/crash-resume still open | Cline + LobeHub | PRESERVE_AND_VALIDATE_LIVE |
| Empty response semantics | Proven across current regression gates | Cline | PRESERVE_INVARIANT |
| Session/Turn/Item | Not started; durable owner investigation remains the next lifecycle gate | Codex | TRACE_OWNER_BEFORE_IMPLEMENTING |
| Operation/tool-call identity | Existing operation correlation work | Codex/OpenHands | PRESERVE_AND_EXTEND only after owner proof |
| Tool registry/health | Existing capability surfaces | Hermes + LobeHub | PRESERVE; live health remains authoritative |
| Workspace/files | Existing governed tools | Codex/OpenHands | PRESERVE; provenance-bound workspace scope required |
| Terminal/background process | Existing/progressive | Codex/OpenHands/Hermes | ADAPT_EXISTING_LIFECYCLE_PATTERNS only if a proven gap remains |
| Git tooling | Existing/planned capability surface | Codex/Aider | ADAPT; do not invent generic wrappers where current owner suffices |
| Browser/computer use | Existing Browser work and deferred acceptance | OpenHands/Hermes + dedicated browser references | PRESERVE boundary, validate runtime lifecycle |
| MCP/plugins/integrations | Deferred/partial | Hermes + LobeHub | DEFER until current acceptance/lifecycle gates close |
| Skills | Existing/planned | Hermes + Codex skills | ADAPT_PROGRESSIVE_DISCLOSURE only when needed |
| Persistent/project memory | Governed project/workspace isolation and verification authority now reported proven | Hermes | PRESERVE_GOVERNED_MEMORY; prove live cross-project conversation behavior |
| Context/compaction | Planned | Hermes/OpenHands | DEFER until owner gap is proven |
| Checkpoints/resume/recovery | Planned and partially implemented | Codex/OpenHands/Hermes | ADAPT_EVENT_AND_IDENTITY_MODEL after lifecycle owner proof |
| Approvals/sandbox/security | Existing governed intent | Codex/OpenHands | PRESERVE_TYPED_POLICY_BOUNDARY |
| Validation/evidence/completion | Strong Letterblack-specific authority | Codex/OpenHands + LBE evidence study | PRESERVE_EVIDENCE_AUTHORITY |
| Steering/cancel/interrupt | Planned | Hermes/Codex | DEFER until lifecycle owner proof |
| Messaging adapters | Semantic bypass remediation reported proven; live Telegram tool/duplicate-response acceptance remains open | Hermes | VALIDATE_LIVE_TRANSPORT_ONLY_BEHAVIOR |
| Scheduled jobs/automation | Existing scheduler infrastructure but not the current architectural gate | Hermes | DO_NOT_EXPAND |
| Delegated agents/subagents/teams | Legacy implementations are revision-dependent; bounded delegation is architecture-valid | Existing Brew supervision/contracts + relevant upstream worker patterns | PRESERVE_WORKING_CAPABILITY; ADAPT/GOVERN; remove only proven obsolete/conflicting implementations |
| Observability/events | Existing trajectory/event work | Codex/OpenHands | TRACE current owner before extension |
| Startup/readiness | Isolated-state startup and blocker/runtime-import gates reported green | LobeHub/provider health + existing Brew readiness | PRESERVE_ONE_STARTUP_AUTHORITY |

## Prioritized implementation sequence

### P0 — correctness and authority

Current reported state: the original response-contract remediation steps are proven or quarantined, and governed-memory project/workspace isolation is now also proven by focused and full-suite regression evidence.

Remaining P0 acceptance is live rather than architectural:

1. rerun Telegram ordinary-language acceptance against the current build;
2. prove exactly-one visible completion per Telegram input;
3. prove real tool receipt -> provider continuation -> grounded Telegram result;
4. prove explicit cross-project comparison keeps both provenance labels and never aliases one project as another;
5. preserve the governed-memory exclusions and verification-authority falsifiers.

### P1 — architectural convergence

Do not begin by creating Session/Turn/Item structures from the roadmap. First trace the active lifecycle/persistence writers and determine which current component owns session/conversation durability.

Only after owner proof:

1. establish one durable Session/Turn/Item owner if the current runtime lacks one;
2. reconcile operation/tool-call identity with that owner;
3. normalize runtime event vocabulary where an actual gap is proven;
4. prove provider-native continuation, cancellation, restart, resume, and exactly-once execution.

### P2 — recovered planned capability work

After P0/P1:
- MCP/plugin lifecycle;
- deeper browser/desktop capabilities;
- project knowledge lifecycle expansion;
- skill/context expansion;
- Git/workspace typed capabilities;
- installed-runtime acceptance and CI/release proof.

Roadmap order is not implementation authority. Live owner evidence decides the next bounded slice.

## Do not recreate

Do not create new Brew-specific implementations for these concerns before exhausting the existing canonical owner and upstream adaptation path:

- channel-specific natural-language agents;
- provider-specific conversational routers;
- custom empty-response conventions;
- a second Session/Turn/Item system;
- another planner/controller outside the canonical turn;
- another tool registry if the canonical capability registry can be extended;
- another memory store/retrieval authority when the governed memory owners can be hardened;
- another messaging gateway core;
- a new skills format when AgentSkills/Codex/Hermes-compatible progressive disclosure is sufficient;
- a new generic provider abstraction where Cline/LobeHub patterns can be adapted;
- unbounded or competing multi-agent/subagent/team orchestration that bypasses Brew's parent-task correlation, policy, execution, evidence, persistence, or product-level completion contracts;
- status prose that substitutes for typed runtime state;
- completion based on loop termination or successful HTTP status alone.

## Cross-surface invariants to encode as regression tests

```text
Rule A
No channel adapter synthesizes ordinary assistant conversation.

Rule B
No model/provider result reports success when:
  assistant text is empty
  AND there is no model tool activity.

Rule C
Runtime/provider/tool/approval failures are never persisted as model-authored assistant messages.

Rule D
All supported conversational routes converge on the canonical turn runtime.

Rule E
Only one subsystem owns durable Session/Turn/Item identity.

Rule F
Legacy reasoning/dispatch surfaces are either proven reachable, explicitly fail closed, or removed.

Rule G
New capabilities extend the existing canonical runtime; they do not create a second reasoning authority.

Rule H
Project/workspace memory is explicitly scoped before ranking; unbound sessions cannot retrieve project_fact/decision/solution records.

Rule I
Only explicit user confirmation or runtime validation evidence may establish verified memory authority.

Rule J
Cross-project retrieval requires explicit widening and retains visible provenance; foreign-project evidence never becomes active-project self-context.
```

## Immediate active gate

**BREW_LIVE_ACCEPTANCE_BEFORE_LIFECYCLE**

Question:

> Does the current one-agent runtime preserve governed project context, truthful tool continuation, and exactly-once conversational behavior through the live user-facing surfaces before any Session/Turn/Item implementation begins?

Required evidence before closing the gate:

- Telegram ordinary language invokes the canonical turn exactly once;
- explicit Telegram runtime commands remain deterministic;
- real tool requests produce a real execution/denial receipt before Brew narrates the outcome;
- provider continuation consumes the matching observation and produces the final answer;
- no duplicate Telegram completion is emitted for one update;
- Brew self-analysis does not substitute same-topic Handsoff/other-project evidence for Brew evidence;
- explicit cross-project comparison can widen retrieval while retaining provenance;
- governed-memory trust/project exclusions remain green;
- full regression and blocker gates remain green at the exact tested revision.

## Current classification

`ONE_AGENT_DIRECTION_VALID__RESPONSE_CONTRACT_REMEDIATED__GOVERNED_MEMORY_PROVEN__LIVE_TELEGRAM_AND_CONTINUATION_ACCEPTANCE_OPEN__SESSION_TURN_ITEM_DEFERRED__RELEASE_UNPROVEN`
