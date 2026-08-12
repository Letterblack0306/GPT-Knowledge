# Unified Agent Engineering Methods

## Knowledge metadata

- Last reviewed: 2026-08-12
- Purpose: provide one canonical, problem-driven method set for building, debugging, validating, and operating software agents
- Source families: Aider, Claude Code, Codex, Hermes, LobeHub, OpenHands, existing GPT-Knowledge architecture studies, and observed real agent runtime/tool traces
- Canonical status: this document is the primary agent-engineering guide; source-specific studies are provenance/reference material only
- Confidence: high for the consolidated engineering principles; exact upstream implementation details must be revalidated before copying

## Core rule

Do not choose a method because it belongs to a particular upstream agent. Choose the method because it matches the problem currently proven in the target system.

The agent should not reason as:

```text
This looks like Aider work -> use Aider method.
This looks like Codex work -> use Codex method.
```

It should reason as:

```text
What is failing or required?
What evidence actually exists?
What is observed, what is inferred, and what remains unknown?
What layer owns the behavior?
What research or inspection reduces uncertainty?
Which investigation or execution method best tests the current hypothesis?
What practical proof will establish the claim or completion?
```

Upstream projects are evidence sources for techniques, not competing operating modes.

### Research-before-conclusion / proof-before-plan rule

An agent must not produce a factual conclusion, architecture recommendation, implementation plan, autonomy claim, or “best” solution merely because it sounds plausible, matches documentation, resembles another project, or fits model prior knowledge.

Before a consequential conclusion or plan:

1. inspect the relevant live source, runtime, configuration, logs, or connected system;
2. research the applicable canonical knowledge and, when needed, current primary external sources;
3. separate direct observation from inference, hypothesis, and unknowns;
4. practically test behavior claims whenever the claim is about execution, reachability, runtime state, integration, safety, recovery, or autonomy;
5. downgrade the claim when the required evidence cannot be obtained instead of filling the gap with a guess;
6. plan implementation only after the evidence is sufficient to identify the real owner, requirement, constraints, and acceptance proof.

Use explicit evidence classes when ambiguity matters:

```text
PROVEN      = directly observed and validated at the level required by the claim
SUPPORTED   = multiple relevant sources support it, but required practical proof is incomplete
HYPOTHESIS  = plausible explanation or design candidate awaiting a discriminating check
UNKNOWN     = evidence is insufficient
BLOCKED     = the required evidence cannot currently be collected because a real dependency/tool/boundary failed
```

A failed tool invocation is evidence that the invocation failed. It is not evidence about what the command would have returned. A missing runtime test is not permission to replace runtime truth with documentation, memory, or a reasonable-sounding assumption.

This is essential to autonomy: an autonomous agent that invents missing facts, treats plans as reality, or concludes beyond its evidence is not safely autonomous. Reliable autonomy requires adaptive reasoning, truthful observation, bounded action, revision when evidence changes, and validation of consequential outcomes.

---

# 1. Universal operating sequence

```text
Understand request
  -> establish workspace/revision identity
  -> research applicable knowledge and current evidence
  -> map relevant system structure
  -> collect failure/requirement evidence
  -> distinguish observed facts from hypotheses and unknowns
  -> classify failure or requirement layer
  -> form bounded hypotheses
  -> choose the smallest discriminating diagnostic method
  -> inspect before editing
  -> define the acceptance proof
  -> plan only from the established evidence
  -> execute through explicit authority
  -> observe actual result
  -> revise when observations contradict the plan
  -> validate affected behavior
  -> scan for parallel/duplicate paths
  -> verify no regression
  -> record evidence and limitations
  -> complete only when the completion predicate is satisfied
```

No single repository or framework owns this sequence.

A plan is a working hypothesis about how to reach the objective. It is not evidence that the target system is structured that way. The plan must remain revisable as source and runtime observations arrive.

---

# 2. Problem classification before method selection

Classify the failure before selecting tools or editing files.

| Failure class | Typical evidence | Primary method |
|---|---|---|
| Structural | duplicate modules, parallel implementations, wrong entry point, hidden owner | repository map + symbol/dependency tracing |
| Behavioral | wrong output despite correct structure | reproduce + trace input/state/output |
| Runtime | crash, timeout, dead process, wrong lifecycle | runtime/event/process tracing |
| Integration | provider/tool/API/MCP/channel mismatch | contract + capability + health validation |
| State | stale session, memory, cache, config, worktree, DB state | state provenance + invalidation tracing |
| Permission/approval | action proposed but not executed | authority-state tracing |
| UI truth | UI reports state that runtime does not prove | backend-to-view state tracing |
| Validation | tests pass but user-visible behavior fails | layered validation + evidence capture |
| Performance | slow, excessive context, repeated work | profiling + context/tool-call accounting |
| Recovery | retry creates duplicates or resumes stale work | operation identity + checkpoint/retry tracing |

If classification is uncertain, investigate structure and runtime evidence first. Do not pick an upstream pattern by familiarity.

---

# 3. Repository cognition and structural discovery

Use this when the problem may involve the wrong file, duplicated authority, hidden parallel structures, or incomplete context.

## Required repository model

Track these states independently:

```text
known path
mapped path
inspected path
reachable path
runtime-active path
editable path
changed path
validated path
```

Knowing a file exists is not proof that it is active. Reading one implementation is not proof that it is authoritative.

## Structural discovery method

1. Establish repository root, revision, branch, dirty state, submodules/worktrees if relevant.
2. Enumerate top-level architecture before targeting a file.
3. Identify entry points, registries, adapters, routers, factories, manifests, package exports, and runtime loaders.
4. Build a compact symbol/dependency map rather than reading every file.
5. Search names, interfaces, routes, event IDs, configuration keys, and capability IDs across the repository.
6. Detect parallel implementations and compatibility/legacy layers.
7. Trace from user-visible behavior backward to its actual owner.
8. Only then choose the edit surface.

## Parallel-structure test

Before editing, ask:

```text
Is there another implementation of this capability?
Is this path registered or merely present?
Is a legacy/compatibility layer still active?
Does runtime load this file or another one?
Is the UI bound to the same authority I am changing?
```

This method is strongly informed by repository-map approaches such as Aider, but it is a general technique and should not be labeled or invoked as an “Aider mode.”

---

# 4. Investigation and hypothesis-driven debugging

Use this when the failure can be reproduced but its cause is unknown.

## Diagnostic loop

```text
Observed failure
  -> gather exact evidence
  -> identify earliest incorrect state
  -> propose 1-3 bounded hypotheses
  -> rank by evidence, not convenience
  -> run discriminating check
  -> eliminate or strengthen hypothesis
  -> repeat until owner is proven
  -> edit only after causal path is credible
```

## Evidence to capture

- exact command/request/user action;
- expected result;
- actual result;
- timestamp/operation identity where applicable;
- relevant logs and stderr;
- stack trace or failing assertion;
- active configuration;
- active workspace/revision;
- process/service health;
- relevant state before and after reproduction.

## Trace the earliest wrong state

Do not start at the final error message if earlier state can be inspected.

Example:

```text
UI button wrong
  <- UI state object wrong
  <- API response wrong
  <- service state wrong
  <- runtime never started
  <- configuration/permission prevented execution
```

Fix the earliest proven owner, not the last visible symptom.

Interactive investigation patterns associated with Claude Code are useful here: search, read selectively, execute targeted checks, inspect results, revise the hypothesis. The reusable value is the investigation loop, not the product identity.

---

# 5. Controlled execution and authority boundaries

Use this whenever a diagnosis leads to commands, file writes, Git changes, browser actions, external APIs, or other side effects.

Keep these states distinct:

```text
model intent
  != tool request
  != approval request
  != approval decision
  != execution start
  != execution result
  != validation
  != completion
```

## Operation contract

Every meaningful side effect should be attributable to:

```text
sessionId
turnId
operationId
toolCallId
targetId
environmentId
requestedAction
authorityState
executionState
resultRef
validationRefs
```

## Execution rules

- validate arguments and target before execution;
- expose approval requirement explicitly when policy actually requires it;
- execute only through a registered capability;
- return stdout/stderr/result as observation, not as interpreted success;
- preserve operation identity across retry;
- retry only when idempotency or duplicate protection is known;
- never convert “command returned 0” directly into “feature works”;
- never convert “tool failed to run” into a guessed observation;
- when one capability fails, allow the reasoning agent to choose another valid evidence path if it can still answer safely;
- when no valid evidence path remains, report the exact blocked boundary and stop the claim at that boundary.

These principles are informed by execution/sandbox/approval architectures found in systems such as Codex and OpenHands, but belong in the common runtime contract.

### Safety without replacing reasoning

Safety boundaries should constrain what actions are allowed, where they may occur, what identity they operate under, and what evidence must exist. They should not pre-script the semantic reasoning sequence of the assistant.

A safe assistant may:

```text
attempt tool A
  -> observe a real failure
  -> reconsider the hypothesis
  -> choose tool B that remains within authority
  -> collect different evidence
  -> narrow or revise the conclusion
```

This adaptive fallback is desirable. What is unsafe is silently converting a failed capability into an invented success, bypassing a hard boundary, or making a stronger claim than the remaining evidence permits.

---

# 6. Validation and completion

Validation must match the claimed result.

## Evidence ladder

```text
source proof
  -> build/static proof
  -> unit/contract proof
  -> integration proof
  -> runtime proof
  -> user-visible proof
```

Not every change requires every layer, but the validation level must be sufficient for the claim.

Examples:

- “Function exists” -> source proof may be enough.
- “API route works” -> integration/runtime request proof required.
- “Button works” -> UI action plus backend/runtime consequence required.
- “Agent can execute autonomously” -> multi-step runtime evidence with adaptive decisions, real tool observations, bounded side effects, state continuity, validation, and truthful failure handling required.

## Completion predicate

A task is complete only when:

```text
intended change exists
AND active runtime path uses it
AND relevant validation passes
AND observed behavior matches requirement
AND no discovered blocker remains in scope
AND evidence is attached or retrievable
```

Stopping the loop is not the same as completion.

A conclusion should carry the strongest evidence level actually achieved. If practical validation was blocked, report `SUPPORTED`, `UNKNOWN`, or `BLOCKED` as appropriate rather than upgrading the claim because the static evidence is convincing.

---

# 7. Regression and duplicate-authority scan

After a fix, perform a bounded second scan.

Check:

- duplicate routes;
- duplicate methods/functions;
- alternate adapters/providers;
- stale compatibility paths;
- multiple config owners;
- old UI bindings;
- hardcoded fallback values;
- test-only implementations mistaken for runtime implementations;
- branches of logic not covered by the reproduction.

This is particularly important when the original defect came from parallel structure or fragmented ownership.

---

# 8. State, memory, and persistence

Memory helps investigation but is never authority over live evidence.

Separate:

```text
working context
session history
project memory
user memory
procedural knowledge / skills
evidence receipts
runtime state
```

## Rules

- durable memory must include scope and provenance;
- stale memory must not override active source/runtime evidence;
- skills describe procedures and do not grant tool authority;
- checkpoints must preserve operation/revision identity;
- recovery must prove that the target state still matches the checkpoint before resuming;
- evidence receipts should remain immutable or append-only where practical;
- remembered conclusions should be revalidated when the underlying implementation, runtime, policy, or external dependency may have changed.

These methods draw from persistent-agent patterns seen in Hermes and autonomous runtimes, but are consolidated here as general state-management rules.

---

# 9. Providers, models, tools, MCP, and integrations

Treat integrations as registries with runtime health, not hardcoded assumptions.

## Provider contract

```text
providerId
adapterId
endpointRef
credentialRef
enabled
configured
health
lastValidatedAt
models[]
capabilities[]
```

## Tool/integration contract

```text
capabilityId
source
version
availability
health
permissionScope
approvalRequirement
inputSchema
outputSchema
timeout
failureState
evidenceType
```

## Required distinction

```text
configured != reachable != authenticated != capable != healthy
```

A saved API key is not proof that a provider works. A listed model is not proof that it can satisfy the requested capability. A registered MCP server is not proof that its tools are currently callable.

Provider/model/knowledge registry patterns observed in LobeHub are useful reference material, but the common method is capability-driven registration and validation.

---

# 10. Autonomous software-engineering behavior

Autonomy is adaptive model-owned reasoning over real observations, with runtime-owned capabilities and hard safety/integrity boundaries. It should not be implemented as an unbounded recursive prompt loop, but it also should not be reduced to a fixed semantic workflow that decides the agent's reasoning for it.

Canonical assistant loop:

```text
objective
  -> inspect/research enough to understand the current situation
  -> choose the next useful evidence or action
  -> call an allowed capability when needed
  -> observe the real result
  -> revise understanding and next action
  -> validate consequential outcomes
  -> continue, answer, or report a real blocker
```

Runtime implementations may record lifecycle labels such as `received`, `executing`, `validating`, `blocked`, or `complete` for observability, recovery, cancellation, and UI truth. Those labels are telemetry/state ownership, not a substitute planner and not the semantic reasoning authority.

Do not require a model to pass through a fixed `Intent -> Planner -> Supervisor -> Worker -> Verifier -> Response` chain merely to appear agentic. Internal functions may perform planning, policy checks, execution, and validation, but the model should retain interpretation of the user's objective and adaptive choice of what to do next.

## What practical autonomy must prove

Before claiming an agent is autonomous, demonstrate runtime evidence that it can:

- preserve the user's objective across multiple actions;
- inspect evidence before acting when facts are uncertain;
- choose among available tools/capabilities based on the current situation;
- distinguish tool failure from task failure;
- adapt its strategy when a tool or hypothesis fails;
- stay within workspace, policy, security, and external-action boundaries;
- use observations rather than invented facts;
- validate consequential results at the level required by the claim;
- avoid duplicate/replayed side effects when retrying;
- stop or report `BLOCKED` when no safe evidence/action path remains;
- avoid claiming completion from model text alone.

## Retry policy

A retry is allowed only when:

- failure class is retryable;
- target identity is still valid;
- previous action did not already succeed invisibly;
- duplicate execution is prevented;
- retry budget remains.

Otherwise return to investigation/reasoning rather than mechanically repeating the same action.

OpenHands-style action/observation/event architectures are useful references for runtime instrumentation, but event/state labels are system-level support for the reasoning agent, not a second semantic agent or mandatory reasoning machine.

### Runtime-trace lesson

A real agent runtime/tool trace reviewed on 2026-08-12 demonstrated a useful safety pattern: shell/command execution repeatedly failed with a real spawn error, the agent did not fabricate command output, it switched to still-functioning read/search capabilities, continued collecting static evidence, and explicitly recognized that runtime/Git validation remained unavailable. The reusable lesson is not that this particular agent was fully correct; it is that truthful tool observation plus adaptive fallback is a core autonomy behavior.

The same trace also demonstrated the opposite risk: an agent can still overstate a conclusion after substantial investigation if the final summary is not mechanically bounded by the strongest evidence actually collected. Therefore runtime/tool receipts must outrank the agent's narrative, and completion/conclusion logic must preserve missing-proof boundaries.

---

# 11. Debugging method selector

Use this table directly instead of opening per-repository studies first.

| Observed situation | Start with | Add if needed |
|---|---|---|
| Agent keeps editing wrong file | repository cognition + runtime-owner tracing | duplicate-authority scan |
| Fix works in tests but not app | active-path tracing + runtime validation | UI/backend state tracing |
| Agent says done too early | completion predicate + evidence ladder | operation-state audit |
| Agent produces conclusions before evidence | research-before-conclusion rule | source/runtime verification + evidence classification |
| Agent creates plans from guesses | requirement/evidence discovery first | acceptance-proof definition |
| Repeated retries duplicate actions | operation identity + idempotency audit | checkpoint/recovery tracing |
| Provider appears configured but fails | integration contract + health validation | model capability discovery |
| Tool exists but cannot execute | capability registry + permission tracing | approval-state tracing |
| Tool execution itself is unavailable | record exact failure + use another authorized evidence path | report BLOCKED if no valid path remains |
| Session resumes wrong/stale task | state provenance + checkpoint identity | workspace/revision revalidation |
| UI reports green but backend is down | backend-to-view authority tracing | health evidence contract |
| Repository has several similar modules | symbol/dependency map | entry-point/registry tracing |
| Bug disappears when manually tested | capture exact reproduction state | event/timing/concurrency tracing |
| Agent cannot understand whole repo | compact repo map + selective expansion | dependency/symbol graph |
| Runtime behavior is unpredictable | typed event/action/observation trace | lifecycle/state audit |

---

# 12. Source selection happens after method selection

Only after a method is chosen should the agent consult a source-specific study when implementation detail is useful.

Examples:

```text
Need a compact repository map algorithm
  -> consult Aider reference notes

Need concrete sandbox/approval implementation ideas
  -> consult Codex reference notes

Need interactive investigation patterns or project-instruction behavior
  -> consult Claude Code upstream/reference material

Need persistent memory/skills/checkpoint implementation patterns
  -> consult Hermes reference notes

Need provider/model/knowledge registry examples
  -> consult LobeHub reference notes

Need typed autonomous runtime/action-observation examples
  -> consult OpenHands reference notes
```

The source is subordinate to the already-selected engineering method.

---

# 13. Anti-assumption rules

The agent must not conclude:

- a file is active because its name matches the feature;
- a module is authoritative because documentation points to it;
- a test proves runtime behavior without tracing the active path;
- a configured integration is healthy;
- a tool call succeeded because no exception was thrown;
- a failed tool call reveals the result that would have been produced;
- a green UI indicator is evidence by itself;
- a prior memory is current truth;
- a plan is proof of the current implementation;
- a plausible architecture is the target architecture without project evidence;
- a source-code path proves practical runtime behavior;
- a static audit is sufficient proof of autonomy;
- one upstream agent’s architecture is globally superior;
- a method is appropriate merely because another successful agent uses it.

Instead, select the method from the proven requirement/failure, research the relevant system, classify the evidence, and verify consequential claims against the target implementation and runtime.

---

# 14. Source provenance

The following source-specific documents remain in the repository as research provenance and implementation examples, not as primary routing destinations:

- `ai-agents/studies/aider-repository-cognition.md`
- `ai-agents/studies/codex-execution-validation.md`
- `ai-agents/studies/hermes-memory-skills-agent-loop.md`
- `ai-agents/studies/lobehub-provider-integration-architecture.md`
- `ai-agents/studies/openhands-autonomous-swe-runtime.md`
- `ai-agents/reference-derived-agent-architecture.md`

Claude Code should be treated the same way when a dedicated source note is added: useful evidence for implementation patterns, but not another canonical method branch.

Runtime/tool traces are also valuable provenance because they expose what the agent actually attempted, what tools returned, how it adapted, and where proof stopped. When available, audit the trace/receipts before trusting the assistant's final narrative. A runtime trace is evidence of observed behavior for that session; it is not automatically proof that every architectural interpretation made by the agent was correct.

## Final rule

**One canonical engineering method set; many reference implementations and evidence sources.**

Research before conclusion. Establish practical proof before strong runtime/autonomy claims. Treat plans as revisable hypotheses, not facts. Choose from the consolidated methods by requirement/failure class, evidence, authority boundary, and required proof. Use upstream repositories and runtime traces to deepen or challenge the selected method, never to replace live verification.