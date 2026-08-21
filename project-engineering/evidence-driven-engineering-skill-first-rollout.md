# Evidence-Driven Engineering — Skill-First Rollout

## Current decision

The active delivery form is the installed/reusable Skill architecture.

The previously designed Letterblack Engineering App/MCP architecture is preserved as a future integration path, not discarded.

```text
ACTIVE DELIVERY
= SKILL-FIRST

FUTURE DELIVERY
= SKILL + APPS/MCP

GOVERNING METHOD
= evidence-driven-engineering

PLUGIN / APP INSTALLATION
= DEFERRED
```

## Canonical Skill package

Source:

`skills/evidence-driven-engineering/SKILL.md`

Role:

- governing investigation router;
- evidence classification discipline;
- specialist-skill selection;
- repository-first durable change rule;
- bounded local execution routing;
- staged regression / live acceptance;
- current-position synchronization.

## Preserved future architecture

Do not rewrite this architecture when ChatGPT private/custom App installation becomes available for the active account/workspace.

```text
Letterblack Engineering
├── Skills
│   ├── evidence-driven-engineering
│   └── specialist Skills
└── Apps
    ├── GPT-Knowledge
    ├── Repository/BirdEye
    └── LoopTool/Access
```

The future App layer remains an adapter over existing owners.

It must not become:

- a second project-state database;
- a second knowledge index;
- a replacement for GitHub authority;
- a replacement for BirdEye local evidence;
- a replacement for LoopTool/runtime evidence;
- an arbitrary shell bridge.

## Existing MCP work

The read-only GPT-Knowledge MCP foundation remains useful future infrastructure and should not be removed simply because the current delivery mode is Skill-first.

Existing intended read tools:

- `project_status`
- `project_plan`
- `search`
- `fetch`

Future App work should resume from the existing capability map and protocol acceptance state rather than rebuilding the integration.

Canonical references:

- `project-engineering/evidence-driven-engineering-plugin-contract.md`
- `project-engineering/gpt-knowledge-chatgpt-app-mcp-capability-map.md`
- `project-engineering/repository-first-change-and-debug-rule.md`

## Durable change rule

All useful source, test, Skill, documentation, configuration, or other durable project changes must be created/patched through the authoritative repository first.

```text
prove need
→ repository patch/create
→ commit SHA + diff
→ local fast-forward
→ local validation
→ classify
```

Disposable build outputs, caches and temporary diagnostics are not durable project state.

## Skill execution model

The Skill must degrade gracefully according to available capabilities.

If repository access is available:
- inspect canonical source and make authorized durable changes there.

If BirdEye is available:
- use it for local workspace/revision/index evidence.

If direct LoopTool/local execution is available:
- run the bounded validation directly.

If direct local execution is unavailable:
- provide one bounded command envelope and classify the returned evidence.

If the future GPT-Knowledge App is available:
- use it for direct project status/plan/knowledge reads without changing evidence authority.

Do not pretend an unavailable capability was used.

## Current position

```text
EVIDENCE-DRIVEN ENGINEERING METHOD
= CANONICAL

SKILL PACKAGE
= SOURCE_IMPLEMENTED

REPOSITORY-FIRST CHANGE RULE
= CANONICAL

READ-ONLY GPT-K MCP FOUNDATION
= PRESERVED FOR FUTURE APP INTEGRATION

APP INSTALLATION
= DEFERRED

NEXT SKILL GATE
= validate/install the compiled Skill in the supported Skill environment and run behavioral acceptance cases
```
