# LBE CLI/TUI — Final Product Aim

Status: CURRENT PRODUCT UI AIM  
Updated: 2026-09-07  
Product: **LBE — Lockstep Boundry Engine**  
User-facing surface: `C:/LBE-TUI-Lab/cline/apps/cli`  
Launcher: `C:/LBE-TUI-Lab/run-cline-lbe.ps1`  
Runtime authority: `Letterblack0306/LBE_Presistent_Agent_wall`

## Product aim

Build one minimal, evidence-truthful terminal product in which the agent can reason and act continuously while LBE visibly owns the boundary between proposal and consequence.

The product must feel like **LBE**, not a re-skinned Cline client.

Core invariant:

> **Agent/provider owns cognition. LBE owns capabilities and consequences.**

Product role:

```text
LBE CLI/TUI
    = user-facing product

Cline
    = embedded provider/model/auth/reasoning/delegated-agent mechanics

LBE runtime
    = sole owner of session/workspace truth, policy, authorization,
      ToolRegistry, governed execution, receipts/evidence,
      persistence/recovery, validation and completion truth

Rust/Ratatui
    = reference/integration client only
```

## Final interaction model

Permanent surface has only four regions:

```text
1. compact runtime header
2. one ordered conversation/execution timeline
3. composer
4. compact footer/status
```

Everything else is transient or expandable.

### Target shell

```text
LBE · <workspace> · <model> · <PLAN/AUDIT>                 git <branch> · <diff>
                                                          ctx [ ||||........ ]


conversation / execution timeline

✓ workspace.read  product_entry.py  180ms

› current process
  raw emitted event line 1
  raw emitted event line 2
  raw emitted event line 3


[I]  Message LBE…
____________________________________________________________________________

ctx <usage> · <active mode>                                      Ctrl+K
____________________________________________________________________________
```

## Visual hierarchy

High prominence:

- `LBE`;
- workspace;
- actual conversation;
- active process/output;
- input/composer.

Muted / secondary (~50% visual intensity):

- model;
- PLAN/AUDIT;
- Git branch/diff;
- context usage;
- footer metadata;
- shortcut hints.

Color communicates state, not decoration.

No mascot.  
No large permanent hero.  
No large ASCII splash in the active shell.  
No Cline product branding.  
No dashboard clutter.  
No permanent Agents/Tools/Evidence/Settings panels.  
No fake runtime status.

## Active process behavior

Only the currently active process may occupy the expanded live viewport.

Default live viewport:

```text
maximum 3 raw emitted runtime/event lines
```

As new lines arrive, the viewport follows the newest three.

Single click:

```text
expand complete available emitted process/event output
```

When the next process starts, the previous one auto-collapses:

```text
✓ workspace.read  product_entry.py  180ms
```

This keeps chronology visible without turning the terminal into stacked diagnostic panels.

The process view may show raw runtime/tool/event evidence already emitted by the system. It must not expose hidden model chain-of-thought.

## Composer and activity identity

Idle:

```text
[I]  Message LBE…
```

Active execution replaces the compact idle identity with a horizontally bouncing indicator:

```text
[|                ]
[        |         ]
[               |  ]
[                 |]
[               |  ]
[        |         ]
[|                ]
```

This is the LBE activity signature. It is not a generic spinner.

## Context indicator

Top-right:

```text
ctx [ ||||........ ]
```

represents real context-window usage only.

It must derive from actual runtime/model context accounting. It is not task progress.

## Timeline rule

Conversation, tools, delegated children, approvals, denials, validation and completion appear in one ordered stream.

Example:

```text
YOU
Inspect parent continuation.

LBE
Checking the runtime path.

✓ workspace.read  lbe-tool-adapter.ts  34ms
✓ child  inspect continuation  2.3s

LBE
The persisted child result is available...
```

Do not create permanent parallel panels for agents, tools or evidence.

## Child-agent projection

Normal collapsed form:

```text
✓ child  inspect continuation  2.3s
```

Active form follows the same three-line process rule.

Expanded details may expose authoritative identifiers such as:

```text
child_run_id
child_session_id
spawn_operation_id
provider_tool_call_id
lbe_call_id
runtime_operation_id
tool_receipt_id
```

only when those values actually exist in runtime evidence.

## Approval / mutation

Authority-bearing actions interrupt the same timeline at the point of consequence.

No separate permanent approval dashboard.

A mutation must remain visibly tied to LBE authorization, exact operation identity, resulting ToolReceipt/evidence and validation.

## Keyboard direction

Current intended compact map:

```text
Ctrl+K / Cmd+K    command palette
Ctrl+C / Cmd+C    copy
Ctrl+Q / Cmd+Q    quit
Ctrl+I            interrupt current turn
Ctrl+X            cancel active child/run
Ctrl+S            steer
Ctrl+L            clear conversation
Tab               mode
Esc               dismiss/close contextual surface
```

Distinct interrupt-vs-cancel runtime semantics must be proven separately; key presence alone is not proof.

## Acceptance boundary

Source implementation is not visual acceptance.

Required proof order:

```text
CLINE_LBE_STRUCTURAL_VISUAL_DIFFERENTIATION
    ↓
real terminal / TTY rendering
    ↓
interactive governed runtime flow
    ↓
claim-matched receipts/evidence
    ↓
installed end-to-end acceptance
```

Acceptable UI proof:

- real terminal screenshot;
- PTY/ConPTY capture;
- rendered component snapshot;
- runtime recording.

Generated mockups are design references only.

## Current gate

```text
CLINE_LBE_STRUCTURAL_VISUAL_DIFFERENTIATION
status: FAIL_CURRENT_IMPLEMENTATION
```

The current product must not be accepted merely because branding changed. The active shell must satisfy the structural target above before interactive TTY acceptance becomes the next gate.

## Non-goals

Do not:

- rebuild LBE runtime authority in the client;
- replace Cline provider/model/reasoning mechanics unnecessarily;
- promote Rust/Ratatui back to primary product status;
- add a second child lifecycle/session/receipt/evidence owner;
- add fake terminal telemetry;
- create another verifier instead of extending the canonical one;
- treat UI source presence as rendered proof.

## Final product test

The product aim is met when a user can launch **LBE**, converse naturally, see one truthful ordered execution timeline, understand when LBE is acting or blocking, inspect evidence when needed, resume persistent work, and complete governed agent tasks without exposure to duplicate runtime authority or Cline-branded product structure.
