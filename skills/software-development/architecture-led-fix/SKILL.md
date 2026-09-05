---
name: architecture-led-fix
description: Architecture-aware debugging: map project structure first, then fix.
version: 0.1.0
author: darkvirgoyt-beep, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [architecture, debugging, fix, memory, drift, recovery]
    related_skills: [systematic-debugging, simplify-code]
---

# Architecture-led Fix

Treat every error as an architecture question first: what, why, where, who.
Use this when the user asks to fix an error, bug, or crash in a known codebase.

## Core Rule

NEVER patch before you know:
- what the exact error is
- why it is happening in this codebase
- where it is in the architecture
- who/what caller/component is involved

## Memory and Drift

Maintain a stable architecture snapshot under
`skills/software-development/architecture-led-fix/references/`:
- `modules.md`
- `layers.md`
- `entrypoints.md`
- `change-log.md`

If `change-log.md` or recent commits show post-baseline drift:
1. Update the snapshot files.
2. Re-verify routing, data flow, ownership, and config before editing.

## Procedure

1. Identify the exact failure from user report or tool output.
2. Read the stack, file paths, and recent commits.
3. Map the affected area to architecture docs/snapshot.
4. Trace callers, callees, config, and env.
5. Create a minimal repro if possible.
6. Propose the smallest fix at the true root layer.
7. Update architecture memory when structure changes.
8. Run targeted verification, then summarize.

## Verification

- Repro reproduces the reported symptom.
- Fix resolves the repro.
- Adjacent behavior unchanged.
- Architecture snapshot updated if structure changed.
