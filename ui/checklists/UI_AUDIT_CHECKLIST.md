# UI Audit Checklist

## Scope and workflow

- [ ] The audited user goal is stated.
- [ ] Primary and secondary workflows are separated.
- [ ] Internal modules are not exposed as navigation without user value.
- [ ] Duplicate destinations and duplicate controls are removed.

## Navigation and hierarchy

- [ ] Primary navigation represents distinct user goals.
- [ ] The current location is clear.
- [ ] The primary next action is visually dominant.
- [ ] Advanced and diagnostic controls use progressive disclosure.
- [ ] Labels use user language rather than implementation jargon.

## Control wiring

For every interactive control:

- [ ] A real handler exists.
- [ ] Required inputs are validated.
- [ ] Disabled conditions are correct.
- [ ] Running state is visible.
- [ ] Success, partial, blocked, and failure states are represented.
- [ ] Cancellation behavior is defined where applicable.
- [ ] A test or runtime receipt proves the action works.

## Local resource selection

- [ ] File/folder selection uses a native picker where available.
- [ ] Manual path entry is not the only selection method.
- [ ] The resolved path is visible.
- [ ] Existence, permissions, containment, and conflicts are validated.

## Content states

- [ ] Loading state identifies what is loading.
- [ ] Empty state explains what belongs there and the next action.
- [ ] Error state names the failed operation and recovery action.
- [ ] Stopped and idle states are distinguishable.
- [ ] No fake progress, fake success icon, or unexplained status marker exists.

## Layout

- [ ] Resizers do not cover controls or content.
- [ ] Each region has a usable minimum size.
- [ ] Narrow, wide, short, and high-density cases are tested.
- [ ] Toolbars and status bars do not obscure scrollable areas.
- [ ] Secondary panels can collapse or move out of the main workflow.
- [ ] Layout preferences persist when appropriate.

## Forms and settings

- [ ] Fields have persistent labels.
- [ ] Help text explains unfamiliar values.
- [ ] Defaults are visible and safe.
- [ ] Validation is associated with the affected field.
- [ ] Save/apply behavior is explicit.
- [ ] Unsaved changes are not silently discarded.

## Diagnostics

- [ ] Logs, trace, changes, evidence, and runtime data are grouped coherently.
- [ ] Filters map to real diagnostic questions.
- [ ] Raw data is secondary to a readable summary.
- [ ] Completion claims link to evidence.

## Accessibility

- [ ] Full workflow is keyboard-operable.
- [ ] Focus order follows visual and task order.
- [ ] Focus is visible.
- [ ] Controls have accessible names and states.
- [ ] Color is not the only status signal.
- [ ] Contrast is sufficient.
- [ ] Motion respects reduced-motion preferences.
- [ ] Dialog focus is contained and restored.

## Technical integrity

- [ ] No duplicate DOM IDs.
- [ ] No missing referenced elements.
- [ ] No dead controls.
- [ ] No API caller without a matching route.
- [ ] No route without an intended caller or documented external consumer.
- [ ] No unreachable visible module.
- [ ] No hidden duplicate module mounted in the DOM.
- [ ] No syntax or console errors.

## Runtime proof

- [ ] The application launches through its real entry point.
- [ ] The target workflow is completed with realistic data.
- [ ] Failure and recovery paths are exercised.
- [ ] Resize and keyboard behavior are observed in the running application.
- [ ] The final report distinguishes implemented, validated, pending, and not tested.
