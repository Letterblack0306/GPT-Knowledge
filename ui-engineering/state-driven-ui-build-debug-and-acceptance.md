# State-Driven UI Build, Debug, and Acceptance

## Status

Canonical reusable UI-engineering method for Letterblack projects.

This method applies to UI feature building, UI debugging, runtime integration, acceptance testing, regression verification, and operator workflows. It is framework-agnostic: Electron, WPF, WinUI, Tauri, web apps, browser extensions, IDE panels, and other interactive shells should follow the same evidence model.

## Core rule

Do not make a human repeatedly click through UI steps to discover whether the system works when the sequence can be expressed as observable state transitions.

Do not automate by blindly clicking controls with fixed sleeps either.

Use a state-gated acceptance driver:

```text
perform one action
  -> observe the authoritative resulting state
  -> verify the step predicate
  -> record evidence
  -> only then perform the next action
```

If the predicate is not proven, stop at that step and report the exact blocker. Do not continue clicking and do not reinterpret an intermediate state as success.

## Why

Manual click-hunting creates several recurring failures:

- the operator must repeatedly discover the next button;
- timing changes produce false failures or false passes;
- one failed step can be hidden by later clicks;
- UI text may say success while the backend/runtime never changed;
- fixed-delay automation advances before the system is ready;
- screenshot-only verification can miss incorrect runtime ownership;
- debugging becomes dependent on a human remembering the correct sequence;
- regressions are difficult to reproduce consistently.

The acceptance sequence should instead encode what the product claims to do.

## Two validation layers

Keep these separate.

### 1. State-driven runtime acceptance

This is the primary validation path.

Invoke the same runtime/IPC/application action that the UI control invokes, then verify the authoritative state or downstream consequence.

Examples:

```text
startRuntime()
  -> runtime.lifecycle == ready

startBrowserLoop()
  -> relay.lifecycle == waiting_for_instruction

submitInstruction()
  -> instruction state == executing
  -> required tool event observed
  -> completion state == completed

queueResult()
  -> journal state == result_queued

deliverResult()
  -> delivery accepted/verified
  -> pendingResult == false
  -> relay returns to waiting_for_instruction
```

This layer proves product behavior independently of renderer wiring.

### 2. Physical UI wiring acceptance

Use real UI clicking only to prove that the visible control is connected to the already-proven application action.

For each critical control:

```text
locate semantic control
  -> click it
  -> prove expected application action/event occurred
  -> prove authoritative state changed
  -> prove visible UI updated from that state
```

Do not make coordinate-based clicking the primary product acceptance method when semantic selectors, accessibility IDs, test IDs, IPC calls, or application APIs are available.

## Required step contract

Each automated acceptance step should define:

```text
stepId
purpose
precondition
action
successPredicate
failurePredicate
timeout
evidenceToCapture
nextStep
```

Example:

```text
stepId: browser-loop-ready
precondition: runtime.lifecycle == ready
action: startBrowserLoop()
successPredicate: relay.lifecycle == waiting_for_instruction
failurePredicate: relay.lifecycle in [degraded, recovery, stopped]
timeout: bounded
evidenceToCapture:
  - runtime status
  - relay status
  - target identity
  - correlated diagnostics
nextStep: submit-test-instruction
```

## No blind sleeps

A delay is not a success predicate.

Avoid:

```text
click Start
sleep 2000
click Next
sleep 3000
assume ready
```

Prefer:

```text
click Start
wait until runtime.lifecycle == ready
assert endpoint exists
assert backendReady == true
then continue
```

Small polling intervals may be used to observe state, but progression must be gated by a real condition.

## Fail-fast rule

When a step fails:

1. stop advancing;
2. preserve the current application/runtime state;
3. capture the earliest incorrect observable state;
4. capture correlation IDs, target IDs, operation IDs, and relevant logs;
5. classify the failure layer;
6. report expected versus actual state;
7. do not perform recovery clicks unless recovery itself is the scenario being tested.

Example output:

```text
[5/8] Browser instruction captured .... PASS
[6/8] Browser research executed ....... FAIL

expected:
  owned browser target
actual:
  transport target
code:
  BROWSER_TARGET_NOT_OWNED

execution stopped at step browser-research-executed
```

## Evidence ladder for UI work

A UI claim should be validated at the level it implies.

```text
source wiring
  -> renderer/unit proof
  -> action/IPC contract proof
  -> runtime state proof
  -> integrated UI action proof
  -> rendered user-visible proof
```

Examples:

- “button exists” -> source/render proof;
- “button is wired” -> real click plus application action/event proof;
- “Start works” -> click/action plus runtime ready state;
- “browser loop works” -> start action plus real capture/execution/delivery state sequence;
- “result was delivered” -> send acceptance plus rendered-delivery verification when the product promises rendered delivery.

Never promote a lower evidence level to a stronger claim.

## UI debugging method

When a UI feature fails, trace from the visible symptom backward through ownership instead of clicking around until behavior changes.

```text
visible symptom
  <- renderer state
  <- IPC/event projection
  <- application state
  <- runtime/service state
  <- actual operation/result
```

Find the earliest incorrect state.

Then create or extend the acceptance runner so the discovered regression becomes machine-reproducible.

A bug is not fully closed merely because the developer manually reproduced a fixed screen once. The corrected path should have a repeatable acceptance predicate whenever practical.

## UI building method

For new interactive features, define the state/action contract before polishing the visible control.

Recommended order:

```text
requirement
  -> authoritative state owner
  -> action API / IPC contract
  -> state transitions
  -> acceptance predicates
  -> runtime implementation
  -> UI projection
  -> physical control wiring
  -> automated state-driven acceptance
  -> focused visual/usability verification
```

This prevents the UI from becoming the hidden state machine or the only way to exercise the product.

## Sequential acceptance runner

For workflows with multiple controls or phases, provide a repository-owned runner such as:

```text
npm run acceptance:runtime
npm run acceptance:ui
npm run acceptance:all
```

or the equivalent command for the project stack.

Expected output should identify every gate:

```text
[1/8] Runtime ready ................ PASS
[2/8] Browser backend ready ........ PASS
[3/8] Transport attached ........... PASS
[4/8] Loop waiting ................. PASS
[5/8] Instruction captured ......... PASS
[6/8] Tool execution ............... PASS
[7/8] Result delivery verified ..... PASS
[8/8] Returned to waiting .......... PASS

ACCEPTANCE: PASS
```

The runner must return a non-zero exit status when a required gate fails.

## Selector rule for UI automation

Prefer stable semantic identity in this order:

1. application action/API or IPC endpoint for primary runtime acceptance;
2. accessibility role/name or stable automation ID;
3. project-owned test ID;
4. stable semantic DOM selector;
5. visible text only when unique and contractually stable;
6. coordinates only as a last-resort visual-system test.

Do not bind critical acceptance to pixel coordinates, transient CSS classes, layout order, or animation timing unless those visual properties are themselves the feature under test.

## Visual validation remains separate

State-driven acceptance does not replace visual inspection.

Visual checks are still required when the claim concerns:

- clipping;
- overlap;
- alignment;
- responsive layout;
- focus visibility;
- color/contrast;
- animation/motion;
- typography;
- z-order;
- hit targets;
- platform rendering.

But visual checks should occur after functional state truth is established, so appearance is not mistaken for runtime correctness.

## Side-effect boundary

Acceptance automation must preserve the same policy and authority boundaries as the product.

Do not add a testing backdoor that bypasses:

- workspace containment;
- authentication;
- target ownership;
- external-action authorization;
- change governance;
- duplicate-delivery protection;
- security checks.

The runner may invoke the same internal action surface as the UI, but it should not manufacture success or skip the product boundary being validated.

## Recovery testing

Normal acceptance should stop on failure.

Recovery scenarios should be explicit separate cases:

```text
normal-start-and-complete
restart-during-execution
restart-with-result-queued
transport-temporarily-unavailable
stale-target-after-browser-restart
user-stop-during-provider-call
```

Do not mix automatic recovery clicks into the normal happy-path test because they can hide the original defect.

## Long-running project rule

Whenever repetitive human UI steps begin appearing during development or debugging, ask:

```text
Can this sequence be represented as application actions plus observable predicates?
```

If yes, create or extend the acceptance runner before continuing repeated manual testing.

This applies not only at final QA. It should be used during feature construction and debugging so each newly proven layer becomes reusable evidence for the next layer.

## Completion predicate for UI changes

A meaningful UI/runtime feature is complete only when:

```text
intended UI exists
AND control is wired to the intended action
AND authoritative runtime consequence is proven
AND visible state reflects that consequence
AND required sequential workflow passes without manual intervention
AND relevant visual/usability checks pass
AND failure output is diagnostic enough to identify the blocked step
```

For workflows involving external services or a real user-facing transport, separate local integration acceptance from the final real external-path acceptance. A stubbed channel can prove local sequencing but must not be described as proof of real external delivery.

## Relationship to agent reasoning

This method is deterministic validation infrastructure, not a semantic reasoning replacement.

An agent may still decide what evidence to collect, what hypothesis to test, or what browser/tool action is useful. The acceptance runner owns only known mechanical predicates for a declared scenario.

```text
agent reasons
runtime executes
acceptance runner verifies declared state transitions
UI projects runtime truth
```

Do not turn the acceptance runner into a second planner that interprets arbitrary user objectives.
