# Original LBE Workspace Gap Audit — 2026-09-02

Status: **CURRENT PROJECT-STATE PROJECTION — RECONCILED UI DIRECTION**

Authority rule: canonical source/runtime evidence and LBE machine governance remain authoritative. Local uncommitted files, branches, stashes, or filesystem state must be reverified before mutation.

## Workspace roles

- **Canonical LBE workspace:** `C:\Agents-Memory-Tool-v6-integration`.
- **Later UI/reference workspace:** `C:\LBE-TUI-Lab` / `Letterblack0306/LBE_Agents_wall_Intigration`.
- `lbe-tui/` and `lbe-core/` are reference material, not competing product/runtime authorities.
- The canonical product UI direction is the **HTML-based LBE TUI/cockpit in the main LBE workspace**.

Current repo evidence supports this distinction:

- `docs/CURRENT_STATUS.md` marks `lbe-tui/` as `reference-only, untouched`.
- The canonical intent ledger contains `LBE-INTENT-CLINE-SURFACE-DIRECTION-001` amended to the HTML-based LBE TUI.
- The later product-owner correction names `docs/reference/ui/lbe_runtime_console.html` and `docs/reference/ui/lbe_runtime_surface_preview.html` as the visual/layout basis and explicitly treats copied Cline CLI/OpenTUI as reference material for interaction ideas only.

## Main findings

### 1. Canonical UI direction — HTML cockpit in the original workspace

The intended product UI is not the later Rust/Ratatui workspace. The main LBE repository owns the HTML product surface.

Canonical/reference UI basis:

- `docs/reference/ui/lbe_runtime_console.html`
- `docs/reference/ui/lbe_runtime_surface_preview.html`

Reported local implementation seam:

- `.ui-preview/agent_cockpit.html`
- `.ui-preview/lbe_landing_provider_setup.html`
- `server.py` routes `/`, `/cockpit`, `/cockpit.html`, `/workspace/tree`, `/roots`, `/inspect`, `/search`
- governed UI/runtime tests including `tests/test_agent_cockpit_http.py`, `tests/test_governance_drift_guards.py`, `tests/test_runtime_commit_gate_enforcement.py`, and `tests/test_ui_implementation_authority.py`

Classification: **CANONICAL PRODUCT UI DIRECTION / LOCAL IMPLEMENTATION BUILT AND WIRED / UNCOMMITTED COMPLETION NOT YET PROVEN**.

The uncommitted state remains important: intended direction is canonical, but committed acceptance is still required before claiming completion.

### 2. Recovered `LbeAuthorityBridge` — highest-value integration recovery

The quarantined/reference Cline source tree contains LBE-authored integration work:

- `unused-in-repo/cline-cli-reference-copy-2026-08-27/cline-cli/apps/cli/src/runtime/interactive/lbe-authority.ts`
- `unused-in-repo/cline-cli-reference-copy-2026-08-27/cline-cli/apps/cli/src/runtime/interactive/lbe-authority.test.ts`

Reported behavior:

- spawns the Python LBE runtime;
- sends `tool.proposed` / `tools.describe`;
- maps outcomes to `EXECUTED | DENIED | ESCALATED | FAILED`;
- returns LBE receipt/evidence into the interaction loop.

Classification: **LBE-AUTHORED GOVERNED UI INTEGRATION WORK / MISPLACED INSIDE QUARANTINED REFERENCE TREE / HIGH-PRIORITY RECOVERY ASSET**.

Important correction: the surrounding copied Cline CLI/OpenTUI tree is not revived as the product UI. The product direction remains HTML-based. The authored bridge/test should be surfaced, registered, and adapted into the canonical HTML product path rather than discarded as generic reference residue.

### 3. Active runtime Cline worker is separate and must remain untouched

`lbe_guard_inspector/runtime/cline_worker/` remains the tracked governed provider-continuation seam:

- `package.json` / `package-lock.json` pin `@cline/agents@0.0.75` and related packages;
- `worker.mjs` imports `AgentRuntime` / `createAgentRuntime`;
- `lbe_guard_inspector/runtime/cline_stdio_bridge.py` consumes it through `GovernedClineWorker`.

Classification: **ACTIVE / CANONICAL GOVERNED PROVIDER-CONTINUATION / DO NOT TOUCH**.

This runtime worker, the recovered `lbe-authority.ts`, the HTML cockpit, and the later Rust UI are four distinct things.

### 4. `C:\LBE-TUI-Lab` is later UI/reference work, not canonical UI authority

The later Rust/Ratatui workspace is useful as historical UI work, comparison, and reuse-strategy input. It is not the canonical product interface.

The main repo reportedly references it through:

- `docs/acceptance/CURRENT_IMPLEMENTATION_GATE.md` → `C:\LBE-TUI-Lab\Docs\31_cline_interop_reuse_strategy.md`

That cross-workspace reference is acceptable as an input. It does not transfer product/runtime authority.

Classification: **LATER UI-ONLY / REFERENCE / REUSE-INPUT WORKSPACE**.

### 5. Cleanup branches already exist

Reported remotes include:

- `origin/cleanup/remove-redundant-lbe-reference-copies`
- `origin/cleanup/remove-redundant-lbe-reference-copies-v2`

Classification: **EXISTING CLEANUP PATH / NOT PROVEN MERGED**.

Before generic reference-tree cleanup, inspect these branches. Preserve the LBE-authored bridge/test independently of copied reference-code disposition.

### 6. Large branch inventory remains structurally unresolved

The audit reports 100+ branches, including unfinished/product/design/release work.

Classification: **UNCLASSIFIED STRUCTURAL INVENTORY**.

Presence of a branch is not merge authority. Each requires an evidence-backed disposition.

### 7. Protected runtime/state and baseline material remains unclassified

Examples include runtime DBs/backups and `.before-*` / `.baseline-*` snapshots.

Classification: **PROTECTED / RETENTION DECISION PENDING**.

Do not silently delete.

### 8. Stashes contain unreconciled snapshots

Four reported pre-cleanup/reconciliation stashes remain.

Classification: **UNMERGED / DISPOSITION REQUIRED**.

Preserve, recover, or drop only after inspection.

## Correct current status

| Area | Classification |
|---|---|
| Original LBE workspace | CANONICAL RUNTIME + PRODUCT WORKSPACE |
| Canonical UI direction | HTML-BASED LBE TUI / COCKPIT |
| `.ui-preview/agent_cockpit.html` | INTENDED PRODUCT UI / LOCAL BUILT+WIRED / UNCOMMITTED |
| `runtime/cline_worker/` | ACTIVE / CORRECT / DO NOT TOUCH |
| recovered `LbeAuthorityBridge` | LBE-AUTHORED UI INTEGRATION / MISPLACED / HIGH-PRIORITY RECOVERY |
| copied Cline CLI/OpenTUI tree | REFERENCE / QUARANTINED PRODUCT-WISE |
| `C:\LBE-TUI-Lab` | LATER UI-ONLY / REFERENCE / REUSE INPUT |
| cleanup branches | EXIST / NOT PROVEN MERGED |
| 100+ branches | UNCLASSIFIED |
| protected state/backups | RETENTION PENDING |
| stashes | UNRECONCILED |

## Bounded corrective sequence

1. Leave `lbe_guard_inspector/runtime/cline_worker/` unchanged.
2. Treat the HTML cockpit in the original workspace as the canonical UI implementation path.
3. Surface the LBE-authored `lbe-authority.ts` and test from the generic quarantined Cline tree; preserve provenance and register/adapt them as governed UI integration work without reviving Cline/OpenTUI as the product UI.
4. Bind the HTML cockpit, server routes, and governed UI tests to the canonical UI intent; commit and validate under the current machine gate before claiming completion.
5. Reconcile later `LBE-TUI-Lab` docs/status so Rust/Ratatui is explicitly reference/UI/reuse input, not canonical interface authority.
6. Inspect existing cleanup branches, then deduplicate/quarantine copied reference payload while preserving authored LBE integration work.
7. Classify branches, stashes, and protected state/backups separately.
8. Maintain `unused-in-repo/` ownership/disposition validation so authored project code cannot remain silently misclassified.

## Non-negotiable boundary

Do not collapse these four seams:

1. active `runtime/cline_worker/` — governed provider continuation;
2. recovered `lbe-authority.ts` — LBE-authored governed UI integration asset;
3. HTML cockpit — canonical product UI direction;
4. Rust/Ratatui workspace — later UI/reference/reuse input.

The canonical product UI authority remains with the HTML-based LBE TUI in the original workspace.