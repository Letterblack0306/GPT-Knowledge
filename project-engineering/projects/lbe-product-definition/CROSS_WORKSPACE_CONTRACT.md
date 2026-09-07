# LBE Cross-Workspace Product Contract

Status: CURRENT GPT-K ROUTING / OWNERSHIP CONTRACT  
Updated: 2026-09-07

## Purpose

Define the relationship between the two canonical LBE repositories and prevent separate-repository identity from being misclassified as a conflict.

## Canonical repositories

| Workspace | GitHub repository | Role |
|---|---|---|
| `C:\Agents-Memory-Tool-v6-integration` | `Letterblack0306/LBE_Presistent_Agent_wall` | LBE runtime/governance authority |
| `C:\LBE-TUI-Lab` | `Letterblack0306/LBE_Agents_wall_Intigration` | LBE product/client/integration workspace |

These repositories are intentionally separate. Different repository names are **not** a repository-identity mismatch.

The architectural boundary is:

```text
LBE CLI/TUI product/client workspace
        ↓
bounded client/runtime adapter
        ↓
LBE runtime/governance workspace
```

## Locked ownership

```text
LBE CLI/TUI
    = user-facing product

Cline
    = embedded provider/model/auth/reasoning/delegated-agent mechanics

LBE runtime
    = sole owner of:
      workspace/session truth
      policy/authorization
      ToolRegistry/governed execution
      operation identity
      ToolReceipts/evidence
      persistence/recovery
      deterministic validation
      completion truth

Rust/Ratatui
    = reference/integration client
```

## Client acquisition / entrypoint status

Current canonical GitHub inspection found:

```text
Letterblack0306/LBE_Agents_wall_Intigration main

cline/         MISSING
begin/         MISSING
run-cline-lbe.ps1  PRESENT
```

The canonical remote launcher currently defaults to a vendored path under:

```text
cline\apps\cli\dist\cli-windows-x64\bin\cline.exe
```

which is absent on canonical main.

A newer local-workspace report states that the local launcher resolves an npm-installed `cline` via `Get-Command cline`. Until the local behavior is reconciled to canonical GitHub, classify the exact client acquisition path as:

```text
PRODUCT ROLE                  CURRENT
CLIENT SOURCE/ACQUISITION     MISALIGNED
CANONICAL CLEAN-CLONE LAUNCH  BLOCKED
LOCAL NPM CLIENT PATH         LOCAL_REPORTED
```

Do not change the locked product boundary merely because the acquisition path is unresolved.

## Backend gate vs client gate mapping

Backend acceptance gates and client roadmap gates are not required to share names. They are different layers.

Current mapping:

```text
BACKEND / RUNTIME AUTHORITY
PARENT_CONTINUATION_AND_DEEP_CORRELATION
    -> proves backend/runtime child-result continuation and correlation

CLIENT / PRODUCT SURFACE
CLIENT_ACQUISITION_AND_ENTRYPOINT_RECONCILIATION
    -> establish reproducible LBE CLI client
CLINE_LBE_STRUCTURAL_VISUAL_DIFFERENTIATION
    -> establish final LBE product shell
INTERACTIVE_CLINE_TTY_ACCEPTANCE
    -> prove real terminal interaction/render
FINAL_INSTALLED_END_TO_END
    -> prove complete installed product
```

Historical Rust roadmap labels such as `P0..P10`, `TUI_P2_P3_GOVERNED_EXECUTION_INTEGRATION`, or `ACTIVE — RUST/RATATUI CLIENT` are **client-history/reference planning**, not the current product gate sequence.

## RealLbeWrapper interpretation

`RealLbeWrapper` belongs to the Rust/Ratatui reference/integration path.

Therefore:

```text
backend installed/runtime acceptance PASS
!=
RealLbeWrapper live integration PASS
```

There is no contradiction when the LBE runtime is accepted while the Rust reference client's live adapter remains unproven. They are separate claims.

Source implementation of `RealLbeWrapper` is classified independently from live attachment:

```text
wrapper source implementation    IMPLEMENTED
live runtime attachment          PROVEN only with claim-matched runtime evidence
```

## Installed runtime relationship

An installed runtime such as `C:\LBE_RUNTIME_PY312` must not be treated as current merely because the directory exists.

Required relationship evidence:

```text
source revision
    ↓
build/package provenance
    ↓
installed artifact/version
    ↓
launcher/config selection
    ↓
runtime proof
```

If current source/config does not bind that installation explicitly, classify it as an installed artifact whose relationship to the active source must be revalidated.

## Historical chat files

Missing `Chat histroy/*.json` references are provenance/documentation issues, not product runtime blockers unless an active gate or tool depends on them.

## Evidence vocabulary

Cross-workspace reporting should use the shared evidence classes:

```text
PROVEN
IMPLEMENTED
DOCUMENTED
INFERRED
UNVERIFIED
STALE
BLOCKED
```

Subsystem-native verdicts such as `PASS`, `FAIL`, `DENY`, `ALLOW`, `INSUFFICIENT_EVIDENCE`, or machine-gate states should be preserved as raw verdicts, then mapped to one of the shared evidence classes when comparing across workspaces.

Examples:

```text
machine gate PASS            -> PROVEN for that bounded gate
source present, no runtime   -> IMPLEMENTED
old roadmap entry            -> STALE when superseded
missing required runtime     -> BLOCKED or UNVERIFIED depending on causality
```

## Cleanup rule

Workspace cleanup is separate from product acceptance.

Do not delete `begin/`, `dist/`, `cline/`, logs, test outputs, runtime state, or other artifacts merely because a cleanup plan names them.

Before deletion:

1. prove the item is non-authoritative and unused;
2. distinguish tracked, untracked, generated, and runtime-state files;
3. preserve unrelated user work;
4. update `.gitignore` only for genuinely generated/non-source artifacts;
5. never treat cleanup completion as product acceptance.

## Version compatibility contract

Until an explicit machine-readable compatibility schema exists, the client/runtime compatibility contract is:

```text
client revision
+ launcher/client acquisition identity
+ LBE runtime revision
+ command/schema compatibility
+ runtime acceptance evidence
= compatible assembled product
```

A future compatibility manifest may formalize these fields, but GPT-K must not invent supported version ranges without source/runtime evidence.

## Authority rule

This document is a GPT-K projection. Current source, machine governance, runtime evidence, acceptance checkpoints, and canonical GitHub repository state outrank it for present-state claims.
