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

## Additional primary research areas

Research separately before promotion into validated guidance:

- reflection and self-correction;
- long-horizon planning;
- tool-use learning;
- agent memory;
- browser and computer use;
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
- re-review protocol and SDK guidance when versions materially change.
