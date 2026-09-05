---
name: model-serving
description: "Serve models with latency, scaling, and rollback."
version: 0.1.0
author: darkvirgoyt-beep, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [ml,serving,inference]
    related_skills: []
---

# Model Serving

Use when serve models with latency, scaling, and rollback.

## Procedure

1. Define latency and throughput SLA.
2. Package model and pre/postprocessing.
3. Check batching and autoscaling.

## Verification

- Validate with load tests.
- No traffic-impacting rollout.
- Check shadow/canary.
