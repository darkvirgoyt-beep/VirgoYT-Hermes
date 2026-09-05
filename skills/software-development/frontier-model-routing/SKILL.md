---
name: frontier-model-routing
description: "Route tasks to frontier models with exact IDs and selection rules."
version: 0.1.0
author: darkvirgoyt-beep, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [llm, routing, providers, models, frontier]
    related_skills: [systematic-debugging, architecture-led-fix]
---

# Frontier Model Routing

Use this skill when choosing, switching, or configuring frontier models.

## Verified Model Catalog

| User Label | Model | Provider | Model ID | Context | Max Output | Notes |
|---|---|---|---|---|---|---|
| Claude Opus 4.8 | Claude Opus 4.8 | Anthropic | `claude-opus-4-8` | 1M | 128K | Legacy; migrate to Opus 5 |
| Fable 51 | Claude Fable 5.1 | Anthropic | `claude-fable-5-1` | 1M | 128K | GA Sept 1 2026 |
| Mythos | Claude Mythos 5.1 | Anthropic | `claude-mythos-5-1` | 1M | 128K | Same weights as Fable 5.1; restricted access |
| Nemorton 3 Utra | Nemotron 3 Ultra | NVIDIA | `nemotron-3-ultra-550b-a55b` | 1M | 128K | 550B total / 55B active |
| Moonshot Kimi 3 Quwen | Kimi K3 | Moonshot AI | `kimi-k3` | 1M | 1M | 2.8T params; open-weight |
| GPT Luna 5.6 | GPT Luna 5.6 | OpenAI | `gpt-luna-5.6` | 1.1M | 128K | Low-cost tier |

## Selection Rules

- Use Fable 5.1 for general agentic coding and knowledge work.
- Use Mythos 5.1 only if the deployment supports Project Glasswing / trusted access.
- Use Opus 4.8 only for legacy migration paths.
- Use Kimi K3 when open-weight or Chinese-language scaling matters.
- Use Nemotron 3 Ultra for long-running agentic workloads with local/HPC inference.
- Use GPT Luna 5.6 when cost matters more than peak capability.

## Verification

- Model IDs match provider docs.
- Context/output limits fit the task.
- Access restrictions are respected.
