---
name: stream-testing
description: "Test stream jobs with replay and order assumptions."
version: 0.1.0
author: darkvirgoyt-beep, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [streaming,testing,kafka]
    related_skills: []
---

# Stream Testing

Use when test stream jobs with replay and order assumptions.

## Procedure

1. Define event contract and order.
2. Draft replay and validation tests.
3. Check late data and duplicates.

## Verification

- Run with recorded stream.
- No state corruption.
- Check consumer group behavior.
