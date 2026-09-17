# LBE Launcher Reconciliation Publication Checkpoint — 2026-09-18

## Scope

Record the published reconciliation of the canonical `lbe` launcher in `Letterblack0306/LBE_Agents_wall_Intigration` without promoting source publication into installed/live acceptance.

## Remote publication — PROVEN

Repository: `Letterblack0306/LBE_Agents_wall_Intigration`

Branch: `main`

Verified remote HEAD:

`0284fd64944e764ef62c98dd6b1c70baa51137c3`

Commit message:

`Reconcile LBE launcher with provider and session owners`

GitHub `main` resolves to this commit.

## Published launcher behavior — PROVEN FROM COMMIT DIFF

The commit changes `lbe-cli.ps1` so that:

1. Provider configuration is mandatory and the launcher fails closed when `%USERPROFILE%\.cline\data\settings\providers.json` is absent.
2. `LBE_PROVIDER_CONFIG` is exported as the normalized full path to that provider configuration.
3. Before creating a session, the launcher lists persisted sessions for the derived `project_workspace_id`.
4. Persisted sessions are filtered by normalized, case-insensitive `canonical_workspace_root` equality and the most recently updated matching session is reused.
5. A new session is created only when no persisted session matches the normalized workspace root.
6. Newly created launcher sessions use `mode = audit`, `permission = read_only`, and `runtime_policy = audit`.
7. The existing LBE session/database/workspace identity environment is then exported before launching the client binary.

This remains a bounded launcher composition change. It does not introduce a second session owner, provider owner, execution owner, authorization owner, receipt owner, evidence owner, or completion owner.

## Local integration report — USER-REPORTED / NOT REMOTELY PROVABLE

The integration report states that the remote's existing two commits were preserved, the isolated temporary worktree was removed, and unrelated dirty files in the original checkout remained untouched.

These are local-worktree facts and are not independently provable from the GitHub remote alone. Preserve them as reported context until current local evidence is inspected.

## CI / workflow evidence

No GitHub commit status contexts were attached to `0284fd64944e764ef62c98dd6b1c70baa51137c3` at verification time, and no commit-associated workflow run was returned.

Therefore:

- source publication = PROVEN;
- exact remote branch head = PROVEN;
- commit diff semantics above = PROVEN;
- automated CI pass for this commit = NOT PROVEN;
- installed TTY/ConPTY behavior = NOT PROVEN by this checkpoint;
- live provider-backed turn = NOT PROVEN by this checkpoint;
- governed mutation / approval / receipt-evidence correlation = NOT PROVEN by this checkpoint;
- restart/resume acceptance = NOT PROVEN by this checkpoint;
- final installed product acceptance = NOT PROVEN.

## Project-state effect

This checkpoint supersedes the earlier client-composition remote publication state only for the launcher source reconciliation. It does **not** close the existing final-product acceptance gate.

The next project instruction must continue to separate:

`source implementation present / published`

from

`installed live product path proven`.
