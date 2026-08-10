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

## Diagnostic reminder

When an agent workflow breaks, first ask which layer owns the failed responsibility:

```text
Message not captured?          -> transport
Wrong target/session?          -> transport identity
Unsafe action allowed/blocked? -> security/governance boundary
Agent chose poor approach?     -> agent reasoning/tooling
Repeated text ignored?         -> check transport deduplication before adding semantic gates
Conflicting lifecycle states?  -> ownership/state projection
```

Do not add another parser, classifier, lifecycle, approval layer, or semantic state machine until proving that the problem cannot be solved by the existing reasoning agent plus a simpler transport/integrity contract.

## Architecture review question

For every proposed agent/LLM bridge feature, ask:

> Is this required to move and protect information, or are we trying to think on behalf of an agent that can already reason?

If it is the latter, keep that responsibility with the agent unless evidence establishes a necessary external policy boundary.
