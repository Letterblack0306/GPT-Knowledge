# Runtime Accessibility and Shell Integration

## Purpose

A UI is not validated merely because syntax checks and smoke tests pass. Runtime accessibility must be proven in the actual application window: navigation must respond, panels must remain reachable, layout regions must not overlap controls, and post-render enhancement code must not create feedback loops.

## Proven failure patterns

### 1. Global mutation observers can freeze interaction

A `MutationObserver` attached to `document.body` or `document.documentElement` with `subtree: true` can become self-triggering when its callback writes to the DOM. Repeated `textContent`, attribute, or class updates produce new mutations, causing a continuous render loop that starves pointer events.

Use narrowly scoped observers and write only when the value changes:

```js
function setText(node, value) {
  if (!node) return;
  const next = String(value ?? '');
  if (node.textContent !== next) node.textContent = next;
}

const observer = new MutationObserver(sync);
for (const target of [provider, browser, agentStatus, browserResult]) {
  if (target) {
    observer.observe(target, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }
}
```

Do not observe the whole document for a local status-card update.

### 2. Post-render grouping must preserve authoritative handlers

When consolidating modules into tabs or grouped surfaces, do not duplicate functional controls. Proxy buttons should call the existing authoritative controls or APIs. Duplicate IDs or cloned control trees create ambiguous ownership and break event contracts.

Preferred pattern:

```js
proxyButton.addEventListener('click', () => authoritativeButton?.click());
```

Use this only when the authoritative element remains mounted and unique.

### 3. CSS can override the HTML `hidden` attribute

A component rule such as:

```css
.rail-tab { display: grid; }
```

can defeat the browser's default `[hidden] { display: none; }` behavior. Add an explicit rule:

```css
.rail-tab[hidden] { display: none !important; }
```

For stable navigation filtering, identify buttons by module ID (`data-window`, `data-module-id`) rather than matching visible labels.

### 4. Tests must assert the intended contract, not stale ordering

When the navigation model changes intentionally, update every order assertion in the corresponding layout test. Do not change production layout solely to satisfy an obsolete expectation. Conversely, do not weaken tests until the new information architecture is explicitly defined.

### 5. Branch provenance matters

UI changes rebuilt on an old branch can silently drop already-proven renderer, event-store, or runtime fixes. Before implementation:

1. identify the locally validated base commit;
2. push that exact base branch;
3. create the UI branch from that commit;
4. compare branches and verify the UI branch is a strict descendant;
5. change only the intended UI-layer files.

## Reference map for agent-product UI sections

When building or repairing an agent-product UI, use upstream references by the actual UI area being implemented. Do not wait for the upstream project name to be mentioned.

| UI section / product area | Reference source | What to study | Typical target behavior |
| --- | --- | --- | --- |
| Workspace / project selector | DeepSeek Harness | explicit workspace selection, readiness gating, selected-workspace visibility | user cannot start workspace-bound work against an unknown/unready workspace |
| AI Providers | DeepSeek Harness + Hermes | runtime provider/model configuration, switching, status projection | current provider/model/config is visible and changes use the active runtime owner |
| Model Routing / Fallback | Hermes + DeepSeek Harness | provider-neutral model selection and runtime switching | routing reflects runtime truth instead of hard-coded model assumptions |
| Telegram / Messaging | Hermes + OpenClaw | gateway integration status, messaging onboarding, platform-specific health | configured/reachable/authenticated/healthy state is visible without creating a second agent |
| Connectors / Integrations | Hermes | integrations hub, per-integration status, migration/import patterns | connector lifecycle and health are visible and tied to the authoritative runtime integration |
| Integration Lifecycle | Hermes + OpenClaw | setup/onboarding, connect/disconnect, migration, gateway lifecycle | lifecycle state is explicit and recoverable |
| Runtime / Diagnostics | DeepSeek Harness + Hermes | runtime readiness, approvals, gateway/platform status | operator can see whether the runtime is ready, blocked, awaiting approval, or unhealthy |
| Safety / Approvals | DeepSeek Harness | user-visible approval boundary and blocked-operation feedback | approval state is visible and actions remain governed |
| Memory / Skills / Context | Hermes | separation of memory, skills/procedures, project context and integrations | UI does not collapse distinct persistence/knowledge concepts into one ambiguous surface |
| Setup / Onboarding | OpenClaw | local-first installation, setup and gateway composition | first-run flow establishes required runtime/configuration state before normal use |
| Advanced JSON / Raw Config | Hermes + DeepSeek Harness | truthful runtime/config projection | raw/advanced views reflect real backend state and keep secrets redacted |
| Status cards / health indicators | Hermes | platform-specific status separated from configuration | configured != reachable != authenticated != healthy |

For detailed comparative notes, load:

- `ai-agents/studies/agent-harness-reference-sources-2026-09-08.md`
- `ai-agents/studies/hermes-memory-skills-agent-loop.md` when memory/skills/persistence behavior is in scope

### Active UI-use rule

For a concrete UI gap:

```text
identify the current UI section
  -> identify its backend/runtime owner
  -> select the matching reference row above
  -> inspect only that upstream pattern
  -> adapt the smallest useful behavior
  -> validate UI -> API -> runtime -> visible result
```

The reference is a design/implementation aid, not authority. Current product source/runtime remains authoritative.

## Validation sequence

Run structural validation first:

```text
syntax checks
fast-fail contracts
workspace contracts
agent/runtime smoke tests
layout smoke tests
```

Then perform runtime interaction proof:

1. Launch the application.
2. Click every primary navigation destination.
3. Verify nested tabs.
4. Verify Explorer content loads.
5. Verify Browser/Agent controls invoke authoritative handlers.
6. Verify Git list and diff do not overlap.
7. Verify resizers do not cover controls.
8. Verify hidden secondary destinations are actually absent.
9. Observe CPU usage and responsiveness to detect mutation loops.

A passing test suite proves contract coverage. It does not prove usability.

## Navigation consolidation rule

Group secondary diagnostic surfaces under one primary destination, but keep their modules registered and reachable for runtime and fast-fail contracts. Hide secondary rail entries by stable module IDs rather than deleting modules or matching labels.

Example visible destinations:

```text
Explorer
Browser / Agent
Git
Workspace Tools
Settings
Diagnostics
```

Secondary modules such as Activity, Changes, Evidence, Runtime, Skills, and Audit may remain mounted inside grouped surfaces while their standalone rail entries are hidden.

## Evidence standard

Do not report UI completion until all three are available:

- source-level proof;
- automated validation proof;
- runtime interaction proof.
