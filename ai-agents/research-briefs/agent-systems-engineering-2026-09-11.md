# Agent Systems Engineering Brief — September 4–11, 2026

Status: **RESEARCHED / PROJECT APPLICATION REQUIRES LIVE VALIDATION**  
Published: 2026-09-11

The strongest practical result is that agent configuration, skills, hooks, and MCP declarations form a measurable software-supply-chain layer. Persistent skill evolution can improve performance, but accepted revisions can also become churn without task recovery.

## Evidence-ranked shortlist

### 1. Scanning the Harness

**Evidence: strong empirical evidence with conservative validation**

The study scanned 3,171 repositories. Confirmed rates were 9.8% unpinned MCP references, 3.1% broad execution hidden behind narrow-looking grants, 3.8% skills pre-authorizing shell, and 16.0% with at least one confirmed security defect. The raw scanner reported 25.5%, demonstrating that automated candidates require revalidation. No credential-exfiltration path was confirmed.

Source: [Scanning the Harness, September 7](https://arxiv.org/abs/2609.07360)

Project implication: lock source, resolved version, digest, requested capabilities, and approval policy for instructions, skills, hooks, MCP servers, and tools. Parse authority expressions rather than trusting display strings.

### 2. From Interaction Traces to Persistent Skills

**Evidence: promising longitudinal experiment; causal certainty limited**

Across four OSWorld domains, evolving skills improved post-warm-up results by 5.7–18.6 percentage points over an empty-library control. GIMP showed 43.3% cross-origin retrieval, but one repeatedly revised skill family succeeded only 2 of 35 times.

Source: [From Interaction Traces to Persistent Skills, September 4](https://arxiv.org/abs/2609.04869)

Project implication: use immutable snapshots, evidence-bound promotion, downstream recovery measurement, `REVISION_CHURN`, quarantine, and rollback. A mutation event is not improvement evidence.

### 3. VEX-Bench

**Evidence: strong benchmark construction; moderate sample size**

The benchmark contains 75 expert-labeled GitHub cases across Python, Java, and Go. Strong systems approached 80% F1 on binary exploitability, while only one exceeded 70% macro-F1 for the precise justification.

Source: [VEX-Bench, September 7](https://arxiv.org/abs/2609.08040)

Project implication: require call path, affected/resolved versions, reachability, prerequisites, inspected evidence, and an explicit falsifier. A correct label with irreproducible reasoning remains incomplete.

### 4. Q2D-Web

**Evidence: strong dataset scale; labels partly indirect**

Q2D-Web provides 190 million documents and 70,000 agent-reformulated queries in ten languages across 13 retrievers. Ranking varies by topic, language, and query type. A selected one-third corpus preserved ranking but raised absolute Recall@1000 by 3–7 points.

Source: [Q2D-Web, September 8](https://arxiv.org/abs/2609.08887)

Project implication: retain original and machine-written queries separately; score retrieval by query type; test over-specific, underspecified, and terminology-drifted reformulations.

### 5. vLLM 0.29.0

**Evidence: strong implementation evidence; performance configuration-specific**

The release adds bounded queue admission, per-request speculative-decoding observations, deterministic distributed prefix-cache hashing, and Model Runner V2 as default. Reported 9–25% TTFT improvement is limited to Mamba internal-prefill caching.

Source: [vLLM 0.29.0, September 9](https://github.com/vllm-project/vllm/releases/tag/v0.29.0)

Project implication: adopt request/token admission limits and per-request observations, but benchmark local runtimes with agent-shaped workloads and the exact target hardware.

## Rejected or downgraded claims

- AgentAudit trust percentages: nine tasks and a single fixed judge that was also evaluated.
- Broad black-box risk percentages: two architectures and heavy automated-judge dependence.
- General self-improvement claims: contradicted by observed revision churn.
- Routine runtime commits: no demonstrated end-to-end tool-agent reliability improvement.

## Ranked implementation order

1. Locked capability manifest for skills, hooks, MCP servers, and tools.
2. Revision-churn detection, quarantine, and rollback.
3. Reproducible exploitability evidence.
4. Original-versus-reformulated retrieval evaluation.
5. Admission control and per-request runtime observations.

## Evidence classification rule

Do not upgrade a research recommendation to `IMPLEMENTED` or `PROVEN` until the active project imports it, focused and broad validation pass, and runtime evidence supports the exact claim.
