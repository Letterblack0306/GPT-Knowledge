# Machine Capability Discovery and Governed Execution

Status: canonical cross-project agent-runtime reference

Purpose: prevent agent products from confusing a currently registered tool manifest with the complete capability set of the host machine.

## Core rule

> Registered tools describe the callable adapters exposed to the model right now. They do not prove that every unregistered machine capability is unavailable.

A professional local agent should be able to inspect the environment it is actually running in and discover relevant capabilities on demand. Execution authority remains deterministic and separate from discovery.

Canonical split:

```text
machine/environment reality
        ↓
capability discovery
        ↓
current runtime adapters
        ↓
model chooses an action
        ↓
deterministic governance / workspace boundary
        ↓
real execution
        ↓
evidence
```

Do not implement:

```text
hard-coded tool/executable list
        ↓
assume everything else is impossible
```

## Discovery is not authority

These are distinct facts:

```text
python.exe detected on PATH
```

means:

```text
machine capability: observed available
```

It does not mean:

```text
agent authority: unrestricted Python execution anywhere on the machine
```

The runtime may expose a governed adapter for the discovered capability. Workspace containment, mutation rules, external-side-effect policy, credential boundaries, target identity, and other deterministic controls still decide whether a specific action may execute.

## Environment identity

A local runtime should observe, as relevant to the task:

- operating-system/platform identity;
- architecture;
- active workspace/repository identity;
- default/active shell identity;
- process PATH and platform executable-extension semantics such as PATHEXT on Windows;
- relevant installed executables/runtimes;
- package/build/test/runtime tools required by the active project;
- active MCP/IDE/browser/runtime integrations;
- current provider/model capabilities.

Do not infer shell semantics from path formatting alone. Do not hard-code development-machine paths, usernames, ports, browser profiles, or executable locations as product architecture.

Discovery should be bounded and demand-driven. Do not recursively inventory the whole host or poll installed software continuously just because machine discovery exists.

## Executable discovery

Prefer resolving a requested bare executable against the live environment rather than maintaining one permanent product-level allowlist such as:

```text
git
node
npm
npx
```

A project may legitimately need:

```text
python
python3
dotnet
cargo
rustc
go
java
gradle
cmake
ninja
ffmpeg
bun
deno
msbuild
```

or another executable not known when the agent product was built.

A missing executable should therefore be reported from actual discovery evidence, for example:

```text
capability: unavailable
reason: executable not resolved from active PATH
```

not:

```text
capability: unavailable
reason: not present in our predefined list
```

## Shell boundary

Machine adaptation does not require exposing an unrestricted general-purpose shell string interface.

Prefer typed/literal execution where possible:

```text
executable + argv + cwd + timeout
```

with shell composition disabled.

Shell interpreters or script wrappers may require dedicated adapters on some operating systems. Treat that as an execution-mechanism concern, not a reason to hard-code the machine capability universe. If a wrapper cannot be invoked safely under the current runtime contract, return that exact limitation and use a dedicated adapter rather than silently substituting another command.

## Tool registry semantics

A tool registry should support dynamic registration and removal as runtime capabilities change.

Examples:

- MCP server connects -> register its tools;
- MCP server disconnects -> remove them;
- IDE/LSP attaches -> expose semantic code capabilities;
- browser runtime attaches -> expose browser capabilities;
- environment resolver observes a relevant executable -> the runtime may execute it through an existing governed terminal adapter or register a typed capability when appropriate.

Do not force every discovered executable into the model tool schema. A generic governed literal-execution adapter plus explicit environment-discovery capability may be sufficient.

## Cline reference

Current Cline SDK is useful provenance for the extensibility principle: its agent can be supplied arbitrary custom tools, plugins may register tools dynamically, and the same agent runtime can combine file, shell, web/API and custom capabilities. Cline's VS Code terminal layer also resolves and operates against the actual terminal/shell environment rather than defining host capability from a tiny static command inventory.

Use these as architectural references only. Access/Letterblack authorization behavior remains project-specific; do not inherit Cline approval semantics automatically.

## GPT-Knowledge alignment

This rule extends `professional-agent-runtime-cli-and-provider-architecture.md`, which already requires the runtime to know shell/environment identity and distinguishes bounded command execution, interactive terminal sessions and background processes.

It also follows `agent-reasoning-transport-boundary.md`:

> Agents reason; bridges transport.

Capability discovery gives the reasoning agent better evidence. It must not move semantic reasoning into bridges or replace deterministic governance with model discretion.

## Acceptance criteria

Before calling a local agent machine-adaptive, prove at least:

1. host platform/architecture/shell identity comes from the running environment rather than product constants;
2. executable discovery uses the live PATH/PATHEXT or equivalent environment;
3. an executable outside the original development-time list can be discovered and used through a governed adapter;
4. an absent executable produces observed unavailability rather than a guessed conclusion;
5. execution remains workspace/governance scoped;
6. shell composition or privileged/destructive authority is not implicitly granted by discovery;
7. MCP/IDE/browser/tool registries may expand and contract dynamically;
8. UI/tool manifests are described as current adapters, not the complete machine capability universe;
9. no background software inventory or capability polling runs without a concrete need;
10. runtime evidence records the actual executable/cwd/result used for execution.

## Final rule

**Discover broadly enough to understand the active machine and project; authorize narrowly enough to keep deterministic boundaries. Tool availability is runtime state, not a permanent definition of what the machine can do.**
