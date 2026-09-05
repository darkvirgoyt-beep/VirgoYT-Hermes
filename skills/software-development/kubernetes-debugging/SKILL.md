---
name: kubernetes-debugging
description: "Debug K8s pods, services, and RBAC issues."
version: 0.1.0
author: darkvirgoyt-beep, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [kubernetes,debugging]
    related_skills: []
---

# Kubernetes Debugging

Use when debug k8s pods, services, and rbac issues.

## Procedure

1. Read pod events and logs.
2. Inspect manifests and labels.
3. Check RBAC and networking.

## Verification

- Run kubectl describe/diff.
- No cluster-wide regression.
- Check K8s version/docs.
