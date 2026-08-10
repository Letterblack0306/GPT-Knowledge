# Start Here

This repository is a selective decision aid, not a monolithic prompt.

## Global workspace guidance

This guidance applies across every workspace. It is informative operating guidance, not an automatic blocker or hard gate.

1. Before any major architectural decision, agent design decision, CLI design decision, implementation direction, replacement, or substantial workflow change, consult GPT-Knowledge first for the relevant established knowledge and prior patterns.
2. Verify the active repository and current remote implementation through GitHub before making claims about code, branches, pull requests, patches, required checks, or implementation status.
3. Use `Letterblack_BirdEye` to inspect local workspace state and local diff when local-vs-remote evidence is required. BirdEye is an evidence/visibility source for the local workspace; it is not the default debugging or patch-authoring destination.
4. Use GitHub as the normal home for implementation patches and pull requests so reviewed changes can be pulled into the local workspace. Do not treat BirdEye as a substitute for repository-backed patch flow.
5. Do not immediately invent a generic solution, abstraction, agent pattern, CLI architecture, or replacement mechanism. First determine what existing GPT-Knowledge sources, active project evidence, and comparable live workflow implementations already establish.
6. If that evidence changes the intended architecture, contract, ownership model, or roadmap, update the architecture/roadmap documentation first. Begin a code PR only after the changed design is documented clearly enough to define the implementation boundary.
7. GitHub required checks are a useful live reference pattern when applicable: requirements are configured independently, producers report structured statuses/conclusions, and a final gate evaluates whether the required checks passed. Treat this as a reusable architectural pattern, not a requirement that every project copy GitHub's implementation.
8. Keep evidence roles distinct: GPT-Knowledge supplies reusable knowledge and prior reasoning; GitHub supplies live repository/PR/check/patch truth; BirdEye supplies local workspace/diff visibility; runtime validation supplies execution truth.

## Mandatory boot rules

1. Load only the minimum knowledge required for the current task.
2. Use `knowledge-index.json` as the deterministic routing manifest; use `INDEX.md` as its human-readable companion.
3. For any project or feature implementation, extension, replacement, integration, migration, planning, or learning task, load `project-engineering/project-feature-implementation-plan.md` before domain-specific knowledge.
4. Learn the active project/feature from live source and runtime evidence before accepting a planned implementation boundary.
5. Do not load unrelated domains merely because they exist.
6. Knowledge guides decisions; it never replaces live workspace inspection.
7. Treat missing evidence as unverified, not successful.
8. Separate source proof, test proof, runtime proof, and user-visible proof.
9. Do not infer capability from names, UI, documentation, endpoints, classes, or passing tests alone.

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
  -> consult GPT-Knowledge first for major/agent/CLI decisions
  -> consult knowledge-index.json
  -> if project/feature work: load project-feature-implementation-plan.md first
  -> verify the active repository and remote implementation through GitHub
  -> inspect BirdEye when local diff/workspace evidence is required
  -> learn the active project/feature from live source/runtime
  -> load only relevant domain knowledge
  -> discover relevant ecosystem capabilities and comparable live workflows
  -> compare knowledge with evidence
  -> if design changes: update architecture/roadmap documentation first
  -> define requirement + acceptance contract
  -> plan the smallest architecture-consistent action
  -> implement through repository-backed patch/PR flow
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
