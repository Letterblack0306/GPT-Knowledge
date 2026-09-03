# Canonical Agent → LBE Execution Path

Status: **PATH TO FOLLOW**

This is the project-level execution path to follow for implementation decisions and acceptance sequencing.

```text
USER
  |
  v
AI AGENT / CLI
reason / propose
  |
  +---------------------------+
  |                           |
  v                           v
NORMAL                      AUDIT
task-proportional           broad/strict analysis
investigation               deeper evidence
  |                           |
  +-------------+-------------+
                |
                v
          LBE AUTHORITY
                |
     +----------+----------+
     |          |          |
     v          v          v
 identity     policy    capability
 session      scope     risk
 nonce        target    approval
     |          |          |
     +----------+----------+
                |
                v
          VALID DECISION
        ALLOW / DENY / WAIT
                |
                v
        GOVERNED ADAPTER
                |
                v
      AUTHORIZED OPERATION
 read / search / process / MCP / mutation
                |
                v
      TOOL RECEIPT + EVIDENCE
                |
                v
            VALIDATION
                |
                v
 completion / proof / recovery if required
```

## Interpretation

- The **agent/CLI reasons and proposes**.
- **Normal** and **Audit** are reasoning/investigation modes before authority-bearing execution.
- **LBE Authority** resolves identity, policy, scope, target, capability, risk and approval.
- Only a valid **ALLOW / DENY / WAIT** decision controls whether execution proceeds.
- Authority-bearing actions execute through a **governed adapter**, never through a client-side bypass.
- Governed execution may be read, search, process, MCP, mutation or another registered capability.
- Every governed operation must correlate to **ToolReceipt + evidence**.
- **Validation** determines completion/proof; rollback/recovery occurs only where required and supported.

## Implementation rule

When deciding what to implement next, follow this path from top to bottom and work only on the first missing seam in the current live product flow.

Do not:
- rebuild settled layers;
- move provider/execution authority into Rust;
- let UI become an execution owner;
- treat historical chat memory as implementation truth;
- skip LBE authorization for authority-bearing operations.

Current selected client:
`C:/LBE-TUI-Lab`

Canonical LBE authority:
`C:/Agents-Memory-Tool-v6-integration`
