---
name: pytorch-debugging
description: "Debug PyTorch CUDA, autograd, and training issues."
version: 0.1.0
author: darkvirgoyt-beep, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [pytorch,debugging]
    related_skills: []
---

# Pytorch Debugging

Use when debug pytorch cuda, autograd, and training issues.

## Procedure

1. Read runtime/cuda error.
2. Inspect model and data pipeline.
3. Check device/dtype/versions.

## Verification

- Run minimal forward/backward.
- No training regression.
- Check CUDA/torch versions.
