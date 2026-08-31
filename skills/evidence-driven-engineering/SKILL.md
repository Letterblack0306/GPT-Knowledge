---
name: evidence-driven-engineering
description: >
  Orchestrate evidence-driven software investigations by reconstructing the connected flow,
  asking one bounded question, selecting the authoritative evidence owner, defining an observable
  and falsifier, classifying the result, patching only the proven owner, and closing with staged
  regression and live acceptance when required. Route current local evidence, Skills discovery,
  and Memory retrieval through the common BirdEye MCP surface while preserving semantic ownership;
  route reusable knowledge to GPT-Knowledge, remote repository truth to GitHub, and bounded local
  execution to LoopTool.
---

# Evidence-Driven Engineering

## Purpose

This is the governing investigation method and evidence router.

It coordinates specialist skills and evidence capabilities. It does not replace project truth, repository truth, runtime truth, governance, Memory, BirdEye, or specialist skill authority.

Use this sequence:

```text
MAP
→ IDENTIFY OWNER
→ ONE QUESTION
→ SELECT EVIDENCE AUTHORITY
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

## Current authority order

For consequential Letterblack engineering work:

```text
user instruction
→ live/runtime evidence
→ active workspace/source evidence
→ authoritative repository/revision evidence
→ BirdEye current root/index/revision evidence
→ project-specific current records
→ GPT-Knowledge curated/project projection
→ Memory historical/session evidence
→ official external documentation
→ model prior knowledge
```

Historical conversation/session evidence is useful context but cannot establish current project truth without revalidation.

## Current local evidence configuration

Use the following ownership/access model:

```text
BirdEye
= shared MCP access surface for workspace, Skills, and Memory capabilities;
  canonical local filesystem identity, indexing, SHA-256, root status, revision/provenance

Memory
= historical ChatGPT/agent sessions/runtime history and derived durable memory

Skills
= curated specialist skill content and workflow guidance

GPT-Knowledge
= reusable engineering knowledge and project/method projection

LoopTool
= bounded local command execution only

GitHub/repository authority
= canonical remote source/commit/PR/patch truth
```

BirdEye can expose a domain without becoming that domain's semantic owner. Do not ask one subsystem to perform another subsystem's semantic role.

The retired direct `skills_hash_status` / `skills_list` / `skills_fetch` route is not the intended agent runtime path. Individual agents should consume Skills through the common BirdEye MCP capability surface rather than construct local skill catalogs or filesystem-first discovery authority.

## BirdEye rules

BirdEye owns current local filesystem identity and index evidence for registered roots and is the common MCP discovery/retrieval surface for workspace, Skills, and Memory capabilities where those capabilities are exposed.

For enabled indexed roots:

```text
new file  → index + SHA-256
unchanged → reuse size + mtime + SHA; no rehash
changed   → re-read + new SHA-256
removed   → reconcile/delete indexed row
```

Use BirdEye for:

- root inventory/status;
- current local file identity;
- indexed search/inspect;
- SHA-256 provenance;
- local Git/revision/dirty-state evidence where supported;
- Skills discovery/retrieval while preserving Skills semantic authority;
- Memory discovery/retrieval while preserving Memory historical authority;
- governed local execution evidence where that BirdEye capability is explicitly used.

A file hash proves exact indexed content identity. It does not determine semantic authority.

### Indexed-content search target

The older reference pattern used SQLite metadata/SHA for candidate lookup and reopened physical files for content search. BirdEye MCP is being extended with cached content, `path_prefix`, `verify_freshness`, targeted refresh, `content_status`, and `version_status` so normal search can use indexed content without rereading every candidate file.

Do not classify that target as fully PROVEN until source, focused tests, migration/backfill behavior, and live MCP use establish it.

## Memory rules

Memory owns historical and derived durable memory.

Historical agent/runtime roots use:

```text
root_class = memory
authority = historical
```

This includes verified sources such as ChatGPT history, Cline sessions, Codex sessions, Claude sessions, Gemini history, Antigravity runtime history, BirdEye execution history, and other verified agent/runtime logs added later.

Historical data may be indexed, SHA-identified, discovered, and returned by BirdEye. It still remains historical.

Use Memory to answer:

- what happened previously;
- what an agent attempted;
- prior output/error/context;
- previous plans/decisions.

Do not use Memory alone to answer what is true in the workspace/runtime now.

## GPT-Knowledge rules

Use GPT-Knowledge to:

- recover project/method projection;
- select reusable engineering methods;
- recover prior classifications and closed gates;
- understand intended architecture;
- synchronize materially changed project state after current evidence is classified.

GPT-Knowledge is not runtime authority and must not override newer source/runtime evidence.

For the local evidence configuration, load:

`ai-agents/local-evidence-memory-skills-and-looptool-routing.md`

when BirdEye, Memory, Skills, LoopTool, historical agent sessions, hashing, common MCP capability routing, or cross-owner evidence routing is in scope.

## Skills rules

Use the smallest relevant skill set.

The intended common route is:

```text
agent needs specialized guidance
→ discover Skills capability through BirdEye MCP
→ use the narrowest relevant BirdEye root/path/search scope
→ select the smallest relevant skill content
→ consume indexed SKILL.md/supporting content + SHA/version metadata
```

Do not load the whole gallery. Do not recreate a local SkillCatalog, direct filesystem scanner, skill SHA cache, or separate skill authority inside a consuming agent.

A skill SHA identifies the exact skill content loaded; it is not project/runtime truth.

## Repository / GitHub rules

Use repository/GitHub evidence to:

- establish canonical remote revision;
- inspect source owners, tests, contracts, plans and diffs;
- create or patch durable source/test/document changes;
- preserve commit SHA and diff as the comparison/debug boundary.

Repository-first rule for durable changes:

```text
prove change required
→ patch/create in authoritative repository main
→ record BASE SHA / HEAD SHA / changed files
→ align local workspace when required
→ validate locally
→ classify
→ preserve durable correction through repository authority
```

Do not treat a durable local-only patch as project truth.

## LoopTool rules

LoopTool is a bounded command executor, not an agent.

Use it only after the reasoning agent already knows:

- exact workspace/path;
- exact bounded command;
- why execution is required;
- what result would count as evidence.

Preferred flow:

```text
task
→ retrieve/verify with appropriate evidence owner/common capability surface
→ choose exact target
→ formulate bounded command
→ execute through LoopTool
→ inspect AGENT RESULT
→ validate semantic outcome
```

Do not use LoopTool for:

- finding/searching files → BirdEye;
- historical recall → BirdEye/Memory capability;
- skill discovery → BirdEye/Skills capability;
- remote repository truth → GitHub;
- deciding what command should run → reasoning agent.

LoopTool `COMMAND HASH` is execution-request/dedup identity. It is not BirdEye file SHA, Git revision identity, Memory record SHA, or skill-content SHA.

When the browser command bridge is used, emit only the exact executable envelope when local execution is intended:

```text
=== AGENT COMMAND START ===
WORKING DIRECTORY: <ABSOLUTE PROJECT PATH>
COMMAND: <POWERSHELL COMMAND>
=== AGENT COMMAND END ===
```

Wait for and inspect the matching `AGENT RESULT` before making dependent claims/actions.

## Evidence-owner routing table

```text
current local file/path/content?        → BirdEye workspace capability
current local Git/revision state?       → BirdEye + repository evidence
remote repo/commit/PR truth?            → GitHub/repository authority
past conversation/agent activity?       → BirdEye Memory capability; authority remains Memory/historical
reusable engineering guidance?          → GPT-Knowledge
specialized procedure/skill?            → BirdEye Skills capability; authority remains Skills
local command execution?                → LoopTool
live user-visible behavior?             → runtime-specific acceptance path
```

## Investigation protocol

### 1. MAP

Reconstruct the connected control/data/state flow that can produce the observed behavior.

### 2. IDENTIFY OWNER

Identify the component that owns the disputed behavior or state transition.

Do not infer ownership from repository location, import location, test location, active workspace, adapter seam, or consumer path alone.

Classify candidate capability state as:

```text
EXISTING + PROVEN
EXISTING BUT NOT YET VERIFIED LIVE
MISSING — IMPLEMENTATION REQUIRED
```

Only a proven defective or missing owner authorizes implementation.

### 3. ONE QUESTION

State one exact question that the next evidence step can answer.

### 4. SELECT EVIDENCE AUTHORITY

Choose the subsystem that can actually prove the answer. Do not select a convenient but semantically weaker source.

### 5. AUTHORITATIVE OBSERVABLE

Define concrete proof, for example:

- exact Git SHA/status;
- BirdEye root/file SHA/status;
- durable receipt/event ID;
- UI state on the actual runtime path;
- process lifecycle state;
- bounded command hash + result;
- historical source record when the question is explicitly historical.

### 6. FALSIFIER

Define what would disprove the current hypothesis or prove that the test cannot answer it.

### 7. BOUNDED TEST

Use the smallest existing authoritative test/inspection first.

### 8. CLASSIFY

Classify evidence before deciding whether to patch.

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

### 9. PATCH PROVEN OWNER

Patch only the proven defective/missing owner.

Do not patch product behavior to satisfy stale fixtures, invalid preconditions, contaminated acceptance targets, harness failures, or unresolved authority ambiguity.

### 10. FOCUSED REGRESSION

Validate the changed owner with the smallest regression that proves it.

### 11. WIDER REGRESSION

Run broader regression only when collateral behavior may be affected.

### 12. LIVE ACCEPTANCE

Require real acceptance for runtime/UI/browser/provider/restart/recovery/external-integration claims.

Do not relabel source/static regression as live proof.

### 13. CURRENT POSITION

After classification:

1. reconcile result against active project plan;
2. update canonical status if materially changed;
3. preserve current source/revision and validation evidence;
4. preserve limitations/open questions;
5. only then advance.

## Hash-type discipline

Always identify which hash is being discussed.

```text
file_sha256               = indexed file content
root_snapshot_sha256      = deterministic root snapshot identity
config_sha256             = index/root policy identity
git_head_sha              = committed repository revision
diff_state_sha256         = working-tree/diff identity
command_hash              = normalized execution request
execution_evidence_sha256 = governed execution receipt
memory_record_sha256      = durable Memory record identity
skill SHA-256             = exact loaded skill content
```

Do not compare unlike hashes as if they proved the same state.

## Repository comparison bookkeeping

For durable implementation changes preserve:

```text
BASE SHA:
HEAD SHA:
COMMITS AHEAD:
FILES CHANGED:
```

For local validation also preserve when available:

```text
LOCAL HEAD:
LOCAL STATUS:
TEST / COMMAND HASH:
RESULT CLASSIFICATION:
```

## Behavioral failure conditions

This skill is being used incorrectly if it:

- patches directly from symptoms;
- invents a missing capability without proving absence;
- infers ownership from code location or active workspace alone;
- invokes every specialist/tool by default;
- treats Memory/GPT-K state as stronger than current live/source evidence;
- recreates Skills discovery inside a consuming agent instead of using the common BirdEye capability surface;
- uses LoopTool as a search/planning system;
- treats a content hash as authority classification;
- treats command exit code 0 as semantic completion;
- claims live proof from static/source tests;
- creates durable local-only patches outside repository authority;
- finishes consequential work with stale project status.

## Compact result envelope

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

This is an evidence/decision summary, not private chain-of-thought.
