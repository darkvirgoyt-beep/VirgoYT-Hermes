---
name: max-model-performance
description: "Prompt and routing rules to get peak output from any frontier model."
version: 0.1.0
author: darkvirgoyt-beep, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [prompting, routing, llm, optimization, performance]
    related_skills: [strict-reasoning, frontier-model-routing, systematic-debugging]
---

# Max Model Performance

Use this skill when selecting prompts, formatting requests, or steering a model
toward stronger reasoning, fewer hallucinations, and more reliable tool use.

## Core Principle

The same model can vary 10x in effective output quality depending on prompt
structure, constraints, and verification loops. Optimize the harness, not just
the model ID.

## Universal Rules

1. State the exact task, output schema, and acceptance criteria.
2. Separate facts from assumptions; label unknowns explicitly.
3. Require step-by-step reasoning before the final answer.
4. Ask for confidence and residual risks in every non-trivial answer.
5. Use structured formats: JSON, tables, numbered lists, not prose walls.
6. Constrain scope: one job per message, minimal but sufficient context.
7. Add a verification pass: “Check your own answer for contradictions.”

## Model-Specific Routing

| Model | Best Prompt Shape | Key Lever | Avoid |
|---|---|---|---|
| Claude Opus 4.8 | Long system prompt, explicit chain-of-thought, XML tags | Adaptive thinking / effort | Short one-shot prompts |
| Claude Fable 5.1 | Tool-first instruction, strict JSON mode, few-shot examples | Tool definitions and routing | Open-ended creative drift |
| Claude Mythos 5.1 | Same as Fable 5.1; expect stronger long-horizon plans | Long-context synthesis | Unnecessary safety hedging |
| Nemotron 3 Ultra | Chat template with `enable_thinking=True`, bullet contracts | Reasoning trace + final answer | Dense paragraph prompts |
| Kimi K3 | Role + task + constraints + success criteria, concise | Prefix completion / function calling | Multi-task bundling |
| GPT Luna 5.6 | Clear step list, output schema, cost-aware brevity | Reasoning effort vs cost | Long exploratory monologues |

## Prompt Building Blocks

- **Role:** One sentence, no fluff.
- **Task:** Exact deliverable and success condition.
- **Constraints:** Format, length, exclusions, safety rails.
- **Evidence:** Required sources, files, logs, or tool outputs.
- **Format:** JSON schema, table columns, or numbered template.
- **Verification:** Self-check question or contradiction scan.
- **Confidence:** Numeric or labeled confidence plus unknowns.

## Control Techniques

- **Chain of Thought:** “Reason step by step, then answer.”
- **Self-Consistency:** Generate 3 reasoning paths, then pick the best.
- **Few-Shot:** One perfect example beats ten paragraphs of instruction.
- **Refinement:** “Revise your last answer for accuracy and schema fit.”
- **Tool Lock:** “Use ONLY these tools and stop when done.”
- **Budget Control:** Limit reasoning tokens or turns to control cost/latency.

## Verification

- Output matches requested schema.
- Reasoning precedes conclusion.
- Confidence and unknowns are present.
- No unsupported claims or tool hallucination.
- Cost/latency within task budget.
