---
name: api-debugging
description: "Trace backend API and network failures."
version: 0.1.0
author: darkvirgoyt-beep, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [api,debugging,backend]
    related_skills: []
---

# Api Debugging

Use when trace backend api and network failures.

## Procedure

1. Reproduce the failing request.
2. Trace handler/route and DB call.
3. Inspect auth, serialization, and env.

## Verification

- Verify with curl/HTTP client.
- Adjacent endpoints still pass.
