---
name: security-audit
description: "Audit code, auth, secrets, and dependency risk."
version: 0.1.0
author: darkvirgoyt-beep, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [security,audit,owasp]
    related_skills: []
---

# Security Audit

Use when audit code, auth, secrets, and dependency risk.

## Procedure

1. Inventory sensitive paths.
2. Scan auth/secrets/dependencies.
3. Map trust boundaries and inputs.

## Verification

- Check findings against exploits.
- No secret exposure.
- Verify fixes with scans.
