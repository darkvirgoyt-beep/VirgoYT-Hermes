---
name: cpp-debugging
description: "Debug C++ ABI, UB, and build/link errors."
version: 0.1.0
author: darkvirgoyt-beep, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [cpp,debugging]
    related_skills: []
---

# Cpp Debugging

Use when debug c++ abi, ub, and build/link errors.

## Procedure

1. Capture compiler/linker errors.
2. Inspect headers and ABI.
3. Check stdlib/toolchain versions.

## Verification

- Run minimal reproducer.
- No ABI regression.
- Check compiler flags.
