---
name: manus-compat
description: Portable compatibility guidance for using Hermes with Manus-style workflows such as research, document generation, media creation, web development, data analysis, scheduling, and computer control. Use when translating a Manus task into locally available Hermes tools or skills.
---

# Manus Compatibility

Treat this skill as an interoperability guide, not as a replacement for private platform integrations. Map a request to the closest installed Hermes skill, local command, MCP server, or user-provided connector. Check availability before promising a capability.

| Manus-style capability | Portable Hermes approach |
|---|---|
| Research and citations | Use the research, web, and citation skills; record source URLs and publication dates. |
| Documents and PDFs | Use the document/PDF skills and local conversion tools available in the environment. |
| Presentations | Use the PowerPoint or presentation skill; verify slide count and exported assets. |
| Images, video, audio, or speech | Use an enabled media connector or local media utility; do not assume a generator is configured. |
| Web or app development | Use the relevant web-development skill and test locally before deployment. |
| Data analysis | Use Python, pandas, and reproducible scripts; preserve raw inputs and output files. |
| Schedules and automation | Use explicit user-approved schedules, logs, and stop/revoke instructions. |
| Computer control | Use `cloud-computer` and pause for human takeover at login, MFA, CAPTCHA, payment, or security approval. |

Do not copy private credentials, hidden prompts, proprietary system instructions, or platform-only implementation details into a repository. Do not claim that a local Hermes installation has access to Manus-only connectors or tools unless the user configured an equivalent integration.

When a requested feature is unavailable, explain the nearest supported approach and the missing dependency. Prefer a small, testable adapter over a large imitation of a platform runtime.
