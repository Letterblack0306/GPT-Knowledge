---
title: GitHub-Backed Local Workspace Bridge
category: Collaboration
sub_category: Remote-to-local diagnostics
confidence: high
verified: implementation_available
last_reviewed: 2026-08-07
---

# GitHub-Backed Local Workspace Bridge

## Purpose

This pattern lets a remote agent or collaborator request fresh, bounded evidence from a local workspace without opening an inbound port or granting arbitrary command execution.

The implementation reference is `Letterblack0306/Letterblack_BirdEye`, branch `feat/local-workspace-change-bridge`, PR #2.

## Architecture

```text
Remote collaborator
→ writes a request file to a private GitHub queue
→ local BirdEye polls outbound
→ validates request schema, expiry, workspace mapping, and operation allowlist
→ reads indexed workspace state and local Git evidence
→ optionally runs a locally defined validation profile
→ redacts sensitive paths, tokens, and oversized output
→ writes a machine-specific response file
→ commits and pushes the response
→ remote collaborator reads the evidence through GitHub
```

GitHub is the exchange layer. BirdEye remains the local indexing and evidence authority.

## Why outbound polling

Outbound polling is the default because it:

- opens no inbound network listener;
- does not expose the local MCP server;
- works behind NAT and normal firewalls;
- lets the local machine retain final authorization;
- supports deterministic polling, expiry, and deduplication;
- creates an auditable Git history of requests and responses.

A webhook may notify a public service, but it is not required for the first version and should not directly target the local MCP runtime.

## Request contract

A request selects only a known operation and optional local validation profile.

```json
{
  "schemaVersion": 1,
  "requestId": "req-20260807-001",
  "createdAt": "2026-08-07T20:00:00Z",
  "expiresAt": "2026-08-07T20:15:00Z",
  "workspaceId": "access-browser-agent",
  "operation": "workspace_diagnosis",
  "scope": {
    "gitStatus": true,
    "indexedChanges": true,
    "runtimeStatus": true,
    "validationProfile": "project-default"
  },
  "mutationAllowed": false
}
```

The request must not contain shell commands, absolute local paths, tokens, arbitrary scripts, or mutation instructions.

## Local configuration

Workspace mappings and validation commands remain local and private.

```json
{
  "machineId": "dev-main",
  "pollSeconds": 45,
  "repository": "Letterblack0306/Letterblack_BirdEye",
  "branch": "runtime/dev-main",
  "workspaceMappings": {
    "access-browser-agent": "<local workspace path>",
    "brew": "<local workspace path>"
  },
  "allowedOperations": [
    "workspace_status",
    "workspace_diagnosis",
    "git_compare",
    "run_validation_profile",
    "refresh_index"
  ]
}
```

Never store real machine paths, credentials, or private tokens in a public knowledge repository.

## Evidence collected

The local bridge may return:

- repository and workspace identity;
- current branch and HEAD;
- upstream branch;
- ahead/behind divergence;
- staged, unstaged, and untracked paths;
- indexed file counts and index availability;
- bounded validation output;
- runtime receipt paths;
- changed relative paths;
- timestamps and evidence freshness;
- PASS, REVIEW, or FAIL with explicit reasons.

## Verdict rules

### PASS

PASS requires all checks requested by the selected local validation profile to pass using current local evidence.

### REVIEW

Use REVIEW when evidence is incomplete, stale, the workspace is dirty without a proven failure, the index is unavailable, or the requested proof level was not executed.

### FAIL

Use FAIL when a required current check fails, the repository/workspace identity conflicts, the request is invalid, or a proven blocker exists.

Memory, prior commits, and historical PASS records may guide inspection but cannot certify the current workspace.

## Security boundary

The first version must remain read-only:

- no arbitrary request-provided commands;
- no pull, merge, checkout, reset, clean, edit, delete, or push to project repositories;
- no inbound port;
- no direct exposure of MCP;
- no automatic mutation after a webhook;
- no source-file upload by default;
- no secrets or absolute-path disclosure;
- duplicate request IDs rejected;
- expired requests rejected;
- one machine-specific response namespace;
- bounded outputs and explicit redaction.

## MCP relationship

MCP may expose completed BirdEye responses as tools or resources, for example:

```text
workspace_status
inspect_change_job
compare_local_to_remote
read_validation_receipt
refresh_workspace_index
```

MCP is the controlled query interface. It is not the public webhook receiver and not the source of local workspace truth.

## Operational sequence

```text
1. Remote agent determines what evidence is missing.
2. Agent creates a bounded request in the private queue.
3. Local BirdEye polls and validates it.
4. BirdEye gathers current Git, index, validation, and runtime evidence.
5. BirdEye writes a redacted response and pushes it.
6. Remote agent reads the response through GitHub.
7. Agent judges PASS, REVIEW, or FAIL from current evidence.
8. Any later mutation requires a separate explicit authorization path.
```

## Claim boundary

This method provides near-real-time collaboration only while the local BirdEye poller is running and able to push. It does not provide direct remote machine control, continuous streaming, or universal workspace certification.
