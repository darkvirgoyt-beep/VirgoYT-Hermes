---
name: redis-debugging
description: "Debug Redis latency, memory, and eviction issues."
version: 0.1.0
author: darkvirgoyt-beep, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [redis,debugging]
    related_skills: []
---

# Redis Debugging

Use when debug redis latency, memory, and eviction issues.

## Procedure

1. Read slowlog and memory stats.
2. Inspect keyspace and config.
3. Check clients and persistence.

## Verification

- Run redis-cli tests.
- No data loss regression.
- Check Redis version.
