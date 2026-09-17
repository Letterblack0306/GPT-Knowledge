# Uploaded Terminal UI Prototype Reconciliation — 2026-09-18

## Source

User-uploaded archive: `workspace (2).rar`.

The file is named `.rar`, but its actual byte format is gzip-compressed tar. The extracted workspace contains 160 archive members, including a Vite/React application, built `dist/`, `TERMINAL_UI.md`, `AUDIT_REPORT.md`, source components, and an embedded local Git repository.

Embedded Git state observed from the uploaded snapshot:

```text
branch = master
HEAD   = d440724bf661295c590241bf628e6b46fe68dd9a
message = task snapshot 9fbe7f38-77e1-4282-8364-009c7913bcf1
working tree = clean
remote = none
```

## Classification

`HTML_VITE_REACT_DESIGN_REFERENCE_ONLY_NOT_RUNTIME_PRODUCT`

This snapshot is useful as a structural/visual reference for the locked LBE terminal UI contract. It is **not** evidence that the canonical LBE CLI/TUI structural gate is implemented or accepted.

## Why it is not runtime proof

The source directly contradicts the accompanying `TERMINAL_UI.md` statement that all state comes from authoritative runtime data.

### Hard-coded state

`src/lib/terminal-engine.ts` constructs static values such as:

- session id `lbe-session-a8f3c2d1`
- workspace `agents-workspace`
- model `claude-sonnet-4`
- mode `PLAN`
- git branch/diff
- context usage `67`
- provider `connected`
- auth `authorized`
- repository commit/CI/gate summaries
- BirdEye/MCP 53 PASS / 0 FAIL
- machine-gate values and blockers

Commands such as `status`, `repos`, `gate`, `audit`, `blockers`, and `plan` read this in-memory fixture rather than current LBE/GitHub/BirdEye/runtime state.

### Simulated process lifecycle

`src/App.tsx` explicitly uses a timeout described by the source comment as:

```text
Process command with delay to simulate runtime
```

It generates artificial timing with `Math.random()`, and increases context usage with another random value after commands.

### No runtime transport

The source snapshot contains no application use of:

- `fetch(...)`
- WebSocket
- EventSource
- PTY/ConPTY
- Tauri/Electron runtime bridge
- child process bridge
- localhost / LBE runtime endpoint
- actual Cline/LBE runtime adapter

`@supabase/supabase-js` is declared in package dependencies but is not used by application source.

Therefore this snapshot has no proven path to authoritative LBE session/provider/tool/receipt/evidence state.

## Useful parts

The visual/component work is directionally consistent with several canonical UI requirements:

- compact persistent LBE/workspace/model/mode header;
- Git state placement;
- context indicator;
- unified execution timeline;
- collapsed completed process summaries;
- expandable detail;
- bounded active-process display;
- `[I]` composer identity;
- dark Letterblack visual language;
- removal of a permanent centered Cline hero.

These may be used as **design/reference input** when implementing the accepted Cline-mechanics-backed LBE CLI/TUI surface.

## Conflicts with canonical product contract

The snapshot must not be promoted as product implementation because:

1. runtime state is fabricated/static;
2. process timing is simulated;
3. context usage is fabricated;
4. status/audit/blocker commands replay historical report data rather than live evidence;
5. it exposes an ecosystem status strip and machine gate content as permanent UI, while the canonical minimal-product contract says technical governance/proof state should not be permanent normal-user UI;
6. its type contract supports only `PLAN | ACT`, omitting the canonical third `AUDIT` user mode even though other text discusses audit;
7. it is an HTML/browser UI, which the canonical contract explicitly classifies as reference-only.

## Correct disposition

```text
REUSE:
  layout hierarchy
  spacing / typography ideas
  header composition
  timeline collapse/expand behavior
  active-process bounded projection concept
  composer identity concept
  context indicator visual

DO NOT REUSE AS TRUTH:
  buildInitialState fixtures
  processCommand audit/status data
  simulated timers
  random context/timing state
  hard-coded repo/CI/gate/MCP status
  permanent ecosystem/governance dashboard concepts

DO NOT CLAIM:
  runtime connected
  authoritative state
  structural gate closed
  TTY/ConPTY acceptance
  provider-backed turn
  governed execution
  ToolReceipt/evidence projection
  installed product acceptance
```

## Current product effect

None.

The active product gate remains the canonical LBE CLI/TUI structural differentiation implemented on the accepted product surface with real emitted LBE/provider/client state. After that, installed TTY/ConPTY and end-to-end product acceptance remain required.

This snapshot can accelerate design implementation, but it does not advance acceptance by itself.
