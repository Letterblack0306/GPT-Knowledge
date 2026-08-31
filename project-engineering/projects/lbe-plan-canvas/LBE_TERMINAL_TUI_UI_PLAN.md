# LBE Client Integration — Reuse-First Projection Plan

Status: ACTIVE_REUSE_FIRST_INTEGRATION_DIRECTION  
Updated: 2026-08-31  
Projection owner: GPT-Knowledge  
Canonical runtime authority: `Letterblack0306/LBE_Presistent_Agent_wall`  
Rust client workspace: `C:/LBE-TUI-Lab`

## Purpose

Record the current client integration direction without turning GPT-Knowledge or the Rust workspace into runtime authority.

The central rule is now explicit:

> **The canonical LBE runtime owners already exist. Clients invoke them and project their results. They do not copy or recreate them.**

## Product and interface decision

```text
PRODUCT                  = LBE
RUNTIME AUTHORITY        = LBE
FINAL INTERFACE DIRECTION= Cline CLI/SDK mechanics under LBE identity/authority
CLINE                    = approved interface/mechanics reuse source
RUST/RATATUI             = bounded client / adapter / projection integration
OPENCODE                 = external reuse/reference source; pinned capability audit required
```

The long-term Rust product role must remain explicitly reconciled with the approved Cline CLI/SDK interface direction. A current Rust integration slice is not evidence that Rust owns the final product interface.

## Canonical LBE owners already present

The authoritative LBE workspace contains the runtime owners required by the planned integration:

- workspace tools and governed execution: `runtime/tool_orchestration.py`, `runtime/governed_coding.py`, `product_entry.py`;
- authorization/governance: `runtime/authorization_resolver.py`, `runtime/mode_controller.py`, `runtime/completion_gate.py`, `runtime/validation_command_policy.py`;
- memory: `session_memory_runtime.py`, `memory/store.py`, `memory/models.py`, `memory/promoter.py`, `memory/context.py`, `memory/operational_history.py`, `memory/memory_schema.sql`;
- sessions/persistence: `session_lifecycle.py`, `persistent_turn_control.py`, `recovery.py`, `memory/store.py`;
- evidence/receipts: `evidence_service.py`, `runtime/completion_evidence_producers.py`, `memory/completion_evidence.py`, `runtime/tool_orchestration.py`;
- providers/continuation: `provider_registry.py`, `provider_continuation.py`, `provider_turn_runtime.py`, `reasoning_provider.py`, `runtime/cline_stdio_bridge.py`;
- product-level entrypoint: `product_entry.py`.

Current governed tool surface includes:

```text
workspace.read
workspace.list
workspace.glob
workspace.search
workspace.patch
process.run_registered
```

Current product entry exposes the existing command families:

```text
export
tool
authorization
turn
start
capabilities
```

## Tool receipt/result contract

The canonical LBE tool response is owned by LBE and includes:

```text
receipt/result
├── operation_id
├── tool_id
├── status
├── receipt_id
├── authorization
├── output
├── evidence
├── error_code       (failure path)
└── error_message    (failure path)
```

Clients must decode the LBE-owned `output` and `evidence`. They must not reconstruct workspace truth, invent receipt IDs, or create parallel execution state.

## Rust RealLbeWrapper role

`RealLbeWrapper` is the correct integration seam:

```text
UserRequest
    ↓
RealLbeWrapper
    ↓
python -m lbe_guard_inspector.product_entry ...
    ↓
canonical LBE owner
    ↓
ToolReceipt / output / evidence / control result
    ↓
Rust typed event/snapshot projection
    ↓
TUI
```

Current remote source proves that the real wrapper invokes authoritative LBE commands, validates session/workspace identity, and projects receipt/evidence lifecycle state.

A local update was reported that makes `workspace.read` and `workspace.list` consume data from the LBE-owned `output` object. Until that exact change is present in the remote Rust source, GPT-Knowledge classifies it as:

```text
LOCAL_REPORTED_NOT_YET_REMOTE_VERIFIED
```

## P2 read-only acceptance

The correct bounded P2 validation order is:

```text
workspace.read
workspace.list
workspace.glob
workspace.search
```

These operations may prove the real-wrapper **read-only P2 slice** when retained execution evidence shows PASS and receipt/output/evidence correlation.

They do **not** prove `workspace.patch`.

A real patch test requires:

```text
explicit target path
+ exact replacement content
+ expected current hash
+ applicable authorization evidence
```

No synthetic patch payload should be invented merely to advance status.

## MCP/external capability ownership

LBE already has a PASS bounded registration/governed-execution boundary for MCP, plugin, subagent, network and hosted-service capabilities.

Correct MCP path:

```text
ExternalCapabilityRegistration(MCP)
    ↓
ToolSpec / ToolHandler
    ↓
ToolRegistry
    ↓
R6C authorization
    ↓
R6E GovernedToolOrchestrator
    ↓
ToolReceipt / evidence
    ↓
provider continuation
    ↓
persisted LBE event/history
    ↓
client projection
```

Do not build a second MCP executor in Rust.

Current Rust MCP classification remains:

```text
/mcp surface             = PLACEHOLDER
MCP typed projection     = MISSING
installed MCP acceptance = NOT PROVEN
full live MCP acceptance = NOT PROVEN
```

## Mandatory reuse decision gate

Before implementing a missing client capability:

1. `LBE_REUSE` — does the canonical LBE runtime already own it?
2. `CLINE_REUSE` / `CLINE_ADAPT` — can approved Cline mechanics expose it without replacing LBE authority?
3. `OPENCODE_VERIFY_THEN_REUSE_OR_ADAPT` — only after pinned capability-specific source validation.
4. `WRAP_EXISTING` — can an existing owner be exposed through a bounded adapter?
5. `RUST_UI_ONLY` — is only presentation/navigation missing?
6. `LBE_NATIVE_REQUIRED` — is the missing piece uniquely an LBE authority requirement?
7. `REJECT` / `UNVERIFIED`.
8. `BUILD_NEW_LAST_RESORT`.

## Explicitly rejected directions

- copying `lbe_guard_inspector` runtime owners into `C:/LBE-TUI-Lab`;
- adding a second workspace/process executor in Rust;
- adding a second authorization resolver or receipt/evidence owner;
- creating Rust-side persistence for canonical LBE session/event truth;
- creating an MCP executor outside the existing LBE ToolRegistry/R6C/R6E path;
- treating Cline/OpenCode native approvals as LBE authorization;
- upgrading local reported changes to remote/source proof without verification;
- upgrading read-only P2 evidence into write-capable acceptance.

## Remaining sequence

### 1. Finish bounded P2 read-only proof

Retain PASS/FAIL evidence for `workspace.read`, `workspace.list`, `workspace.glob`, and `workspace.search` against the configured real LBE session.

### 2. Reconcile the client capability matrix

For every missing feature record:

```text
capability
→ canonical LBE owner
→ approved Cline mechanic
→ optional verified OpenCode mechanic
→ request/control mapping
→ LBE command/protocol
→ receipt/output/event mapping
→ client projection
→ acceptance proof
```

### 3. Prove write-capable governed mutation separately

Use a real file/payload/hash and preserve the existing LBE `workspace.patch` authority path.

### 4. Complete MCP/client projections only after backend ownership is mapped

Build projection and interaction surfaces over existing LBE owners; do not rebuild backend capability infrastructure.

### 5. Installed interactive acceptance

Prove the installed client drives canonical LBE owners and cannot bypass authorization, receipts, evidence, persistence, or completion.

## Authority boundary

This file is a GPT-Knowledge projection/integration plan. It does not activate a machine gate, authorize canonical repository mutation, or turn a local client implementation into LBE runtime authority.
