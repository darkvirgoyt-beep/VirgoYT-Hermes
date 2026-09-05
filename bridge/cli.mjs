#!/usr/bin/env node
import http from 'node:http';
import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';

const root = path.join(os.homedir(), '.virgoyt-hermes');
const stateFile = path.join(root, 'bridge-state.json');
const port = Number(process.env.HERMES_BRIDGE_PORT || 47821);
const host = process.env.HERMES_BRIDGE_HOST || '127.0.0.1';
const relayUrl = process.env.HERMES_RELAY_URL || '';

function ensureState() {
  fs.mkdirSync(root, { recursive: true, mode: 0o700 });
  if (!fs.existsSync(stateFile)) {
    saveState({ deviceId: crypto.randomUUID(), paired: false, stopped: false, allowlist: [], sessionExpiresAt: null, mode: 'local' });
  }
}
function loadState() { ensureState(); return JSON.parse(fs.readFileSync(stateFile, 'utf8')); }
function saveState(state) { ensureState(); fs.writeFileSync(stateFile, JSON.stringify(state, null, 2), { mode: 0o600 }); }
function json(res, status, body) { res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*', 'access-control-allow-headers': 'content-type, authorization', 'access-control-allow-methods': 'GET, POST, OPTIONS' }); res.end(JSON.stringify(body)); }
function token() { return crypto.randomBytes(24).toString('base64url'); }
function readBody(req) { return new Promise((resolve, reject) => { let data = ''; req.on('data', chunk => { data += chunk; if (data.length > 64 * 1024) reject(new Error('payload too large')); }); req.on('end', () => { try { resolve(data ? JSON.parse(data) : {}); } catch (error) { reject(error); } }); req.on('error', reject); }); }
function capabilities() { const platform = process.platform; return { platform, hostname: os.hostname(), deviceId: loadState().deviceId, supported: { pairing: true, status: true, emergencyStop: true, appLaunch: true, sound: platform !== 'android', displayCapture: false, pointerControl: false, keyboardControl: false, passkeyPrompt: 'os-user-presence-only', termuxApi: platform === 'android' || Boolean(process.env.TERMUX_VERSION) } }; }
function commandFor(app) { const table = { linux: { terminal: 'x-terminal-emulator', browser: 'xdg-open', files: 'xdg-open' }, darwin: { terminal: 'open', browser: 'open', files: 'open' }, win32: { terminal: 'wt.exe', browser: 'start', files: 'explorer.exe' } }; return table[process.platform]?.[app]; }
function launch(app) { const executable = commandFor(app); if (!executable) throw new Error(`No safe launcher configured for ${app} on ${process.platform}`); const child = process.platform === 'win32' ? spawn('cmd.exe', ['/c', executable], { detached: true, stdio: 'ignore' }) : spawn(executable, [], { detached: true, stdio: 'ignore' }); child.unref(); return { app, executable, started: true }; }
function sound(action) { const platform = process.platform; if (platform === 'linux') { const args = action === 'mute' ? ['set', '@DEFAULT_SINK@', 'toggle'] : ['set-sink-volume', '@DEFAULT_SINK@', action === 'up' ? '+5%' : '-5%']; return spawn('pactl', args, { stdio: 'ignore' }); } if (platform === 'darwin') { const delta = action === 'up' ? 'up' : 'down'; return spawn('osascript', ['-e', `set volume output volume ((output volume of (get volume settings)) ${delta === 'up' ? '+' : '-'} 5)`], { stdio: 'ignore' }); } if (platform === 'win32') return spawn('powershell', ['-NoProfile', '-Command', '(New-Object -ComObject WScript.Shell).SendKeys([char]173)'], { stdio: 'ignore' }); throw new Error('Sound control is unavailable on this platform'); }
function auth(req, state) { const header = req.headers.authorization || ''; return state.paired && header === `Bearer ${state.sessionToken}` && !state.stopped && (!state.sessionExpiresAt || Date.now() < state.sessionExpiresAt); }

async function handle(req, res) {
  if (req.method === 'OPTIONS') return json(res, 204, {});
  const state = loadState();
  try {
    if (req.method === 'GET' && req.url === '/health') return json(res, 200, { ok: true, service: 'virgoyt-hermes-bridge', ...capabilities(), mode: state.mode, paired: state.paired, stopped: state.stopped });
    if (req.method === 'POST' && req.url === '/pair') {
      const body = await readBody(req);
      if (body.code !== process.env.HERMES_PAIRING_CODE) return json(res, 401, { ok: false, error: 'invalid pairing code' });
      const next = { ...state, paired: true, stopped: false, sessionToken: token(), sessionExpiresAt: Date.now() + 10 * 60 * 1000, mode: body.mode === 'relay' && relayUrl ? 'relay' : 'local' };
      saveState(next); return json(res, 200, { ok: true, sessionToken: next.sessionToken, expiresAt: new Date(next.sessionExpiresAt).toISOString(), mode: next.mode, capabilities: capabilities().supported });
    }
    if (!auth(req, state)) return json(res, 401, { ok: false, error: 'pairing required, session expired, or emergency stop active' });
    if (req.method === 'POST' && req.url === '/stop') { saveState({ ...state, stopped: true, paired: false, sessionToken: null }); return json(res, 200, { ok: true, stopped: true }); }
    if (req.method === 'GET' && req.url === '/status') return json(res, 200, { ok: true, ...capabilities(), mode: state.mode, expiresAt: new Date(state.sessionExpiresAt).toISOString(), allowlist: state.allowlist });
    if (req.method === 'POST' && req.url === '/allowlist') { const body = await readBody(req); const apps = Array.isArray(body.apps) ? body.apps.filter(item => ['terminal', 'browser', 'files'].includes(item)) : []; saveState({ ...state, allowlist: apps }); return json(res, 200, { ok: true, allowlist: apps }); }
    if (req.method === 'POST' && req.url === '/launch') { const body = await readBody(req); if (!state.allowlist.includes(body.app)) return json(res, 403, { ok: false, error: 'application is not allowlisted' }); return json(res, 200, launch(body.app)); }
    if (req.method === 'POST' && req.url === '/sound') { const body = await readBody(req); if (!['up', 'down', 'mute'].includes(body.action)) return json(res, 400, { ok: false, error: 'action must be up, down, or mute' }); sound(body.action); return json(res, 200, { ok: true, action: body.action }); }
    return json(res, 404, { ok: false, error: 'not found' });
  } catch (error) { return json(res, 500, { ok: false, error: error instanceof Error ? error.message : String(error) }); }
}

function printHelp() { console.log(`VirgoYT Hermes Bridge\n\nCommands:\n  start     Start the local bridge server\n  pair      Print pairing setup instructions\n  status    Query the local health endpoint\n  stop      Activate emergency stop\n\nEnvironment:\n  HERMES_BRIDGE_PORT=47821\n  HERMES_PAIRING_CODE=the-code-shown-by-Hybrid-Hermes\n  HERMES_RELAY_URL=optional-relay-url`); }

const command = process.argv[2] || 'help';
if (command === 'pair') { console.log('Set HERMES_PAIRING_CODE to the six-digit code shown in Hybrid Hermes, then start the bridge. Pairing expires after ten minutes.'); process.exit(0); }
if (command === 'status') { const req = http.get(`http://${host}:${port}/health`, response => { let data = ''; response.on('data', chunk => data += chunk); response.on('end', () => console.log(data)); }); req.on('error', error => { console.error(error.message); process.exitCode = 1; }); }
else if (command === 'stop') { const state = loadState(); saveState({ ...state, stopped: true, paired: false, sessionToken: null }); console.log('Emergency stop activated.'); }
else if (command === 'start') { ensureState(); http.createServer(handle).listen(port, host, () => console.log(`Hermes bridge listening on http://${host}:${port}`)); }
else printHelp();
