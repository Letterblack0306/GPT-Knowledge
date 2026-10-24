# Brew: five priority reliability enhancements (2026-10-12)

Authority: live source at D:\Developement\_Brew_V02\Brew_Rebuild, main 3e87b4528622bbd3bd0885d5446c1765f1ed355c, dirty; this plan is not proof of deployment.

Method: Recurring Failure Guide. Preserve existing edits. Test source changes, then classify installed behavior separately.

1. **Telegram conversation identity fail-closed**. Source: brew/runtime/telegram/telegram-turn.mjs + chat/conversation-store.mjs. Current direct commands return without rejecting invalid account/user; validate before either direct or model path. Acceptance: invalid identity cannot execute a turn or issue runtime commands.
2. **No implicit executable follow-up replay**. Source: telegram-turn.mjs resolveFollowUpMessage. Current 'try again' can silently repeat a prior executable path/command. Keep original message; require explicit action target for side-effectful repetition. Acceptance: follow-up does not rewrite to an earlier command.
3. **Truthful Telegram runtime health**. Source: telegram-runtime.mjs status vs account-router.mjs degraded. Account degradation should affect aggregate health. Acceptance: degraded account forces degraded runtime status.
4. **Bounded Telegram ingress**. Source: account-router.mjs dispatchAccountUpdate; currently unawaited update handler, no concurrency bound. Preserve stop/reset responsiveness while preventing unlimited pending work. Acceptance: burst traffic capped and controls remain dispatchable.
5. **Polling shutdown and error visibility**. Source: account-router.mjs polling. Verify stop can interrupt pending fetch and that the per-account last successful poll and failure diagnostics remain accurate. Acceptance: stop does not leave a poll running; transient failures clear after recovery.

Implementation evidence/status must be appended after code and tests. Do not infer installed-runtime acceptance from passing unit tests.


## Implementation record — 2026-10-12

Target: D:\Developement\_Brew_V02\Brew_Rebuild, branch main, HEAD 3e87b4528622bbd3bd0885d5446c1765f1ed355c, dirty before/after, unrelated existing edits preserved.

### Implemented in the local source
1. Identity fail-closed: validate Telegram conversation identity before direct commands OR runTurn. Invalid identity raises TELEGRAM_INVALID_IDENTITY. Source: brew/runtime/telegram/telegram-turn.mjs.
2. Explicit follow-up semantics: removed silent executable-message substitution by resolveFollowUpMessage; original user message flows to canonical runner. Source: telegram-turn.mjs.
3. Honest transport status: Telegram runtime aggregate status degrades when a started account reports degraded. Source: brew/runtime/telegram/telegram-runtime.mjs.
4. Duplicate ingress protection: update_id less than the prior offset is ignored; offset moves monotonically. Source: brew/runtime/telegram/account-router.mjs. This is not a durable exactly-once delivery guarantee.
5. Poll cancellation: AbortSignal propagates router -> Telegram getUpdates -> fetch; stopped polling ignores late results and abort-related errors rather than backing off. Source: account-router.mjs + brew/adapters/telegram/telegram-service.mjs.

Test seam: createAccountRouter now accepts injectable loadConfig/createService while retaining existing defaults. New focused regression: scripts/telegram-five-reliability.test.mjs.

### Tests and execution receipts
- New focused 4/4 passed: bird-20261012-014358-7f6a8e69.
- Existing focused 15/15 passed: bird-20261012-014217-22c7eecf.
- Full npm test exit code 0: bird-20261012-014413-8f54ee5a. This validates only the current source test suite.
- Scoped git diff --check exit 0: bird-20261012-014518-b17d5143. Global git diff --check separately flagged preexisting .gitignore whitespace; left unchanged.
- Installed files for all four changed source modules had nonmatching hashes versus development checkout: bird-20261012-014501-a459b1e1.

### Unverified / incomplete
- No installed Brew deployment/restart in this task. No live Telegram Bot API, genuine turn cancellation, chat UI, or provider-backed end-to-end acceptance. Do not classify this work as deployed/production complete.
- These five changes target verified Telegram reliability gaps only; they do not complete the separate broader Brew memory/tool-autonomy/UX comparison backlog. This scope distinction is important.
- No git commit, merge, pull or unrelated cleanup performed.

Classification: LOCAL_SOURCE_IMPLEMENTED + TESTS_PASS; INSTALLED_RUNTIME_UNVERIFIED.


## Installed deployment evidence — 2026-10-12

User authorized continuation of installation/restart after local source tests.

- Development source root: D:\Developement\_Brew_V02\Brew_Rebuild, branch main, HEAD 3e87b4528622bbd3bd0885d5446c1765f1ed355c, dirty source; preexisting changes preserved.
- Predeployment focused Telegram tests 7/7 passed: BirdEye receipt bird-20261012-014819-45a7ee0a.
- Canonical `node bin/brew.cjs stop all` exit 0: bird-20261012-014830-0f9557ed.
- Canonical installer `node scripts/release-installer.mjs --target=C:\Users\prave\.Brew --skip-build --skip-smoke` exit 0 including dependency install, postflight, and manifest identity `brew-1.0.0-3e87b452-manifest-dirty`: receipt bird-20261012-014843-213e8d74. Skip flags mean neither UI rebuild nor installer smoke suite was executed in this deployment step.
- Canonical `node bin/brew.cjs start all` exit 0, process identity match, orchestrator PID 60704: bird-20261012-014858-7aaa694a.
- Installed 4/4 patched source modules SHA-256 equal to development files; `GET http://127.0.0.1:8600/health` returned HTTP 200 / ok:true; actual orchestrator PID 60704 and Telegram child PID 39040 inspected; CLI status online, provider online, 95 runtime capabilities reported. Receipt bird-20261012-014914-2ffb7d1f.
- New test file was not present in installed workspace (release manifest intentionally copies runtime sources); source tests remain in development checkout.

Classification: DEPLOYED_SOURCE_PROVEN + LIVE_PROCESS_AND_HEALTH_PROVEN. Provider status is not proof of successful inference. Telegram child process is not proof of Telegram API delivery, model turn execution, or real-user stop/cancel acceptance. Those end-to-end checks remain UNVERIFIED. No unrequested commit/pull/rebase.
