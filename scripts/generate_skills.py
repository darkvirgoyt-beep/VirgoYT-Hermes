#!/usr/bin/env python3
"""Batch-generate skill directories from a TSV list."""
from pathlib import Path

ROOT = Path("/root/VirgoYT-Hermes/skills")

TEMPLATE = """---
name: {name}
description: "{description}"
version: 0.1.0
author: darkvirgoyt-beep, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [{tags}]
    related_skills: []
---

# {title}

Use when {trigger}.

## Procedure

1. {step1}
2. {step2}
3. {step3}

## Verification

- {verify1}
- {verify2}
"""

rows = [
("web-frontend-debugging", "software-development", "Debug React/Vue/HTML UI faults.", "web,frontend,debugging", "Capture console/network errors.", "Map components and state flow.", "Inspect render boundaries and props.", "Verify fix in browser/devtools.", "No regression in adjacent screens."),
("api-debugging", "software-development", "Trace backend API and network failures.", "api,debugging,backend", "Reproduce the failing request.", "Trace handler/route and DB call.", "Inspect auth, serialization, and env.", "Verify with curl/HTTP client.", "Adjacent endpoints still pass."),
("database-debugging", "software-development", "Diagnose DB schema, query, and migration issues.", "database,debugging,sql", "Identify failing query or migration.", "Inspect schema, indexes, and relations.", "Check ORM mappings and transactions.", "Run migration/query plan check.", "Verify data consistency."),
("mobile-debugging", "software-development", "Debug iOS/Android/Expo app issues.", "mobile,debugging,expo", "Reproduce on device/simulator.", "Inspect logs, permissions, and native bridges.", "Trace navigation and async state.", "Verify on target OS version.", "No crash or permission regression."),
("ai-prompt-engineering", "research", "Craft prompts for stronger model output.", "prompting,llm,ai", "Define exact task and output schema.", "Add chain-of-thought and constraints.", "Include self-verification step.", "Evaluate output quality and drift.", "Repeat with refined prompt."),
("rag-engineering", "research", "Build and debug retrieval-augmented generation.", "rag,llm,search", "Audit retrieval recall and chunks.", "Inspect embedding and ranking.", "Check prompt injection risks.", "Measure groundedness and latency.", "Verify citations and freshness."),
("agent-design", "autonomous-ai-agents", "Design tool-using agent loops safely.", "agents,autonomy,tools", "List goals, tools, and constraints.", "Add approval gates and timeouts.", "Implement memory and recovery.", "Test on 10+ task variants.", "Verify no runaway loops."),
("memory-system-design", "autonomous-ai-agents", "Design agent memory with retrieval and expiry.", "memory,agents,vector", "Define memory schema and TTL.", "Choose embedding and index.", "Add write path and compaction.", "Test recall and staleness.", "Verify privacy redaction."),
]

for name, category, description, tags, step1, step2, step3, verify1, verify2 in rows:
    path = ROOT / category / name / "SKILL.md"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(TEMPLATE.format(
        name=name,
        description=description,
        tags=tags,
        title=name.replace("-", " ").title(),
        trigger=description.lower().rstrip("."),
        step1=step1,
        step2=step2,
        step3=step3,
        verify1=verify1,
        verify2=verify2,
    ), encoding="utf-8")
print("generated", len(rows), "skills")
