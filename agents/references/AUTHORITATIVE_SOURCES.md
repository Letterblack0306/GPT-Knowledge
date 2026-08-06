---
title: Authoritative AI Agent Sources
category: Agents
sub_category: References
confidence: high
verified: true
last_reviewed: 2026-08-07
---

# Authoritative AI Agent Sources

Use primary papers, specifications, and official engineering documentation. Treat framework tutorials and commentary as secondary interpretation.

## ReAct

Paper: *ReAct: Synergizing Reasoning and Acting in Language Models*.

Use for:

- interleaving reasoning and environment actions;
- updating plans from observations;
- understanding why acting can reduce unsupported internal reasoning;
- foundational terminology for reasoning–action loops.

Boundary: ReAct is a research pattern, not a complete production runtime, security architecture, or justification for exposing private chain-of-thought.

## Anthropic: Building Effective Agents

Use for:

- distinguishing workflows from agents;
- choosing the simplest sufficient architecture;
- prompt chaining, routing, parallelization, orchestrator–worker, and evaluator–optimizer patterns;
- emphasis on transparent, composable systems and careful agent–computer interface design.

Boundary: official engineering guidance is experience-based guidance, not a protocol specification.

## OpenAI agent-building guidance and Agents SDK

Use for concepts including:

- agents with instructions and tools;
- handoffs;
- guardrails;
- tracing and observability;
- orchestration of agent workflows.

Boundary: SDK features are implementation options, not universal architecture requirements. Preserve compatibility and evaluate dependency tradeoffs before adopting a framework.

## Model Context Protocol

Use the current official MCP specification for:

- host–client–server architecture;
- capability negotiation;
- sessions and lifecycle;
- tools, resources, prompts, and sampling;
- protocol security boundaries.

Boundary: MCP standardizes integration. It does not make a server trusted or remove the need for authorization, policy, validation, and audit.

## Browser and computer-use sources

### Chrome DevTools Protocol

Use the official CDP documentation for:

- browser and page WebSocket endpoints;
- target discovery and attachment;
- Target, Page, Accessibility, DOM, Runtime, Network, and Input domains;
- target lifecycle events;
- browser contexts;
- protocol-version and experimental-method boundaries.

Important source fact: tip-of-tree CDP changes frequently and does not guarantee backward compatibility. Adapter capability detection and runtime protocol inspection are therefore engineering requirements.

### Playwright

Use official Playwright documentation for:

- browser contexts and pages;
- role, label, text, placeholder, title, alt-text, and test-ID locators;
- locator retryability and actionability;
- navigation, popup, and frame handling.

Engineering interpretation: semantic locator patterns are reusable beyond Playwright. Browser agents should prefer role/label-based references over brittle coordinates or raw CSS selectors when the target exposes accessible semantics.

### Chrome Extensions

Use official Chrome Extensions documentation for:

- service workers and content scripts;
- isolated and main execution worlds;
- one-time and long-lived messaging;
- host permissions and tab/frame access;
- native messaging and extension security.

Important source fact: Chrome documentation treats content scripts as less trustworthy than extension service workers. Validate and sanitize their messages, and limit the privileged actions they can trigger.

### Computer-use providers

Use official provider documentation for:

- screenshot and visual action schemas;
- browser/computer environment setup;
- safety and approval recommendations;
- supported surfaces and limitations;
- model/version-specific behavior.

Do not turn one provider's API into a universal browser-agent standard. Extract reusable contracts while preserving provider-specific adapters.

## Additional primary research areas

Research separately before promotion into validated guidance:

- reflection and self-correction;
- long-horizon planning;
- tool-use learning;
- agent memory;
- multi-agent coordination;
- agent benchmarks and evaluation;
- prompt injection and tool security.

## Knowledge extraction format

For every source, record:

```text
Source claim
Evidence or experiment scope
Extracted reusable principle
Known limitations
Implementation interpretation
Runtime validation status
```

Do not turn a benchmark result or framework feature into a universal claim.

## Review rules

- record source date and specification version;
- prefer official and primary sources;
- distinguish research findings from production guidance;
- mark interpretations explicitly;
- do not silently replace old conclusions;
- re-review protocol, browser, extension, and SDK guidance when versions materially change;
- do not treat a successful mock as live browser proof.
