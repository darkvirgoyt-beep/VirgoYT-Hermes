---
name: skill-generator
description: "Generate new in-repo skills from a short brief."
version: 0.1.0
author: darkvirgoyt-beep, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [skills, scaffolding, generation, meta]
    related_skills: [hermes-agent-skill-authoring, architecture-led-fix]
---

# Skill Generator

Use this skill when the user wants a new skill created quickly.

## Inputs

- `name`: lowercase-hyphenated skill name
- `description`: <=60 chars, one sentence, ends with period
- `category`: existing category under `skills/`
- `body`: markdown body with When to Use / Procedure / Verification at minimum

## Outputs

Create under `skills/<category>/<name>/SKILL.md`.

## Fast Template

Use this template unless the user asks for something specific:

```md
---
name: <name>
description: "<description>"
version: 0.1.0
author: darkvirgoyt-beep, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [<category>]
    related_skills: []
---

# <Title>

Use when <trigger>.

## Procedure

1. <step>
2. <step>
3. <step>

## Verification

- <check>
- <check>
```

## Batch Mode

If the user provides a list of skills, generate them all in one write_file batch or via a script. Keep each SKILL.md under ~100 lines.
