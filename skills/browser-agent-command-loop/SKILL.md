---
name: browser-agent-command-loop
description: >
  Drive the Letterblack Browser Agent through its visible desktop UI as a multi-round execution
  partner. Use whenever the user asks ChatGPT to give Browser Agent a task, continue/run the
  Browser Agent loop, let Browser Agent work autonomously, perform a machine/browser task through
  Browser Agent, or keep iterating until the agent actually finishes. Reuse the user's existing
  logged-in Chrome profile/session for machine work; do not silently create or switch to an empty
  managed profile. Keep the Browser Agent UI visible so the user can see chat turns, tool calls,
  progress, blockers, and results. Continue task -> response -> follow-up cycles until acceptance
  or a genuine external blocker is proven and reported.
---

# Browser Agent Command Loop

Use this skill when ChatGPT is coordinating work through the Letterblack Browser Agent rather than
performing the requested user-machine task invisibly itself.

The operating loop is:

```text
user objective
  -> establish current Browser Agent + machine/browser identity
  -> reuse the user's existing browser profile/session
  -> open/foreground the Browser Agent UI
  -> submit one complete task packet in the Agent chat
  -> Browser Agent reasons and uses its available tools
  -> observe visible tool/activity/status output
  -> read the Agent's returned response
  -> classify whether the objective is complete
  -> if incomplete, diagnose and send the next bounded follow-up
  -> repeat until accepted or a genuine external blocker remains
  -> return the final result to the user
```

## Core ownership

Preserve these roles:

- **ChatGPT/controller**: understands the user's objective, establishes current evidence, prepares
  task packets, observes Browser Agent progress/results, diagnoses incomplete rounds, and decides
  what follow-up instruction is needed.
- **Browser Agent**: remains the local reasoning/execution agent for the delegated task. It selects
  and uses the tools available in its runtime.
- **Browser Agent UI**: is the visible operator surface. The user should be able to see the
  conversation, tool calls/activity, current status, attention states, and returned result.
- **Browser/workspace/terminal/GitHub/etc.**: are capabilities used by Browser Agent; they are not
  separate reasoning authorities.
- **BirdEye**: provides current local workspace/machine evidence and governed execution when needed
  to diagnose or maintain the Browser Agent itself.

Do not replace Browser Agent with hidden controller-side execution just because ChatGPT can also
reach the machine. If the user asked to use Browser Agent, keep the task in the Browser Agent loop.

## 1. Establish live state before sending a task

Before claiming what Browser Agent can do, inspect current runtime/workspace state.

Confirm as needed:

- Browser Agent workspace/revision;
- whether the Access Agent / Browser Agent desktop UI is running and responsive;
- selected reasoning provider/model and readiness;
- browser profile/session selected for machine work;
- instruction-provider conversation if the task uses one;
- tool/runtime availability relevant to the requested objective.

Current runtime evidence outranks old screenshots, docs, historical task packets, and prior PASS
results.

Do not stop at a generic `blocked` label. Identify the failing boundary and try the appropriate
repair or alternate supported path before treating it as a genuine stop condition.

## 2. Existing user browser profile is the default

For user-machine or website tasks, prefer the user's **existing logged-in browser session**.

On Chrome/Windows, establish the real active profile from current machine state (for example,
Chrome `Local State -> profile.last_used`, running Chrome process/user-data root, and visible
window identity).

Use this order:

1. currently open user browser/session that already contains the user's logins and state;
2. explicitly selected existing profile folder;
3. another existing user profile chosen by the user;
4. a separate managed/empty Browser Agent profile **only when explicitly requested or when no
   existing-profile control path is available and the user agrees**.

Never silently create a new profile, duplicate a profile, or switch to an empty managed profile as
a convenience fallback.

If the user's existing Chrome profile is already open without CDP, do not launch a second copy of
that profile. Use an available visible-desktop/extension/relay integration that operates on the
existing session. If the current Browser Agent lacks such a control path, surface the exact
capability gap and repair/integrate it; do not solve the user's task in an unrelated blank profile.

When a real user profile is selected, make its identity visible in the Browser Agent UI.

## 3. Use the visible Browser Agent UI

The normal command path is the Agent chat composer in the Browser Agent desktop application.

Keep the app visible while work runs. The UI should project operational facts such as:

- the user's/delegated task;
- active provider/model;
- active skill when relevant;
- tool call started/completed/failed;
- browser/profile identity;
- progress/running state;
- blocker/attention message;
- agent response;
- completion state.

A debug/CDP channel may be used to inspect or automate the UI for testing, but it must not become a
hidden replacement execution surface. The user-visible UI should still reflect the work.

Do not use source code/evidence panels as a substitute for the agent's operational frontend.

## 4. Send a complete task packet

Do not drip-feed obvious setup steps one at a time.

Give Browser Agent a task packet that states:

```text
OBJECTIVE:
<what the user actually wants>

CURRENT CONTEXT:
<workspace/app/browser/profile/target facts that matter>

CONSTRAINTS:
- use the existing user browser/profile/session
- keep actions visible in the Browser Agent UI
- use available tools dynamically
- do not silently stop on a tool failure
- report blockers/incomplete states in chat
- preserve unrelated dirty state / user data

ACCEPTANCE:
<observable result that proves the objective>

REPORT BACK:
what was done
what tools/actions were used
what remains incomplete, if anything
exact blocker if one remains
```

For engineering work, add current repository/revision/scope and validation requirements.
For browser/machine work, add exact site/app/target and what visible state must be observed.

## 5. Observe the run, not just the final text

While Browser Agent runs, use the UI/runtime events to determine what actually happened.

Distinguish:

- provider response;
- tool call proposed;
- tool call started;
- tool call completed/failed;
- browser action observed;
- file/terminal effect observed;
- agent final response;
- completion/attention state.

Do not treat `PASS`, exit code 0, provider prose, or an Agent message saying "done" as proof of
the requested effect.

When the task is visual or machine-facing, inspect the real resulting UI/page/app where practical.

## 6. Multi-round continuation is mandatory when needed

A single Browser Agent response is not the loop.

After each Agent response:

1. compare the returned result to the user's acceptance condition;
2. inspect tool/activity/blocker state for missing work;
3. if incomplete, identify the next smallest useful instruction;
4. send that follow-up in the same Browser Agent session when possible;
5. wait for the next response;
6. repeat.

Typical follow-ups include:

- retry after repairing provider/model readiness;
- switch to another available tool/capability;
- inspect the actual browser/app result;
- fix an identified runtime/tool defect;
- continue from partial progress;
- verify a claimed side effect;
- use another relevant skill;
- report the exact blocker instead of silently ending.

Do not restart a fresh session unless the current session is genuinely unusable or identity
continuity would be misleading.

## 7. Tool failure must become a visible conversation state

Browser Agent must not silently die when a tool fails.

When a tool/capability fails:

```text
tool failure
  -> visible failed tool/activity state
  -> Agent reasons about the failure
  -> Agent reports the issue in chat
  -> attempt bounded diagnosis/repair/alternate tool
  -> resume the task if possible
```

If controller-side maintenance is needed to repair Browser Agent itself, perform only the bounded
repair needed, then return the task to Browser Agent and continue through its UI.

A failure is a terminal blocker only when the exact dependency cannot currently be satisfied by
available authorized means.

## 8. Instruction-provider conversations

When Browser Agent is configured to consume instructions/context from a browser conversation,
treat the provider as transport, not the reasoning engine.

Supported provider categories may include ChatGPT, Claude, Gemini, DeepSeek, Arena, and future
adapters.

Keep identities separate:

```text
instruction-provider conversation
local Browser Agent reasoning session
work-browser target
```

Preserve the exact conversation identity. Read/re-read the instruction conversation when required,
execute work in the separate work browser/runtime, and return results through the configured
delivery path only when that provider adapter is actually validated for delivery.

Do not hardcode ChatGPT as the only possible instruction provider.

## 9. Stop conditions

Continue until one of these states is reached.

### ACCEPTED

The user's requested observable outcome is verified, and no material requested step remains.

### EXTERNAL_BLOCKER

A dependency outside the currently available authorized capabilities still prevents completion
after bounded diagnosis/repair attempts. Report:

- exact failing boundary;
- what was tried;
- current evidence;
- what specific user/external action is required;
- what will resume after that action.

Do not use `BLOCKED` as a shortcut for an undiagnosed tool or configuration problem.

## 10. Final response

Return a compact result, not a transcript dump.

Preferred structure:

```text
RESULT: ACCEPTED | EXTERNAL_BLOCKER

Browser Agent session:
User browser/profile:
Instruction provider:
Tools/capabilities actually used:
Observed result:
Remaining issue:
Next action:
```

Only claim `ACCEPTED` when the requested effect was observed.

## Trigger examples

Use this skill for requests such as:

- "give this task to Browser Agent and keep going until it finishes"
- "run this through Browser Agent"
- "continue the Browser Agent loop"
- "let the agent use whatever tools it needs and report back"
- "use the visible agent UI so I can see what it is doing"
- "do this on my machine with my logged-in browser"
- "send it to the Browser Agent and follow up if it gets stuck"
- "run multiple rounds, not just one response"
- "have Browser Agent read the instruction conversation, do the work, and come back with the result"
