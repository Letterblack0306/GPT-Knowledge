# Access Browser Agent — Repository Consolidation Audit

Date: 2026-08-31

## Purpose

Record the principal integration lineage, the current canonical integration candidate, the local remote-identity hazard, and the evidence gates required before consolidation.

## Evidence classes

- GitHub branch topology and compare counts below were re-verified through the GitHub repository API.
- Local SSH alias behavior, local object-store absence of `beeab173...`, local `main = 7742860...`, and the unpushed IDE line come from the current local audit and were not independently reproduced by GPT-Knowledge tooling.

## GitHub API authority

```text
repository = Letterblack0306/Accecc_Browser_Agent
main       = beeab1738334b854a315793d870f4b9dfbb7ea67
```

Current `main` is not the full principal architecture line.

## Principal lineage

```text
#15 rebuild/fresh-ui-shell-loop-20260814
  +15 -> #16 feat/general-browser-tools-evals-20260816
   +7 -> #17 feat/state-driven-ui-acceptance-20260816
 +146 -> #18 refactor/browser-conversation-turn-transport-20260816
  +11 -> #23 feat/acceptance-evidence-runner-20260818
```

GitHub compare against current main:

| Branch / PR | Ahead | Behind | Classification |
|---|---:|---:|---|
| #15 rebuild/fresh-ui-shell-loop-20260814 | 355 | 11 | stack root |
| #16 feat/general-browser-tools-evals-20260816 | 370 | 11 | strict descendant of #15 |
| #17 feat/state-driven-ui-acceptance-20260816 | 377 | 11 | strict descendant of #16 |
| #18 refactor/browser-conversation-turn-transport-20260816 | 523 | 11 | strict descendant of #17 |
| #23 feat/acceptance-evidence-runner-20260818 | 534 | 11 | strict descendant of #18; newest principal tip |
| #20 r3/canonical-46-integration-20260816 | 460 | 11 | divergent parallel line |

Direct compare confirms:

```text
#16 vs #15: ahead 15 / behind 0
#17 vs #16: ahead 7 / behind 0
#18 vs #17: ahead 146 / behind 0
#23 vs #18: ahead 11 / behind 0
```

Therefore:

`PR23 = PROVEN_NEWEST_COMPLETE_PRINCIPAL_LINEAGE_TIP`

## PR #20 divergence

Direct compare of #20 against #18:

```text
status     = diverged
#20 ahead  = 41
#20 behind = 104
merge base = 68eff6f3708bca0198453d6ec9c25ccd862fdc61
```

Therefore #20 is not the canonical integration tip and must not be merged as-is. Its 41 unique commits require an orphan-scope audit before retirement.

## Local remote identity hazard

The local audit reports three distinct lines:

1. GitHub API-authoritative repository: `main = beeab173...` with the full branch set.
2. The repository reached through the configured SSH alias: `main = 7742860...`, reportedly exposing only a single branch.
3. The local working tree: `main = 7742860...` plus unpushed IDE/editor-tab/Git-diff work and a dirty mid-cleanup tree.

The SSH alias resolution itself has not been reproduced through GPT-K tooling, so preserve the classification:

`LOCAL_SSH_REMOTE_DIVERGENCE = PROVEN_BY_LOCAL_AUDIT`

Operational consequence:

`DO_NOT_PUSH_CURRENT_LOCAL_ORIGIN_UNTIL_REMOTE_IDENTITY_IS_REPOINTED_AND_REVERIFIED`

## Canonical integration candidate

```text
PR     = #23
branch = feat/acceptance-evidence-runner-20260818
head   = b797518a8380cf3b243d78d517b7ae268b7431d9
main relation = ahead 534 / behind 11
#18 relation = ahead 11 / behind 0
```

Architecture containment is proven by ancestry. Merge readiness is not.

Required validation before integration:

```text
checkout exact b797518a8380cf3b243d78d517b7ae268b7431d9
npm run check
any repository-required focused acceptance for the integration candidate
verify clean/expected working tree
record exact-head evidence
```

Current classification:

`PR23_MERGE_READINESS = UNVERIFIED`

## Retirement candidates

Pending explicit authorization and orphan-scope checks:

- #20: retire after auditing its 41 unique commits against current #18/#23 recovery scope.
- #15/#16/#17/#18: after successful #23 integration, close/delete by ancestry because they are contained in #23.
- #19: keep separate; LBE-exec removal is orthogonal and not proven contained in #23.
- #8/#9: keep independent until explicitly merged or closed.
- Early side branches: audit unique commits before deletion; do not infer supersession from age alone.

## Consolidation sequence

1. Fix and verify local remote identity.
2. Preserve local `7742860...` IDE work on its own branch.
3. Validate exact #23 head.
4. Integrate #23 into current main or a fresh integration branch cut from current main.
5. Rebase/evaluate #19 independently.
6. Audit and retire #20 if no unique required scope remains.
7. Retire contained #15/#16/#17/#18 after successful integration.
8. Enable branch protection and required CI on main.

## Final classification

```text
GITHUB_API_MAIN              = PROVEN_BEEAB173
PRINCIPAL_STACK              = PROVEN_15_TO_16_TO_17_TO_18_TO_23
CANONICAL_INTEGRATION_TIP    = PR23_B797518A
PR23_MERGE_READY             = UNVERIFIED
PR20                         = DIVERGED_PARALLEL_LINE
LOCAL_REMOTE_IDENTITY        = BLOCKING_HAZARD_PROVEN_BY_LOCAL_AUDIT
LOCAL_UNPUSHED_IDE_LINE      = MUST_BE_PRESERVED
CURRENT_MAIN_CI_PROTECTION   = ABSENT
NEXT_GATE                    = REMOTE_REPOINT_AND_PR23_EXACT_HEAD_VALIDATION
```
