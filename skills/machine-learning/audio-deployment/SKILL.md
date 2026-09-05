---
name: audio-deployment
description: "Deploy speech/audio models with format and latency checks."
version: 0.1.0
author: darkvirgoyt-beep, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [audio,speech,deployment]
    related_skills: []
---

# Audio Deployment

Use when deploy speech/audio models with format and latency checks.

## Procedure

1. Define audio format and SLA.
2. Package resampling and model.
3. Check noise robustness.

## Verification

- Validate with speech tests.
- No format regression.
- Check platform support.
