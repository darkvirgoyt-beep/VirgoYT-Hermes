import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

type BridgeStatus = {
  ok: boolean;
  hostname?: string;
  platform?: string;
  paired?: boolean;
  stopped?: boolean;
  mode?: string;
  supported?: Record<string, boolean | string>;
  allowlist?: string[];
  error?: string;
};

const STORAGE_URL = 'hermes.bridgeUrl';
const STORAGE_TOKEN = 'hermes.sessionToken';

export default function App() {
  const [bridgeUrl, setBridgeUrl] = useState('http://192.168.1.100:47821');
  const [code, setCode] = useState('');
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<BridgeStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('Enter the computer IP address and pairing code.');

  useEffect(() => {
    (async () => {
      const [savedUrl, savedToken] = await Promise.all([AsyncStorage.getItem(STORAGE_URL), AsyncStorage.getItem(STORAGE_TOKEN)]);
      if (savedUrl) setBridgeUrl(savedUrl);
      if (savedToken) setToken(savedToken);
    })();
  }, []);

  const endpoint = useMemo(() => bridgeUrl.trim().replace(/\/$/, ''), [bridgeUrl]);
  const request = async (path: string, options: RequestInit = {}) => {
    const headers: Record<string, string> = { 'content-type': 'application/json', ...(options.headers as Record<string, string> || {}) };
    if (token) headers.authorization = `Bearer ${token}`;
    const response = await fetch(`${endpoint}${path}`, { ...options, headers });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error || `Bridge returned ${response.status}`);
    return body;
  };

  const pair = async () => {
    setBusy(true); setMessage('Pairing with computer…');
    try {
      await AsyncStorage.setItem(STORAGE_URL, endpoint);
      const body = await request('/pair', { method: 'POST', body: JSON.stringify({ code: code.trim(), mode: 'local' }) });
      setToken(body.sessionToken);
      await AsyncStorage.setItem(STORAGE_TOKEN, body.sessionToken);
      setMessage(`Connected to ${endpoint}. Session expires ${new Date(body.expiresAt).toLocaleTimeString()}.`);
      await refresh(body.sessionToken);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Pairing failed'); }
    finally { setBusy(false); }
  };

  const refresh = async (overrideToken?: string) => {
    setBusy(true);
    try {
      const old = token; if (overrideToken) setToken(overrideToken);
      const body = await request('/status', overrideToken ? { headers: { authorization: `Bearer ${overrideToken}` } } : {});
      setStatus(body); setMessage('Status refreshed.');
      if (overrideToken) setToken(old || overrideToken);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to reach bridge'); }
    finally { setBusy(false); }
  };

  const control = async (path: string, body: object, success: string) => {
    setBusy(true);
    try { await request(path, { method: 'POST', body: JSON.stringify(body) }); setMessage(success); await refresh(); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Command failed'); }
    finally { setBusy(false); }
  };

  const emergencyStop = () => Alert.alert('Emergency stop', 'Revoke the computer session now?', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Stop', style: 'destructive', onPress: () => control('/stop', {}, 'Emergency stop activated.') }
  ]);

  return <SafeAreaView style={styles.safe}><StatusBar style="light" /><ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.eyebrow}>VIRGOYT // HERMES</Text>
    <Text style={styles.title}>Hybrid Hermes</Text>
    <Text style={styles.subtitle}>Secure companion for your connected computer.</Text>

    <View style={styles.card}>
      <Text style={styles.section}>COMPUTER CONNECTION</Text>
      <TextInput value={bridgeUrl} onChangeText={setBridgeUrl} autoCapitalize="none" keyboardType="url" style={styles.input} placeholder="http://192.168.1.100:47821" placeholderTextColor="#68758a" />
      <TextInput value={code} onChangeText={setCode} keyboardType="number-pad" maxLength={6} style={styles.input} placeholder="6-digit pairing code" placeholderTextColor="#68758a" />
      <Pressable style={styles.primary} onPress={pair} disabled={busy}><Text style={styles.primaryText}>{busy ? 'WORKING…' : 'PAIR COMPUTER'}</Text></Pressable>
      <Text style={styles.hint}>Both devices must be on the same Wi-Fi network. Start the bridge with HERMES_BRIDGE_HOST=0.0.0.0.</Text>
    </View>

    <View style={styles.card}>
      <View style={styles.row}><Text style={styles.section}>LIVE STATUS</Text><Pressable onPress={() => refresh()}><Text style={styles.link}>REFRESH</Text></Pressable></View>
      <Text style={styles.message}>{message}</Text>
      {status && <View style={styles.statusGrid}>
        <Status label="HOST" value={status.hostname || '—'} />
        <Status label="PLATFORM" value={status.platform || '—'} />
        <Status label="MODE" value={status.mode || '—'} />
        <Status label="SESSION" value={status.paired ? 'PAIRED' : 'NOT PAIRED'} good={Boolean(status.paired)} />
      </View>}
    </View>

    <View style={styles.card}>
      <Text style={styles.section}>COMPUTER CONTROLS</Text>
      <View style={styles.buttonRow}>
        <Pressable style={styles.secondary} onPress={() => control('/allowlist', { apps: ['terminal', 'browser', 'files'] }, 'Safe app allowlist enabled.')}><Text style={styles.secondaryText}>ALLOW APPS</Text></Pressable>
        <Pressable style={styles.secondary} onPress={() => control('/launch', { app: 'browser' }, 'Browser launch requested.')}><Text style={styles.secondaryText}>OPEN BROWSER</Text></Pressable>
      </View>
      <View style={styles.buttonRow}>
        <Pressable style={styles.secondary} onPress={() => control('/sound', { action: 'down' }, 'Volume down requested.')}><Text style={styles.secondaryText}>VOL −</Text></Pressable>
        <Pressable style={styles.secondary} onPress={() => control('/sound', { action: 'up' }, 'Volume up requested.')}><Text style={styles.secondaryText}>VOL +</Text></Pressable>
        <Pressable style={styles.secondary} onPress={() => control('/sound', { action: 'mute' }, 'Mute requested.')}><Text style={styles.secondaryText}>MUTE</Text></Pressable>
      </View>
      <Pressable style={styles.danger} onPress={emergencyStop}><Text style={styles.dangerText}>EMERGENCY STOP</Text></Pressable>
    </View>
    <Text style={styles.footer}>No arbitrary shell commands. Pairing expires after ten minutes. Screen streaming and keyboard/mouse control remain disabled until native adapters are installed.</Text>
  </ScrollView></SafeAreaView>;
}

function Status({ label, value, good }: { label: string; value: string; good?: boolean }) { return <View style={styles.status}><Text style={styles.statusLabel}>{label}</Text><Text style={[styles.statusValue, good && styles.good]}>{value}</Text></View>; }

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#08111f' },
  container: { padding: 22, gap: 16 },
  eyebrow: { color: '#55e6b0', fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  title: { color: '#f5f7fb', fontSize: 36, fontWeight: '800', marginTop: -8 },
  subtitle: { color: '#9aa8bd', fontSize: 15, marginTop: -8 },
  card: { backgroundColor: '#111e31', borderColor: '#22344d', borderWidth: 1, borderRadius: 18, padding: 16, gap: 12 },
  section: { color: '#7f91aa', fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  input: { backgroundColor: '#0a1525', borderColor: '#2a415d', borderWidth: 1, color: '#f5f7fb', borderRadius: 10, padding: 13, fontSize: 15 },
  primary: { backgroundColor: '#55e6b0', borderRadius: 10, padding: 14, alignItems: 'center' },
  primaryText: { color: '#061218', fontWeight: '900', letterSpacing: 1 },
  hint: { color: '#7789a1', fontSize: 12, lineHeight: 18 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  link: { color: '#55e6b0', fontSize: 11, fontWeight: '800' },
  message: { color: '#c4cfde', fontSize: 13, lineHeight: 19 },
  statusGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  status: { backgroundColor: '#0a1525', borderRadius: 10, padding: 10, minWidth: '46%', flexGrow: 1 },
  statusLabel: { color: '#6f829d', fontSize: 10, fontWeight: '800' },
  statusValue: { color: '#f5f7fb', marginTop: 4, fontSize: 13, fontWeight: '700' },
  good: { color: '#55e6b0' },
  buttonRow: { flexDirection: 'row', gap: 8 },
  secondary: { flex: 1, backgroundColor: '#1b2c43', borderRadius: 9, padding: 12, alignItems: 'center' },
  secondaryText: { color: '#d6e0ef', fontSize: 11, fontWeight: '800' },
  danger: { backgroundColor: '#552538', borderColor: '#c85371', borderWidth: 1, borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 4 },
  dangerText: { color: '#ffb6c6', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  footer: { color: '#6d7e95', fontSize: 12, lineHeight: 18, paddingBottom: 18 }
});
