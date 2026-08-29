# LBE TUI — Current Status, Upcoming Plan, and End-to-End Integration Plan

**Classification:** REFERENCE / NON-CANONICAL  
**Date:** 2026-08-29  
**TUI source repository:** `Letterblack0306/LBE_Agents_wall_Intigration`  
**Verified TUI source head:** `c0674c9a9dcf2cc73ffaf5d9b9a41423adda066e`  
**Head message:** `Add Agent Wall disconnect reconnect recovery`  
**Agent Wall source repository:** `Letterblack0306/LBE_Presistent_Agent_wall`  
**Verified Agent Wall head:** `580f9db1aea1d2e8f48282f7755a8ea65c7fc0f8`  
**Local workspace:** `C:\LBE-TUI-Lab`

## 1. Current state

```text
READ_ONLY_BATCH_1_IMPLEMENTATION        4/4 CLOSED
READ_ONLY_BATCH_1_ACCEPTANCE            PASS
DISCONNECT_RECONNECT_RECOVERY           PASS / CLOSED
REQUEST_EVENT_CORRELATION_ACCEPTANCE    FAIL / NOT PROVEN
READ_WRITE_GATE                         CLOSED
```

The TUI remains projection-only and Agent Wall remains canonical authority. Request/event correlation is the current blocking correctness gate before any separate review of mutation eligibility.

## 2. Completed read-only and recovery work

The committed read-only projection chain is:

```text
project_truth
→ session_context
→ provenance
→ validation
→ cross-projection identity validation
→ Connected
```

Completed commits:

```text
4ac0c46c991b31b46b52558f8766ec040c827965  Attach TUI to Agent Wall project truth
59d4943b0adb9d16867ce30fc4e224d5c3ecca71  Attach TUI to Agent Wall session context
ed6e34cefc9aef2123ea631bff24fc6c04fa4120  Attach TUI to Agent Wall provenance
4a0476e49628012e2dd9a557067292c2cbe9e14a  Attach TUI to Agent Wall validation
c0674c9a9dcf2cc73ffaf5d9b9a41423adda066e  Add Agent Wall disconnect reconnect recovery
```

Current baseline:

```text
cargo fmt -- --check    PASS
cargo check             PASS
cargo test              PASS — 79/79
git diff --check        PASS
```

Real smoke qualifiers:

```text
project_truth           PASS
session_context         BLOCKED_NO_EXISTING_SESSION
provenance              BLOCKED_NO_EXISTING_SESSION
validation              BLOCKED_NO_EXISTING_TASK
disconnect/reconnect    BLOCKED_NO_EXISTING_TASK
```

No Agent Wall state was created or mutated merely to manufacture smoke evidence.

## 3. Disconnect/reconnect recovery

Status:

```text
DISCONNECT_RECONNECT_RECOVERY = PASS / CLOSED
```

Implemented semantics:

```text
Connected
→ disconnect/loss
→ non-Connected truthful state
→ reconnect
→ isolated fresh four-projection candidate
→ full identity validation
→ atomic live snapshot replacement
→ Connected
```

Reconnect failure remains non-Connected and never falls back to the mock wrapper.

## 4. Request/event correlation gate

Status:

```text
REQUEST_EVENT_CORRELATION_ACCEPTANCE = FAIL / NOT PROVEN
CLASSIFICATION = CORRELATION_MODEL_INSUFFICIENT
```

Confirmed gaps at the current event/reducer boundary:

```text
ValidationCompleted lacks execution_id
TimedOut lacks execution_id
ExecutionRejected lacks proposal/execution ownership identity
tool lifecycle events lack explicit owning execution_id
command lifecycle events lack explicit owning execution_id
App reducer applies several request-specific events without an owning execution/proposal guard
mock approval identity is reused across independent proposal lifecycles
SnapshotUpdated is not a substitute for request ownership
RuntimeAttachmentUpdated is attachment state only, not request completion proof
```

Next correctness slice:

```text
REQUEST_EVENT_CORRELATION_CONTRACT_V1
```

After implementation, rerun:

```text
REQUEST_EVENT_CORRELATION_ACCEPTANCE
```

Passing that acceptance makes the read/write gate **eligible for separate review**. It does not automatically open mutation authority.

## 5. UX note — active operation feedback

Planned non-blocking UX slice:

```text
ACTIVE_OPERATION_FEEDBACK_V1
```

### Current behavior

The current TUI already changes the composer during `Phase::Running` to the static message:

```text
> Execution in progress…
```

The application already has timed redraw infrastructure through `App::next_wake()` / `LbeWrapper::next_wake()`, and timed intro animation exists. However, there is **no general animated activity indicator** for slow operations.

### UX problem

When an operation takes noticeable time, a static terminal can look frozen, broken, or hung even though work is active.

### Goal

Provide lightweight, state-driven animated feedback such as a terminal spinner and contextual activity label.

Example presentation:

```text
⠋ Connecting to Agent Wall…
⠙ Reconnecting…
⠹ Loading project context…
⠸ Validating…
⠼ Running…
⠴ Waiting for tool result…
```

This is activity feedback, not fake progress. Do not invent percentages or claim progress not backed by runtime state.

Candidate active states:

```text
Connecting
Reconnecting
Phase::Running
provider discovery
provider validation
context compaction
diagnostics
future governed tool/command execution
browser reconnect/waiting operations
```

The animation should stop immediately for terminal/non-active states such as:

```text
Completed
Failed
Rejected
TimedOut
Disconnected
Lost
AwaitingApproval
```

### Implementation ordering

Keep this feature separate from the correlation contract repair:

```text
REQUEST_EVENT_CORRELATION_CONTRACT_V1
→ REQUEST_EVENT_CORRELATION_ACCEPTANCE
→ ACTIVE_OPERATION_FEEDBACK_V1
```

Reason: event ownership/correctness and visual feedback should not be changed in the same patch unless later evidence requires it.

This UX item is **not a read/write gate prerequisite**.

## 6. Upcoming plan

1. `REQUEST_EVENT_CORRELATION_CONTRACT_V1` — **NEXT**  
   Add explicit execution/proposal ownership to affected events, unique proposal approval identities, and fail-closed reducer guards for stale/foreign events.

2. `REQUEST_EVENT_CORRELATION_ACCEPTANCE` — **RERUN AFTER CONTRACT REPAIR**  
   Prove stale-event isolation, cross-execution isolation, approval replay protection, terminal idempotency and session/request ownership.

3. `ACTIVE_OPERATION_FEEDBACK_V1` — **PLANNED / NON-BLOCKING UX**  
   Add state-driven loading/activity animation for operations that otherwise make the TUI look idle.

4. `BATCH_2_REASONING_WORKFLOW_PROJECTIONS` — **LATER**  
   Change impact, hypothesis/test/verify, dependency/task graph, prioritization/what's next.

5. `BATCH_3_SECONDARY_PROJECTIONS` — **LATER**  
   Documentation, QA expansion and research evidence/provenance.

6. `GOVERNED_READ_WRITE_INTEGRATION` — **GATE CLOSED**  
   Consider only after correlation acceptance and a separate explicit gate review.

## 7. Read/write gate

Already proven:

```text
Batch 1 read-only mapping 4/4
Batch 1 acceptance
single Agent Wall authority
zero mock fallback across implemented real read-only/recovery paths
disconnect/reconnect recovery
```

Still required before separate gate review:

```text
request/event correlation contract repair
request/event correlation acceptance
```

Current classification:

```text
READ_WRITE_GATE = CLOSED
```

## 8. Preserved workspace exception

```text
C:\LBE-TUI-Lab\rust\main.rs.bak
```

remains untracked and intentionally untouched.

## 9. Authority note

GPT-Knowledge is a reference/projection layer only. Source repositories and runtime evidence remain implementation authority.
