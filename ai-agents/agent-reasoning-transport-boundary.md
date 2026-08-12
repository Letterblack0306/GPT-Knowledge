# Agent Reasoning and Transport Boundary

## Canonical rule

When a user refers to an **agent**, **LLM**, **local LLM**, **browser-side model**, or another tool-using model, treat it as a **reasoning-capable agent**, not as a deterministic machine that must be micromanaged by a rigid state machine.

This is an architecture reminder that applies across Letterblack projects unless live project evidence proves that a component is intentionally non-reasoning.

## Core principle

> Agents reason; bridges transport.

A browser-side agent and a local agent may both inspect evidence, form plans, decide whether a requested action is useful, adapt to incomplete information, recognize repeated instructions, and choose appropriate tools.

The bridge between them must not become a second reasoning engine merely because messages cross a process, machine, browser, runtime, or provider boundary.

## Correct responsibility split

```text
Browser Agent
    |
    | message + conversation/session/workspace metadata
    v
Transport Bridge
    |
    | reliable delivery
    v
Local Agent
    |
    +-- inspect local workspace
    +-- reason from local evidence
    +-- plan
    +-- choose tools
    +-- validate results
    +-- produce response/evidence
    |
    v
Transport Bridge
    |
    v
Browser Agent
```

The browser-side agent may inspect GitHub or other remote evidence. The local agent may inspect files, runtime state, tools, terminals, MCP capabilities, or other local evidence. Both remain responsible for reasoning within their available evidence boundary.

## What the bridge owns

The bridge owns transport and integrity concerns such as:

- reliable message capture and delivery;
- source, target, session, conversation, and workspace identity;
- target-tab identity where a browser provider is involved;
- authentication and authorization boundaries;
- workspace isolation;
- tool and command security boundaries;
- cancellation and delivery acknowledgement;
- transport-level duplicate protection where accidental double execution would otherwise occur;
- preserving the original message and relevant context without semantic distortion;
- returning agent results and evidence to the originating side.

These are transport, security, and integrity responsibilities. They are not substitutes for agent reasoning.

## What the bridge must not own by default

Do not make the bridge decide semantic questions that the receiving agent can reason about, including:

- whether a repeated instruction is useful, redundant, corrective, or a continuation;
- whether wording or formatting changed enough to make a task "new";
- whether the user supplied "enough" information to begin inspection;
- whether a command mentioned by the browser should actually be used;
- what implementation approach should be selected;
- whether a task requires more local inspection before action;
- whether a plan needs adaptation after new evidence appears;
- whether conversational phrasing matches a rigid state-machine classification.

A message may be repeated, expanded, shortened, reformatted, or partially specified. Preserve it and its context; let the receiving reasoning agent determine its meaning and next action.

## Transport deduplication is not semantic deduplication

Duplicate protection should prevent accidental re-delivery of the **same transport event** when that would cause unintended double execution.

It must not silently discard a message only because its text resembles an earlier instruction, because the same instruction ID appears after a restart, or because the bridge assumes the agent has "already understood" it.

Where ambiguity remains, preserve delivery context and let the agent reason from conversation/session history.

## Security boundaries remain hard boundaries

Treating an LLM as a reasoning agent does not mean removing security controls.

Keep hard boundaries for:

- destructive or privileged operations;
- credentials and secrets;
- external publication or irreversible side effects;
- workspace/path isolation;
- command/tool allowlists or equivalent governed execution policy;
- authentication and target identity;
- explicit cancellation and ownership transitions.

The rule is: **do not replace security with model discretion, and do not replace model reasoning with transport logic.**

## Reasoning-authority fragmentation is an architecture defect

A project may accidentally create several semantic authorities around one reasoning agent. Common examples include:

```text
browser/provider message
  -> semantic task-state classifier
  -> objective keyword/regex classifier
  -> mandatory planner
  -> plan approval workflow
  -> reasoning agent
```

This is not additional intelligence. It is fragmented reasoning ownership.

The defect exists when deterministic infrastructure decides semantic questions that the reasoning-capable agent should decide, such as:

- whether a valid message is actionable enough to deliver;
- whether a message represents a decision, blocker, completion, continuation, or conversation update;
- which capability categories are relevant because certain keywords appeared;
- which evidence the task must require before the agent has interpreted the actual objective;
- whether every task must first become a structured plan;
- whether execution may begin only because a semantic plan state transitioned;
- whether repeated or reformatted text should be ignored as semantically duplicate.

These decisions may look safe or organized but can suppress context, block adaptation, create false completion, or force the model into an architecture invented outside its own reasoning loop.

### Correct test

For each deterministic component around an agent, ask:

```text
Is this component protecting identity, execution, integrity, evidence, or safety?
```

If yes, deterministic ownership may be correct.

Then ask:

```text
Or is it deciding what the message means, what the agent should think, or which reasoning path is allowed?
```

If yes, the responsibility should normally return to the reasoning agent unless live evidence proves a necessary external policy boundary.

## Planning is a reasoning technique, not a universal authority layer

A reasoning agent may create a plan, revise it, skip formal planning for a trivial task, inspect first, or abandon a plan when evidence disproves it.

Do not require every task to pass through a fixed semantic chain such as:

```text
plan
  -> approve plan
  -> execute fixed steps
  -> complete
```

merely to make the system appear agentic or controlled.

Correct model:

```text
objective
  -> inspect/research as needed
  -> plan when useful
  -> choose action/evidence path
  -> observe real result
  -> revise understanding/plan
  -> validate consequential outcome
  -> continue, answer, or report blocker
```

Runtime lifecycle labels may still record states such as `planning`, `executing`, `validating`, `blocked`, or `completed` for observability and recovery. Those labels must describe what happened; they must not become the semantic authority that tells the model what it is allowed to reason next.

## Capability registration is deterministic; capability choice is normally agent-owned

The runtime should deterministically expose facts such as:

```text
capabilityId
availability
health
input schema
output schema
permission scope
approval requirement
timeout/failure contract
```

The reasoning agent should normally decide which available capability is useful for the current objective.

Avoid hidden semantic routers that derive a mandatory capability plan from wording alone, for example:

```text
keyword/regex match
  -> workspace required
  -> github required
  -> validation required
  -> model must satisfy that preselected plan
```

A deterministic validator may still verify whether a final claim is backed by sufficient real evidence. The important distinction is:

```text
runtime validates evidence truth
!=
runtime pre-decides semantic reasoning strategy
```

## Result truth must be typed across transport seams

Transport success is not task completion.

Do not overload a field such as:

```text
ok: true
```

to mean all of the following at once:

```text
message delivered
classification succeeded
agent executed
objective completed
result verified
```

Use explicit outcomes or equivalent typed contracts so producer and consumer agree on semantics:

```text
transport: delivered | rejected | failed
agent outcome: completed | blocked | failed | stopped | waiting
execution: started | succeeded | failed | cancelled
validation: verified | unverified | failed
```

A bridge must not convert a non-executed semantic state into `COMPLETE` merely because its local function returned successfully.

## Architecture-correction workflow

When live evidence shows reasoning authority has leaked into routers, bridges, planners, UI state, or keyword classifiers, do not immediately delete modules or replace the system with another orchestrator.

Use this flow:

```text
1. establish exact active revision and runtime path
2. trace producer -> consumer seams end to end in source
3. identify which component currently owns each semantic decision
4. classify each responsibility:
     reasoning
     transport/identity
     execution
     safety/integrity
     evidence/validation
     UI projection
5. define explicit message/result contracts before rewiring
6. make transport reasoning-neutral
7. return semantic capability/tool choice to the reasoning agent
8. demote/remove mandatory semantic planners/classifiers only after consumers are proven
9. preserve useful deterministic mechanisms such as receipts, timeout, cancellation, post-write verification, and target identity
10. reconcile UI/lifecycle projection with the new authoritative result contract
11. validate one correlated real runtime path
12. test failure, adaptation, repetition, blocking, cancellation, and duplicate-side-effect behavior
13. only then call the correction complete
```

### Plan-before-implementation rule

For a project that was previously built around deterministic semantic orchestration, the architecture correction must be documented before code changes begin.

The project-specific plan should record:

```text
Current active owners
Proven semantic authority conflicts
Responsibilities to preserve
Responsibilities to return to the agent
Producer/consumer contracts
Ordered migration phases
Focused regression checks
Live runtime proof path
Completion predicate
```

The plan is revisable. If source/runtime evidence disproves one of its assumptions, update the plan before continuing implementation.

## What not to remove during a reasoning-authority correction

Do not confuse "let the agent reason" with "remove deterministic infrastructure."

Preserve deterministic responsibilities where they are genuinely needed, including:

- message/session/target/workspace identity;
- registered tool dispatch;
- execution result capture;
- stop/cancel semantics;
- retry duplicate protection;
- persistence/checkpoints where useful;
- evidence and receipts;
- post-action/post-write validation;
- security, credential, publication, destructive-action, and other hard policy boundaries;
- UI projection of actual runtime state.

The correction target is semantic over-orchestration, not every state machine or deterministic component.

## Diagnostic reminder

When an agent workflow breaks, first ask which layer owns the failed responsibility:

```text
Message not captured?          -> transport
Wrong target/session?          -> transport identity
Unsafe action allowed/blocked? -> security/governance boundary
Agent chose poor approach?     -> agent reasoning/tooling
Repeated text ignored?         -> check transport deduplication before adding semantic gates
Conflicting lifecycle states?  -> ownership/state projection
Semantic message suppressed?   -> reasoning-authority fragmentation
Keyword changed tool path?      -> objective classifier / semantic router
Plan approval blocks ordinary work? -> mandatory planner authority
Transport says COMPLETE without execution? -> result-contract seam
```

Do not add another parser, classifier, lifecycle, approval layer, or semantic state machine until proving that the problem cannot be solved by the existing reasoning agent plus a simpler transport/integrity contract.

## Architecture review question

For every proposed agent/LLM bridge feature, ask:

> Is this required to move and protect information, or are we trying to think on behalf of an agent that can already reason?

If it is the latter, keep that responsibility with the agent unless evidence establishes a necessary external policy boundary.

## Final correction rule

When an agent system has accumulated task routers, keyword classifiers, mandatory planners, approval-style semantic orchestration, or UI state machines, do not judge each component by whether it looks organized in isolation. Trace whether it has become a competing reasoning authority.

**Preserve deterministic transport, identity, execution, evidence, validation, cancellation, and hard safety/integrity boundaries. Return semantic interpretation, planning choice, adaptation, and tool/evidence strategy to the reasoning-capable agent.**
