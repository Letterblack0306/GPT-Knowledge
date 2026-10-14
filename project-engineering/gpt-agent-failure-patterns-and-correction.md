# GPT / Agent Failure Patterns — Evidence and Correction

**Scope:** Cross-project guidance, not a current-runtime status report.  
**Updated:** 2026-10-14  
**Owners:** [Start Here](../../000_START_HERE.md) · [Process Recall](../../002_PROCESS_RECALL.md) · [Unified Agent Engineering](../../ai-agents/unified-agent-engineering-methods.md) · [Project/Feature Plan](../project-feature-implementation-plan.md)

## Use this reference

Route here when an agent makes an unsupported claim, repeats ineffective work, misses a capability, confuses repository state, reports false completion, changes the wrong owner, or cannot prove the user-visible effect.

**One adaptive loop:** user objective → discover current workspace and authority → inspect smallest relevant evidence → identify causal owner and falsifier → execute an authorized bounded correction → observe real effect → compare with acceptance condition → preserve receipt / reclassify uncertainty.

Use the relevant pattern below; **do not run all checks for every request**, convert this list into forty independent policy gates, or let transport infrastructure perform model reasoning. The model investigates and adapts; governed infrastructure controls identity, authorization, execution, state integrity and receipts.

## Evidence labels

Use [Process Recall](../../002_PROCESS_RECALL.md) for project-state classification: `PROVEN`, `IMPLEMENTED`, `DOCUMENTED`, `INFERRED`, `UNVERIFIED`, `STALE`, `BLOCKED`, `FAIL`, `DISPROVEN`. A narrower investigation may use `SUPPORTED`, `HYPOTHESIS`, and `UNKNOWN` as defined in [Unified Agent Engineering](../../ai-agents/unified-agent-engineering-methods.md). Never silently interchange their meanings.

**Critical distinction:** source exists ≠ loaded ≠ reachable ≠ authorized ≠ executed ≠ validated ≠ user-visible effect. A failure to invoke a tool proves the invocation failed, not the hypothetical tool result.

## Pattern catalogue

These are **failure modes to watch for, not 40 independently verified GPT incidents**. Previous conversational examples need their own trace/provenance before being labeled confirmed.

| ID | Failure pattern | Discriminating evidence / corrective behavior |
|---|---|---|
| F01 | Claiming work completed without execution | Tool operation ID and target effect, not agent narrative |
| F02 | Treating test pass as product success | Installed runtime and actual user flow |
| F03 | Assuming active workspace | Resolve root, process owner, revision, active worktree |
| F04 | Historical material outranking runtime | Compare dated provenance with current observation |
| F05 | Inventing paths, functions or APIs | Open actual source and resolve symbol |
| F06 | Repeating an ineffective approach | State changed hypothesis and falsifier before retry |
| F07 | Handing the user commands instead of using available authorized tools | Discover and invoke valid capability when accessible |
| F08 | Confusing MCP installed, exposed and usable | Prove registration, reachability, authority, execution and receipt |
| F09 | Treating partial search as complete | Report scope, coverage, truncation and alternative paths |
| F10 | Unverified GitHub commit / push / PR claims | Compare exact remote SHA, branch and PR state |
| F11 | Mistaking edited source for live deployment | Observe deployed revision and user-visible behavior |
| F12 | Wrong browser profile / session / machine identity | Verify trusted session binding and target before action |
| F13 | Adding unnecessary architecture | Map and reuse existing active owner |
| F14 | Expanding scope or permissions implicitly | Explicit target/scope and authorization decision |
| F15 | Building downstream on an unproven foundation | Prove legitimate baseline end-to-end first |
| F16 | Assuming cached BirdEye evidence is current | Verify index freshness and active source/runtime |
| F17 | Stopping investigation at symptom | Trace earliest wrong state through actual call path |
| F18 | Confusing blocker with optional improvement | Identify specific missing dependency and permitted alternatives |
| F19 | Passing mock/static checks as live acceptance | Claim-level evidence ladder |
| F20 | Losing decisions and correction history | Recover bounded historical context, then validate current state |
| F21 | Copying features merely because documented | Inspect real shipping upstream and target implementations |
| F22 | Treating tool-call failure as target-state fact | Separate transport/error evidence from unobserved effect |
| F23 | Zero search results interpreted as nonexistence | Try bounded alternate terms, known indexes, scope and provenance |
| F24 | Combining branches/worktrees into fictional current state | Reconcile HEAD, tracking, dirty, alternate worktrees, PR ancestry |
| F25 | Open PR treated as merged behavior | Check base/head SHAs and actual integration |
| F26 | Patching incorrect owner or out-of-scope module | Establish causal owner *and* authorized mutation target |
| F27 | Registration assumed sufficient for capability | Check registered → reachable → executable → validated → evidenced |
| F28 | Intent, approval and effect collapsed into one state | Separate proposal, decision, dispatch, result, validation |
| F29 | Agent ecosystem reduced to one process | Discover connected tools, services, channels and authority boundaries |
| F30 | Transport bridge acting as reasoning agent | Bridge owns delivery/session/identity; agent owns interpretation |
| F31 | Planner or subagents mistaken for autonomy | Prove adaptation, honest blocker handling, recovery and completion |
| F32 | Unsafe blind retries / duplicate side effects | Preserve operation identity and idempotency/reconciliation |
| F33 | File presence mistaken for runtime ownership | Trace entry point, registry, consumer and observed effect |
| F34 | Fixing visible symptom instead of earliest cause | Capture before/after state across producer → consumer |
| F35 | Duplicating existing or pending capability | Search active path and relevant branches/PRs first |
| F36 | Single check becomes global PASS | Report each claim and evidence boundary independently |
| F37 | Contradictory records silently merged | Keep both provenance records, classify each, resolve chronology |
| F38 | Architecture planned before requirements / proof | Define objective, owner, constraints and acceptance first |
| F39 | Working DENY used to claim execution works | Demonstrate authorized ALLOW → actual effect → receipt too |
| F40 | Infrastructure reliability confused with agent intelligence | Test transport delivery separately; preserve agent discretion |

## Additional cross-cutting weaknesses

- **Calibration and hallucination:** confident prose can exceed available evidence; cite observations and label inference.
- **Context loss / memory drift:** retrieve only relevant past context and check supersession; memory is not current operational state.
- **Tool-result interpretation:** handle empty responses, tool errors, partial pagination, wrong target, stale caches, and absent receipts distinctly.
- **Security and identity:** tool possession is not permission; derive machine identity from trusted system evidence. On Windows use the OS-backed SID as the durable identity primitive when appropriate; display names are metadata. Keep authentication separate from policy authorization.
- **Session and transport integrity:** server-owned session/connection state; detect dropped requests, duplicate deliveries, cancellation and mismatched acknowledgements without inferring user intent.
- **Model / provider readiness:** configured provider, supported model capability, healthy endpoint and successful inference are different claims.
- **Visual / photogrammetry accuracy:** generated imagery is not geometry truth; compare deliverables against supplied real photographs and acceptance constraints before completion.
- **Over-prescription:** a giant checklist, invented blocker, or extra governance file can itself be a failure. Apply only the evidence needed for this task.

## Correction acceptance

1. **Locate:** show actual target, workspace, revision, runtime and authority boundary (or mark unavailable).
2. **Explain:** state observed failure, causal owner, falsifier and smallest justified edit; do not guess missing output.
3. **Act:** preserve existing work; use already authorized route; no speculative pull, rebase, cleanup, publication or unrelated modifications.
4. **Prove:** exercise real request → authority → execution → effect → receipt including a legitimate ALLOW path; include relevant recovery/negative-path evidence only if required.
5. **Report:** classify each claim; attach exact source/revision/operation/observation references; disclose unresolved contradictions and blocked edges.

**Never call a documentation update a runtime fix.** This page is a compact routing reference; the linked canonical methods remain the sources for detailed procedures.
