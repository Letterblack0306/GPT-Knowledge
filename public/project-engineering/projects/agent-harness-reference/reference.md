# DeepSeek Agent Harness — Compatibility Reference

## Classification

`ADOPTION_UNPROVEN`

This record is an external implementation reference and compatibility audit. It is not Brew runtime authority and does not authorize replacing Brew's current runtime.

## Verified external capability

Official Harness material describes plugin-based services for:

- models;
- tools;
- sessions;
- sandboxes;
- storage;
- agent loops;
- scheduling;
- UI/session events.

Harness remains a developer preview with evolving APIs.

Sources:

- https://www.deepseek.com/harness/en/
- https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/framework/service.md
- https://www.youtube.com/watch?v=Hpw4fAHlHDw

## Compatibility result

| Brew owner | Harness match | Result |
| --- | --- | --- |
| Provider routing and truth | LLM service | Adapter required |
| Tools and capabilities | Tools service | Adapter required; raw dispatch conflicts with Brew policy and receipts |
| Sessions and persistence | Session log/storage plugins | Adapter required |
| Workspace identity and confinement | Filesystem/sandbox plugins | Brew must remain authority |
| Approvals and governance | No verified equivalent | Missing or unproven |
| Receipts and evidence | Append-only trajectory | Adapter required; not equivalent to Brew chained receipts |
| UI projection | UI/session-event plugins | Adapter required |

## Local validation boundary

The compatibility audit retained these Brew regression results:

- resource-policy: 13 passed;
- autonomy: 10 passed;
- memory/session: 18 passed.

The Harness executable/package was not present locally. No governed Brew-style Harness task was run. These tests protect existing Brew boundaries; they do not prove Harness adoption.

## Workspace implementation decision

The GPT-Knowledge workspace may project this reference, mapping and blocked acceptance gate. It must not label Harness as implemented, adopted or runtime-proven.

Before adoption can be reconsidered, evidence must prove:

1. approval enforcement;
2. workspace confinement under Brew authority;
3. Brew receipt compatibility;
4. restart/session identity;
5. truthful UI projection;
6. one governed end-to-end Brew-style Harness task.

Until then, preserve Brew as the authority for workspace identity, policy, approvals, governed execution, persistence and chained receipts.
