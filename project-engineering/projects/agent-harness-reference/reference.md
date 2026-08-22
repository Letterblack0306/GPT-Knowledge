# DeepSeek Agent Harness — Architecture Reference

## Source

- Stephen G. Pope, YouTube: `https://www.youtube.com/watch?v=Hpw4fAHlHDw`
- Reference captured: 2026-08-23
- Evidence class: external architecture reference supplied by the user; not Brew runtime authority.

## Useful architecture pattern

The reference contrasts a conventional code-driven agent harness with a configuration-driven harness where selected runtime definitions can be changed without rebuilding the application.

Relevant patterns:

1. **Agent loop ownership** — the harness owns conversation state, tool execution and API payload assembly while the model decides whether to reason, call a tool, continue, or answer.
2. **Tools vs skills** — deterministic executable capabilities are distinct from model-followed procedural guidance.
3. **Validated dynamic tool registration** — a tool can be created, described by a schema/manifest, registered, and made callable without creating another reasoning authority.
4. **Live configuration** — selected definitions may be reloaded while the runtime stays active.
5. **UI extension points** — configuration may describe optional UI affordances, provided UI configuration never becomes execution or policy authority.

## Brew adoption boundary

### Adopt

- Reuse Brew's existing source-owned local-tool manifest and capability registry.
- Allow validated local-tool definitions/modules to reload without restarting the Brew process.
- Keep a single reasoning agent and canonical execution path.
- Keep tool schemas, availability and provenance truthful and inspectable.
- Treat UI extension metadata as presentation only.

### Reject

- Config-driven reasoning pipelines.
- Config-owned safety or approval policy.
- Arbitrary executable UI configuration.
- A second tool registry or second agent-loop authority.
- Self-modification that bypasses source containment, validation or execution policy.

## Brew implementation sidepoint

Brew already had the foundational mechanism before this reference was added:

- `brew/capabilities/local-tool-registry.mjs`
- source-owned `tool.json` manifests
- manifest validation
- module containment under the configured local-tools root
- cache-busted dynamic imports using module modification time
- `refreshLocalTools()` and `registerLocalTool()`

The implementation direction is therefore **extend the existing registry with live reload semantics**, not replace it with a new DeepSeek-style engine.

## Evidence labels

- `PROVEN_EXISTING`: Brew has validated source-owned local tool manifests and dynamic module imports.
- `IMPLEMENTING`: live reload/watch behavior around the existing local-tool registry.
- `REFERENCE_ONLY`: dynamic system-prompt and UI-layout mutation from the external harness. These are not automatically accepted Brew requirements.
