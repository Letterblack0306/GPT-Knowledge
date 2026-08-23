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

---

# 15. Live-surface reconciliation record (2026-08-23)

Date: 2026-08-23
Scope: alignment of the GPT-Knowledge public projection with the canonical source tree, and the public-edge ownership gap that the live runtime evidence exposed.

## What is now PROVEN

```text
LOCAL BUILD                       PROVEN
  scripts/build-vercel-static.mjs exit 0; rebuilt public/ from
  project-engineering/ in a single invocation.

LOCAL PUBLIC ALIGNMENT            PROVEN
  27 / 27 source-vs-public file pairs hash-equal after rebuild.
  Includes the four stale-publication targets that were the
  working-plan gap:
    - projects/looptool/status.json          (now carries runtime_proof)
    - projects/looptool/plan.json            (now carries the 7 new
                                              historical-recall nodes,
                                              Memory authority owner,
                                              and the historical-question
                                              Before-Execution gate)
    - projects/looptool/reference.md         (now carries the
                                              Current proven runtime
                                              checkpoint and the
                                              Historical plan, decision,
                                              disagreement and truth
                                              retrieval sections, plus
                                              Memory in the authority
                                              separation)
    - projects/workspace/projects.json       (LoopTool subtitle updated)
    - projects/workspace/index.html          (now loads
                                              ./repo-branches-ui.js and
                                              renders the new collapsible
                                              Repo-branches panel)
    - projects/workspace/repo-branches-ui.js (newly published)

PUBLIC ROUTE REACHABILITY         PROVEN
  https://agent.letterblack.net/project-engineering/projects/workspace/projects.json
  -> HTTP 200, Cache-Control: no-store, nginx 1.18.0 (Ubuntu).
  Same route for portfolio/plan.json (already PROVEN in prior session).

LOCAL_PROJECTS EXCLUSION          INTENTIONALLY NOT PUBLISHED
  workspace/local-projects.json contains machine-local Windows paths
  (e.g. G:\Developments\...). It is canonical source-of-record inside
  the repository and is the file referenced by the LoopTool
  runtime_proof. The runtime proof's PROJECT_SOURCE line therefore
  names a file the hosted UI does not fetch. That is the intended
  state: a sanitized public projection would carry only non-sensitive
  identifiers ({"id": {"mapped": true}}), not absolute paths.
  The current build script (scripts/build-vercel-static.mjs) copies
  the whole workspace/ tree recursively, so a manual Remove-Item on
  public/project-engineering/projects/workspace/local-projects.json
  was required for this run. The durable fix is a one-line exclusion
  in the build script; it is recorded as a pending task and must be
  made only after the deployment owner is proven (see below).
```

## What is now DISPROVEN

```text
LIVE CONTENT FRESHNESS            DISPROVEN
  https://agent.letterblack.net/project-engineering/projects/looptool/status.json
  currently returns 3572 bytes with:
    - overall_classification = OPERATING_CONTRACT_VERIFIED_IMPLEMENTATION_IDENTITY_CURRENT
      (old, pre-proof)
    - verified_at            = 2026-08-21T00:54:00+04:00
      (old, pre-proof)
    - runtime_proof          = MISSING
  while the rebuilt local public/ has 6113 bytes with:
    - overall_classification = PROVEN_BOUNDED_EXECUTION_AND_RECALL_BRIDGE_WITH_RUNTIME_PROOF
    - verified_at            = 2026-08-23T08:26:00+04:00
    - runtime_proof          = PRESENT
  The size mismatch (3572 vs 6113) is the live runtime evidence that
  the public edge is serving an older deployment copy rather than the
  rebuilt local public/.

  Same pattern observed on the LoopTool subtitle and the
  historical-question plan node. No file is provably current at the
  agent.letterblack.net edge today.
```

## What remains UNVERIFIED

```text
DEPLOYMENT OWNER                  UNVERIFIED
  agent.letterblack.net resolves to 193.123.91.227 (DNS verified
  locally). knowledge.letterblack.co.ae resolves to no A record from
  this host. The two are different IPs. The repo's only nginx config
  is ops/nginx/knowledge.letterblack.co.ae.conf, which documents
  84.235.251.204 -> WireGuard -> 10.10.0.4:8080. No file in the
  repository mentions agent.letterblack.net.

  Until the live-edge owner is proven, the public projection is
  not in a "verified live" state. The next required gate is
  read-only inspection of:
    1. the active nginx server block for agent.letterblack.net
    2. its root / alias / proxy_pass
    3. the actual service or filesystem that holds the stale
       workspace/projects.json and looptool/status.json
    4. any existing deploy / sync / rsync / scp / git command that
       propagates C:\MCP Local\GPT-Knowledge\public to the live edge
  No copy, no restart, no deploy may run before this gate returns
  LIVE_EDGE_OWNER, LIVE_CONTENT_ROOT, UPSTREAM,
  CURRENT_DEPLOY_MECHANISM, EXPECTED_SOURCE, MISMATCH, and
  MINIMAL_DEPLOY_STEP.
```

## Doc-vs-working-plan gap closed this run

The documents that previously did not match the working plan were
all on the publication side, not the source side. After the local
rebuild they all align byte-for-byte with project-engineering/...

```text
ALIGNED (source == public):
  projects/looptool/status.json
  projects/looptool/plan.json
  projects/looptool/reference.md
  projects/workspace/projects.json
  projects/workspace/index.html
  projects/workspace/repo-branches-ui.js
  projects/workspace/canvas-drag.js
  projects/workspace/birdeye-ui.js
  projects/workspace/agent-ui.js
  projects/workspace/workspace-text-ui.js
  projects/workspace/repo-sync.js
  projects/workspace/{PLAN_TRUTH_UI_CONTRACT,PROJECT_STATE_WRITE_CONTRACT,
                      BIRDEYE_EVIDENCE_NAVIGATION_UI_PLAN,
                      SHARED_SKILL_RETRIEVAL_PLAN,
                      TOOL_RECALLABLE_EXECUTION_RECORDS_REQUIREMENT}.md
  projects/portfolio/{plan,status}.json
  projects/memory/{plan,status}.json, memory/reference.md
  projects/brew/{plan,status}.json
  projects/agent-harness-reference/{plan,status}.json, reference.md
  projects/lbe-plan-canvas/{plan,status}.json, references.json
  projects/adobe-ai-generations-release-hardening/{plan,status}.json
  projects/access-browser-agent-plan/{plan,status}.json
```

```text
INTENTIONALLY OMITTED FROM PUBLIC:
  projects/workspace/local-projects.json
  Reason: machine-local Windows paths; the public edge
  (agent.letterblack.net) is publicly reachable and the file is not
  safe to publish. The canonical source remains the runtime
  evidence owner.

COSMETIC ONLY (not a content gap):
  projects/memory/plan.json line endings: LF in source, CRLF after
  build on Windows. Not normalized; does not affect rendered output.
```

## Authority precedence reaffirmed

```text
runtime > workspace > session > project docs > historical evidence > derived memory > inference
```

The current public edge is a remote runtime, not the local
workspace. Until the live edge returns the post-rebuild content,
do not let the live copy downrank the local canonical source.
The local public/ is the working-plan truth today; the live edge
is at best PROVEN_REACHABLE and at worst DISPROVEN_FRESH.

## Open tasks (recorded, not in this run's scope)

1. Identify the deployment owner for agent.letterblack.net.
2. Ship the rebuilt public/ through the verified deploy mechanism.
3. After the live edge is current, make the
   scripts/build-vercel-static.mjs local-projects.json exclusion
   permanent.
4. Record the second public edge in ops/nginx/knowledge.letterblack.co.ae.conf
   and ops/nginx/allowlist.json once its serving chain is known.

## Reusable rule from this run

When the working plan lives in source and a public edge is meant
to mirror it, never declare "aligned" on the basis of the source
tree alone. The minimum evidence set is:

```text
source == public  (hash check)
live edge 200     (reachability)
live edge == public  (freshness)
deployment owner identified and owned
```

A failed freshness check is a stop condition, not a patch
authorization. Identify the serving path, then ship.

---

# 16. Operator inspection packet (2026-08-23)

## Purpose

Section 15 recorded that the local public/ rebuild is correct
and the live edge agent.letterblack.net is DISPROVEN_FRESH, with
the deployment owner UNVERIFIED. That gap cannot be closed from
the local Windows workspace because this host has no SSH, no
WireGuard peer, and no credentials to 193.123.91.227.

The next required action is a read-only inspection on the live
edge itself. This section is the single source for the inspection
script and the result schema. It is not a deploy recipe; it is
the audit packet that has to be returned before any deploy is
authorized.

## Read-only inspection script (run on the live-edge host)

The script is intentionally read-only. It does not modify nginx,
does not restart any service, does not copy, rsync, scp, or git
pull, and does not start a deploy.

```bash
# 1. Dump the full nginx configuration as the running process sees it.
sudo nginx -T 2>/dev/null | tee /tmp/agent-edge-nginx-T.txt

# 2. From the dump, isolate the server block for agent.letterblack.net.
#    Report only these four fields per server block:
#      server_name
#      root
#      alias
#      proxy_pass
sudo nginx -T 2>/dev/null |
  awk '
    /^[ \t]*server[ \t]*\{/ { in_server=1; buf="" }
    in_server { buf = buf $0 ORS }
    /^[ \t]*\}[ \t]*$/ && in_server {
      if (buf ~ /server_name[ \t]+agent\.letterblack\.net/) {
        printf "%s", buf
      }
      in_server=0
    }
  ' | tee /tmp/agent-edge-nginx-server-block.txt
```

```bash
# 3. If the server block uses proxy_pass, walk into the upstream
#    service until you find the directory that actually holds the
#    stale workspace/projects.json. Identify the service unit, its
#    working directory, and the on-disk root it serves.
systemctl list-unit-files --type=service --state=enabled,disabled,running 2>/dev/null |
  grep -Ei 'letterblack|gpt|workspace|deploy|sync' |
  tee /tmp/agent-edge-services.txt

systemctl list-timers --all 2>/dev/null |
  grep -Ei 'letterblack|gpt|workspace|deploy|sync' |
  tee /tmp/agent-edge-timers.txt

# 4. If a deploy / sync mechanism is found, report its command and
#    schedule. Do not run it. Do not dry-run it. Read the unit file
#    or crontab entry only.
sudo systemctl cat <unit-name> 2>/dev/null
sudo crontab -l 2>/dev/null
sudo cat /etc/cron.d/* 2>/dev/null | grep -Ei 'letterblack|gpt|workspace'
```

```bash
# 5. Once the live content root is identified, hash the files the
#    public edge is actually serving today and compare against the
#    rebuilt local public/. This is the freshness check, server-side.
LIVE_ROOT="<fill from step 2 or 3>"
sha256sum "$LIVE_ROOT/project-engineering/projects/workspace/projects.json"
sha256sum "$LIVE_ROOT/project-engineering/projects/looptool/status.json"
sha256sum "$LIVE_ROOT/project-engineering/projects/looptool/plan.json"
sha256sum "$LIVE_ROOT/project-engineering/projects/workspace/repo-branches-ui.js"
test -e "$LIVE_ROOT/project-engineering/projects/workspace/local-projects.json" \
  && echo "live HAS local-projects.json (UNEXPECTED; must be removed)" \
  || echo "live DOES NOT have local-projects.json (expected, per Step 2a decision)"
```

## Result schema (mandatory)

The operator inspection must return exactly these six values.
Free-form prose is rejected; the next deploy step will not be
authorized until every field is present and the freshness hashes
are recorded alongside.

```text
LIVE_EDGE_OWNER=                 # host, account, or service unit that owns the live edge
                                 # e.g. ubuntu@193.123.91.227 / nginx / letterblack-agent.service

LIVE_CONTENT_ROOT=               # absolute path on the live host that actually holds
                                 # the served files; may be the nginx root, an alias,
                                 # or a proxy_pass upstream working directory

UPSTREAM=                        # proxy_pass target if present, otherwise "static root"
                                 # e.g. http://10.10.0.4:8080 OR "none (static root)"

CURRENT_DEPLOY_MECHANISM=        # exact command / service / timer / cron that propagates
                                 # the local public/ tree to LIVE_CONTENT_ROOT
                                 # e.g. systemd:letterblack-deploy.service, cron:*/5 * * * *,
                                 # or "none identified" if no mechanism is documented

EXPECTED_SOURCE=                 # the canonical source the deploy mechanism is meant to
                                 # pull from, e.g.
                                 # C:\MCP Local\GPT-Knowledge\public (mounted at /srv/letterblack/public)
                                 # or https://github.com/Letterblack0306/GPT-Knowledge
                                 # branch GPT-Knowledge/main path public/

MISMATCH=                        # one-line summary of the freshness gap, e.g.
                                 # "live content_root SHA256 != local public/ SHA256 for
                                 #  workspace/projects.json and looptool/status.json;
                                 #  live missing repo-branches-ui.js; local-projects.json
                                 #  correctly absent on both sides"
```

Plus the four SHA256 hashes from inspection step 5, recorded
with the file they were taken from.

## After the schema is filled

Once the six values are known, the next step is reduced to one
owned deploy action and a single re-run of the live checks from
the local workspace. That re-run must show:

```text
live edge 200                       # already PROVEN
live edge == public  (freshness)    # the four SHA256 hashes match local public/
local-projects.json not served      # still 404 on the live edge
```

Only then does LIVE CONTENT FRESHNESS move from DISPROVEN to
PROVEN, and only then does the build-script local-projects.json
exclusion become safe to make permanent.

## Hard prohibitions during this gate

- Do not run `rsync`, `scp`, `git pull`, `git push`, `cp -r`,
  `dd`, or any copy against 193.123.91.227 from this workspace.
- Do not restart nginx, the agent service, the deploy service,
  or any timer.
- Do not edit `ops/nginx/knowledge.letterblack.co.ae.conf`,
  `ops/nginx/allowlist.json`, or `scripts/build-vercel-static.mjs`
  until the live-edge owner is proven and the deploy mechanism
  is identified.
- Do not edit the LoopTool / project documents. The local public/
  is the working-plan truth; the live edge is the only thing
  stale, and that is a deploy-side problem, not a doc problem.
- Do not invent a deploy command. The current_deploy_mechanism
  field exists so the real mechanism is recorded, not guessed.
