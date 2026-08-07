# Letterblack Governance Debugging References

## Purpose

Use this document only when a debugging or implementation task involves execution authority, policy, guards, proof, workspace trust, completion claims, blocked actions, or governance boundaries.

This is a routing/reference map. It does not preload either repository and does not make their rules universal defaults for unrelated projects.

## Primary repositories

### LBE Core — execution boundary

Repository: https://github.com/Letterblack0306/LetterBlack-LBE-Core

Use when the question is about:

- whether an agent is allowed to execute a side effect;
- controller / adapter / host ownership;
- execution scope, identity, capability, or policy checks;
- approval, deny, incomplete-proof, or completion-boundary behavior;
- whether a tool path bypasses the governed execution boundary;
- audit/proof produced by governed execution.

Current repository definition: LBE Core sits between an AI agent and real mutation tools. The agent proposes; the controller validates and decides; an approved adapter executes; the host accepts completion only when proof is sufficient.

Important boundary: LBE governs only actions routed through its execution boundary. Independent filesystem, shell, or host-tool access can bypass it and is therefore outside LBE control.

Before modifying LBE governance or execution behavior, inspect the current repository and its `WHAT_WE_MISSED.md` rather than relying on this summary.

### LB Guards & Rules — workspace trust and proof guards

Repository: https://github.com/Letterblack0306/LB_Guards_Rules

Use when the question is about:

- repository/workspace guards;
- proof bound to current Git `HEAD`;
- blocked commit, push, release, or DONE claims;
- missing modules, duplicate indexes, hardcoded paths, environment contracts, architecture boundaries, circular dependencies, generated pollution, secrets, destructive commands, UI hardcoding, or change governance;
- workspace-specific guard profiles;
- whether a passing test or historical profile is being mistaken for current proof.

The repository is the Letterblack guard/rule gallery. Reusable guard implementations live under `src/guards/`; workspace-specific snapshots live under `profiles/`.

Important boundary: a profile is configuration/history evidence, not proof that its guards ran successfully. Runtime/test proof must be checked against the active workspace and current `HEAD`.

## Debugging route

```text
Observed failure
  -> classify failure with unified-agent-engineering-methods.md
  -> inspect live workspace/runtime first
  -> if authority/execution boundary is implicated:
       inspect LetterBlack-LBE-Core
  -> if repository guard/proof/policy boundary is implicated:
       inspect LB_Guards_Rules
  -> identify the exact active rule/controller/adapter/guard
  -> compare expected contract with live evidence
  -> fix the earliest proven owner
  -> validate source + tests + runtime/user-visible behavior as required
```

## Selection rules

- Do not consult these repositories merely because a project uses the Letterblack ecosystem.
- Do not load both repositories unless both execution authority and workspace-guard behavior are relevant.
- Never copy a rule from a historical workspace profile into another workspace as a universal default.
- Never treat a guard name, README, configured policy, passing unit test, or UI status as proof that the active runtime enforcement path executed.
- Live workspace source and runtime evidence outrank this reference map.
- If the target project defines its own stricter rule or authority boundary, the project-specific contract takes precedence.

## Source verification

Reviewed: 2026-08-07

Sources inspected:

- `Letterblack0306/LetterBlack-LBE-Core` `main` README
- `Letterblack0306/LB_Guards_Rules` `main` README

Repository contents evolve. Re-read the relevant current files before making implementation decisions.