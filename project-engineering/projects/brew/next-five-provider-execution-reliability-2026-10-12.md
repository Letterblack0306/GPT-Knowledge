# Brew: next five runtime reliability enhancements (2026-10-12)

Live development checkout: D:\Developement\_Brew_V02\Brew_Rebuild, main@3e87b4528622bbd3bd0885d5446c1765f1ed355c, dirty. Source and installed runtime remain distinct.

## Five implemented source changes
1. Provider cancellation truth: CatalogProvider distinguishes explicit user cancellation (PROVIDER_CANCELLED, AbortError) from timeout (PROVIDER_TIMEOUT). Previous implementation labeled all AbortError outcomes as timeout.
2. Bounded model discovery: combine external abort with discovery timeout via AbortSignal.any. Previously caller signal replaced the timeout during model-list fetch.
3. End-to-end provider timeout budget: apply one remaining-time budget across provider candidates, models, retries, and their requests, rather than resetting full duration at each attempt; late success cannot be promoted after cancellation/deadline.
4. Cancellation-aware fallback and retries: stop new attempts after cancellation and return PROVIDER_CANCELLED instead of retrying or reporting generic unavailability; a pre-aborted turn attempts no model.
5. Telegram poll shutdown: terminate the five-second error backoff immediately upon stop rather than retaining a sleeping polling loop.

Active owners: brew/runtime/providers/catalog-provider.mjs, brew/runtime/providers/provider-chat-authority.mjs, brew/runtime/telegram/account-router.mjs. Do not introduce another reasoning owner.

Verification: new scripts/provider-cancellation-budget.test.mjs and expanded scripts/telegram-five-reliability.test.mjs. Focused acceptance 8/8 pass, BirdEye receipt bird-20261012-034346-704ac76a. Full npm test exit 0 after final change, receipt bird-20261012-034357-32d30c43.

Boundaries: tests exercise source/mocked interfaces, not a paid provider-backed inference or live Telegram cancellation. Preserve unrelated dirty files. Installation and runtime health evidence to be appended after deployment, not assumed.


## Deployment and runtime acceptance (2026-10-12)
- Predeployment running runtime was idle (activeOperations=0), /health ok:true; receipt bird-20261012-034527-ce7ddbf0.
- Canonical stop via node bin/brew.cjs stop all, exit 0; receipt bird-20261012-034537-5cd1da9d.
- Canonical installer via node scripts/release-installer.mjs --target=C:\Users\prave\.Brew --skip-build --skip-smoke; exit 0, dependency install and postflight passed; source identity brew-1.0.0-3e87b452-manifest-dirty. Receipt bird-20261012-034552-f438f7cf. UI rebuild and installer smoke were skipped.
- Canonical start via node bin/brew.cjs start all; exit 0, orchestrator PID 49228, process identity verified. Receipt bird-20261012-034613-2ea25ee0.
- SHA256 of all three changed installed modules matches development source (catalog-provider.mjs, provider-chat-authority.mjs, account-router.mjs). HTTP /health ok:true, orchestrator PID 49228, Telegram child PID 45460, provider status online, 95 capabilities. Receipt bird-20261012-034631-e95160e1.
- Full npm test exit 0: bird-20261012-034357-32d30c43. New focused provider+Telegram regressions 8/8: bird-20261012-034346-704ac76a.

Classification: SOURCE_IMPLEMENTED_AND_TESTS_PASS; INSTALLED_SOURCE_AND_PROCESS_HEALTH_PROVEN. Not proven: provider-backed successful inference/cancellation during a live API call, live remote Telegram error/backoff, or UI-visible effects. No commit, pull, rebase, or cleanup.

