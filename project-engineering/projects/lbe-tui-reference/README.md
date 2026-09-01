# LBE Rust/Ratatui CLI — Current Project Truth

**Classification:** REFERENCE_NON_CANONICAL  
**Purpose:** Single entry point for the current LBE Rust/Ratatui integration goal, authority boundary, accepted proof, active work, and historical records.

## Goal

Finish the native LetterBlack Rust/Ratatui CLI as a usable client over the already-complete LBE backend. Do not rebuild backend owners that already exist.

```text
LetterBlack Rust/Ratatui CLI
        ↓
LbeWrapper / RealLbeWrapper
        ↓
canonical LBE runtime
        ↓
sessions, providers, tools, authorization,
execution, evidence, ToolReceipts,
persistence, validation, completion truth
```

Completion mode means: finish the missing Rust client projections and installed acceptance required for a usable CLI; defer non-critical polish and advanced roadmap items until after usable completion.

## Active Completion Plan

The active execution plan is:

`COMPLETION_PLAN_2026-09-02.md`

This plan is the current completion-mode direction for reaching:

```text
WORKING INSTALLED LETTERBLACK CLI — READY FOR USER TESTING
```

Do not substitute older handoff documents, early read-only sequencing, or general architecture rediscovery for this completion plan unless new canonical evidence proves the plan unsafe or invalid.

## Authority rule

```text
Provider reasons.
LBE governs.
Registered capabilities execute.
Evidence and ToolReceipts persist.
Validation decides completion.
Rust projects the result.
```

Rust/Ratatui must not become a second runtime, authorization owner, tool executor, MCP transport owner, provider registry, evidence owner, receipt owner, persistence owner, or completion authority.

The real agent/tool continuation spine remains LBE-owned:

```text
Rust user prompt
    ↓
RealLbeWrapper
    ↓
LBE provider/runtime
    ↓
LBE authorization + governed tool/MCP execution
    ↓
LBE evidence + ToolReceipt
    ↓
LBE provider continuation + completion
    ↓
Rust event/projection
```

Do not implement a second Rust-owned agent loop or MCP transport to achieve product completion.

## Current authoritative governance interpretation

The committed remote LBE machine gate is the present governance authority. It currently records:

```text
active_phase: P2_P3_GOVERNED_EXECUTION
active_slice: TUI_P2_P3_GOVERNED_EXECUTION_INTEGRATION
status: OPEN
implementation_allowed: true
next_phase_locked: true
publication: LOCKED
```

The human-readable gate has been observed to lag behind this machine state and describe the older workspace-hygiene slice. Treat that as a governance projection mismatch to reconcile, not as proof that TUI P2/P3 is unauthorized. The machine JSON and current repository/runtime evidence outrank stale human-readable projections.

## Accepted LBE baseline

```text
LBE runtime/backend authority             PROVEN_COMPLETE
LBE CLI                                  PROVEN_COMPLETE
R3-R6F                                   PROVEN_COMPLETE
R7 installed end-to-end acceptance       PASS
workspace-hygiene governed deletion      PASS
mandatory governed mutation dispatch     PASS
governed external capability registration PASS
installed capability registry discovery  PASS
publication precheck                      PASS
```

This means the remaining product work is primarily Rust client integration and installed acceptance, not backend reconstruction.

## Rust integration already proven

```text
RealLbeWrapper boundary                  IMPLEMENTED
attach/disconnect/reconnect projection   IMPLEMENTED + TESTED
live read/list/glob/search               BOUNDED PROVEN
read-only mutation denial                PROVEN
MCP metadata bridge                      PROVEN
MCP registry refresh                     PROVEN
/mcp metadata projection                 IMPLEMENTED
governed patch approval client flow      IMPLEMENTED + LOCAL TESTED
```

The governed patch-approval client now waits for LBE authorization before submitting `workspace.patch`, handles ALLOW/DENY/REQUIRE_APPROVAL/ESCALATE safely, rejects foreign/duplicate authorization release, clears pending mutation state on disconnect, and does not mark the patch as running before authorization acceptance.

The MCP bridge remains metadata-only. Rust does not own MCP transport, execution, authorization, credentials, registry authority, receipts, or evidence.

## Remaining work for a usable CLI

The active plan orders the remaining release-blocking work as:

1. real provider/agent continuation through LBE;
2. real agent-driven read-only tool-call continuation;
3. real writable patch acceptance through the already-implemented approval flow;
4. structured evidence/ToolReceipt projection;
5. basic real workspace diff/patch review;
6. core session lifecycle + persistence/resume;
7. provider/model surface completion;
8. live registered-tool/capability projection;
9. non-empty MCP registry + governed external capability acceptance;
10. reusable Windows ConPTY/PTTY harness;
11. installed end-to-end CLI acceptance.

External blockers must not stop independent completion work. If real writable-session, non-empty registry, or terminal-harness evidence is temporarily unavailable, continue every independent required client seam.

## Important sequencing corrections

The following older directions are not current blockers:

- Do not freeze the project at read-only completion before mutation; the governed patch-approval client is already implemented locally.
- Do not make headless/JSON mode a prerequisite for first manual user-test readiness.
- Do not build Rust-side MCP transport just because `/mcp` is metadata-only; MCP execution remains LBE-owned.
- Do not build a duplicate Rust agent runtime; provider/tool continuation must reuse the existing LBE runtime.
- Do not restart broad UI or architecture audits while required normal-use seams can be completed from existing contracts.

## Post-completion / non-blocking unless they break normal use

- headless/CI JSON mode;
- NO_COLOR refinements;
- ASCII/wide-character edge-case polish;
- advanced evidence-browser UX;
- advanced receipt-browser UX;
- background-process dashboard;
- subagent/team UX;
- schedules/connectors expansion;
- advanced code-search UI;
- optional visual polish and exhaustive edge-case coverage.

## Completion decision rule

```text
NOT_PROVEN + required for usable CLI
    → implement/test it

NOT_PROVEN + optional polish
    → record follow-up and continue

actual external blocker
    → report blocker and continue independent required work

safe uncertainty resolvable from existing contracts
    → resolve and continue
```

Do not restart broad architecture discovery, MCP redesign, or wrapper reimplementation when the existing owner/contract is already proven.

## Current evidence routing

Read in this order:

1. `README.md` — current project goal and authority boundary.
2. `COMPLETION_PLAN_2026-09-02.md` — active completion-mode execution plan.
3. `status.json` — machine-readable current projection.
4. `LBE_TUI_INTEGRATION_FEATURE_REQUIREMENTS.md` — durable product requirements.
5. `LBE_TUI_CURRENT_STATUS_AND_IMPLEMENTATION_PLAN_2026-08-29.md` — bounded historical integration evidence; some counts/sequencing are superseded.
6. `LBE_TUI_AUTHORITY_AND_FINDING_RECORD_2026-08-30.md` — authority/truth methodology.
7. `HISTORY_AND_SUPERSEDED_RECORDS.md` — older checkpoint claims that must not be treated as current blockers.

Canonical truth still comes from the LBE machine gate, active source/runtime evidence, acceptance records, local workspace evidence, and GitHub repository state.

## Reference-only supporting records

- `BIRDEYE_REFERENCE_BOUNDARY_2026-09-01.md` — BirdEye reuse/reference boundary only.
- `CLINE_MCP_ACTIVE_SERVER_CHECKPOINT_2026-09-01.md` — external client MCP environment checkpoint only.
- `LBE_TUI_PROJECT_TRUTH_ATTACHMENT_CHECKPOINT_2026-08-29.md` — historical P1 attachment proof.
- Cline — reference only for provider/session/tool/approval/MCP/diff interaction mechanics.
- OpenCode — reference only for CLI/UX mechanics; never authority.

These records are useful context but must not override current project truth.

## Stop condition for discovery loops

The architecture and product goal are already clear. Future work should not stop for another general review unless new evidence shows one of the following:

- a second authority would be created;
- user data could be lost or corrupted;
- the machine gate forbids the intended mutation;
- a required canonical owner or contract genuinely does not exist;
- an irreversible governance decision is ambiguous.

Otherwise continue until the installed LetterBlack CLI is ready for manual user testing.
