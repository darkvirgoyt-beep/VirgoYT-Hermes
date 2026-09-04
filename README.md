# 🚀 VirgoYT-Hermes

A personal AI agent configuration and skill toolkit by **VirgoYT**.

VirgoYT-Hermes provides reusable AI skills, tools, configurations, and workflows designed for advanced AI coding assistants.

## ✨ Features

- 🤖 Hermes Agent support
- 🧠 AI skill management
- 🎨 UI/UX design intelligence
- 🏗️ Software architecture planning
- 📐 System design and visualization
- 🐛 Debugging workflows
- 💻 Development assistance
- 🔐 GPG signed Git workflow
- 📱 Termux + Linux environment support

---

# Supported AI Agents

Skills are built using a portable Agent Skills structure.

Compatible with:

- Hermes Agent
- Claude Code
- OpenCode
- Other AI agents supporting Agent Skills format

> Note: The AI agent must support loading external skills.

---

# Installation

## Termux Installation

Install requirements:

```bash
pkg update && pkg upgrade -y
```
```bash
pkg install git python nodejs proot-distro -y
proot-distro install ubuntu
proot-distro login ubuntu
```
```bash
apt update && apt upgrade -y
apt install git python3 python3-pip nodejs npm nano -y
```
```bash
git clone https://github.com/darkvirgoyt-beep/VirgoYT-Hermes.git

cd VirgoYT-Hermes

chmod +x install.sh

./install.sh
  hermes
```

## Importing into Manus Skills

The repository root now contains a top-level `SKILL.md`, so use this URL to import the complete bundle:

```text
https://github.com/darkvirgoyt-beep/VirgoYT-Hermes
```

To import one skill directly, use its folder URL, which must contain that skill’s own `SKILL.md`:

```text
https://github.com/darkvirgoyt-beep/VirgoYT-Hermes/tree/main/skills/cloud-computer
https://github.com/darkvirgoyt-beep/VirgoYT-Hermes/tree/main/skills/manus-compat
```

The previous error occurred because the repository had no root-level `SKILL.md`. The root manifest fixes that error. Private Manus runtime instructions are not copied into the repository; `manus-compat` provides portable capability mapping instead.
