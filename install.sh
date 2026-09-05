#!/bin/bash

set -euo pipefail

mkdir -p ~/.hermes/skills

cp -r skills/* ~/.hermes/skills/

if [ -f config/config.yaml ]; then
    cp config/config.yaml ~/.hermes/
fi

mkdir -p ~/.local/bin
cp core/hermes.py ~/.hermes/hermes.py
chmod +x ~/.hermes/hermes.py
ln -sf ~/.hermes/hermes.py ~/.local/bin/hermes

echo "VirgoYT Hermes setup installed"
echo "Run: export PATH=\"$HOME/.local/bin:$PATH\"; hermes"
