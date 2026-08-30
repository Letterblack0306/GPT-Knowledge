# LBE Persistent Agent Wall — Current Project Mirror

## Authority and routing

- Reconciled projection: 2026-08-31
- Runtime/governance repository: `Letterblack0306/LBE_Presistent_Agent_wall`
- Rust/Ratatui TUI repository: `Letterblack0306/LBE_Agents_wall_Intigration`
- LBE workspace: `C:\Agents-Memory-Tool-v6-integration`
- TUI workspace: `C:\LBE-TUI-Lab`
- Authority: this document is a GPT-Knowledge projection only. Current LBE source, machine governance, workspace/runtime evidence and raw acceptance records remain authoritative.

## Core architecture

```text
Agent/provider reasons.
LBE governs.
Registered capabilities execute.
Evidence and ToolReceipts persist.
Validation decides completion.
The interface projects the result.
```

LBE remains the established authority for workspace/session identity, mode/policy, authorization, governed execution, operation identity, receipts/evidence, persistence, validation and completion.

The Rust/Ratatui TUI is a separate client/projection repository. It does not recreate LBE runtime or governance authority.

## Truth hierarchy

```text
Design                     = what should happen
Acceptance records         = what happened for a bounded slice
Machine governance         = what is allowed now
Current runtime evidence   = what is true now
```

When these disagree, the disagreement must be classified instead of guessed. Historical proof remains preserved but cannot silently override current runtime truth.

## Current bounded live acceptance

The following paths are reported and validated as PASS:

```text
Audit live provider round trip
Plan / investigation provider turn
Runtime / read-only coding turn
Governed workspace.read
Authorization before execution
Real ToolReceipt/evidence correlation
Provider continuation after tool result
Read-only workspace.patch denial
Malformed/denied provider tool handling
Rust real-wrapper projection
```

The provider/model used for the accepted live paths is:

```text
provider = openai-compatible
model    = qwen/qwen3-vl-8b
```

The proven governed tool flow is:

```text
provider/model
→ LBE persisted session
→ mode-specific runtime
→ provider request
→ LBE authorization
→ registered tool execution
→ ToolReceipt/evidence
→ provider continuation
→ completed turn
→ Rust/Ratatui TUI projection
```

## Read-only mutation denial

A read-only Runtime `workspace.patch` attempt was denied before handler execution.

```text
Authorization = DENY
Result        = DENIED
Error         = AUTHORIZATION_DENIED
Handler       = NOT EXECUTED
Mutation      = NONE
```

This demonstrates that exposing a capability or UI control does not grant authority. LBE policy remains the execution boundary.

## Regression evidence

```text
Full Python suite                    813 passed
Duration                             497.59 seconds
Rust suite                           148 passed
Focused provider/tool/governance      61 passed
Malformed/denied tool checks           6 passed
Python compilation                    PASS
git diff --check                      PASS with line-ending warnings only
```

The earlier full-suite timeout uncertainty is resolved; the full Python suite subsequently completed successfully.

## Remaining unproven product-level slices

Do not promote the bounded live acceptance into a claim that every TUI workflow is complete.

Still requiring separate proof:

1. write-capable governed mutation through the full editor → diff review → approval → `workspace.patch` → validation → receipt workflow;
2. installed-package interactive TUI acceptance;
3. any broader product-level completion claim not directly covered by current evidence.

## Machine-governance note

This GPT-K reconciliation does not invent the current active machine slice. When implementation authorization is needed, inspect the canonical LBE machine gate and current acceptance owner directly. Any older GPT-K gate snapshot must be treated as stale until reconciled against that source.

## Current resume point

```text
LBE runtime authority                    ESTABLISHED / GOVERNED
Rust/Ratatui authority boundary           DEFINED
Conversational bridge                     COMPLETE for bounded slice
Live Audit                                PASS
Live Plan / investigation                 PASS
Live Runtime / read-only                  PASS
Governed workspace.read                   PASS
Receipt/evidence + provider continuation  PASS
Read-only mutation denial                 PASS
Full Python regression                    813 PASS
Rust regression                           148 PASS
Complete product-level TUI acceptance     NOT YET PROVEN
```
