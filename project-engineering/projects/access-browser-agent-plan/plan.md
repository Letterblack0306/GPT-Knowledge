# Access Browser Agent — What We Are Building

## Core model

Access Browser Agent is a desktop application where one local agent owns the actual reasoning, coding/development decisions, tool selection, validation, and completion truth.

The browser/provider conversation supplies natural-language instructions and receives results back. Browser/provider transport is not another reasoning agent.

```text
Browser / instruction provider
        ↓
exact-chat transport
        ↓
AgentSessionRuntime / LiveAgentCore
        ↓
provider-neutral reasoning adapter
        ↓
governed tools and capabilities
        ↓
evidence-backed result
        ↓
transport back to the same conversation
```

The project keeps one authoritative agent lifecycle.

## Provider authority model

Provider concerns are separate from Access runtime authority.

```text
Provider boundary
  ├─ provider identity
  ├─ authentication
  ├─ model discovery
  ├─ candidate readiness
  └─ explicit active-provider selection

Access runtime authority
  ├─ session / turn identity
  ├─ workspace identity
  ├─ tool execution
  ├─ browser authority
  ├─ evidence / receipts
  ├─ cancellation / waiting state
  └─ completion / failure truth
```

LM Studio remains a first-class local/private provider. Cline is reused only behind the provider boundary where that does not create competing session, tool, workspace, browser, or completion authority.

## Current verified source

- Repository: `Letterblack0306/access-browser-agent`
- Branch: `main`
- Current verified HEAD: `a553fe9e2da78ae2154c5a7b174ccacc7e12cc07`
- Application entry: `electron/rebuild-main.js`
- Active production settings UI: `electron/rebuild-settings.js`
- Active provider state owner: `electron/agent-runtime-adapter.js`
- Browser Loop readiness owner: `electron/browser-session-authority.js`

## Completed current work

### Provider-context repair

Historical tool-result amplification in a continuing durable session was fixed by bounding rehydrated historical tool-result content only in the provider-facing projection. Durable evidence, current-turn tool outputs and session identity remain preserved.

### Cline auth source/persistence repair

The duplicated Cline auth authority and stale preference-save risk were repaired through the current main history. Focused source/regression checks pass. Live auth persistence is not yet proven because the attempted supported sign-in never completed and therefore produced no credential to reload.

### Post-result continuation repair

Live evidence showed the assistant turn after Access result delivery was being detected but consumed as a delivery-response acknowledgement instead of continuing the agent loop. The current repair resolves delivery ownership and then allows that same assistant turn to continue into normal instruction execution. Regression coverage preserves `newSession:false` and restart fail-closed behavior.

Current classification: **source/regression proven; definitive current-live A → result → B acceptance still open**.

## Current active defect

### Test READY changes live provider without explicit activation

The production settings UI has always contained this behavior since the first canonical Access repository snapshot:

```text
Active provider A
    ↓
Test READY provider B
    ↓
providerConfigure(B, persist:false)
    ↓
AgentRuntimeAdapter._installProvider(B)
    ↓
live provider becomes B
    ↓
durable selected provider remains A
```

`persist:false` prevents durable preference persistence, but it does not make the operation non-authoritative in memory.

This creates a split between durable selected-provider truth and live runtime provider truth.

Classification: **PROVEN_INITIAL_PROVIDER_TEST_AUTHORITY_LEAK**.

This is not a recent regression from the auth repair or continuation repair.

## Historical/reference finding

GPT-Knowledge provider-neutral and Cline-runtime guidance was added on 2026-08-13 before the current canonical Access repository baseline. It already required provider/auth/model concerns to remain behind a provider boundary while Access retains runtime authority.

Current Cline/VS Code implementation also provides a concrete comparison: provider selection is explicit configuration state, while provider-specific discovery/model enumeration is a separate operation.

Therefore Access should preserve this semantic distinction:

```text
Discover candidate
        ≠
Authenticate candidate
        ≠
Test candidate readiness
        ≠
Activate candidate
```

## Active implementation gate

Before any provider-settings patch, map the active source path:

```text
AgentRuntimeAdapter
ProviderFactory
ModelReadinessRegistry
ClineLlmsProvider
OpenAICompatibleProvider
providerReadiness()
```

Question:

> What is the smallest existing-provider-layer primitive that can test candidate provider/model B for real agent readiness without installing B as the active runtime provider when A is currently active?

Required regression contract:

```text
active provider = A
candidate provider = B
Test READY(B)
    → real completion/tool readiness evidence for B
    → active provider remains A
    → durable selected provider remains A

Use/Activate(B)
    → explicit active-provider transition to B
    → readiness truth projected
    → durable selected provider becomes B
```

The test must cover both candidate pass and candidate failure.

## Next work order

1. **P0 — Candidate provider-readiness source map**
   - Prove the correct owner and non-authoritative readiness primitive.
   - Do not patch from UI symptoms alone.

2. **P0 — Provider-test authority regression and smallest repair**
   - Test READY must not mutate active-provider authority.
   - Use/Activate remains the explicit provider switch.

3. **P0 — Current-live post-result continuation acceptance**
   - Run one bounded A → result → B cycle only after provider state is clean.
   - Require `delivery_response_resolved(B)` followed by the same B as `browser_relay.instruction_received`, local run with `newSession:false`, and no duplicate execution.

4. **P1 — Cline auth live restart persistence**
   - Requires one successful supported sign-in, durable credential creation, restart, and authenticated reload.

5. **P1 — Arbitrary process-death recovery**
   - Validate exactly-once recovery across executing, delivering and delivery-unverified boundaries.

6. **P1 — Non-complete terminal UI truth**
   - Live-accept blocked, failed, stopped and delivery-unverified states.

7. **P1 — Governance/check wording**
   - Keep `precheck` and `check` truthfully distinct.

8. **P2 — Parallel settings cleanup**
   - Determine whether any compatibility path still imports `electron/settings-module.js` before consolidation or removal.

## Explicit non-goals from current evidence

Do not currently:

- weaken Browser Loop provider-readiness gating;
- force LM Studio as a fallback;
- silently switch providers after failure;
- alter provider timeout values merely to make acceptance pass;
- change session continuity or `newSession:false`;
- change Cline authentication mechanisms without evidence;
- patch `electron/settings-module.js` as though it were the production settings owner.

## Workspace UI files

The repository-driven workspace uses:

- `plan.json` — visual architecture, findings, current gate, dependency edges and future work;
- `status.json` — current head, closed proof, historical/reference evidence, pending gates and next acceptance;
- `current-state.md` — detailed human-readable evidence checkpoint;
- `projects.json` — workspace registration and active visual node.

The website is a projection of repository/project evidence, not runtime authority.
