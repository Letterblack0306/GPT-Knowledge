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

## Normal agent conversation must not require a semantic text envelope

For ordinary reasoning-agent communication, the transport must not require a message to match a special textual grammar before the receiving agent can see it.

Examples of prohibited normal-path gates include:

- requiring `OBJECTIVE:` before prose becomes actionable;
- requiring `=== ... INSTRUCTION START ===` / `END` wrappers for ordinary reasoning requests;
- regex or keyword command detection that decides whether natural-language prose is a task;
- semantic parsers that extract only part of a message and discard surrounding conversational context;
- forcing each transported conversational turn into a fresh local agent session merely because a new browser message arrived.

The preferred normal contract is:

```text
new completed agent-authored turn
  -> verify source / target / conversation / provenance
  -> assign mechanical transport identity
  -> deliver the natural-language turn unchanged
  -> receiving agent reasons about meaning and next action
```

If the receiving agent needs prior context, provide a bounded read-only conversation/context tool or preserved session history. Do not solve missing context by adding another semantic classifier in the relay.

### Narrow exception: explicitly non-reasoning control paths

A structured envelope is appropriate when the caller explicitly chooses a deterministic bypass that is **not asking the receiving agent to reason**.

Example:

```text
TYPE: quick_command
COMMAND: git status
```

In that case, deterministic parsing can be part of the control/integrity contract because exact command preservation, workspace binding, authentication, and governance are the purpose of the path.

The exception must remain narrow. The presence of one explicit non-reasoning command path does not justify making ordinary agent conversation depend on the same envelope.

## Conversation context access for agent-to-agent bridges

Where a browser-side agent and local agent share a continuing conversation, prefer this pattern:

```text
current turn arrives
  -> local agent reasons from the turn
  -> if context is insufficient, local agent requests recent conversation context
  -> bridge returns bounded read-only messages from the already-bound conversation
```

The context reader should be mechanically constrained:

- current authenticated/bound conversation only;
- read-only;
- bounded message count/size;
- no arbitrary JavaScript supplied by the model;
- no navigation or mutation of the protected transport target;
- no semantic filtering of messages beyond provider-role/provenance extraction.

This keeps context retrieval separate from general browser control and preserves the protected transport boundary.

## Transport deduplication is not semantic deduplication

Duplicate protection should prevent accidental re-delivery of the **same transport event** when that would cause unintended double execution.

It must not silently discard a message only because its text resembles an earlier instruction, because the same instruction ID appears after a restart, or because the bridge assumes the agent has "already understood" it.

Where ambiguity remains, preserve delivery context and let the agent reason from conversation/session history.

Prefer provider message identity, stable turn identity, sequence/ordering metadata, or a transport receipt over text equality alone. Two different messages may contain identical text and still be distinct turns.

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
Natural prose not delivered?   -> remove semantic envelope/classifier gate from transport
Context missing?               -> add bounded conversation/session context access, not a parser
Conflicting lifecycle states?  -> ownership/state projection
```

Do not add another parser, classifier, lifecycle, approval layer, or semantic state machine until proving that the problem cannot be solved by the existing reasoning agent plus a simpler transport/integrity contract.

## Architecture review question

For every proposed agent/LLM bridge feature, ask:

> Is this required to move and protect information, or are we trying to think on behalf of an agent that can already reason?

If it is the latter, keep that responsibility with the agent unless evidence establishes a necessary external policy boundary.

## Review blocker for future Letterblack projects

Treat the following as an architecture regression unless live evidence proves a hard non-semantic requirement:

- ordinary browser/local-agent communication depends on a command detector or instruction envelope;
- a transport bridge decides whether prose is actionable before the reasoning agent receives it;
- a task router duplicates conversational interpretation already available to the agent;
- repeated text is suppressed solely by semantic/text similarity rather than transport identity;
- the relay strips conversation context to a rigid objective format when the receiving agent could read the original turn or request bounded history;
- every browser turn creates a new local session and discards the continuing reasoning relationship.

When any of these appear in a review, first simplify the bridge. Do not add another compatibility layer around the semantic gate.
