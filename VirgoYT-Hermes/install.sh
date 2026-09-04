#!/bin/bash

SKILLS_DIR="$(pwd)/skills"

echo "Installing VirgoYT AI Skills..."

# Hermes
if command -v hermes >/dev/null 2>&1; then
    mkdir -p ~/.hermes/skills
    cp -r "$SKILLS_DIR"/* ~/.hermes/skills/
    echo "✓ Hermes skills installed"
fi

# Claude Code
if command -v claude >/dev/null 2>&1; then
    mkdir -p ~/.claude/skills
    cp -r "$SKILLS_DIR"/* ~/.claude/skills/
    echo "✓ Claude Code skills installed"
fi

# OpenCode
if command -v opencode >/dev/null 2>&1; then
    mkdir -p ~/.config/opencode/skills
    cp -r "$SKILLS_DIR"/* ~/.config/opencode/skills/
    echo "✓ OpenCode skills installed"
fi

# Shared Agent Skills
mkdir -p ~/.agents/skills
cp -r "$SKILLS_DIR"/* ~/.agents/skills/
echo "✓ Shared Agent Skills installed"

echo "Done. Restart your AI agents."
