# LBE Persistent Agent Wall — Workspace Status

## Knowledge metadata

- Last reviewed: 2026-08-08
- Project repository: `Letterblack0306/LBE_Presistent_Agent_wall`
- Active local workspace: `C:\Agents-Memory-Tool-v6-integration`
- Purpose: current project-status and implementation-progress record for the LBE Guard Inspector / reasoning-layer workspace
- Authority: status/reference only; repository design docs, live repository state, current Git revision, runtime evidence, and validation output remain authoritative

## Mandatory planning rule

Before proposing or implementing a new slice, read the repository's canonical architecture, status, and implementation documents first. Do not infer subsystem purpose from names, recent conversation, or the latest implementation slice when the repository already defines the method, ownership boundary, sequencing, and intended use.

Required order:

```text
canonical repository docs
  -> current repository / Git / runtime evidence
  -> identify the already-documented implementation slice
  -> implement only that slice
  -> validate against the documented contract
```

GPT-Knowledge is a navigation/status aid. It must not become a competing architecture or implementation-plan authority.

## Project role

This repository is the persistent-agent / Guard Inspector workspace. Its current architecture separates:

```text
User request
  -> LLM reasoning layer
  -> retrieval / evidence planning
  -> deterministic guard selection and execution
  -> validation
  -> LBE governance
  -> explanation
  -> optional governed workspace-rule proposal
```

The reasoning layer may interpret, plan retrieval, request evidence, select registered guards, explain deterministic results, and propose workspace-specific protection. It must not invent `PASS`/`FAIL`, authorize writes, replace validation, or silently create permanent policy.

## Canonical memory architecture

The repository's `docs/VALIDATED_WORKSPACE_MEMORY.md` defines the memory invariant:

```text
Session history records what happened.
Durable memory records only validated claims.
Live workspace inspection remains authoritative.
```

The documented flow is:

```text
Live workspace and Git
    -> deterministic evidence
    -> promotion policy
    -> project-scoped SQLite memory
    -> rehydrated context packet
    -> reasoning layer
```

This purpose must not be reinterpreted during runtime work.

### What memory is for

Memory exists to carry bounded, validated context across sessions and to help the reasoning layer understand prior patterns, methods, validated project facts, provenance, constraints, and useful historical context without replaying the entire transcript.

Reference-repository knowledge may provide patterns and methods that help the LLM decide where to inspect or which established approach may apply. Reference knowledge must be stored under a different project identity and at lower authority than current-project evidence.

### What memory is not for

Memory is not:

- universal workspace truth;
- proof of current files or runtime behavior;
- authority for current Git branch/HEAD;
- a substitute for current workspace inspection;
- a substitute for validation;
- a source of deterministic guard verdicts;
- a source of governance/write authority;
- proof that a prior solution still applies to a different project;
- permission to treat reference-repository patterns as current-project facts.

Interpretive claims such as `feature implemented`, `task complete`, `file broken`, or `defect fixed` remain unverified unless the required validator supplies explicit evidence.

### Cross-project use

The LLM/runtime may be used across different projects. The persistent memory architecture therefore must preserve project/workspace identity and evidence authority instead of allowing one project's remembered state to leak into another project as truth.

The correct cross-project relationship is:

```text
reference memory / prior projects
  -> suggest patterns, methods, likely inspection targets

current project identity
  -> bounds retrieval and state

current workspace + Git + runtime evidence
  -> establishes current facts

validation
  -> proves current result
```

A remembered pattern may guide investigation. It cannot prove that the current project has the same implementation, defect, configuration, ownership, or completion state.

## Runtime map relationship

The repository documentation also defines the Module Registry as the primary runtime map once available. The responsibilities remain distinct:

- validated memory answers what remains safe to carry across sessions;
- Module Registry/runtime receipts answer what modules exist, what loaded, what is running, dependencies, activity, and failures;
- Authority Ownership inspection determines the authoritative operation owner and bounded mutation/persistence paths;
- source inspection remains required when runtime/registry evidence is missing, stale, contradictory, ownership-sensitive, or exact implementation evidence is needed.

Do not make the memory database a replacement Module Registry or runtime-inspection system.

## Current canonical baseline

At the last merged reasoning milestone:

- `main` baseline: `baea87694337e56c4b12618d75528f2b7abec266`
- merged PR #27 head: `cd0b7031ec1026adb9ea4f681630de4f3d806008`
- latest merged capability: governed proposal-controller integration in the normal reasoning response path
- validated full-suite evidence for that merged slice: 468 tests passing

PR #27 is merged and the normal `/reasoning/run` path can return an optional governed read-only proposal through the existing response contract.

## Reasoning-layer progress

```text
Retrieval planning                 COMPLETE
Typed query / query discipline     COMPLETE
Evidence planning                  COMPLETE
Conflict / stop behavior           COMPLETE
Guard planning                     COMPLETE
Investigation planner              COMPLETE
Explanation layer                  COMPLETE
Workspace-rule proposal planner    COMPLETE
LLM/controller proposal wiring     COMPLETE + MERGED
Persistent runtime integration     IN PROGRESS
```

## Persistent runtime progress

### R1 — ownership audit + minimal task lifecycle contract

Reported complete and validated locally:

- existing `SessionMemoryRuntimeBridge` retained as the runtime integration owner;
- minimal `TaskStatus` lifecycle contract added/mapped to reasoning outcomes;
- no parallel lifecycle machine introduced;
- full suite reported at 464 passing for the R1 slice;
- `git diff --check` reported clean.

### R2 — canonical session/task state persistence

Reported complete and validated locally, pending normal branch/commit/merge workflow unless subsequently landed:

- existing `WorkspaceMemoryStore` reused; no second persistence subsystem;
- `TaskStatus` moved into typed memory models;
- typed `TaskState` added with session/task/workspace identity, status, outcome, and timestamps;
- `session_tasks` persisted in the existing SQLite memory schema;
- store supports save/load/list and visible failure on invalid persisted status;
- `SessionMemoryRuntimeBridge` records task status/outcome and loads persisted task status;
- focused runtime-memory tests reported: 14 passed;
- full suite reported: 470 passed;
- `git diff --check` reported clean.

These R1/R2 results are progress evidence, not permission to redefine memory as runtime truth.

## How R2 must be interpreted

R2 persists the already-documented session/task state using the existing project-scoped SQLite memory infrastructure. It does **not** change the fundamental memory authority model.

Persistence of a task record means the runtime can retain bounded state such as:

```text
session_id
task_id
project_workspace_id
canonical_workspace_root
TaskStatus
last_outcome
created_at
updated_at
```

It does not mean that the stored record can prove current workspace files, current Git state, runtime health, guard truth, or successful execution after the underlying workspace changes.

Any later rehydration/resume work must revalidate current workspace/Git/runtime evidence according to the repository docs rather than blindly trusting the persisted task record.

## Next-slice selection rule

Do not derive R3 from this GPT-Knowledge record alone.

Before issuing the next Cline implementation instruction:

1. read `docs/IMPLEMENTATION_PLAN.md` from the current LBE repository revision;
2. read `docs/CURRENT_STATUS.md`;
3. read `docs/VALIDATED_WORKSPACE_MEMORY.md`;
4. read the relevant runtime/session/checkpoint design docs referenced by that plan;
5. inspect the current branch/HEAD and R1/R2 implementation;
6. identify the next explicitly sequenced slice from those documents;
7. implement only that documented slice.

If repository docs and this status record disagree, repository docs at the current revision win. If docs are stale relative to proven implementation, update the canonical repo docs as part of the appropriate documentation task rather than silently replacing them with a new GPT-generated plan.

## Architectural invariants

Keep these stable unless the canonical repository architecture explicitly changes them:

```text
Reference knowledge guides discovery and method selection.
Current project identity bounds retrieval and persistence.
Current workspace/Git/runtime evidence establishes current facts.
Validated memory carries only appropriately supported claims/context.
The LLM interprets, selects, explains, and proposes.
Deterministic guards detect rule truth.
Validation proves the result.
LBE governance authorizes mutation.
The user approves persistent constraints where approval is required.
```

A successful historical test run, indexed match, memory record, prior conversation, reference repository, or this GPT-Knowledge status document alone is never sufficient evidence for current workspace truth.

## Workspace state and operating model

The active engineering workspace is currently recorded as:

```text
C:\Agents-Memory-Tool-v6-integration
```

At task start re-check rather than trusting this record:

```text
git branch --show-current
git rev-parse HEAD
git status --short
git fetch origin
```

Older parallel worktrees or repository copies are not automatically current truth.

## Cline local-agent guidance

The Cline guidance must enforce the same order:

```text
read canonical project docs
-> inspect current workspace/revision
-> use memory/reference knowledge only as bounded context
-> locate the documented active slice
-> implement against existing owners
-> validate with current evidence
```

Cline must not self-plan a replacement architecture simply because a component name suggests a familiar pattern. It should challenge stale docs with evidence, but it must first understand the project's existing documented method and why each subsystem exists.

## Update rule

Update this record only for meaningful project milestones, such as:

- a documented runtime slice completed/merged;
- canonical implementation-plan sequencing changed;
- a new canonical workspace/repository identity;
- an architecture/authority boundary change;
- a major validation baseline change;
- memory/runtime authority semantics changed in the canonical repo docs;
- superseding or retiring a previously canonical implementation path.

Do not update it for transient local edits, temporary command logs, or speculative future work.