# Installed LBE Acceptance Checkpoint — 2026-09-17

## Authority and evidence status

This checkpoint records the latest installed/runtime acceptance evidence supplied from the canonical local workspaces. It is a GPT-K projection only. Current local source, runtime evidence, machine governance, active intent, and acceptance records remain higher authority.

## Canonical workspaces observed

- Backend/runtime: `C:\Agents-Memory-Tool-v6-integration`
  - observed HEAD: `aa1424e`
  - observed relation to remote: matches `origin/main`
  - pre-existing untracked `dist_reconcile_tmp/` and `verify_clean_install.py` preserved
- Rust/client: `C:\LBE-TUI-Lab`
  - observed HEAD: `1bf49c5`
  - observed remote: `origin/main` = `4a1dd91`
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

A valid local provider/model pair was proven through LM Studio/OpenAI-compatible configuration:

- provider ID: `openai-compatible`
- model: `google/gemma-4-e4b`
- local provider listener/model discovery available
- session provider/model persisted and matched provider configuration
- real `product_entry._turn` created authoritative turn state and operational events
- validation and completion-evidence machinery executed when the turn failed validation

Provider availability itself is therefore not the current blocker.

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

The provider-facing coding turn is not currently required to expose a tool named `workspace.patch`. The canonical provider mutation capability is `workspace.write_text`. Do not add `workspace.patch` to provider guidance solely to satisfy an earlier acceptance assumption.

## Current installed acceptance blocker

A real provider-backed turn was created successfully and `workspace.read` executed through the governed tool path. The model then stated textually that it had completed the requested change but did **not** emit an actual `workspace.write_text` tool call.

Observed result:

- turn lifecycle: PASS
- governed read tool call: PASS
- provider-facing `workspace.write_text` exposure: PASS
- actual provider `workspace.write_text` tool-call emission: NOT PROVEN / FAILED IN THIS RUN
- mutation: NOT EXECUTED
- authoritative validation: ran and failed because no task-bound source change existed
- completion promotion: correctly denied
- repository source changes: none
- focused backend/provider/product tests: `26 passed`

Current blocker classification:

`PROVIDER_TOOL_CALL_EMISSION_OR_TRANSLATION_NOT_YET_ISOLATED`

The failure does not justify changing mutation ownership, adding `workspace.patch` to the provider surface, weakening validation, or fabricating lifecycle records.

## Next bounded diagnostic

Before any implementation change, isolate whether the missing mutation tool call is caused by:

1. model behavior (model chose text rather than tool call);
2. outbound provider request not carrying the full LBE-generated tool definitions;
3. incorrect/missing OpenAI-compatible `tools` / `tool_choice` request fields;
4. LM Studio model/template/tool-call formatting behavior;
5. raw provider response containing a tool call that the LBE adapter fails to translate;
6. provider response containing only text because no parsable tool call was produced;
7. streaming/non-streaming tool-call parsing mismatch;
8. another evidence-backed provider-adapter seam.

Capture the exact sanitized outbound provider request shape and raw provider response shape before modifying source. Do not print credentials.

If the current provider adapter is proven to transmit and translate tool calls correctly, repeat acceptance with an already-available tool-capable model/configuration before treating model noncompliance as a product defect.

## Deferred gates

Do not advance to MCP until one real provider-backed mutation completes the full authoritative chain:

`session -> turn -> workspace.write_text -> authorization -> governed execution -> ToolReceipt/evidence -> validation -> completion`

After that passes, continue with:

1. live MCP invocation + persisted event ordering;
2. PTY/ConPTY installed interaction;
3. restart/resume;
4. fresh complete installed end-to-end product acceptance.

## Separate issue

The Rust/TUI origin uses an SSH alias form (`git@github-letterblack:...`) that the canonical verifier URL regex rejects. This remains a separate verifier/harness issue and has not caused the provider-turn failures above.
