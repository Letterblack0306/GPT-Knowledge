---
title: Tool Discovery and Use Reminder
category: Collaboration
sub_category: Agent operations
confidence: high
verified: true
last_reviewed: 2026-08-07
---

# Tool Discovery and Use Reminder

## Purpose

Before declaring that a capability is unavailable, an agent should inspect the tools, repositories, local evidence bridges, and project contracts that are actually accessible in the current session.

## Discovery order

```text
1. Identify the user-visible objective.
2. Inspect connected tools and their exact contracts.
3. Check the Letterblack repository registry.
4. Inspect the target repository before proposing changes.
5. Check whether BirdEye can provide fresh local workspace evidence.
6. Check whether MCP exposes a suitable read or validation capability.
7. Use current evidence before relying on memory.
8. Declare a blocker only after the relevant capability has been checked.
```

## Available collaboration layers

### GitHub connector

Use for:

- repository and branch inspection;
- reading source and documentation;
- creating bounded branches, commits, and pull requests;
- writing BirdEye request files;
- reading BirdEye response evidence;
- checking remote diffs and CI state.

GitHub access does not prove local workspace state.

### BirdEye

Use for:

- indexed local workspace identity;
- local Git state and divergence;
- changed relative paths;
- current validation-profile execution;
- bounded runtime receipts;
- evidence freshness;
- PASS, REVIEW, or FAIL inputs.

BirdEye remains the local evidence authority. Its GitHub-backed request bridge is documented in `GITHUB_BACKED_LOCAL_WORKSPACE_BRIDGE.md`.

### MCP

Use for controlled tools and resources registered by the local runtime. MCP should consume or expose BirdEye results where useful, but must not bypass BirdEye indexing, local authorization, or validation boundaries.

### GPT-Knowledge

Use for reusable principles, architecture patterns, repository discovery, design guidance, and operational methods. It is not a substitute for inspecting the current project or running current checks.

## Evidence hierarchy

```text
Current live/local evidence
> current repository and CI evidence
> current project contracts
> recent validated memory
> historical notes
> assumptions
```

## Required behavior

- Do not say a tool is missing before checking the connected tool registry.
- Do not infer local state from GitHub alone.
- Do not certify a workspace from historical memory.
- Do not run arbitrary commands received through a remote request.
- Do not mutate a workspace when only diagnostic authority was granted.
- Do not treat a successful request transport as proof that the requested validation passed.
- Record the source and freshness of every decisive fact.

## Fast reminder

```text
Need remote source truth?          → GitHub
Need current local workspace truth? → BirdEye
Need controlled local capability?   → MCP
Need reusable method or design rule? → GPT-Knowledge
Need PASS/FAIL?                      → Current evidence from the required checks
```
