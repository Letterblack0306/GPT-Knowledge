# Knowledge Router

`knowledge-index.json` is the canonical machine-readable routing manifest. This file is the human-readable companion.

Use the smallest relevant knowledge set. Do not preload every domain.

## Browser or CDP work

Load:

- `browser-agents/browser-access-tooling-and-evidence.md`
- `ui-engineering/runtime-accessibility-and-shell-integration.md` when UI/runtime wiring is involved
- `local-models/lm-studio-runtime-and-agent-integration.md` only when the provider is LM Studio

Skip motion-design and branding domains unless the task explicitly involves them.

## Agent architecture, debugging, tooling, or execution

Load one canonical guide first:

- `ai-agents/unified-agent-engineering-methods.md`

This guide consolidates repository cognition, debugging, execution, approvals, validation, memory, skills, provider/tool integration, autonomous runtime behavior, recovery, and completion methods.

**Do not select a method by upstream repository name.** Classify the actual failure or requirement, choose the appropriate method from the unified guide, then inspect source-specific research only when concrete implementation detail is needed.

Source-specific notes under `ai-agents/studies/` and `ai-agents/cli-agent-reference-study-map.md` are research provenance, not primary operating routes.

### Letterblack governance/debugging route

Load `ai-agents/letterblack-governance-debugging-references.md` only when the proven failure involves execution authority, policy boundaries, workspace guards, current-HEAD proof, blocked actions, completion claims, or governance behavior.

That reference routes selectively to:

- **LBE Core** — https://github.com/Letterblack0306/LetterBlack-LBE-Core — execution-boundary/controller/adapter/host authority and governed proof.
- **LB Guards & Rules** — https://github.com/Letterblack0306/LB_Guards_Rules — workspace trust, guard contracts, policy profiles, and proof bound to the active Git `HEAD`.

Do not preload either repository for ordinary debugging. First classify the failure and inspect the live project/runtime; consult the relevant governance repository only when that boundary is actually implicated.

### Examples

```text
Wrong file / duplicate implementation
  -> unified guide
  -> repository cognition + active-owner tracing

Unknown bug cause
  -> unified guide
  -> evidence capture + hypothesis-driven diagnosis

Tests pass but feature fails
  -> unified guide
  -> active-path tracing + runtime/user-visible validation

Repeated or unsafe execution
  -> unified guide
  -> operation identity + authority + retry/idempotency analysis
  -> Letterblack governance reference only if LBE/guards own the boundary

Provider/tool appears configured but does not work
  -> unified guide
  -> capability/health/permission validation

Guard blocks commit/push/DONE or proof looks stale
  -> unified guide
  -> Letterblack governance debugging reference
  -> LB Guards & Rules current guard/profile/proof path

Agent action is allowed/denied/incomplete unexpectedly
  -> unified guide
  -> Letterblack governance debugging reference
  -> LBE Core current controller/adapter/host path

Agent reports done too early
  -> unified guide
  -> completion predicate + evidence ladder
```

Only after choosing the method should a source implementation be consulted, for example Aider for repo-map implementation ideas, Claude Code for interactive investigation patterns, Codex for execution/approval patterns, Hermes for persistence/skills, LobeHub for provider/knowledge registries, or OpenHands for event-driven autonomous runtime patterns.

## LM Studio or local-provider work

Load:

- `local-models/lm-studio-runtime-and-agent-integration.md`
- `ai-agents/unified-agent-engineering-methods.md` when provider health, capability routing, tool execution, recovery, or validation behavior is involved

## Letterblack product UI / branding

Start with:

- `letterblack-branding/industrial-dark-ui-system.md`

Then load only what the task needs:

- screen families, cockpit composition, component vocabulary -> `letterblack-branding/ui-screen-system.md`
- reusable CSS/token patterns or icon catalogue from Adobe AI Generations -> `letterblack-branding/adobe-ai-generations-ui-reference.md`
- runtime shell/accessibility integration -> `ui-engineering/runtime-accessibility-and-shell-integration.md`

The Letterblack branding guide is canonical. `Adobe_AI_Generations-04` is a reference implementation and asset source; it does not override the canonical guide.

## UI engineering

Load:

- `ui-engineering/runtime-accessibility-and-shell-integration.md`
- `letterblack-branding/industrial-dark-ui-system.md` only for Letterblack-branded products
- project-specific design guidance when present

## Motion design

Load:

- `motion-design/house-style.md`
- only the linked palette, production, pattern, visual-style, or data-in-motion documents needed for the current deliverable

Project-specific `design.md` takes precedence over house style.

## Selection rules

- Prefer `knowledge-index.json` for deterministic routing.
- Prefer one canonical entry document per active domain.
- For agent work, choose methods by failure class and evidence, not by source repository.
- Load the Letterblack governance debugging reference only when authority, policy, guard, or proof boundaries are implicated.
- Source-specific studies are optional provenance and implementation references.
- Do not load the Adobe UI reference for every Letterblack UI task; use it only when source patterns or icons are relevant.
- Stop loading when enough knowledge exists to inspect and reason about the live project.
- When documents conflict with runtime evidence, runtime evidence wins.
- If routing is uncertain, inspect the project first instead of broad-loading knowledge.

## Typical routes

```text
Repository bug / debugging
  -> ai-agents/unified-agent-engineering-methods.md
  -> classify failure
  -> choose diagnostic method
  -> inspect live repository/runtime
  -> governance reference only if authority/guards/proof are involved
  -> source-specific study only if implementation detail is needed

Agent architecture
  -> ai-agents/unified-agent-engineering-methods.md
  -> choose methods/contracts required by the actual system

Letterblack UI design
  -> letterblack-branding/industrial-dark-ui-system.md
  -> ui-screen-system.md only when screen/layout design is needed
  -> adobe-ai-generations-ui-reference.md only for existing UI/icon patterns

Browser UI audit
  -> browser-agents
  -> ui-engineering
  -> letterblack-branding only when the product is Letterblack-branded
  -> Letterblack governance reference only if a browser action is being blocked/governed or proof boundaries are involved

Motion graphics deliverable
  -> motion-design/house-style
  -> only the required optional motion document
```
