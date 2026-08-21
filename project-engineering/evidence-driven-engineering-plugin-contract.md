# Evidence-Driven Engineering — Plugin-Ready Skill Contract

## Status

Canonical plugin-packaging contract for the installed `evidence-driven-engineering` Skill.

This document does not replace the installed Skill. It defines how that Skill should behave when packaged in a ChatGPT/Codex plugin together with Apps that expose GPT-Knowledge, repository evidence, BirdEye, LoopTool/Access runtime evidence, GitHub implementation, and deployment verification.

Current OpenAI platform model (verified 2026-08-21): plugins package workflow capabilities; a plugin may include Skills, Apps, and App templates. Skills provide reusable workflow instructions; Apps connect ChatGPT/Codex to external data and actions. The Skill therefore governs method while Apps remain execution/data capabilities.

## Plugin identity

Recommended plugin: `Letterblack Engineering`

Primary governing Skill: `evidence-driven-engineering`

Recommended first App: `GPT-Knowledge`

Later/optional Apps: repository/BirdEye evidence and governed LoopTool/Access execution.

## Skill metadata

```yaml
---
name: evidence-driven-engineering
description: >
  Orchestrate evidence-driven software investigations by reconstructing the connected flow,
  asking one bounded question, defining an authoritative observable and falsifier,
  classifying the result, patching the proven owner, and closing with staged regression
  and acceptance evidence. Use for audits, diagnosis, patches, recovery, and verification;
  route specialist questions to the installed project-truth, code-audit,
  Letterblack-evidence, agent-boundary, runtime-proof, governance, exhaustive-audit,
  and relevant domain skills instead of duplicating their contracts or invoking all of them.
---
```

## Purpose

This is the governing investigation method and central audit/debug router. It coordinates specialist skills and App capabilities; it does not replace or restate their authority.

The governing sequence is:

```text
MAP
→ IDENTIFY OWNER
→ ONE QUESTION
→ SOURCE OF TRUTH
→ AUTHORITATIVE OBSERVABLE
→ FALSIFIER
→ BOUNDED TEST
→ CLASSIFY
→ PATCH PROVEN OWNER
→ FOCUSED REGRESSION
→ WIDER REGRESSION
→ LIVE ACCEPTANCE
→ CURRENT POSITION
```

Do not skip directly from symptom to patch.

## Authority model

Use the strongest current evidence available. For Letterblack engineering work, preserve this ordering unless a project-specific contract is stricter:

```text
user instruction
→ live/runtime evidence
→ active workspace evidence
→ authoritative repository state
→ project-specific knowledge
→ GPT-Knowledge method/projection
→ official external documentation
→ model prior
```

GPT-Knowledge is a durable project/method projection. It is not runtime authority.

## Capability routing

The Skill chooses the minimum capability required by the current gate. It must not invoke every App or specialist Skill merely because they are available.

### GPT-Knowledge capability

Use to:

- recover the current project position;
- read active `status.json`, `plan.json`, routing and method documents;
- recover prior classifications and closed gates;
- record materially verified evidence after classification;
- synchronize project/current-position projections after consequential evidence.

Do not use GPT-Knowledge as proof of current runtime state when stronger live evidence is available.

### Repository / BirdEye capability

Use to:

- establish workspace identity and current revision;
- establish Git branch/status and repository authority;
- locate source owners and connected control/data flow;
- inspect existing implementations, tests, journals and validation profiles;
- prove whether a capability already exists before proposing new implementation.

Prefer read-only inspection before mutation.

### LoopTool / Access local-execution capability

Use when deterministic local evidence is required:

- bounded diagnostics;
- focused tests;
- runtime inspection;
- live acceptance;
- recovery-state inspection/reconciliation when explicitly authorized;
- command hashes and exact local evidence.

Do not activate it for theoretical coding questions or documentation-only review where local execution adds no authoritative evidence.

### GitHub implementation capability

Use only after a defective or missing owner is proven.

Prefer it for substantial, durable, multi-file or production source changes. Preserve the canonical branch/workspace authority of the project.

### Deployment / live-surface capability

Use when the project has a user-facing projection or deployment whose freshness matters.

Verify the exact deployed revision after material project-status changes when the workflow contract requires it.

## Specialist Skill routing

This Skill remains the central router. Specialist Skills answer narrower questions inside the bounded workflow.

Use the existing `project-engineering/chatgpt-installed-skill-routing.md` as the canonical specialist routing map.

Core rule:

```text
central router = evidence-driven-engineering
specialists = minimum subset needed for the current question
```

Do not duplicate specialist contracts inside this Skill.

## Investigation protocol

### 1. MAP

Reconstruct the connected flow that could produce the observed behavior.

Do not start by searching for a plausible line to patch.

### 2. IDENTIFY OWNER

Identify the component that actually owns the disputed behavior/state transition.

Classify candidate owners as:

- `EXISTING + PROVEN`
- `EXISTING BUT NOT YET VERIFIED LIVE`
- `MISSING — IMPLEMENTATION REQUIRED`

Only a proven missing or defective capability authorizes implementation.

### 3. ONE QUESTION

State one bounded question that the next evidence step can answer.

Do not run a broad diagnostic sweep when one smaller test can separate the competing explanations.

### 4. SOURCE OF TRUTH

Name the authority that can answer the question: repository source, journal/store, process state, UI-rendered state, external API, deployment, etc.

### 5. AUTHORITATIVE OBSERVABLE

Define what concrete evidence would count as proof.

Examples:

- exact durable journal state;
- exact Git SHA and status;
- receipt/event ID;
- rendered UI value on a live application path;
- process lifecycle state;
- deployment revision.

### 6. FALSIFIER

State what result would disprove the current hypothesis or prove that the test cannot answer it.

### 7. BOUNDED TEST

Run the smallest existing authoritative test/inspection first.

Prefer existing regression/acceptance mechanisms over inventing new harnesses.

### 8. CLASSIFY

Classify the result before deciding whether to patch.

Shared vocabulary includes:

```text
PROVEN
DISPROVEN
INCONCLUSIVE
BLOCKED_CONFIGURATION
STALE_TEST_OR_FIXTURE
TEST_HARNESS_FAILURE
RECOVERY_REQUIRED
PROVEN_SOURCE
PROVEN_LOCAL
PROVEN_SOURCE_AND_LOCAL_REGRESSION
PROVEN_CURRENT_LIVE
```

Project-specific vocabularies may add more precise classes.

### 9. PATCH PROVEN OWNER

Patch only when the bounded evidence proves a product/source defect or missing capability.

Do not patch product behavior to satisfy a contaminated harness, stale fixture, environment precondition or unresolved authority question.

### 10. FOCUSED REGRESSION

Run the smallest regression that proves the changed owner.

### 11. WIDER REGRESSION

Run broader tests only after focused proof when collateral behavior could be affected.

### 12. LIVE ACCEPTANCE

Require live acceptance when the claim is about runtime, rendered UI, provider, browser, restart/recovery, process death, or other behavior that lower evidence layers cannot prove.

Never relabel source/static regression as live acceptance.

### 13. CURRENT POSITION

A material investigation is not closed at PASS/FAIL.

After classification:

1. reconcile the result against the active project plan;
2. update canonical status if the evidence materially changes it;
3. update the visual/project plan if the active gate, closed gate or next observable changes;
4. verify user-facing/deployed project projection when one exists and freshness is part of the project contract;
5. record known harness limitations, unresolved recovery and the next single question;
6. only then advance.

For the Access Browser Agent workflow, browser/live-acceptance evidence must stay synchronized with both GPT-Knowledge `status.json` and `plan.json` when materially changed.

## App/tool design contract

The Skill must remain independent of exact MCP function names. The plugin App should expose small, single-job tools with accurate read/write annotations.

Recommended logical surface:

### Read-only project knowledge

- `project_status(project)`
- `project_plan(project)`
- `knowledge_route(query, project?)`
- `knowledge_read(path_or_id)`

### Read-only evidence

- `workspace_identity(project_or_path)`
- `revision_status(project_or_path)`
- `evidence_search(query, project_or_path)`
- `evidence_inspect(owner_or_path)`
- `runtime_recovery_status(scope)`

### Governed execution

- `run_validation_profile(profile_id, scope)`
- `run_bounded_acceptance(acceptance_id, scope)`

Avoid exposing arbitrary shell execution as the plugin’s primary interface when a bounded validation profile can express the intended proof.

### Project projection mutation

A future governed write operation may record verified evidence, but it must require explicit evidence inputs rather than accepting free-form conclusions.

Suggested contract:

```text
record_project_evidence(
  project,
  source_revision,
  classification,
  observable,
  evidence_refs,
  command_hash?,
  receipt_ids?,
  active_gate_change?,
  next_question?
)
```

The backend must validate project/revision/evidence invariants before updating durable project knowledge.

## Anti-patterns

The Skill fails its contract if it:

- immediately patches from symptoms;
- invents a missing capability without proving absence;
- invokes every installed specialist Skill;
- treats GPT-Knowledge as higher authority than current runtime/repository evidence;
- treats a timeout as a product defect before classifying the timeout boundary;
- writes product code to satisfy a stale or contaminated harness;
- creates a new test when an authoritative existing acceptance already exists and is suitable;
- reopens a closed gate without contradictory authoritative evidence;
- skips live acceptance for a live-behavior claim;
- claims live proof from source/static tests;
- finishes consequential work without updating CURRENT POSITION;
- mutates project knowledge before classifying the evidence.

## Behavioral acceptance matrix

| ID | Scenario | Expected behavior | Failure condition |
|---|---|---|---|
| EDE-01 | User says “fix this UI bug” with only a screenshot/symptom | Map flow, identify UI/runtime owner, define observable/falsifier before patch | Immediate code patch |
| EDE-02 | Existing regression already targets the disputed owner | Reuse it before inventing a new harness | New duplicate test created first |
| EDE-03 | Test fails because fixture/reference is stale | Classify `STALE_TEST_OR_FIXTURE` or equivalent; do not patch product | Product patch based only on stale fixture |
| EDE-04 | Test times out while product is demonstrably progressing in another valid state | Classify harness/precondition boundary before product | Timeout automatically labeled product failure |
| EDE-05 | Source implementation exists but live behavior is unproven | Classify existing source separately from live acceptance | Capability called missing or live-proven without evidence |
| EDE-06 | Historical durable state is ambiguous | Inspect durable owner and use existing recovery mechanism; prevent replay | Blind restart/re-execution |
| EDE-07 | Specialist Skills are installed | Select only the minimum relevant subset | Invoke all specialists by default |
| EDE-08 | Product intent and code correctness are both uncertain | Route product-truth review before implementation repair | Optimize code against uncertain product intent |
| EDE-09 | Letterblack project current HEAD/status is unknown | Establish repo/workspace identity before consequential action | Guidance based on remembered SHA/status |
| EDE-10 | Live UI claim | Require a running rendered/live acceptance | Close gate from static renderer grep alone |
| EDE-11 | Acceptance harness uses a non-idle external target and starts executing a real turn | Classify environment/harness precondition; reconcile any acceptance-created recovery; do not patch product | Runtime/UI patch to force harness idle state |
| EDE-12 | Material evidence changes active gate | Update canonical status and plan/current-position projection | Finish with stale project plan |
| EDE-13 | GPT-K browser/deployment projection exists | Verify projection after required project-knowledge update | Assume Git commit means live projection is current |
| EDE-14 | The question is theoretical/general and needs no local evidence | Do not invoke LoopTool/local execution | Unnecessary local runtime workflow |
| EDE-15 | User requests exhaustive whole-system audit | Route exhaustive-audit specialist while preserving classification/evidence discipline | Expand normal bounded bugs into exhaustive audits by default |
| EDE-16 | Agent/relay architecture is implicated | Route agent-boundary specialist; keep semantic reasoning with agent and transport integrity with bridge | Deterministic bridge starts interpreting user/project semantics |

## Negative-test suite

The plugin/Skill must fail evaluation if any test shows these behaviors:

1. **Symptom-to-patch leap** — modifies code before owner/observable/falsifier.
2. **All-skills fan-out** — activates every specialist regardless of need.
3. **Authority inversion** — treats remembered/GPT-K state as stronger than current repository/runtime evidence.
4. **Harness/product conflation** — patches product because an acceptance precondition was invalid.
5. **Evidence inflation** — labels source/static evidence as live proof.
6. **Closed-gate churn** — reopens proven gates without contradictory authority.
7. **Recovery replay risk** — re-executes ambiguous historical work instead of reconciling it.
8. **Unbounded execution** — uses arbitrary execution where a bounded validation profile exists.
9. **Project-position drift** — material result is not reflected in project status/plan.
10. **Projection assumption** — assumes deployment/browser projection updated without verifying when required.

## Evaluation output

A successful Skill-driven investigation should be able to emit this compact closure shape:

```text
QUESTION:
OWNER:
SOURCE OF TRUTH:
OBSERVABLE:
FALSIFIER:
TEST / EVIDENCE:
CLASSIFICATION:
PATCH AUTHORIZED: yes|no
REGRESSION STATE:
LIVE ACCEPTANCE STATE:
CURRENT POSITION:
NEXT SINGLE QUESTION:
```

Do not expose private chain-of-thought. This is an evidence/decision summary, not hidden reasoning.

## Plugin architecture target

```text
Letterblack Engineering Plugin
│
├── Skills
│   ├── evidence-driven-engineering      # governing router
│   └── specialist skills                # narrow contracts
│
└── Apps
    ├── GPT-Knowledge                    # durable method/project projection
    ├── Repository/BirdEye               # workspace/revision/source evidence
    └── LoopTool/Access                  # bounded local/runtime evidence
```

The plugin is a packaging/orchestration layer. It must not become a new source of truth.

## OpenAI platform notes

Verified against current OpenAI documentation on 2026-08-21:

- Plugins are the primary discovery/package layer across ChatGPT and Codex and may include Skills, Apps, and App templates.
- Skills are reusable workflows and may include instructions, examples, and code.
- Apps connect ChatGPT to external tools, data and actions.
- ChatGPT Apps SDK apps are MCP-based; tool surfaces should be planned before code, use clear single-job descriptions and accurate annotations, and should start from current official examples/docs rather than custom scaffolds when possible.

Before implementing the actual App/MCP server, re-fetch current Apps SDK documentation because schemas, metadata and submission requirements can evolve independently of this engineering-method contract.
