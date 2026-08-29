# LBE TUI — Current Status, Upcoming Plan, and End-to-End Integration Plan

**Classification:** REFERENCE / NON-CANONICAL  
**Date:** 2026-08-29  
**TUI source repository:** `Letterblack0306/LBE_Agents_wall_Intigration`  
**Verified TUI source head:** `4ac0c46c991b31b46b52558f8766ec040c827965`  
**Head message:** `Attach TUI to Agent Wall project truth`  
**Agent Wall source repository:** `Letterblack0306/LBE_Presistent_Agent_wall`  
**Verified Agent Wall head:** `580f9db1aea1d2e8f48282f7755a8ea65c7fc0f8`  
**Local workspace:** `C:\LBE-TUI-Lab`

## 1. Current state

The first real read-only Agent Wall → TUI path is now proven.

```text
REAL_AGENT_WALL_PROJECT_TRUTH_ATTACHMENT_V1 = PASS
```

Current architecture:

```text
Ratatui TUI
    ↓
LbeWrapper
    ├─ MockLbeWrapper
    └─ RealLbeWrapper
           ↓
    configured Agent Wall product CLI
           ↓
      project_truth v1
           ↓
      typed Rust projection
           ↓
      existing TUI state/reducer
```

The TUI remains projection-only. Agent Wall remains authority for project truth and later session/runtime/mutation state.

## 2. What is completed

### 2.1 TUI foundation

```text
TUI shell/runtime loop                 IMPLEMENTED
MockLbeWrapper                         IMPLEMENTED
LbeWrapper abstraction                 IMPLEMENTED
runtime selector                       IMPLEMENTED
Module 32 deterministic state machine  IMPLEMENTED_PRE_INTEGRATION
terminal idempotency                   IMPLEMENTED
RealLbeWrapper skeleton                IMPLEMENTED
```

### 2.2 Agent Wall read-only export seam

Agent Wall commit:

```text
580f9db1aea1d2e8f48282f7755a8ea65c7fc0f8
Add read-only Agent Wall projection exports
```

The committed seam exports:

```text
project_truth
session_context
provenance
validation
```

Focused export validation:

```text
10 tests passed
project_truth runtime smoke PASS
local HEAD == origin/main at acceptance
```

### 2.3 Real project-truth attachment

TUI commit:

```text
4ac0c46c991b31b46b52558f8766ec040c827965
Attach TUI to Agent Wall project truth
```

Implemented flow:

```text
LBE_RUNTIME=real
→ RealLbeWrapper
→ LBE_WALL_ROOT / LBE_TARGET_WORKSPACE
→ python -m lbe_guard_inspector.product_entry export project_truth
→ strict ProjectTruthProjection v1 decode/validation
→ LbeSnapshot.project_truth
→ RuntimeAttachmentUpdated
→ SnapshotUpdated
→ existing App reducer/TUI
```

The TUI does not fabricate runtime/session/turn identity for this path.

### 2.4 Validation evidence

```text
cargo fmt -- --check     PASS
cargo check              PASS
cargo test               PASS — 43/43
git diff --check         PASS
configured real smoke    PASS — 1/1
```

Configured real smoke:

```text
LBE_WALL_ROOT=C:\Agents-Memory-Tool-v6-integration
LBE_TARGET_WORKSPACE=C:\LBE-TUI-Lab
```

Observed projection:

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

### 2.5 Authority / safety properties proven

```text
mock fallback on real path       NONE
fabricated runtime identity      NONE
fabricated session identity      NONE
fabricated turn identity         NONE
provider/model mutation          NONE
tool execution                   NONE
command execution                NONE
validation execution             NONE
file mutation                    NONE
Agent Wall source mutation       NONE for TUI slice
```

## 3. Current Batch 1 status

Foundational read-only Batch 1 consists of four projections:

| Projection | Agent Wall export | TUI attachment |
|---|---|---|
| `project_truth` | PROVEN | **PROVEN** |
| `session_context` | PROVEN EXPORTED | **NEXT** |
| `provenance` | PROVEN EXPORTED | PLANNED |
| `validation` | PROVEN EXPORTED | PLANNED |

Current classification:

```text
READ_ONLY_BATCH_1 = PARTIAL — 1 OF 4 ATTACHED
```

The read/write gate remains **CLOSED**.

## 4. Immediate next step

```text
REAL_AGENT_WALL_SESSION_CONTEXT_ATTACHMENT_V1
```

Before implementation, inspect and map `SessionContextProjection` against existing TUI owners for:

```text
session identity/state
workspace identity
task context
checkpoint state
memory/context projections
transcript/operational history
```

Rules:

- reuse existing TUI state only where semantics match;
- add a typed projection field where no correct existing destination exists;
- do not overload diagnostics/runtime/provider fields;
- no fabricated session identity;
- no mock fallback on the real path;
- no mutation;
- Agent Wall remains canonical session/context owner.

Acceptance target:

```text
real persisted session_context export
→ strict Rust decode/identity validation
→ authoritative TUI projection
→ existing event/reducer flow
→ zero mock fallback
→ zero mutation
```

## 5. Upcoming plan

### Phase A — Session context

`REAL_AGENT_WALL_SESSION_CONTEXT_ATTACHMENT_V1`

Attach persisted session state, task/checkpoint/context and transcript state through the existing read-only boundary.

### Phase B — Provenance

`REAL_AGENT_WALL_PROVENANCE_ATTACHMENT_V1`

Attach code/intent provenance plus owner-backed operational/evidence references.

### Phase C — Validation

`REAL_AGENT_WALL_VALIDATION_ATTACHMENT_V1`

Attach validation strategy/completion evidence as read-only projection. The TUI must not execute validation merely to populate this view.

### Phase D — Batch 1 acceptance

`READ_ONLY_BATCH_1_ACCEPTANCE`

Require all four projections together with:

```text
identity consistency
zero mock fallback
zero mutation
single Agent Wall authority
request/event consistency
```

### Phase E — Disconnect/reconnect recovery

Prove:

```text
connection loss
stale-state clearing
re-attachment
identity revalidation
no reuse of stale project/session truth
```

### Phase F — Batch 2 read-only reasoning/workflow

Later attach:

```text
change impact
hypothesis/test/verify
dependency/task graph
what's next / prioritization
```

### Phase G — Batch 3 secondary projections

Later attach:

```text
documentation
QA/quality expansion
research evidence/provenance
```

### Phase H — Governed read/write integration

**GATE CLOSED.**

Only after read-only acceptance should mutation open incrementally for:

```text
session operations
providers/models
approvals
tools
commands
sandbox/permissions
checkpoint restore
file edits/diff acceptance
background tasks
```

Every mutation slice must preserve Agent Wall authorization, validation, evidence, receipt and completion authority.

## 6. Remaining gaps

```text
session_context TUI attachment          NEXT
provenance TUI attachment               PLANNED
validation TUI attachment               PLANNED
disconnect/reconnect recovery           UNVERIFIED
exhaustive named negative-test matrix   UNVERIFIED
read/write integration                  GATE CLOSED
installed end-to-end acceptance         LATER
```

## 7. Transport note

The current proven V1 local transport invokes the Agent Wall product entry through Python:

```text
python -m lbe_guard_inspector.product_entry export project_truth --workspace <target> --format json
```

This is a read-only product CLI boundary, not duplicated Agent Wall business logic. A packaged executable or different stable transport may replace it later as hardening, but that is not required to classify the current `project_truth` slice as proven.

## 8. Final current classification

```text
Agent Wall read-only export seam        PROVEN / COMMITTED
RealLbeWrapper project_truth path        PROVEN / COMMITTED
Real configured smoke                    PROVEN
TUI real project_truth projection        PROVEN
Read-only Batch 1                        PARTIAL — 1/4 ATTACHED
Session context                          NEXT
Provenance                               PLANNED
Validation                               PLANNED
Disconnect/reconnect                     UNVERIFIED
Read/write mutation                      GATE CLOSED
Installed end-to-end acceptance          LATER
```

## 9. Authority note

GPT-Knowledge is a reference/projection layer only. Source repositories and runtime evidence remain implementation authority.
