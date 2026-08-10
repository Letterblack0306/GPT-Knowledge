# Telegram Platform Integration: Bot API, Local Bot API Server, MTProto, and TL Schema

## Knowledge metadata

- Last reviewed: 2026-08-10
- Purpose: provide a canonical Telegram integration reference for agent/runtime work that must distinguish bot-facing HTTP integration from full Telegram client protocol integration
- Canonical status: primary GPT-Knowledge entry for Telegram platform architecture
- Confidence: high for the distinctions and capabilities directly documented by Telegram/TDLib; current schema layer and upstream implementation details must be revalidated before implementation
- Primary sources:
  - https://github.com/tdlib/telegram-bot-api
  - https://core.telegram.org/mtproto
  - https://core.telegram.org/schema

## Core rule

Do not treat "Telegram integration" as one API surface.

Establish which authority is actually required:

```text
Bot behavior through Telegram's bot interface
  -> Bot API

Self-hosted Bot API transport / local file and webhook capabilities
  -> telegram-bot-api server

Full Telegram client behavior or direct Telegram API access
  -> MTProto + current Telegram API TL schema
```

The Bot API and MTProto solve different integration problems. Do not switch to MTProto merely because it is lower-level or more capable.

---

# 1. Telegram Bot API server

The official `tdlib/telegram-bot-api` project is a server implementation of the Telegram Bot API. The Bot API itself is an HTTP API for creating and operating Telegram bots.

The local server still exposes Bot API semantics; self-hosting it does not turn a bot integration into a general Telegram client.

## Required credentials for the local server

The server requires Telegram application credentials:

```text
api_id
api_hash
```

They can be supplied with the server's `--api-id` and `--api-hash` options or the corresponding environment variables documented by the project.

These application credentials are distinct from a bot token. Keep application identity, bot identity, and runtime secrets separate in configuration and evidence.

## Local mode

Launching the Bot API server with `--local` enables capabilities beyond the hosted `api.telegram.org` Bot API endpoint. The upstream project currently documents capabilities including:

- downloading files without the hosted Bot API file-size limit;
- uploading files up to 2000 MB;
- uploading by local filesystem path / file URI;
- using HTTP webhook URLs;
- using local IP addresses for webhooks;
- using arbitrary webhook ports;
- raising `max_webhook_connections` up to 100000;
- receiving absolute local file paths in `file_path` from `getFile`.

Treat these as local-server deployment capabilities, not generic properties of every Telegram bot endpoint.

## Transport boundary

The local Bot API server accepts HTTP requests. If it must be exposed remotely over HTTPS, TLS termination belongs in a separate proxy/load-balancer boundary.

The project's documented default HTTP port is 8081, configurable through `--http-port`.

## Moving a bot between hosted and local Bot API servers

A bot should not be assumed to receive updates correctly from multiple Bot API servers simultaneously.

The upstream project documents `logOut` as part of moving a bot away from the hosted Bot API server, and warns that simultaneous logins on multiple Bot API servers do not guarantee delivery of all updates. Migration between local servers also requires explicit lifecycle handling.

For runtime design, model this as exclusive bot-server ownership rather than an interchangeable stateless endpoint switch.

---

# 2. MTProto is the client protocol, not the Bot API

MTProto is Telegram's protocol for applications that access Telegram's server API directly.

Telegram describes MTProto as three largely independent components:

```text
High-level component
  -> RPC/API query language and binary message representation

Cryptographic / authorization layer
  -> authorization and encryption

Transport component
  -> delivery over transports such as TCP, HTTP(S), WS/WSS
```

Current Telegram clients use MTProto 2.0; MTProto 1.0 is deprecated.

## Session semantics

An MTProto session belongs to the client application/device authorization context, not to one particular TCP, HTTP, or WebSocket connection.

Multiple connections may serve one session, and a response is not required to return over the same connection that carried the request. Therefore:

```text
transport connection identity != MTProto session identity
```

Do not design Telegram client state around the assumption that reconnecting a socket creates a new logical Telegram session.

## Authorization key

Telegram documents authorization-key creation as an early client operation. The authorization key is normally persistent rather than regenerated for every network connection.

Authorization/session state is therefore durable security-sensitive state and must not be treated like disposable transport metadata.

## Time synchronization

MTProto message identifiers are time-sensitive. Large client/server clock divergence can cause messages to be rejected or ignored. Telegram's protocol includes synchronization behavior for correcting the client/server time difference.

For client implementations, clock/session problems belong in protocol-state diagnosis before treating them as ordinary network failures.

## Transport choices

Telegram documents multiple MTProto transport forms, including TCP, HTTP/HTTPS, and WebSocket/WSS, with MTProto-specific framing layered above the underlying network transport.

Selecting a transport is therefore separate from selecting the Telegram API method or authorization model.

---

# 3. TL schema and API layers

Telegram publishes the current API as a TL schema.

The schema defines Telegram API constructors and methods and is versioned by API layer. The official schema page also links to a detailed JSON representation and to the separate end-to-end-encryption TL schema.

At review time on 2026-08-10, the official schema page identifies the current API as **Layer 223**. This number is time-sensitive and must be revalidated before implementation or compatibility claims.

## Engineering rule

Do not hard-code assumptions that a constructor, flag, field, or method signature is timeless.

Before implementing or debugging direct Telegram API behavior:

```text
1. identify the client/library's supported API layer
2. check the current official TL schema
3. compare the required constructor/method signature
4. check layer-specific additions or removals
5. validate serialization/deserialization against the active library/runtime
```

A schema mismatch is an integration/versioning failure, not necessarily an authentication or transport failure.

---

# 4. Selection guide for agent/runtime projects

Use this decision boundary:

| Requirement | Start with |
|---|---|
| Receive/send messages as a bot | Bot API |
| Bot webhooks or polling | Bot API |
| Self-host Bot API for local files or expanded upload/webhook limits | Local `telegram-bot-api` server |
| Operate as a Telegram user/client | MTProto-capable client library |
| Direct access to Telegram API methods not exposed through Bot API | MTProto + current TL schema |
| Debug constructor/method/flag incompatibility | Current TL schema + client library layer support |
| Debug local Bot API file/webhook behavior | `telegram-bot-api` server docs/runtime |

Choose the smallest authority that satisfies the requirement.

---

# 5. Runtime architecture guidance

For an agent such as Brew, keep Telegram integration layered:

```text
Brew reasoning identity
  -> Telegram capability adapter
       -> Bot API mode
            -> hosted api.telegram.org
            OR local telegram-bot-api server
       OR
       -> MTProto client mode
            -> client session/auth state
            -> current TL schema compatibility
```

Do not expose Bot API, local-server lifecycle, MTProto session state, and raw schema operations as one undifferentiated "telegram" capability.

Track at least:

```text
integrationMode        bot_api | local_bot_api | mtproto
endpointRef
credentialRef
sessionStateRef        # MTProto/client mode when applicable
configured
reachable
authenticated
healthy
apiLayer               # direct Telegram client mode when applicable
lastValidatedAt
```

Keep the standard capability distinction:

```text
configured != reachable != authenticated != capable != healthy
```

---

# 6. Security and authority boundaries

- Keep bot tokens, `api_id`/`api_hash`, and MTProto authorization/session material in separate secret-backed fields.
- Do not log raw credentials or authorization/session keys as evidence.
- Treat a local Bot API server as a network service with its own bind/exposure/TLS boundary.
- Treat MTProto authorization/session state as durable sensitive state.
- Follow Telegram's current security guidelines when implementing client software.
- A schema entry proves a Telegram API construct exists; it does not prove the active client library supports it.
- A configured Telegram endpoint is not proof of update delivery, authentication, or bot/client health.

---

# 7. Debugging method

Classify the failure before changing the Telegram implementation.

```text
Bot request rejected
  -> Bot API method + token/auth + endpoint response

Local Bot API server unreachable
  -> process/bind/port/TLS-proxy health

Bot stops receiving updates after server migration
  -> Bot API server ownership / logOut / webhook lifecycle

MTProto reconnect behaves unexpectedly
  -> distinguish transport connection from logical session

Direct API method/constructor fails to decode
  -> client API layer vs current TL schema

Messages rejected around clock drift
  -> MTProto session/time synchronization evidence
```

Use `ai-agents/unified-agent-engineering-methods.md` for the general evidence/authority/debugging sequence, and this document for Telegram-specific protocol boundaries.

---

# 8. Source freshness rule

Telegram's API schema and Bot API implementation evolve.

Before copying exact limits, layer numbers, constructors, methods, flags, or deployment options into product code:

1. re-open the official upstream source;
2. record the source revision/date or API layer;
3. verify the active library/runtime actually implements it;
4. then update project-specific code and tests.

GPT-Knowledge is guidance. Live Telegram documentation, active library source, and runtime evidence remain implementation authority.
