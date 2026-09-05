# LBE Persistent Agent Wall — Current Project Mirror

## Authority and routing

- Reconciled projection: 2026-09-05
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

The active user-facing product is the **LBE CLI/TUI**. Its current implementation mechanics are the bundled Cline CLI under `C:\LBE-TUI-Lab\cline\apps\cli`, while LBE remains the sole runtime/governance authority. Cline owns cognition/provider/model/delegated-agent mechanics only; it must not become a second owner for workspace/session truth, authorization, governed execution, persistence, receipts/evidence, validation, or completion.

The Rust/Ratatui surface in `C:\LBE-TUI-Lab\src` remains a reference/integration client. It does not recreate LBE runtime or governance authority and is not the primary product UI.

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


## Authoritative product verification and packaging workflow

The canonical repository already contains a versioned machine verifier/package harness:

```text
Letterblack0306/LBE_Presistent_Agent_wall
tools/lbe_product_integration.ps1
```

As of backend commit `9853e93fe2697f8538fa50b4bc9a3a4fa1e1386e`, this script remains the single product-integration verifier rather than creating a parallel acceptance harness.

Supported modes:

```text
check
prove
build
package
```

Source policy:

```text
check/prove
    -> may validate the assembled local worktree

build/package
    -> forced to origin/main
    -> cannot package uncommitted local state
```

The verifier now covers the current product boundary:

```text
LBE runtime authority
+ LBE CLI/TUI product identity
+ bundled Cline agent/provider/model/delegated-agent mechanics
+ Rust/Ratatui reference-client boundary
```

Current machine checks include:

- canonical repository/worktree identity;
- LBE product-entry and governed-tool contracts;
- ChildAgentRun lifecycle owner reuse;
- `child_agent create|started|complete|failed|cancel` product seam;
- focused child lifecycle/product-seam test presence;
- Cline -> LBE child spawn admission;
- LBE-governed child proxy-only tool surface;
- native child-tool bypass checks at the LBE integration seam;
- recursive-spawn default-deny markers;
- child started/terminal lifecycle projection;
- LBE-only visible branding contract;
- suppression of premature `/team` exposure;
- Python focused/regression proof;
- Cline focused tests and TypeScript typecheck;
- Rust regression/fmt checks;
- build/package blocking when structural or proof gates fail.

Packaging already emits:

```text
integration-manifest.json
checksums.json
LetterBlack-LBE-2.0.3-win-x64-candidate.zip
```

The package mode now re-opens the produced archive and verifies every recorded file SHA-256 and byte size against `checksums.json`. Machine evidence is written to:

```text
package-verification.json
```

A package-integrity PASS still does not fabricate live installed acceptance. Provider completion, real delegated-child execution, real cancellation, receipt/evidence correlation, parent continuation, and installed interactive behavior remain separate runtime proof requirements.

## Current child-agent integration state

Current local engineering evidence reported on 2026-09-05:

```text
existing ChildAgentRun lifecycle owner            PROVEN locally
child_agent product command seam                  PROVEN locally
Cline -> LBE spawn admission adapter              IMPLEMENTED / locally tested
LBE-governed child tool surface                   LOCALLY TESTED
native Cline child tools disabled in seam         LOCALLY TESTED
recursive spawn default denial                    LOCALLY TESTED
canonical LBE child identity chain                LOCALLY TESTED
real running-child cancellation                   UNVERIFIED
child ToolReceipt/evidence end-to-end             NOT PROVEN
parent continuation from persisted child result   NOT PROVEN
installed live child spawn                        NOT PROVEN
full subagent feature                             NOT APPROVED
```

Important repository-state qualifier: the verifier update above is on canonical GitHub `main`, but the newest child-agent backend/client implementation was developed in dirty/diverged local workspaces and must not be represented as published canonical source until reconciled and committed through the repository workflow.

## Verification invariant

```text
focused test PASS
    != full product PASS

package hash PASS
    != installed runtime PASS

installed live proof
    + required receipts/evidence
    + completion/cancellation truth
    = only then eligible for product acceptance
```
