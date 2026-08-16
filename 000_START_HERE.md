# Start Here

This repository is a selective decision aid, not a monolithic prompt.

## Global workspace guidance

This guidance applies across every workspace. It is informative operating guidance, not an automatic blocker or hard gate.

1. Before any major architectural decision, agent design decision, CLI design decision, implementation direction, replacement, or substantial workflow change, consult GPT-Knowledge first for the relevant established knowledge and prior patterns.
2. Verify the active repository and current remote implementation through GitHub before making claims about code, branches, pull requests, patches, required checks, or implementation status.
3. Use `Letterblack_BirdEye` as the preferred local evidence layer when local workspace, revision, diff, indexed-file, or governed command-execution evidence is required. BirdEye exposes workspace identity, revision status, search/inspect/index health, governed `workspace_run` / `workspace_run_sequence`, and command history. Load `project-engineering/letterblack-birdeye-local-evidence-and-governed-execution.md` before relying on or changing BirdEye. BirdEye is not the default patch-authoring destination and does not replace GitHub repository/PR truth.
4. Use GitHub as the normal home for implementation patches and pull requests so reviewed changes can be pulled into the local workspace. Do not treat BirdEye as a substitute for repository-backed patch flow.
5. Do not immediately invent a generic solution, abstraction, agent pattern, CLI architecture, or replacement mechanism. First determine what existing GPT-Knowledge sources, active project evidence, and comparable live workflow implementations already establish.
6. Do not issue a strong factual conclusion, architecture recommendation, implementation plan, or autonomy claim until the relevant evidence has been researched and the claim has been practically proven at the level it requires. Plans are revisable hypotheses, not implementation truth.
7. If required evidence cannot be collected because a tool/runtime/dependency fails, mark the claim `UNKNOWN` or `BLOCKED`; never fill the gap with a plausible guess or with documentation that has not been tied to live behavior.
8. If that evidence changes the intended architecture, contract, ownership model, or roadmap, update the architecture/roadmap documentation first. Begin a code PR only after the changed design is documented clearly enough to define the implementation boundary.
9. GitHub required checks are a useful live reference pattern when applicable: requirements are configured independently, producers report structured statuses/conclusions, and a final gate evaluates whether the required checks passed. Treat this as a reusable architectural pattern, not a requirement that every project copy GitHub's implementation.
10. Keep evidence roles distinct: GPT-Knowledge supplies reusable knowledge and prior reasoning; GitHub supplies live repository/PR/check/patch truth; BirdEye supplies local workspace/revision/index evidence and policy-governed execution; runtime validation supplies behavior and user-visible execution truth.

## Mandatory boot rules

1. Load only the minimum knowledge required for the current task.
2. Use `knowledge-index.json` as the deterministic routing manifest; use `INDEX.md` as its human-readable companion.
3. For any project or feature implementation, extension, replacement, integration, migration, planning, or learning task, load `project-engineering/project-feature-implementation-plan.md` before domain-specific knowledge.
4. For agent/LLM/runtime/autonomy work, load `ai-agents/unified-agent-engineering-methods.md` as the canonical method guide. Its research-before-conclusion, proof-before-plan, evidence classification, adaptive assistant loop, and practical-autonomy requirements are authoritative reusable guidance.
5. For UI building, UI debugging, interactive workflow automation, renderer/runtime integration, or UI acceptance work, load `ui-engineering/state-driven-ui-build-debug-and-acceptance.md` in addition to the smallest relevant UI/domain knowledge. Repetitive manual click-hunting or blind fixed-delay scripts are not the default validation method; advance through interactive steps only when the authoritative state predicate for the previous step is proven.
6. Learn the active project/feature from live source and runtime evidence before accepting a planned implementation boundary.
7. Do not load unrelated domains merely because they exist.
8. Knowledge guides decisions; it never replaces live workspace inspection.
9. Treat missing evidence as unverified, not successful.
10. Separate source proof, test proof, runtime proof, and user-visible proof.
11. Do not infer capability from names, UI, documentation, endpoints, classes, or passing tests alone.
12. Treat a failed tool invocation only as proof that the invocation failed. It does not reveal the result that the unavailable command/action would have produced.
13. Before producing a consequential implementation plan, establish the actual owner, requirement, constraints, and acceptance proof from research and live evidence. Revise the plan when later observations contradict it.

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

## Evidence classes

Use these explicitly when a conclusion could otherwise be overstated:

```text
PROVEN      = directly observed and validated at the level required by the claim
SUPPORTED   = relevant evidence supports the claim but practical proof is incomplete
HYPOTHESIS  = plausible explanation or design candidate awaiting a discriminating check
UNKNOWN     = evidence is insufficient
BLOCKED     = required evidence cannot currently be collected because a real dependency/tool/boundary failed
```

The assistant's narrative does not outrank its tool/runtime receipts. When a runtime trace is available, inspect what tools were actually called and what they actually returned before accepting the agent's final conclusion.

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

An agent may be composed of independent cooperating parts, including a human operator, reasoning models, local and remote runtimes, tools, browser automation, MCP servers, workspace services, Git repositories, knowledge stores, memory systems, evidence services, and external APIs.

Reason about capabilities, ownership, communication, state, permissions, and evidence across the connected ecosystem. Process or machine boundaries do not define the agent's actual capability boundary.

### Always-on reasoning-agent reminder

Whenever a task mentions an **agent**, **LLM**, **local LLM**, **browser-side model**, or other tool-using model, begin from the assumption that it has reasoning ability unless live evidence proves that the component is intentionally non-reasoning.

Do not design around the model as if it were a deterministic command machine that requires exact wording, exact repetition rules, rigid semantic state transitions, or a bridge that thinks on its behalf.

The default architecture rule is:

> **Agents reason; bridges transport.**

A browser-side agent and a local agent may both inspect evidence, plan, adapt, recognize repeated or changed instructions, decide whether a suggested command or approach is useful, and continue from incomplete information. Preserve those responsibilities with the agents.

A bridge should normally own reliable delivery, source/target/session/workspace identity, authentication, security boundaries, target identity, cancellation, acknowledgements, and transport-level duplicate protection. It should not silently become another planner, classifier, semantic deduplicator, completion judge, or state machine when the receiving agent can reason about the message itself.

Formatting changes, repeated wording, expanded instructions, shortened instructions, or incomplete task descriptions are not by themselves reasons to reject or suppress transport. Preserve the message and relevant conversation/session context and let the receiving agent reason about its meaning and next action.

Hard security and integrity boundaries remain external to model discretion. Do not replace security with model reasoning, and do not replace model reasoning with transport logic.

For the canonical rule and architecture test, read `ai-agents/agent-reasoning-transport-boundary.md`.

### Practical autonomy reminder

Do not call an agent autonomous because it has a planner, a state machine, multiple workers, or the ability to execute commands.

Practical autonomy must be demonstrated with runtime evidence that the reasoning agent can preserve the objective, research uncertain facts, choose useful tools, observe real results, distinguish tool failure from task failure, adapt when evidence changes, stay inside hard boundaries, validate consequential outcomes, avoid duplicate side effects on retry, and report a real blocker rather than inventing missing proof.

Lifecycle labels may support telemetry, persistence, cancellation, recovery, and UI truth. They must not become a replacement semantic reasoning authority. The canonical autonomy method is in `ai-agents/unified-agent-engineering-methods.md`.

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
- creating implementation plans before researching the active system;
- turning documentation or model prior into runtime truth;
- reporting success without validation;
- presenting `SUPPORTED`, `HYPOTHESIS`, `UNKNOWN`, or `BLOCKED` claims as `PROVEN`;
- becoming biased by documentation and ignoring the live implementation;
- treating a distributed agent ecosystem as an isolated machine or executable;
- moving reasoning responsibilities into a transport bridge merely because two agents communicate across a runtime boundary.

## Repeated audit-failure correction

For agent/runtime audits, end-to-end claims, cleanup/reset work, destructive repository operations, or reviews where focused tests may be mistaken for live behavior, additionally load `ai-agents/repeated-audit-failures-and-corrective-method.md`.

Mandatory reminders:

- “End-to-end” requires one correlated real user/runtime path; repository inspection alone is static evidence.
- A file, route, test, or tracked document is not active authority without registration, consumers, and matching runtime evidence.
- Audit scope does not authorize mutation unless the user also requests a fix or change.
- A failed dry run, unresolved target identity, or rejected `--force-with-lease` is a stop condition.
- User authorization does not replace semantic target classification, especially for broad commits, force-pushes, or deletion.
- Preserving agent reasoning never removes deterministic transport, execution, policy, workspace, security, validation, or evidence boundaries.

## Minimal operating sequence

```text
Understand the task
  -> consult GPT-Knowledge first for major/agent/CLI decisions
  -> consult knowledge-index.json
  -> if project/feature work: load project-feature-implementation-plan.md first
  -> if agent/autonomy work: load unified-agent-engineering-methods.md
  -> if UI build/debug/acceptance work: load state-driven-ui-build-debug-and-acceptance.md
  -> verify the active repository and remote implementation through GitHub
  -> inspect/use BirdEye when local workspace/revision/index evidence or governed local execution is required
  -> learn the active project/feature from live source/runtime
  -> research only the relevant domain and primary sources
  -> classify observed facts, hypotheses, unknowns, and blockers
  -> discover relevant ecosystem capabilities and comparable live workflows
  -> compare knowledge with evidence
  -> define requirement + acceptance proof
  -> if design changes: update architecture/roadmap documentation first
  -> create a revisable plan from the established evidence
  -> implement through repository-backed patch/PR flow
  -> observe real results and revise as needed
  -> validate at the level required by the claim
  -> report proven results, evidence level, and remaining limits
```

Use `INDEX.md` only when a human-readable route explanation is useful; do not load it automatically when `knowledge-index.json` already resolves the task.

## State-driven UI rule

For UI building, debugging, and interactive workflow testing, do not repeatedly require a human to click through the same sequence when the application exposes observable state.

Prefer:

```text
perform one UI/application action
  -> observe authoritative runtime/application state
  -> verify the declared success predicate
  -> record evidence
  -> only then perform the next action
```

A delay is not a success predicate. Fixed sleeps may be polling intervals, but they must not decide whether a step passed.

Use real UI clicking as a focused wiring test for semantic controls, and keep the primary runtime acceptance tied to the same action/API plus authoritative state consequence. Stop immediately on the first failed gate and preserve the state/evidence needed to diagnose that boundary.

Canonical method: `ui-engineering/state-driven-ui-build-debug-and-acceptance.md`.

## Browser-agent rule

A successful API or CDP call is not proof of a successful browser action.

Verify:

1. intended target;
2. action execution;
3. rendered outcome;
4. evidence capture;
5. receipt or trace linkage.

Do not default to the first browser tab when more than one usable target exists.
