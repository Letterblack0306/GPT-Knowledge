# Memory Decision Support — Quick Route

Use this route when a project decision could benefit from earlier plans, decisions, rejected ideas, implementation attempts, contradictions, or lessons buried in historical chats.

Registry skill:

- `skills/memory-assisted-decision-support/SKILL.md`

Detailed references:

- `project-engineering/memory-assisted-decision-support.md`
- `project-engineering/project-truth-reconciliation.md`

Simple rule:

```text
important decision
→ recall relevant Memory / Drive session history
→ recover prior reasoning/plan + provenance
→ establish current worktree/HEAD/branch
→ reconcile local branches, remote branches, worktrees, and open PRs
→ verify current workspace/runtime/GitHub
→ compare past intent with current reality
→ resolve contradiction or remain evidence-insufficient
→ decide
```

Use Memory for historical context, not current truth.

Do not let the active worktree hide relevant work that exists in another branch, PR, worktree, or historical project record.

Source roles:

```text
Memory / Drive chat-session exports = what we previously discussed/planned/decided
BirdEye workspace/index = what exists locally now
Git local topology = current worktree, local branches, dirty/untracked state
GitHub = remote branches, commits, PRs, checks, current remote truth
Runtime = what is actually running now
GPT-K = durable guidance and routing
```

For Letterblack project reconciliation, the synced Google Drive evidence root includes separate surfaces such as `chat_Print/`, `Chat_Dataexported/GPT_Data/`, `Agents Memory/`, and project folders. These are historical/reference evidence unless independently proven to be an active source/runtime owner.

Good triggers:

- "what did we decide before?"
- "did we already plan this?"
- "find old plans for this project"
- "why did we choose this architecture?"
- "what unfinished ideas are worth reconsidering?"
- "does current behavior contradict an old decision?"
- "is this missing from main or does it already exist in another PR/branch?"
- "can this PR/branch/worktree be cleaned up safely?"
- before a major architecture, roadmap, merge, push, cleanup, or publication decision when prior context may matter

A zero-result Memory or Drive keyword query can be a retrieval miss; try bounded alternate terms and, when known folder IDs exist, inspect the folder hierarchy directly before concluding the topic was never discussed.

Do not query Memory for every small task. Use it when historical context could materially change the decision.
