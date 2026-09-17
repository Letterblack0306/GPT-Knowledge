# Installed LBE Acceptance Checkpoint — 2026-09-17

## Authority and evidence status

This checkpoint records the latest installed/runtime acceptance evidence supplied from the canonical local workspaces. It is a GPT-K projection only. Current local source, runtime evidence, machine governance, active intent, and acceptance records remain higher authority.

## Canonical workspaces observed

- Backend/runtime: `C:\Agents-Memory-Tool-v6-integration`
  - observed HEAD: `aa1424e11ae2917b6217a7bc99b03e01958dfc7d`
  - observed relation to remote: matches `origin/main` (`0/0` ahead/behind)
  - pre-existing untracked `dist_reconcile_tmp/` and `verify_clean_install.py` preserved
- Rust/client: `C:\LBE-TUI-Lab`
  - observed HEAD: `1bf49c5120dfb18e799b35d81fd2f58646ff8715`
  - observed remote: `origin/main` = `4a1dd916615694097342cf6b0f2fab9ffad07f2e`
  - observed relation: two commits behind
  - pre-existing tracked/untracked recovery work preserved
- Installed runtime: `C:\LBE_RUNTIME_PY312`
  - installed package: `lbe-guard-inspector 2.0.3`

## Accepted installed lower-level mutation proof

The installed direct governed `workspace.patch` path is accepted for the following observed behaviors:

- approval escalation/resolution works;
- one governed mutation executes;
- a canonical `ToolReceipt` is persisted;
- evidence and unified diff/change data are persisted;
- before/after SHA-256 values correlate to the mutation;
- identical replay returns the original receipt;
- changed payload is rejected;
- no second mutation or second governed-operation identity is created.

The prior idempotency defect was classified as an installed-package mismatch and was resolved by rebuilding/reinstalling the canonical runtime package. Focused backend validation passed (`22 passed`).

This lower-level idempotency checkpoint must not be reopened unless newer evidence contradicts it.

## Real installed provider-backed turn proof

A valid local provider/model pair is proven through LM Studio/OpenAI-compatible configuration:

- provider ID: `openai-compatible`
- model: `google/gemma-4-e4b`
- endpoint used by the installed adapter: `http://127.0.0.1:1234/v1/chat/completions`
- local provider listener/model discovery available
- session provider/model persisted and matched provider configuration
- real `product_entry._turn` creates authoritative turn state and operational events
- validation and completion-evidence machinery executes and fails closed when no task-bound source change exists

Provider availability itself is not the current blocker.

## Mutation tool contract resolution

Current source/runtime evidence classifies the two mutation tools as semantically distinct:

### `workspace.write_text`

- canonical provider-facing coding-turn mutation capability;
- inputs: path/content plus optional `expected_sha256`;
- bounded UTF-8 whole-file create/replace semantics;
- medium write risk;
- uses existing LBE authorization -> `GovernedToolOrchestrator` -> existing write handler;
- produces canonical receipt/evidence and before/after hashes;
- exposed exactly once in coding-turn provider guidance.

### `workspace.patch`

- direct product-entry/Rust-client capability;
- inputs include path/content and required `expected_sha256`;
- bounded existing-file replacement with unified diff semantics;
- uses existing LBE authorization -> `GovernedToolOrchestrator` -> `workspace.patch` handler;
- backend patch handler delegates the actual write to the existing `workspace.write_text` owner and adds diff evidence;
- Rust `RealLbeWrapper` maps `UserRequest::PatchWorkspace` directly to product-entry `workspace.patch`.

### Contract classification

`SEMANTICALLY_DISTINCT_TOOLS`

The provider-facing coding turn is not required to expose a tool named `workspace.patch`. The canonical provider mutation capability is `workspace.write_text`. Do not add `workspace.patch` to provider guidance solely to satisfy an earlier acceptance assumption.

## Provider tool-call boundary diagnosis — resolved

The provider/tool translation boundary was inspected without repository source modification.

### Outbound request proof

The installed OpenAI-compatible adapter sends:

- `model = google/gemma-4-e4b`;
- messages;
- an LBE-generated `tools` array;
- `workspace.write_text` exactly once;
- `workspace.write_text` schema with required `path` and `content`, optional `expected_sha256`, and `additionalProperties = false`;
- `workspace.read`, `workspace.create_candidate_text`, `process.run_registered`, `git.status`, `git.stage_paths`, and `git.commit_staged`;
- no normal-production `tool_choice` field;
- no normal-production `stream` field (non-streaming completion).

Therefore `runtime.guidance.loaded` and the actual provider request are aligned for the mutation tool surface.

### Model/tool-call capability proof

An isolated non-mutating diagnostic against the same endpoint/model supplied a synthetic `diagnostic_probe(value: string)` function and required a tool call only for that diagnostic. The provider returned:

- structured `message.tool_calls`;
- `finish_reason = tool_calls`;
- empty ordinary assistant content;
- arguments equivalent to `{value: probe}`.

The returned synthetic function was not executed.

This proves that the loaded `google/gemma-4-e4b` path can emit structured tool calls in the current LM Studio configuration.

### Real coding-turn tool-call proof

A real installed coding turn using the normal LBE adapter emitted a structured `workspace.write_text` tool call. LBE preserved the call through:

`LM Studio structured tool_calls -> OpenAICompatibleEventAdapter -> normalized TOOL_CALL_COMPLETED -> GovernedProviderReasoningController -> GovernedToolOrchestrator -> workspace.write_text receipt/evidence`

The governed operation:

- authorization: `ALLOW`;
- execution: `EXECUTED`;
- created disposable `probe2.txt` with 5 bytes;
- resulting SHA-256: `ba9c736f19e7f60b7f6764adb0b7908c0a2b394e09b6c09863528c7f2bc86095`.

A separate real read turn likewise translated `workspace.read` into a governed receipt.

No tool-call disappearance was observed in transport, adapter translation, normalization, authorization, or governed execution.

### Root-cause classification

`PROVIDER_MODEL_DID_NOT_CALL_TOOL`

This classification applies to the earlier ordinary coding turn only. In that turn the model returned ordinary text without issuing the required mutation call. Current evidence shows that:

- the tool definitions reached LM Studio correctly;
- the loaded model can emit structured tool calls;
- the normal LBE adapter can receive and translate structured tool calls;
- the governed `workspace.write_text` path executes correctly when the model actually calls it.

Therefore the earlier no-write result was not caused by tool-definition loss or response-translation loss.

The remaining acceptance concern is behavioral/task compliance under the original coding prompt: reproduce the original prompt with request/response capture and determine whether the smallest corrective action belongs in task/tool-use guidance or provider/model selection. Do not force normal `tool_choice` or change mutation ownership solely because one turn chose ordinary text.

## Installed invocation/configuration requirement

The first disposable write attempt in the diagnostic was launched without the active LBE configuration environment and attempted to resolve `config.json` under the installed site-packages path. Supplying the authorized disposable diagnostic configuration allowed the same installed path to execute `workspace.write_text` successfully.

Classification:

`INVOCATION_CONFIGURATION_REQUIREMENT`

This is not evidence of a provider schema or tool-translation defect. Any final product acceptance must prove the real installed launcher supplies the required active LBE configuration rather than relying on an ad-hoc diagnostic environment.

## Current acceptance blocker

Current blocker classification:

`ORIGINAL_TASK_TOOL_USE_COMPLIANCE_NOT_YET_REPRODUCED`

Before source modification:

1. replay/reproduce the original coding task as closely as current evidence permits;
2. capture sanitized outbound request and raw provider response;
3. prove whether the model again claims completion without `workspace.write_text`;
4. inspect current task/guidance/tool-use prompting for contradictions or insufficient mutation requirements;
5. compare with another already-available tool-capable model only if needed;
6. do not treat ordinary textual claims as execution evidence;
7. do not force normal production `tool_choice` merely to make acceptance pass.

## Deferred gates

Do not advance to MCP until one real provider-backed mutation completes the full authoritative chain under the acceptance task:

`session -> turn -> workspace.write_text -> authorization -> governed execution -> ToolReceipt/evidence -> validation -> completion`

After that passes, continue with:

1. live MCP invocation + persisted event ordering;
2. PTY/ConPTY installed interaction;
3. restart/resume;
4. fresh complete installed end-to-end product acceptance.

## Separate issue

The Rust/TUI origin uses an SSH alias form (`git@github-letterblack:...`) that the canonical verifier URL regex rejects. This remains a separate verifier/harness issue and has not caused the provider-turn failures above.
