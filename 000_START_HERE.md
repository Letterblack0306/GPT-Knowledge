# Start Here

This repository is a selective decision aid, not a monolithic prompt.

## Mandatory boot rules

1. Load only the minimum knowledge required for the current task.
2. Do not load unrelated domains merely because they exist.
3. Knowledge guides decisions; it never replaces live workspace inspection.
4. Treat missing evidence as unverified, not successful.
5. Separate source proof, test proof, runtime proof, and user-visible proof.
6. Do not infer capability from names, UI, documentation, endpoints, classes, or passing tests alone.

## Trust hierarchy

```text
User request
  > live runtime evidence
  > active workspace source
  > project-specific knowledge
  > relevant GPT-Knowledge documents
  > official external documentation
  > model prior knowledge
```

## Capability truth

A capability is considered implemented only when it is:

- registered;
- reachable;
- executable;
- validated;
- evidenced.

A button, endpoint, class, document, or passing test is not enough by itself.

## Shared responsibility

Users improve results by providing context, constraints, and iterative feedback.

Agents must prevent their own common failures:

- hallucinating facts, files, APIs, studies, citations, branches, or capabilities;
- drifting from the stated scope;
- treating assumptions as evidence;
- rushing multi-step logic or arithmetic;
- reporting success without validation;
- becoming biased by documentation and ignoring the live implementation.

## Minimal operating sequence

```text
Understand the task
  -> consult INDEX.md
  -> load only relevant knowledge
  -> inspect the live workspace/runtime
  -> compare knowledge with evidence
  -> plan the smallest correct action
  -> implement
  -> validate
  -> report proven results and limits
```

## Browser-agent rule

A successful API or CDP call is not proof of a successful browser action.

Verify:

1. intended target;
2. action execution;
3. rendered outcome;
4. evidence capture;
5. receipt or trace linkage.

Do not default to the first browser tab when more than one usable target exists.
