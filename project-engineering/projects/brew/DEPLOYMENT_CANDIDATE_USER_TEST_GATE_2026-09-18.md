# Brew Deployment Candidate / User-Test Gate — 2026-09-18

## Evidence boundary

This checkpoint records user-supplied local worktree validation from:

    G:\Developments\38_Brew_Creative_Agent\brew

The candidate contains uncommitted changes and therefore is **not** equivalent to current GitHub `Letterblack0306/brew/main`.

Current observed GitHub main during this reconciliation:

    c37205cbd96d5e0836f95032bddd3a314cee8063
    build: refresh runtime UI asset reference

## Local candidate validation supplied by user

Reported PASS:

- focused memory watcher tests: 4/4;
- full `npm test`: 422/422;
- `npm run verify:readiness`;
- `npm run check:runtime`;
- `git diff --check`;
- runtime syntax over 349 runtime files;
- state-root guard;
- runtime-authority guard;
- secrets-structure guard;
- product-surface guard;
- browser-capability guard;
- file-adapter guard;
- resource-policy guard;
- event-contract guard;
- import-boundaries guard;
- release preflight.

Memory watcher repair reported:

- security-rejected candidates no longer emit governed promotion proposals;
- regression test added for that refusal path.

Classification: `LOCAL_SOURCE_CANDIDATE_VALIDATED_FOR_CONTROLLED_INSTALL_TEST`.

This is **not** installed-runtime or user-visible end-to-end acceptance.

## Canonical installed layout

Current release installer and layout validator define the normal user installation as:

    C:\Users\<user>\.Brew\
      workspace\      # installed runtime files
      bin\            # global CLI shims
      state\          # mutable runtime state
      secrets\        # local secrets
      reports\        # runtime reports
      brew.cmd

The `workspace\` level is intentional. Double nesting such as `.Brew\workspace\workspace\` or source-path fallback is not accepted.

Global CLI shims must resolve to `.Brew\workspace\bin\brew.cjs` and must not execute the source checkout under `G:\Developments\...`.

## Required installed user-test proof

Before calling the candidate user-ready, prove from the installed destination:

1. release installer completes successfully;
2. installed layout validator passes;
3. release postflight passes;
4. `where.exe brew` resolves the installed user shim, not source checkout;
5. `brew version` works from an unrelated directory/new shell;
6. `brew status` reports installed runtime/state roots;
7. `brew start all` starts installed runtime/UI;
8. release smoke test passes, including runtime-authority/build-id identity;
9. one real `brew chat <message>` request traverses the canonical provider/tool loop;
10. stop/restart works without source checkout dependency;
11. installed workspace has no forbidden `.git`, `.brew`, `.env`, `data`, source-only docs/tests/scripts, or accidental double nesting.

## Current verdict

    SOURCE / TEST READINESS          = PASS for supplied local candidate
    CONTROLLED DEPLOYMENT TEST       = READY
    INSTALLED USER USABILITY         = NOT YET PROVEN
    GENERAL USER TEST READINESS      = BLOCKED ON INSTALLED ACCEPTANCE
    RELEASE / PUBLIC DEPLOYMENT      = NOT AUTHORIZED BY THIS CHECKPOINT

The next action is a controlled install/user-path acceptance run, not more source-only regression testing unless the install run reveals a claim-matched defect.