# LBE TUI Audit Wrapper — Coverage and Remaining Integration

**Classification:** REFERENCE  
**Authority:** NON-CANONICAL  
**Purpose:** Record what the current Rust LBE TUI audit wrapper already covers, what it deliberately does not cover, and which integration seams must be completed later against the canonical LBE runtime.  
**Runtime truth:** `Letterblack0306/LBE_Presistent_Agent_wall` and the active installed LBE runtime remain authoritative.  
**Related reference:** `project-engineering/projects/lbe-tui-reference/LBE_TUI_INTEGRATION_FEATURE_REQUIREMENTS.md`

---

## 1. Current prototype source

Current reviewed Rust prototype artifact:

```text
main_lbe_audit_wrapper.rs
SHA256: 853fd230f5a3cc9368cdadbc8b502309d46e6052134a3ae9c78799a2940895ac
```

This hash identifies the reviewed prototype snapshot only. It is **not** a canonical runtime or release identifier.

---

## 2. Existing LBE audit authority used by the wrapper

The current wall repository exposes the installed deterministic audit command:

```text
lbe-guard-audit audit --workspace-root "<target-project>"
```

The command routes into the existing LBE audit controller rather than implementing audit logic in the Rust TUI.

Current wall audit responsibilities include:

- workspace identity resolution;
- scoped current-workspace context;
- foundation guard execution;
- project profiling;
- guard catalog selection;
- rule-pack selection;
- deterministic rule execution;
- evidence capture;
- audit summary/result production;
- project snapshot comparison;
- structured JSON audit output.

The Rust wrapper must continue to treat the wall as the owner of audit truth.

---

## 3. Architecture currently covered

```text
Ratatui TUI
    ↓
InstalledLbeAuditWrapper
    ↓
lbe-guard-audit audit --workspace-root <workspace>
    ↓
LBE wall audit_controller
    ↓
deterministic audit result / report
    ↓
Rust TUI projection
```

This establishes a real wrapper seam without creating a second audit engine.

---

## 4. Areas already covered

### 4.1 LBE Audit mode routing — COVERED

The Rust TUI has three user-visible modes:

```text
Lbe Audit
Agent regular
Plan
```

When `Lbe Audit` is active, submitted input no longer enters the prototype regular-agent approval simulator.

Instead, Audit mode routes into the LBE audit wrapper.

### 4.2 Installed wall audit invocation — COVERED

The wrapper invokes:

```text
lbe-guard-audit
```

with:

```text
audit --workspace-root <resolved/provided workspace>
```

This reuses the existing installed wall capability.

### 4.3 Read-only audit boundary — COVERED

The TUI explicitly projects that Audit mode is read-only and that the wall owns deterministic guard execution and verdict evidence.

The TUI does not authorize writes from Audit mode.

### 4.4 Asynchronous audit execution — COVERED

The installed audit command is invoked on a worker thread.

The terminal render/event loop remains responsive while the deterministic audit runs.

### 4.5 Audit lifecycle projection — COVERED

The TUI can currently project states such as:

```text
REQUESTED
READ ONLY
PASS
FAIL
BLOCKED
```

The displayed outcome is derived from the wall command output. The Rust TUI must not independently re-decide the wall verdict.

### 4.6 Report-path projection — COVERED

When the wall CLI prints a `Report:` line, the wrapper can preserve and display that report reference in the transcript.

### 4.7 Full wall stdout retained in wrapper result — COVERED

The wrapper result retains the command stdout/stderr instead of immediately discarding it.

This is intentional so later structured evidence/receipt/detail views can consume the wall output without rerunning the audit.

### 4.8 Explicit runtime projection fields — COVERED AS UI SEAM ONLY

The Rust `App` currently has presentation fields for:

```text
workspace_label
model_id
model_family
effort_label
context_used
context_capacity
```

These are UI projection seams only.

They are **not** proof of provider/model/runtime integration.

### 4.9 Footer/composer contract — COVERED

The current TUI prototype includes the intended bottom terminal composition:

```text
────────────────────────────────────────────────────────────────────────
>
────────────────────────────────────────────────────────────────────────
? for shortcuts        ○ Lbe Audit/● Agent regular/○ Plan (Tab)    Model ID· low
C:\Users\                                         Gemini (Context) ██ ||||||||
```

The exact responsive formatting may continue to evolve, but this establishes the desired semantic regions.

### 4.10 Audit wrapper contract test coverage — PARTIALLY COVERED

The Rust prototype contains tests for:

- installed command argument construction;
- projection of the returned JSON `outcome` field;
- Audit mode remaining separate from the regular approval simulator;
- existing footer/context-meter behavior.

This is structural test coverage only. It is **not installed end-to-end proof** that the wall command is available and executes successfully on every target machine.

---

## 5. Areas not yet covered

### 5.1 Free-text problem → targeted guard selection — NOT YET INTEGRATED

Current Audit mode accepts user text, but the installed `lbe-guard-audit audit` command performs a project-scoped audit.

The free-text problem is not yet passed through a targeted problem → evidence → guard selection → validation flow.

The wall already has a more targeted Guard Inspector path (`guard-run`). A later wrapper should connect to that capability rather than implementing guard selection in Rust.

Target shape:

```text
user audit question
    ↓
LBE targeted guard-run wrapper
    ↓
evidence package
    ↓
registered guard selection
    ↓
deterministic execution
    ↓
validation
    ↓
PASS / FAIL / INSUFFICIENT_EVIDENCE / NOT_APPLICABLE
```

### 5.2 Structured audit JSON parser — NOT YET INTEGRATED

Current Rust code extracts a compact `outcome`/`summary` from CLI text.

Later integration should deserialize the wall JSON contract into explicit Rust types for:

- audit ID;
- audit status;
- project type;
- selected packs;
- guard results;
- evidence references;
- skipped gates;
- skipped packs;
- project profile;
- snapshot comparison;
- foundation guard execution.

Do not continue indefinitely with ad-hoc text parsing once the typed runtime adapter is implemented.

### 5.3 Evidence detail view — NOT YET INTEGRATED

The wrapper retains stdout, but the TUI does not yet provide a structured evidence panel showing:

```text
current workspace evidence
hashes
paths
line/snippet references
validation evidence
guard ID/version
contradictions
missing evidence
```

### 5.4 Audit report/history browser — NOT YET INTEGRATED

The TUI can display the report path but cannot yet browse prior audit reports or compare them safely.

### 5.5 Real workspace resolver in Rust UI — NOT YET INTEGRATED

The wrapper can use `LBE_WORKSPACE_ROOT` or the current process directory as its initial audit workspace.

That must eventually be replaced by runtime-backed canonical workspace identity.

The TUI must not become a second workspace authority.

### 5.6 Real provider/model state — NOT YET INTEGRATED

Current model/provider/context values are presentation defaults.

Later TUI state must consume canonical LBE provider/model/session state rather than maintaining a second provider registry.

### 5.7 Real regular-agent execution wrapper — NOT YET INTEGRATED

`Agent regular` still uses the prototype proposal → approval → simulated execution lifecycle inside the Rust application.

This must eventually be replaced with a real LBE execution/runtime wrapper.

Target boundary:

```text
TUI user intent
    ↓
LBE runtime request
    ↓
authorization / policy
    ↓
approval when required
    ↓
execution
    ↓
validation
    ↓
receipt
```

### 5.8 Real approval authority — NOT YET INTEGRATED

Current regular-mode approval behavior is simulated by local TUI state.

Later approval events must originate from LBE runtime authority and include:

- approval ID;
- requested tool/action;
- exact target/scope;
- risk;
- policy source;
- one-time/policy-backed semantics;
- resolved decision.

### 5.9 Real receipts and validation projection — NOT YET INTEGRATED

The regular-mode demo currently emits a fake/demo receipt string.

This must not survive into production integration.

Only receipts and validation results returned by canonical LBE runtime may be displayed as execution proof.

### 5.10 Abort/cancel runtime routing — NOT YET INTEGRATED

`Ctrl+C` currently exits the TUI cleanly.

A later runtime-backed client needs distinct behavior for:

```text
abort active turn
cancel active execution
exit when idle
```

### 5.11 Session lifecycle integration — NOT YET INTEGRATED

The Rust prototype does not yet consume canonical LBE session lifecycle or persistent transcript state.

Future integration should cover:

- create session;
- restore session;
- session metadata;
- workspace binding;
- model/provider binding;
- runtime events;
- checkpoints;
- evidence/receipts.

### 5.12 MCP / tools / rules / skills / hooks / connectors — NOT YET INTEGRATED

These remain later runtime-backed surfaces.

The TUI may display and request changes, but canonical capability/authorization ownership remains outside the TUI.

---

## 6. Required future wrapper split

Do not grow one monolithic wrapper indefinitely.

Recommended adapter split:

```text
LbeRuntimeClient
├── AuditClient
│   ├── run_project_audit()
│   └── run_targeted_guard()
├── WorkspaceClient
├── SessionClient
├── ProviderClient
├── ToolClient
├── ApprovalClient
├── EvidenceClient
└── RuntimeEventClient
```

The exact implementation language/transport may change, but ownership must remain explicit.

---

## 7. Recommended typed Rust audit contract

Later implementation should move toward explicit types similar to:

```rust
struct AuditRequest {
    problem: Option<String>,
    workspace_root: PathBuf,
}

struct AuditResult {
    audit_id: String,
    outcome: AuditOutcome,
    audit_status: String,
    project_type: String,
    guards: Vec<GuardResult>,
    evidence_refs: Vec<EvidenceRef>,
    report_path: Option<PathBuf>,
}

enum AuditOutcome {
    Pass,
    Fail,
    InsufficientEvidence,
    NotApplicable,
    Blocked,
}
```

These Rust types must mirror verified LBE contracts rather than creating a new independent schema.

---

## 8. Integration sequencing

Recommended order from the current prototype:

```text
1. Keep current installed project-audit wrapper working.
2. Add typed deserialization for wall audit output.
3. Add targeted Guard Inspector / guard-run wrapper.
4. Add structured evidence and audit result views.
5. Replace workspace projection defaults with canonical workspace state.
6. Replace regular-mode simulated execution with LBE runtime execution wrapper.
7. Replace simulated approvals with runtime approval events.
8. Add validation/receipt views.
9. Add provider/model/session runtime projections.
10. Add MCP/tools/rules/skills/hooks/connectors incrementally.
11. Prove installed end-to-end behavior before claiming TUI integration complete.
```

---

## 9. Completion classification

Current state should be described as:

```text
TUI landing/footer implementation               IMPLEMENTED IN PROTOTYPE
Audit-mode routing                              IMPLEMENTED IN PROTOTYPE
Installed wall project-audit wrapper            IMPLEMENTED IN PROTOTYPE
Reuse of wall deterministic audit authority     STRUCTURALLY INTEGRATED
Targeted free-text guard-run                     NOT YET INTEGRATED
Structured audit/evidence UI                     NOT YET INTEGRATED
Canonical workspace state                       NOT YET INTEGRATED
Provider/model runtime state                     NOT YET INTEGRATED
Regular-agent LBE execution wrapper              NOT YET INTEGRATED
Runtime-backed approvals                         NOT YET INTEGRATED
Real validation/receipts                         NOT YET INTEGRATED
Session persistence/event stream                 NOT YET INTEGRATED
Installed end-to-end TUI proof                   NOT YET PROVEN
```

Do not collapse these classifications into a single `DONE` claim.

---

## 10. Authority rule for future work

```text
The Rust TUI must not become a second LBE.

TUI:
- renders;
- navigates;
- requests;
- projects runtime state.

LBE runtime/wall:
- resolves workspace identity;
- selects/executes deterministic guards;
- owns authorization;
- owns execution;
- owns validation;
- owns evidence;
- owns receipts;
- owns completion proof.
```

Any future implementation that moves those authority responsibilities into the Rust frontend should be treated as an architectural regression unless explicitly authorized by a newer canonical LBE contract.
