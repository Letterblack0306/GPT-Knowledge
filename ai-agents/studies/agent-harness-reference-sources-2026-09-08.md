# Agent Harness Reference Sources — DeepSeek Harness, OpenClaw, and Hermes Agent

## Knowledge metadata

- Last reviewed: 2026-09-08
- Status: source-specific comparative reference
- Authority: implementation/reference material only; live target-project source, active runtime evidence, and upstream current documentation outrank this note
- Applies to: local/persistent agent harnesses, workspace selection, model/provider configuration, messaging gateways, integrations, skills, memory, scheduled work, and operator/runtime surfaces

## Sources

- DeepSeek Harness quickstart: https://deepseek-harness.github.io/deepseek-harness/en/guide/quickstart
- OpenClaw product/docs entry: https://openclaw.ai/
- Hermes integrations hub: https://hermes-agent.ai/integrations
- Hermes Agent repository: https://github.com/NousResearch/hermes-agent

## DeepSeek Harness — useful reference points

The current quickstart shows a Web UI centered on an explicitly selected workspace and configured model route.

Observed reference patterns:

- the process starts with an invoking-directory filesystem context, but a fresh UI has no selected workspace until the user adds one;
- model configuration is changed through Settings and can become usable without restarting the server;
- the session composer remains unavailable until a workspace is selected;
- the agent can read/edit workspace files, run commands, delegate work, and maintain a plan;
- approval policy remains a runtime boundary for operations that require approval.

Use DeepSeek Harness as a concrete reference for:

- explicit workspace selection before agent work;
- runtime model configuration through UI;
- user-visible approval boundaries;
- keeping the operator surface aligned with active runtime state.

Do not treat its planner/delegation model as a requirement for Brew or another target project unless the target architecture independently requires it.

## OpenClaw — useful reference points

The current OpenClaw public site presents a self-hosted/local-first personal agent with desktop applications and chat-platform integration, including Telegram.

Observed reference patterns:

- local/self-hosted operation is a primary product shape;
- installation/onboarding is treated as a first-class product flow;
- desktop applications bundle gateway, chat, setup, and node features;
- the project is designed to run on Windows, macOS, and Linux;
- personal-agent capabilities are exposed through chat applications and local machine access.

Use OpenClaw as a reference for:

- operator onboarding and installation ergonomics;
- local agent + gateway + messaging product composition;
- cross-platform packaging;
- making persistent agent capabilities accessible outside the primary desktop UI.

Do not promote product-site claims or testimonials into architectural truth. Inspect current OpenClaw source/docs before copying implementation details.

## Hermes Agent — useful reference points

The current Hermes repository and integrations material expose a broad persistent-agent runtime with one gateway serving multiple messaging platforms.

Observed current patterns include:

- CLI and messaging gateway entry points;
- Telegram, Discord, Slack, WhatsApp, Signal and other integrations through a gateway process;
- provider/model switching without changing the agent's basic interaction model;
- persistent memory and user-profile features;
- skills/procedural memory;
- MCP integration;
- scheduled/cron work;
- project context files;
- command approval/security boundaries;
- explicit platform status commands;
- migration support from OpenClaw, including selected memories, skills, messaging settings, allowlists, workspace instructions and allowlisted secrets.

Use Hermes as a reference for:

- one underlying agent capability model across CLI and messaging transports;
- messaging-gateway status/config surfaces;
- provider-neutral runtime configuration;
- persistent memory + skills + context separation;
- integration migration with dry-run/preview behavior;
- platform-specific status without redefining agent identity.

The existing GPT-K Hermes study remains the deeper source for memory, skills, checkpoints, and persistent-operation patterns:
- `ai-agents/studies/hermes-memory-skills-agent-loop.md`

## Relevance to Brew

These references are useful when Brew work concerns:

- selected-workspace UX and runtime readiness;
- Telegram/admin status and configuration;
- provider/model settings surfaces;
- messaging gateways;
- persistent memory/skills;
- integrations and connector lifecycle;
- local/self-hosted installation and operator flows.

They are not Brew architecture authorities.

Required interpretation:

```text
reference implementation
  -> identify concrete pattern
  -> inspect current Brew owner/source/runtime
  -> adopt only if it fixes a proven Brew requirement
  -> validate through Brew's real user/runtime path
```

Do not widen Brew's architecture merely because an upstream harness has more layers, agents, planners, gateways, or integrations.

## Freshness rule

All four upstream projects evolve quickly.

Before implementation:

1. re-open the relevant upstream page/repository;
2. record the current source date/revision when a detail matters;
3. compare the pattern to current Brew source/runtime;
4. adopt the smallest useful behavior;
5. validate the Brew result independently.
