# LBE TUI — Current Status, Upcoming Plan, and End-to-End Integration Plan

**Classification:** REFERENCE / NON-CANONICAL  
**Date:** 2026-08-29  
**TUI source repository:** `Letterblack0306/LBE_Agents_wall_Intigration`  
**Verified TUI source head:** `5ddc0e37f47f8e967710277faf77e9ba8362a2b4`  
**Head message:** `Docs: correct stale Module 32/34 cross-cutting statements; rebuild Module 34 cleanly`  
**Local workspace:** `C:\LBE-TUI-Lab`

## 1. Current implementation interpretation

The Rust/Ratatui project is an **implemented LBE terminal frontend with an implemented wrapper/integration contract and a temporary mock runtime used for pre-live validation**.

It is not a disposable mock-only prototype.

Current architecture:

```text
Ratatui TUI
    ↓
LbeWrapper
    ├─ MockLbeWrapper          IMPLEMENTED / ACTIVE MOCK PATH
    └─ RealLbeWrapper          IMPLEMENTED READ-ONLY SKELETON
              ↓
        Agent Wall             NOT YET ATTACHED
```

The visible `MOCK / NOT CONNECTED · UI CONTRACT PREVIEW` labeling remains correct while the real wall is unattached.

## 2. Verified TUI repository state

Remote `main` now contains the following implementation progression:

```text
5ddc0e3 Docs: correct stale Module 32/34 cross-cutting statements; rebuild Module 34 cleanly
 d4b39c2 Add RealLbeWrapper read-only skeleton, runtime selector, and Module 33 implementation plan
 4f596f7 Suppress duplicate terminal lifecycle events
 06d8060 Implement deterministic runtime state machine
 655cf77 Add Cline reuse roadmap and cleanup docs encoding
```

Current source status:

```text
active binary                 src/main.rs
active mock runtime owner     src/wrapper.rs
UI reducer/projection owner   src/app.rs
LbeWrapper abstraction        IMPLEMENTED
MockLbeWrapper                IMPLEMENTED
RealLbeWrapper                IMPLEMENTED READ-ONLY SKELETON
runtime selector              IMPLEMENTED
Module 32                     IMPLEMENTED_PRE_INTEGRATION
Module 34                     DOCUMENTED / FRONTEND MAPPING PRESENT
```

User-reported local validation after the current work:

```text
cargo test --no-fail-fast     PASS
42 tests                      PASS
0 failures
warnings                      PRESENT / NON-BLOCKING
```

`rust/main.rs.bak` remains untracked and intentionally untouched.

## 3. Deterministic runtime state

Module 32 has moved the mock runtime from display-oriented event handling toward a runtime-owned deterministic state machine.

Implemented/pre-integration behavior includes:

```text
execution lifecycle ownership
session/execution terminal synchronization
tool lifecycle tracking
command lifecycle tracking
validation lifecycle tracking
timeout deadline ownership
abort/reject/failure terminalization
out-of-order event protection
duplicate terminal suppression
terminal idempotency
UI projection from wrapper/session status for main flows
```

Current classification:

```text
Module 32                         IMPLEMENTED_PRE_INTEGRATION
mock lifecycle determinism         IMPLEMENTED
terminal idempotency               IMPLEMENTED
real runtime determinism           NOT YET PROVEN
```

Real runtime determinism cannot be claimed until the real Agent Wall event stream is attached and exercised end to end.

## 4. Autonomous developer frontend mapping

`Docs/34_autonomous_developer_frontend.md` maps the autonomous-development frontend surfaces to the current TUI.

Current frontend classifications:

| Feature | Status | Primary runtime dependency |
|---|---|---|
| TUI-33 Project Context / Resume | PARTIAL | Agent Wall project truth + session export |
| TUI-34 Decision Browser | PARTIAL | Agent Wall memory/decision export |
| TUI-35 Code / Intent Provenance | MOCK | Agent Wall provenance export |
| TUI-36 Change Impact Analysis | MOCK | Agent Wall impact/risk export |
| TUI-37 Hypothesis / Test / Verify | PARTIAL | Agent Wall hypothesis/verification export |
| TUI-38 Dependency / Task Graph | PARTIAL | Agent Wall task-graph export |
| TUI-39 Validation Strategy | PARTIAL | Agent Wall validation export |
| TUI-40 Documentation Review | PLACEHOLDER | Agent Wall documentation artifact export |
| Artifact / Diff / Test Review | MISSING | Agent Wall artifact/diff/provenance export |
| Background / Agent Panels | PARTIAL | Agent Wall process/agent projections |

The frontend must consume Agent Wall truth; it must not duplicate Agent Wall engines locally.

## 5. Agent Wall capability readiness

The current Agent Wall handoff classifies AW-33 through AW-43 as:

```text
IMPLEMENTED_IN_AGENT_WALL
CLIENT_EXPORT_PENDING
```

Repository inspection confirms the underlying runtime component families are present for memory, sessions, project profiling, investigation/reasoning, provenance/authority, task completion/planning, validation/completion, external capabilities, and request/mode control.

The exact client-export request/event names remain an integration-contract concern and must be verified at export time rather than inferred from internal Python implementation names.

### Batch 1 — Foundational state

```text
AW-33 Persistent Project Truth Memory
AW-34 Session Continuity Engine
AW-37 Code / Intent Provenance
AW-39 Validation Strategy Framework
```

### Batch 2 — Reasoning and workflow

```text
AW-35 Change Impact Analysis
AW-36 Hypothesis → Test → Verify
AW-38 Dependency / Task Graph
AW-43 Task Prioritization / What's Next
```

### Batch 3 — Secondary surfaces

```text
AW-40 Automated Documentation Pipeline
AW-41 Quality Expansion Framework
AW-42 Autonomous Research Loop
```

## 6. Immediate next implementation phase

The next implementation phase is **not another state-machine pass** and not another frontend capability invention.

It is:

```text
REAL_AGENT_WALL_READ_ONLY_CLIENT_EXPORT_AND_ATTACHMENT
```

Required direction:

```text
existing Agent Wall capability
        ↓
stable read-only product-level export
        ↓
RealLbeWrapper
        ↓
Rust typed projection
        ↓
existing TUI view/panel
```

Hard invariants:

```text
NO mock substitution on real path
NO mutation during read-only phase
NO direct Python coupling from Rust TUI
NO duplicated Agent Wall business logic in TUI
NO Agent Wall internal file/module names as client API
NO TUI-owned canonical runtime state
```

## 7. Batch 1 read-only integration plan

Implement and prove Batch 1 first.

### 7.1 Agent Wall exports

Expose stable read-only projections equivalent to:

```text
ProjectTruthProjection
SessionContextProjection
ProvenanceProjection
ValidationProjection
```

Exact type names may differ, but they must be product-level contracts and must not expose internal Python module structure.

### 7.2 RealLbeWrapper mapping

`RealLbeWrapper` should:

```text
attach to the real wall
obtain authoritative connection/runtime state
obtain Batch 1 snapshots
translate wall data into existing Rust contracts
poll wall-originated read-only events
surface disconnect/reconnect state
fail closed when authoritative data is unavailable
```

During this phase it must not:

```text
execute tools
mutate files
run commands
approve actions
change models/providers
restore checkpoints
start background tasks
```

### 7.3 Batch 1 acceptance gate

```text
REAL_AGENT_WALL_READ_ONLY_BATCH_1

AW-33 export contract                  PASS
AW-34 export contract                  PASS
AW-37 export contract                  PASS
AW-39 export contract                  PASS

RealLbeWrapper attach                  PASS
Rust type conversion                   PASS
TUI real projection                    PASS
disconnect/reconnect projection        PASS

mock substitution                      NONE
mutation                               NONE
direct Python coupling                 NONE
runtime authority leakage              NONE
```

Only after this passes should Batch 2 open.

## 8. Batch 2 integration plan

After Batch 1 is stable, attach:

```text
AW-35 Change Impact
AW-36 Hypothesis/Test/Verify
AW-38 Task Graph
AW-43 What's Next
```

Target flow:

```text
TUI request for inspection/reasoning state
        ↓
RealLbeWrapper
        ↓
Agent Wall read-only runtime export
        ↓
impact / hypothesis / task / priority projection
        ↓
TUI rendering
```

This remains read-only from the TUI's perspective unless a separate mutation gate has explicitly opened.

## 9. Batch 3 integration plan

After Batch 2 acceptance, attach:

```text
AW-40 Documentation proposals
AW-41 QA/quality results
AW-42 Research evidence/source provenance
```

These should initially surface as inspectable artifacts/results. Approval or mutation controls belong to the later read/write phase.

## 10. End-to-end integration sequence

The planned end-to-end sequence is:

```text
PHASE 0 — PRE-INTEGRATION CORRECTNESS
Module 32 deterministic runtime hardening
→ DONE PRE-INTEGRATION

PHASE 1 — REAL WALL READ-ONLY ATTACHMENT
RealLbeWrapper attach/disconnect/reconnect
→ authoritative runtime/session identity
→ no mutation

PHASE 2 — BATCH 1 FOUNDATIONAL EXPORTS
AW-33 memory/project truth
AW-34 session continuity
AW-37 provenance
AW-39 validation
→ real TUI projection

PHASE 3 — BATCH 2 REASONING/WORKFLOW EXPORTS
AW-35 impact
AW-36 hypothesis/test/verify
AW-38 task graph
AW-43 next-task recommendation
→ real TUI projection

PHASE 4 — BATCH 3 SECONDARY EXPORTS
AW-40 docs
AW-41 QA
AW-42 research
→ real TUI projection

PHASE 5 — READ-ONLY END-TO-END ACCEPTANCE
real wall state
→ wall client export
→ RealLbeWrapper
→ Rust typed contracts
→ TUI
→ disconnect/reconnect
→ zero mock substitution
→ zero mutation

PHASE 6 — GOVERNED READ/WRITE INTEGRATION
session operations
model/provider selection
approval flow
governed tool execution
governed command execution
sandbox/permissions
checkpoint restore
file edits

PHASE 7 — CODING IDE REVIEW LOOP
workspace changes
diff review
patch review
artifact review
test result review
accept/reject workflow

PHASE 8 — DURABILITY
persistent sessions
resume
checkpoint persistence
project truth recall
artifact/evidence/receipt history
conversation handoff

PHASE 9 — BACKGROUND / AGENT WORKSPACE
background processes
subagents
agent teams
dependency chains
per-agent logs/artifacts/evidence

PHASE 10 — HEADLESS / CI ACCEPTANCE
plain non-TUI mode
structured JSON output
CI-safe execution
terminal lifecycle acceptance
installed end-to-end acceptance
```

## 11. Read/write mutation gate

No real mutation should be enabled until the read-only path proves authoritative state transport.

The read/write gate should require:

```text
real connection/session identity proven
Batch 1–3 projection mapping proven
no mock fallback proven
single authority preserved
request/event correlation proven
disconnect/reconnect behavior proven
```

Then mutation may be enabled incrementally:

```text
1. session operations
2. model/provider selection
3. approvals
4. governed tool execution
5. governed command execution
6. sandbox/permissions
7. checkpoint restore
8. file edit/write pipeline
9. diff acceptance
10. background tasks
```

Each mutation slice must retain Agent Wall authorization, validation, evidence, receipt, and completion authority.

## 12. Final target architecture

```text
                    LBE Terminal TUI / CLI
                             │
                             ▼
                         LbeWrapper
                     /                 \
          MockLbeWrapper             RealLbeWrapper
          test-only/prelive                │
                                          ▼
                                      Agent Wall
                         ┌────────────────┼────────────────┐
                         │                │                │
                   Project Truth      Sessions        Provenance
                         │                │                │
                     Validation      Impact/Tasks      Evidence
                         │                │                │
                      Receipts       Providers/Tools    Artifacts
                         └────────────────┼────────────────┘
                                          │
                                          ▼
                              governed execution/runtime
```

Client surfaces own presentation, navigation, review, request construction, and local editor state.

Agent Wall owns canonical runtime/session state, project truth, authorization, policy, tool/command execution, validation, evidence, receipts, persistence, provenance, and completion truth.

## 13. Current overall status

```text
TUI shell / runtime loop                 IMPLEMENTED
MockLbeWrapper                           IMPLEMENTED
Module 32 deterministic state machine    IMPLEMENTED_PRE_INTEGRATION
terminal idempotency                     IMPLEMENTED
RealLbeWrapper                           READ_ONLY_SKELETON_IMPLEMENTED
Module 34 frontend mapping               DOCUMENTED / PARTIAL FRONTEND SURFACES
Agent Wall internal capabilities         READY / CLIENT_EXPORT_PENDING
read-only client export                  NEXT
RealLbeWrapper real attachment           NEXT
TUI rendering of real wall truth         AFTER CONTRACT
read/write mutation integration          LATER
installed end-to-end acceptance          LATER
```

## 14. Authority note

GPT-Knowledge is a projection/reference layer, not implementation authority.

Implementation truth remains in the current source repositories and runtime evidence. This record should be updated whenever source heads, integration gates, or live acceptance evidence materially change.
