# UI/UX Engineering Playbook

## Purpose

This playbook defines reusable UI engineering rules that apply across products. It is not tied to IDEs, dashboards, desktop apps, or any single design system.

## 1. Start from the user workflow

Before changing UI:

1. identify the user's primary goal;
2. identify the minimum sequence required to complete it;
3. separate primary actions from diagnostics and secondary controls;
4. remove duplicate or unexplained navigation;
5. define success, blocked, partial, and failure outcomes.

Do not organize the interface around internal modules when the user thinks in tasks.

## 2. Information architecture

- Primary navigation should represent major user goals.
- Supporting information belongs in contextual panels, drawers, expandable sections, or a shared diagnostics area.
- Avoid one tab per backend subsystem.
- Do not expose implementation terminology unless it is already meaningful to the user.
- Group actions by workflow and lifecycle, not by where the code lives.

## 3. Visual hierarchy

Every screen should clearly communicate:

1. where the user is;
2. what the screen is for;
3. the current state;
4. the primary next action;
5. secondary options;
6. supporting evidence or details.

Use spacing, typography, grouping, and alignment before adding more borders or cards.

## 4. Control contract

Every interactive control must have a documented contract:

- user-visible label;
- purpose;
- backend or local handler;
- input requirements;
- disabled conditions;
- running state;
- success state;
- partial or warning state;
- failure state;
- cancellation behavior;
- validation proof.

A button with no proven operation is a defect, even if it renders correctly.

## 5. Inputs and pickers

- Use native file and folder pickers when selecting local resources.
- Manual path entry may exist as an advanced fallback, not the only method.
- Show the resolved path after selection.
- Validate existence, permissions, scope, and conflicts before starting work.
- Preserve recent valid selections when appropriate.

## 6. Operational states

Long-running operations must expose:

- current state;
- current activity or phase;
- start time or elapsed time when useful;
- progress only when it is real and measurable;
- last completed action;
- completion summary;
- errors with a recovery action;
- stop or cancel when cancellation is supported.

Do not use fake percentages or unexplained check marks.

## 7. Empty, loading, and error states

An empty state should explain:

- what normally appears here;
- why it is currently empty;
- what the user should do next.

A loading state should identify what is loading. An error state should identify the failed operation, likely cause when known, and next valid action.

## 8. Layout and resizing

- Resizers must not overlap content.
- Every resizable area needs a minimum usable size.
- Persist layout preferences when the product benefits from it.
- Validate narrow, wide, short, and high-density content cases.
- Prevent toolbars and status areas from covering scrollable content.
- Use one dominant workspace and subordinate supporting regions.

## 9. Progressive disclosure

Show the minimum required controls first. Move advanced configuration, diagnostics, and raw data behind explicit expansion or secondary navigation.

Do not hide required controls. Do not expose every optional control simultaneously.

## 10. Navigation economy

Before adding a navigation item, ask:

- Is this a distinct user goal?
- Is it used frequently enough to remain visible?
- Can it be contextual to another workflow?
- Is the same functionality already available elsewhere?

A large navigation rail is not evidence of capability; it often indicates poor grouping.

## 11. Diagnostics and evidence

Logs, traces, activity, runtime details, changes, and evidence should usually share a unified diagnostics surface with filters rather than becoming separate primary destinations.

Diagnostics must help answer a concrete question:

- What is happening?
- What changed?
- Why did it fail?
- What evidence supports completion?

## 12. Templates and automation

- User-defined triggers and workflows are primary.
- Existing templates should be previewable and copyable.
- Generated templates must never replace user control.
- Clearly distinguish examples, active configuration, and generated suggestions.

## 13. Accessibility

Verify:

- keyboard navigation;
- logical focus order;
- visible focus indication;
- semantic labels;
- screen-reader names and states;
- contrast;
- reduced-motion behavior;
- error association with fields;
- modal focus containment and restoration.

## 14. Validation sequence

A UI change is not complete until it passes:

1. structural validation;
2. control-binding validation;
3. backend contract validation;
4. state-transition validation;
5. resize and overflow validation;
6. keyboard and accessibility validation;
7. realistic runtime proof;
8. regression protection.

## 15. Knowledge promotion rule

Project-specific findings stay in the project repository. A finding is promoted here only when it is reusable across products and backed by either authoritative research or repeated validated implementation evidence.
