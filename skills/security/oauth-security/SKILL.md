---
name: oauth-security
description: "Audit OAuth flows, PKCE, tokens, and redirects."
version: 0.1.0
author: darkvirgoyt-beep, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [security,oauth,auth]
    related_skills: []
---

# Oauth Security

Use when audit oauth flows, pkce, tokens, and redirects.

## Procedure

1. Map auth endpoints and flows.
2. Inspect tokens and scopes.
3. Check redirect/CORS/CSRF.

## Verification

- Run auth flow tests.
- No token leakage.
- Verify state/nonce usage.
