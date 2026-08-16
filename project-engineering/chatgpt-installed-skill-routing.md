# ChatGPT Installed Skill Routing

## Purpose

This document routes engineering and project work from GPT-Knowledge into the installed ChatGPT Skills that are best suited to the task.

It is a routing aid, not a replacement for the Skills themselves. The installed Skill remains authoritative for its own detailed workflow. GPT-Knowledge should select only the smallest relevant skill set and should not duplicate every skill's policy into project knowledge.

## Central rule

For engineering investigation work, use **`evidence driven engineering`** as the central investigation router when available.

It owns the shared bounded workflow:

```text
MAP the connected flow
  -> identify the active owner/boundary
  -> state one exact question
  -> identify source of truth
  -> define authoritative observable
  -> define falsifier
  -> run one bounded test
  -> classify the result
  -> patch only a proven defective owner
  -> focused regression
  -> wider regression
  -> live acceptance when required
  -> update current position
```

Specialist skills contribute domain-specific evidence, constraints, or proof rules inside that workflow. They should not each start a competing full investigation process.

## Installed skill map

### `evidence driven engineering`

**Role:** central investigation router and workflow owner.

Use for:

- engineering investigations;
- runtime and integration debugging;
- feature-behavior investigation;
- state/restart/recovery analysis;
- bounded audit/debug cycles;
- coordinating specialist skills without broad-loading them.

Do not use it to replace specialist project-truth, runtime-proof, governance, UI, or framework knowledge.

### `Project Truth Review`

**Question:** Are we still building the intended product?

Use when:

- product intent or architecture may have drifted;
- a long-running project is entering a consequential phase;
- current implementation may have displaced accepted product truth;
- major architecture, migration, packaging, release, or phase-boundary decisions are being reviewed;
- accepted/rejected decisions must be reconstructed before code work.

Use this before technical debugging when the implementation's product basis is uncertain.

### `Letterblack Project Evidence`

**Question:** What current Letterblack evidence must be established before project-specific guidance?

Use for existing Letterblack software projects such as Brew, Access Browser Agent, BirdEye, LBE, agent runtimes, browser tooling, provider integrations, or cross-project recurring defects.

It should establish and keep distinct:

- GPT-Knowledge method guidance;
- active/local workspace truth;
- GitHub repository/PR truth;
- BirdEye/local evidence when available;
- runtime/user-visible evidence;
- governance/guard evidence when actually implicated.

### `Code Audit & Debug`

**Question:** Where is the actual technical defect or incorrect implementation boundary?

Use when:

- implementation correctness is under investigation;
- code paths, ownership, data/control flow, state transitions, duplicate implementation, or defect localization must be traced;
- a symptom exists but the defective owner is not yet proven;
- a focused code/runtime audit is requested.

Do not use code correctness as a substitute for Project Truth Review when product intent itself is uncertain.

### `Agent Runtime Proof`

**Question:** Has the claimed runtime behavior actually been proven?

Use for:

- live runtime closure claims;
- UI/runtime/provider/tool behavior;
- session, retry, resume, restart, recovery, or duplicate-side-effect behavior;
- proving a fix beyond static/unit evidence;
- baseline-versus-candidate runtime comparisons;
- real end-to-end acceptance.

Do not label lower evidence layers as live runtime proof.

### `Preserve Agent Reasoning`

**Question:** Which responsibility belongs to the reasoning agent, and which belongs to transport/runtime/governance?

Use whenever an agent, LLM, local LLM, browser-side model, coding agent, relay, bridge, provider, orchestration layer, tool-using model, or agent-to-agent transport is materially involved.

Core architecture rule:

> **Agents reason; bridges transport.**

Keep semantic interpretation with reasoning agents. Keep deterministic delivery, identity, security, permissions, integrity, cancellation, recovery, and transport-level duplicate protection with infrastructure.

### `devils governenece rules`

**Role:** execution/governance/authority specialist.

Use only when the task materially involves:

- MCP-connected agent behavior;
- permissions or execution authority;
- destructive or governed side effects;
- policy/guard boundaries;
- approval or denial semantics;
- workspace trust or execution restrictions.

Use the installed name exactly as written: **`devils governenece rules`**.

Do not invoke governance merely because debugging exists; first prove that authority or governed execution is part of the failing boundary.

### `devils audit masterbulletpoints`

**Role:** exhaustive audit-expansion specialist.

Use when the user explicitly requests a broad, exhaustive, whole-system audit or asks what major areas may have been missed.

Do not invoke it automatically during a bounded investigation. Broad audit expansion must not destroy the one-question/falsifier discipline of `evidence driven engineering`.

### `brew ui designer`

**Role:** Brew-specific UI/product design specialist.

Use only when the task materially concerns Brew's user interface, interaction design, product-grade visual hierarchy, runtime truth presentation, or related Brew UI behavior.

It is a domain specialist, not an evidence authority for repository or runtime correctness.

### `tailwind`

**Role:** Tailwind CSS implementation specialist.

Use only when Tailwind CSS implementation, configuration, migration, component styling, or framework-specific guidance is actually in scope.

It is a framework specialist, not a project-truth or debugging authority.

## Routing table

| Task condition | Skill route |
|---|---|
| General engineering investigation | `evidence driven engineering` |
| Product intent / architecture drift / phase review | `Project Truth Review` |
| Existing Letterblack project guidance | `Letterblack Project Evidence` |
| Technical defect localization / code correctness | `Code Audit & Debug` |
| Live behavior / runtime fix / acceptance claim | `Agent Runtime Proof` |
| Agent/LLM/relay/bridge reasoning boundary | `Preserve Agent Reasoning` |
| Execution authority / policy / MCP / destructive side effects | `devils governenece rules` |
| Explicit exhaustive whole-system audit | `devils audit masterbulletpoints` |
| Brew-specific UI/product design | `brew ui designer` |
| Tailwind-specific implementation | `tailwind` |

## Composition rules

### Prefer the smallest relevant set

Do not activate all ten skills because they are installed.

Typical focused runtime bug:

```text
evidence driven engineering
  + Letterblack Project Evidence      when it is a Letterblack project
  + Code Audit & Debug                when implementation ownership is uncertain
  + Agent Runtime Proof               when closure requires live runtime evidence
  + Preserve Agent Reasoning          only if agent/relay responsibility is implicated
  + devils governenece rules          only if authority/governed side effects are implicated
```

### Product truth before implementation correctness

When both product intent and code correctness are uncertain:

```text
Project Truth Review
  -> establish intended product/architecture
  -> evidence driven engineering
  -> Code Audit & Debug
  -> Agent Runtime Proof when live closure is required
```

Do not optimize or repair an implementation whose product basis is still unproven.

### Evidence before recommendation

For Letterblack project-specific work:

```text
Letterblack Project Evidence
  -> verify GPT-Knowledge route
  -> verify active/local evidence when required
  -> verify GitHub repository truth
  -> classify the failure/requirement boundary
  -> then let the central router select the next specialist
```

### Agent boundary only when materially relevant

`Preserve Agent Reasoning` should activate for agent/LLM/relay architecture or behavior, not for unrelated deterministic application code.

### Governance only when authority is implicated

Do not turn governance into a universal debugging layer. Invoke `devils governenece rules` only when permissions, policy, MCP authority, execution boundaries, workspace trust, or destructive side effects materially affect the question.

### Exhaustive audit is opt-in

`devils audit masterbulletpoints` is for broad coverage, not normal bounded diagnosis. If a focused investigation is in progress, preserve the bounded question unless the user explicitly expands scope.

### Domain skills do not establish proof

`brew ui designer` and `tailwind` may guide design or implementation in their domains. Runtime, repository, product-truth, and acceptance claims still require the appropriate evidence/proof skills.

## Shared result vocabulary

When skills participate in an engineering investigation, preserve the shared classification vocabulary where applicable:

```text
PROVEN
DISPROVEN
INCONCLUSIVE
BLOCKED_CONFIGURATION
STALE_TEST_OR_FIXTURE
TEST_HARNESS_FAILURE
RECOVERY_REQUIRED
```

Do not allow one specialist skill to reinterpret another skill's evidence class merely to continue implementation.

## Long-project anti-drift rule

After a consequential investigation or accepted architecture decision, preserve:

```text
CURRENT HEAD / REVISION
ACTIVE RUNTIME OWNER
PROVEN INVARIANTS
DISPROVEN ASSUMPTIONS
OPEN QUESTIONS
DEFERRED DESIGN DEBT
KNOWN HARNESS LIMITATIONS
NEXT SINGLE QUESTION
```

Skill routing is method selection, not project truth. Always revalidate current project/repository/runtime identity before consequential work.

## Installed-skill availability

This document records the expected installed skill names as of the current skill suite. If a named skill is unavailable in the active ChatGPT environment, do not pretend it was applied. Continue using the relevant GPT-Knowledge method and report the unavailable skill route when material.

When installed skill names change, update this routing document rather than creating aliases silently.