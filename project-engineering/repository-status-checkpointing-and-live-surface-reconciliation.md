# Repository Status Checkpointing and Live-Surface Reconciliation

## Knowledge metadata

- Recorded: 2026-08-18
- Scope: reusable method for long-running repository work involving dirty worktrees, remote/local drift, duplicate UI surfaces, regression tests, recovery stashes, and completion claims
- Source: Access Browser Agent reconciliation and validation work
- Status: reusable lesson derived from observed engineering evidence
- Authority: method guidance only; never substitutes for current repository or runtime inspection

## Problem pattern

Long-running agent work can converge on a false completion state when several boundaries are mixed:

```text
local dirty implementation
    + remote branch advances
    + untracked regression test
    + duplicate/unwired UI surface
    + recovery stash
    ↓
partial validation
    ↓
ambiguous “complete” claim
```

The corrective sequence is:

```text
remote baseline
→ local status
→ identify active runtime owner
→ reconcile remote/local state
→ compare duplicate artifacts
→ validate exact active path
→ record remote/local boundary
→ commit bounded change set
```

## 1. Separate remote truth from local validated truth

Always record both:

```text
REMOTE
branch + HEAD + committed files

LOCAL
branch + HEAD + dirty files + untracked files + validated behavior
```

A locally validated change is not a repository change until it is committed and pushed.

Use explicit wording:

```text
PROVEN LOCALLY, NOT YET REMOTE
```

rather than silently promoting the local result into repository status.

## 2. Prove the active runtime owner before changing a matching duplicate

A visually or structurally matching file is not necessarily the live implementation.

Before changing UI code, establish:

```text
entrypoint
→ active DOM owner
→ event subscription
→ render/update function
→ live validation guard
```

A repository guard that explicitly keeps a candidate view unwired is strong evidence that the candidate is not the live owner.

Do not patch an unwired duplicate merely because it resembles a demo.

## 3. Regression tests must be part of the validation chain

A new focused regression test can pass locally while remaining invisible to normal validation if it is only an untracked file or not referenced by the repository check script.

Required reconciliation:

```text
new regression test
→ tracked file
→ validation script registration
→ exact test execution
→ repository commit
```

Do not call the implementation fully protected until all four are true.

## 4. Recovery stashes are temporary evidence-preservation tools

When reconciling a dirty worktree with a remote fast-forward:

1. create a uniquely named recovery stash;
2. fast-forward remote baseline;
3. restore local changes;
4. validate the merged state;
5. compare stash contents against the restored worktree;
6. only then remove the stash.

Do not repeatedly pop a stash after a tracked/untracked collision. First prove whether the stash contains information that is absent from the reconciled worktree.

## 5. Untracked files require identity comparison

When a file becomes tracked remotely while an older local copy remains in a stash or worktree:

```text
remote version
vs
local/stash version
```

must be compared by actual content or object hash.

Do not assume “same filename” means “same test”. Stronger coverage can exist only in the older local copy.

## 6. Status records are checkpoints, not authorities

A dated status file should explicitly state:

- branch;
- HEAD;
- what is committed remotely;
- what is only locally validated;
- remaining dirty/untracked state;
- validation performed;
- explicit limitations.

The status file must never imply that local dirty changes are part of remote history.

Current repository state and runtime evidence outrank the status document.

## 7. Knowledge repositories should store the reusable method, not a project snapshot

A reusable engineering knowledge base should not become a second project-status authority.

Store the durable lesson:

```text
how to reconcile
how to verify
how to prevent drift
how to classify evidence
```

Keep project-specific status in the project repository.

This prevents the knowledge base from becoming stale implementation truth while still preserving the method learned from the project.

## 8. Claim vocabulary

Use bounded classifications:

| Claim | Meaning |
| --- | --- |
| PROVEN REMOTE | committed and present on the target repository/branch |
| PROVEN LOCAL | validated in the current local workspace but not committed/pushed |
| UNVERIFIED | implementation exists but matching validation was not run |
| DISPROVEN | current evidence contradicts the claim |
| BLOCKED_CONFIGURATION | required repository/runtime condition unavailable |
| STALE_TEST_OR_FIXTURE | validation target no longer matches the active implementation |

Never collapse these into generic “done”.

## Reusable rule

When a long-running coding session reaches a checkpoint, answer four separate questions:

```text
What is committed remotely?
What is validated locally?
What is still dirty/untracked?
What is the actual live runtime owner?
```

Only after those four answers agree should a task be treated as repository-aligned.
