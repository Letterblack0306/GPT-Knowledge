# LBE Terminal TUI — Reuse-First Integration Plan

Status: ACTIVE_REUSE_FIRST_INTEGRATION_DIRECTION
Updated: 2026-08-31
Projection owner: GPT-Knowledge
Canonical runtime authority: `Letterblack0306/LBE_Presistent_Agent_wall`
Rust TUI workspace: `C:/LBE-TUI-Lab`

## Purpose

Record the current LBE terminal/client integration direction without turning GPT-Knowledge into runtime authority.

The rule is now explicit: **reuse mature LBE, Cline, and OpenCode capability before recreating it.** A missing Rust/TUI surface does not automatically authorize a new implementation.

## Current evidence state

Current projected evidence records:

- canonical LBE runtime/governance authority is established;
- Rust/Ratatui read-only LBE attachment is PASS;
- conversational provider turn bridge is PASS;
- Audit, Plan, and Runtime read-only paths are PASS;
- provider-requested governed `workspace.read` is PASS;
- authorization-before-execution is PASS for the accepted bounded path;
- ToolReceipt/evidence correlation and provider continuation are PASS;
- read-only mutation denial and malformed/denied tool handling are PASS;
- complete write-capable interactive mutation acceptance is not yet proven;
- installed-package interactive TUI acceptance is not yet proven.

The canonical LBE machine gate must still be read fresh before authorizing additional implementation.

## Product decision

**LBE is the product and execution/governance authority.**

Cline and OpenCode are reuse sources. They must not become competing product or execution authorities.

```text
Agent / provider mechanics
        ↓
reuse/adapt mature upstream behavior where valid
        ↓
LBE-owned adapter and authorization boundary
        ↓
registered governed execution
        ↓
ToolReceipt / evidence / validation / completion
        ↓
Rust/Ratatui projection
```

## Mandatory reuse decision gate

Before implementing any remaining capability, classify it in this order:

1. `LBE_REUSE`
2. `CLINE_REUSE`
3. `CLINE_ADAPT`
4. `OPENCODE_REUSE_OR_ADAPT`
5. `WRAP_EXISTING`
6. `RUST_UI_ONLY`
7. `LBE_NATIVE_REQUIRED`
8. `REJECT`
9. `UNVERIFIED`
10. `BUILD_NEW_LAST_RESORT`

`BUILD_NEW` is not the default.

## Cline reuse role

Cline is the primary direct runtime reuse/adaptation candidate for mature agent mechanics.

Reuse/adapt where source and LBE boundaries permit:

- agent loop;
- continuation mechanics;
- provider stream normalization;
- generic tool request/result lifecycle;
- session/event projection mechanics that do not replace LBE owners;
- provider/model capability handling;
- retry/compaction behavior;
- interactive/headless CLI mechanics;
- terminal interaction patterns where applicable.

Cline must **not** own:

- LBE authorization or approval authority;
- governed filesystem/process/Git/external mutation;
- LBE ToolReceipt/evidence authority;
- LBE validation/completion truth;
- any direct mutation route that bypasses LBE.

## OpenCode reuse role

OpenCode is an open-source reuse/adaptation source, particularly for product/runtime patterns that should not be rebuilt blindly.

Candidate reuse/adaptation areas:

- terminal/TUI interaction behavior;
- client/server separation;
- provider configuration UX;
- permission UX and plan/build patterns;
- MCP management;
- agents/subagents UX;
- headless automation patterns.

Direct reuse is **not yet claimed as proven**. A current-source capability-by-capability audit must map exact OpenCode owners and licensing/integration boundaries before implementation claims are upgraded.

## LBE ownership boundary

LBE remains authoritative for:

- workspace/session identity where defined by LBE contracts;
- mode and policy;
- authorization and approval;
- governed execution and mutation;
- operation identity;
- ToolReceipts;
- evidence provenance;
- governed persistence contracts;
- validation and completion truth;
- removed/blocked feature intent where governed by the project ledger.

Upstream mechanics may request, transport, display, or continue these operations. They do not become a second authority owner.

## Rust/Ratatui role

The Rust TUI is primarily:

- client;
- adapter;
- event/snapshot projection;
- interaction surface;
- review/approval presentation.

It should not recreate runtime owners already present in LBE or mature generic mechanics that can be safely reused/adapted from upstream.

## Capability mapping requirement

Every remaining TUI capability should answer:

```text
TUI capability
→ existing LBE owner?
→ existing Cline owner/mechanic?
→ existing OpenCode owner/mechanic?
→ reuse/adapt/wrap/native/reject decision
→ LBE authority boundary
→ Rust request mapping
→ normalized event/snapshot mapping
→ UI projection
→ acceptance proof
```

A capability is not implementation-ready until that mapping exists at the appropriate source/contract level.

## Explicitly rejected directions

- rebuilding a second generic agent loop when Cline mechanics are reusable;
- rebuilding a second provider/model framework without a proven LBE-specific requirement;
- rebuilding generic MCP/subagent/TUI machinery merely because the Rust client lacks it;
- hand-building a clone of mature upstream terminal behavior;
- creating parallel session/event ownership that conflicts with LBE;
- direct Cline/OpenCode mutation paths outside LBE governance;
- treating upstream auto-approval/permission defaults as LBE authorization;
- replacing LBE branding or product identity with upstream branding;
- treating an HTML mock/reference as runtime implementation proof.

## Remaining product sequence

### 1. Reuse capability matrix

Complete the capability-by-capability LBE/Cline/OpenCode mapping for the remaining Rust/TUI modules. This is a prerequisite for new capability implementation.

### 2. Write-capable governed mutation acceptance

Target flow:

```text
editable buffer
→ diff/review
→ approval
→ LBE authorization
→ governed workspace.patch
→ validation
→ ToolReceipt/evidence
→ completion projection
```

Reuse mature editor/diff/tool-loop mechanics where valid. LBE retains mutation authority.

### 3. Installed interactive TUI acceptance

Prove the installed product drives the same LBE-owned runtime path and that reused/adapted mechanics cannot bypass authorization, receipts, evidence, or completion.

## Acceptance rule

A future capability is aligned only when:

1. current source proves the upstream capability actually exists;
2. the reuse/adapt decision is explicit;
3. no duplicate LBE authority is introduced;
4. consequential execution crosses LBE governance;
5. receipt/evidence/completion originate from LBE owners;
6. Rust only owns the client/projection/UI responsibilities assigned to it;
7. installed-runtime tests prove the complete path;
8. GPT-Knowledge status remains bounded to the evidence actually produced.

## Authority boundary

This file is a projection and integration plan. It does not activate the canonical LBE machine gate, authorize repository mutation, or prove an untested upstream integration.
