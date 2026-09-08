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

## P0 active correctness / authority defects

| Responsibility | Brew path | Current classification | Drift |
| --- | --- | --- | --- |
| Telegram natural-language handling | `brew/runtime/telegram/telegram-turn.mjs` | ACTIVE_SECOND_RESPONSE_AUTHORITY | Regex/keyword conversational replies bypass the canonical reasoning turn for greetings, identity, tools, known facts, and workspace questions. |
| Telegram empty completion | `brew/runtime/telegram/telegram-turn.mjs` | ACTIVE_FALSE_SUCCESS_FALLBACK | Can render "The agent completed without a response." instead of preserving an empty-model invariant failure. |
| Provider tool-call no-tool branch | `brew/runtime/server/gateway-server.mjs` | ACTIVE_WEAK_RESPONSE_CONTRACT | Can return `ok:true` with empty `reply` when no tool call exists. |
| Legacy provider fabrication | `brew/start.js` | COMPATIBILITY_DEBT_FALSE_SUCCESS | Historically returns successful `[Brew processed]` output on inference failure; the canonical runner explicitly rejects that placeholder. |
| Main-agent direct response | `brew/runtime/main-agent/response-system.mjs` | DUPLICATE_SEMANTIC_SURFACE | Converts `MODEL_RESPONSE_REQUIRED` direct-response failure into successful empty chat at module level. Canonical HTTP aliases already bypass this subsystem. |
| WhatsApp fallbacks | `brew/gateway/whatsapp/*` | TRANSPORT_ERROR_CONFLATION | Fixed "No response generated" strings blur empty output, routing failure, and successful assistant output. |
| Generic response fallback | `brew/runtime/response/response-fallback.mjs` | INVALID_AGENT_PROVENANCE | Presents "No response generated" with `source:'agent'` instead of a runtime/provider failure class. |

## Legacy / stale surfaces

| Path | Classification | Required treatment |
| --- | --- | --- |
| `brew/behavior/response-decision-layer.mjs` | ORPHANED_HARDCODED_RESPONDER | Prove no supported consumer, then quarantine/remove. Do not reconnect. |
| `brew/runtime/chat/brew-chat-agent.mjs` | ORPHANED_KEYWORD_RESPONDER | Prove no supported consumer, then quarantine/remove. |
| `brew/runtime/agents/scenario-router.mjs` | DORMANT_DETERMINISTIC_SEMANTIC_ROUTER | Keep out of canonical reasoning path unless a bounded runtime-command use is explicitly proven. |
| `brew/runtime/agents/dispatch-handlers.mjs` | LEGACY_DIRECT_HANDLER_SURFACE | At the current architectural branch its subagent/team dependencies exist as fail-closed compatibility modules. Do not rebuild multi-agent authority. |
| `subagent-engine.mjs` / `team-coordinator.mjs` | LEGACY_FAIL_CLOSED | Preserve fail-closed behavior until callers are removed; do not revive. |

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
- multi-agent/subagent authority that conflicts with Brew's single reasoning-agent decision.

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
| Provider/model adapters | Multiple paths; canonical path strongest | Cline + LobeHub | ADAPT_AND_CENTRALIZE |
| Empty response semantics | Correct in canonical runner, weaker downstream | Cline | REUSE_INVARIANT |
| Session/Turn/Item | Partially reconciled; durable ownership still gate work | Codex | ADAPT_PROTOCOL_PATTERN |
| Operation/tool-call identity | Existing operation correlation work | Codex/OpenHands | PRESERVE_AND_EXTEND |
| Tool registry/health | Existing capability surfaces, more reconciliation needed | Hermes + LobeHub | ADAPT_REGISTRY_PATTERN |
| Workspace/files | Existing governed tools | Codex/OpenHands | PRESERVE; add typed capability contracts only where missing |
| Terminal/background process | Planned/progressive | Codex/OpenHands/Hermes | ADAPT_EXISTING_LIFECYCLE_PATTERNS |
| Git tooling | Planned capability surface | Codex/Aider | ADAPT; do not invent generic shell wrappers for common Git truth |
| Browser/computer use | Existing Browser work and deferred acceptance | OpenHands/Hermes + dedicated browser references | PRESERVE boundary, adapt runtime lifecycle |
| MCP/plugins/integrations | Deferred/partial | Hermes + LobeHub | ADAPT_REGISTRY_AND_HEALTH; keep optional |
| Skills | Existing/planned | Hermes + Codex skills | ADAPT_PROGRESSIVE_DISCLOSURE |
| Persistent/project memory | Existing but authority boundaries need discipline | Hermes | ADAPT_LAYERING; memory is not evidence |
| Context/compaction | Planned | Hermes/OpenHands | ADAPT |
| Checkpoints/resume/recovery | Planned and partially implemented | Codex/OpenHands/Hermes | ADAPT_EVENT_AND_IDENTITY_MODEL |
| Approvals/sandbox/security | Existing governed intent | Codex/OpenHands | ADAPT_TYPED_POLICY_BOUNDARY |
| Validation/evidence/completion | Strong Letterblack-specific authority | Codex/OpenHands + LBE evidence study | PRESERVE_LBE_STYLE_AUTHORITY |
| Steering/cancel/interrupt | Planned | Hermes/Codex | ADAPT |
| Messaging adapters | Telegram active drift; WhatsApp fallback drift | Hermes | CONVERGE_TO_TRANSPORT_ONLY |
| Scheduled jobs/automation | Deferred | Hermes | ADAPT_LATER, not core gate |
| Multi-agent/subagent/team | Intentionally disabled | none needed | DO_NOT_RECREATE |
| Observability/events | Existing trajectory/event work | Codex/OpenHands | ADAPT_NORMALIZED_EVENTS |
| Startup/readiness | Active reconciliation | LobeHub/provider health + existing Brew readiness | PRESERVE_ONE_STARTUP_AUTHORITY |

## Prioritized implementation sequence

### P0 — correctness and authority

1. Unify the successful model-turn invariant across all active adapters.
2. Remove Telegram semantic natural-language bypass while preserving explicit runtime commands.
3. Remove Telegram empty-success wording.
4. Make `/api/provider/tool-call` reject empty/no-tool completion.
5. Make any surviving `brew/start.js` provider failure truthful; do not emit `[Brew processed]`.
6. Prove whether duplicate main-agent/legacy response modules have supported consumers; quarantine rather than polishing dead architecture.
7. Ensure WhatsApp/generic fallbacks remain runtime/transport failures and are never persisted as model-authored assistant reasoning.

### P1 — architectural convergence

1. One canonical response/result contract.
2. One durable Session/Turn/Item owner.
3. One operation/tool-call identity model.
4. One capability/tool registry with availability/health.
5. One normalized runtime event vocabulary.
6. Provider-native tool continuation with live evidence.
7. Cancellation, restart, resume and exactly-once acceptance.

### P2 — recovered planned capability work

After P0/P1:
- MCP/plugin lifecycle;
- scheduler/automation;
- deeper browser/desktop capabilities;
- project knowledge lifecycle;
- skill/context expansion;
- Git/workspace typed capabilities;
- installed-runtime acceptance and CI/release proof.

## Do not recreate

Do not create new Brew-specific implementations for these concerns before exhausting the existing canonical owner and upstream adaptation path:

- channel-specific natural-language agents;
- provider-specific conversational routers;
- custom empty-response conventions;
- a second Session/Turn/Item system;
- another planner/controller outside the canonical turn;
- another tool registry if the canonical capability registry can be extended;
- another messaging gateway core;
- a new skills format when AgentSkills/Codex/Hermes-compatible progressive disclosure is sufficient;
- a new generic provider abstraction where Cline/LobeHub patterns can be adapted;
- revived multi-agent/subagent/team orchestration without a newly proven requirement;
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
```

## Immediate active gate

**BREW_DRIFT_RECOVERY_AND_REFERENCE_REUSE**

Question:

> Which currently reachable Brew surfaces still own semantic decisions or weaker success/failure contracts outside the canonical turn, and what is the smallest owner correction that converges each onto the canonical runtime using proven upstream patterns?

Required evidence before closing the gate:
- exact active route/import reachability;
- focused falsifier for each corrected owner;
- no successful empty assistant response without tool activity;
- Telegram ordinary language invokes canonical turn exactly once;
- explicit Telegram runtime commands remain deterministic;
- no `[Brew processed]` externally reachable success;
- no runtime/provider fallback persisted as agent-authored reasoning;
- current-head regression and live acceptance evidence.

## Current classification

`CANONICAL_RUNTIME_DIRECTION_VALID__SECONDARY_AUTHORITY_DRIFT_ACTIVE__REFERENCE_REUSE_REQUIRED__RELEASE_UNPROVEN`
