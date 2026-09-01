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

The human-readable gate has been observed to lag behind this machine state and describe the older workspace-hygiene slice. Treat that as a **governance projection mismatch to reconcile**, not as proof that TUI P2/P3 is unauthorized. The machine JSON and current repository/runtime evidence outrank stale human-readable projections.

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
Rust regression                          PASS — 178 tests
TUI checkpoint                           6421726, pushed on main
```

The MCP bridge remains metadata-only. Rust does not own MCP transport, execution, authorization, credentials, registry authority, receipts, or evidence.

## Remaining work for a usable CLI

### Release-blocking / completion work

1. Reconcile the human-readable LBE governance projection to the committed machine gate and push the focused governance correction.
2. Finish the required P2/P3 Rust client integration through existing LBE owners.
3. Provide a real authorized non-empty installed capability registry case for `/mcp` acceptance.
4. Add a reusable Windows ConPTY/PTY installed-test harness.
5. Prove installed `/mcp` end to end with a registered capability.
6. Prove core real session/provider/tool/approval/receipt/evidence flows required for normal CLI use.
7. Prove basic persistent session resume.
8. Run final Rust + LBE regressions and installed CLI acceptance.
9. Commit/push focused completion changes and close the active gate only with claim-matched evidence.

### Important client surfaces still partial/pending

- live session service/event integration;
- provider/model live catalog and configuration projection;
- live tool-registry projection;
- typed evidence and receipt detail views;
- diff/patch review UI;
- basic persistent-session integration;
- installed PTY/ConPTY lifecycle proof.

### Post-completion / non-blocking unless they break normal use

- NO_COLOR refinements;
- ASCII/wide-character edge-case polish;
- advanced evidence-browser UX;
- advanced receipt-browser UX;
- background-process dashboard;
- headless/CI JSON mode;
- subagent/team UX;
- advanced code-search UI;
- optional visual polish and exhaustive edge-case coverage.

## Completion decision rule

```text
NOT_PROVEN + required for usable CLI
    → implement/test it

NOT_PROVEN + optional polish
    → record follow-up and continue

actual external blocker
    → report blocker

safe uncertainty resolvable from existing contracts
    → resolve and continue
```

Do not restart broad architecture discovery, MCP redesign, or wrapper reimplementation when the existing owner/contract is already proven.

## Current evidence routing

Read in this order:

1. `README.md` — current project goal, ownership, completion path.
2. `status.json` — machine-readable current projection.
3. `LBE_TUI_INTEGRATION_FEATURE_REQUIREMENTS.md` — durable product requirements.
4. `LBE_TUI_CURRENT_STATUS_AND_IMPLEMENTATION_PLAN_2026-08-29.md` — bounded live integration evidence; some test counts are historical.
5. `LBE_TUI_AUTHORITY_AND_FINDING_RECORD_2026-08-30.md` — authority/truth methodology.
6. `HISTORY_AND_SUPERSEDED_RECORDS.md` — which older checkpoint claims must not be treated as current blockers.

Canonical truth still comes from the LBE machine gate, active source/runtime evidence, acceptance records, and GitHub repository state.

## Reference-only supporting records

- `BIRDEYE_REFERENCE_BOUNDARY_2026-09-01.md` — BirdEye reuse/reference boundary only.
- `CLINE_MCP_ACTIVE_SERVER_CHECKPOINT_2026-09-01.md` — external client MCP environment checkpoint only.
- `LBE_TUI_PROJECT_TRUTH_ATTACHMENT_CHECKPOINT_2026-08-29.md` — historical P1 attachment proof.

These records are useful context but must not override current project truth.

## Stop condition for discovery loops

The architecture and product goal are already clear. Future work should not stop for another general review unless new evidence shows one of the following:

- a second authority would be created;
- user data could be lost or corrupted;
- the machine gate forbids the intended mutation;
- a required canonical owner or contract genuinely does not exist;
- an irreversible governance decision is ambiguous.

Otherwise continue toward usable CLI completion.