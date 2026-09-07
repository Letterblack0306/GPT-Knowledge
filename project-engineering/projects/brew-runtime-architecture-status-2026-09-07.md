# Brew Runtime Architecture Status — 2026-09-07

## Knowledge metadata

- Reviewed: 2026-09-07
- Brew repository: `Letterblack0306/brew`
- Remote authority checked: `main`
- Brew remote `main` observed: `579e5ee3648a06533d6dc5b110ae64cb1aaf3490`
- Latest observed main commit: `test: cover local tool hot reload`
- Open integration PR #442 head observed: `486a9b433ead59a470e511236139e8201ed292ba`
- PR #442 compare against current main: 78 commits ahead, 4 behind, diverged
- Local Brew worktree/runtime identity: not re-proven by this GitHub-only review
- Evidence level of this record: **STATIC TRACE CONFIRMED** unless a row explicitly says otherwise
- Authority: current Brew source/runtime and exact revision evidence outrank this record

## Purpose

This record supersedes the 2026-08-17 Brew architecture projection for current source interpretation.

It exists because the current Brew repository shows both:

1. a canonical one-agent conversational path; and
2. still-reachable auxiliary/legacy planning and orchestration surfaces.

The correct action is not to delete anything named planner, router, loop, agent, or coordinator. Each surface must be classified by actual caller, reachability, semantic authority, and execution role.

## Canonical reasoning path

Current source supports this canonical conversational path:

```text
orchestrator / gateway
  -> POST /query
  -> handleCanonicalQueryRoute()
  -> runTurn()
  -> bounded model/tool loop
  -> capability execution
  -> observations / receipts
  -> same reasoning agent continuation
```

Static source evidence:

- `brew/server/routes/query-agent-route.mjs` imports and invokes `runTurn()`.
- The canonical route explicitly threads `workspaceRoot` and `stateRoot: getBrewStateRoot()`.
- `brew/runner/brew-runner.mjs` reports `identity: 'single-agent'`, `execution: 'bounded_multi_step_tool_loop'`, and returns `plan: null` on that path.
- Provider tool calls are encoded for the selected provider and decoded back to canonical capability names.

Classification:

- canonical /query source path: **STATIC TRACE CONFIRMED**
- current live runtime behavior for this exact main revision: **UNVERIFIED IN THIS RECORD**
- installed runtime / CI / release acceptance: **UNVERIFIED IN THIS RECORD**

## Auxiliary and legacy authority map

| Module | Current source role | Static classification | Action |
| --- | --- | --- | --- |
| `dispatch-handlers.mjs` | Mixes bounded capability handlers with workspace-agent and disabled legacy subagent/team imports | **MIXED** | Split bounded handlers from semantic/legacy handlers; do not classify the whole file as one authority |
| `subagent-engine.mjs` | Imported by legacy dispatch handlers; fail-closed compatibility engine | **LEGACY / COMPATIBILITY DEBT** | Keep fail-closed until callers are removed, then remove |
| `team-coordinator.mjs` | Imported by legacy dispatch handlers; fail-closed compatibility engine | **LEGACY / COMPATIBILITY DEBT** | Keep fail-closed until callers are removed, then remove |
| `agent-dispatch.mjs` | Dispatch table imported by `brew/start.js`; explicit capability/legacy route map | **LEGACY/AUXILIARY REACHABLE SURFACE** | Do not call dead until startup/import and request consumers are fully disproven |
| `agent-loop.mjs` | Loop mechanics with injected planner/executor/verifier | **MECHANICAL INFRASTRUCTURE** | Keep unless a caller makes it the competing semantic owner |
| `workspace-agent.mjs` | Autonomous workspace maintenance loop with its own planner and allowed actions | **AUXILIARY SEMANTIC AUTHORITY** | Quarantine/collapse unless explicitly supported as a separate maintenance reasoning surface |
| `provider-planner.mjs` | Provider-backed next-action planner for read-only auxiliary inspection | **AUXILIARY SEMANTIC AUTHORITY** | Fold into canonical reasoning path unless intentionally retained as a separately scoped reasoning surface |
| `next-action-planner.mjs` | Deterministic goal/context/history -> next-action planner | **AUXILIARY SEMANTIC AUTHORITY** | Keep only as a bounded fixture/helper if needed; do not treat it as execution-only |
| `active-read-agent.mjs` | Read-only auxiliary agent using provider or deterministic planner inside `AgentLoop` | **AUXILIARY REASONING SURFACE** | Preserve only if product contract intentionally supports this extra reasoning surface |
| `main-agent/main-agent.mjs` | Classifies intent, performs an intelligence pass, then optionally delegates to execution connector | **PARALLEL SEMANTIC SURFACE** | Reconcile with canonical `runTurn()` authority before treating as supported |
| `main-agent/execution-connector.mjs` | Calls `buildPlan()` when no direct `runAgent` is supplied | **PARALLEL PLANNING BRIDGE** | Convert to pure execution bridge or retire with the parallel main-agent surface |
| `execution-router.mjs` | Routes fast/semi/safe/full based partly on message content and optimization state | **MIXED / NEEDS BOUNDARY REVIEW** | Do not bless as purely mechanical until the semantic effect of route selection is proven harmless |

## Important correction: execution-router is not automatically execution-only

Current source:

```text
routeExecution(message)
  -> optimization mode
  -> isFastPath(message)
  -> message length
  -> fast / semi / safe / full
```

`isFastPath(message)` performs keyword matching for `status`, `health`, `help`, and `ping`.

`executePlan()` then changes behavior by route:

- `fast` may invoke `fastExecute()` directly;
- `semi` / `safe` may execute a cached plan;
- `full` proceeds through the normal supplied plan/step path.

Therefore the correct classification is not simply “execution-only.”

Required question:

> Does execution-tier selection only optimize an already-established semantic action, or can message-derived tier selection change which semantic plan/action is chosen?

Until that is traced through the active callers, classify it **MIXED / NEEDS BOUNDARY REVIEW**.

## Reachability rule

A module is not dead merely because no direct user-facing endpoint was found.

Before archive/removal, prove:

```text
startup imports
  -> route registration
  -> request/event consumers
  -> indirect calls
  -> tests/compatibility-only consumers
  -> no supported external import contract
```

Use these final categories:

- **KEEP** — deterministic execution, policy, transport, evidence, state, or loop mechanics with no independent semantic authority.
- **QUARANTINE / COLLAPSE** — reachable module that independently interprets goals, classifies intent, plans semantic next actions, or creates a parallel reasoning authority.
- **REMOVE AFTER CALLER PROOF** — compatibility/dead surface with no supported runtime consumer after import and route tracing.

## Architecture invariant

Brew's intended project invariant remains:

```text
one user-facing reasoning authority
  -> model owns semantic interpretation / planning / tool choice / adaptation
  -> runtime owns deterministic execution / policy / identity / state / evidence / recovery
```

This does **not** mean every loop, router, verifier, dispatcher, or maintenance helper is invalid.

It does mean a second component that independently decides user intent or semantic next action must be either:

1. explicitly justified as a supported separate reasoning surface; or
2. collapsed into the canonical reasoning path.

## Current required next pass

Do not perform broad deletion.

Trace only the mixed/drift surfaces:

1. `agent-dispatch.mjs` and its actual runtime consumers;
2. `dispatch-handlers.mjs` semantic exports;
3. `workspace-agent.mjs`;
4. `active-read-agent.mjs` + `provider-planner.mjs`;
5. `next-action-planner.mjs`;
6. `main-agent/main-agent.mjs` + `execution-connector.mjs`;
7. `execution-router.mjs` through `executor.mjs`.

For each record:

```text
module
caller
reachable from declared startup?
semantic decision made?
execution/integrity-only behavior?
duplicates or bypasses runTurn?
user-visible consequence
classification
required action
```

## Repository reconciliation remains open

PR #442 is still open/draft and diverged from current main. Its implementation cannot be treated as current product truth merely because it is broader than main.

Before merging, salvaging, or closing it:

```text
current main
  -> compare #442
  -> classify unique changes
  -> identify superseded work
  -> preserve only still-required authority/evidence/recovery changes
  -> validate exact resulting revision
```

## Acceptance limits

This review does not prove:

- local dirty-worktree state;
- installed runtime;
- current runtime behavior on main;
- current-head GitHub Actions;
- browser or Telegram end-to-end behavior;
- restart/exactly-once recovery;
- that any candidate dead module has zero external/runtime consumers.

Do not promote this static architecture trace into those claims.
