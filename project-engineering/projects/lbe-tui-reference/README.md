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
3. `RUST_P2P3_DOCUMENTATION_ALIGNMENT_CHECKPOINT_2026-09-02.md` — latest local correction for approval/receipt/evidence/diff implementation versus live acceptance.
4. `status.json` — machine-readable GPT-K projection of current state; where older fields still say receipt/evidence/diff implementation is pending, the newer P2/P3 checkpoint supersedes those fields.
5. `COMPLETION_PLAN_2026-09-02.md` — ordered release-blocking execution plan.
6. `LBE_TUI_INTEGRATION_FEATURE_REQUIREMENTS.md` — durable full product feature specification.
7. Material current checkpoints — bounded corrections/evidence.
8. `HISTORY_AND_SUPERSEDED_RECORDS.md` — stale/historical claims that must not be treated as current blockers.

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

## Latest Rust P2/P3 implementation correction

The latest local documentation alignment reports no runtime code changes and validates the existing Rust client with:

```text
cargo test --quiet       PASS — 193 tests
cargo fmt --check        PASS
cargo check --quiet      PASS
git diff --check         PASS
```

The following are now classified as **IMPLEMENTED / LOCAL TESTED**, not pending implementation:

- tool request/risk/authorization projection;
- authorization-required / ALLOW / DENY handling;
- patch review accept/reject routing;
- typed receipt projection and `/receipts` rendering;
- typed evidence projection and `/evidence` rendering;
- basic diff/change projection.

Their **installed/live acceptance remains open**. Local tests do not prove a real writable mutation, real approval response/resume, authoritative live receipt/evidence chain, installed diff projection, validation/completion, or full P2/P3 acceptance.

The active `workspace.patch` client contract is existing-file replacement only: the target must be an existing regular file. Creating a new temporary file requires a separate LBE-owned create capability if one is registered and available.

## Current product classification

```text
Final product architecture                 ALIGNED
LBE backend authority                      ACCEPTED / PROVEN COMPLETE AT OWNER SCOPE
Rust client foundation                     IMPLEMENTED / PARTIALLY INTEGRATED
Real read-only LBE path                    BOUNDED PROVEN
Rust patch approval client                 IMPLEMENTED / LOCAL TESTED
Tool request/risk/auth projection          IMPLEMENTED / LOCAL TESTED
Receipt projection + /receipts             IMPLEMENTED / LOCAL TESTED
Evidence projection + /evidence             IMPLEMENTED / LOCAL TESTED
Basic diff/change projection               IMPLEMENTED / LOCAL TESTED
Provider continuation backend              ACCEPTED
Credentialed live Rust provider flow       NOT PROVEN / BLOCKED CONFIGURATION
Installed approval response/resume         UNVERIFIED
Writable live mutation acceptance          NOT PROVEN
Installed receipt/evidence/diff acceptance NOT PROVEN
Full file/hunk navigation                   NOT PROVEN
Dedicated permissions/sandbox panel         PENDING
Installed Rust MCP projection              UNVERIFIED
Full MCP governed execution chain          PARTIAL
Persistent Rust session resume             PENDING
Windows ConPTY/PTTY acceptance             MISSING
Installed core CLI E2E                     NOT PROVEN
Project user ready                         NO
Release ready                              NO
Active gate                                OPEN
Publication                                LOCKED
```

Overall:

```text
PARTIALLY COMPLETE / COMPLETION MODE ACTIVE
```

## Current live writable-acceptance blockers

The live mutation attempt did not execute any mutation. Current blockers are:

1. the canonical capability registry expected by the real Rust wrapper is not established in the current configured path;
2. `workspace.patch` requires an existing regular file, so a nonexistent temporary acceptance file is not a valid target;
3. a valid writable session/fixture with an explicit restoration contract is still required before the real authorization -> mutation -> receipt/evidence -> validation/completion chain can be proven.

These are runtime/configuration/acceptance blockers. They are not evidence that the Rust approval, receipt, evidence, or diff client implementation is missing.

## Release-blocking completion work

The required current work is:

1. establish claim-matched real runtime configuration, including the authoritative capability-registry path and usable provider/session configuration;
2. credentialed live Rust -> LBE -> provider execution and assistant continuation;
3. real agent-driven governed read/search tool cycle;
4. installed authorization/approval lifecycle and approval response/resume;
5. real writable `workspace.patch` acceptance against an already-existing disposable file with exact original hash/content and restoration contract;
6. prove exactly-once mutation plus authoritative receipt/evidence/diff/validation/completion through the already-implemented Rust projections;
7. core Rust session lifecycle and persistent resume;
8. provider/model discovery, selection, configuration/auth/health projection;
9. live registered tool/capability projection;
10. non-empty MCP registry projection and one governed external/MCP invocation;
11. complete MCP acceptance chain: rejection, endpoint restrictions, authorization ordering, exactly-once execution, receipt/evidence, continuation, persistence, malformed/identity mismatch rejection, and Rust display;
12. reusable Windows ConPTY/PTTY installed-test harness;
13. full installed CLI E2E acceptance;
14. final Rust and relevant LBE regressions with exact observed evidence.

Do not duplicate locally implemented approval/receipt/evidence/diff UI while those live proofs are being established.

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

Backend governed external-capability registration and installed registry discovery are accepted at their recorded scope, but installed Rust/MCP product proof is not complete.

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
- Rust governed patch-approval client state machine;
- Rust receipt/evidence rendering paths;
- Rust basic diff/change projection.

## Non-blocking broader product features

Unless they break normal use, these remain after first manual user-test readiness:

- headless/CI JSON mode;
- advanced evidence/receipt browsers beyond the implemented basic renderers;
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
