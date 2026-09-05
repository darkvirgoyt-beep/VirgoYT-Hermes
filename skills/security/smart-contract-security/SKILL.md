---
name: smart-contract-security
description: "Audit smart contracts for reentrancy, access, and upgrades."
version: 0.1.0
author: darkvirgoyt-beep, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [smart-contracts,security,blockchain]
    related_skills: []
---

# Smart Contract Security

Use when audit smart contracts for reentrancy, access, and upgrades.

## Procedure

1. Inventory functions and owners.
2. Scan for known vulnerability classes.
3. Check upgrade and access controls.

## Verification

- Validate with fuzz/static analysis.
- No unprotected critical function.
- Check test coverage.
