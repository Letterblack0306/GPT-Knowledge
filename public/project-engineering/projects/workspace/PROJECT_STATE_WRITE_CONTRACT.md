# Governed Project State Write Contract

## Purpose

Allow local or remote reasoning agents to publish evidence-backed project status/plan updates into GPT-Knowledge without making chat prose or arbitrary local files authoritative.

Endpoint:

```text
GET  /api/project-state?project=<id>
POST /api/project-state
```

The LB Workspace remains a read-only projection of repository-backed `status.json` / `plan.json`.

## Authority boundary

```text
agent observation / claim
→ evidence + source revision
→ governed project-state API
→ optimistic-concurrency validation
→ GPT-Knowledge main
→ Vercel projection
→ LB Workspace UI
```

The endpoint does not reason about project meaning. It validates identity, evidence, revision and allowed mutation surfaces.

## Supported projects

Current mapped projects:

```text
lbe
access-browser-agent
looptool
```

Projects without canonical `plan.json` + `status.json` mappings are rejected until registered.

## Read-before-write requirement

Every writer MUST first call:

```text
GET /api/project-state?project=access-browser-agent
```

The response contains:

```json
{
  "status": { "path": "...", "sha": "<blob sha>", "value": {} },
  "plan":   { "path": "...", "sha": "<blob sha>", "value": {} }
}
```

The agent must reconcile the returned current projection before proposing a write.

## Optimistic concurrency

POST requires `expected_sha` for the exact file being patched.

If another agent/user changes the projection first, the endpoint returns:

```text
409 STALE_PROJECTION_SHA
```

The writer must read again and reconcile. It must not force-overwrite newer project truth.

## Authentication

POST requires:

```text
x-workspace-save-key: <WORKSPACE_SAVE_KEY>
```

The key is supplied through deployment environment configuration. The governed project-state endpoint deliberately has no repository-committed fallback key.

## Source revision

A write requires:

```text
source_repo
source_head
source_branch
agent
```

`source_head` must be a full 40-character Git SHA.

For the current v1 contract, `source_repo` is verified against GitHub using the configured GitHub App before the projection write is accepted.

## Evidence requirement

Every write must include at least one durable evidence anchor:

```text
command_hash
receipt_id
commit_sha
refs[]
```

Additional structured evidence is allowed.

A bare natural-language statement such as `tests pass` or `stage complete` is insufficient.

## Status mutation surface

Allowed status keys:

```text
overall_classification
active
pending
closed
proven_findings
hardening_plan
next_acceptance
plan_truth
```

The API additionally writes:

```text
verified_at
source_repo
source_branch
source_head
last_agent_update
```

`last_agent_update` records the agent identity, source revision, evidence and update timestamp.

## Plan mutation surface

Allowed plan keys:

```text
active_node
nodes
edges
plan_truth
```

All writes remain constrained by the exact current blob SHA.

## Plan truth states

```text
NO_ACTIVE_PLAN
CHAT_PROPOSAL_ONLY
DOCUMENTATION_PENDING
DOCUMENTED_CURRENT
DOCUMENTED_STALE
DOCUMENTATION_BLOCKED
PLAN_OWNER_MISSING
```

Only `DOCUMENTED_CURRENT` is authoritative current plan truth in the LB Workspace UI contract.

## Example status update

First GET the current projection and copy `status.sha`.

Then:

```json
{
  "project": "access-browser-agent",
  "kind": "status",
  "expected_sha": "<status blob sha from GET>",
  "source_repo": "Letterblack0306/access-browser-agent",
  "source_branch": "main",
  "source_head": "0048d0dceb062fbabb06423dfa419a6050a4713e",
  "agent": "looptool-local-agent",
  "evidence": {
    "command_hash": "C86697820EA8458EA5A80B45E1452DD812DB0CD7D87A12B8A224A78C3E94DF8B"
  },
  "patch": {
    "overall_classification": "PROVEN_SOURCE_AND_LOCAL_REGRESSION",
    "plan_truth": {
      "state": "DOCUMENTED_CURRENT",
      "document": "../access-browser-agent-plan/plan.json",
      "document_revision": "0048d0dceb062fbabb06423dfa419a6050a4713e",
      "active_gate": "terminal-state-ui",
      "next_single_question": "Can live acceptance pass against an explicitly idle/baselined target?"
    }
  }
}
```

## Conflict handling

The API rejects rather than silently merges when:

- project is unmapped;
- save key is absent/invalid;
- expected projection SHA is stale;
- source revision cannot be verified;
- submitted source repository conflicts with current status ownership;
- evidence has no durable anchor;
- patch contains a non-allowed top-level field;
- plan-truth state is outside the controlled vocabulary.

## Agent rule

An agent may publish a status only after it has enough evidence to classify the result.

```text
chat claim ≠ project truth
local report ≠ project truth
API-validated repository projection = documented project state
```

The agent remains responsible for reasoning. The API only protects the persistence boundary.
