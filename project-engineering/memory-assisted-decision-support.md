---
name: memory-assisted-decision-support
description: "Use historical Memory selectively to recover prior plans, decisions, rejected ideas, reasoning, contradictions, and unfinished work before consequential project decisions; verify against current workspace/runtime/GitHub truth."
---

# Memory-Assisted Decision Support

## Purpose

Use historical Memory when an important decision may benefit from knowing what was previously planned, decided, rejected, attempted, contradicted, or learned.

Memory is for **context and decision support**. It is not current implementation truth.

For the broader ownership/routing model, also see `project-engineering/letterblack-mcp-ecosystem-and-routing.md`.

## Use this when

Use Memory before a consequential decision when any of these are likely relevant:

- prior project plans;
- earlier architecture decisions;
- rejected or superseded ideas;
- previous debugging conclusions;
- earlier implementation attempts;
- past trade-offs or constraints;
- historical claims that conflict with current source/runtime behavior;
- "what did we decide before?";
- "did we already plan this?";
- "why was this designed this way?";
- "what were the next steps?";
- "did we previously reject or replace this?";
- a new proposal might duplicate old work.

Do not query Memory for every ordinary question. Use it when historical context could materially change the decision.

## Simple decision loop

```text
CURRENT QUESTION
→ recall relevant history
→ recover the important plan/decision and provenance
→ inspect current workspace/runtime/repository truth
→ compare past intent with current reality
→ make the decision from both
```

## Source roles

Keep these roles separate:

```text
Memory
= what was previously discussed, planned, decided, rejected, or learned

BirdEye workspace/index
= what exists locally now

GitHub
= what is committed remotely now

Runtime/browser/provider
= what is actually running now

GPT-Knowledge
= durable methods, architecture guidance, and routing
```

Historical Memory must never silently override newer source/runtime evidence.

## Retrieval behavior

Start broad, then narrow only when needed.

Good first questions include:

- project name + "plan"
- project name + "decision"
- project name + "architecture"
- project name + "next step"
- project name + specific feature/problem

Use Memory capabilities through BirdEye when available:

- `memory_recall` — broad relevant historical context;
- `memory_search` — targeted terms/phrases/identifiers;
- `memory_timeline` — chronology and supersession;
- `memory_conversation` — surrounding conversation context;
- `memory_message` — exact message evidence;
- `memory_related` — supporting discovery;
- `memory_sources` — provenance/source identity.

Do not dump the entire archive into context.

A zero-result query is not proof that the topic was never discussed. Before concluding absence, retry with one or two materially different terms, project aliases, feature names, identifiers, or a broader scoped recall when justified. If nothing useful is found after bounded retries, report that no supporting history was found for the searched scope.

## Decision rule

When Memory finds a useful historical plan or decision, ask:

1. What was the prior intent?
2. What evidence or constraint caused that decision?
3. Was it accepted, rejected, superseded, or merely discussed?
4. Does the current repository/runtime still match that assumption?
5. Does the historical evidence reveal a useful unfinished plan or prevent duplicate work?

Then decide from current evidence plus historical context.

## Contradiction handling

If Memory and current reality actively disagree, do not classify the Memory result as ordinary staleness and move on automatically.

Treat the disagreement as a useful signal:

```text
historical claim/decision
≠ current workspace/runtime
→ verify both sides
→ check chronology/supersession
→ determine whether this is expected evolution, an incomplete migration, regression, reintroduced behavior, or unresolved contradiction
```

Examples include a historically rejected path that is active again, a feature remembered as removed but present in the current runtime, or a previously required invariant that current source violates.

Current evidence still wins for present-state claims, but the contradiction may expose a real defect or architecture drift worth investigating.

For consequential present-state decisions, unresolved contradiction should block silent promotion of historical/indexed information into current truth. If current authoritative evidence is missing, remain `UNVERIFIED` / `INSUFFICIENT_EVIDENCE` rather than filling the gap from Memory.

## Evidence precedence

For present-state decisions:

```text
live runtime
> active local workspace/source
> canonical remote repository
> current project documentation
> historical Memory
> model inference
```

For a question specifically about what happened historically, the historical source is authoritative for that historical fact, subject to provenance/context.

## Executable worked example — LBE Guard Inspector

The repository `Letterblack0306/LBE_Presistent_Agent_wall` implements a concrete evidence-boundary pattern that is directly relevant to Memory-vs-current-state decisions.

Its evidence package separates:

```text
indexed_reference_evidence
current_workspace_evidence
```

Evidence records carry fields including `authority`, `verified`, and `classification`. The current guard-evaluation policy establishes these relevant invariants:

1. indexed-only rule results cannot become workspace `PASS` or `FAIL`;
2. a rule result lacking current workspace evidence references is downgraded to `INSUFFICIENT_EVIDENCE`;
3. contradictions between indexed/reference evidence and current workspace evidence prevent an unsupported `PASS`.

Representative implementation and proof surfaces:

```text
lbe_guard_inspector/evidence_service.py
lbe_guard_inspector/guard_inspector.py
schemas/evidence_package.schema.json
tests/test_evidence_service.py
tests/test_guard_inspector.py
tests/test_guard_runner.py
```

This is a worked implementation pattern, not a universal numeric scoring standard. The exact `authority` values are local to the Guard Inspector's evidence model and must not be copied as generic Memory weights.

The reusable decision invariant is:

```text
reference/history can inform
reference/history cannot prove current state

current claim
→ require current authoritative evidence

reference/current contradiction
→ block unsupported promotion
→ investigate or remain evidence-insufficient
```

Applied to Memory:

```text
Memory
= historical/reference context

current workspace/runtime/GitHub
= present-state evidence

Memory/current contradiction
= investigation signal, not automatic override in either direction
```

This extends the precedence list into an executable decision pattern: do not merely rank sources; also fail closed when the stronger evidence required for a claim is absent or contradicted.

## Useful output

Keep the result short:

```text
RECALLED:
- prior plan/decision

WHY IT MATTERS:
- relevant constraint or reasoning

CURRENT REALITY:
- what source/runtime shows now

CONTRADICTION:
- none / resolved / unresolved

DECISION IMPACT:
- continue / revise / reject / investigate
```

Do not turn every recall into a large report.

## Important safeguards

- A memory hit proves that something was recorded, not that it is still true.
- Zero results mean no supporting result was found for that query/scope; query mismatch is a possible false negative until bounded alternate terms are tried.
- Preserve provenance when a historical claim materially affects a decision.
- Check surrounding chronology when a later message may have corrected or superseded an earlier one.
- Investigate material contradictions between historical decisions and current reality instead of silently discarding either side.
- Prefer current workspace/runtime evidence for claims about present behavior.
- Do not create a new feature merely because an old conversation mentioned it.
- Do not import evidence-authority numbers from another implementation as universal source weights.
- When current authoritative evidence required for a present-state claim is absent, remain `UNVERIFIED` / `INSUFFICIENT_EVIDENCE`.

## Example

Question:

> What useful Brew plans did we discuss before that could help decide what to build next?

Use:

```text
Memory recall/search for Brew plans and decisions
→ recover important historical plans
→ inspect current Brew workspace/GitHub/runtime
→ identify which plans are already implemented, obsolete, contradictory, or still useful
→ use that comparison to support the next decision
```

The value is not remembering everything. The value is recovering the right past reasoning at the moment it can improve a current decision.
