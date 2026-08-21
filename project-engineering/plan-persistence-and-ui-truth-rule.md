# Plan Persistence and UI Truth Rule

## Purpose

Plans may be proposed or discussed in chat, but chat is not durable project authority.

Any plan that is intended to govern consequential project work must be persisted to the project's canonical documentation surface before it can be treated as current project truth.

## Core invariant

```text
plan proposed in chat
→ identify project + canonical plan owner
→ document plan through repository-first flow
→ record revision / document path
→ project UI reads documented plan/status
→ execution may treat it as current plan truth
```

A chat-only plan is a proposal, not project truth.

## What counts as a plan

This rule applies when the reasoning agent intentionally creates or materially changes an explicit work plan, implementation sequence, stage plan, recovery plan, migration plan, acceptance plan, or current-position plan.

The UI/runtime must NOT infer plan intent by scanning arbitrary prose for words such as `plan`, `next`, `stage`, or `todo`.

Plan intent must be explicit agent/user metadata or an explicit durable-document action.

## Durable plan authority

For each project, use the existing canonical plan/status owner where one exists.

Examples:

- `plan.json` / `status.json` for GPT-Knowledge workspace projections;
- a canonical implementation plan/checklist in the authoritative repository;
- an explicitly designated current-position or roadmap document.

Do not create a second planning authority merely to satisfy this rule.

If no canonical plan owner exists, classify that as `PLAN_OWNER_MISSING` and establish one through the repository-first process before treating a plan as durable truth.

## Repository-first requirement

Any new or materially changed durable plan must follow:

```text
establish repository identity
→ identify canonical plan file
→ patch/create on authoritative repository main
→ record BASE SHA / HEAD SHA / changed files
→ verify local/deployed projection as required
→ classify plan persistence
```

Do not save a durable plan only in a chat transcript, temporary note, untracked file, or agent scratchpad.

## UI contract

The UI should surface plan authority, not infer planning semantics.

Recommended state model:

```text
PLAN STATE
---------
NO_ACTIVE_PLAN
CHAT_PROPOSAL_ONLY
DOCUMENTATION_PENDING
DOCUMENTED_CURRENT
DOCUMENTED_STALE
DOCUMENTATION_BLOCKED
```

Minimum UI fields when an active plan exists:

```text
PLAN STATE:
PLAN DOCUMENT:
DOCUMENT REVISION / HEAD:
LAST VERIFIED:
ACTIVE STAGE / GATE:
NEXT SINGLE QUESTION:
```

The UI may link/open the canonical plan document and status projection.

The UI must not treat chat text as the authoritative plan body.

## Agent behavior

When an agent produces a consequential plan:

1. identify whether the project already has a canonical plan owner;
2. if yes, persist the plan or material plan change there before relying on it as current truth;
3. if persistence is not yet possible, label the plan `CHAT_PROPOSAL_ONLY` or `DOCUMENTATION_PENDING`;
4. do not tell later agents that the plan is authoritative merely because it appeared in chat;
5. after persistence, report the document path and repository revision;
6. when later evidence changes the plan, update the canonical document before advancing.

## Relationship to reasoning boundary

This rule does not turn planning into deterministic orchestration.

The reasoning agent still owns:

- whether a plan is needed;
- plan content;
- ordering and hypotheses;
- replanning decisions;
- when the plan is materially changed.

The infrastructure/UI owns only:

- durable storage of the explicit plan;
- revision/provenance;
- showing whether the plan is documented/current;
- preventing chat-only proposals from masquerading as durable project truth.

## Failure conditions

The rule is violated if:

- a consequential plan exists only in chat and later work treats it as authoritative;
- a new session reconstructs current project direction from chat instead of the canonical plan/status document;
- the UI displays chat prose as the current plan without a durable document reference;
- an agent materially changes the plan but does not synchronize the canonical plan/current-position document;
- the system creates a duplicate planning database/document when an existing plan owner already exists;
- the runtime parses arbitrary natural-language prose to decide that a plan exists.

## Classification

Use:

```text
PLAN_TRUTH = DOCUMENTED_CURRENT
PLAN_TRUTH = CHAT_PROPOSAL_ONLY
PLAN_TRUTH = DOCUMENTATION_PENDING
PLAN_TRUTH = DOCUMENTED_STALE
PLAN_TRUTH = DOCUMENTATION_BLOCKED
PLAN_TRUTH = PLAN_OWNER_MISSING
```

Only `DOCUMENTED_CURRENT` may be treated as the active durable project plan.

## Cross-agent rule

This applies equally when work is performed by ChatGPT, Codex, Claude, local agents, browser agents, or another reasoning provider.

A provider may reason differently, but any plan intended to survive the conversation must converge on the same project-owned durable documentation surface.
