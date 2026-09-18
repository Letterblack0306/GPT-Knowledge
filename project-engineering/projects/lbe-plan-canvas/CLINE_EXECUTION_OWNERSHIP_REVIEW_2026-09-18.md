# LBE Cline Execution Ownership Review — 2026-09-18

Status: **SOURCE-VERIFIED ARCHITECTURE CONFORMANCE GAP — NO IMPLEMENTATION AUTHORIZED**

## Canonical heads reviewed

```text
backend = d4fc6629b1d54c307c51fbc14d37e17d540c5f63
Rust/Ratatui = 58104bae1cebd2be04fa1d5544b2ebfce90fe8ff
```

The installed-product acceptance gate remains closed PASS for its tested scope. This review concerns broader execution-ownership conformance and does not reopen the accepted runtime/UI/PTY gate.

## Actual installed ACT/coding call graph

```text
RealLbeWrapper::submit_conversational_turn
-> python -m lbe_guard_inspector.product_entry turn
-> product_entry._turn
-> coding + permission not read_only/audit_only
-> GovernedProviderReasoningController
-> OpenAICompatibleEventAdapter
-> bounded LBE provider/tool loop
-> GovernedAgentGateway / GovernedToolOrchestrator
```

For the writable ACT/coding path, the current source constructs `GovernedProviderReasoningController` directly. This path does not consult the provider registry and does not invoke `ClineReasoningBackend` or `GovernedClineWorker`.

## Where Cline is currently active

The non-writable/read-only provider-controller path uses:

```text
build_provider_controller
-> default_provider_registry
-> provider factory
-> ClineReasoningBackend for Cline-mapped providers
-> GovernedClineWorker
-> @cline/agents AgentRuntime
```

The provider registry maps several providers through the Cline backend, including `lmstudio`, `openai-native`, `vertex`, `bedrock`, `ollama`, `openrouter`, and `opencode` in the reviewed source.

`ClineReasoningBackend` is intentionally bounded as a provider adapter and uses a constrained worker configuration rather than the writable ACT/coding loop.

## Canonical architecture contract

Current product records state:

```text
Rust/Ratatui owns presentation/input.
Cline owns reasoning/planning/provider/model/tool-proposal/continuation/response composition.
LBE owns identity/policy/authorization/execution/receipts/evidence/persistence/validation/completion.
```

The current writable coding call graph does not fully satisfy that statement.

## Verdict

```text
Cline worker/package integration                = PRESENT
Cline provider-registry integration             = PRESENT
Cline on selected non-writable provider paths   = PRESENT
Cline as universal ACT/coding reasoning owner   = NOT CURRENTLY TRUE

ARCHITECTURE_CONFORMANCE                        = GAP
INSTALLED_PRODUCT_ACCEPTANCE                    = REMAINS PASS FOR TESTED SCOPE
```

## Minimum-change candidate

Do not introduce a second authority owner.

Candidate implementation:

1. Route writable coding provider selection through the canonical provider registry instead of unconditionally constructing `GovernedProviderReasoningController`.
2. Add one Cline-backed coding controller implementing the same `run() -> LBEResponse` contract.
3. Reuse `GovernedClineWorker` for reasoning/tool-proposal/continuation mechanics.
4. Reuse the existing LBE coding tool registry, authorization, mutation-path tracking, `GovernedToolOrchestrator`, ToolReceipt/evidence, session, persistence, and completion owners unchanged.
5. Preserve the existing non-Cline controller only as a deliberate provider-specific fallback where the registry says Cline is not the selected backend.
6. No Rust/Ratatui change is required for this ownership repair because `RealLbeWrapper` is already provider-agnostic at the `product_entry turn` seam.

## Candidate affected source

```text
lbe_guard_inspector/product_entry.py
lbe_guard_inspector/cli.py
lbe_guard_inspector/runtime/governed_coding.py
lbe_guard_inspector/provider_registry.py
lbe_guard_inspector/cline_reasoning_provider.py
lbe_guard_inspector/runtime/cline_stdio_bridge.py
lbe_guard_inspector/runtime/cline_worker/worker.mjs
tests/
```

## Required acceptance if implementation is authorized

At minimum prove:

- ACT/write_allowed uses the registry-selected Cline coding controller for a Cline-mapped provider such as LM Studio;
- the provider sees only LBE-generated coding tools;
- each tool proposal is mediated by LBE before execution;
- exactly the existing LBE authorization, receipt/evidence, persistence, and completion owners remain authoritative;
- provider continuation occurs through Cline after governed tool results;
- non-Cline provider fallback remains bounded and explicit;
- PLAN/AUDIT/read-only paths do not regress;
- installed Rust/Ratatui remains unchanged at the presentation boundary;
- a live installed `lbe` ACT turn proves Cline-backed reasoning plus governed tool/receipt continuation.

## Gate rule

This review is a **candidate next product slice only**. No implementation gate is activated by this document. Backend mutation requires explicit user authorization for a new intent/slice.
