# LBE Completion Contract and Validation Evidence Study

Updated: 2026-08-10
Status: Research reference; implementation-neutral

## Purpose

Record the evidence used before changing LBE Persistent Agent completion, validation, or CLI behavior.

This study exists to prevent architecture decisions from being made from model preference or incomplete local inspection. It is guidance for implementation planning, not a substitute for checking the current repository and live workspace state.

## Research gate

Before a major LBE agent/CLI architecture change:

1. read the relevant GPT-Knowledge design references;
2. verify the current implementation and repository head on GitHub;
3. inspect current local diff/state through Letterblack_BirdEye when local evidence is needed;
4. inspect relevant primary/live examples where the design question has established implementation patterns;
5. update the plan/reference docs when the evidence changes the dependency order;
6. only then begin a code patch.

This is an informative engineering discipline, not a runtime blocker or a new governance authority.

## Existing LBE invariant

The existing control-plane reference states:

```text
Provider reasons.
External agent proposes and interacts.
LBE runtime orchestrates.
CLI/API transport requests capabilities.
Guards detect.
Workspace evidence supplies current facts.
LBE governance authorizes.
Validation proves.
Persistent session state belongs to LBE.
User-configured policy decides when another confirmation is required.
```

Source:
- `ai-agents/lbe-cli-control-plane-provider-boundary.md`
- verified blob during this study: `f19e97f8da7495405fe143b695679f7535a0808c`

The same reference assigns deterministic validation requirements and completion proof to LBE, not the provider.

## Current implementation evidence

Repository checked:
- `Letterblack0306/LBE_Presistent_Agent_wall`
- verified main head during this study: `3deef36afd0b635f43d234fce6672d9de78e086c`

Observed implementation facts:

### 1. Model-selected validation IDs are forbidden

`lbe_guard_inspector/request_controller.py` rejects non-empty `ReasoningPlan.validation_requests` with `MODEL_VALIDATION_REQUEST_FORBIDDEN` and states that deterministic validation is owned by LBE.

Implication: completion requirements cannot be derived from model-selected validation names.

### 2. Coding completion is provisional

`lbe_guard_inspector/runtime/completion_runtime.py` routes a reasoning outcome of `COMPLETED` to task state `RUNNING` with `AWAITING_VALIDATION`.

Implication: provider completion prose is not canonical completion truth.

### 3. Completion contracts can be persisted, but production derivation is missing

`CodingCompletionRuntime.persist_contract()` persists an already-resolved `TaskCompletionContract`. Its own contract says it does not derive policy.

Current repository inspection found no production path establishing that contract for a real coding task; calls were confined to tests/manual paths at the time of this study.

Implication: persistence exists before authoritative contract resolution is wired into production task establishment.

### 4. Producer-bound completion evidence can be persisted

PR #46 / main head above added durable task-bound completion evidence carrying:

- session/task/workspace identity;
- semantic evidence kind;
- PASS/FAIL/STALE status;
- producer ID;
- operation ID;
- source/details.

`CodingCompletionRuntime.load_evidence()` is deliberately read-only; the CLI/provider/completion gate does not classify evidence itself.

Implication: the storage boundary is compatible with trusted validation producers, but a producer path still needs to exist for each supported semantic evidence kind.

### 5. Generic command/tool success is not semantic completion proof

Existing command/tool result persistence can prove facts such as exit codes and structured tool success, but it does not by itself prove task-specific meanings such as `focused_test`, `source_change`, or another completion requirement.

Implication: an arbitrary successful command must not be relabeled as completion evidence by the provider or CLI.

## Primary live examples

These examples are references for architectural properties, not code to copy.

### GitHub required status checks

Primary documentation:
- https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches
- https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks

Relevant property:

- requirements are configured independently of a particular check execution;
- checks/statuses report outcomes;
- required checks must satisfy the gate before the protected transition occurs;
- GitHub can restrict the expected source of a required status check.

LBE implication:

```text
completion requirement
    !=
producer execution
    !=
completion gate
```

The requirement should exist first, a trusted producer should report evidence, and the gate should evaluate the stored requirement against accepted evidence.

### LangGraph persistence / durable execution

Primary documentation:
- https://docs.langchain.com/oss/python/langgraph/persistence
- https://docs.langchain.com/oss/python/langgraph/functional-api

Relevant property:

- durable state is attached to thread/task identity;
- checkpoints preserve execution state across interruption;
- task outputs are persisted as execution progresses;
- resume uses recorded durable state rather than reconstructing state from conversational prose.

LBE implication:

Task completion requirements should be durable task/session state once resolved. Resume should reload the same contract rather than ask a new provider to reinterpret what proof was originally required.

### Temporal durable execution

Primary documentation:
- https://docs.temporal.io/

Relevant property:

- durable workflow state survives process/infrastructure failure;
- execution resumes from persisted workflow history/state rather than starting from an inferred narrative.

LBE implication:

The completion contract belongs to the persistent task lifecycle and must survive provider/process changes.

## Evidence-backed architecture conclusion

The next prerequisite is not `lbe session validate`.

The required order is:

```text
task/session established
        |
        v
LBE-owned task/policy boundary resolves completion requirements
        |
        v
immutable task completion contract persisted
        |
        v
governed registered validation producers execute
        |
        v
producer-bound semantic completion evidence persisted
        |
        v
existing deterministic completion gate evaluates contract + evidence
        |
        v
CLI/API exposes the result
```

## What must not own the contract

Do not derive completion requirements from:

- model prose;
- `ReasoningPlan.validation_requests`;
- arbitrary CLI `--evidence-kind` style arguments;
- raw command exit code alone;
- historical checkpoint summaries;
- indexed reference knowledge;
- a second CLI-side policy resolver.

## Open design question

The evidence does **not yet prove which existing production LBE component should resolve the task completion contract**.

Current candidates must be researched against live source before implementation, including:

- task establishment / request envelope semantics;
- persistent session policy/profile identifiers;
- typed mode/capability contracts;
- existing evidence/validation policy concepts;
- behavior contracts;
- registered validation capability metadata.

Do not create a new generic `CompletionContractResolver` merely because the persistence API needs a caller. First prove whether an existing LBE owner already contains the needed policy semantics.

## Next implementation research sequence

1. identify the canonical production task-establishment boundary;
2. identify the current LBE-owned source of task validation policy, if one exists;
3. define the smallest deterministic mapping from that source to `TaskCompletionContract`;
4. persist the contract once per task and fail closed on incompatible replacement;
5. define registered trusted producers for only the evidence kinds the contract can require;
6. persist producer-bound evidence;
7. wire `lbe session validate` only as a thin load-and-finalize surface;
8. prove the path end-to-end before R7 acceptance.

## Acceptance evidence for the future slice

A future implementation should demonstrate at least:

- a real coding task receives a completion contract without provider selection of evidence IDs;
- the contract survives provider switching and restart/resume;
- a missing required producer result leaves the task incomplete;
- a FAIL result cannot be hidden by later command success;
- arbitrary command/tool success cannot impersonate a semantic evidence kind;
- `session validate` cannot manufacture or relabel evidence;
- final completion is produced only by the existing deterministic completion gate;
- live workspace/evidence state remains authoritative over checkpoint/history context.

## Boundary

This research does not authorize a code change by itself. Current GitHub source and current local workspace evidence must be rechecked immediately before implementation.