# Knowledge Router

Use this file to choose the smallest relevant knowledge set. Do not preload every domain.

## Browser or CDP work

Load:

- `browser-agents/browser-access-tooling-and-evidence.md`
- `ui-engineering/runtime-accessibility-and-shell-integration.md` when UI/runtime wiring is involved
- `local-models/lm-studio-runtime-and-agent-integration.md` only when the provider is LM Studio

Skip motion-design and creative domains unless the task explicitly involves them.

## Agent architecture or tooling

Load:

- `ai-agents/reference-derived-agent-architecture.md`
- relevant browser or local-model documents only when those systems are actually involved

## LM Studio or local-provider work

Load:

- `local-models/lm-studio-runtime-and-agent-integration.md`
- `ai-agents/reference-derived-agent-architecture.md` only when tool calling, sessions, approvals, memory, or orchestration are in scope

## UI engineering

Load:

- `ui-engineering/runtime-accessibility-and-shell-integration.md`
- project-specific design guidance when present

Load motion-design knowledge only for animation, timing, typography, visual rhythm, transitions, or video composition.

## Motion design

Load:

- `motion-design/house-style.md`
- only the linked palette, composition, typography, transition, caption, or motion documents needed for the current deliverable

Project-specific `design.md` takes precedence over house style.

## Selection rules

- Prefer one canonical entry document per active domain.
- Follow linked documents only when the current task needs their detail.
- Do not load a domain because a nearby file name sounds relevant.
- Stop loading when enough knowledge exists to inspect and reason about the live project.
- When documents conflict with runtime evidence, runtime evidence wins and the contradiction should be recorded.

## Typical routes

```text
Browser UI audit
  -> browser-agents
  -> ui-engineering
  -> local-models only when LM Studio behavior is involved

Provider troubleshooting
  -> local-models
  -> ai-agents only for tool/session behavior

Motion graphics deliverable
  -> motion-design/house-style
  -> selected palette/composition/typography documents

Generic repository bug
  -> inspect project first
  -> load a domain only after the failing subsystem is identified
```
