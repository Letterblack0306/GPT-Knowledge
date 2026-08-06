---
title: Agent Safety, Governance, and Approval
category: Agents
sub_category: Safety
confidence: high
verified: true
last_reviewed: 2026-08-07
---

# Agent Safety, Governance, and Approval

## 1. Safety is an execution architecture

Safety cannot depend only on prompt wording. It must exist in capability registration, authorization, validation, containment, approval, execution, and evidence.

```text
Model intent
→ capability check
→ authorization check
→ schema validation
→ policy classification
→ approval when required
→ contained execution
→ post-action verification
→ audit record
```

## 2. Least authority

Give an agent only the capabilities, roots, accounts, targets, and time window required for the current task.

Avoid ambient authority such as:

- unrestricted filesystem access;
- inherited administrator privileges;
- all repositories by default;
- uncontrolled browser tabs;
- permanent credentials in prompts;
- broad shell access when a narrower tool exists.

## 3. Scope containment

Contain actions by verified boundaries:

- workspace root;
- allowed URL origins;
- selected browser target;
- repository and branch;
- account or tenant;
- operation type;
- command policy;
- approved file set.

Validate resolved targets, not only user-supplied strings.

## 4. Risk categories

A useful baseline:

- read-only;
- reversible local mutation;
- difficult-to-reverse mutation;
- destructive action;
- external side effect;
- credential or privacy-sensitive action;
- privilege or infrastructure action.

Risk classification should determine approval, logging, rollback, and verification requirements.

## 5. Approval design

Approval must communicate:

- exact action;
- target;
- reason;
- expected effect;
- important risks;
- reversibility;
- scope and duration of approval.

Do not ask for meaningless approval on every harmless read. Do not hide consequential actions inside a broad approval such as “allow everything.”

## 6. Guardrails

Guardrails may inspect:

- user input;
- model output;
- tool arguments;
- tool results;
- final claims.

Guardrails should return structured reasons and remediation paths. A guardrail must not silently transform a denied action into a different mutation.

## 7. Secrets

- never place secrets in model-visible context unless necessary;
- prefer OS credential stores or scoped environment injection;
- redact secrets from logs and evidence;
- prevent tools from reading unrelated credential locations;
- rotate compromised credentials;
- distinguish masked display values from stored values.

## 8. Prompt injection and untrusted content

Treat retrieved documents, web pages, emails, issue text, tool output, and generated files as data, not authority.

Instructions inside untrusted content must not override:

- system rules;
- user authorization;
- tool policy;
- scope boundaries;
- approval requirements.

## 9. Human control

Provide clear controls for:

- stop;
- pause;
- deny;
- approve once;
- revoke capability;
- inspect current action;
- review evidence;
- recover or roll back where supported.

Stop must interrupt active execution, not merely change UI text.

## 10. Auditability

Record:

- task and session IDs;
- normalized user objective;
- tool selection;
- validated arguments;
- policy and approval decisions;
- execution result;
- evidence;
- recovery attempts;
- final claim boundary.

Logs should support debugging without exposing private chain-of-thought or secrets.
