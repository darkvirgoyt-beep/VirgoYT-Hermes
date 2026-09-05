# VirgoYT-Hermes

VirgoYT-Hermes is a portable Hermes skill bundle plus the **Hybrid Hermes Bridge**. The bridge lets the Hybrid Hermes Companion pair with an authorized Termux phone or a computer running Ubuntu/Linux, macOS, or Windows. It provides a small, auditable command surface for device status, allowlisted app launching, sound/media actions, session expiry, and emergency stop.

The repository is designed so a user can install from a terminal without opening the source tree manually. The companion app supplies the pairing code; the terminal bridge supplies the local device endpoint.

## What is included

| Component | Platforms | Current capability |
|---|---|---|
| Hybrid Hermes Companion | Android | Source in `companion/`; LAN pairing UI, status, allowlisted controls, sound, emergency stop |
| Hermes Bridge | Termux, Ubuntu/Linux, macOS, Windows | Pairing, health/status, explicit app allowlist, app launch, sound actions, custom REST API connectors, emergency stop |
| Hermes skills | Hermes-compatible agents | Portable skills under `skills/` and the root `SKILL.md` manifest |
| Optional relay | Any supported host | Configure `HERMES_RELAY_URL`; the local bridge remains the only component with OS access |

Full desktop display streaming, pointer control, and keyboard control require native OS capture/input adapters and the correct operating-system permissions. The bridge reports these capabilities instead of pretending they are available. Do not expose the bridge port to the public internet.

## Fast install: Linux and macOS

Install Node.js 18 or newer and Git, then run:

For a direct GitHub package launch without cloning manually:

```bash
HERMES_PAIRING_CODE=123456 npx --yes github:darkvirgoyt-beep/VirgoYT-Hermes start
```

Replace `123456` with the six-digit code shown by Hybrid Hermes. The bootstrap script below is recommended for background-service installation because it creates a stable local command.

```bash
curl -fsSL https://raw.githubusercontent.com/darkvirgoyt-beep/VirgoYT-Hermes/main/scripts/install-bridge.sh | bash
export PATH="$HOME/.local/bin:$PATH"
```

Create a computer pairing code in **Hybrid Hermes → Devices → Pair a new device → Computer**. Start the bridge with the code:

```bash
HERMES_PAIRING_CODE=123456 hermes-bridge start
```

For an Android Companion on a different device from the computer, use the computer's trusted LAN binding instead:

```bash
HERMES_BRIDGE_HOST=0.0.0.0 HERMES_PAIRING_CODE=123456 hermes-bridge start
```

Then enter the computer's LAN address, such as `http://192.168.1.100:47821`, in the Android Companion. Keep the bridge on a trusted network and never port-forward it to the public internet.

Replace `123456` with the six-digit code shown by the app. The local endpoint listens on `127.0.0.1:47821` by default. Check it with:

```bash
hermes-bridge status
```

Stop every active control session immediately with:

```bash
hermes-bridge stop
```

## Ubuntu background mode

After installing the bridge, copy the service template and replace the pairing-code placeholder:

```bash
mkdir -p ~/.config/systemd/user
cp ~/.virgoyt-hermes/VirgoYT-Hermes/scripts/virgoyt-hermes-bridge.service ~/.config/systemd/user/
sed -i "s/REPLACE_WITH_APP_CODE/123456/" ~/.config/systemd/user/virgoyt-hermes-bridge.service
systemctl --user daemon-reload
systemctl --user enable --now virgoyt-hermes-bridge.service
systemctl --user status virgoyt-hermes-bridge.service
```

For a service that continues after logout, enable user lingering for your account:

```bash
loginctl enable-linger "$USER"
```

Use `systemctl --user stop virgoyt-hermes-bridge.service` to stop the background service. The bridge uses a per-user state directory at `~/.virgoyt-hermes` with restrictive file permissions.

## Windows PowerShell

Install Node.js 18+ and Git, then run PowerShell as the current user:

```powershell
irm https://raw.githubusercontent.com/darkvirgoyt-beep/VirgoYT-Hermes/main/scripts/install-bridge.ps1 | iex
$env:HERMES_PAIRING_CODE="123456"
node "$HOME\.virgoyt-hermes\VirgoYT-Hermes\bridge\cli.mjs" start
```

Replace `123456` with the code shown by the companion. Emergency stop:

```powershell
node "$HOME\.virgoyt-hermes\VirgoYT-Hermes\bridge\cli.mjs" stop
```

For Windows background startup, create a Task Scheduler entry that runs the same `node ... bridge\\cli.mjs start` command only after the user has set the pairing code. Keep the bridge bound to localhost unless you intentionally configure a protected LAN transport.

## Normal Termux phone bridge

Use **normal Termux**, not only an Ubuntu PRoot shell. Install Termux and Termux:API from a trusted source, then run:

```bash
pkg update -y
pkg install -y git nodejs termux-api
curl -fsSL https://raw.githubusercontent.com/darkvirgoyt-beep/VirgoYT-Hermes/main/scripts/install-bridge.sh | bash
export PATH="$HOME/.local/bin:$PATH"
```

Create a **phone pairing code** in the companion, then run:

```bash
HERMES_PAIRING_CODE=123456 hermes-bridge start
```

Termux:API capabilities must be enabled individually. The bridge must not receive arbitrary shell commands. PRoot Ubuntu is useful for development, but it cannot provide Android’s native permission prompts or the host Android display/input layer by itself.

## Pairing and safety model

Pairing codes are short-lived. The bridge stores only local session metadata and a session token with restrictive permissions. Each session expires, can be revoked from the companion, and can be stopped from the terminal. Sensitive actions should be confirmed in the companion before execution.

Passkeys, fingerprints, biometric templates, private keys, and OS authentication secrets are never read or exported by this project. The bridge may request an operating-system user-presence prompt and receive a success/failure result, but it cannot bypass that prompt or obtain the underlying secret.

## Optional relay mode

A relay is optional. If a compatible relay is available, set its URL before starting:

```bash
export HERMES_RELAY_URL="https://your-relay.example"
HERMES_PAIRING_CODE=123456 hermes-bridge start
```

The relay must authenticate both endpoints, expire sessions, support revocation, avoid storing screen frames unnecessarily, and never expose raw desktop ports. Local LAN mode is preferred for privacy and lower latency.

## Bridge API

The local bridge provides these endpoints after pairing:

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/health` | Public health and capability summary; no control token |
| `POST` | `/pair` | Exchange the companion’s six-digit code for a short-lived session |
| `GET` | `/status` | Read paired status and active allowlist |
| `POST` | `/allowlist` | Set the explicit app allowlist |
| `POST` | `/launch` | Launch only `terminal`, `browser`, or `files` when allowlisted |
| `POST` | `/sound` | Request `up`, `down`, or `mute` on supported hosts |
| `POST` | `/stop` | Revoke the session and activate emergency stop |

The default listener is `127.0.0.1:47821`. Do not bind it to `0.0.0.0` unless you have added authenticated LAN transport and firewall rules.

## Custom API connectors

The Companion can save named custom REST API connectors on the paired bridge. A connector supports a base URL, no authentication, Bearer authentication, or a custom API-key header, plus a health-check path. Connector secrets are stored only in the bridge's restrictive local state file and are never returned by `/status` or `/connectors`. The Companion can test a saved connector; request execution is limited to the connector's own base URL and supports only GET and POST. Never add private keys to the repository or expose the bridge to the public internet.

## Hermes skill bundle

The repository root contains a portable `SKILL.md` manifest. Individual skills are under `skills/`, including the portable compatibility catalog. Import the full repository into a compatible agent with:

```text
https://github.com/darkvirgoyt-beep/VirgoYT-Hermes
```

## Development

Build the Android Companion from source:

```bash
cd companion
npm install
npx eas-cli@latest build --platform android --profile preview
```

The preview profile produces an installable APK. See [`companion/README.md`](companion/README.md) for connection and local-development instructions.

Run bridge tests with:

```bash
cd bridge
npm test
```

Run the existing Hermes runtime installation with:

```bash
chmod +x install.sh
./install.sh
```

## Troubleshooting

If `hermes-bridge` is not found, add `$HOME/.local/bin` to `PATH` on Linux/macOS or invoke `node` with the bridge path on Windows. If pairing fails, create a new code and ensure `HERMES_PAIRING_CODE` matches exactly; codes expire after ten minutes. If Termux actions fail, confirm that Termux:API is installed from the same trusted source as Termux and that Android permissions are granted. If sound control is unavailable, the host may not have the expected audio tool (`pactl` on Linux, AppleScript on macOS, or PowerShell media handling on Windows). If a capability is reported unsupported, install the required native adapter and OS permission rather than disabling the safety policy.

## License and contributions

Review the repository history and project owner’s licensing decision before redistributing. Contributions should preserve explicit pairing, least-privilege allowlists, user confirmation for sensitive actions, and emergency-stop behavior.
