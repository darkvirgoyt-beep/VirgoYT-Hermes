---
name: database-schema-migration
description: "Manage schema changes with safe rollout and rollback."
version: 0.1.0
author: darkvirgoyt-beep, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [database,migration,schema]
    related_skills: []
---

# Database Schema Migration

Use when manage schema changes with safe rollout and rollback.

## Procedure

1. Review schema change intent.
2. Draft migration and backfill.
3. Check locking and downtime.

## Verification

- Validate migrate/rollback.
- No data loss or long lock.
- Check compatibility window.
