---
name: terraform-debugging
description: "Debug Terraform plan/apply and provider errors."
version: 0.1.0
author: darkvirgoyt-beep, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [terraform,debugging]
    related_skills: []
---

# Terraform Debugging

Use when debug terraform plan/apply and provider errors.

## Procedure

1. Read plan/apply error output.
2. Inspect state and providers.
3. Check versions and backend.

## Verification

- Run terraform plan.
- No state drift regression.
- Check provider versions.
