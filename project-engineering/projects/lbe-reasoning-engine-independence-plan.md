# LBE Reasoning-Engine Independence Plan

## Status and authority

- Updated: 2026-09-20
- Project: `Letterblack0306/LBE_Presistent_Agent_wall`
- Current canonical repository head observed before this plan update: `57294568d62cfb8bb41a07359c6f1943e0832b9a`
- Current canonical machine gate observed at that head: `PASS / COMPLETED / CLOSED`, `implementation_allowed=false`
- Authority: this file is a GPT-Knowledge architecture/implementation plan. It does **not** change the LBE machine gate, authorize LBE source mutations, or replace current source/runtime truth.
- Historical Drive mirrors and chat exports are context only. Current LBE gate/status claims must be established from the canonical repository/workspace and `.lbe/governance/implementation-gates.json` first.

## Product decision

LBE is the persistent governed agent runtime and authority core.

Cline remains a supported reasoning-engine/provider-ecosystem integration, but it is **not a mandatory dependency or architectural owner**. LBE must be able to operate with Cline, with a native LBE reasoning loop, or with another compatible reasoning engine/provider adapter without changing LBE authority semantics.

The target rule is:

```text
LBE Core is required.
Reasoning engines are replaceable.
Model providers are separately replaceable.
No reasoning engine or provider owns LBE authority.
```

## Abstraction split

Do not collapse reasoning engines and model providers into one concept.

```text
LBE Core
  |
  +-- Reasoning Engine Registry
  |     +-- Cline adapter
  |     +-- Native LBE reasoning adapter
  |     +-- Future agent/runtime adapters
  |
  +-- Provider / Model Registry
        +-- OpenAI
        +-- Anthropic
        +-- Gemini / Google
        +-- OpenRouter
        +-- LM Studio / OpenAI-compatible
        +-- Ollama / local adapters
        +-- cloud/provider-specific adapters
        +-- future providers
```

Cline may itself expose many providers. That breadth is useful, but it must remain behind the reasoning/provider boundary rather than becoming the definition of LBE.

## Non-transferable LBE authority

Every reasoning engine and provider must consume the same LBE-owned authority boundary.

LBE remains the sole owner of:

- workspace/project identity;
- session, turn, task, operation and child-run identity;
- mode and policy truth;
- deterministic authorization;
- governed capability registration and availability;
- governed tool execution;
- idempotency / duplicate-execution prevention;
- ToolReceipt and evidence provenance;
- persistence, checkpoint, restart and recovery semantics;
- cancellation terminality;
- validation truth;
- completion truth;
- user-visible authoritative runtime projection.

A reasoning engine may reason, plan, select among exposed capabilities, propose tools, interpret results, continue from observations, and compose responses. It must not gain direct filesystem, process, Git, MCP, browser, persistence, receipt, validation or completion authority.

## Neutral reasoning-engine contract

Introduce or converge on one engine-neutral contract. Exact API names may follow current source owners, but the semantic surface should remain equivalent to:

```text
health()
capabilities()
start_turn(context)
continue_turn(observation_or_receipt)
cancel_turn()
```

Engine output is normalized into LBE-owned types such as:

```text
ReasoningResponse
ToolProposal
ContinuationRequest
ProviderEvent
FinalResponseProposal
ReasoningFailure
```

Provider- or engine-native events remain adapter metadata. Durable session/client contracts stay LBE-owned.

## Governed tool path

All engines must converge on the existing R6C/R6E boundary.

```text
reasoning engine
  -> ToolProposal
  -> LBE capability lookup
  -> R6C deterministic authorization
  -> R6E GovernedToolOrchestrator
  -> ToolReceipt + evidence
  -> normalized observation
  -> reasoning-engine continuation
```

Forbidden:

```text
engine -> native shell/editor/filesystem/MCP mutation -> LBE observes afterward
```

DENY or ESCALATE must execute zero governed mutations. ALLOW must execute through the registered LBE owner exactly once.

## Provider/model independence

Provider and model selection remain a separate axis from reasoning-engine selection.

Required state must distinguish at least:

```text
reasoning_engine_id
provider_id
provider_type
auth_mode
model_id
model_capabilities
availability / health
actual_engine_used
actual_provider_used
actual_model_used
```

No silent engine or provider substitution is allowed. If the selected engine/provider is unavailable, LBE reports that state unless an explicit configured fallback policy permits a transition. Any fallback must record the engine/provider/model actually used.

## Cline migration rule

This is an additive decoupling, not a Cline removal project.

Preserve working Cline capabilities, including mature provider/model access, continuation, tool-call grammar, streaming, cancellation, delegated-agent mechanics, and other proven features where they remain useful behind LBE contracts.

Do not remove a working feature merely because it originated in Cline. Re-home authority, not capability.

Target relationship:

```text
LBE Core
    required

Cline adapter
    optional supported engine

@cline/agents / @cline/llms
    dependency of the Cline integration boundary
    not a fundamental dependency of LBE Core
```

If Cline is absent or disabled, LBE Core must still be able to start, inspect its environment, manage authoritative state, expose configured non-Cline engines/providers, and fail truthfully where no reasoning engine is available.

## Feature-preservation rule

Existing teams/subagents/delegated-agent behavior is allowed when it remains subordinate to LBE authority.

The architecture may contain multiple reasoning workers or delegated agents. The invariant is not "one process" or "no subagents"; the invariant is:

```text
one LBE authority boundary
many replaceable reasoning/execution capabilities
no parallel authorization / execution / receipt / completion owner
```

## Planned implementation sequence

### P0 — Authority and provenance lock

- Resolve project truth from canonical Git/workspace and the machine gate, never from a gate-blind Drive mirror.
- Mark Drive/chat mirrors as historical/reference inputs for current-state evaluation.
- Identify current owners for provider registry, Cline worker, reasoning runtime, session state, R6C/R6E execution, receipts, recovery and completion.
- Do not reopen accepted R3-R7 behavior without a current falsifier.

### P1 — Engine/provider type separation

- Add or normalize explicit reasoning-engine identity separately from provider/model identity.
- Preserve current session/workspace/task identifiers.
- Keep current provider registry semantics intact while separating them from Cline-specific engine assumptions.

### P2 — Stable reasoning-engine adapter contract

- Define the minimum engine-neutral start/continue/cancel/health/capability contract.
- Normalize engine-native events into current LBE session/turn/item and receipt/evidence contracts.
- Route every tool proposal through existing LBE governed capability projection.

### P3 — Encapsulate Cline as an adapter

- Move Cline-specific lifecycle, package and provider mechanics behind the neutral engine boundary.
- Preserve current Cline behavior and delegated-agent capabilities.
- Prove no Cline native mutation path bypasses LBE.
- Keep Cline selectable and fully functional.

### P4 — Add one non-Cline reasoning path

Prefer reuse of an already implemented LBE/provider reasoning owner before creating a new framework.

The first non-Cline path must prove:

- provider/model discovery;
- one live reasoning turn;
- one governed tool proposal;
- R6C authorization;
- R6E exactly-once execution;
- ToolReceipt/evidence continuation;
- cancellation/error attribution;
- persistent session projection;
- deterministic completion.

### P5 — Dependency/package decoupling

- Make Cline runtime dependencies conditional on the Cline adapter rather than LBE Core identity.
- Preserve deterministic locked dependency installation for the Cline adapter when shipped.
- Prove the base LBE runtime no longer requires Cline packages to initialize.
- Do not regress the already-proven installed Cline path.

### P6 — Multi-engine acceptance

Prove at least:

```text
same LBE workspace/session authority
  -> Cline engine turn
  -> non-Cline engine turn
  -> identical R6C/R6E authority semantics
  -> engine-neutral receipts/evidence
  -> LBE-owned validation/completion
```

Engine switching inside one session is an explicit policy feature, not an implicit fallback. If supported, context transfer must be truthful and provider continuation IDs remain backend metadata only.

## Acceptance criteria

This plan is complete only when current runtime evidence proves all of the following:

1. LBE Core initializes without Cline being the required runtime identity.
2. Existing Cline integration still passes its claim-matched regression and installed-runtime proofs.
3. At least one non-Cline reasoning engine/provider path completes a real governed tool turn.
4. Both paths use the same canonical workspace/session/operation identity owners.
5. Both paths cross the same R6C authorization and R6E execution boundary.
6. DENY/ESCALATE execute zero mutations; ALLOW executes exactly once.
7. ToolReceipt/evidence schemas and completion validation are engine-neutral.
8. Provider/model changes do not change LBE authority state.
9. Selected-engine/provider failure is explicit; no silent substitution occurs.
10. Cline-specific packages are not required merely to initialize LBE Core.
11. Existing memory, recovery, child-agent, capability, approval, evidence and validation features are preserved unless a current falsifier proves a defect.
12. Installed/runtime/user-visible evidence—not documentation alone—closes acceptance.

## Explicit non-goals

- removing Cline because it is third-party;
- replacing Cline with one new mandatory cloud provider;
- rewriting proven R3-R7 authority owners;
- creating a second authorization, executor, receipt store, session store or completion engine;
- treating a provider/model adapter as an independent LBE runtime;
- silently falling back between engines/providers;
- removing working subagent/team/delegation capabilities merely to simplify the architecture.

## Current implementation authorization

At the time this plan was recorded, canonical LBE machine governance reported:

```text
status                 = PASS
active_slice           = COMPLETED
implementation_allowed = false
closure.status         = CLOSED
next_slice             = NONE
```

Therefore this GPT-K plan records the next architecture direction only.

Implementation must begin only after the canonical LBE repository opens a new explicit intent/gate that names the engine-independence slice and its affected owners.

## 2026-09-20 implementation progress

Canonical LBE source was rechecked before this update.

```text
LBE repository: Letterblack0306/LBE_Presistent_Agent_wall
active slice: REASONING_ENGINE_PROVIDER_BINDING_SEPARATION
gate: OPEN
implementation_allowed: true

implementation:
39dd7cf9a6194a4931d1c564f43af50d5d8d9f7f  runtime: separate reasoning engine and provider bindings
7685ecae0412a92f7b61f9b5b51011e3125a4f8d  tests: hard-block Cline import in absence proof
935b159ccf15a7f86fc72b2b19be20e6a7a3f892  runtime: fail closed on unproven provider capabilities
7c5bd4af3ca2962bd1cad0823207915cc7819a37  tests: require evidence for structured output capability
```

Implemented statically in the active slice:

- Cline is no longer imported by the provider composition root at module import time.
- Explicit `EngineProviderBinding` separates engine identity from provider identity.
- Native-LBE and Cline bindings can coexist for one provider.
- LM Studio has a native OpenAI-compatible default binding while the existing Cline binding remains available explicitly.
- Existing Cline-only routes remain intact for providers not yet proven on a native transport.
- No silent engine fallback is introduced.
- Provider capabilities are projected from `ProviderModelCapabilitySnapshot`; unproven tool-call, streaming and structured-output claims fail closed instead of becoming positive capability claims.
- The Cline-absence proof now uses an import finder that blocks the Cline adapter module itself, rather than only overriding ordinary `__import__`.

Validation status remains **UNVERIFIED at full-regression/runtime level**. The repository's GitHub Actions `validate` workflow fails before workflow steps execute on these implementation commits and also on the immediately preceding governance-only commits, so the CI signal cannot currently distinguish product failure from the pre-existing workflow/runner condition. Do not close the machine gate from static evidence alone.

The user's broader exact-reference implementation request is recorded as sequential proposed intents in the LBE intent ledger for:

- governed tool/permission reference convergence;
- session/checkpoint/subagent reference convergence;
- MCP/skills/plugins/hooks extension-surface convergence;
- Rust TUI reference convergence;
- headless/remote surface convergence.

They are intentionally non-authorizing until the current active slice receives claim-matched validation and the machine gate selects the next slice. This preserves the repository rule of one active slice and prevents upstream references from creating parallel authority owners.



## Extension/capability surface progress — 2026-09-20

Canonical LBE main now also contains a working generic installed-extension management surface derived from the same reference architecture:

- `ExternalCapabilityKind` includes `mcp`, `skill`, `plugin`, `hook`, `connector`, `subagent`, `network`, and `hosted_service`.
- Installed capability metadata can be upserted, enabled, disabled, and removed atomically.
- Product commands now support `lbe capabilities install|enable|disable|remove|list|validate`.
- Install definitions may be supplied inline as JSON or by `@file`.
- Rust TUI preserves the extension kind and exposes `/extensions`, `/skills`, `/plugins`, `/hooks`, and `/connectors`; `/mcp` remains an alias.
- The TUI renders one unified extension registry while keeping transport/execution/authorization outside the UI projection.
- Tests were added for registry management, capability kinds, product management commands, definition files, and generic TUI projection.

Relevant LBE commits:
`4609d8a`, `7163d922`, `779f18cd`, `46c734e8`, `02b10f4a`, `c0d6e282`, `ece55ab9`, `c04d30cb`, `2123b70d`, `3189e3b1`.

This is implementation state from canonical GitHub source, not a claim of live installed acceptance.


## 2026-09-21 governed tool projection continuation

Current canonical LBE source was re-read before this note. The active machine slice remains `REASONING_ENGINE_PROVIDER_BINDING_SEPARATION`; `apps/lbe-terminal` is explicitly outside the active intent scope.

Implementation continued in the already-authorized runtime owner rather than widening the slice:

- `c81a3f166aedb54656c75731bf6f578a761907ff` — `lbe_guard_inspector/runtime/governed_coding.py` now projects `governed_tool_projection` from the existing LBE `ToolRegistry` + `ToolReceipt` truth owners.
- `5ad590bd0113d3c336589510de258ac815d6920a` — the existing engine-neutral governed-coding test now checks the projected tool identity, capability, access class, network behavior, risk class, authorization verdict, and rationale.

This does **not** create a new policy or UI authority. The projection is derived from the same registered tool specification and authorization receipt already used for execution. It is intended to make governed tool truth available for later client projection without letting the TUI reconstruct authority from model prose.

Validation classification: **IMPLEMENTED / STATIC SOURCE CHECKED; RUNTIME + full regression not yet claimed by this GPT-K note.** The prior attempted change to `lbe_guard_inspector/provider_turn_runtime.py` + `apps/lbe-terminal` failed the current intent-scope gate and should not be forced through this slice.


## 2026-09-21 current-source reconciliation and reference synthesis

Canonical GitHub source was re-read before this update.

```text
LBE runtime main: 5ad590bd0113d3c336589510de258ac815d6920a
active slice: REASONING_ENGINE_PROVIDER_BINDING_SEPARATION
gate: OPEN
implementation_allowed: true
client workspace mutation in this slice: FORBIDDEN BY CURRENT NON_GOALS
```

Current-source findings:

- `provider_registry.py` now lazy-loads `cline_reasoning_provider` only when an explicit Cline binding is built; native LBE initialization no longer imports Cline at provider-registry module import time.
- `EngineProviderBinding` carries explicit `engine_id` + `provider_id` identity and prevents duplicate/default ambiguity.
- Native-LBE bindings are present for OpenAI-compatible, OpenAI, Anthropic, Gemini, LM Studio, Ollama, and OpenRouter where a current backend exists.
- Cline bindings remain explicitly available for LM Studio, Ollama, OpenRouter and as the current default for OpenAI-native, Vertex, Bedrock and OpenCode.
- `build_provider_controller(..., engine_id=...)` composes the selected persisted engine/provider binding without changing LBE workspace/session/authorization authority.
- `GovernedProviderReasoningController` and `GovernedClineCodingController` both converge on the same LBE `ToolRegistry`, `GovernedToolOrchestrator`, `ToolReceipt`, evidence, workspace identity and completion owners.
- Current tests include a hard Cline-absence import proof and explicit native-vs-Cline binding checks.
- The latest GitHub Actions run at this head reports failure, but all matrix jobs terminated before executing workflow steps. Classify that signal as **CI runner/infrastructure failure; source test result unknown**, not as a product regression.

Current reference verification on 2026-09-21:

- Cline CLI documents one shared agent core across CLI/IDE/SDK, Plan/Act, MCP, checkpoints, subagents/teams, schedules, connectors, background execution and mouse-capable TUI.
- OpenCode documents a mature TUI action model including command palette, sessions/tabs, model/agent switching, undo/redo, queued prompts, backgrounding, interrupt, child-session navigation, editor handoff and configurable leader-key bindings.
- Codex documents sandbox + approval separation, session-scoped approvals, managed configuration, constrained writable roots, network policies and agent-native logs.

Reuse rule remains unchanged: these references define capability/interaction patterns only. LBE must not copy their authority owners.

### Required closure for the active slice

Do **not** close `REASONING_ENGINE_PROVIDER_BINDING_SEPARATION` from static source alone. Claim-matched closure still requires:

1. engine-neutral initialization with Cline import blocked;
2. at least one native-LBE live provider turn;
3. one governed tool proposal -> R6C -> R6E -> ToolReceipt/evidence -> provider continuation;
4. Cline regression proof through the same authority boundary;
5. explicit engine/provider/model identity in persisted/session-visible state;
6. no silent engine/provider fallback;
7. focused + full regression on an environment where the test runner actually executes;
8. installed/runtime acceptance before any final-product PASS.

Until those execute successfully, classification remains:

```text
ENGINE/PROVIDER SEPARATION SOURCE = IMPLEMENTED
STATIC OWNER/BOUNDARY CHECK       = PASS
FULL REGRESSION                    = UNVERIFIED
LIVE MULTI-ENGINE ACCEPTANCE       = UNVERIFIED
SLICE CLOSURE                      = NOT PROVEN
```
