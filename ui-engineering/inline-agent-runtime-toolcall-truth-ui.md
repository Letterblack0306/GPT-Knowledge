# Inline Agent Runtime Tool-Call Truth UI

Status: canonical cross-project UI/runtime reference

Purpose: preserve the approved Letterblack pattern for showing live agent execution and tool calls without introducing approval-driven workflow or fake semantic progress.

## Source provenance

This reference was distilled from the user-supplied `LBE — Agent Runtime (Research Prototype)` HTML design artifact on 2026-08-15. The prototype is a visual/interaction reference only. It is not runtime architecture authority.

The source prototype contains two separable ideas:

1. **Accepted:** compact truthful status chrome, chronological agent/session stream, contextual inline tool cells, concise tool state, path/action/result detail, and evidence/diff affordances.
2. **Rejected:** approval overlay, approve/deny buttons, `awaiting authorization`, Plan -> Approve -> Execute semantics, and any ordinary user confirmation gate before workspace work.

Future implementations must preserve that distinction.

## Core rule

> Runtime facts render where they matter. The agent reasons; governed tools execute within deterministic boundaries; evidence proves what happened; the UI projects that truth inline.

The primary session surface is chronological. A tool call should appear directly under the agent/runtime activity that caused it rather than forcing the user to inspect a permanent side dashboard to understand what is happening.

## Required presentation pattern

Use a compact stream with small actor markers and contextual execution cells.

A live tool cell should be able to show, when actually available:

- tool/action name;
- target path, command, provider action, browser target, or resource;
- observed lifecycle state such as `start`, `running`, `success`, `failed`, `blocked`, `observed`, `queued`, or `delivered`;
- concise result or observation;
- changed-line/diff summary when backed by real mutation evidence;
- cwd/exit code/stdout/stderr summary for command execution when appropriate;
- operation, instruction, turn, tool-call, provider-request, receipt, artifact, or target correlation IDs;
- an affordance or label pointing to deeper evidence such as Complete Log, diff, receipt, or artifact.

Do not manufacture unavailable fields just to make the UI look complete.

## Truth hierarchy

The inline stream is a projection of runtime evidence, not a second source of state.

Preferred evidence order:

1. producer-side runtime/tool event;
2. governed tool receipt or execution result;
3. provider/browser/terminal observation;
4. correlated diagnostic record;
5. UI projection.

The UI must never infer success from button clicks, optimistic state, or a planned action.

## No approval workflow

There is no ordinary approval UI in this pattern.

Do not add:

- approve / deny controls;
- authorization-required overlays;
- `awaiting authorization` states;
- mandatory confirmation before ordinary governed edits or commands;
- semantic approval queues;
- a Plan -> Approve -> Execute state machine disguised as UI;
- approval IPC merely because a reference prototype contained it.

Governance belongs in deterministic tool/workspace boundaries. If policy blocks an action, render the **observed blocked result** inline as evidence. Do not convert the block into a conversational approval workflow unless a product explicitly defines a separate high-risk authorization boundary.

## No duplicate instruction channel

For browser-owned agent products, the browser conversation remains the instruction owner. Do not add a second local task composer merely to make the runtime stream resemble a chat application.

The local session stream may show browser instruction receipt, agent execution summaries, tool calls, observations, and result delivery, but it should not ask the user to duplicate the browser objective locally.

## Agent reasoning visibility

Show concise decision/progress summaries and real tool activity. Do not expose or persist private chain-of-thought.

Good examples:

- `Inspecting package scripts before changing the provider adapter.`
- `read_file · electron/agent-runtime-adapter.js · success`
- `run_command · npm test · exit 1`
- `Observation: provider endpoint unavailable; no retry scheduled until next explicit action.`

Bad examples:

- fabricated multi-step plans that were never emitted by the runtime;
- hidden reasoning transcripts;
- generic animated “thinking” stages presented as factual execution;
- fake diffs, fake receipts, or fake tool calls.

## Information-density guidance

The source prototype's useful visual characteristics are:

- dense dark surface;
- monospace runtime metadata;
- small actor markers;
- bordered inline tool cards/cells;
- compact status pill rather than large banners;
- dim secondary metadata;
- evidence references in the cell footer;
- chronological flow with no permanent tool side panel required for basic comprehension.

Letterblack product styling may adapt colors, spacing, fonts, and branding to the active design system. Preserve the information architecture, not literal CSS.

## Noise filtering

A live stream should not render every low-level poll or byte stream as a separate card.

Normally suppress or aggregate:

- idle status polling;
- module-registry heartbeat/status checks;
- terminal resize events;
- terminal byte/write events when a higher-level command execution record exists;
- renderer/preload IPC plumbing;
- repetitive health reads that do not change state.

Render meaningful transitions and actions instead.

## Relationship to detailed evidence views

The inline stream is the readable foreground view. Keep deeper evidence surfaces for debugging and audit:

- Complete chronological log;
- Execution Monitor / trace;
- terminal raw output;
- file diff;
- governed receipts;
- browser evidence artifacts.

The foreground stream should link or correlate to these rather than duplicate all raw content.

## Failure and blocked states

Failures are observations, not automatic semantic completion.

Render the actual failure inline, including classification/code where useful, then let the reasoning agent decide whether another relevant action is possible.

Examples:

- `read_file · NOT_FOUND`;
- `provider readiness · unavailable`;
- `run_command · blocked by governance`;
- `browser delivery · submitted_unverified`.

A blocked tool result is not an approval request.

## Browser-owned runtime example

```text
Browser instruction received
  instruction=i-42

Agent
  Inspecting the active workspace before modifying the provider adapter.

Tool call
  read_file · electron/agent-runtime-adapter.js
  SUCCESS
  evidence: op=... · tool=...

Tool call
  patch_file · electron/agent-runtime-adapter.js
  SUCCESS
  12 lines changed
  evidence: diff / receipt

Tool call
  run_command · npm test
  FAILED · exit 1
  observation: assertion mismatch

Agent
  Validation exposed a stale assertion. Updating only that regression.
```

No approval overlay is inserted between these actions.

## Cross-project implementation rule

When designing or reviewing a Letterblack agent/runtime UI, load this reference when the task involves any of:

- live tool-call UI;
- agent execution stream;
- agent TUI/operator console;
- runtime truth/progress UI;
- contextual tool cards;
- execution evidence visualization;
- browser/local agent workbench;
- approval UI removal or prevention.

Then inspect the active project's real event schema, tool receipts, correlation model, and instruction ownership before implementation. Do not copy a prototype's fake/sample states into production.
