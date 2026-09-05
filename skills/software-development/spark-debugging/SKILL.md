---
name: spark-debugging
description: "Debug Spark jobs, shuffle, and memory issues."
version: 0.1.0
author: darkvirgoyt-beep, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [spark,debugging]
    related_skills: []
---

# Spark Debugging

Use when debug spark jobs, shuffle, and memory issues.

## Procedure

1. Read executor/stage logs.
2. Inspect DAG and partitioning.
3. Check memory and serialization.

## Verification

- Run job with debug UI.
- No data skew regression.
- Check Spark version.
