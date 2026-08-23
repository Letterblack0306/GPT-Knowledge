# LB Workspace Plan Truth UI Contract

## Goal

LB Workspace must never present a chat-only plan as project truth.

The workspace is repository-driven. A plan shown as current must resolve to a canonical documented plan/status artifact.

## UI state

For each mapped project the UI should surface an explicit `PLAN STATE` derived from project data, not from chat prose:

- `NO_ACTIVE_PLAN`
- `CHAT_PROPOSAL_ONLY`
- `DOCUMENTATION_PENDING`
- `DOCUMENTED_CURRENT`
- `DOCUMENTED_STALE`
- `DOCUMENTATION_BLOCKED`
- `PLAN_OWNER_MISSING`

Only `DOCUMENTED_CURRENT` is authoritative.

## Required project data

A mapped project may expose:

```json
{
  "plan_truth": {
    "state": "DOCUMENTED_CURRENT",
    "document": "../project/plan.json",
    "revision": "<git sha>",
    "verified_at": "<timestamp>",
    "active_gate": "<id>",
    "next_single_question": "<question>"
  }
}
```

The exact storage location may be `plan.json`, `status.json`, or the project's canonical plan/checklist contract. Do not duplicate an existing plan owner.

## Rendering contract

The UI should show, when available:

```text
PLAN STATE
PLAN DOCUMENT
DOCUMENT REVISION
LAST VERIFIED
ACTIVE GATE
NEXT SINGLE QUESTION
```

If plan data is missing, the UI must show `PLAN OWNER MISSING` or `DOCUMENTATION PENDING`; it must not reconstruct the plan from chat history.

## Agent/UI boundary

The reasoning agent decides whether it is creating or materially changing a plan and explicitly requests/records persistence.

The UI does not scan natural-language messages for `plan`, `todo`, `next`, `stage`, or similar keywords.

The UI only displays explicit durable plan metadata and repository-backed plan/status files.

## Persistence rule

Before a consequential plan becomes current project truth:

```text
chat proposal
→ canonical plan owner identified
→ repository-first documentation
→ revision recorded
→ deployed/project projection refreshed
→ UI shows DOCUMENTED_CURRENT
```

If documentation cannot be completed, the UI remains in a non-authoritative plan state.

## Acceptance

PASS requires:

1. a documented plan renders `DOCUMENTED_CURRENT` with its document/revision;
2. a chat-only proposal cannot render as current durable plan;
3. a stale plan revision renders `DOCUMENTED_STALE` or equivalent warning;
4. the UI does not infer plan existence from prose;
5. plan/status refresh uses repository-deployed data.
