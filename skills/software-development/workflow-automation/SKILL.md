---
name: workflow-automation
description: "Automate repeatable workflows with idempotent steps."
version: 0.1.0
author: darkvirgoyt-beep, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [automation,workflow,devops]
    related_skills: []
---

# Workflow Automation

Use when automate repeatable workflows with idempotent steps.

## Procedure

1. List steps and failure modes.
2. Draft idempotent actions.
3. Check retries and notifications.

## Verification

- Run workflow on test fixture.
- No partial state on failure.
- Check cleanup and backoff.
