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
const freeModelPresets = [
  { id: 'ollama-local', name: 'Ollama local', provider: 'ollama', baseUrl: 'http://127.0.0.1:11434/v1', model: 'llama3.2:3b', free: true, note: 'Free when Ollama and the model are installed on this computer.' },
  { id: 'local-openai-compatible', name: 'Local OpenAI-compatible', provider: 'local', baseUrl: 'http://127.0.0.1:8000/v1', model: 'local-model', free: true, note: 'Use with a local llama.cpp, vLLM, or compatible server.' }
];

function ensureState() {
  fs.mkdirSync(root, { recursive: true, mode: 0o700 });
  if (!fs.existsSync(stateFile)) {
    fs.writeFileSync(stateFile, JSON.stringify({ deviceId: crypto.randomUUID(), paired: false, stopped: false, allowlist: [], connectors: [], modelProfiles: [], activeModel: 'ollama-local', settings: { notifications: true, confirmSensitiveActions: true, requestTimeoutMs: 10000 }, sessionExpiresAt: null, mode: 'local' }, null, 2), { mode: 0o600 });
  }
}
function loadState() { ensureState(); const state = JSON.parse(fs.readFileSync(stateFile, 'utf8')); if (!Array.isArray(state.connectors)) state.connectors = []; if (!Array.isArray(state.modelProfiles)) state.modelProfiles = []; if (!state.settings) state.settings = { notifications: true, confirmSensitiveActions: true, requestTimeoutMs: 10000 }; if (!state.activeModel) state.activeModel = 'ollama-local'; return state; }
function saveState(state) { ensureState(); fs.writeFileSync(stateFile, JSON.stringify(state, null, 2), { mode: 0o600 }); }
function json(res, status, body) { res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*', 'access-control-allow-headers': 'content-type, authorization', 'access-control-allow-methods': 'GET, POST, OPTIONS' }); res.end(JSON.stringify(body)); }
function token() { return crypto.randomBytes(24).toString('base64url'); }
function readBody(req) { return new Promise((resolve, reject) => { let data = ''; req.on('data', chunk => { data += chunk; if (data.length > 64 * 1024) reject(new Error('payload too large')); }); req.on('end', () => { try { resolve(data ? JSON.parse(data) : {}); } catch (error) { reject(error); } }); req.on('error', reject); }); }
function capabilities() { const platform = process.platform; return { platform, hostname: os.hostname(), deviceId: loadState().deviceId, supported: { pairing: true, status: true, emergencyStop: true, appLaunch: true, sound: platform !== 'android', displayCapture: false, pointerControl: false, keyboardControl: false, passkeyPrompt: 'os-user-presence-only', termuxApi: platform === 'android' || Boolean(process.env.TERMUX_VERSION) } }; }
function commandFor(app) { const table = { linux: { terminal: 'x-terminal-emulator', browser: 'xdg-open', files: 'xdg-open' }, darwin: { terminal: 'open', browser: 'open', files: 'open' }, win32: { terminal: 'wt.exe', browser: 'start', files: 'explorer.exe' } }; return table[process.platform]?.[app]; }
function launch(app) { const executable = commandFor(app); if (!executable) throw new Error(`No safe launcher configured for ${app} on ${process.platform}`); const child = process.platform === 'win32' ? spawn('cmd.exe', ['/c', executable], { detached: true, stdio: 'ignore' }) : spawn(executable, [], { detached: true, stdio: 'ignore' }); child.unref(); return { app, executable, started: true }; }
function sound(action) { const platform = process.platform; if (platform === 'linux') { const args = action === 'mute' ? ['set', '@DEFAULT_SINK@', 'toggle'] : ['set-sink-volume', '@DEFAULT_SINK@', action === 'up' ? '+5%' : '-5%']; return spawn('pactl', args, { stdio: 'ignore' }); } if (platform === 'darwin') { const delta = action === 'up' ? 'up' : 'down'; return spawn('osascript', ['-e', `set volume output volume ((output volume of (get volume settings)) ${delta === 'up' ? '+' : '-'} 5)`], { stdio: 'ignore' }); } if (platform === 'win32') return spawn('powershell', ['-NoProfile', '-Command', '(New-Object -ComObject WScript.Shell).SendKeys([char]173)'], { stdio: 'ignore' }); throw new Error('Sound control is unavailable on this platform'); }
function auth(req, state) { const header = req.headers.authorization || ''; return state.paired && header === `Bearer ${state.sessionToken}` && !state.stopped && (!state.sessionExpiresAt || Date.now() < state.sessionExpiresAt); }
function publicConnector(connector) { return { id: connector.id, name: connector.name, baseUrl: connector.baseUrl, authType: connector.authType, headerName: connector.headerName, healthPath: connector.healthPath, updatedAt: connector.updatedAt }; }
function publicModel(profile) { return { id: profile.id, name: profile.name, provider: profile.provider, baseUrl: profile.baseUrl, model: profile.model, free: Boolean(profile.free), requiresSecret: Boolean(profile.secret), note: profile.note }; }
function connectorFor(state, id) { return state.connectors.find(item => item.id === id); }
function validateConnector(body) {
  const baseUrl = String(body.baseUrl || '').trim().replace(/\/$/, '');
  const parsed = new URL(baseUrl);
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('connector URL must use http or https');
  const name = String(body.name || '').trim().slice(0, 80);
  if (!name) throw new Error('connector name is required');
  const authType = ['none', 'bearer', 'header'].includes(body.authType) ? body.authType : 'none';
  const headerName = authType === 'header' ? String(body.headerName || '').trim().slice(0, 80) : authType === 'bearer' ? 'Authorization' : '';
  if (authType !== 'none' && !headerName) throw new Error('auth header name is required');
  const secret = String(body.secret || '');
  if (authType !== 'none' && !secret) throw new Error('API secret is required');
  return { name, baseUrl, authType, headerName, secret, healthPath: String(body.healthPath || '/').startsWith('/') ? String(body.healthPath || '/') : `/${body.healthPath}`, updatedAt: new Date().toISOString() };
}
function requestUrl(connector, requestPath) { const pathName = String(requestPath || '/'); if (!pathName.startsWith('/')) throw new Error('request path must start with /'); const url = new URL(pathName, `${connector.baseUrl}/`); if (url.origin !== new URL(connector.baseUrl).origin) throw new Error('request path must stay on the connector base URL'); return url; }
async function callConnector(connector, requestPath, method = 'GET', body) {
  const headers = { accept: 'application/json, text/plain, */*' };
  if (connector.authType === 'bearer') headers.authorization = `Bearer ${connector.secret}`;
  if (connector.authType === 'header') headers[connector.headerName.toLowerCase()] = connector.secret;
  if (body !== undefined) headers['content-type'] = 'application/json';
  const response = await fetch(requestUrl(connector, requestPath), { method, headers, body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(10000) });
  const text = await response.text();
  return { ok: response.ok, status: response.status, contentType: response.headers.get('content-type') || '', body: text.slice(0, 20000) };
}
function modelFor(state, id) { return freeModelPresets.find(item => item.id === id) || state.modelProfiles.find(item => item.id === id); }
async function callModel(profile, messages, timeoutMs) {
  const headers = { accept: 'application/json', 'content-type': 'application/json' };
  if (profile.secret) headers.authorization = `Bearer ${profile.secret}`;
  const response = await fetch(new URL('/chat/completions', `${profile.baseUrl.replace(/\/$/, '')}/`), { method: 'POST', headers, body: JSON.stringify({ model: profile.model, messages, temperature: 0.2 }), signal: AbortSignal.timeout(timeoutMs) });
  const body = await response.text();
  return { ok: response.ok, status: response.status, body: body.slice(0, 30000) };
}

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
    if (req.method === 'GET' && req.url === '/status') return json(res, 200, { ok: true, ...capabilities(), mode: state.mode, expiresAt: new Date(state.sessionExpiresAt).toISOString(), allowlist: state.allowlist, connectors: state.connectors.map(publicConnector) });
    if (req.method === 'POST' && req.url === '/allowlist') { const body = await readBody(req); const apps = Array.isArray(body.apps) ? body.apps.filter(item => ['terminal', 'browser', 'files'].includes(item)) : []; saveState({ ...state, allowlist: apps }); return json(res, 200, { ok: true, allowlist: apps }); }
    if (req.method === 'GET' && req.url === '/connectors') return json(res, 200, { ok: true, connectors: state.connectors.map(publicConnector) });
    if (req.method === 'POST' && req.url === '/connectors') { const body = await readBody(req); const next = validateConnector(body); const connector = { id: body.id && connectorFor(state, body.id) ? body.id : crypto.randomUUID(), ...next }; const connectors = state.connectors.filter(item => item.id !== connector.id); connectors.push(connector); saveState({ ...state, connectors }); return json(res, 200, { ok: true, connector: publicConnector(connector) }); }
    if (req.method === 'DELETE' && req.url.startsWith('/connectors/')) { const id = decodeURIComponent(req.url.slice('/connectors/'.length)); if (!connectorFor(state, id)) return json(res, 404, { ok: false, error: 'connector not found' }); saveState({ ...state, connectors: state.connectors.filter(item => item.id !== id) }); return json(res, 200, { ok: true, deleted: id }); }
    if (req.method === 'POST' && req.url === '/connectors/test') { const body = await readBody(req); const connector = connectorFor(state, body.id); if (!connector) return json(res, 404, { ok: false, error: 'connector not found' }); const result = await callConnector(connector, connector.healthPath, 'GET'); return json(res, result.ok ? 200 : 502, { ok: result.ok, connector: publicConnector(connector), status: result.status, body: result.body }); }
    if (req.method === 'POST' && req.url === '/connectors/request') { const body = await readBody(req); const connector = connectorFor(state, body.id); if (!connector) return json(res, 404, { ok: false, error: 'connector not found' }); const method = String(body.method || 'GET').toUpperCase(); if (!['GET', 'POST'].includes(method)) return json(res, 400, { ok: false, error: 'only GET and POST are supported' }); const result = await callConnector(connector, body.path, method, method === 'POST' ? body.body : undefined); return json(res, result.ok ? 200 : 502, { ok: result.ok, status: result.status, contentType: result.contentType, body: result.body }); }
    if (req.method === 'GET' && req.url === '/models') return json(res, 200, { ok: true, activeModel: state.activeModel, models: [...freeModelPresets, ...state.modelProfiles].map(publicModel) });
    if (req.method === 'POST' && req.url === '/models') { const body = await readBody(req); const baseUrl = String(body.baseUrl || '').trim().replace(/\/$/, ''); const parsed = new URL(baseUrl); if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('model URL must use http or https'); if (!body.name || !body.model) throw new Error('model name and model ID are required'); const profile = { id: body.id || crypto.randomUUID(), name: String(body.name).slice(0, 80), provider: String(body.provider || 'custom'), baseUrl, model: String(body.model).slice(0, 160), secret: String(body.secret || ''), free: Boolean(body.free), note: String(body.note || 'Custom OpenAI-compatible model') }; saveState({ ...state, modelProfiles: [...state.modelProfiles.filter(item => item.id !== profile.id), profile] }); return json(res, 200, { ok: true, model: publicModel(profile) }); }
    if (req.method === 'POST' && req.url === '/models/select') { const body = await readBody(req); if (!modelFor(state, body.id)) return json(res, 404, { ok: false, error: 'model not found' }); saveState({ ...state, activeModel: body.id }); return json(res, 200, { ok: true, activeModel: body.id }); }
    if (req.method === 'POST' && req.url === '/models/chat') { const body = await readBody(req); const profile = modelFor(state, body.id || state.activeModel); if (!profile) return json(res, 404, { ok: false, error: 'model not found' }); if (!Array.isArray(body.messages) || body.messages.length === 0) return json(res, 400, { ok: false, error: 'messages are required' }); const result = await callModel(profile, body.messages, Math.min(Number(state.settings.requestTimeoutMs) || 10000, 30000)); return json(res, result.ok ? 200 : 502, { ok: result.ok, model: publicModel(profile), status: result.status, body: result.body }); }
    if (req.method === 'GET' && req.url === '/settings') return json(res, 200, { ok: true, settings: state.settings, activeModel: state.activeModel });
    if (req.method === 'POST' && req.url === '/settings') { const body = await readBody(req); const settings = { ...state.settings, notifications: Boolean(body.notifications ?? state.settings.notifications), confirmSensitiveActions: Boolean(body.confirmSensitiveActions ?? state.settings.confirmSensitiveActions), requestTimeoutMs: Math.max(1000, Math.min(30000, Number(body.requestTimeoutMs || state.settings.requestTimeoutMs))) }; saveState({ ...state, settings }); return json(res, 200, { ok: true, settings }); }
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
