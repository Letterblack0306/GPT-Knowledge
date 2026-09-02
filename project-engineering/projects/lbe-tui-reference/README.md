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
BirdEye searches/indexes through its MCP service.
Evidence and ToolReceipts persist through LBE.
Validation decides completion.
Rust projects the result.
```

Rust must not become a second provider/agent runtime, authorization owner, tool executor, MCP transport owner, evidence/receipt authority, persistence owner, validation owner, or completion authority.

## Read order

Use this order for every future implementation/status decision:

1. `README.md` — routing and current project identity.
2. `FINAL_PRODUCT_STRUCTURE_AND_GAP_MATRIX_2026-09-02.md` — complete product structure and feature/gap map.
3. `status.json` — machine-readable current GPT-K projection.
4. `GOVERNED_BIRDEYE_MCP_ROUTING_CHECKPOINT_2026-09-02.md` — latest MCP implementation checkpoint and pushed commit identities.
5. `RUST_P2P3_DOCUMENTATION_ALIGNMENT_CHECKPOINT_2026-09-02.md` — approval/receipt/evidence/diff local implementation correction.
6. `COMPLETION_PLAN_2026-09-02.md` — ordered release-blocking execution plan.
7. `LBE_TUI_INTEGRATION_FEATURE_REQUIREMENTS.md` — durable full-product feature specification.
8. Material current checkpoints.
9. `HISTORY_AND_SUPERSEDED_RECORDS.md` — stale/historical claims that must not be treated as current blockers.

GPT-K is projection/reference only. Canonical LBE machine governance, current source/runtime evidence, active acceptance records, current Rust/LBE repository evidence, and claim-matched installed evidence outrank GPT-K.

## Latest verified pushed implementation

### Rust client

Repository: `Letterblack0306/LBE_Agents_wall_Intigration`

```text
commit  4be395a9dba52fa335151184bb84455931cd299b
message Route BirdEye MCP through governed LBE path
branch  main
```

The commit exists on GitHub and the local report states `HEAD == origin/main`.

### LBE runtime

Repository: `Letterblack0306/LBE_Presistent_Agent_wall`

```text
commit  5c3f24ca709b3b554eb24a75de5f787cb693a263
message Add governed BirdEye MCP capability routing
branch  main
```

The commit exists on GitHub. The local report states `HEAD == origin/main`, the LBE scoped worktree is clean, and the implementation-gate/canonical-main-worktree checks passed.

## Governed BirdEye MCP architecture

The current implementation is now:

```text
Rust/TUI
→ RealLbeWrapper
→ lbe_guard_inspector.product_entry tool mcp.birdeye.<tool>
→ LBE ToolRegistry
→ GovernedToolOrchestrator
→ LBE authorization
→ BirdEye stdio handler
→ C:\MCP Local\Letterblack_BirdEye\mcp_server.py
→ BirdEye result
→ LBE ToolReceipt + evidence envelope
→ Rust projection
```

Rust no longer directly owns BirdEye MCP execution.

### BirdEye owns

- BirdEye MCP service implementation;
- SHA-256 hashing used by BirdEye;
- SQLite indexing/search;
- freshness/cache/index lifecycle;
- BirdEye result production.

### LBE owns

- capability registration;
- authorization/policy;
- governed invocation;
- operation-id idempotency;
- canonical ToolReceipt/evidence correlation;
- persistence;
- provider continuation;
- validation/completion truth.

### Rust owns

- typed requests/adapters;
- interaction;
- projection of the LBE-generated operation/status/authorization/result/receipt/evidence envelope.

Do not reintroduce direct BirdEye MCP execution into Rust.

## Current local implementation proof

Recorded validation for the governed BirdEye routing implementation:

```text
LBE focused regression                 PASS — 75
Rust full regression                   PASS — 205
Rust cargo check                       PASS
Python compileall                      PASS
BirdEye Rust tests                     PASS — 5
Real-wrapper MCP registry test         PASS
Real-wrapper receipt/evidence test     PASS
cargo fmt -- --check                   BLOCKED by pre-existing unrelated formatting drift
```

This proves implementation/local integration at the stated scope. It does not prove installed live MCP acceptance.

The Rust approval/receipt/evidence/basic-diff paths also remain implemented/local-tested. Do not reimplement them merely because their installed acceptance is still open.

## Current product classification

```text
Final product architecture                    ALIGNED
LBE backend authority                         ACCEPTED / PROVEN AT OWNER SCOPE
Rust client foundation                        IMPLEMENTED / PARTIALLY INTEGRATED
Real read-only LBE path                       BOUNDED PROVEN
Rust patch approval client                    IMPLEMENTED / LOCAL TESTED
Receipt/evidence/basic diff projection        IMPLEMENTED / LOCAL TESTED
Governed BirdEye MCP routing                  IMPLEMENTED / LOCAL VERIFIED / PUSHED
Rust direct BirdEye execution                 REMOVED
Credentialed live Rust provider flow          NOT PROVEN
Writable live mutation acceptance             NOT PROVEN
Installed approval response/resume            UNVERIFIED
Installed BirdEye registry presence           UNVERIFIED
Live MCP DENY zero-execution                   UNVERIFIED
Live MCP ALLOW exactly-once                    UNVERIFIED
Live MCP persisted event ordering             UNVERIFIED
Live provider continuation via BirdEye        UNVERIFIED
Installed Rust/TUI MCP acceptance             UNVERIFIED
Persistent Rust session resume                PENDING
Windows ConPTY/PTTY acceptance                MISSING
Installed core CLI E2E                        NOT PROVEN
Project user ready                            NO
Release ready                                 NO
Active P2/P3 gate                             OPEN
Publication                                   LOCKED
```

Overall:

```text
PARTIALLY COMPLETE / COMPLETION MODE ACTIVE
```

## MCP gate: what changed versus what remains

### Closed at implementation/local-proof scope

- Rust no longer launches BirdEye directly.
- `mcp.birdeye.<tool>` routes through the LBE tool command.
- LBE exposes bounded BirdEye ToolSpecs/handlers behind ToolRegistry/GovernedToolOrchestrator.
- LBE authorization precedes the BirdEye handler at local owner-test scope.
- unregistered capability rejection remains fail-closed at local owner-test scope.
- Rust consumes LBE-generated status/authorization/result/receipt/evidence values.
- operation-id idempotency remains LBE-owned.

### Still required for live/installed closure

1. resolve/materialize the canonical installed capability registry;
2. prove BirdEye registration in that actual registry;
3. prove `DENY` causes zero BirdEye invocations;
4. prove `ALLOW` causes exactly one BirdEye invocation;
5. capture proposal -> authorization -> execution -> result -> ToolReceipt/evidence ordering;
6. prove complete MCP lifecycle persistence in the LBE session stream;
7. prove provider continuation using the live BirdEye result;
8. converge with the separate UI agent for UI-dependent event projection;
9. run installed Rust/TUI MCP end-to-end acceptance.

The MCP/P2P3 gate therefore remains OPEN. Do not convert the 75/205 local test results into an installed PASS.

## Parallel UI ownership

A separate UI agent owns UI implementation. Backend/integration work must continue independently.

Do not duplicate UI implementation here. Only UI-dependent projection and installed UI acceptance wait for the shared compilable UI baseline.

## Current live writable-acceptance blockers

The real writable `workspace.patch` acceptance remains separate from MCP routing. Known constraints include:

- `workspace.patch` is existing-regular-file replacement only;
- a safe existing disposable file and exact restoration contract are required;
- real approval/resume/mutation/receipt/evidence/validation must be observed before PASS.

Do not create a second file-create path merely to satisfy the acceptance test.

## Release-blocking completion work

Current required work includes:

1. claim-matched real provider/session/runtime configuration;
2. real provider execution and assistant continuation;
3. real agent-driven governed read/search cycle;
4. installed authorization/approval response/resume;
5. real reversible writable `workspace.patch` acceptance;
6. core session lifecycle and persistent resume;
7. provider/model normal-use acceptance;
8. canonical installed capability registry with BirdEye registration;
9. live MCP DENY zero-execution proof;
10. live MCP ALLOW exactly-once proof;
11. live MCP ToolReceipt/evidence correlation and persistence;
12. live provider continuation through BirdEye result;
13. UI-dependent MCP projection after UI-agent convergence;
14. reusable Windows ConPTY/PTTY installed-test harness;
15. full installed CLI E2E acceptance;
16. final exact Rust/LBE regressions.

## Accepted owners — do not rebuild

Do not recreate unless newer canonical evidence proves a missing owner:

- LBE authorization/policy;
- ToolRegistry / GovernedToolOrchestrator;
- governed workspace mutation ownership;
- provider continuation backend;
- governed external capability registration;
- evidence/ToolReceipt ownership;
- session persistence/recovery;
- validation/completion authority;
- `RealLbeWrapper` boundary;
- bounded live read/list/glob/search;
- Rust governed patch-approval client state machine;
- Rust receipt/evidence/basic diff projections;
- governed LBE -> BirdEye MCP routing added by the 2026-09-02 commits.

## Non-blocking broader product features

Unless they break normal use, keep these after first manual user-test readiness:

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

## Reference role

- **Cline:** provider/session/tool/approval/MCP/diff mechanics reference only.
- **OpenCode:** CLI/UX ideas only.
- **BirdEye:** actual MCP search/index service behind the LBE-governed capability boundary.

None replaces LBE authority or LetterBlack branding.

## Stop condition for rediscovery

Do not restart broad architecture discovery unless current evidence shows:

- a second authority would be created;
- user data could be lost/corrupted;
- the machine gate forbids the intended change;
- a required canonical owner/contract genuinely does not exist;
- an irreversible governance decision is ambiguous.

Otherwise continue toward:

```text
WORKING INSTALLED LETTERBLACK CLI — READY FOR USER TESTING
```
