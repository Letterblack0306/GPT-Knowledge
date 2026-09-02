# Governed BirdEye MCP Routing Checkpoint — 2026-09-02

**Classification:** IMPLEMENTED / LOCAL VERIFIED / PUSHED — INSTALLED LIVE ACCEPTANCE OPEN

## Scope

This checkpoint records the implementation that removes direct BirdEye MCP execution from the Rust client and routes BirdEye capability calls through the canonical LBE governance path.

## Verified pushed commits

### Rust client

Repository: `Letterblack0306/LBE_Agents_wall_Intigration`

- Commit: `4be395a9dba52fa335151184bb84455931cd299b`
- Message: `Route BirdEye MCP through governed LBE path`
- Branch: `main`
- Remote state: user reported and GitHub commit verified; commit exists on the canonical repository.

### LBE runtime

Repository: `Letterblack0306/LBE_Presistent_Agent_wall`

- Commit: `5c3f24ca709b3b554eb24a75de5f787cb693a263`
- Message: `Add governed BirdEye MCP capability routing`
- Branch: `main`
- Remote state: user reported HEAD == origin/main; GitHub commit verified.
- Repository implementation-gate and canonical-main-worktree checks: PASS, user reported.

## Architecture after this change

```text
Rust/TUI
  -> RealLbeWrapper
  -> lbe_guard_inspector.product_entry tool mcp.birdeye.<tool>
  -> LBE ToolRegistry
  -> GovernedToolOrchestrator
  -> LBE authorization
  -> BirdEye stdio handler
  -> BirdEye MCP server
  -> BirdEye result
  -> LBE ToolReceipt + evidence
  -> LBE result envelope
  -> Rust projection
```

The live BirdEye MCP implementation remains:

`C:\MCP Local\Letterblack_BirdEye\mcp_server.py`

## LBE implementation

Updated canonical LBE owners include:

- `lbe_guard_inspector/runtime/external_capabilities.py`
  - bounded `mcp.birdeye.<tool>` ToolSpec creation;
  - BirdEye stdio handler behind existing LBE ToolRegistry / GovernedToolOrchestrator;
  - existing LBE authorization, idempotency, ToolReceipt and evidence ownership retained.

- `lbe_guard_inspector/product_entry.py`
  - external MCP tool dispatch through the existing `lbe tool` command;
  - JSON argument support for external capability invocation;
  - unregistered tools continue to fail through the governed registry path.

## Rust implementation

Updated:

- `C:\LBE-TUI-Lab\src\wrapper.rs`

The Rust RealLbeWrapper no longer launches BirdEye MCP directly.

BirdEye requests now invoke:

```text
lbe_guard_inspector.product_entry tool mcp.birdeye.<tool>
```

The Rust side consumes only the LBE-generated operation/status/authorization/receipt/evidence/result envelope. Non-executed statuses fail closed and are not projected as completion.

## Authority boundary

### BirdEye owns

- MCP service implementation;
- SHA-256 hashing used by BirdEye;
- SQLite indexing/search state;
- freshness/cache/index lifecycle;
- BirdEye result production.

### LBE owns

- capability registration;
- policy and authorization;
- governed invocation;
- operation-id idempotency;
- canonical ToolReceipt/evidence correlation;
- persistence;
- provider continuation;
- validation/completion truth.

### Rust owns

- typed request/adapter behavior;
- interaction;
- projection of authoritative LBE results.

Rust must not regain direct BirdEye execution or create a second MCP transport/authorization/receipt/evidence authority.

## Local validation recorded for this implementation

- LBE focused regression: `75 passed`.
- Rust full test suite: `205 passed`.
- Rust `cargo check`: PASS.
- Python `compileall`: PASS.
- Existing BirdEye Rust tests: `5 passed`.
- Real-wrapper MCP registry test: PASS.
- Real-wrapper receipt/evidence test: PASS.
- `cargo fmt -- --check`: BLOCKED by pre-existing unrelated formatting drift elsewhere in the dirty Rust workspace; no formatter rewrite was applied.

These are implementation/local-integration proofs, not installed live MCP acceptance.

## What is now closed at implementation scope

```text
BirdEye direct execution from Rust             REMOVED
Rust -> governed LBE BirdEye dispatch           IMPLEMENTED / LOCAL VERIFIED
LBE BirdEye ToolSpec/handler seam               IMPLEMENTED / LOCAL VERIFIED
LBE authorization before handler                IMPLEMENTED / LOCAL OWNER TESTED
Unregistered capability fail-closed path        IMPLEMENTED / LOCAL OWNER TESTED
LBE receipt/evidence envelope -> Rust           IMPLEMENTED / LOCAL VERIFIED
LBE operation-id idempotency ownership          PRESERVED
```

## Installed/live acceptance still open

The active P2/P3 acceptance gate must remain OPEN until claim-matched installed evidence proves:

1. BirdEye registration in the actual installed/canonical LBE capability registry.
2. `DENY` causes zero BirdEye invocations.
3. `ALLOW` causes exactly one BirdEye invocation.
4. Proposal -> authorization -> execution -> result -> ToolReceipt/evidence ordering.
5. Complete MCP lifecycle persistence in the LBE session stream.
6. Provider continuation using the live BirdEye MCP result.
7. UI-dependent Rust/TUI event projection on the shared UI baseline.
8. Installed Rust/TUI MCP end-to-end acceptance.

The configured installed registry fixture was not available during the implementation validation, so these remain PARTIAL/UNVERIFIED rather than PASS.

## Parallel UI ownership

UI-specific MCP presentation remains owned by the separate UI agent. Backend/integration MCP proof is independent and remains active. Do not block backend acceptance work on UI implementation except for final installed UI projection/E2E acceptance.

## Next bounded backend action

```text
resolve/materialize canonical installed capability registry
-> confirm mcp.birdeye.<tool> registration
-> run DENY / zero-invocation proof
-> run ALLOW / exactly-once proof
-> correlate result -> LBE ToolReceipt -> evidence
-> verify persisted MCP event sequence
-> verify provider continuation
-> converge with UI agent for installed TUI acceptance
```

## Product classification

```text
MCP architecture alignment                 PASS
Governed BirdEye routing implementation    IMPLEMENTED / LOCAL VERIFIED / PUSHED
Rust direct MCP execution authority         REMOVED
Installed registry presence                UNVERIFIED
Live DENY zero-execution                    UNVERIFIED
Live ALLOW exactly-once                     UNVERIFIED
Live receipt/evidence persistence           UNVERIFIED
Live provider continuation                  UNVERIFIED
Installed Rust/TUI MCP E2E                  UNVERIFIED
Overall P2/P3 MCP gate                      OPEN
```
