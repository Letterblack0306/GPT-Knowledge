# Process Recall — Canonical Project Truth Gate

Use this before project-state claims, implementation direction, cleanup, publication, PR/branch decisions, or historical-memory conclusions.

## 1. Verify first

Before making a project claim:

1. Check the current GPT-K canonical project record and routing guidance.
2. Check the current GitHub repository, branch, commit, source, open PRs, and relevant remote branches.
3. Check the active local worktree, HEAD, dirty/staged/untracked state, alternate worktrees, and local branches when local evidence is available.
4. Check relevant Google Drive chat-session exports, sync manifests, imported ChatGPT history, or agent-session history when historical context could materially affect the conclusion.
5. Prefer current runtime/user-visible evidence over older chat/history for present-state claims.
6. Expose contradictions between sources instead of reconciling them by assumption.
7. A zero-result memory/Drive search is a retrieval result, not proof that no history exists; retry through known folder hierarchy, aliases, session IDs, filenames, or export locations before concluding absence.

Short form:

```text
GPT-K canonical record
+ current repo/worktree/branches/PRs
+ current runtime evidence
+ relevant Drive/session history
→ compare provenance and chronology
→ expose contradictions
→ classify the claim
```

Historical evidence explains intent, chronology, prior decisions, rejected paths, and earlier acceptance. It does not silently override current workspace/repository/runtime truth.

## 2. Claim classifications

Use these labels for project/repository/runtime claims:

```text
PROVEN
IMPLEMENTED
DOCUMENTED
INFERRED
UNVERIFIED
STALE
BLOCKED
FAIL
DISPROVEN
```

Definitions:

- `PROVEN` — directly observed with evidence matching the exact claim level. Runtime/user-visible claims require claim-matched runtime/user-visible evidence.
- `IMPLEMENTED` — source/code/configuration for the capability exists, but the full claimed behavior has not necessarily been proven at runtime.
- `DOCUMENTED` — stated in documentation, plans, PR bodies, comments, GPT-K, or historical records; documentation is not implementation/runtime proof.
- `INFERRED` — reasoned from indirect evidence; not directly observed.
- `UNVERIFIED` — relevant claim has not been validated at the required evidence level.
- `STALE` — evidence or claim was valid/recorded for an older revision/state but is not authoritative for the current state.
- `BLOCKED` — required evidence cannot currently be collected because a real dependency, tool, permission, transport, or environment boundary prevents verification.
- `FAIL` — the required check or acceptance condition was executed and failed.
- `DISPROVEN` — direct evidence contradicts the claim.

## 3. No promotion by implication

Never promote these automatically:

```text
IMPLEMENTED -> PROVEN
DOCUMENTED  -> PROVEN
passing unit/focused tests -> end-to-end PROVEN
source reachability -> rendered/runtime PROVEN
PR body claim -> current implementation truth
historical chat claim -> current state
```

A passing lower-layer check proves only that lower-layer check unless evidence traverses the complete boundary required by the claim.

Examples:

```text
source file exists                         = IMPLEMENTED
focused smoke passes                       = IMPLEMENTED + test evidence
integration suite passes                   = IMPLEMENTED + integration evidence
real installed runtime path succeeds       = PROVEN for that runtime path
rendered UI consequence is observed        = PROVEN for that user-visible claim
```

## 4. Contradiction handling

When evidence sources disagree:

```text
historical/session claim
!= current worktree/repo/runtime
```

Do not choose the convenient source.

Instead:

1. preserve both provenance records;
2. check revision/branch/worktree/session chronology;
3. determine whether the difference is expected evolution, unpublished local work, stale PR/branch, incomplete migration, regression, reintroduced behavior, wrong workspace, or unresolved contradiction;
4. classify the old/current claim separately;
5. leave the present-state claim `UNVERIFIED` or `BLOCKED` if current evidence is insufficient;
6. use `DISPROVEN` only when direct evidence actually contradicts the claim.

## 5. Repository topology is mandatory

For implementation/cleanup/publication decisions, establish:

```text
repository
workspace/worktree
HEAD
active branch
upstream
ahead/behind
dirty/staged/untracked
other worktrees
local branches
remote branches
open PRs
PR base/head SHAs
ancestry / semantic ownership
```

Never mix evidence from different revisions into one synthetic “current state.”

Open PR/branch evidence must be checked before concluding that work is missing. Conversely, existence on a branch or PR does not make it current implementation.

## 6. Memory / Google Drive role

Relevant historical sources may include:

```text
chat_Print/
Chat_Dataexported/
GPT_Data/
Agents Memory/
project-specific synced folders
imported ChatGPT exports
agent/Cline session history
```

Use them to answer:

- what was intended?
- what was tried?
- what was accepted/rejected?
- what later corrected or superseded it?
- does current implementation contradict an earlier invariant?

For present-state claims, current repository/workspace/runtime evidence remains higher authority.

## 7. Required output discipline

When reporting consequential project status, separate at least:

```text
CURRENT REVISION / TOPOLOGY
PROVEN
IMPLEMENTED
DOCUMENTED
UNVERIFIED / BLOCKED
STALE / DISPROVEN
CONTRADICTIONS
NEXT BOUNDED CHECK
```

Do not hide contradictions by compressing all evidence into one overall PASS.

## Final rule

**Verify first. Keep repo/worktree/branch/PR/runtime/history evidence separate. Expose contradictions. Use the exact claim classifications above. Never promote implementation, tests, or documentation into PROVEN without evidence that matches the claim.**
