# LBE Rust/Ratatui CLI — Current Project Truth

**Classification:** REFERENCE_NON_CANONICAL  
**Purpose:** Entry point for final-product intent, authority boundaries, current evidence, release-blocking gaps, and historical/reference routing.

## Final product

Build a native LetterBlack Rust/Ratatui terminal agent workspace as a client over the canonical LBE runtime.

```text
LetterBlack Rust/Ratatui CLI
        ↓
LbeWrapper / RealLbeWrapper
        ↓
canonical LBE runtime
        ↓
sessions, provider/model continuation, tools,
authorization, governed execution, MCP/external
capabilities, evidence, ToolReceipts,
persistence/recovery, validation, completion truth
```

Authority rule:

```text
Provider/agent reasons.
LBE governs.
Registered capabilities execute.
Evidence and ToolReceipts persist.
Validation decides completion.
Rust projects the result.
```

Rust must not become a second provider/agent runtime, authorization owner, tool executor, MCP transport owner, evidence/receipt authority, persistence owner, validation owner, or completion authority.

## Read order

Use this order for every future implementation/status decision:

1. `README.md` — routing and current project identity.
2. `FINAL_PRODUCT_STRUCTURE_AND_GAP_MATRIX_2026-09-02.md` — complete product structure, feature inventory, authority map, current match, and gaps.
3. `status.json` — machine-readable GPT-K projection of current state.
4. `COMPLETION_PLAN_2026-09-02.md` — ordered release-blocking execution plan.
5. `LBE_TUI_INTEGRATION_FEATURE_REQUIREMENTS.md` — durable full product feature specification.
6. Material current checkpoints — bounded corrections/evidence.
7. `HISTORY_AND_SUPERSEDED_RECORDS.md` — stale/historical claims that must not be treated as current blockers.

GPT-K is projection/reference only. Canonical LBE machine governance, current source/runtime evidence, active acceptance records, current Rust/LBE repository evidence, and claim-matched installed evidence outrank GPT-K.

## Current canonical governance projection

At LBE revision `3c615252d517ade8942ca014696906e50a7e8e4d`:

```text
active_phase: P2_P3_GOVERNED_EXECUTION
active_slice: TUI_P2_P3_GOVERNED_EXECUTION_INTEGRATION
status: OPEN
implementation_allowed: true
next_phase_locked: true
publication: LOCKED
```

Active intent:

`LBE-INTENT-TUI-P2P3-GOVERNED-INTEGRATION-001`

The machine gate outranks stale human-readable closed-state wording. A nested historical `closure.status = CLOSED` records the previously completed slice and does not close the current top-level TUI/P2P3 gate.

## Current product classification

```text
Final product architecture              ALIGNED
LBE backend authority                   ACCEPTED / PROVEN COMPLETE AT OWNER SCOPE
Rust client foundation                  IMPLEMENTED / PARTIALLY INTEGRATED
Real read-only LBE path                 BOUNDED PROVEN
Rust patch approval client              IMPLEMENTED / LOCAL TESTED
Provider continuation backend           ACCEPTED
Credentialed live Rust provider flow    NOT PROVEN
Installed Rust MCP projection           UNVERIFIED
Full MCP governed execution chain       PARTIAL
Writable live mutation acceptance       PENDING
Receipt/evidence interactive projection PARTIAL / PENDING
Real diff review                        PENDING
Persistent Rust session resume          PENDING
Windows ConPTY/PTTY acceptance          MISSING
Installed core CLI E2E                  NOT PROVEN
Project user ready                      NO
Release ready                           NO
Active gate                             OPEN
Publication                             LOCKED
```

Overall:

```text
PARTIALLY COMPLETE / COMPLETION MODE ACTIVE
```

## Release-blocking completion work

The required current work is:

1. credentialed live Rust -> LBE -> provider execution and assistant continuation;
2. real agent-driven governed read/search tool cycle;
3. installed authorization/approval lifecycle and approval response/resume;
4. real writable `workspace.patch` acceptance through the existing Rust approval gate;
5. interactive evidence/ToolReceipt projection with operation/turn/tool correlation;
6. basic real diff/patch review linked to authorization, receipt/evidence, and validation;
7. core Rust session lifecycle and persistent resume;
8. provider/model discovery, selection, configuration/auth/health projection;
9. live registered tool/capability projection;
10. non-empty MCP registry projection and one governed external/MCP invocation;
11. complete MCP acceptance chain: rejection, endpoint restrictions, authorization ordering, exactly-once execution, receipt/evidence, continuation, persistence, malformed/identity mismatch rejection, and Rust display;
12. reusable Windows ConPTY/PTTY installed-test harness;
13. full installed CLI E2E acceptance;
14. final Rust and relevant LBE regressions with exact observed evidence.

Do not leave completion mode until the normal-use installed chain is proven or a genuine external blocker remains after all independent work is complete.

## Current MCP truth

The LBE 12-point MCP/TUI acceptance gate remains OPEN:

```text
registered MCP server in TUI                  UNVERIFIED
unregistered capability rejection             PARTIAL
endpoint/command/shell restriction             PARTIAL
MCP proposal reaches LBE                      PARTIAL
authorization before execution                PARTIAL
denied execution count = 0                    PARTIAL
allowed execution exactly once                PARTIAL
receipt/evidence correlation                  PARTIAL
provider receives governed result             PARTIAL
complete persisted MCP event stream           UNVERIFIED
Rust displays events without local authority  UNVERIFIED
malformed/identity mismatch fails closed       PARTIAL
```

Backend governed external-capability registration and installed registry discovery are accepted, but installed Rust/MCP product proof is not complete.

## Documentation/governance reconciliation

A current local LBE audit reports two documentation-governance gaps:

1. ten current non-history Markdown files are absent from `docs/DOCUMENT_INTENT_MANIFEST.md`;
2. stale closed-state prose remains in `COMPLETE_LBE_AGENT_RUNTIME_GATE.md` and an earlier section of `CURRENT_STATUS.md`, while machine governance and `CURRENT_IMPLEMENTATION_GATE.md` are OPEN for the TUI P2/P3 slice.

Treat this as documentation reconciliation, not as proof of backend regression. Machine governance/current acceptance evidence outrank stale prose.

BirdEye operational validation currently records a full registry scan as IN PROGRESS and the second unchanged scan/SHA-reuse check as NOT RUN; those do not prove MCP/LBE execution acceptance.

## Accepted owners — do not rebuild

Do not recreate unless newer canonical evidence proves a missing owner:

- LBE authorization/policy;
- ToolRegistry / GovernedToolOrchestrator;
- governed workspace operations and mutation ownership;
- provider continuation backend;
- governed external capability/MCP registration;
- evidence/ToolReceipt ownership;
- session persistence/recovery;
- validation/completion authority;
- `RealLbeWrapper` boundary;
- bounded live read/list/glob/search;
- Rust MCP metadata bridge/refresh;
- Rust governed patch-approval client state machine.

## Non-blocking broader product features

Unless they break normal use, these remain after first manual user-test readiness:

- headless/CI JSON mode;
- advanced evidence/receipt browsers;
- advanced checkpoint/undo UX;
- broad `@` context UX;
- subagents/teams/background work;
- schedules/connectors expansion;
- broad rules/skills/hooks management UX;
- advanced code-search UI;
- process dashboard;
- optional visual/accessibility polish;
- Documentation Companion runtime integration.

The isolated Documentation Companion is implemented/tested as optional code but is not runtime-integrated and must not distract the active CLI completion slice.

## Reference role

- **Cline:** reusable provider/session/tool/approval/MCP/diff interaction mechanics only.
- **OpenCode:** CLI/UX ideas only.
- **BirdEye:** local evidence/codebase capability patterns and registered capability use where LBE exposes them.

None replaces LBE authority or branding.

## Stop condition for rediscovery

Do not restart a broad architecture review unless current evidence shows:

- a second authority would be created;
- user data could be lost/corrupted;
- the machine gate forbids the intended change;
- a required canonical owner/contract genuinely does not exist;
- an irreversible governance decision is ambiguous.

Otherwise continue toward:

```text
WORKING INSTALLED LETTERBLACK CLI — READY FOR USER TESTING
```
