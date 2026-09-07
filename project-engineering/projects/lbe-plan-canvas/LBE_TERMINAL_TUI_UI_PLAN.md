# LBE CLI/TUI — Canonical Product UI Contract

Status: **CURRENT / CANONICAL UI CONTRACT**  
Updated: 2026-09-08  
Product: **LBE — Lockstep Boundry Engine**  
User-facing surface: **LBE CLI/TUI**  
Runtime authority: **LBE runtime**  
Embedded mechanics: **Cline provider/auth/model/reasoning/delegated-agent mechanics**

## Authority

This document is the single canonical GPT-K location for LBE product UI behavior.

Do not distribute current UI requirements across ad-hoc handoff notes, historical TUI references, checkpoint notes, or implementation commentary. Those may preserve history, but current UI truth must be maintained here and referenced from `plan.json` and `status.json`.

Historical Rust/Ratatui, Textual, HTML, Cline-native, and generated mockup UI material is reference-only unless this document explicitly adopts a behavior.

## Product principle

The user needs a minimal coding-agent interface, not a governance debugger.

Internal LBE proof/evidence/runtime mechanics must exist and remain inspectable by the agent, verifier, workspace tooling, logs, and persisted runtime state. They are not normal user-facing UI content.

### Do not surface technical internals by default

The normal UI must not show or dedicate panels to:

- ToolReceipt IDs;
- `provider_tool_call_id`;
- `lbe_call_id`;
- `runtime_operation_id`;
- operation IDs;
- child lifecycle IDs;
- authorization records;
- evidence chains;
- proof/checkpoint metadata;
- internal event names;
- raw governance records;
- internal validation objects;
- technical runtime state dumps.

The agent can retrieve these from the workspace/runtime when needed. The canonical verifier can inspect them for acceptance. They do not belong in the normal product surface.

The only exception is information required for a direct user decision, such as a concise approval/rejection prompt or a clear actionable failure.

## Modes

LBE must support three user modes:

```text
PLAN
ACT
AUDIT
```

### PLAN

For investigation, reasoning, planning, review, and proposed next actions without authority-bearing mutation.

### ACT

The normal execution mode. The agent may request governed capabilities and perform authorized work through LBE.

### AUDIT

An additional LBE-specific mode for inspection and verification. It focuses on checking current workspace state, implementation claims, acceptance/gate status, diffs, tests, and runtime truth without treating historical PASS or model prose as proof.

AUDIT is not a second runtime and not a separate agent architecture. It is a product mode using the same LBE authority and capability system with an inspection-oriented policy.

The UI should display the active mode compactly as `PLAN`, `ACT`, or `AUDIT`.

## Permanent surface

Only four permanent regions:

```text
1. compact header
2. one conversation/work timeline
3. composer
4. compact footer
```

No permanent Agents, Tools, Evidence, Runtime, Governance, Settings, Objective, Receipt, or Diagnostics panels.

## Target shell

```text
LBE · <workspace> · <model> · <PLAN/ACT/AUDIT>             git <branch> · <diff>
                                                          [ ||||........ ]


conversation / work timeline

Reading product_entry.py…
Updating provider integration…
Waiting for approval…
Completed.


[I]  Message LBE…
____________________________________________________________________________

ctx <usage> · <mode>                                      Ctrl+K
____________________________________________________________________________
```

This is a behavioral layout, not runtime screenshot evidence.

## Visual hierarchy

High prominence:

- `LBE`;
- workspace;
- conversation;
- current user-relevant work;
- composer.

Muted / secondary, approximately 50% visual intensity:

- model;
- active mode;
- Git branch/diff;
- context usage;
- footer metadata;
- shortcut hints.

No mascot.  
No permanent hero.  
No large ASCII identity in the active shell.  
No Cline product branding.  
No dashboard clutter.  
No fake telemetry.  
No decorative evidence/runtime panels.

## Timeline behavior

The timeline should explain work in human language, not expose internal protocol records.

Preferred:

```text
Reading product_entry.py…
Checking provider configuration…
Updating the adapter…
Running tests…
Completed.
```

Avoid normal-user output such as:

```text
agent.child.started
runtime_operation_id=...
authorization=ALLOW
receipt_id=...
```

Conversation and user-relevant execution status stay in one chronological surface.

Completed work should collapse naturally to concise human-readable summaries. Current work may show a small bounded live status area, but it should not become a raw event console.

## Composer / activity identity

Idle:

```text
[I]  Message LBE…
```

During active work, the compact identity may become the established horizontal LBE activity indicator:

```text
[|                ]
[        |         ]
[               |  ]
[                 |]
[               |  ]
[        |         ]
[|                ]
```

The animation means LBE is processing/working. It must be driven by real activity state.

## Context indicator

Top-right:

```text
[ ||||........ ]
```

represents actual context-window usage only. It is not task progress.

## Approvals

Approvals remain user-facing because they require a user decision.

Keep them concise and contextual:

```text
Update src/runtime/foo.ts?
[Approve] [Reject]
```

Do not expose receipt IDs, operation IDs, policy internals, or evidence chains unless the user explicitly asks for technical diagnostics.

## Technical inspection

Technical proof remains available outside the normal UI through:

- LBE workspace/runtime state;
- persisted receipts/evidence;
- logs;
- canonical verifier;
- agent inspection tools;
- explicit diagnostic/audit requests.

AUDIT mode may summarize findings for the user, but it should still avoid dumping internal IDs unless directly useful or explicitly requested.

## Keyboard direction

```text
Ctrl+K / Cmd+K    command palette
Ctrl+C / Cmd+C    copy
Ctrl+Q / Cmd+Q    quit
Ctrl+I            interrupt current turn
Ctrl+X            cancel active child/run
Ctrl+S            steer
Ctrl+L            clear conversation
Tab               mode selection/cycle
Esc               dismiss contextual surface
```

Mode selection must include PLAN, ACT, and AUDIT.

## Product boundary

```text
LBE CLI/TUI
    = user-facing product

Cline
    = embedded provider/model/auth/reasoning/delegated-agent mechanics

LBE runtime
    = sole authority for session/workspace truth, policy,
      authorization, governed execution, receipts/evidence,
      persistence/recovery, validation and completion

Rust/Ratatui
    = reference/integration client

Textual
    = historical/diagnostic prototype, not final product UI

HTML / generated visuals
    = design/reference only, never runtime proof
```

## Acceptance

Source implementation is not rendered acceptance.

Acceptable visual/runtime evidence:

- real terminal screenshot;
- PTY/ConPTY capture;
- rendered component snapshot;
- runtime recording.

Generated mockups are never proof.

Current interactive gate remains the real terminal LBE CLI path, not Textual shell tests.

## Non-goals

Do not:

- make Evidence or Runtime permanent UI sections;
- expose technical proof IDs as normal product content;
- resurrect Textual/Rust as the primary product surface;
- turn AUDIT into a second runtime;
- add a second lifecycle/session/receipt/evidence owner;
- display fabricated agent messages, receipts, runtime status, or telemetry;
- create random UI requirement notes instead of updating this canonical contract;
- treat UI source presence as rendered proof.

## Final UX test

A normal user should be able to open LBE, choose PLAN/ACT/AUDIT as needed, converse naturally, understand what the agent is doing at a human level, approve consequential actions when required, and continue working without being exposed to internal governance/proof machinery.

The machinery remains real, authoritative, and inspectable — it simply stays out of the user's way.
