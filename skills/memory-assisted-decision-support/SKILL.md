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

## Safeguards

- A Memory hit proves something was recorded, not that it is still true.
- Check whether a plan was accepted, rejected, corrected, or superseded.
- Never let historical Memory silently override current source/runtime evidence.
- Do not invent history when retrieval fails.
- Do not dump the full archive into context.

## Output

Keep results concise:

```text
RECALLED: prior plan/decision
WHY IT MATTERS: relevant reasoning/constraint
CURRENT REALITY: current evidence
DECISION IMPACT: continue / revise / reject / investigate
```

Detailed reference: `project-engineering/memory-assisted-decision-support.md`
Ownership/routing reference: `project-engineering/letterblack-mcp-ecosystem-and-routing.md`
