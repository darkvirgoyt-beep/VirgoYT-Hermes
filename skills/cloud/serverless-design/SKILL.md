---
name: serverless-design
description: "Design serverless functions, events, and cold-start handling."
version: 0.1.0
author: darkvirgoyt-beep, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [serverless,cloud,events]
    related_skills: []
---

# Serverless Design

Use when design serverless functions, events, and cold-start handling.

## Procedure

1. Define event sources and contracts.
2. Draft function boundaries and timeouts.
3. Check cold-start and retries.

## Verification

- Validate with load and errors.
- No hidden warm-instance dependency.
- Check provider limits.
