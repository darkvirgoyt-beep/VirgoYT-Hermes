---
name: redis-caching
description: "Design cache keys, TTLs, and invalidation rules."
version: 0.1.0
author: darkvirgoyt-beep, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [redis,cache,performance]
    related_skills: []
---

# Redis Caching

Use when design cache keys, ttls, and invalidation rules.

## Procedure

1. Identify hot reads and latency.
2. Define key schema and TTLs.
3. Check invalidation and stampede protection.

## Verification

- Validate hit/miss behavior.
- No stale data regression.
- Check eviction policy.
