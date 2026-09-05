---
name: cqrs-design
description: "Separate command and query models safely."
version: 0.1.0
author: darkvirgoyt-beep, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [cqrs,read-model,events]
    related_skills: []
---

# Cqrs Design

Use when separate command and query models safely.

## Procedure

1. Define command and query boundaries.
2. Draft handlers and projections.
3. Check consistency and sync.

## Verification

- Validate read-model correctness.
- No stale-read surprise.
- Check consistency SLAs.
