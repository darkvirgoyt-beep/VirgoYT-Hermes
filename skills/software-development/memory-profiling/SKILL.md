---
name: memory-profiling
description: "Profile heap, leaks, and allocation hotspots."
version: 0.1.0
author: darkvirgoyt-beep, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [memory,profiling,debugging]
    related_skills: []
---

# Memory Profiling

Use when profile heap, leaks, and allocation hotspots.

## Procedure

1. Capture heap and timeline.
2. Identify retained objects.
3. Check listener/handle leaks.

## Verification

- Run heap diff before/after.
- No leak regression.
- Check platform-specific behavior.
