---
name: ansible-debugging
description: "Debug Ansible playbooks, vars, and connectivity."
version: 0.1.0
author: darkvirgoyt-beep, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [ansible,debugging]
    related_skills: []
---

# Ansible Debugging

Use when debug ansible playbooks, vars, and connectivity.

## Procedure

1. Read task failure and vars.
2. Inspect inventory and facts.
3. Check connection plugins.

## Verification

- Run ansible-playbook --check.
- No idempotency regression.
- Check Ansible version.
