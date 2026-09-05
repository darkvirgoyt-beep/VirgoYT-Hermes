#!/usr/bin/env bash
set -euo pipefail

ROOT="${HOME}/.virgoyt-hermes"
mkdir -p "${ROOT}"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js 18+ is required. Install it from https://nodejs.org/ or your OS package manager, then rerun this script." >&2
  exit 1
fi

REPO_DIR="${ROOT}/VirgoYT-Hermes"
if [ ! -d "${REPO_DIR}/bridge" ]; then
  git clone --depth 1 https://github.com/darkvirgoyt-beep/VirgoYT-Hermes.git "${REPO_DIR}"
else
  git -C "${REPO_DIR}" pull --ff-only
fi

chmod +x "${REPO_DIR}/bridge/cli.mjs"
mkdir -p "${HOME}/.local/bin"
ln -sf "${REPO_DIR}/bridge/cli.mjs" "${HOME}/.local/bin/hermes-bridge"

echo "Hybrid Hermes bridge installed."
echo "1. In Hybrid Hermes, create a computer pairing code."
echo "2. Run: HERMES_PAIRING_CODE=123456 hermes-bridge start"
echo "3. Replace 123456 with the code shown by the app."
echo "4. For emergency stop, run: hermes-bridge stop"
echo "If ~/.local/bin is not on PATH, add: export PATH=\"$HOME/.local/bin:$PATH\""
