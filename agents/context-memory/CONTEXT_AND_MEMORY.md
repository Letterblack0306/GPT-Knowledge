---
title: Agent Context and Memory
category: Agents
sub_category: Context and Memory
confidence: high
verified: true
last_reviewed: 2026-08-07
---

# Agent Context and Memory

## 1. Context is not memory

Context is the information supplied for the current model decision. Memory is information retained or reconstructed across decisions or sessions.

A large context window does not remove the need for context engineering. Irrelevant context can reduce accuracy, increase latency, and obscure the current task.

## 2. Context layers

Build context from explicit layers:

1. standing instructions and safety rules;
2. current task contract;
3. active plan and progress;
4. current environment state;
5. relevant retrieved knowledge;
6. recent tool evidence;
7. unresolved blockers and approvals.

Order and label the layers so authority and freshness are clear.

## 3. Working memory

Working memory supports the active task:

- current hypothesis;
- files or objects inspected;
- active target identifiers;
- decisions made;
- actions attempted;
- pending verification;
- retry count and budgets.

It should be bounded and disposable when the task ends.

## 4. Durable memory

Durable memory may include:

- stable user preferences;
- project architecture decisions;
- verified environment facts;
- recurring workflows;
- prior outcomes and blockers;
- reusable lessons.

Do not store secrets, temporary states, speculative conclusions, or private content without a defined reason and retention policy.

## 5. Memory record

```json
{
  "id": "",
  "type": "preference | decision | fact | outcome | lesson",
  "content": "",
  "source": "",
  "scope": "user | project | task",
  "confidence": "low | medium | high",
  "verifiedAt": "",
  "expiresAt": null,
  "supersedes": null
}
```

## 6. Retrieval

Retrieval should consider:

- task relevance;
- scope;
- recency;
- verification status;
- authority;
- conflicts;
- token cost.

Do not retrieve memory merely because keywords overlap.

## 7. Staleness

Stored information can become outdated. Distinguish:

- historical fact;
- current assumption;
- currently verified state.

Re-verify paths, ports, branches, runtime status, provider health, APIs, dependencies, prices, policies, and other mutable facts before acting on them.

## 8. Conflict handling

When memory conflicts with current evidence:

1. prefer direct current evidence;
2. preserve the old record as historical context;
3. mark it superseded or stale;
4. avoid silently rewriting history;
5. report consequential conflicts.

## 9. Summarization

Summaries should preserve:

- decisions;
- unresolved work;
- evidence references;
- blockers;
- acceptance status;
- important identifiers.

Do not summarize away uncertainty or convert unverified claims into facts.

## 10. Privacy and user control

Users should be able to understand what is remembered, correct it, revoke it, and define scope. Memory should improve continuity without becoming hidden authority over the current request.
