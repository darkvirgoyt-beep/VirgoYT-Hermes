---
name: event-sourcing
description: "Model state from immutable event logs."
version: 0.1.0
author: darkvirgoyt-beep, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [event-sourcing,cqrs,events]
    related_skills: []
---

# Event Sourcing

Use when model state from immutable event logs.

## Procedure

1. Define event schema and store.
2. Draft projections and read models.
3. Check idempotency and snapshots.

## Verification

- Validate replay and projections.
- No lost events.
- Check event versioning.
