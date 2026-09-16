---
name: memory-assisted-decision-support
description: "Use historical Memory selectively to recover prior plans, decisions, rejected ideas, and reasoning before making consequential project decisions; then verify against current workspace/runtime truth."
---

# Memory-Assisted Decision Support

## Purpose

Use historical Memory when an important decision may benefit from knowing what was previously planned, decided, rejected, attempted, or learned.

Memory is for **context and decision support**. It is not current implementation truth.

## Use this when

Use Memory before a consequential decision when any of these are likely relevant:

- prior project plans;
- earlier architecture decisions;
- rejected or superseded ideas;
- previous debugging conclusions;
- earlier implementation attempts;
- past trade-offs or constraints;
- "what did we decide before?";
- "did we already plan this?";
- "why was this designed this way?";
- "what were the next steps?";
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

## Decision rule

When Memory finds a useful historical plan or decision, ask:

1. What was the prior intent?
2. What evidence or constraint caused that decision?
3. Was it accepted, rejected, superseded, or merely discussed?
4. Does the current repository/runtime still match that assumption?
5. Does the historical evidence reveal a useful unfinished plan or prevent duplicate work?

Then decide from current evidence plus historical context.

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

## Useful output

Keep the result short:

```text
RECALLED:
- prior plan/decision

WHY IT MATTERS:
- relevant constraint or reasoning

CURRENT REALITY:
- what source/runtime shows now

DECISION IMPACT:
- continue / revise / reject / investigate
```

Do not turn every recall into a large report.

## Important safeguards

- A memory hit proves that something was recorded, not that it is still true.
- Zero results mean no supporting result was found for that query/scope; do not invent missing history.
- Preserve provenance when a historical claim materially affects a decision.
- Check surrounding chronology when a later message may have corrected or superseded an earlier one.
- Prefer current workspace/runtime evidence for claims about present behavior.
- Do not create a new feature merely because an old conversation mentioned it.

## Example

Question:

> What useful Brew plans did we discuss before that could help decide what to build next?

Use:

```text
Memory recall/search for Brew plans and decisions
→ recover important historical plans
→ inspect current Brew workspace/GitHub/runtime
→ identify which plans are already implemented, obsolete, or still useful
→ use that comparison to support the next decision
```

The value is not remembering everything. The value is recovering the right past reasoning at the moment it can improve a current decision.
