# GPT-Knowledge
The biggest mistake people make with ChatGPT is using vague, one-line prompts and expecting expert-level results.Here are the top 10 mistakes people make when using and prompting GPT models:Vague Prompts: Asking broad questions like "Write a marketing plan" gives the AI no direction, leading to generic and useless answers.Burying the Actual Ask: Tossing in your core question at the very end of a massive, unstructured wall of text confuses the model.Assuming It Remembers Everything: Believing the AI tracks your entire history or context from days prior without reminding it of your constraints or business details.Not Telling It What Good Looks Like: Failing to provide examples, style guidelines, tone, or formatting instructions upfront.Asking for Too Much in One Shot: Dumping a complex, multi-step project into a single prompt instead of breaking it down into smaller, manageable parts.Accepting the First Output: Treating the first response as final rather than treating it as a draft and pushing back or iterating.Ignoring Formatting Instructions: Leaving structural or length requirements (like word counts or bullet points) out until it is too late.Blindly Trusting the Facts: Believing everything the AI outputs without verifying calculations, code, or checking for hallucinations.Sharing Sensitive Information: Entering private data, passwords, or company secrets into public chat interfaces where privacy policies might expose them.Treating It Like a Search Engine: Using ultra-short, keyword-only queries instead of conversing with it like a knowledgeable assistant.
A versioned, reusable engineering knowledge base for research-backed design, development, debugging, validation, agent architecture, browser automation, local-model integration, Letterblack product design, and creative technology workflows.

## Load order
https://drive.google.com/drive/folders/1T8Hv-MUhdK34V9xM9gPRq9M1UvMF1HsI
loop test, > repo impliment > birdeye keep in watch, Gdrive memories and past, >dessision > looptooldo not drift toward single route or diffing into architecture. gpt-k has all the refrences no assumption allowed

Always begin with [`000_START_HERE.md`](000_START_HERE.md).001_MEMORY_DECISION_SUPPORT.md  When prior plans, decisions, rejected ideas, unfinished work, or historical contradictions may materially affect a decision, route through [`001_MEMORY_DECISION_SUPPORT.md`](001_MEMORY_DECISION_SUPPORT.md). Then use [`knowledge-index.json`](knowledge-index.json) for deterministic file/domain routing, [`knowledge-sections.json`](knowledge-sections.json) when a trigger maps to a stable section, or [`INDEX.md`](INDEX.md) as the human-readable companion.

Do not preload every domain. Knowledge guides decisions; it does not replace live workspace or runtime inspection.

## Letterblack MCP ecosystem entry point

Use [`project-engineering/letterblack-mcp-ecosystem-and-routing.md`](project-engineering/letterblack-mcp-ecosystem-and-routing.md) when a task needs to determine **which component should be used and which source owns the truth**.

Current validated client direction:
{
  "schema_version": 1,
  "purpose": "Curated machine-readable catalogue of real upstream agent repositories used as implementation references. Not project status, memory, or runtime authority.",
  "maintenance": {
    "human_index": "GPT_Ref/GPT_REF.md",
    "scope_contract": "GPT_Ref/README.md",
    "validator": "scripts/validate-gpt-ref-catalog.mjs"
  },
  "references": [
    {
      "id": "openai-codex",
      "name": "OpenAI Codex",
      "repository": "openai/codex",
      "url": "https://github.com/openai/codex",
      "default_branch": "main",
      "status": "active",
      "primary_uses": [
        "execution-runtime",
        "typed-events",
        "approvals",
        "sandbox",
        "tool-execution",
        "validation",
        "cancellation",
        "session-turn-item-lifecycle"
      ],
      "adopt": "Separation of model-authored messages from runtime/tool/approval/completion state.",
      "avoid": "Do not copy the complete runtime when only a lifecycle or execution-boundary pattern is needed.",
      "gptk_studies": [
        "ai-agents/studies/codex-execution-validation.md",
        "ai-agents/studies/exact-agent-feature-reference-chain-2026-09-20.md"
      ]
    },
    {
      "id": "cline",
      "name": "Cline",
      "repository": "cline/cline",
      "url": "https://github.com/cline/cline",
      "default_branch": "main",
      "status": "active",
      "primary_uses": [
        "provider-adapters",
        "model-turn-semantics",
        "tool-use-loop",
        "empty-response-handling",
        "model-capabilities",
        "agent-runtime",
        "team-sessions"
      ],
      "adopt": "Centralized provider/model result semantics, host-owned runtime construction, and explicit team/session lifecycle.",
      "avoid": "Do not create a second provider subsystem when the target already has one canonical owner.",
      "gptk_studies": [
        "ai-agents/cline-runtime-reuse-for-governed-agent-infrastructure.md",
        "ai-agents/studies/exact-agent-feature-reference-chain-2026-09-20.md"
      ]
    },
    {
      "id": "hermes-agent",
      "name": "Hermes Agent",
      "repository": "NousResearch/hermes-agent",
      "url": "https://github.com/NousResearch/hermes-agent",
      "default_branch": "main",
      "status": "active",
      "primary_uses": [
        "persistent-agent-loop",
        "messaging-gateways",
        "memory",
        "skills",
        "toolsets",
        "mcp",
        "channel-continuity",
        "tool-call-persistence"
      ],
      "adopt": "One agent core across channels, persistent turn orchestration, and progressive loading of memory, skills, and integrations.",
      "avoid": "Do not let gateway, memory, skills, or delegated work become a second untracked authority. Preserve working team/subagent features but keep parent/session ownership explicit.",
      "gptk_studies": [
        "ai-agents/studies/hermes-memory-skills-agent-loop.md",
        "ai-agents/studies/exact-agent-feature-reference-chain-2026-09-20.md"
      ]
    },
    {
      "id": "openhands",
      "name": "OpenHands Agent Canvas",
      "repository": "OpenHands/OpenHands",
      "url": "https://github.com/OpenHands/OpenHands",
      "default_branch": "main",
      "status": "active",
      "primary_uses": [
        "agent-canvas",
        "control-center",
        "backend-selection",
        "frontend-agent-client",
        "local-stack-orchestration"
      ],
      "adopt": "Use for the user-facing control-center boundary, backend selection, and client orchestration.",
      "avoid": "Do not treat OpenHands/OpenHands as the canonical agent/tool/conversation/workspace runtime owner; those implementations live in OpenHands/software-agent-sdk.",
      "gptk_studies": [
        "ai-agents/studies/openhands-autonomous-swe-runtime.md",
        "ai-agents/studies/exact-agent-feature-reference-chain-2026-09-20.md"
      ]
    },
    {
      "id": "openhands-software-agent-sdk",
      "name": "OpenHands software-agent-sdk",
      "repository": "OpenHands/software-agent-sdk",
      "url": "https://github.com/OpenHands/software-agent-sdk",
      "default_branch": "main",
      "status": "active",
      "primary_uses": [
        "autonomous-swe-runtime",
        "action-observation",
        "conversation-runtime",
        "workspace-abstraction",
        "lifecycle-state",
        "confirmation-policy",
        "agent-server"
      ],
      "adopt": "Use as the canonical OpenHands implementation reference for agents, tools, conversations, workspaces, events, security/confirmation, and the Agent Server API.",
      "avoid": "Do not confuse Agent Canvas frontend behavior with this runtime owner, and do not import the complete runtime when only a narrow action/observation or workspace contract is needed.",
      "gptk_studies": [
        "ai-agents/studies/openhands-autonomous-swe-runtime.md",
        "ai-agents/studies/exact-agent-feature-reference-chain-2026-09-20.md"
      ]
    },
    {
      "id": "aider",
      "name": "Aider",
      "repository": "Aider-AI/aider",
      "url": "https://github.com/Aider-AI/aider",
      "default_branch": "main",
      "status": "active",
      "primary_uses": [
        "repository-cognition",
        "repo-map",
        "git-aware-editing",
        "selective-context",
        "context-budgeting"
      ],
      "adopt": "Repository mapping and selective context expansion before edits.",
      "avoid": "Do not equate repository awareness with file authority or load the whole repository into context.",
      "gptk_studies": [
        "ai-agents/studies/aider-repository-cognition.md",
        "ai-agents/studies/exact-agent-feature-reference-chain-2026-09-20.md"
      ]
    },
    {
      "id": "lobehub",
      "name": "LobeHub",
      "repository": "lobehub/lobehub",
      "url": "https://github.com/lobehub/lobehub",
      "default_branch": "canary",
      "status": "active",
      "primary_uses": [
        "provider-registry",
        "model-registry",
        "configuration",
        "knowledge",
        "mcp",
        "integrations",
        "readiness"
      ],
      "adopt": "Separate provider/model metadata, configuration, capability, readiness, and integration lifecycle.",
      "avoid": "Do not treat configured state as runtime readiness.",
      "gptk_studies": [
        "ai-agents/studies/lobehub-provider-integration-architecture.md",
        "ai-agents/studies/lobehub-agent-skills-system.md",
        "ai-agents/studies/exact-agent-feature-reference-chain-2026-09-20.md"
      ]
    },
    {
      "id": "openclaw",
      "name": "OpenClaw",
      "repository": "openclaw/openclaw",
      "url": "https://github.com/openclaw/openclaw",
      "default_branch": "main",
      "status": "active",
      "primary_uses": [
        "gateway",
        "control-plane",
        "multi-surface-access",
        "session-continuity",
        "transport-boundaries",
        "run-ownership",
        "terminal-receipts"
      ],
      "adopt": "Keep session/agent identity independent from CLI, UI, browser, or messaging transports.",
      "avoid": "Do not let channel clients become separate reasoning authorities.",
      "gptk_studies": [
        "ai-agents/reference-derived-agent-architecture.md",
        "ai-agents/studies/agent-harness-reference-sources-2026-09-08.md",
        "ai-agents/studies/exact-agent-feature-reference-chain-2026-09-20.md"
      ]
    },
    {
      "id": "agent-zero",
      "name": "Agent Zero",
      "repository": "agent0ai/agent-zero",
      "url": "https://github.com/agent0ai/agent-zero",
      "default_branch": "main",
      "status": "active",
      "primary_uses": [
        "general-agent-runtime",
        "tools",
        "extensibility",
        "local-agent-experimentation"
      ],
      "adopt": "Use as a comparative implementation reference for extensibility and local-agent patterns.",
      "avoid": "Do not treat it as a default target architecture without checking ownership and lifecycle fit.",
      "gptk_studies": [
        "ai-agents/reference-derived-agent-architecture.md",
        "ai-agents/studies/exact-agent-feature-reference-chain-2026-09-20.md"
      ]
    },
    {
      "id": "gemini-cli",
      "name": "Gemini CLI",
      "repository": "google-gemini/gemini-cli",
      "url": "https://github.com/google-gemini/gemini-cli",
      "default_branch": "main",
      "status": "active",
      "primary_uses": [
        "browser-agent",
        "browser-session-lifecycle",
        "isolated-browser-tools",
        "tool-scheduler",
        "policy",
        "confirmation",
        "local-agent-executor",
        "gemini-native-cli"
      ],
      "adopt": "Use the browser-agent definition/factory/invocation/manager chain for browser-specialized agents, and the scheduler/policy/confirmation chain for tool execution.",
      "avoid": "Do not copy Gemini-specific model assumptions into provider-neutral layers; preserve the architectural seams rather than provider-specific defaults.",
      "gptk_studies": [
        "ai-agents/provider-neutral-agent-auth-and-model-routing.md",
        "ai-agents/studies/exact-agent-feature-reference-chain-2026-09-20.md"
      ]
    },
    {
      "id": "deepseek-harness",
      "name": "DeepSeek Harness",
      "repository": "deepseek-ai/deepseek-harness",
      "url": "https://github.com/deepseek-ai/deepseek-harness",
      "default_branch": "master",
      "status": "active",
      "primary_uses": [
        "agent-loop",
        "tool-scheduling",
        "browser-use-capability",
        "computer-use-capability",
        "subagent-lifecycle",
        "skills",
        "harness-seams"
      ],
      "adopt": "Use explicit package/service seams for the agent loop, ordered tool scheduling, browser/computer capability registration, subagent lifecycle, and skills.",
      "avoid": "Do not treat every plugin seam as a reason to fragment an existing target owner. Use the harness to make ownership explicit, not to create duplicate authority.",
      "gptk_studies": [
        "ai-agents/studies/agent-harness-reference-sources-2026-09-08.md",
        "ai-agents/studies/exact-agent-feature-reference-chain-2026-09-20.md"
      ]
    },
    {
      "id": "antigravity-cli",
      "name": "Google Antigravity CLI",
      "repository": "google-antigravity/antigravity-cli",
      "url": "https://github.com/google-antigravity/antigravity-cli",
      "default_branch": "main",
      "status": "active",
      "verified_revision": "7bb195acaec9e7788df5210d0dc3e15f3cefc6b3",
      "primary_uses": [
        "terminal-agent-ui",
        "persistent-history",
        "artifact-review",
        "permissions",
        "subagents",
        "background-tasks",
        "remote-control",
        "status-projection",
        "headless-mode",
        "mcp",
        "skills",
        "hooks",
        "plugins"
      ],
      "adopt": "Use its terminal projection, statusline/state projection, review/rewind, background-task, subagent, and permission interaction patterns while keeping target authority owners explicit.",
      "avoid": "The public repository does not contain the complete production core. Do not infer unavailable implementation internals from README/changelog examples; use official product docs for product behavior and the public repo only where source is actually present.",
      "gptk_studies": [
        "ai-agents/studies/exact-agent-feature-reference-chain-2026-09-20.md"
      ]
    },
    {
      "id": "claude-code",
      "name": "Claude Code",
      "repository": "anthropics/claude-code",
      "url": "https://github.com/anthropics/claude-code",
      "default_branch": "main",
      "status": "active",
      "verified_revision": "7974a70773fa229e4cc65aa1b356cc21f5c216c4",
      "primary_uses": [
        "cli",
        "interactive-agent-ui",
        "permissions",
        "hooks",
        "skills",
        "plugins",
        "mcp",
        "subagents",
        "agent-teams",
        "background-agents",
        "worktrees",
        "headless-json",
        "remote-control",
        "project-instructions"
      ],
      "adopt": "Use exact tool/permission names, project instruction scoping, hook lifecycle, subagent/team configuration, background-agent controls, and interactive CLI ergonomics where they fit the target owner.",
      "avoid": "The public repository is not a complete mirror of all production core internals. Product behavior should be anchored to official Claude Code docs and only source-backed extension/mod/plugin claims should be treated as repository implementation evidence.",
      "gptk_studies": [
        "ai-agents/studies/exact-agent-feature-reference-chain-2026-09-20.md"
      ]
    },
    {
      "id": "opencode",
      "name": "OpenCode",
      "repository": "anomalyco/opencode",
      "url": "https://github.com/anomalyco/opencode",
      "default_branch": "dev",
      "status": "active",
      "verified_revision": "ebb7b76eca82342642c78645109e865614533827",
      "primary_uses": [
        "cli",
        "tui",
        "desktop",
        "provider-registry",
        "model-registry",
        "tool-registry",
        "permissions",
        "agents",
        "subagents",
        "sessions",
        "mcp",
        "plugins",
        "skills",
        "lsp",
        "remote-attach",
        "web-server",
        "workspace-ui",
        "diff-ui"
      ],
      "adopt": "Use its explicit CLI/TUI/runtime separation, provider/model routing, permission-gated tool registry, session/child-session projection, remote attach/server surfaces, and runtime-vs-TUI configuration split.",
      "avoid": "Do not transplant OpenCode's runtime authority wholesale into a target that already owns authorization, execution, receipts, persistence, validation, or completion. Reuse presentation and registry seams without duplicating target authority.",
      "gptk_studies": [
        "ai-agents/studies/exact-agent-feature-reference-chain-2026-09-20.md"
      ]
    }
  ]
}
```text
Codex / Cline / OpenCode / Gemini / Antigravity / Claude
                            │
                            └──> BirdEye MCP
                                  ├── workspace query
                                  ├── memory query
                                  └── skills query

Skills
  -> canonical curated reasoning/workflow corpus
  -> skill-gallery-router may guide where to look
  -> actual curated retrieval uses BirdEye MCP skills(query/fetch/status)

GPT-Knowledge
  -> durable project/method/status/reference projection and routing

BirdEye MCP
  -> consolidated client-facing Letterblack MCP route
  -> current local evidence/index
  -> GPT-Knowledge route/read access
  -> Memory query/read access
  -> consolidated Skills retrieval
  -> workspace/revision identity
  -> governed local execution
  -> EYES/derived query health where active

Memory
  -> canonical historical conversations/messages/provenance
  -> accessed through BirdEye in the validated client topology

GitHub
  -> canonical remote repository/branch/commit/PR/check truth

Runtime / Browser / Provider
  -> live behavior proof
```

The validated MCP Local architecture reports **53 required PASS / 0 FAIL** and keeps BirdEye as the consolidated enabled Letterblack MCP route for the checked clients. Duplicate direct Memory routes, separate Skills routes, broad filesystem bypasses, and legacy competing MCP routes are absent or disabled.

BirdEye may expose a capability without becoming the canonical owner of the underlying source. Memory remains the historical owner, Skills remain the curated methodology/content owner, GPT-Knowledge remains the durable project/method projection owner, and GitHub remains remote repository truth.

## Purpose

This repository stores reusable knowledge rather than project-specific implementation details.

```text
Research
→ extract universal principles
→ consolidate overlapping methods
→ document evidence and applicability
→ apply to a project
→ validate in runtime
→ promote reusable lessons back here
```

## Agent engineering entry point

Use [`ai-agents/unified-agent-engineering-methods.md`](ai-agents/unified-agent-engineering-methods.md) as the **single canonical agent-engineering guide**.

It consolidates techniques learned from Aider, Claude Code, Codex, Hermes, LobeHub, OpenHands, and the existing cross-project studies into problem-driven methods for:

- repository cognition and structural discovery;
- hypothesis-driven debugging;
- controlled execution and approvals;
- runtime/user-visible validation;
- duplicate-authority and regression scanning;
- state, memory, skills, and checkpoints;
- providers, models, tools, MCP, and integrations;
- autonomous action/observation loops;
- recovery, retry, and completion evidence.

The canonical rule is **method first, source second**. Diagnose the actual failure or requirement, choose the appropriate method from the unified guide, then consult a source-specific study only when concrete implementation detail is useful.

Documents under `ai-agents/studies/`, `ai-agents/cli-agent-reference-study-map.md`, and `ai-agents/reference-derived-agent-architecture.md` remain research provenance and implementation references. They are not competing operating modes.

### Curated upstream agent references

Use [`GPT_Ref/GPT_REF.md`](GPT_Ref/GPT_REF.md) when the task needs a **real upstream agent repository** to compare against before implementing or redesigning a subsystem. `GPT_Ref` is deliberately narrow: it contains the human catalogue, the machine-readable [`agent-references.json`](GPT_Ref/agent-references.json), and its maintenance contract only.

Do not place project status, Brew reports, memory, copied source, research transcripts, or arbitrary documents in `GPT_Ref/`. Long-form comparative research belongs under `ai-agents/studies/`; project-specific truth belongs under the relevant project namespace; live truth belongs in the current workspace/runtime.

For Letterblack debugging involving authority, guards, policy, proof, blocked actions, or completion boundaries, selectively load [`ai-agents/letterblack-governance-debugging-references.md`](ai-agents/letterblack-governance-debugging-references.md). It routes to [LBE Core](https://github.com/Letterblack0306/LetterBlack-LBE-Core) for governed execution boundaries and [LB Guards & Rules](https://github.com/Letterblack0306/LB_Guards_Rules) for workspace trust, guard contracts, and current-HEAD proof. It is optional and must not be preloaded for unrelated debugging.

## Letterblack branding entry point

Use [`letterblack-branding/industrial-dark-ui-system.md`](letterblack-branding/industrial-dark-ui-system.md) as the canonical Letterblack product UI/branding guide. It defines the Industrial Dark palette, typography, density, cockpit layout, state semantics, interaction behavior, component language, icon rules, and evidence-aware UI principles.

Use [`letterblack-branding/ui-screen-system.md`](letterblack-branding/ui-screen-system.md) when screen families or the operational component vocabulary are needed. Use [`letterblack-branding/adobe-ai-generations-ui-reference.md`](letterblack-branding/adobe-ai-generations-ui-reference.md) only when inspecting reusable UI/token/icon patterns from `Adobe_AI_Generations-04`; that repository is a reference implementation, not canonical brand truth.

## Browser knowledge entry point

Use [`browser-agents/browser-access-tooling-and-evidence.md`](browser-agents/browser-access-tooling-and-evidence.md) for browser transports, target identity, inspect/action/capture tools, DOM annotation, host-browser trust bridges, screenshots, evidence, lifecycle, permissions, and validation.

## Local-model knowledge entry point

Use [`local-models/lm-studio-runtime-and-agent-integration.md`](local-models/lm-studio-runtime-and-agent-integration.md) for LM Studio server configuration, authentication, model discovery and lifecycle, stateful chats, tool calling, structured output, MCP controls, multi-machine proxy routing, performance tuning, and provider health evidence.

When agent-side provider routing, health, permissions, recovery, or validation is involved, pair it with the unified agent-engineering guide rather than loading a provider-project study directly.

## Motion-design entry point

Use [`motion-design/house-style.md`](motion-design/house-style.md) as the default starting point for motion-design and video-composition work when project-specific direction is not available. Project-specific brand direction takes precedence.

## Current knowledge domains

- `GPT_Ref/` — curated external agent-repository catalogue only; validated against a machine-readable manifest and strict folder scope.
- `ai-agents/` — unified agent engineering methods plus source-specific research provenance and selective Letterblack governance/debugging references.
- `letterblack-branding/` — canonical Industrial Dark Letterblack UI branding, operational screen system, UI/icon reference catalogue.
- `browser-agents/` — browser access models, CDP and connector patterns, target management, browser tools, security, screenshots, and verification.
- `local-models/` — local-provider runtimes, model lifecycle, inference configuration, health checks, tool calling, structured output, and multi-machine routing.
- `ui-engineering/` — validated runtime UI integration and shell behavior.
- `motion-design/` — canonical creative direction, palettes, composition patterns, motion systems, captions, and visual styles.

## Knowledge quality rules

Every durable knowledge entry should identify, where applicable:

- source;
- confidence;
- verification status or review date;
- applicability;
- limitations;
- related evidence.

Claims must remain bounded to what has actually been researched or proven. Upstream reference projects evolve, so source-specific details must be revalidated before being treated as current implementation truth.
