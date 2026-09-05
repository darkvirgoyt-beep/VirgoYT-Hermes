---
name: queue-design
description: "Design message queues, retries, and DLQ handling."
version: 0.1.0
author: darkvirgoyt-beep, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [queue,messaging,reliability]
    related_skills: []
---

# Queue Design

Use when design message queues, retries, and dlq handling.

## Procedure

1. Define producer/consumer contracts.
2. Choose broker and topology.
3. Check retries, ordering, and backpressure.

## Verification

- Validate with load tests.
- No message loss regression.
- Check dead-letter handling.
