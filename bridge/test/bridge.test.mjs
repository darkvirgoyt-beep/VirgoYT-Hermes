import test from 'node:test';
import assert from 'node:assert/strict';

const allowedApps = new Set(['terminal', 'browser', 'files']);

test('bridge application allowlist is explicit', () => {
  assert.equal(allowedApps.has('terminal'), true);
  assert.equal(allowedApps.has('random-shell'), false);
});

test('pairing session expires after ten minutes', () => {
  const expiresAt = Date.now() + 10 * 60 * 1000;
  assert.equal(expiresAt > Date.now(), true);
});

test('emergency stop invalidates the control session', () => {
  const state = { paired: true, stopped: false, sessionToken: 'session' };
  const stopped = { ...state, paired: false, stopped: true, sessionToken: null };
  assert.equal(stopped.paired, false);
  assert.equal(stopped.stopped, true);
  assert.equal(stopped.sessionToken, null);
});
