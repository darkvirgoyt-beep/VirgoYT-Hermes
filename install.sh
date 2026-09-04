#!/bin/bash

mkdir -p ~/.hermes/skills

cp -r skills/* ~/.hermes/skills/

if [ -f config/config.yaml ]; then
    cp config/config.yaml ~/.hermes/
fi

echo "VirgoYT Hermes setup installed"
