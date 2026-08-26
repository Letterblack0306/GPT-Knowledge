# LBE Terminal TUI — Native Cline/OpenTUI Integration Plan

Status: DOCUMENTED_INTEGRATION_DIRECTION
Implementation state: NOT_ACTIVE
Recorded: 2026-08-26
Projection owner: GPT-Knowledge
Canonical runtime authority: `Letterblack0306/LBE_Presistent_Agent_wall`

## Purpose

Record the user-approved integration direction for the LBE terminal interface without changing the canonical runtime gate or falsely claiming implementation.

## Product decision

**Cline CLI/OpenTUI is the base reference and base terminal UI implementation.**

LBE must not build a separate Python/Textual terminal, HTML look-alike, or independently designed imitation of Cline.

The implementation target is the native Cline CLI/OpenTUI source and interaction model, with LBE integrated into that same surface through branding and runtime-authority seams.

## Integration model

```text
Cline CLI source + native OpenTUI
        ↓
Cline runtime callback/event bridge
        ↓
LBE session/runtime adapter
        ↓
LBE permission boundary
        ↓
LBE governed tools
        ↓
LBE receipts / evidence / completion
```

Cline remains responsible for the terminal presentation mechanics and interaction surface. LBE remains responsible for consequence and authority.

## Cline base surface

The intended base is the native Cline CLI/OpenTUI implementation, including the interaction model represented by:

```text
apps/cli/src/runtime/run-interactive.ts
        ↓
apps/cli/src/tui/index.tsx
        ↓
OpenTUI + React terminal components
```

The runtime/TUI seam must support the same classes of events needed by the native Cline surface, including:

- user submit;
- abort/cancel;
- provider/model changes;
- streaming agent events;
- pending tool approvals;
- session lifecycle.

This callback/event seam is the intended LBE integration boundary.

## Cline package roles

The integration direction recognizes the following Cline package responsibilities:

- `@cline/sdk` — public programmatic SDK surface;
- `@cline/core` — sessions, orchestration, persistence, built-in tools and runtime services;
- `@cline/agents` — agent loop;
- Cline CLI source — native terminal/OpenTUI product surface.

The existing LBE repository already contains a bounded `@cline/agents` worker path. That lower runtime path does **not** prove the native Cline CLI/OpenTUI product surface is integrated.

## LBE ownership boundary

Reusing Cline as the base does not transfer LBE authority to Cline.

LBE retains ownership of:

- canonical workspace identity;
- session/runtime authority where defined by LBE contracts;
- permission and approval authority;
- governed filesystem/process/Git/external tool execution;
- receipts;
- evidence;
- validation/completion truth;
- persistent project constraints and governance.

Cline UI/runtime mechanics may request or project these operations, but they do not become a second authority owner.

## Permission integration

Native Cline tool-policy defaults must not silently become LBE policy.

The integration must provide explicit LBE-owned tool policies or custom approval handling so that every consequential action still crosses the LBE permission boundary.

```text
Cline tool request
      ↓
LBE policy / authorization decision
      ↓
allowed → governed adapter execution
blocked → native TUI receives denial/pending state
      ↓
receipt / evidence projected back into Cline TUI
```

There must be no direct Cline-native mutation path that bypasses LBE governance.

## Product identity and branding

The product presented to the user is **LBE**.

Cline remains the implementation base, but Cline branding is replaced by LBE product identity where the terminal presents the product itself.

Approved LBE supporting copy:

> Your agents propose. LBE decides.

Approved LBE SVG mark:

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

Branding must be restrained and terminal-native. LBE should not turn Cline's native terminal into a governance dashboard.

## UI behavior to preserve from Cline

Preserve the native terminal interaction model instead of recreating it:

- one terminal conversation surface;
- scrollable agent/user transcript;
- native inline tool activity;
- native pending approval interactions, backed by LBE authority;
- prompt/composer behavior;
- slash commands and file/context mentions where retained;
- model/provider/session controls where retained;
- native keyboard navigation;
- native OpenTUI styling/layout mechanics;
- compact status/projection surfaces.

## LBE additions inside the native surface

LBE-specific projection should be minimal and contextual:

- LBE product mark/name on welcome/product identity surfaces;
- `Your agents propose. LBE decides.` as restrained brand copy;
- permission result when LBE approval is required;
- governed tool state;
- receipt/evidence identifiers when useful;
- blocked/denied reason;
- completion/validation state when it materially helps the user.

Do not add permanent left/right governance dashboards or explanatory architecture panels.

## Explicitly rejected implementation directions

- separate Python/Textual replacement TUI;
- HTML implementation used as the real runtime surface;
- hand-built clone of Cline's terminal appearance;
- dashboard-first LBE shell around Cline;
- Cline-native filesystem/process/Git mutation bypassing LBE;
- Cline default auto-approval treated as LBE authorization;
- Cline session/completion ownership silently replacing existing LBE owners;
- Cline branding presented as the LBE product identity.

## Role of the HTML reference

The user-reviewed black `LETTERBLACK ENGINE` HTML remains a **visual branding/reference artifact only**.

It established useful LBE visual choices such as the approved mark, black terminal direction, restrained tagline, inline boundary presentation and compact status treatment.

It is **not** the implementation base and must not be used to claim native TUI completion.

## Current evidence state

Current canonical evidence indicates:

- the LBE machine gate is closed;
- `active_slice = NONE`;
- `implementation_allowed = false`;
- architecture changes are allowed only under repository governance;
- the repository contains the bounded Cline worker/lower runtime integration;
- the native Cline CLI/OpenTUI source surface is not currently integrated into the LBE repository.

Therefore this remains a documented next integration boundary, not an implemented feature.

## Future implementation slice

The next authorized UI integration slice should explicitly activate the native Cline CLI/OpenTUI surface and define:

1. exact Cline CLI source/revision to integrate;
2. retained native OpenTUI components and runtime bridge ownership;
3. LBE branding replacement points;
4. submit/abort/provider/model/event/session callback mapping;
5. LBE session/runtime adapter contract;
6. explicit LBE tool-policy and approval bridge;
7. governed tool dispatch mapping;
8. receipt/evidence projection back into the native TUI;
9. completion-state projection;
10. validation proving no Cline-native authority bypass exists.

## Acceptance criteria

A future implementation is aligned only when:

1. the running product uses the native Cline CLI/OpenTUI implementation as its base surface;
2. the UI is branded as LBE rather than Cline;
3. the terminal interaction mechanics remain recognizably native Cline/OpenTUI rather than a clone;
4. Cline UI events are mapped into the LBE runtime adapter;
5. consequential tool execution crosses the LBE permission boundary;
6. explicit LBE policies/custom approval handling override unsafe Cline defaults;
7. receipts/evidence/completion states originate from LBE owners and are projected back into the TUI;
8. no second filesystem/process/Git/session/completion authority is introduced;
9. the HTML reference is not used as implementation proof;
10. installed runtime acceptance proves the complete native TUI → LBE → governed tool → receipt/evidence/completion round trip.

## Authority boundary

This file records integration intent only.

It does **not**:

- activate an implementation slice;
- change `.lbe/governance/implementation-gates.json`;
- prove native Cline/OpenTUI integration exists;
- authorize mutation of the LBE repository;
- supersede canonical runtime/source evidence.

Until canonical implementation evidence exists, this plan remains `DOCUMENTED_INTEGRATION_DIRECTION / NOT_ACTIVE`.
