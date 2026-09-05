---
name: rust-debugging
description: "Debug Rust compile errors, lifetimes, and panics."
version: 0.1.0
author: darkvirgoyt-beep, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [rust,debugging]
    related_skills: []
---

# Rust Debugging

Use when debug rust compile errors, lifetimes, and panics.

## Procedure

1. Read compiler message and code.
2. Trace ownership and borrowing.
3. Check trait bounds and cfg.

## Verification

- Run cargo check/test.
- No unsafe regression.
- Check edition and MSRV.
