# Unified Agent Engineering Methods

## Knowledge metadata

- Last reviewed: 2026-08-07
- Purpose: provide one canonical, problem-driven method set for building, debugging, validating, and operating software agents
- Source families: Aider, Claude Code, Codex, Hermes, LobeHub, OpenHands, plus existing GPT-Knowledge architecture studies
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
What is failing?
What evidence exists?
What layer owns the failure?
Which investigation or execution method best reduces uncertainty?
What proof will establish completion?
```

Upstream projects are evidence sources for techniques, not competing operating modes.

---

# 1. Universal operating sequence

```text
Understand request
  -> establish workspace/revision identity
  -> map relevant system structure
  -> collect failure evidence
  -> classify failure layer
  -> form bounded hypotheses
  -> choose the smallest diagnostic method
  -> inspect before editing
  -> execute through explicit authority
  -> observe actual result
  -> validate affected behavior
  -> scan for parallel/duplicate paths
  -> verify no regression
  -> record evidence
  -> complete only when the completion predicate is satisfied
```

No single repository or framework owns this sequence.

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
- expose approval requirement explicitly;
- execute only through a registered capability;
- return stdout/stderr/result as observation, not as interpreted success;
- preserve operation identity across retry;
- retry only when idempotency or duplicate protection is known;
- never convert “command returned 0” directly into “feature works.”

These principles are informed by execution/sandbox/approval architectures found in systems such as Codex and OpenHands, but belong in the common runtime contract.

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
- “Agent can execute autonomously” -> multi-step runtime evidence with state transitions required.

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
- evidence receipts should remain immutable or append-only where practical.

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

# 10. Autonomous software-engineering loop

Autonomy should be event/evidence driven, not an unbounded recursive prompt loop.

Recommended state machine:

```text
RECEIVED
  -> DISCOVERING
  -> DIAGNOSING
  -> READY_TO_ACT
  -> APPROVAL_REQUIRED | EXECUTING
  -> OBSERVING
  -> VALIDATING
  -> COMPLETE | BLOCKED | RETRYABLE_FAILURE
```

Every transition should have a reason and operation identity.

## Retry policy

A retry is allowed only when:

- failure class is retryable;
- target identity is still valid;
- previous action did not already succeed invisibly;
- duplicate execution is prevented;
- retry budget remains.

Otherwise return to diagnosis.

OpenHands-style action/observation/event architectures are useful references for this method, but the state machine is system-level knowledge rather than a product-specific workflow.

---

# 11. Debugging method selector

Use this table directly instead of opening per-repository studies first.

| Observed situation | Start with | Add if needed |
|---|---|---|
| Agent keeps editing wrong file | repository cognition + runtime-owner tracing | duplicate-authority scan |
| Fix works in tests but not app | active-path tracing + runtime validation | UI/backend state tracing |
| Agent says done too early | completion predicate + evidence ladder | operation-state audit |
| Repeated retries duplicate actions | operation identity + idempotency audit | checkpoint/recovery tracing |
| Provider appears configured but fails | integration contract + health validation | model capability discovery |
| Tool exists but cannot execute | capability registry + permission tracing | approval-state tracing |
| Session resumes wrong/stale task | state provenance + checkpoint identity | workspace/revision revalidation |
| UI reports green but backend is down | backend-to-view authority tracing | health evidence contract |
| Repository has several similar modules | symbol/dependency map | entry-point/registry tracing |
| Bug disappears when manually tested | capture exact reproduction state | event/timing/concurrency tracing |
| Agent cannot understand whole repo | compact repo map + selective expansion | dependency/symbol graph |
| Runtime behavior is unpredictable | typed event/action/observation trace | state-machine audit |

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
- a green UI indicator is evidence by itself;
- a prior memory is current truth;
- one upstream agent’s architecture is globally superior;
- a method is appropriate merely because another successful agent uses it.

Instead, select the method from the proven failure and verify it against the target system.

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

## Final rule

**One canonical engineering method set; many reference implementations.**

Choose from the consolidated methods by failure class, evidence, authority boundary, and required proof. Use upstream repositories only to deepen a selected method or challenge the target implementation.