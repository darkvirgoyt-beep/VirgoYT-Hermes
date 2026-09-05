---
name: cache-architecture
description: "Design cache layers, keys, and invalidation."
version: 0.1.0
author: darkvirgoyt-beep, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [cache,architecture,performance]
    related_skills: []
---

# Cache Architecture

Use when design cache layers, keys, and invalidation.

## Procedure

1. Identify hot reads and writes.
2. Draft cache tiers and TTLs.
3. Check invalidation and stampedes.

## Verification

- Validate hit/miss behavior.
- No stale data surprise.
- Check eviction policy.
