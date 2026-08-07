# Project and Feature Implementation Plan

## Knowledge metadata

- Last reviewed: 2026-08-08
- Purpose: canonical first reference for learning an existing project or feature and planning any implementation, extension, replacement, or significant change
- Scope: cross-domain; applies before browser, agent, UI, provider, motion, branding, or other implementation-specific knowledge
- Authority: planning guide only; live project source, runtime evidence, and project-specific instructions remain higher authority

## Core rule

For any project or feature task, do not begin from a proposed solution.

Begin by learning what actually exists, establish the implementation boundary, then plan the smallest change that satisfies a proven requirement.

```text
Request
  -> project / feature learning
  -> active-owner discovery
  -> requirement + acceptance contract
  -> impact and dependency map
  -> implementation sequence
  -> validation plan
  -> implementation
  -> runtime/user-visible proof
  -> update learned state
```

This document is the first implementation-planning reference. Domain-specific knowledge is loaded after the project/feature boundary is understood.

---

# 1. Project identity before planning

Establish the target before interpreting requirements.

Record or prove:

```text
project/repository
workspace root
active branch/revision
runtime/environment
entry points
relevant package/module boundaries
project-specific instructions
current feature owner
```

Do not assume that a similarly named repository, file, class, route, UI control, or document is the active implementation.

If the project identity or active revision cannot be established, planning remains provisional.

---

# 2. Feature learning record

Before changing an existing feature, build a compact feature learning record from the live project.

Capture only what is relevant:

```text
Feature
  purpose
  user-visible behavior
  current entry point
  authoritative owner/module
  call/data/event flow
  state/config owners
  external dependencies
  permissions/approval boundaries
  UI bindings if any
  tests and validation surfaces
  runtime evidence
  known defects/gaps
  legacy or parallel implementations
```

The learning record is evidence-backed. Documentation, prior memory, and GPT-Knowledge may guide discovery but do not replace source/runtime inspection.

For a new feature, learn the nearest existing architecture and extension points instead of inventing a parallel subsystem.

---

# 3. Requirement contract

Translate the request into observable requirements before implementation.

Define:

- desired behavior;
- current behavior when relevant;
- in-scope surfaces;
- explicit constraints;
- required compatibility;
- failure behavior;
- non-goals only when they prevent scope drift;
- acceptance criteria that can actually be validated.

Prefer observable acceptance criteria.

Weak:

```text
Improve provider support.
```

Better:

```text
Configured providers are discovered through the existing registry, health is validated at runtime, unavailable providers remain distinguishable from unconfigured providers, and the UI reflects backend truth.
```

Do not turn an implementation guess from the request into a requirement unless the user explicitly requires that implementation.

---

# 4. Active-owner and architecture fit

Trace the requirement to the component that already owns the behavior.

Check:

1. entry point;
2. registry/router/factory/loader;
3. authoritative state owner;
4. execution owner;
5. UI/view owner where applicable;
6. persistence/configuration owner;
7. validation/test owner;
8. legacy or compatibility paths.

Before adding a new module or abstraction, prove that the required capability does not already exist in another active path.

Default preference:

```text
extend active authority
  > repair active authority
  > consolidate duplicate authority
  > introduce new authority only when architecture requires it
```

---

# 5. Impact and dependency map

Map the smallest affected surface before editing.

Typical categories:

```text
source modules
public contracts / schemas
configuration
state/persistence
provider/tool/API dependencies
UI bindings
security/permissions/approval
build/package/export surfaces
tests
runtime startup/lifecycle
documentation or migration
```

Classify each affected surface as:

```text
must change
must validate
must remain compatible
not in scope
```

This map is used to prevent both under-editing and unnecessary redesign.

---

# 6. Implementation decision

Choose the smallest architecture-consistent implementation that satisfies the requirement contract.

For each meaningful decision, know:

```text
what changes
why this owner is correct
what existing contract is reused
what dependency or state transition is involved
what can fail
how failure is surfaced
how the result will be validated
```

Do not choose a design merely because it is newer, more abstract, cleaner in isolation, or used by another project.

Reuse proven project conventions unless those conventions are the demonstrated cause of the defect.

---

# 7. Implementation sequence

Order work so that contracts and evidence become available as early as possible.

Recommended sequence:

```text
1. establish reproduction or current-state evidence
2. add/update focused regression or contract tests when appropriate
3. change the authoritative owner
4. wire registration/routing/state dependencies
5. update dependent UI/config/adapters only where required
6. run focused validation
7. run bounded duplicate/parallel-path scan
8. run broader regression validation
9. exercise the actual runtime/user path
10. capture completion evidence
```

Do not mechanically require tests-first when the task is documentation-only, visual-only, exploratory, or cannot be represented meaningfully by an automated test. The validation method must fit the claim.

---

# 8. Validation plan must exist before completion

Plan validation at the same time as implementation.

Use the minimum evidence ladder necessary for the claim:

```text
source proof
  -> static/build proof
  -> unit/contract proof
  -> integration proof
  -> runtime proof
  -> user-visible proof
```

Examples:

- library function change -> focused tests plus affected integration when relevant;
- API change -> request/response integration proof;
- provider integration -> configuration, reachability, authentication, capability, and execution proof;
- UI behavior -> rendered interaction plus backend/runtime consequence;
- agent autonomy -> operation/state-transition evidence across the real execution path.

Passing a lower evidence layer cannot justify a higher-layer claim.

---

# 9. Recovery, migration, and rollback

When state, persistence, public contracts, installation, deployment, or destructive changes are involved, define recovery before implementation.

Check whether the change needs:

- migration or backward compatibility;
- feature gating;
- idempotent retry behavior;
- rollback path;
- stale-state invalidation;
- data backup or reversible transformation;
- version or schema transition handling.

Do not add rollback machinery to trivial changes where it provides no value.

---

# 10. Implementation-plan output

For non-trivial project or feature work, the working plan should be representable as:

```text
Target
  project / revision / runtime

Learned current state
  active owner
  current behavior
  relevant flow
  evidence

Requirement
  desired observable behavior
  constraints
  acceptance criteria

Change surface
  authoritative files/modules/contracts
  dependencies
  compatibility boundaries

Implementation
  ordered smallest-correct changes

Validation
  focused checks
  runtime/user-visible proof
  regression/duplicate scan

Recovery
  only when required

Completion predicate
  exact evidence required before DONE
```

The plan is a live working contract, not a promise that every predicted file or step will remain correct. When inspection disproves a planned assumption, update the plan and follow the evidence.

---

# 11. Project/feature learning after implementation

After a meaningful implementation, preserve only durable learned facts that will help future work:

- authoritative owner or extension point;
- important contract or lifecycle behavior;
- non-obvious dependency;
- validation command or runtime proof path;
- migration/recovery rule;
- known intentional compatibility path.

Do not persist transient logs, speculative explanations, stale branch details, or facts already obvious from the code.

Project-specific knowledge should live with or near the project when possible. GPT-Knowledge should retain reusable cross-project methods rather than becoming a dump of every project detail.

---

# 12. Routing to domain knowledge

After the project/feature learning record and implementation boundary are established, load only the relevant domain knowledge.

Examples:

```text
Project feature involves agent runtime
  -> this guide
  -> inspect live project/feature
  -> ai-agents/unified-agent-engineering-methods.md

Project feature involves browser automation
  -> this guide
  -> inspect live project/feature
  -> browser-agents/browser-access-tooling-and-evidence.md

Project feature involves Letterblack UI
  -> this guide
  -> inspect live project/feature
  -> letterblack-branding/industrial-dark-ui-system.md
  -> ui-engineering only when runtime/shell wiring is involved

Project feature involves LM Studio
  -> this guide
  -> inspect live project/feature
  -> local-models/lm-studio-runtime-and-agent-integration.md
```

Domain knowledge refines the implementation method; it does not redefine the active project from outside.

---

## Final rule

**Learn the active project and feature first. Plan against proven ownership and observable acceptance criteria. Implement the smallest architecture-consistent change. Complete only with evidence matching the claim.**
