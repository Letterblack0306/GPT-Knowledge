# Access Browser Agent — Current State

Date: 2026-08-21

## Current source authority

- Repository: `Letterblack0306/access-browser-agent`
- Branch: `main`
- Verified remote HEAD: `a553fe9e2da78ae2154c5a7b174ccacc7e12cc07`
- Application entry: `electron/rebuild-main.js`
- Active production settings UI: `electron/rebuild-settings.js`
- Browser Loop readiness owner: `electron/browser-session-authority.js`
- Active provider state owner: `electron/agent-runtime-adapter.js`

This checkpoint separates **current source truth**, **historical evidence**, **current live proof**, **source/regression proof**, and **acceptance not yet reached**. Current repository/runtime evidence remains authoritative over this projection.

## Current overall status

The current main contains two important completed repairs after the earlier P0 provider-context repair:

1. **Cline authentication persistence/source ownership repair** — source and regression proof complete; live OAuth persistence acceptance remains inconclusive because no successful Cline credential was established during the attempted live sign-in.
2. **Post-result Browser Relay continuation repair** — source and regression proof complete on current main; definitive current-live A → result → next instruction B acceptance remains open because provider-state contamination prevented the relay from reaching the intended live test boundary.

The current active engineering gate is therefore **provider candidate-readiness authority**, not arbitrary Browser Loop modification.

## Previously closed P0: provider context amplification

The earlier current-head R4 failure was caused by provider-context amplification from accumulated historical tool-result payloads in the continuing durable session, dominated by repeated `readFile` results.

Repair commit:

- `bb00c560a561ddb44584689846830ebdcdc124f6` — bounds rehydrated historical tool evidence only in the provider-facing projection.
- `481308768a5991c392e4b4ec1641d37971740911` — regression coverage for historical provider compaction.

The successful live revalidation established natural instruction ingress, continuing local session identity, configured provider reasoning, autonomous `browserConversationRead`, successful protected exact-chat read, objective completion, result queueing/submission, rendered same-chat delivery, causal delivery-response consumption, and stable waiting state.

The earlier `R4_STEP_TIMEOUT` remained classified as **TEST_HARNESS_FAILURE** because the product path completed at about 126.2 seconds while the harness assumed 120 seconds.

## Cline auth persistence repair

The source investigation proved duplicate auth authority and stale preference-save risk. The repair series on main is:

- `11b06af67408e1049895b74a8167d4d8691e602b` — expose durable Cline auth persistence updates.
- `872b61c5e863cecbc466221823d42b5d3d4ff2d3` — preserve durable Cline auth across stale preference saves.
- `57b3830466e516c1d2c2d221d3cd0e6d6f4f369d` — make Cline auth writes explicitly authoritative.
- `0b7a4b5eb644109e7dc5e90e65baace1ed7197f2` — share wrapper-owned Cline auth with the agent runtime.
- `2680deaddf625d9bb80567a903343a8ecacf46b4` — protect persisted Cline auth from stale settings saves.
- `79253b52b5d1dd7681a6e4fa6da94994ec2cc831` — syntax correction after the auth-sharing change.

Focused syntax/provider/preferences checks passed. Live OAuth persistence acceptance remains **INCONCLUSIVE**, because WorkOS device authorization timed out before a successful durable credential could be created and then reloaded.

## Post-result continuation defect and repair

A real live continuation failure was reproduced after an Access result was delivered to ChatGPT. The next ChatGPT assistant turn was detected but was classified as `delivery_response` and consumed instead of being executed as the next instruction.

Authoritative live evidence showed:

- result delivery succeeded;
- `browser_relay.delivery_response_consumed` recorded the next assistant turn;
- `responseInstructionId` existed for that next turn;
- the relay returned without submitting that turn to the local agent.

Classification before repair: **PROVEN_LIVE_CONTINUATION_CLASSIFICATION_DEFECT**.

Repair commits:

- `fab58f222de36fe6d9e59516da3ebc1ef9156845` — preserve the next assistant turn after result delivery; resolve delivery ownership without returning early.
- `a553fe9e2da78ae2154c5a7b174ccacc7e12cc07` — regression coverage protecting immediate post-result assistant instruction execution.

Focused continuation/restart/recovery smoke tests passed, preserving `newSession:false` and the restart fail-closed pending-delivery guard.

Current classification: **PROVEN_SOURCE + PROVEN_REGRESSION; CURRENT-LIVE ACCEPTANCE OPEN**.

## Provider-state investigation: inherited Test READY authority leak

The failed live continuation acceptance exposed a separate provider-state problem. Durable preferences remained LM Studio, but using the Cline **Test READY** control changed the live runtime provider to Cline.

The source/history investigation established:

- `electron/rebuild-settings.js` is the active production settings implementation because `electron/index.html` loads it directly.
- `electron/settings-module.js` is a parallel/historical implementation in the current rebuild shell; it is not loaded by the production `index.html`.
- `rebuild-settings.js` has carried the same `clineTest` behavior since the initial canonical Access repository commit `5d77a0e8a145231dec40f389cf2d5a274a9aa7a0`.
- `clineTest` calls `providerConfigure(... persist:false)` **without** `discoverOnly:true`.
- `AgentRuntimeAdapter.updateProviderSettings()` therefore calls `_installProvider()`.
- `_installProvider()` changes `service.provider`, `service.agent.provider`, and `providerSelection`.
- `persist:false` prevents durable preference persistence, but does not prevent active runtime provider mutation.

Observable consequence:

```text
persisted selected provider = LM Studio
live runtime provider       = Cline
```

until an explicit provider activation or restart occurs.

Classification: **PROVEN_INITIAL_PROVIDER_TEST_AUTHORITY_LEAK** — an inherited design defect present in the first canonical repository snapshot, not a recent regression from the auth or continuation repairs.

## Reference-backed architecture finding

GPT-Knowledge established provider-neutral/Cline integration guidance on 2026-08-13, before the current Access canonical repository baseline. The intended contract separates:

- provider identity;
- authentication;
- model discovery;
- candidate readiness;
- active provider selection;
- host session/tool/browser/evidence authority.

Current Cline/VS Code implementation provides a useful comparison: provider selection is explicit persisted API configuration, while LM Studio model discovery is a separate operation. Candidate inspection is not implicitly equivalent to active-provider selection.

Access currently respects that distinction for **Discover** but not for **Test READY**.

## Active engineering question

The next implementation question is now exact and source-bounded:

> How should Access test a candidate provider/model for real agent readiness without installing that candidate as the active runtime provider?

Candidate design must be mapped against the current:

- `electron/agent-runtime-adapter.js`
- `src/llm/ProviderFactory.js`
- `src/llm/ModelReadinessRegistry.js`
- `src/llm/ClineLlmsProvider.js`
- `src/llm/OpenAICompatibleProvider.js`
- existing `providerReadiness()` path

No patch should be made until source mapping proves whether the correct primitive is a candidate-aware readiness probe, a dedicated `testProviderSettings()` boundary, or an existing abstraction already present in the provider layer.

## Do not change from current evidence

The following are not established defects and should not be modified merely to unblock testing:

- Browser Loop agent-readiness gate;
- LM Studio startup restoration;
- Cline authentication mechanism;
- LM Studio endpoint/model selection;
- provider timeout values;
- session continuity or `newSession:false`;
- automatic provider fallback.

## Remaining acceptance and engineering work

1. **P0 — Candidate provider-readiness authority contract**
   - Prove the correct non-authoritative candidate test primitive from active provider source and reference implementations.
   - Add a regression that Test READY cannot mutate the active provider unless activation is explicitly requested.

2. **P0 — Current-live post-result continuation acceptance**
   - After provider-state authority is corrected or otherwise proven clean, run one bounded A → result → B continuation cycle.
   - Require `delivery_response_resolved` for B followed by the same B as `instruction_received`, `newSession:false`, and no duplicate execution.

3. **P1 — Cline auth live persistence acceptance**
   - Requires one successful supported Cline sign-in, durable credential creation, runtime restart, and authenticated reload.

4. **P1 — Arbitrary process-death recovery**
   - Validate exactly-once recovery at `executing`, `delivering`, and `delivery_unverified` boundaries.

5. **P1 — Non-complete terminal-state UI acceptance**
   - Verify blocked, failed, stopped, and delivery-unverified states truthfully render in a live current-head run.

6. **P1 — Governance/check wording**
   - Keep documentation/UI explicit that `precheck` and `check` are distinct unless source intentionally changes.

7. **P2 — Parallel/legacy settings cleanup decision**
   - Determine whether any active path still imports `electron/settings-module.js` before removing, consolidating, or leaving it as historical compatibility code.

## Workspace UI connection

The visual workspace reads:

- `plan.json` for architecture, evidence nodes, current gate, pending gates, and graph edges;
- `status.json` for current head, classifications, closed proof, historical proof, open engineering work, and the next acceptance question;
- `projects.json` for the active visual node.

The UI is a repository-driven projection. It is not an independent project-state authority.
