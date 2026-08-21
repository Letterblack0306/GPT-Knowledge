---
name: evidence-driven-engineering
description: >
  Orchestrate evidence-driven software investigations by reconstructing the connected flow,
  asking one bounded question, defining an authoritative observable and falsifier,
  classifying the result, patching only the proven owner, and closing with staged regression,
  live acceptance when required, and current-position synchronization. Use for audits,
  diagnosis, patches, recovery, verification, and long-running Letterblack engineering work.
  Route specialist questions to the smallest relevant installed skill set instead of
  duplicating their contracts or invoking all of them.
---

# Evidence-Driven Engineering

## Purpose

This is the governing investigation method and central audit/debug router.

It coordinates specialist skills and available evidence capabilities. It does not replace project truth, repository truth, runtime truth, governance, or specialist skill authority.

Use this sequence:

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

Never jump directly from symptom to patch.

## Authority order

For consequential Letterblack engineering work, prefer the strongest current evidence:

```text
user instruction
→ live/runtime evidence
→ active workspace evidence
→ authoritative repository state
→ project-specific knowledge
→ GPT-Knowledge method/project projection
→ official external documentation
→ model prior
```

GPT-Knowledge is durable project/method projection. It is not runtime authority.

## Core routing rule

Use the minimum specialist capability required by the current bounded question.

Do not activate every installed skill or every tool because they exist.

Use the installed specialist routing map when available:

`project-engineering/chatgpt-installed-skill-routing.md`

Typical specialist roles include:

- project truth / architecture drift;
- Letterblack project evidence;
- code audit and defect localization;
- runtime proof and live acceptance;
- agent reasoning / transport boundary;
- governance and execution authority;
- exhaustive audit only when explicitly requested;
- domain-specific UI/framework skills only when materially relevant.

## Capability model

The Skill must work even when the future Letterblack Engineering App/MCP package is unavailable.

### GPT-Knowledge

Use to:

- recover current project position;
- read active plan/status/current-position documents;
- recover closed gates and prior classifications;
- select reusable methods;
- synchronize materially changed project state after evidence is classified.

Do not treat GPT-Knowledge as proof of current runtime behavior.

### Repository / GitHub

Use to:

- establish canonical source revision;
- inspect source owners, tests, contracts, plans and diffs;
- create or patch every durable source/test/document change;
- preserve commit SHA and diff as the comparison/debug boundary.

Repository-first rule for durable changes:

```text
prove change required
→ patch/create in authoritative repository main
→ record BASE SHA / HEAD SHA / changed files
→ fast-forward local workspace to exact HEAD
→ validate locally
→ classify
→ return any durable correction through repository main
```

Do not create a durable local-only patch and later treat it as project truth.

Temporary build artifacts, caches, generated outputs and disposable diagnostics may remain local. If a diagnostic becomes a reusable test/source/document, add it through the repository first.

### BirdEye / local workspace evidence

When available, use for:

- workspace identity;
- local revision/status;
- indexed source search/inspection;
- local-vs-remote drift;
- governed local command evidence.

Do not pretend BirdEye was used when it is unavailable.

### LoopTool / local execution

Use only when deterministic local execution evidence is required:

- focused tests;
- bounded diagnostics;
- runtime inspection;
- acceptance;
- recovery-state inspection/reconciliation;
- command hashes and exact execution receipts.

If direct execution is unavailable in the current chat, emit one bounded command envelope and classify only the returned result.

Do not use local execution for theoretical or documentation-only questions where it adds no authority.

### Future App/MCP architecture

The planned Letterblack Engineering App/MCP architecture remains valid but is deferred infrastructure.

Do not block current Skill usage on App installation.

Future shape:

```text
Letterblack Engineering
├── evidence-driven-engineering   # governing Skill
├── specialist Skills             # narrow contracts
├── GPT-Knowledge App             # durable project/method data
├── Repository/BirdEye App        # workspace/source evidence
└── LoopTool/Access App           # bounded local/runtime evidence
```

The App layer must remain an adapter over existing owners, not a new source of truth.

## Investigation protocol

### 1. MAP

Reconstruct the connected control/data/state flow that can produce the observed behavior.

Do not begin with a guessed file or guessed fix.

### 2. IDENTIFY OWNER

Identify the component that owns the disputed behavior or state transition.

Classify candidate capability state as one of:

- `EXISTING + PROVEN`
- `EXISTING BUT NOT YET VERIFIED LIVE`
- `MISSING — IMPLEMENTATION REQUIRED`

Only a proven defective or missing owner authorizes implementation.

### 3. ONE QUESTION

State one exact question that the next evidence step can answer.

Avoid broad sweeps when one bounded test separates the competing explanations.

### 4. SOURCE OF TRUTH

Name the authority that can answer the question, such as:

- repository source;
- durable journal/store;
- process state;
- rendered UI state;
- external API;
- deployment revision;
- exact test/acceptance harness.

### 5. AUTHORITATIVE OBSERVABLE

Define the concrete evidence that counts as proof.

Examples:

- exact Git SHA/status;
- durable receipt/event ID;
- journal state;
- UI value on actual application path;
- process lifecycle state;
- exact deployment revision;
- bounded command hash + result.

### 6. FALSIFIER

Define what would disprove the current hypothesis or prove that the test cannot answer it.

### 7. BOUNDED TEST

Use the smallest existing authoritative test/inspection first.

Prefer an existing regression or acceptance path over inventing a duplicate harness.

### 8. CLASSIFY

Classify the evidence before deciding whether to patch.

Common classes:

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
PROJECTION_STALE
BROAD_PATCH_NOT_ACCEPTABLE
```

Use more precise project-specific classes where available.

### 9. PATCH PROVEN OWNER

Patch only the proven defective/missing owner.

Every durable patch or new file must go through the authoritative repository first.

Do not patch product behavior to satisfy:

- a stale fixture;
- a contaminated acceptance target;
- an invalid precondition;
- a test-harness failure;
- unresolved authority ambiguity.

### 10. FOCUSED REGRESSION

Validate the changed owner with the smallest regression that proves it.

### 11. WIDER REGRESSION

Only then run broader regression if collateral behavior may be affected.

### 12. LIVE ACCEPTANCE

Require real acceptance for claims involving:

- runtime behavior;
- rendered UI;
- browser/provider behavior;
- restart/recovery;
- process death;
- durable continuation;
- external integration.

Do not relabel source/static regression as live proof.

### 13. CURRENT POSITION

A material investigation does not end at PASS/FAIL.

After classification:

1. reconcile result against active project plan;
2. update canonical status if materially changed;
3. update plan/map when active gate, closed gate or next observable changes;
4. verify user-facing/deployed projection when freshness is part of the project contract;
5. preserve harness limitations, recovery state and next single question;
6. only then advance.

## Repository comparison bookkeeping

For every durable implementation change, preserve:

```text
BASE SHA:
HEAD SHA:
COMMITS AHEAD:
FILES CHANGED:
```

For local validation also preserve:

```text
LOCAL HEAD:
LOCAL STATUS:
TEST / COMMAND HASH:
RESULT CLASSIFICATION:
```

This comparison boundary is mandatory because it supports debugging, attribution, rollback and regression analysis.

## Recovery discipline

Ambiguous durable work must not be blindly replayed.

Use the existing recovery/reconciliation owner when one exists.

A recovery classification may be:

```text
RECOVERY_REQUIRED
QUARANTINED_AND_RECONCILED
PROVEN_COMPLETE
INCONCLUSIVE
```

Never infer successful completion merely because an execution started.

## Long-project anti-drift checkpoint

After consequential work preserve:

```text
CURRENT HEAD / REVISION
ACTIVE OWNER
ACTIVE GATE
PROVEN INVARIANTS
DISPROVEN ASSUMPTIONS
OPEN QUESTIONS
DEFERRED DESIGN DEBT
KNOWN HARNESS LIMITATIONS
RECOVERY STATE
NEXT SINGLE QUESTION
```

Do not reopen a closed gate without new authoritative contradictory evidence.

## Behavioral failure conditions

This Skill is being used incorrectly if it:

- patches directly from symptoms;
- invents a missing capability without proving absence;
- invokes all specialists by default;
- treats remembered/GPT-K state as stronger than live/repository evidence;
- treats timeout as product failure without classifying the timeout boundary;
- patches product code to satisfy a stale or contaminated harness;
- creates a duplicate test before reusing a suitable existing one;
- claims live proof from source/static tests;
- replays ambiguous work instead of reconciling it;
- creates durable local-only patches outside the repository-first rule;
- finishes consequential work with stale project status/plan;
- assumes browser/deployment projection is current without verification when verification is required.

## Compact result envelope

Use this evidence summary when closing a bounded investigation:

```text
QUESTION:
OWNER:
SOURCE OF TRUTH:
OBSERVABLE:
FALSIFIER:
TEST / EVIDENCE:
CLASSIFICATION:
PATCH AUTHORIZED: yes|no
BASE SHA:
HEAD SHA:
FILES CHANGED:
REGRESSION STATE:
LIVE ACCEPTANCE STATE:
CURRENT POSITION:
NEXT SINGLE QUESTION:
```

This is an evidence/decision summary. Do not expose private chain-of-thought.

## Current packaging policy

Use the Skill-first architecture now.

```text
ACTIVE DELIVERY
= SKILL-FIRST

GOVERNING SKILL
= evidence-driven-engineering

DURABLE CHANGE AUTHORITY
= repository main first

GPT-KNOWLEDGE
= durable method/project projection

LOCAL EXECUTION
= bounded evidence only

LETTERBLACK ENGINEERING APP/MCP
= future integration plan; preserve architecture, do not block current usage
```
