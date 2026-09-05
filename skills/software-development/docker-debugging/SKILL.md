---
name: docker-debugging
description: "Debug Docker build, runtime, and network issues."
version: 0.1.0
author: darkvirgoyt-beep, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [docker,debugging]
    related_skills: []
---

# Docker Debugging

Use when debug docker build, runtime, and network issues.

## Procedure

1. Capture build/run logs.
2. Inspect Dockerfile layers.
3. Check network/mounts/env.

## Verification

- Rebuild with cache disabled.
- No image regression.
- Check engine version.
