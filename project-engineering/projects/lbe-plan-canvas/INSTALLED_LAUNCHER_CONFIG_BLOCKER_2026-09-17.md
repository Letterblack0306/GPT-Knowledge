# Installed Launcher Configuration Blocker — 2026-09-17

## Authority
This is a GPT-K projection of current installed/runtime evidence. Current local source/runtime evidence, machine governance, active intent, and acceptance records remain higher authority.

## Current blocker
`REAL_LAUNCHER_CONFIG_BINDING = SOURCE_REPAIR_PRESENT / INSTALLED_PROOF_PENDING`

The installed runtime remains `lbe-guard-inspector 2.0.3`. The owning launcher/configuration repair has now been implemented and locally validated in the canonical backend worktree, but has not yet been published to `origin/main`. Because the product integration build/package path intentionally requires `-SourceMode origin-main`, a clean package/install proof containing this repair does not yet exist.

## Canonical workspaces observed
- Backend: `C:\Agents-Memory-Tool-v6-integration`, branch `main`, HEAD `aa1424e11ae2917b6217a7bc99b03e01958dfc7d`; `origin/main` matched before the local repair; pre-existing untracked `dist_reconcile_tmp/lbe_guard_inspector-2.0.3-py3-none-any.whl` and `verify_clean_install.py` preserved.
- Client: `C:\LBE-TUI-Lab`, pre-existing tracked/untracked work preserved.
- Installed runtime: `C:\LBE_RUNTIME_PY312\Lib\site-packages`, package `lbe-guard-inspector 2.0.3`.

## Source repair implemented in existing owner
Changed local files only:
- `tools/lbe_product_integration.ps1`
- `tests/test_product_launcher_contract.py`

No provider, mutation, authorization, receipt/evidence, validation, completion, Rust, or GPT-K runtime authority was changed.

### Implemented composition behavior
The current local repair changes the existing product-integration owner so that:
- generated `lbe-launch.ps1` requires and verifies installed `config\config.json` and `config\governance.json`;
- launcher automatically binds `LBE_GUARD_INSPECTOR_CONFIG_PATH`, `LBE_GUARD_INSPECTOR_GOVERNANCE_PATH`, and `LBE_GUARD_INSPECTOR_STATE_DIR`;
- installer validates the launched project and creates project-bound guard config/governance/state;
- config uses the launched project as the sole `knowledge_roots` and `active_workspace_root`;
- governance uses the accepted bounded R7 policy shape rather than an ad-hoc permissive fixture;
- assembled Rust client is renamed to `lbe-client.exe` so it cannot win `lbe` executable precedence over the launcher;
- product-generated `lbe.cmd`/`lbe.ps1` shims own user command acquisition and install-root PATH exposure;
- the unrelated npm `lbe` launcher is not modified.

## Local validation of the repair
Observed result:
- PowerShell parser: PASS;
- focused launcher contract tests: `2 passed`;
- existing release packaging tests: `4 passed`;
- `git diff --check`: PASS, except expected line-ending warning;
- repository source commit/push: NOT PERFORMED;
- fresh origin-main package/install proof: NOT PERFORMED.

## Current classifications
- `PRODUCT_LAUNCHER_CONFIGURATION_COMPOSITION_DEFECT`: source owner identified and locally repaired.
- `REAL_PRODUCT_COMMAND_IDENTITY`: UNPROVEN installed.
- `REAL_LAUNCHER_CONFIG_BINDING`: SOURCE_REPAIR_PRESENT / INSTALLED_PROOF_PENDING.
- `FINAL_PRODUCT_SOURCE_RECONCILIATION`: remains open.

## Why installed proof is still blocked
`tools/lbe_product_integration.ps1` forces build/package modes to consume `origin/main`. The repair currently exists only in the local worktree. A package produced from current `origin/main` would therefore exclude the repair and cannot be used as acceptance evidence.

The next step is to publish/reconcile exactly the two intended source files into canonical GitHub `main`, preserving all unrelated local dirty/untracked state. After publication, build/package from clean `origin/main`, install into a fresh disposable product root, and prove:
- `Get-Command lbe` resolves to the LetterBlack-owned product shim/launcher;
- the unrelated npm command remains untouched;
- launcher binds existing installed config/governance/state automatically;
- no manual diagnostic environment injection is required;
- installed runtime imports from site-packages rather than source checkout.

Only after `REAL_PRODUCT_COMMAND_IDENTITY = PASS` and `REAL_LAUNCHER_CONFIG_BINDING = PASS` should the three normal persisted coding trials resume.

## Protected accepted checkpoints
Do not reopen without contradictory evidence:
- installed direct `workspace.patch` approval/mutation/receipt/evidence/diff/idempotency proof;
- provider/model availability for `openai-compatible / google/gemma-4-e4b`;
- outbound governed tool transmission;
- structured provider tool-call translation;
- real `workspace.write_text` governed execution;
- validation fail-closed behavior.

## Separate issue
The Rust/TUI SSH-alias repository identity verifier problem remains separate and was not part of this repair.
