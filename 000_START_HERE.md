# Start Here

This repository is a selective decision aid, not a monolithic prompt.

## Mandatory boot rules

1. Load only the minimum knowledge required for the current task.
2. Use `knowledge-index.json` as the deterministic routing manifest; use `INDEX.md` as its human-readable companion.
3. Do not load unrelated domains merely because they exist.
4. Knowledge guides decisions; it never replaces live workspace inspection.
5. Treat missing evidence as unverified, not successful.
6. Separate source proof, test proof, runtime proof, and user-visible proof.
7. Do not infer capability from names, UI, documentation, endpoints, classes, or passing tests alone.

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

## Agent reality

Treat the agent as an ecosystem, not as a single machine, executable, process, application, or computer.

An agent may be composed of independent cooperating parts, including a human operator, planners or reasoners, model providers, local and remote runtimes, tools, browser automation, MCP servers, workspace services, Git repositories, knowledge stores, memory systems, evidence services, and external APIs.

Reason about capabilities, ownership, communication, state, permissions, and evidence across the connected ecosystem. Process or machine boundaries do not define the agent's actual capability boundary.

Before concluding that a capability is unavailable, perform bounded discovery across the task-relevant parts of the ecosystem:

1. active workspace and live runtime;
2. registered tools and capability registries;
3. connected MCP servers and local services;
4. BirdEye or other evidence sources;
5. configured Git repositories;
6. model providers and inference runtimes;
7. applicable external services.

Do not duplicate or redesign a capability until this discovery is complete. Discovery does not authorize unrelated actions or scope expansion.

## Shared responsibility

Users improve results by providing context, constraints, and iterative feedback.

Agents must prevent their own common failures:

- hallucinating facts, files, APIs, studies, citations, branches, or capabilities;
- drifting from the stated scope;
- treating assumptions as evidence;
- rushing multi-step logic or arithmetic;
- reporting success without validation;
- becoming biased by documentation and ignoring the live implementation;
- treating a distributed agent ecosystem as an isolated machine or executable.

## Minimal operating sequence

```text
Understand the task
  -> consult knowledge-index.json
  -> load only relevant knowledge
  -> discover relevant ecosystem capabilities
  -> inspect the live workspace/runtime
  -> compare knowledge with evidence
  -> plan the smallest correct action
  -> implement
  -> validate
  -> report proven results and limits
```

Use `INDEX.md` only when a human-readable route explanation is useful; do not load it automatically when `knowledge-index.json` already resolves the task.

## Browser-agent rule

A successful API or CDP call is not proof of a successful browser action.

Verify:

1. intended target;
2. action execution;
3. rendered outcome;
4. evidence capture;
5. receipt or trace linkage.

Do not default to the first browser tab when more than one usable target exists.
