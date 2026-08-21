# Repository Status Checkpointing and Live-Surface Reconciliation

## Knowledge metadata

- Recorded: 2026-08-18
- Expanded: 2026-08-21
- Scope: reusable method for every mapped engineering project involving repository/runtime truth, local/remote drift, regression proof, project-status projections, deployment/live surfaces, and completion claims
- Source: Access Browser Agent reconciliation and validation work generalized into a cross-project workflow
- Status: canonical reusable project-state reconciliation method
- Authority: method guidance only; never substitutes for current repository, local workspace, runtime evidence, deployment state, or project-specific instructions

## Core rule

Before making the next engineering change, reconcile all relevant truth surfaces and make the current state easy to audit.

```text
project source truth
→ local workspace truth
→ baseline → head diff
→ focused validation/runtime evidence
→ GPT-Knowledge project projection
→ live/deployed UI verification when applicable
→ synchronization check
→ only then next change
```

If these surfaces disagree, the next task is **synchronization**, not new implementation.

---

# 1. Trust order

Use the strongest current evidence first:

```text
user instruction
→ fresh live/runtime evidence
→ active local workspace
→ authoritative project repository / target branch
→ project-specific knowledge/status
→ reusable GPT-Knowledge methods
→ official external documentation
→ model prior
```

A status page, dashboard, plan file, prior chat summary, or deployment label must never override contradictory source/runtime evidence.

---

# 2. Establish project identity before work

For every project, record:

```text
project name
repository
workspace root when local execution matters
authoritative branch
remote HEAD
local HEAD if available
runtime/deployment surface
active owner/module for the current gate
```

Do not assume a similarly named folder, branch, worktree, deployment, UI file, or status document is authoritative.

If the project uses a single-branch authority policy, do not create branches/worktrees merely for convenience.

---

# 3. Separate remote truth from local validated truth

Always keep these claims separate:

```text
REMOTE
branch + HEAD + committed files

LOCAL
branch + HEAD + dirty/untracked files + validated behavior
```

A local PASS is not a remote repository PASS until the relevant code is committed/pushed.

Use explicit classifications such as:

```text
SOURCE_IMPLEMENTED / LOCAL_REGRESSION_PENDING
PROVEN_LOCAL_NOT_REMOTE
PROVEN_SOURCE_AND_LOCAL_REGRESSION
PROVEN_CURRENT_LIVE
```

Do not collapse them into generic `done`.

---

# 4. Mandatory SHA + diff checkpoint

Before any meaningful implementation step and after any source commit, record the exact source transition.

Minimum checkpoint:

```text
BASE SHA: <previous proven or failing-regression baseline>
HEAD SHA: <current authoritative head>
COMMITS AHEAD: <n>
FILES CHANGED: <n>
```

Then include a per-file diff summary:

```text
path/to/fileA
+12 -3

path/to/fileB
+40 -8
```

For bounded repairs, also state what did **not** change.

Example:

```text
Changed:
- LiveAgentCore.js

Not changed:
- Browser Relay
- session continuity
- renderer
- provider selection
```

This diff boundary is required because a test can pass while an implementation patch is unexpectedly broad.

If the diff exceeds the intended owner/scope, classify the patch as broad before accepting it, even if tests pass.

---

# 5. Prove the active runtime owner before editing

A matching file is not necessarily the live implementation.

Trace:

```text
entry point
→ router/factory/registry if present
→ state/authority owner
→ execution owner
→ UI/view owner if applicable
→ persistence/config owner if applicable
→ validation/runtime surface
```

For defects, state one bounded question and one falsifier before patching.

Preferred method:

```text
map connecting flow
→ identify source of truth
→ state one question
→ define falsifier
→ run one bounded test
→ classify
→ only then change code
```

Avoid:

```text
test
→ see next failure
→ random patch
→ test again
```

---

# 6. Regression contract before repair when appropriate

When a deterministic defect can be represented by a focused regression:

```text
reproduce current behavior
→ add focused failing regression
→ prove failure is for the expected reason
→ implement smallest repair
→ rerun focused regression
→ rerun neighboring resilience/regression coverage
```

A failing regression proves the contract is absent only when the failure matches the intended falsifier.

A source patch is not `PROVEN_SOURCE_AND_LOCAL_REGRESSION` until matching local validation is returned.

Do not broaden into later P1/P2 items while the active regression gate is still open.

---

# 7. Project projection in GPT-Knowledge

For mapped projects, GPT-Knowledge should project current verified state using project-specific files such as:

```text
plan.json
status.json
current-state.md / plan.md
workspace/projects.json
```

Equivalent project-specific structures are acceptable.

The projection should expose:

- authoritative source repository/branch;
- source HEAD;
- current classification;
- proven/closed findings;
- historical findings clearly marked historical;
- active gate;
- pending gates by priority;
- next acceptance question;
- observable;
- falsifier;
- exact implementation scope when known.

For implementation plans, explicitly separate:

```text
ADD
CHANGE
REMOVE
DO NOT TOUCH
```

This prevents future agents from reinterpreting a bounded repair as permission for a redesign.

---

# 8. Synchronize GPT-Knowledge after source changes

After the project repository changes, check whether GPT-Knowledge still points to the previous source HEAD or classification.

Example drift:

```text
actual project HEAD:
741d208...

GPT-K source_head:
b2b6ff3...
```

Required classification:

```text
PROJECT SOURCE = CURRENT
GPT-K PROJECTION = STALE
```

The next operation is a **projection synchronization update**, not another product change.

A source commit awaiting validation should be represented truthfully:

```text
SOURCE_IMPLEMENTED / LOCAL_REGRESSION_PENDING
```

not:

```text
IMPLEMENTATION_PENDING
```

and not prematurely:

```text
PROVEN_SOURCE_AND_LOCAL_REGRESSION
```

---

# 9. Verify the live/deployed surface

When GPT-Knowledge or another project has a live UI/deployment, repository updates alone are not enough.

Verify:

```text
deployment ID
source commit SHA
target/environment
READY / failed / canceled state
production alias/domain if relevant
```

Then fetch the actual deployed project data or page when possible and verify critical fields directly.

For a mapped GPT-Knowledge project, check at minimum:

```text
workspace active_node
project plan active_node
status source_head
status classification
pending/closed state required by the current gate
```

Do not claim the website is current merely because GitHub auto-deployment started.

A superseded/canceled intermediate deployment is not a failure if a newer deployment from the intended consolidated commit is READY.

---

# 10. Mandatory synchronization matrix

Before the next engineering change, produce a compact matrix like:

| Surface | Expected/current state | Aligned? |
| --- | --- | --- |
| Project remote `main` | `<sha>` | yes/no |
| Local workspace | `<sha>` + dirty/untracked summary | yes/no/unknown |
| Focused regression | PASS/FAIL/not run | yes/no |
| GPT-Knowledge `source_head` | `<sha>` | yes/no |
| GPT-K active gate | `<node>` | yes/no |
| Production deployment | `<deployment id>` from `<sha>` | yes/no |
| Live project data/UI | verified fields | yes/no |

If any required row is `no`, synchronize it before moving forward unless the mismatch is intentionally documented.

---

# 11. One bounded next step

After every evidence result:

1. classify only the gate just tested;
2. update project/GPT-K state if the evidence materially changed truth;
3. provide exactly one bounded next step when operating in a one-step execution workflow.

Do not jump from a failing regression directly into several architectural phases.

Recommended sequence:

```text
failing regression proven
→ smallest source patch
→ local focused + neighboring regression
→ projection sync
→ live/deployment sync if applicable
→ next gate
```

---

# 12. Claim vocabulary

| Claim | Meaning |
| --- | --- |
| PROVEN_REMOTE | committed and present on authoritative target branch |
| SOURCE_IMPLEMENTED_REGRESSION_PENDING | source patch committed but matching local regression proof not yet returned |
| PROVEN_LOCAL | validated in current local workspace |
| PROVEN_SOURCE_AND_LOCAL_REGRESSION | authoritative source plus matching focused/local regression proof |
| PROVEN_CURRENT_LIVE | actual current runtime/user path proves the bounded claim |
| UNVERIFIED | implementation or projection exists but required validation not run |
| DISPROVEN | current evidence contradicts the claim |
| INCONCLUSIVE | evidence did not reach the required observable/falsifier |
| BLOCKED_CONFIGURATION | required environment/configuration unavailable |
| STALE_TEST_OR_FIXTURE | validation target does not match active implementation |
| TEST_HARNESS_FAILURE | harness failed while product claim remains separately evidenced |
| PROJECTION_STALE | GPT-Knowledge/live status surface trails authoritative source/runtime truth |
| BROAD_PATCH_NOT_ACCEPTABLE | diff exceeds bounded repair scope even if tests pass |

Never translate these automatically into generic `PASS`, `FAIL`, or `DONE` when the finer classification matters.

---

# 13. Recovery stashes and untracked files

Recovery stashes are temporary evidence-preservation tools, not project authority.

When reconciling dirty state:

1. preserve evidence safely;
2. reconcile authoritative branch/root;
3. restore bounded changes;
4. compare identities/hashes for conflicting tracked/untracked files;
5. validate;
6. remove recovery artifacts only when their unique information is proven unnecessary.

Never overwrite a known protected untracked file just to obtain a clean status.

---

# 14. Reusable pre-change checklist for every project

Before editing:

```text
[ ] authoritative repository/branch identified
[ ] remote HEAD recorded
[ ] local HEAD/status checked when local evidence matters
[ ] active owner mapped
[ ] current gate/question/falsifier stated
[ ] previous baseline → current HEAD diff understood
[ ] GPT-K projection checked for source-head/classification drift
[ ] live/deployed surface checked when applicable
[ ] required surfaces synchronized or mismatch explicitly classified
```

After editing:

```text
[ ] new source HEAD recorded
[ ] exact commit diff reviewed for scope
[ ] focused regression run
[ ] neighboring regression run when relevant
[ ] runtime/user-visible proof run only at the appropriate layer
[ ] GPT-K source_head/classification updated
[ ] active/pending gates updated
[ ] production/live UI deployment verified when applicable
[ ] synchronization matrix reported
[ ] exactly one next bounded gate selected
```

---

## Final reusable rule

For every engineering project:

```text
VERIFY
→ DIFF
→ TEST
→ CLASSIFY
→ SYNCHRONIZE PROJECT KNOWLEDGE
→ VERIFY LIVE SURFACE
→ ONLY THEN CONTINUE
```

The repository/runtime remains authoritative. GPT-Knowledge must stay synchronized enough to guide the next session without pretending to be the source of truth.
