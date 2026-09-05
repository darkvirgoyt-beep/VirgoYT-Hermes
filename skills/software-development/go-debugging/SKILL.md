---
name: go-debugging
description: "Debug Go race, build, and goroutine issues."
version: 0.1.0
author: darkvirgoyt-beep, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [go,debugging]
    related_skills: []
---

# Go Debugging

Use when debug go race, build, and goroutine issues.

## Procedure

1. Read panic/log output.
2. Trace goroutine and channels.
3. Check module versions.

## Verification

- Run go test -race.
- No deadlock regression.
- Check Go version/modules.
