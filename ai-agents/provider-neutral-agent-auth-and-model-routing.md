# Provider-Neutral Agent Authentication and Model Routing

## Knowledge metadata

- Last reviewed: 2026-08-13
- Scope: provider-neutral model access for embedded or local reasoning agents
- Canonical use: read with `cline-runtime-reuse-for-governed-agent-infrastructure.md`, `agent-reasoning-transport-boundary.md`, and the active project's provider/runtime documentation
- Authority: architectural guidance only; live provider APIs, package versions, account entitlements, model availability, and the active project remain higher authority

## Core rule

A professional agent runtime must not make one model host or transport the identity of the agent.

```text
Agent/session runtime
        |
        v
Provider registry / adapter boundary
        |
        +-- local provider
        +-- account-authenticated provider
        +-- API-key provider
        +-- cloud provider
        +-- OpenAI-compatible endpoint
```

LM Studio, Ollama, Cline-hosted models, OpenAI, Anthropic, Gemini, OpenRouter, Bedrock, Vertex, Azure, and other compatible providers are **provider choices**, not separate agent architectures.

The reasoning/session/tool/evidence contract must remain stable when the selected provider changes.

---

## 1. Provider identity is separate from model identity

Track these independently:

```text
providerId
providerType
authMode
account/profile identity where applicable
endpoint/discovery source
modelId
model capabilities
availability/health
pricing/tier metadata when supplied by provider
```

Do not encode provider assumptions into session state, tool schemas, browser authority, or completion semantics.

A model selector should project current provider truth rather than hard-coded model names.

---

## 2. Supported authentication classes

A provider registry should be able to represent at least:

```text
local/no-auth
API key
OAuth/account login
cloud credential chain
custom bearer/header credentials
OpenAI-compatible endpoint credentials
```

Authentication remains provider-owned where an official provider or SDK mechanism exists.

Do not reverse-engineer private login tokens or copy browser session credentials merely to make an integration work.

For account-authenticated providers such as Cline, prefer the supported SDK/CLI/provider authentication path and keep only the minimum durable reference required by the host application.

---

## 3. Cline as a provider ecosystem

Current Cline architecture exposes reusable provider/agent layers through its SDK and supports a broad provider ecosystem, including local/OpenAI-compatible endpoints and account-backed Cline access.

For a host runtime, Cline may therefore be used in two distinct ways:

```text
A. lower-layer provider adapter
   @cline/llms
   -> provider authentication
   -> model discovery
   -> streaming/tool-call grammar

B. optional embedded agent loop
   @cline/agents
   -> reasoning/tool continuation loop
   -> host-governed tool execution through an adapter
```

These are independent decisions. Using Cline authentication or model routing does not require surrendering session, tool, browser, evidence, or UI ownership to ClineCore.

Read `cline-runtime-reuse-for-governed-agent-infrastructure.md` for the authority boundary.

---

## 4. Free and paid model availability is runtime data

Do not hard-code a permanent list of free models.

Provider tiers, promotional/free models, quotas, reset times, and availability can change independently of the host application.

Correct:

```text
provider authenticated
  -> discover models
  -> read provider-supplied capability/tier metadata
  -> project current choices into UI
  -> validate selected model before run
```

Incorrect:

```text
if provider == cline:
    show a fixed historical list of FREE models
```

If the provider exposes free-tier or zero-price metadata, preserve it as provider/model metadata and render it truthfully. Do not infer "free" merely from a model name.

---

## 5. Capability negotiation

Before a model is selectable for an agent workflow, prove or discover the capabilities that matter to that workflow.

Typical capability dimensions:

```text
text generation
tool/function calling
streaming
vision/image input
reasoning controls where exposed
context limit
structured output
provider continuation semantics
cancellation support
usage reporting
```

A provider being reachable does not prove that the selected model is suitable for the active tool-using agent.

The UI should distinguish:

```text
provider configured
provider authenticated
provider reachable
model discovered
model compatible
model ready
```

---

## 6. Provider registry contract

A useful host-side provider interface should normalize operations conceptually equivalent to:

```text
configure
sign_in / authenticate when applicable
sign_out
health
list_models
get_model_capabilities
select_model
start_turn / stream
submit_tool_result
cancel
usage/status
```

Exact APIs remain adapter-specific.

Provider-native event objects must be normalized before they become durable runtime/client contracts.

---

## 7. Local models remain first-class

Provider-neutral architecture must not turn cloud/account providers into a requirement.

LM Studio and other local OpenAI-compatible runtimes remain valuable for:

- local/private work;
- offline workflows;
- controlled model versions;
- low marginal inference cost;
- custom/local fine-tunes;
- development and provider-fallback testing.

Target architecture:

```text
Provider Registry
  +-- LM Studio / local OpenAI-compatible
  +-- Ollama/local adapter where supported
  +-- Cline account/provider
  +-- OpenAI / compatible hosted APIs
  +-- Anthropic
  +-- Gemini
  +-- OpenRouter
  +-- cloud adapters
  +-- future providers
```

No provider should become a mandatory dependency unless the product explicitly chooses that business constraint.

---

## 8. Session portability

Changing provider or model must not silently create a competing agent lifecycle.

The host session remains authoritative for:

```text
conversation/session identity
turn identity
tool-call identity
workspace/project identity
evidence
cancellation
waiting state
completion/failure truth
```

Provider continuation identifiers may be retained as opaque backend metadata.

When switching providers mid-session, explicitly define whether the host reconstructs context from normalized history or starts a new provider conversation. Never imply continuity that was not actually preserved.

---

## 9. Failure and fallback rules

Do not silently switch providers after a provider failure if doing so could change model behavior, authentication context, cost, privacy, or tool semantics.

Fallback should be explicit policy with observable evidence:

```text
selected provider unavailable
  -> record reason
  -> surface unavailable state
  -> offer or apply configured fallback policy
  -> record provider/model actually used
```

A fallback result must remain attributable to its actual provider/model.

---

## 10. Security and credential handling

- Prefer official SDK/provider authentication flows.
- Never expose provider tokens to model prompts or browser page content.
- Keep credential storage separate from normal workspace files and transcripts.
- Redact secrets from traces and receipts.
- Treat browser-hosted login pages as authentication surfaces, not as a token-extraction mechanism.
- Sign-out/revocation should invalidate the host's usable credential reference.

---

## 11. Validation ladder for a new provider

A provider integration is not complete because model discovery succeeds.

Validate in order:

```text
configuration/authentication
-> provider health
-> model discovery
-> capability truth
-> one live text turn
-> one live tool-call turn
-> host-governed tool execution
-> tool-result continuation
-> cancellation/error attribution
-> persistent session projection
-> UI truth
```

For account/free-tier integrations, additionally verify the current account can actually invoke the selected model. A `FREE` or tier label is not execution proof.

---

## 12. Implementation decision rule

When adding provider breadth to an existing agent product:

```text
reuse mature provider/auth plumbing
        > build provider adapters from scratch
```

only when the reusable layer preserves the host's required authority and contracts.

For Cline specifically:

```text
first evaluate @cline/llms for provider/auth/model breadth
then evaluate @cline/agents for the reasoning continuation loop
keep @cline/core optional unless its additional ownership is intentionally adopted
```

## Final rule

**The agent is provider-neutral. Authentication belongs to the provider boundary, model availability is discovered at runtime, local and hosted providers remain interchangeable behind normalized contracts, and the host runtime retains session/tool/evidence truth.**
