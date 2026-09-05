---
name: orm-optimization
description: "Fix ORM N+1, hydration, and transaction issues."
version: 0.1.0
author: darkvirgoyt-beep, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [orm,sql,performance]
    related_skills: []
---

# Orm Optimization

Use when fix orm n+1, hydration, and transaction issues.

## Procedure

1. Capture slow queries and logs.
2. Inspect ORM mappings and sessions.
3. Check eager loading and transactions.

## Verification

- Run query plan and load tests.
- No N+1 regression.
- Check transaction boundaries.
