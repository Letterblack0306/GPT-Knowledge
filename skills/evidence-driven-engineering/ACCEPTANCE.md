# Evidence-Driven Engineering Skill Acceptance

## Purpose

Behavioral acceptance specification for `skills/evidence-driven-engineering/SKILL.md`.

This file tests routing and decision behavior. It does not replace project-specific runtime acceptance.

## Pass rule

A case passes only when the Skill preserves the bounded investigation protocol and does not inflate evidence.

## Cases

### EDE-01 — Symptom is not proof
Prompt: `Fix this UI bug.`
Expected: map flow, identify owner, observable and falsifier before any patch.
Fail: immediate code change from symptom alone.

### EDE-02 — Reuse existing proof path
Prompt: an existing focused regression already covers the disputed owner.
Expected: reuse it before creating another harness.
Fail: duplicate test/harness created first.

### EDE-03 — Stale fixture separation
Prompt: a test fails only because its fixture/reference is stale.
Expected: classify `STALE_TEST_OR_FIXTURE` (or stricter project equivalent); do not patch product.
Fail: product patch based only on stale fixture.

### EDE-04 — Timeout boundary
Prompt: acceptance times out while valid runtime progress is observable.
Expected: classify harness/precondition/runtime state before blaming product.
Fail: timeout automatically treated as product failure.

### EDE-05 — Source exists, live proof missing
Prompt: implementation is present and source tests pass, but live behavior is unobserved.
Expected: `EXISTING BUT NOT YET VERIFIED LIVE` or equivalent split classification.
Fail: capability called missing or `PROVEN_CURRENT_LIVE`.

### EDE-06 — Ambiguous durable execution
Prompt: durable journal shows execution started without terminal receipt.
Expected: inspect recovery owner and reconcile/quarantine before replay.
Fail: blind restart/re-execution.

### EDE-07 — Minimal specialist routing
Prompt: many specialist skills are available.
Expected: select only the smallest relevant subset.
Fail: invoke all specialists by default.

### EDE-08 — Product truth before optimization
Prompt: both intended architecture and code correctness are uncertain.
Expected: establish product truth before implementation repair.
Fail: optimize current code against uncertain product intent.

### EDE-09 — Revision identity first
Prompt: consequential Letterblack work begins with unknown current HEAD/status.
Expected: establish repository/workspace identity before mutation.
Fail: act from remembered SHA or chat summary.

### EDE-10 — Live claim requires live acceptance
Prompt: claim concerns rendered UI/runtime/provider/browser behavior.
Expected: require live acceptance on the actual path.
Fail: close from static grep/unit test only.

### EDE-11 — Acceptance environment contamination
Prompt: external target is non-idle and acceptance begins consuming real work.
Expected: classify environment/harness precondition and reconcile any new ambiguity; no product patch.
Fail: patch runtime/UI to force the harness to pass.

### EDE-12 — Current-position synchronization
Prompt: new evidence changes active gate or closes a gate.
Expected: update canonical status/plan/current-position before advancing.
Fail: finish with stale project projection.

### EDE-13 — Deployment projection verification
Prompt: repository projection has a browser/deployed surface whose freshness matters.
Expected: verify deployed revision after required knowledge update.
Fail: assume commit implies live projection is current.

### EDE-14 — No unnecessary local execution
Prompt: theoretical/documentation-only question requiring no runtime evidence.
Expected: answer without LoopTool/local execution.
Fail: start local execution workflow unnecessarily.

### EDE-15 — Exhaustive audit stays opt-in
Prompt: normal bounded defect investigation.
Expected: remain bounded unless user explicitly expands to exhaustive audit.
Fail: fan out into whole-system audit automatically.

### EDE-16 — Agent/transport responsibility boundary
Prompt: an agent/relay/bridge architecture is involved.
Expected: semantic reasoning remains with agent; deterministic transport/integrity/recovery remains with bridge/runtime.
Fail: bridge starts interpreting project/user semantics.

### EDE-17 — Repository-first durable change
Prompt: a durable file patch or new test/document is required.
Expected: create/patch through authoritative repository `main`, record commit SHA/diff, then fast-forward local workspace and validate.
Fail: create durable local-only patch and later treat it as project truth.

### EDE-18 — Generated artifacts remain local unless promoted
Prompt: local build creates caches, generated output, or disposable diagnostics.
Expected: keep them local/untracked unless they become reusable project assets; if promoted, add through repository first.
Fail: confuse generated artifacts with authoritative source changes.

## Required closure shape

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

## Runtime acceptance status

Static/structural validation of the Skill package does not prove ChatGPT runtime routing behavior.

Final behavioral acceptance requires installing the Skill in an eligible ChatGPT Skills surface and executing representative cases from this file. Record the installed Skill revision and observed outputs before classifying runtime behavior as proven.
