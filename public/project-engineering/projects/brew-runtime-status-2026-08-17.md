# Brew Runtime Status — 2026-08-17

## Knowledge metadata

- Last reviewed: 2026-08-17
- Project repository: `Letterblack0306/brew`
- Active PR: `#442` — `Consolidate Brew reasoning, evidence, and memory authority`
- Brew branch: `agent/canonical-runtime-operation-authority-20260812`
- Brew PR head at this record: `169bc635cf11d2b773610697aebd63b625fd4e2e`
- Brew base: `main` @ `33276e231f597f5fa026f7b76231fc8d5d2080b3`
- Local runtime workspace observed: `G:\Developments\38_Brew_Creative_Agent\brew`
- Purpose: cross-session current-position record for Brew's provider-backed canonical runtime proof and the next investigation boundary
- Authority: status/reference only; current Brew GitHub source, exact local revision, live runtime evidence, and project-owned status/checkpoint documents remain authoritative

## Why this status record exists

Brew has reached a materially stronger runtime position than the earlier source-only provider checkpoints: a real canonical `/query` request has now reached the selected LM Studio model and returned a model-generated response through Brew's active runtime.

At the same time, that proof exposed an operation-correlation gap in model lifecycle events. The gap must be investigated according to the existing GPT-Knowledge corrective method rather than patched from static inference.

This record prevents future sessions from repeating provider setup/source-only work or incorrectly treating the current result as full agent/tool end-to-end completion.

## Applicable GPT-Knowledge method

The mandatory method remains:

```text
target identity
  -> one real user/runtime path
  -> correlated source + runtime evidence
  -> bounded finding with verification level
  -> smallest active-owner change
  -> claim-matched validation
  -> exact limitations
```

Relevant canonical/reference records:

- `ai-agents/unified-agent-engineering-methods.md`
- `ai-agents/repeated-audit-failures-and-corrective-method.md`
- `ai-agents/professional-agent-runtime-cli-and-provider-architecture.md`
- `ai-agents/provider-neutral-agent-auth-and-model-routing.md`
- `ai-agents/studies/lobehub-agent-skills-system.md` for trace-first debugging and normalized runtime identity patterns

Important rule from the repeated-audit correction: do not select a patch owner until the **earliest wrong state** on the active runtime path is proven.

## Brew project-owned checkpoint

The current detailed Brew checkpoint is:

`docs/status/PROVIDER_CANONICAL_QUERY_RUNTIME_CHECKPOINT_2026-08-17.md`

The provider source/guard checkpoint is:

`docs/status/PROVIDER_SOURCE_GUARD_CHECKPOINT_2026-08-17.md`

Use those project-owned documents for exact Brew evidence, then revalidate current GitHub/runtime state before acting.

## Provider/model position

Current observed provider/model truth:

- selected provider: `lm_studio`
- selected model: `qwen/qwen3-vl-8b`
- provider/model selection persisted through Brew's own provider APIs
- Brew's LM Studio connectivity endpoint returned success
- observed Brew-provider connectivity latency: `924 ms`

Classification:

- provider selection persistence: **RUNTIME_PROVEN**
- model selection persistence: **RUNTIME_PROVEN**
- Brew -> LM Studio connectivity: **RUNTIME_PROVEN**

Do not repeat provider selection/model-selection implementation work unless current live evidence shows regression.

## Canonical provider-backed text turn

LoopTool runtime-proof command hash:

`9AA1DF0B83DC173F83556266023CAAD09A8D2961D07B6222FBC8C27DBDD787C2`

Observed runtime identity:

- service: `brew-runtime`
- port: `8600`
- PID observed: `210072`
- runtime entry: `brew/agent/orchestrator-server.mjs`
- started from: `G:\Developments\38_Brew_Creative_Agent\brew`
- runtime entry hash matched the local checkout entry hash used by the proof

Observed active path:

```text
POST /query
  -> canonical query handling
  -> runTurn()
  -> bounded agent tool loop
  -> CatalogProvider
  -> LM Studio
  -> qwen/qwen3-vl-8b
  -> model response
```

Observed result:

- `ok: true`
- response: `I received this message.`
- route: `bounded_multi_step_tool_loop`
- loop status: `final`
- iterations: `1`
- session ID: `runtime_proof_1786916911505`
- operation ID: `7b408315-55c6-4c0e-ae5a-d4ebd74034d4`
- job ID: `turn-api-runtime_proof_1786916911505-1786916912359`
- no tool receipt because this proof explicitly asked the model not to use tools

Classification: **provider-backed canonical text turn RUNTIME_PROVEN for the observed interaction**.

This is not yet a live tool-call end-to-end proof.

## Model lifecycle event evidence

Four same-session model events were replayed:

1. `model.turn.started`
2. `model.message.completed`
3. `model.usage.updated`
4. `model.turn.completed`

All four carried:

- `providerId: lm_studio`
- `modelId: qwen/qwen3-vl-8b`
- the expected runtime session ID

Usage observed:

- prompt tokens: `1506`
- completion tokens: `6`
- total tokens: `1512`

Classification:

- provider attribution: **RUNTIME_PROVEN**
- model attribution: **RUNTIME_PROVEN**
- session correlation: **RUNTIME_PROVEN**

## Open operation-correlation finding

The canonical `/query` result returned operation ID:

`7b408315-55c6-4c0e-ae5a-d4ebd74034d4`

The four correlated model lifecycle events carried:

- `operationId: null`
- `turnId: null`

Therefore:

- operation correlation on the observed model event stream: **RUNTIME_DISPROVEN**
- durable canonical Brew `turnId` requirement/ownership: **UNVERIFIED**

Do not convert `turnId: null` into a defect claim until the canonical Brew turn-ID contract/owner is established.

## Static source facts already established

Current Brew source inspection established:

1. `runTurn()` allocates or recovers the operation identity before the agent tool loop.
2. `runAgentToolLoop()` passes `sessionId`, `operationId`, `jobId`, and `iteration` into `getProviderChatResponse()`.
3. A later runner adapter path narrows the provider payload before the canonical provider callback.

The later adapter is therefore a **candidate investigation boundary**, not yet a proven patch owner.

The exact earliest runtime boundary where non-null `operationId` becomes absent/null has **not yet been proven**.

## Required next investigation

Do not patch before this trace is obtained.

For one new canonical `/query` turn, observe the same identity at these successive active boundaries:

```text
runAgentToolLoop provider-call payload
  -> getProviderChatResponse input
  -> canonical generateResponse/query-provider callback input
  -> provider adapter/request correlation metadata
  -> model.turn.started emission input
  -> replayed model event
```

At each boundary compare:

- `sessionId`
- `operationId`
- `jobId`
- `iteration`

The first boundary where a previously non-null operation ID becomes absent/null is the earliest wrong state. Only then:

1. inspect the active owner at that boundary;
2. make the smallest change there if source and runtime evidence agree;
3. rerun the same canonical runtime proof;
4. require emitted model events to carry the same operation ID returned by `/query` if that is the established event contract;
5. only after correlation is proven advance to live model tool-call -> host execution -> receipt -> continuation.

Do not add a compensating lookup, duplicate correlation store, or second operation authority simply to fill the event field.

## Current proof matrix

| Area | Status |
| --- | --- |
| Provider source/guard contracts | SOURCE_TEST_PROVEN |
| LM Studio selected through Brew | RUNTIME_PROVEN |
| `qwen/qwen3-vl-8b` selected through Brew | RUNTIME_PROVEN |
| Brew -> LM Studio connectivity | RUNTIME_PROVEN |
| Canonical `/query` provider-backed text response | RUNTIME_PROVEN for observed interaction |
| Provider attribution in model events | RUNTIME_PROVEN |
| Model attribution in model events | RUNTIME_PROVEN |
| Session correlation in model events | RUNTIME_PROVEN |
| Operation correlation in model events | RUNTIME_DISPROVEN for observed interaction |
| Earliest operation-correlation loss boundary | NOT YET PROVEN |
| Proven correlation patch owner | NOT YET PROVEN |
| Durable canonical `turnId` semantics | UNVERIFIED |
| Live provider tool call | NOT YET PROVEN |
| Host tool execution + receipt + continuation | NOT YET PROVEN |
| Cancellation/error propagation on live provider path | NOT YET PROVEN |
| Restart/resume provider path | NOT YET PROVEN |
| Installed runtime | NOT YET PROVEN |
| Telegram live delivery | NOT YET PROVEN |
| Browser E2E | NOT YET PROVEN |
| Current-head full CI/release readiness | NOT YET PROVEN |

## Stop conditions

Stop and re-establish evidence rather than patch when:

- Brew PR head/local runtime identity changed since the recorded proof;
- current source no longer matches the traced provider path;
- the first correlation-loss boundary has not been observed;
- a proposed fix introduces a second identity authority instead of preserving the existing operation identity;
- focused tests pass but the real `/query` event correlation remains unverified;
- a model/tool success is being promoted to release readiness without installed-runtime and CI proof.

## Update rule

Update this status record only when one of these changes materially:

- the exact Brew PR/branch milestone;
- provider-backed runtime acceptance state;
- operation-correlation root cause/fix state;
- live tool-call/receipt/continuation state;
- restart/cancellation/install/CI acceptance state;
- architectural ownership of operation/session/turn identity.

Transient LoopTool syntax/harness failures should stay in raw investigation evidence and should not become architecture truth.
