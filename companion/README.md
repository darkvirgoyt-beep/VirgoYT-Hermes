# Hybrid Hermes Companion

This is the Android Companion source for VirgoYT-Hermes. It pairs with the local Hermes Bridge and exposes only the bridge's allowlisted controls: status, safe app launch, sound actions, and emergency stop.

## Build an APK

Install Node.js and Expo tooling, then run:

```bash
cd companion
npm install
npx expo install
npx eas-cli@latest build --platform android --profile preview
```

The preview profile produces an installable APK. EAS may require a free Expo account for the remote build service. For local development:

```bash
npm start
```

## Connect to a computer

On the computer running the bridge, find its LAN address and start:

```bash
HERMES_BRIDGE_HOST=0.0.0.0 HERMES_PAIRING_CODE=123456 hermes-bridge start
```

Keep the computer and Android phone on the same trusted Wi-Fi. In the app, enter the computer's LAN address, for example `http://192.168.1.100:47821`, and the six-digit pairing code. Do not port-forward this service to the public internet. The pairing session expires after ten minutes and the app can activate emergency stop.

The bridge currently does not provide screen streaming, mouse, or keyboard control; the app displays that limitation rather than claiming those controls work.

## OpenCode-compatible models

The app's **OpenCode Models & Settings** panel includes local/free profiles for Ollama, LM Studio, and llama.cpp. These profiles use the OpenAI-compatible `/v1/chat/completions` format documented by OpenCode. Install OpenCode separately with its official installer if you want the OpenCode CLI; Hermes does not silently install or execute the CLI. Install a local model runtime separately, then select the matching profile in the app. Free means local runtime usage—model downloads and cloud providers may have their own costs.

## Custom API connectors

After pairing, use **Custom API Connectors** in the app to save a named REST API. Choose no authentication, Bearer authentication, or a custom header such as `X-Api-Key`, then provide a health-check path. The secret is sent once over the paired HTTPS or trusted LAN session and stored only in the bridge's local state directory; it is not returned to the app. Connector testing is restricted to the saved base URL, and the bridge permits only GET and POST requests.
