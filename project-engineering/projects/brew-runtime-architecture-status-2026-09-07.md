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


---

## Runtime validation update — 2026-09-08

### Scope and authority

This section records live/local Brew validation evidence supplied on 2026-09-08 against:

```text
workspace: G:\Developments\38_Brew_Creative_Agent\brew
branch: agent/canonical-runtime-operation-authority-20260812
HEAD: 486a9b433ead59a470e511236139e8201ed292ba
phase: P2_CANONICAL_SESSION_TURN_ITEM_LIFECYCLE
mutation state: PATCH_ALLOWED
```

The local worktree was heavily dirty during this validation. Therefore these results describe the tested local working tree, not pristine HEAD and not remote `main`.

Current source, current local runtime, exact command receipts, and later repository evidence outrank this dated record.

### LoopTool / relay evidence rule reinforced

The browser relay repeatedly imposed a foreground execution limit of roughly 1.1 seconds. Therefore:

```text
LoopTool COMMAND STATUS=FAIL
+ EXIT CODE 124
+ TIMED OUT=true
```

must not be interpreted automatically as a Brew failure.

When the child test/runtime command emitted a complete semantic result before the relay timeout, that semantic result was used. When no semantic result existed, the check remained `INCONCLUSIVE / TEST_HARNESS_TIMEOUT`.

A detached-command wrapper was introduced for long-running build/deploy/runtime validation. An early wrapper incorrectly captured stale `%ERRORLEVEL%`; later commands corrected this by using `cmd /V:ON` and delayed expansion `!ERRORLEVEL!`. Do not reuse the stale-exit-code pattern.

### Focused P2 SessionService acceptance

The current continuation-gate question was:

> Does the bounded CLI SessionService repair remove the obsolete runtime-memory session lifecycle writer while preserving canonical session reads, status behavior, /query persistence, and existing operation/checkpoint identity semantics?

Focused evidence:

```text
scripts/cli-session-authority.test.mjs
tests: 2
pass: 2
fail: 0
```

Proven behavior:

- SessionService list/get read the canonical session store.
- active/resume remain explicit unsupported boundaries.
- obsolete legacy session lifecycle state is not created.

Additional focused acceptance:

```text
scripts/canonical-query-agent-route.test.mjs
scripts/canonical-query-gateway.test.mjs
scripts/agent-loop-checkpoint-integrity.test.mjs
scripts/agent-tool-loop-operation-evidence.test.mjs

tests: 17
pass: 17
fail: 0
```

This proves the tested local working tree preserved:

- canonical `/query` route behavior;
- active gateway `/query` dispatch;
- checkpoint integrity and identity handling;
- canonical session / operation / job / iteration identity propagation;
- tool request/receipt identity continuity;
- evidence-reference validation;
- recovery-checkpoint behavior.

Classification: **FOCUSED TEST PROOF — PASS**.

### Wider regression evidence

A wider bounded regression run reported:

```text
tests: 23
pass: 23
fail: 0
cancelled: 0
skipped: 0
```

The outer relay later returned timeout/124, but Node had already emitted a complete passing test summary. Treat the Brew test result as PASS and the outer relay status as a harness artifact.

Covered areas included:

- canonical startup excluding retired dispatch modules;
- current bounded dispatch/capability surface;
- canonical capability catalog;
- UI/gateway canonical capability route;
- no semantic keyword routing before canonical Brew turn;
- canonical chat/query delegation;
- provider prompt/context contract;
- provider selection truth;
- UI turn/ingress contracts.

Classification: **WIDER REGRESSION — PASS for the executed test set**.

### Guards and static/runtime-structure checks

Verified PASS results:

```text
npm run check:runtime
npm run guard:resource-policy
npm run guard:event-contract
npm run guard:import-boundaries
npm run test:runtime-reachability
npm run audit:runtime-reachability
npm run guard:runtime-reachability
npm run test:runtime-observability-route
npm run guard:startup-workspace
```

Notable evidence:

```text
resource-policy registry entries: 48
resource-policy invalid declarations: 0
resource-policy warnings: 0

event-contract findings: 0

runtime reachability:
  entrypoints found: 4/4
  edgeCount: 320
  unresolvedImports: 0
  activeLegacyAuthority: 0
  legacyCompatibilityImports: 0
  legacyCompatibilitySurfaces: 0
```

The reachability audit still explicitly warns that non-literal dynamic imports require separate runtime inspection.

### UI production build

The first foreground build attempts were killed by the relay timeout and were correctly treated as inconclusive.

A detached Vite build later emitted:

```text
vite v8.1.4
1764 modules transformed
built in 373-412ms
```

with a valid production bundle under `runtime-ui/`.

The build emitted a non-blocking Node deprecation warning for `module.register()`.

Classification: **UI BUILD — PASS**.

### Installed-runtime deployment defect 1: Git hook prepare script

Initial installed-runtime health failed because:

```text
C:\Users\prave\.Brew\workspace
```

did not contain:

```text
brew\agent\orchestrator-server.mjs
```

The repo-owned deploy path was then exercised.

The first real deployment failed during `npm install` in the deployed non-Git workspace:

```text
package.json prepare
  -> node scripts/install-continuation-git-hooks.mjs
  -> git rev-parse --is-inside-work-tree
  -> fatal: not a git repository
  -> npm install fails
  -> deployment aborts
```

Proven defective owner:

```text
scripts/install-continuation-git-hooks.mjs
```

The local working-tree repair changed behavior to:

```text
CI=true            -> skip hook installation
Git checkout       -> configure core.hooksPath=.githooks
non-Git deployment -> skip hook installation successfully
```

Focused acceptance:

```text
SOURCE_EXIT=0
HOOKS_PATH=.githooks
NONGIT_EXIT=0
GIT_HOOK_INSTALLER_ACCEPTANCE=PASS
```

After this repair, detached deployment completed successfully:

```text
runtime syntax: PASS
UI build: PASS
npm install: PASS
0 vulnerabilities
command policy synchronized
Deployment complete
DEPLOY_VERDICT=PROVEN_PASS
```

Classification: **DEPLOYMENT BLOCKER 1 — PROVEN, REPAIRED LOCALLY, FOCUSED ACCEPTANCE PASS, DEPLOYMENT PASS**.

### Installed-runtime startup defect 2: workspace retrieval index assumed Git

After successful deployment, `runtime:health` still failed.

The generated runtime-health report proved the runtime reached:

```text
Brew running on http://127.0.0.1:8600
```

and then aborted during workspace-index bootstrap:

```text
ensureWorkspaceIndexReady()
  -> WorkspaceRetrievalIndex.rebuild()
  -> loadGitKnownFiles()
  -> git ls-files --cached --others --exclude-standard
  -> fatal: not a git repository
  -> runtime startup fails
```

Proven defective owner:

```text
brew/agents/workspace-agent/core/workspace-retrieval-index.mjs
```

The local working-tree repair preserved Git-backed discovery and added a non-Git fallback:

```text
Git workspace
  -> git ls-files
  -> existing index filters

non-Git deployed workspace
  -> filesystem enumeration
  -> same isIndexablePath()/isTextFile() filtering
  -> same WorkspaceRetrievalIndex owner
```

Focused non-Git acceptance proved:

```text
rebuild ok: true
knownFiles: 3
indexed: 2
skipped: 1
failed: 0
integrity.ok: true
retrieval.mode: lexical
```

The expected initial Git probe still printed a non-fatal "not a git repository" message to stderr before fallback; this is noise, not a functional failure.

Existing regression acceptance:

```text
runtime bootstrap repairs the workspace retrieval index before readiness
tests: 1
pass: 1
fail: 0
```

Classification: **RUNTIME BLOCKER 2 — PROVEN, REPAIRED LOCALLY, FOCUSED NON-GIT ACCEPTANCE PASS, EXISTING REGRESSION PASS**.

### Current unresolved boundary

A third detached redeploy was launched after the workspace-index repair:

```text
brew-deploy3
```

but the LoopTool relay itself returned a timeout before a completion result was retrieved.

Therefore the current authoritative classification is:

```text
source/static checks                              PASS
focused SessionService acceptance                 PASS
focused query/checkpoint/operation acceptance     PASS
wider executed regression set                     PASS
resource/event/import/startup guards              PASS
runtime reachability static audit/enforcement     PASS
runtime observability route tests                 PASS
UI production build                               PASS
deployment blocker 1 repair                       FOCUSED PASS
deployment after blocker 1                        PROVEN PASS
runtime blocker 2 repair                          FOCUSED PASS
runtime blocker 2 existing regression             PASS

redeploy after blocker 2                          INCONCLUSIVE / HARNESS TIMEOUT
live runtime health after blocker 2 redeploy      NOT YET PROVEN
runtime:truth                                      NOT YET RUN
runtime:query                                      NOT YET RUN
relay:check                                        NOT YET RUN
runtime:browser-truth                              NOT YET RUN
browser:evidence                                   NOT YET RUN
full Brew end-to-end verdict                       NOT PROVEN
```

Do not claim Brew is end-to-end complete until the patched runtime is successfully redeployed and live runtime, canonical query, relay, and browser evidence layers all pass.

### Repository-state warning

The two local repairs above were made in the dirty local Brew worktree during evidence-driven debugging:

```text
scripts/install-continuation-git-hooks.mjs
brew/agents/workspace-agent/core/workspace-retrieval-index.mjs
```

This GPT-K record does not prove that those repairs were committed or pushed to the Brew repository. GitHub/repository truth must be checked separately before treating either repair as durable project truth.


---

## GitHub promotion and Telegram approval restoration — 2026-09-08

### Canonical Brew branch updated

Branch:

```text
agent/canonical-runtime-operation-authority-20260812
```

Observed branch head after source promotion:

```text
5fe146e74c0aa2e20158fdd650bf574e596662ad
```

The branch now contains the two earlier locally proven runtime repairs that were previously absent from GitHub:

1. `scripts/install-continuation-git-hooks.mjs`
   - non-Git deployed/runtime installs skip local Git hook installation instead of failing `npm install`.
   - source checkout still configures `core.hooksPath=.githooks`.
   - promoted commit: `736a22e6c4c847f6d841a9116901ea857374a916`.

2. `brew/agents/workspace-agent/core/workspace-retrieval-index.mjs`
   - Git workspaces retain `git ls-files` discovery.
   - non-Git deployed workspaces fall back to bounded filesystem enumeration with the existing indexability/text filters.
   - promoted commit: `5fe146e74c0aa2e20158fdd650bf574e596662ad`.

These were already focused-tested locally before promotion, but the exact new GitHub branch head has not yet been pulled and revalidated locally. Therefore classify:

```text
GitHub source promotion: PROVEN
exact post-pull local validation: PENDING
post-pull deployed runtime health: PENDING
```

### Telegram historical-config finding

Repository history before the May 2026 flatten contained:

```text
TELEGRAM_ENABLED
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
TELEGRAM_DELIVERY_MODE
```

and historical Telegram integration configuration also contained real bot-token values.

Do **not** restore or re-copy historical committed secret values. Treat those historical tokens as secret material and use environment-backed configuration only.

The canonical branch already used the safer names:

```text
BREW_TELEGRAM_BOT_TOKEN
BREW_TELEGRAM_OWNER_USER_ID
BREW_TELEGRAM_ALLOWED_CHAT_IDS
```

The Telegram config parser has now been updated to preserve compatibility with the historical `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` environment names without logging or serializing token values.

A safe `.env.example` was added with empty placeholders only.

### Telegram approval authority correction

The canonical branch contained:

- `brew/runtime/telegram/approval-queue.mjs`;
- `execApprovals` configuration;
- canonical Telegram runtime;
- canonical runner `onToolRequest` hook.

But the approval queue was not wired into the active Telegram runtime, and `execApprovals.enabled` was false.

The old P0.4b branch specification required executable Telegram work to stop before execution and wait for a real configured approver.

The new implementation avoids reintroducing legacy keyword/scenario routing. Instead it uses the canonical runner boundary:

```text
Telegram message
  -> canonical Brew reasoning turn
  -> model chooses tool
  -> runAgentToolLoop.onToolRequest
  -> Telegram approval queue stages pending job
  -> Telegram sends:
       Approval required...
       Job: <jobId>
       /approve <jobId>
       /deny <jobId>
  -> tool execution is stopped before registry.executeTool()
```

On `/approve <jobId>`, only a configured approver user ID may authorize the request. The stored original request is replayed through the canonical Telegram turn authority; that approved replay does not install the pre-tool Telegram approval callback again.

This preserves:

```text
one reasoning authority
one canonical runner
approval at the actual pre-tool execution boundary
no semantic keyword classifier
no legacy Telegram gateway authority
```

Telegram-related GitHub commits during this source update included:

```text
f9bed50dae0146de97a8bb995df9ced5c3743baf  enable configured execution approvals
177590b3aa3cf7235dd75a659016416bf1db374b  expose canonical pre-tool approval hook
72444461e0d34815853ee077c3337ac51358570c  gate canonical tool execution on chat approval
59da340947db25ad51e474cdc2b7e88075a95a8a  wire approval queue into active runtime
25f49c6bc037cbee6785a3d3d8e60fcbbf94d104  restore safe legacy env configuration fallback
c1378660313a7bf083f380acfd83426b661b62e3  add focused Telegram approval runtime tests
fe16b9544f2fa993299c66a561a5143052f1fef4  add legacy Telegram env compatibility test
ddad48bf9c257c9d3a402ba321928419c93b168d  add safe Telegram env example
```

### Required next evidence

Do not claim Telegram confirmation is working yet.

Required next sequence:

```text
local fetch/pull exact canonical branch
  -> prove local HEAD equals remote branch head
  -> focused Telegram config parser test
  -> focused Telegram runtime approval tests
  -> Telegram canonical-authority / active-entrypoint regressions
  -> runtime syntax/static guards
  -> deploy
  -> runtime:health
  -> Telegram child ready
  -> live Telegram request that selects a tool
  -> receive approval prompt in Telegram
  -> /approve <jobId>
  -> prove tool executes only after approval
  -> final response returns to originating Telegram chat
```

Until that sequence completes:

```text
Telegram source wiring: IMPLEMENTED IN GITHUB
Telegram focused tests on new branch head: NOT YET RUN LOCALLY
Telegram live confirmation message: NOT YET PROVEN
Brew full end-to-end completion: NOT PROVEN
```
