---
title: Agent Tool Design and MCP
category: Agents
sub_category: Tools
confidence: high
verified: true
last_reviewed: 2026-08-07
---

# Agent Tool Design and MCP

## 1. Tool quality determines agent quality

A capable model with vague, overlapping, or unreliable tools will behave poorly. Tool design is the agent–computer interface.

A good tool is:

- narrowly named;
- unambiguous in purpose;
- schema-validated;
- observable;
- bounded in side effects;
- explicit about failure;
- testable independently;
- consistent with related tools.

## 2. Tool contract

```json
{
  "name": "",
  "description": "",
  "inputSchema": {},
  "preconditions": [],
  "risk": "read | reversible-write | destructive | external-side-effect",
  "approval": "never | conditional | always",
  "timeoutMs": 0,
  "idempotent": false,
  "evidenceSchema": {}
}
```

## 3. Description rules

A tool description should explain:

- what it does;
- when to use it;
- when not to use it;
- required identifiers;
- important side effects;
- common failure modes;
- what the result proves.

Do not hide critical rules only in the system prompt. Put capability-specific rules beside the tool.

## 4. Schema rules

- reject unknown or malformed arguments;
- use enums for constrained choices;
- separate identifiers from display names;
- avoid overloaded string fields;
- represent optional values explicitly;
- validate paths, URLs, ports, IDs, and ranges;
- return structured validation errors that can be repaired.

## 5. Tool granularity

Avoid both extremes:

- one giant tool with dozens of unrelated actions;
- hundreds of tiny tools that create selection ambiguity.

Group operations when they share one domain, authority boundary, and result model. Split them when risk, approval, or evidence differs materially.

## 6. Read before write

For stateful environments, prefer:

```text
inspect → identify target → validate precondition → mutate → re-read → verify
```

Mutations should use exact identifiers or expected-current-value checks where possible.

## 7. Idempotency and retries

A retryable tool should either be idempotent or carry an operation key that prevents duplicated side effects. The runtime must know whether retrying could repeat a payment, message, deletion, commit, or other irreversible action.

## 8. MCP architecture

MCP uses a host–client–server architecture. The host controls lifecycle and permissions, clients maintain sessions, and servers expose capabilities such as tools, resources, and prompts.

Treat MCP as a transport and capability protocol, not as automatic trust. Every connected server still needs:

- identity;
- explicit user authorization;
- capability negotiation;
- scope restrictions;
- input validation;
- output handling;
- timeout and disconnect behavior;
- audit records.

## 9. Dynamic registration

When tools can appear or disappear at runtime:

- publish only currently available capabilities;
- unregister disconnected capabilities;
- record failed registrations;
- preserve provider/server identity;
- prevent stale manifests;
- surface capability health separately from capability existence.

## 10. Evidence

A tool result should distinguish:

- request accepted;
- operation started;
- operation completed;
- state verified;
- result partial;
- action blocked;
- action failed.

A success boolean alone is insufficient for consequential operations.
