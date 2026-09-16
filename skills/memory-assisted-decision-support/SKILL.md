---
name: memory-assisted-decision-support
description: "Use when prior plans, decisions, rejected ideas, debugging history, architecture rationale, unfinished work, or historical contradictions could materially affect a current project decision. Recall Memory through BirdEye, verify current workspace/runtime/GitHub truth, and use history as context rather than present-state authority."
---

# Memory-Assisted Decision Support

Use this skill when a consequential project decision could benefit from historical context.

## Trigger

Typical triggers:

- what did we decide before?
- did we already plan this?
- why was this designed this way?
- find old plans / rejected ideas / unfinished work
- could this proposal duplicate earlier work?
- does current behavior contradict an earlier decision?

Do not use Memory for every routine task.

## Loop

```text
QUESTION
→ recall relevant Memory
→ recover provenance + chronology
→ verify current BirdEye workspace/runtime/GitHub evidence
→ compare history with current reality
→ decide
```

## Source roles

```text
Memory   = historical plans/decisions/reasoning
BirdEye  = current local workspace/index evidence
GitHub   = canonical remote repository truth
Runtime  = live behavior truth
GPT-K    = durable methods/routing/reference
```

Present-state precedence:

```text
live runtime
> active local workspace/source
> canonical remote repository
> current project docs
> historical Memory
> model inference
```

## Retrieval

Use BirdEye Memory capabilities when available:

- `memory_recall`
- `memory_search`
- `memory_timeline`
- `memory_conversation`
- `memory_message`
- `memory_related`
- `memory_sources`

Start broad, then narrow. Preserve provenance when history materially affects the decision.

A zero-result query is not proof the topic was never discussed. Try one or two materially different terms, aliases, identifiers, or a broader scoped recall before concluding that no supporting history was found.

## Contradictions

If historical Memory and current reality disagree materially:

```text
verify both sides
→ check chronology/supersession
→ classify expected evolution vs incomplete migration vs regression/reintroduced behavior vs unresolved contradiction
```

Current evidence wins for present-state claims, but the disagreement may reveal a real defect or architecture drift.

Do not silently promote a historical/indexed claim into current truth when current evidence is missing or contradictory. For consequential decisions, unresolved contradiction is a reason to investigate or remain evidence-insufficient, not a reason to choose whichever source is more convenient.

## Executable worked example — LBE Guard Inspector

`Letterblack0306/LBE_Presistent_Agent_wall` contains an executable form of this evidence-boundary doctrine.

Its evidence package separates:

```text
indexed_reference_evidence
current_workspace_evidence
```

and carries evidence metadata such as `authority`, `verified`, and `classification`. Its guard-evaluation policy enforces stronger present-state requirements:

- indexed-only rule results cannot claim workspace `PASS` or `FAIL`;
- a rule result without current workspace evidence references is downgraded to `INSUFFICIENT_EVIDENCE`;
- contradictions between indexed/reference evidence and current workspace evidence prevent an unsupported `PASS`.

Relevant implementation/reference surfaces include:

- `lbe_guard_inspector/evidence_service.py`
- `lbe_guard_inspector/guard_inspector.py`
- `schemas/evidence_package.schema.json`
- `tests/test_evidence_service.py`
- `tests/test_guard_inspector.py`
- `tests/test_guard_runner.py`

Use this as a **worked implementation pattern**, not as a universal numeric scoring contract. The exact `authority` numbers belong to that repository's evidence model. The reusable invariant is:

```text
historical/indexed/reference evidence
≠ present-state proof

present-state claim
→ require current authoritative evidence

reference/current contradiction
→ block unsupported promotion
→ investigate or remain evidence-insufficient
```

For Memory-assisted decisions, Memory is analogous to historical/reference context: valuable for intent, chronology, and contradiction discovery, but never sufficient by itself to prove current implementation or runtime state.

## Safeguards

- A Memory hit proves something was recorded, not that it is still true.
- Check whether a plan was accepted, rejected, corrected, or superseded.
- Never let historical Memory silently override current source/runtime evidence.
- Do not invent history when retrieval fails.
- Do not dump the full archive into context.
- Do not convert implementation-specific evidence scores from another system into universal precedence weights.
- When current authoritative evidence is absent, prefer `UNVERIFIED` / `INSUFFICIENT_EVIDENCE` over an inferred present-state claim.

## Output

Keep results concise:

```text
RECALLED: prior plan/decision
WHY IT MATTERS: relevant reasoning/constraint
CURRENT REALITY: current evidence
CONTRADICTION: none / resolved / unresolved
DECISION IMPACT: continue / revise / reject / investigate
```

Detailed reference: `project-engineering/memory-assisted-decision-support.md`
Ownership/routing reference: `project-engineering/letterblack-mcp-ecosystem-and-routing.md`
