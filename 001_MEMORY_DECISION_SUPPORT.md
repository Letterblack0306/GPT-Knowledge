# Memory Decision Support — Quick Route

Use this route when a project decision could benefit from earlier plans, decisions, rejected ideas, implementation attempts, contradictions, or lessons buried in historical chats.

Registry skill:

- `skills/memory-assisted-decision-support/SKILL.md`

Detailed reference:

- `project-engineering/memory-assisted-decision-support.md`

Simple rule:

```text
important decision
→ recall relevant Memory
→ recover prior reasoning/plan
→ verify current workspace/runtime/GitHub
→ compare past intent with current reality
→ decide
```

Use Memory for historical context, not current truth.

Source roles:

```text
Memory = what we previously discussed/planned/decided
BirdEye workspace/index = what exists locally now
GitHub = what is committed remotely now
Runtime = what is actually running now
GPT-K = durable guidance and routing
```

Good triggers:

- "what did we decide before?"
- "did we already plan this?"
- "find old plans for this project"
- "why did we choose this architecture?"
- "what unfinished ideas are worth reconsidering?"
- "does current behavior contradict an old decision?"
- before a major architecture or roadmap decision when prior context may matter

A zero-result query can be a retrieval miss; try bounded alternate terms before concluding the topic was never discussed.

Do not query Memory for every small task. Use it when historical context could materially change the decision.
