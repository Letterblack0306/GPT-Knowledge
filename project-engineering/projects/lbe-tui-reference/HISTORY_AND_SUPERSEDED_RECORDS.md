# LBE TUI — History and Superseded Records

**Classification:** REFERENCE_NON_CANONICAL  
**Purpose:** Preserve older evidence without allowing stale blockers or old topology claims to override current project truth.

## Current-routing rule

For present-state decisions, read `README.md` and `status.json` first. Older records below are bounded historical evidence only.

```text
current machine governance
  > current source/runtime evidence
  > current GitHub repository state
  > current GPT-K status projection
  > older GPT-K checkpoints
```

Historical records remain useful for proving what was true at a specific earlier revision. They must not be treated as current blockers unless revalidated.

## Superseded blocker records

### `LBE_TUI_MCP_BLOCKED_ENVIRONMENT_CHECKPOINT_2026-09-01.md`

Historical only.

Superseded claims include:

- Rust formatting blocked by mapped-file lock;
- required runtime bindings unavailable;
- MCP wrapper live refresh blocked by environment configuration.

Current replacement truth:

```text
Rust formatting              PASS
Rust tests                   PASS — 178
RealLbeWrapper MCP refresh   PROVEN
MCP metadata bridge          PROVEN
Installed /mcp PTY/E2E       NOT PROVEN
ConPTY/PTTY harness          MISSING
```

The only MCP-specific acceptance gap is installed terminal proof with a real non-empty authorized capability registry; do not repeat the old environment-blocker loop.

### `LBE_TUI_AUDIT_WRAPPER_COVERAGE_AND_REMAINING_INTEGRATION.md`

Historical pre-integration snapshot.

Superseded claims include:

- active binary was a placeholder;
- zero Rust tests discovered;
- `RealLbeWrapper` not implemented;
- MCP registry merely placeholder;
- live LBE attachment absent.

Those claims were valid only for the earlier recorded revision. Current Rust state has a real wrapper boundary, live bounded attachment evidence, MCP metadata projection, and 178 passing Rust tests.

### `LBE_TUI_PROJECT_TRUTH_ATTACHMENT_CHECKPOINT_2026-08-29.md`

Historical P1 proof. Keep as bounded evidence that the initial read-only project-truth attachment worked. Its listed remaining gaps are not automatically current gaps; use current `status.json` instead.

## Historical but still useful records

### `LBE_TUI_CURRENT_STATUS_AND_IMPLEMENTATION_PLAN_2026-08-29.md`

Useful for bounded live-flow proof including provider round-trip, read-only governed workspace execution, authorization-before-execution, ToolReceipt/evidence correlation, and fail-closed mutation denial.

Do not use its old Rust test count or old "what remains" list as the current completion checklist.

### `LBE_TUI_AUTHORITY_AND_FINDING_RECORD_2026-08-30.md`

Still useful for the authority model and evidence hierarchy:

```text
Provider reasons.
LBE governs.
Registered capabilities execute.
Evidence and receipts persist.
Validation decides completion.
The interface projects the result.
```

Its general governance methodology remains valid, but current gate identity must always come from the active machine gate.

### `BIRDEYE_REFERENCE_BOUNDARY_2026-09-01.md`

Reference architecture only. BirdEye may inform evidence/index design but must not become an LBE execution, authorization, receipt, evidence, session, or completion owner.

### `CLINE_MCP_ACTIVE_SERVER_CHECKPOINT_2026-09-01.md`

External-client environment checkpoint only. It does not define the Rust CLI architecture or LBE governance state.

## Durable product specification

`LBE_TUI_INTEGRATION_FEATURE_REQUIREMENTS.md` remains the durable feature/interaction specification. It describes intended product capability, not proof that every capability is already integrated.

Use this distinction:

```text
feature requirement document = target behavior
status.json                  = current projected state
acceptance evidence          = bounded proof
machine gate                 = current implementation authorization
```

## Current completion focus

The project goal is no longer discovery. It is usable CLI completion over existing LBE owners.

Current focus:

1. reconcile the human-readable governance projection to the committed machine gate;
2. continue authorized TUI P2/P3 integration;
3. add real non-empty capability-registry acceptance case;
4. add reusable Windows ConPTY/PTTY harness;
5. prove installed `/mcp` and core CLI lifecycle;
6. finish minimum session/provider/tool/receipt/evidence projections required for normal use;
7. run final acceptance and close the gate with evidence.

Optional polish and advanced roadmap features should not re-enter the critical path unless they prevent normal CLI use.

## Anti-loop rule

Do not reopen an old blocker solely because an older GPT-K file contains it. First check `README.md`, `status.json`, current machine governance, and current source/runtime evidence.

If a historical claim conflicts with stronger current evidence, classify it as `SUPERSEDED` or `HISTORICAL`, preserve the record, and continue.