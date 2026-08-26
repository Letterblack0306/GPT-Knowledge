# LBE Terminal TUI — UI Direction Plan

Status: DOCUMENTED_UI_DIRECTION
Implementation state: NOT_ACTIVE
Recorded: 2026-08-26
Projection owner: GPT-Knowledge
Canonical runtime authority: `Letterblack0306/LBE_Presistent_Agent_wall`

## Purpose

Record the user-approved visual/product direction for the LBE terminal interface without changing the canonical runtime gate or falsely claiming implementation.

## Core UI rule

LBE must look and behave first like a normal coding-agent terminal TUI.

It is **not** a governance dashboard, web application shell, proof dashboard, architecture explainer, or multi-column control surface.

The interface should follow the same basic interaction model users expect from terminal coding agents such as Cline CLI:

- one terminal conversation surface;
- scrollable agent/user transcript;
- inline tool activity;
- inline approvals only when actually needed;
- prompt/composer at the bottom;
- compact terminal status information;
- file and slash-command affordances;
- no permanent left navigation rail;
- no permanent right governance/proof rail.

## LBE identity

The product identity is LBE, not Cline.

Cline is a mechanics/reference source for terminal interaction patterns only. The UI must not inherit Cline product branding or imply that Cline owns LBE runtime authority.

### Brand mark

Use the approved LBE SVG mark:

```svg
<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <g class="lg-outer"><rect x="4" y="4" width="292" height="292" rx="52" class="lg-fill"></rect></g>
  <g class="lg-inner">
    <rect x="30" y="30" width="240" height="240" rx="38" fill="var(--bg-inset)"></rect>
    <rect class="lg-frame lg-stroke" x="64" y="64" width="172" height="172" rx="10" fill="none" stroke-width="17"></rect>
    <path class="lg-bracket-l lg-stroke" d="M120 112 H102 V188 H120" fill="none" stroke-width="16" stroke-linecap="square"></path>
    <path class="lg-bracket-r lg-stroke" d="M180 112 H198 V188 H180" fill="none" stroke-width="16" stroke-linecap="square"></path>
    <rect class="lg-bar lg-fill" x="141" y="107" width="18" height="86"></rect>
  </g>
</svg>
```

Approved supporting copy:

> Your agents propose. LBE decides.

This copy is branding, not an instruction to turn the interface into an explanatory governance surface.

## Idle / launch state

The terminal launch state should remain sparse:

1. terminal chrome / current workspace context;
2. LBE identity;
3. approved LBE mark;
4. primary prompt such as `What can I do for you?`;
5. restrained supporting line `Your agents propose. LBE decides.`;
6. composer/input;
7. compact status footer.

The idle state must not contain architecture diagrams, proof chains, promotion flows, governance cards, or explanatory product copy.

## Conversation state

Once a task starts, the center of gravity is the transcript.

Expected visual order:

```text
user request
agent response / reasoning summary
inline tool call
inline tool output
optional LBE boundary event when relevant
agent continuation
...
composer
status footer
```

Normal read, search, edit, test, shell, diff, and tool events should appear inline in the conversation rather than in separate dashboards.

## LBE boundary presentation

LBE should surface only where the boundary is materially relevant.

Examples:

- a governed action is about to cross an authority boundary;
- explicit approval is genuinely required;
- a governed execution receipt is useful;
- a blocked action must explain why LBE prevented it;
- completion/validation evidence needs a concise inline status.

The boundary should appear as a compact terminal-native event, not a permanent panel.

Example:

```text
LBE boundary · execution remained inside active workspace · receipt rcpt_…
```

Do not continuously explain LBE architecture during normal work.

## Composer

The composer should behave like a coding-agent terminal input:

- normal text prompt;
- Enter to send;
- Shift+Enter for newline where supported;
- `/` commands;
- `@` file/context references;
- terminal-native focus and keyboard behavior.

Avoid web-form styling that makes the input look like a dashboard widget.

## Status area

Keep persistent status compact and operational.

Useful status may include:

- provider/model;
- context/cost where available;
- mode;
- workspace/repository/branch;
- diff counts;
- LBE boundary active state;
- current approval policy.

Do not use the status area for prose explanations.

## Explicitly rejected UI direction

The following earlier prototype direction is rejected for the terminal product surface:

- three-column web dashboard;
- permanent session/navigation sidebar;
- permanent proof/promotion rail;
- `consequence chain` as a primary UI concept;
- `promotion proof` as a permanent panel;
- architecture/tutorial terminology such as `truth boundary` or `governed turn` presented continuously;
- oversized governance cards dominating the conversation;
- explaining LBE instead of letting the terminal behave like a normal coding agent.

## Current HTML reference

The user-reviewed reference on 2026-08-26 established the intended visual direction:

- black terminal-first canvas;
- compact terminal chrome;
- `LETTERBLACK ENGINE` identity;
- centered LBE logo only for idle state;
- `What can I do for you?` primary prompt;
- `Your agents propose. LBE decides.` supporting line;
- inline conversation/tool activity;
- compact LBE boundary event;
- bottom composer;
- compact model/workspace/boundary status lines.

The HTML reference is a visual/product-direction artifact only. It is not proof that the canonical LBE TUI currently implements this design.

## Acceptance criteria for a future implementation slice

A future UI implementation may be considered aligned with this plan only when:

1. the default surface is recognizably terminal-first rather than dashboard-first;
2. conversation is the dominant surface;
3. no permanent left or right dashboard rails are required for normal operation;
4. LBE branding uses the approved mark and product identity;
5. `Your agents propose. LBE decides.` is used only as restrained brand copy;
6. tool calls and outputs remain inline;
7. LBE governance appears inline and only when relevant;
8. composer and keyboard behavior remain terminal-agent oriented;
9. status information is compact and operational;
10. runtime behavior remains owned and proven by the canonical LBE repository, not by this GPT-Knowledge projection.

## Authority boundary

This file records UI intent only.

It does **not**:

- activate an LBE implementation slice;
- change `.lbe/governance/implementation-gates.json`;
- prove the TUI is implemented;
- supersede canonical runtime/source evidence;
- authorize repository mutation in the LBE workspace.

Until canonical implementation evidence exists, this plan remains `DOCUMENTED_UI_DIRECTION / NOT_ACTIVE`.
