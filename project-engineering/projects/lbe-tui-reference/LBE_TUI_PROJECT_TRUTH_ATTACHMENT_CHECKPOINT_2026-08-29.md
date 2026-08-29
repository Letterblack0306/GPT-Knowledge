# LBE TUI — Project Truth Attachment Checkpoint

**Classification:** REFERENCE / NON-CANONICAL  
**Date:** 2026-08-29  
**TUI repository:** `Letterblack0306/LBE_Agents_wall_Intigration`  
**TUI source head:** `4ac0c46c991b31b46b52558f8766ec040c827965`  
**Agent Wall repository:** `Letterblack0306/LBE_Presistent_Agent_wall`  
**Agent Wall source head:** `580f9db1aea1d2e8f48282f7755a8ea65c7fc0f8`

## Current state

`REAL_AGENT_WALL_PROJECT_TRUTH_ATTACHMENT_V1 = PASS`

The first real read-only Agent Wall → TUI path is proven operational. The TUI remains projection-only and Agent Wall remains the authority for project truth and runtime-owned state.

## Completed

### Agent Wall read-only export seam

Commit `580f9db1aea1d2e8f48282f7755a8ea65c7fc0f8` added product-level read-only exports for:

- `project_truth`
- `session_context`
- `provenance`
- `validation`

Focused export tests passed `10/10`. A real `project_truth` CLI smoke produced a schema-valid read-only projection.

### TUI real project-truth attachment

Commit `4ac0c46c991b31b46b52558f8766ec040c827965` implemented the first TUI-side real attachment slice.

Proven flow:

```text
LBE_RUNTIME=real
→ RealLbeWrapper
→ configured Agent Wall root
→ python -m lbe_guard_inspector.product_entry export project_truth
→ strict ProjectTruthProjection v1 decode/validation
→ LbeSnapshot.project_truth
→ RuntimeAttachmentUpdated
→ SnapshotUpdated
→ existing App reducer/TUI
```

Configuration:

```text
LBE_WALL_ROOT
LBE_TARGET_WORKSPACE
LBE_WALL_PYTHON   optional
```

No HTTP/socket/async transport was introduced for this slice.

## Validation evidence

```text
cargo fmt -- --check     PASS
cargo check              PASS
cargo test               PASS — 43/43
git diff --check         PASS
configured real smoke    PASS — 1/1
```

The configured smoke used:

```text
LBE_WALL_ROOT=C:\Agents-Memory-Tool-v6-integration
LBE_TARGET_WORKSPACE=C:\LBE-TUI-Lab
```

Observed authoritative projection values included:

```text
schema_version       1.0
projection_type      project_truth
read_only            true
workspace_id         workspace_681a91b3a62538ad
workspace_root       C:\LBE-TUI-Lab
target_project_root  C:\LBE-TUI-Lab
connection           Connected
runtime_mode         Local
runtime_id           None
session_id           None
turn_id              None
```

## Authority / safety result

Proven absent from the real V1 path:

- mock fallback
- fabricated runtime identity
- fabricated session identity
- fabricated turn identity
- provider/model mutation
- tool execution
- command execution
- validation execution
- file mutation
- Agent Wall source mutation by the TUI integration slice

The read/write gate remains **CLOSED**.

## Remaining gaps

- `session_context` is exported by Agent Wall but not yet attached to the TUI.
- `provenance` is exported by Agent Wall but not yet attached to the TUI.
- `validation` is exported by Agent Wall but not yet attached to the TUI.
- disconnect/reconnect recovery and stale-state clearing are not yet proven end to end.
- the exhaustive one-test-per-negative-input matrix remains unverified; fail-closed behavior exists but not every named malformed case has a dedicated unit test.
- read/write integration is not open.
- installed end-to-end acceptance remains later.

## Upcoming plan

### 1. REAL_AGENT_WALL_SESSION_CONTEXT_ATTACHMENT_V1 — NEXT

Before implementation, inspect and map `SessionContextProjection` against existing TUI owners for:

- session identity/state
- workspace identity
- task context
- checkpoint state
- memory/context projections
- transcript/operational history

Add typed projection state only where the existing TUI has no semantically correct destination. Do not overload unrelated fields.

Acceptance target:

```text
real persisted session_context export
→ strict Rust decoding/identity validation
→ authoritative TUI projection
→ no fabricated session state
→ no mock fallback
→ no mutation
```

### 2. REAL_AGENT_WALL_PROVENANCE_ATTACHMENT_V1 — PLANNED

Attach owner-backed code/intent provenance and operational/evidence references through the existing read-only boundary.

### 3. REAL_AGENT_WALL_VALIDATION_ATTACHMENT_V1 — PLANNED

Attach validation strategy/completion evidence as read-only state. The TUI must not run validation simply to populate the projection.

### 4. READ_ONLY_BATCH_1_ACCEPTANCE — PLANNED

Close Batch 1 only after all four foundational projections are proven together:

```text
project_truth     PASS now
session_context   pending
provenance        pending
validation        pending
```

Acceptance must include identity consistency, no mock fallback, no mutation, and preservation of Agent Wall authority.

### 5. DISCONNECT_RECONNECT_RECOVERY — PLANNED

Prove authoritative connection loss/recovery, stale-state clearing, and no reuse of stale project/session truth.

### 6. Batch 2 — LATER

- change impact
- hypothesis/test/verify
- dependency/task graph
- what's next / prioritization

### 7. Batch 3 — LATER

- documentation projection
- QA/quality expansion
- research evidence/provenance

### 8. Governed read/write integration — GATE CLOSED

Only after read-only acceptance should mutation open incrementally for sessions, providers/models, approvals, tools, commands, sandbox, checkpoints, and file edits.

## Current classification

```text
Agent Wall export seam                 PROVEN / COMMITTED
TUI project_truth attachment           PROVEN / COMMITTED
Real configured project_truth smoke    PROVEN
Read-only Batch 1                      PARTIAL — 1 of 4 attached
Session context attachment             NEXT
Provenance attachment                  PLANNED
Validation attachment                  PLANNED
Disconnect/reconnect                   UNVERIFIED
Read/write mutation                    GATE CLOSED
Installed end-to-end acceptance        LATER
```

## Authority note

GPT-Knowledge is a reference/projection layer only. Source repositories and runtime evidence remain implementation authority.
