# Original LBE Workspace Gap Audit — 2026-09-02

Status: **CURRENT PROJECT-STATE PROJECTION FROM LOCAL AUDIT**

Authority rule: this document records the supplied audit of `C:\Agents-Memory-Tool-v6-integration`. Canonical source/runtime evidence and LBE machine governance remain authoritative. Findings that depend on uncommitted local files, branches, stashes, or local filesystem state must be reverified before mutation.

## Workspace roles

- **Original/canonical LBE workspace:** `C:\Agents-Memory-Tool-v6-integration`.
- **Later UI-only workspace:** `C:\LBE-TUI-Lab` / `Letterblack0306/LBE_Agents_wall_Intigration`. It was created later for the UI/client surface and must not be treated as the owner of the original LBE runtime or as proof that earlier native-interface work in the original workspace never existed.
- Existing LBE runtime authority remains in the original workspace. UI clients/adapters must not duplicate authorization, execution, receipt/evidence, persistence, validation, or completion owners.

## Main findings

### 1. Forgotten native terminal integration — highest-value gap

`unused-in-repo/cline-cli-reference-copy-2026-08-27/cline-cli/` is not merely an untouched upstream snapshot. The audited tree contains LBE-authored integration work:

- `apps/cli/src/runtime/interactive/lbe-authority.ts`
- `apps/cli/src/runtime/interactive/lbe-authority.test.ts`

The reported `LbeAuthorityBridge` spawns the Python LBE runtime, sends `tool.proposed` / `tools.describe`, maps results to `EXECUTED | DENIED | ESCALATED | FAILED`, and returns LBE receipt/evidence into the CLI loop. This is partially built governed Cline→LBE adapter work and is therefore materially different from generic reference code.

Classification: **PARTIALLY_BUILT / UNREGISTERED / MISPLACED / STATUS_CONFLICTED**.

It must not be silently deleted merely because it lives under `unused-in-repo/`.

### 2. Native-surface governance conflict is blocking

The audit reports two conflicting owned directions in `docs/governance/PROJECT_INTENT_LEDGER.md`:

- `LBE-INTENT-CLINE-NATIVE-SURFACE-INTEGRATION-001`, `MACHINE_SLICE: CLINE_NATIVE_SURFACE_INTEGRATION`, `RESULT: ACTIVE` around lines 335–369.
- A later product-owner correction around lines 390–398 treats the product UI as HTML-based and says Cline is reference material for interaction ideas only; copied Cline CLI/OpenTUI material remains quarantined/reference-only.

`C:\LBE-TUI-Lab\Docs\33_real_cli_ide_implementation_plan.md` also points back to the forgotten tree, so the later UI workspace does not by itself resolve the original-workspace conflict.

Classification: **BLOCKING_DOCUMENTATION / PRODUCT-DIRECTION CONFLICT**.

Required decision before relocation/deletion: either revive/register the native Cline surface as an active interface slice, or formally supersede it while preserving the LBE-authored bridge as historical/reference integration evidence.

### 3. Active runtime Cline worker is separate and must remain untouched

`lbe_guard_inspector/runtime/cline_worker/` is a distinct, tracked, wheel-embedded runtime seam:

- `package.json` / `package-lock.json` pin `@cline/agents@0.0.75` plus related packages.
- `worker.mjs` imports `AgentRuntime` / `createAgentRuntime` from `@cline/agents`.
- `lbe_guard_inspector/runtime/cline_stdio_bridge.py` consumes the worker through `GovernedClineWorker`.

Classification: **ACTIVE / CANONICAL GOVERNED PROVIDER-CONTINUATION SEAM / DO NOT TOUCH**.

No reference-tree cleanup may modify or conflate this runtime dependency with the forgotten CLI/OpenTUI source tree.

### 4. Web cockpit and governance tests exist locally but are uncommitted

Reported untracked material includes:

- `.ui-preview/agent_cockpit.html`
- `.ui-preview/lbe_landing_provider_setup.html`
- `.ui-preview/state2.sqlite3`
- `tests/test_agent_cockpit_http.py`
- `tests/test_governance_drift_guards.py`
- `tests/test_runtime_commit_gate_enforcement.py`
- `tests/test_ui_implementation_authority.py`

The audit reports `server.py` already routing `/`, `/cockpit`, `/cockpit.html`, `/workspace/tree`, `/roots`, `/inspect`, and `/search` into this surface.

Classification: **BUILT/WIRED LOCALLY, UNCOMMITTED, NOT YET REGISTERED AS CURRENT PRODUCT AUTHORITY**.

Disposition required: bind to an explicit UI/Home intent and commit with evidence, or classify/preserve as reference. Do not infer committed/current product status from local wiring alone.

### 5. Cleanup branches already exist

Reported remotes include:

- `origin/cleanup/remove-redundant-lbe-reference-copies`
- `origin/cleanup/remove-redundant-lbe-reference-copies-v2` (reported at `8eb961d…`)

Classification: **EXISTING PLANNED CLEANUP / NOT PROVEN MERGED TO MAIN**.

Before deleting or relocating the forgotten Cline tree, inspect these branches and determine whether their intended deduplication already gives the governed disposition.

### 6. Large branch inventory remains structurally unresolved

The audit reports 100+ branches, including unfinished/product/design/release work such as:

- `agents/tui-redesign-incomplete-features`
- `feat/c4-cli-runtime-surfaces`
- `feat/c5-governed-coding-execution`
- `design/authority-ownership-inspector-contract`
- `feat/reasoning-proposal-*`
- `feat/reasoning-investigation-planner`
- `release/python-runtime-v2.0.1`
- `release/python-runtime-v2.0.2`

Classification: **UNCLASSIFIED STRUCTURAL INVENTORY**. Presence of a branch does not prove its work should be merged. Each requires disposition evidence before mutation/closure.

### 7. Protected runtime/state and baseline material remains unclassified

Reported examples include:

- `state/lbe-runtime.db`
- `state/workspace.db`
- `state/workspace.backup.db`
- `state/*.baseline-20260724-224102`
- `state/*.pre-audit-backup`
- `.before-*` / `.baseline-*` files under runtime/rules areas.

Classification: **PROTECTED / RETENTION DECISION PENDING**.

Do not silently delete. The workspace-hygiene flow deferred these classes to an explicit retention decision.

### 8. Stashes contain unreconciled snapshots

Reported stashes:

- `stash@{0}` workspace-hygiene-preserve-before-clean-20260825
- `stash@{1}` codex pre-reconcile snapshot before preserving origin/main history
- `stash@{2}` pre-governance-lock-4db97ea
- `stash@{3}` backup partial project-scoped guard retrieval

Classification: **UNMERGED / DISPOSITION REQUIRED**. Preserve, recover, or drop only after content inspection and evidence-backed classification.

## Correct current status

| Area | Classification |
|---|---|
| Original LBE workspace | CANONICAL RUNTIME/PROJECT WORKSPACE |
| Later `LBE-TUI-Lab` workspace | UI/CLIENT WORKSPACE CREATED LATER |
| `runtime/cline_worker/` | ACTIVE / CORRECT / DO NOT TOUCH |
| Forgotten `LbeAuthorityBridge` native adapter | PARTIALLY BUILT / UNREGISTERED / MISPLACED / CONFLICTED |
| Native Cline/OpenTUI product direction | BLOCKED ON OWNED-DOCUMENT CONFLICT |
| Local web cockpit + tests | BUILT + WIRED / UNCOMMITTED |
| Cleanup branches | EXIST / NOT PROVEN MERGED |
| 100+ branches | UNCLASSIFIED |
| Protected state/backups | UNCLASSIFIED / RETENTION PENDING |
| Stashes | UNRECONCILED |

## Bounded corrective sequence

1. Reverify the current ledger and local forgotten-tree files before mutation.
2. Resolve the native-surface status conflict explicitly.
3. Keep `lbe_guard_inspector/runtime/cline_worker/` unchanged.
4. Inspect the existing cleanup branches before creating a new cleanup path.
5. If the native tree is retained, move/own it outside `unused-in-repo/`, exclude `node_modules/`, and preserve the LBE-authored bridge/test with explicit provenance. If formally superseded, quarantine/preserve the bridge as historical integration evidence rather than silently deleting it.
6. Decide/register the local web cockpit and its tests.
7. Reconcile Module 33 in the later UI workspace with the canonical LBE decision.
8. Classify branches, stashes, and protected state/backups separately; do not bundle them into the UI/reference-tree decision.
9. Add/retain a validator for `unused-in-repo/` ownership/disposition so LBE-authored integration code cannot remain silently misclassified there.

## Non-negotiable boundary

The forgotten native UI adapter and the active runtime worker are **two different Cline integrations**. Any cleanup or product-surface decision must preserve that distinction.