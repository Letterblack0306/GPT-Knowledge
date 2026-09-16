# Project Truth Reconciliation

## Purpose

Use this workflow before accepting a project-state claim, planning cleanup, merging branches, closing PRs, publishing local work, or treating historical memory as current truth.

The goal is to reconcile **current implementation evidence** with **repository topology** and **historical/session evidence** without collapsing them into one state.

## Core rule

```text
current project truth
= reconcile, do not merge conceptually

live runtime evidence
+ active worktree/source
+ local Git topology
+ remote branches / PRs
+ current GitHub state
+ historical chat/session evidence
+ GPT-K durable guidance
```

Each source keeps its own authority and provenance.

Historical memory can explain intent, chronology, rejected paths, prior acceptance, and unfinished work. It cannot silently override the current workspace, repository, or runtime.

Likewise, absence from the active worktree does not prove work is missing until branches, PRs, alternate worktrees, and historical project evidence have been checked.

## Mandatory repository topology pass

Before implementation or cleanup claims, establish:

```text
repository identity
workspace root
current worktree
current HEAD
active branch
upstream
local ahead / behind
tracked modifications
staged modifications
untracked paths
all worktrees
relevant local branches
relevant remote branches
open PRs
PR base branch + SHA
PR head branch + SHA
```

Never combine evidence from different worktrees, branches, PR heads, or snapshots without naming the source revision.

Useful classifications:

```text
CANONICAL_CURRENT
CANONICAL_CURRENT_LOCAL
PENDING_PR
UNMERGED_BRANCH
DIRTY_LOCAL_ONLY
GENERATED_EVIDENCE
SEPARATE_PROJECT
ALREADY_PRESENT
PARTIALLY_PRESENT
STILL_UNIQUE
SUPERSEDED
CONFLICTING
HISTORICAL_ONLY
UNKNOWN
```

## PR reconciliation

For every relevant open PR, check ancestry before relying on filename overlap.

```text
PR head is ancestor of current main
→ ALREADY_PRESENT

PR head is not ancestor
→ inspect semantic diff
→ PARTIALLY_PRESENT / STILL_UNIQUE / SUPERSEDED / CONFLICTING / HISTORICAL_ONLY
```

Filename overlap is discovery evidence only. It does not prove semantic equivalence.

An open PR is not current implementation merely because it exists. A merged or ancestrally incorporated PR may still remain open and stale. Conversely, work absent from `main` may still exist as valid pending work on a branch or PR.

Do not close, merge, retarget, or delete a PR/branch until this classification is complete.

## Worktree and local-only reconciliation

Keep these distinct:

```text
tracked current source
!= dirty tracked modification
!= staged change
!= untracked source candidate
!= generated evidence
!= nested/separate project
```

If tracked source imports or otherwise requires an untracked source file, classify that as a repository reproducibility defect until the ownership/admission decision is made.

A passing test does not by itself authorize admission. Prove:

```text
active owner
runtime/source reachability
package/build/test ownership
absence of duplicate owner
appropriate validation
```

Generated evidence, logs, build output, and nested projects must not be swept into source admission or cleanup merely because they share the same directory tree.

## Historical/session evidence route

Historical project evidence should be consulted when it could materially affect a decision, especially for:

- prior architecture decisions;
- old implementation attempts;
- branch/PR intent;
- rejected or superseded approaches;
- acceptance history;
- unexplained local-only files;
- claims that current behavior contradicts prior decisions.

For this Letterblack workspace, Google Drive contains separate historical/local evidence surfaces under the synced project evidence root, including:

```text
chat_Print/
Chat_Dataexported/
  GPT_Data/
Agents Memory/
46_Accecc_Browser_Agent/
```

Treat these as historical/reference evidence unless a file is independently proven to be the active workspace or live runtime owner.

When Drive keyword search returns zero results, do not conclude the history is absent. Search by the known folder hierarchy / parent folder IDs, aliases, project names, session IDs, filenames, or exported data locations before classifying the evidence as missing.

Large ChatGPT exports may contain opaque `.dat` / HTML artifacts. Their filenames alone do not identify project relevance. Preserve source identity and inspect content/metadata before using them as evidence.

## Memory versus current truth

Use the LBE Guard Inspector pattern as the reusable model:

```text
historical/indexed/reference evidence
!= current workspace evidence
```

For present-state claims:

```text
current authoritative evidence required
+ contradiction check
+ provenance
```

If current evidence is missing or contradicts historical evidence, do not promote the historical claim into current truth. Use `UNVERIFIED`, `UNKNOWN`, `BLOCKED`, or `INSUFFICIENT_EVIDENCE` as appropriate.

If a historical claim conflicts with current evidence, investigate whether the difference is:

```text
expected evolution
incomplete migration
regression
reintroduced behavior
stale branch/PR
wrong worktree
unpublished local work
unresolved contradiction
```

## Evidence authority by question

For a current-behavior claim:

```text
live runtime
> active local workspace/source
> canonical GitHub revision
> current project documentation
> historical session/chat evidence
> model inference
```

For a historical question, the historical source is authoritative for what was said/done at that time, subject to provenance and later correction/supersession.

For repository publication/cleanup decisions, topology is mandatory evidence; runtime truth alone does not tell you which branch or PR owns the work.

## Required comparison loop

```text
1. identify exact project/repository/workspace
2. establish active worktree + HEAD + branch
3. inspect local dirty/staged/untracked state
4. enumerate relevant worktrees/branches/PRs
5. classify ancestry and semantic ownership
6. retrieve relevant historical/session evidence when material
7. compare prior intent with current implementation/runtime
8. identify contradictions or unpublished work
9. make the smallest bounded decision
10. validate at the level of the claim
11. update GPT-K only with durable learned truth
```

## Mutation boundary

Read-only reconciliation does not authorize mutation.

Before any push, merge, commit, PR close, branch delete, reset, rebase, force-push, `git clean`, or broad cleanup:

- establish exact target and revision again;
- re-fetch current remote state;
- confirm the operation is still semantically correct;
- require the applicable user/workspace authorization;
- stop if topology changed.

## Completion rule

Do not say a project is reconciled merely because tests pass or Git is clean.

A consequential project-state conclusion is complete only when the relevant layers are explicitly separated and reconciled:

```text
repository topology
source ownership
runtime reachability
validation evidence
historical/session contradictions
remaining unknowns
```

Short rule:

> **Never let Memory replace current truth, and never let the active worktree hide valid work that lives in another branch, PR, worktree, or historical project record. Reconcile all relevant evidence before acting.**
