# Installed Launcher Configuration Blocker — 2026-09-17

## Authority
This is a GPT-K projection of current installed/runtime evidence. Current local source/runtime evidence, machine governance, active intent, and acceptance records remain higher authority.

## Current blocker
`REAL_LAUNCHER_CONFIG_BINDING = FAIL`

The installed runtime is present at `C:\LBE_RUNTIME_PY312` with `lbe-guard-inspector 2.0.3` and `C:\LBE_RUNTIME_PY312\Scripts\lbe.exe`, but a normal installed coding acceptance cannot start without manually injected configuration.

Observed installed configuration resolution:
- `LBE_GUARD_INSPECTOR_CONFIG_PATH` if set, otherwise `<site-packages>\config.json`;
- `LBE_GUARD_INSPECTOR_GOVERNANCE_PATH` if set, otherwise `<site-packages>\governance.json`.

In the real-launcher acceptance process both variables were unset, and neither fallback file existed. Normal invocation therefore fails at the configuration boundary instead of reaching the proven provider-backed coding-turn path.

## Command identity collision
PowerShell currently resolves `lbe` to an unrelated Node launcher under `C:\Users\prave\AppData\Roaming\npm\lbe.cmd` / `lbe.ps1`, not to the installed Python runtime launcher at `C:\LBE_RUNTIME_PY312\Scripts\lbe.exe`.

This must be treated as a product-launch/acquisition issue, not as evidence of a provider, tool, mutation, validation, or completion defect.

## Canonical repository facts checked
At backend HEAD `aa1424e11ae2917b6217a7bc99b03e01958dfc7d`:
- `pyproject.toml` publishes `[project.scripts] lbe = "lbe_guard_inspector.product_entry:main"`;
- `lbe_guard_inspector.product_entry` is the current backend product entry and exposes `start`, `turn`, `control`, `tool`, `authorization`, `capabilities`, and `export`;
- current product-integration tooling stages an installed runtime CLI and separately identifies the client executable;
- existing installed probes explicitly inject config/governance environment paths, so probe success must not be mistaken for real-launcher binding proof.

## Protected accepted checkpoints
Do not reopen without contradictory evidence:
- installed direct `workspace.patch` approval/mutation/receipt/evidence/diff/idempotency proof;
- provider/model availability for `openai-compatible / google/gemma-4-e4b`;
- outbound governed tool transmission;
- structured provider tool-call translation;
- real `workspace.write_text` governed execution;
- validation fail-closed behavior.

## Required next decision
Before changing runtime defaults, determine the single canonical user-facing `lbe` launcher/acquisition owner and its configuration contract.

The next slice must distinguish:
1. launcher/wrapper is responsible for binding config/governance/state/provider paths;
2. installer/package is responsible for installing canonical runtime configuration into a stable product-data location;
3. runtime is intentionally environment-configured and final launcher must establish those variables;
4. current competing Node `lbe` command is stale/unrelated and must not be treated as the accepted product command;
5. another evidence-backed ownership model.

Do not copy repository-local config into site-packages merely to make acceptance pass. Do not patch provider/mutation/validation owners for this failure.

## Acceptance after repair
Only after real `lbe` command identity and real launcher configuration binding are proven should the three normal persisted coding trials resume:
`user task -> real lbe launcher -> session -> turn -> workspace.write_text -> authorization -> governed execution -> ToolReceipt/evidence -> validation -> completion`.
