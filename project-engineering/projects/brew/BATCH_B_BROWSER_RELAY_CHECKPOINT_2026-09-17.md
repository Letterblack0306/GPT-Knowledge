# Brew Batch B Browser Relay Checkpoint — 2026-09-17

## Authority
This is a GPT-K projection of current Brew workspace/runtime evidence. Current local source, live runtime state, active repository contracts, and runtime reports remain higher authority.

## Workspace
`G:\Developments\38_Brew_Creative_Agent\brew`

Observed current source commit referenced by GitHub search: `1a34fe5bdf40dfbdf04972963a988dcb426bd160`.

## Accepted Batch B source/readiness checkpoint
The current Brew workspace result reports:
- canonical ChatGPT result-posting tool repaired to dispatch composition/input/keydown events, wait for UI state propagation, and recognize `.composer-submit-button-color`;
- five legacy autonomy modules were deleted by prior commit `0ee0575b` and have no current imports; they remain obsolete and must not be restored;
- focused autonomy tests: PASS;
- scheduler/job/approval tests: PASS;
- full `npm test`: PASS, 418 tests;
- `npm run verify:readiness`: PASS;
- `npm run runtime:truth`: PASS;
- `npm run release:postflight`: PASS.

This establishes IMPLEMENTED/source-readiness evidence only. It does not prove live browser posting.

## Current browser/relay diagnosis
Canonical relay configuration owner reported from current source:
- `brew/runtime/core/runtime-defaults.mjs`
- `brew/agent/orchestrator-server.mjs`
- default relay endpoint: `127.0.0.1:9333`
- supported override families: `BREW_BROWSER_RELAY_*`, `BROWSER_RELAY_*`, `BREW_RELAY_*`.

Canonical current startup/runtime contract in Brew source identifies:
- `package.json` `start`/`dev` -> `node brew/agent/orchestrator-server.mjs`;
- `brew/agent/orchestrator-server.mjs` as canonical process/lifecycle owner;
- browser relay lifecycle owned by orchestrator + `brew/runtime/browser-relay/server.mjs`;
- `bin/brew.cjs` remains a thin CLI launcher into `brew/cli/main.mjs`.

Live evidence:
- Chrome process PID: `10064`;
- remote-debugging port: `7430`;
- profile: `C:\Users\prave\c.Agents-Memory-Tool-Control\chrome-profile`;
- live listener: `127.0.0.1:7430`;
- Chrome `/json/version` and `/json/list`: reachable;
- configured/default relay endpoint `127.0.0.1:9333`: connection refused;
- `127.0.0.1:9222`: connection refused.

Current classification:
`CDP_RUNNING_RELAY_MISSING`

Browser/CDP health: PASS.
Relay health: BLOCKED.
Live posting acceptance: NOT ATTEMPTED because the relay health gate failed.

## Current evidence boundary
Do not:
- add a second relay;
- guess or hard-code another relay port;
- restore deleted autonomy modules;
- treat the healthy CDP endpoint itself as Brew relay proof;
- claim live ChatGPT posting success from source tests/readiness checks;
- patch the posting tool solely because the relay process is absent.

## Next bounded gate
Use the existing documented Brew runtime startup path so the orchestrator owns relay startup. Then prove:
1. Brew runtime/orchestrator starts successfully;
2. canonical relay endpoint becomes reachable and identifies the expected Brew relay service;
3. existing browser/CDP session remains reachable;
4. only then run one authorized live ChatGPT posting acceptance through the canonical repaired posting tool;
5. live PASS requires text insertion, send action, and visible posted message.

If orchestrator startup does not produce the relay, classify the startup/lifecycle defect at the existing owner before modifying source.

## Batch B reports
Current runtime report paths:
- `C:\Users\prave\.brew\reports\batch-b-autonomy-reconciliation.json`
- `C:\Users\prave\.brew\reports\batch-b-autonomy-reconciliation.md`

## Current verdict
`BREW CHATGPT POSTING LIVE PROOF = BLOCKED_CDP_RUNNING_RELAY_MISSING`
