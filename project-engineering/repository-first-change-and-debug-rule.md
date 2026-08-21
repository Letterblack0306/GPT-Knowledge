# Repository-First Change and Debug Rule

## Status

Canonical execution rule for Letterblack engineering work where file creation or patching is required.

## Rule

All durable file creation and source/documentation patches must be made through the authoritative GitHub repository first, normally on the canonical `main` branch unless a project-specific policy explicitly requires otherwise.

Do not create durable source changes only in a local workspace and then treat the local filesystem as authority.

## Why

Repository-first changes provide an exact, durable comparison boundary for:

- commit SHA identification;
- before/after diff inspection;
- regression attribution;
- rollback and recovery;
- multi-agent/session coordination;
- remote-vs-local reconciliation;
- debugging against an exact source revision;
- deployment revision verification.

## Required workflow

```text
inspect/prove owner
→ make durable patch/create in authoritative repository
→ record commit SHA and diff
→ local workspace fast-forward pulls exact repository revision
→ verify exact HEAD/status
→ run focused local regression/debugging
→ classify result
→ if another source change is required, return to repository-first mutation
→ synchronize project knowledge / live projection when material
```

## Local workspace boundary

Local execution is primarily for:

- inspection;
- tests;
- debugging;
- runtime/live acceptance;
- generated build artifacts;
- temporary bounded diagnostics.

A temporary diagnostic file may exist locally only when it is explicitly disposable and not part of the accepted implementation. If the diagnostic becomes useful durable test/source/documentation, create it in the repository before relying on it as project state.

## Comparison rule

For every consequential patch or file creation, preserve:

```text
BASE SHA:
HEAD SHA:
COMMITS AHEAD:
FILES CHANGED:
```

Use repository diff/compare as the primary change boundary. Local status is evidence of synchronization and generated/untracked artifacts; it is not a substitute for the repository diff.

## Debugging rule

When a regression appears after a change:

1. identify the exact repository commit that introduced the candidate change;
2. compare it with the prior proven revision;
3. reproduce locally only after fast-forwarding to that exact revision;
4. classify product defect vs test/harness/environment failure before another patch;
5. apply the next durable patch through the repository, not as an untracked local fix.

## Branch/worktree rule

Do not create random branches, worktrees, duplicate roots, or local-only authority paths merely to make a patch. Preserve the project’s canonical branch/workspace policy. For the current Letterblack workflow, `main` is the default source authority unless an explicit project rule states otherwise.

## Relationship to evidence-driven-engineering

This rule is an execution boundary underneath `evidence-driven-engineering`:

```text
evidence-driven-engineering proves whether a patch is authorized
→ repository-first rule determines where the durable patch is made
→ LoopTool/local runtime proves the resulting revision
```

The repository-first rule does not authorize implementation by itself. A proven missing or defective owner is still required before mutation.
