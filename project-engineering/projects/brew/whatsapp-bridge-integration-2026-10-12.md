# Brew WhatsApp Integration — implementation and deployment evidence (2026-10-12)

## Truth classification
**OPTIONAL_WHATSAPP_BRIDGE_INSTALLED + MOCK_ACCEPTANCE_PASSED + BREW_HEALTHY; REAL_WHATSAPP_PAIRING_AND_DELIVERY_UNVERIFIED; OPTIONAL_DEPENDENCY_SECURITY_REVIEW_BLOCKED.**

Source root: D:\Developement\_Brew_V02\Brew_Rebuild; main HEAD 3e87b4528622bbd3bd0885d5446c1765f1ed355c, dirty, no commit. Installed runtime: C:\Users\prave\.Brew\workspace.

## Implemented in active owners
- brew/gateway/whatsapp/index.mjs: removed obsolete mismatched command parser/router; uses injected canonical turn execution on authorized group text; per group/sender conversation identity; correct stop/status action; truthful denial and bounded in-process duplicate-ID defense; no unsolicited messages to unauthorized groups.
- brew/gateway/whatsapp/bridge.mjs: system Chrome under sandbox default (unsafe no-sandbox needs explicit env), LocalAuth external to source checkout, WhatsApp Web transport and mocked QR, QR locally stored under private Brew state, cleared after pairing/stop; no QR in routine events; actual message ID forwarded.
- brew/gateway/whatsapp/auth.mjs and group-policy.mjs: atomic protected auth/allowlist writes, corrupt state fail-closed; explicitly bound group AND at least one individually allowed sender.
- brew/runtime/whatsapp/whatsapp-runtime.mjs and whatsapp-control.mjs: optional nonblocking transport and opt-in; canonical authenticated localhost /query only; runner envelope actions turn, stop, status; restart-safe lifecycle guard; persisted external control and corruption handling.
- brew/agent/orchestrator-server.mjs: starts optional WhatsApp transport without blocking Telegram/core, stops during shutdown and registers health adapter; disabled by default.
- brew/cli/commands/whatsapp.mjs and brew/cli/main.mjs: local brew whatsapp status, enable, disable, qr, bind, unbind; no default execution or account authorization.
- brew/truth/runtime-truth.mjs: wired source with liveConnected null (not guessed).
- Deleted redundant unreferenced brew/channels/channel-adapter.mjs.
- package.json and package-lock.json: optional pinned whatsapp-web.js@1.34.7 and qrcode@1.5.4; uses existing Chrome; no duplicate Chrome install.
- docs/operations/WHATSAPP_SETUP.md: pairing instructions, explicit binding, honest limits.
- scripts/whatsapp-integration.test.mjs: 12 tests for transport, QR lifecycle, authorization, canonical envelopes, control, corruption, stop race and CLI.

## Execution receipts
- Optional dependencies installed in source: bird-20261012-150620-32d62633.
- 12/12 focused WhatsApp regressions PASS: bird-20261012-152027-dba083de.
- Full npm run check, 682/682 PASS: bird-20261012-152229-4a34cfcc.
- npm run verify:readiness PASS: bird-20261012-152407-1d21e2f3.
- Canonical stop with zero active operations: bird-20261012-152436-9787ccc1.
- Canonical installation/postflight PASS with optional dependencies installed: bird-20261012-152458-8fb8e81f.
- Canonical restart successful, orchestrator PID 40340: bird-20261012-152543-16a4de57.
- All 10 modified installed source files SHA256 matched current source, real installed CLI showed WhatsApp disabled, no authorized group, no QR, both npm optional modules resolved, HTTP health ok:true and workspace index valid: bird-20261012-152817-744538d3.
- Final cleanup removed one older generated release proof, retained release-proof-1791818700571.json; runtime remains healthy PID 40340; WhatsApp still explicitly disabled/unpaired: bird-20261012-152901-a7a2da32.

## Security blocker (not silently ignored)
Installed npm audit with --omit=dev returned **9 high severity vulnerabilities**, all in whatsapp-web.js/Puppeteer browser dependency graph (whatsapp-web.js, puppeteer, puppeteer-core, @puppeteer/browsers, basic-ftp, extract-zip, get-uri, pac-proxy-agent, proxy-agent): bird-20261012-152833-263dad63. npm suggested a potentially disruptive direct package downgrade; no forced breaking dependency change was applied. Optional WhatsApp remains disabled. This should be addressed before production channel enablement, preferably by evaluation of official WhatsApp Business Platform/Cloud API if appropriate. whatsapp-web.js is unofficial WhatsApp Web browser automation and has platform-policy fragility.

## Operator setup and pending proof
1. brew whatsapp status
2. brew whatsapp enable
3. brew restart all
4. brew whatsapp qr (then scan with account owner's WhatsApp app > Linked devices)
5. brew whatsapp bind <actual-group-id@g.us> <actual-sender-id@c.us> [additional-senders]
6. brew restart all
7. Test real allowed group message/response, /status, /stop, disconnect/restart recovery, and security boundaries. Group JIDs/sender IDs must be learned from authorized sources, never invented.
**Never assert WhatsApp ready, paired, sending or receiving until actual account connection and round-trip verification.** Current code handles group text only: no personal DM, media attachments, multiple groups, official Cloud API or broadcast.

## Scope note
Preserved live installed Brew state and valuable source; deleted proven duplicate adapter and stale release proof. No commit, PR, rebase or user-secret operations. Mock tests and installed checks do not prove real WhatsApp delivery.

