#!/usr/bin/env python3
import json
import os
import sys
from datetime import datetime
from pathlib import Path

HOME = Path(os.path.expanduser('~'))
HERMES_HOME = HOME / '.hermes'
CONFIG_PATH = HERMES_HOME / 'hermes.json'
SKILLS_PATH = HERMES_HOME / 'skills'

PROVIDERS = [
    {'id': 'ollama', 'name': 'Ollama (local/free)', 'kind': 'local', 'base_url': 'http://127.0.0.1:11434/v1', 'free': True},
    {'id': 'lmstudio', 'name': 'LM Studio (local/free)', 'kind': 'local', 'base_url': 'http://127.0.0.1:1234/v1', 'free': True},
    {'id': 'llama.cpp', 'name': 'llama.cpp (local/free)', 'kind': 'local', 'base_url': 'http://127.0.0.1:8080/v1', 'free': True},
    {'id': 'opencode', 'name': 'OpenCode', 'kind': 'compatible', 'base_url': 'https://api.opencode.ai/v1', 'free': False},
    {'id': 'openrouter', 'name': 'OpenRouter', 'kind': 'cloud', 'base_url': 'https://openrouter.ai/api/v1', 'free': False},
    {'id': 'huggingface', 'name': 'Hugging Face', 'kind': 'cloud', 'base_url': 'https://api-inference.huggingface.co/v1', 'free': False},
    {'id': 'custom', 'name': 'Custom OpenAI-compatible API', 'kind': 'custom', 'base_url': '', 'free': False},
]
MODELS = [
    {'id': 'ollama/llama3.2:3b', 'provider': 'ollama', 'name': 'Llama 3.2 3B', 'free': True, 'local': True},
    {'id': 'ollama/qwen2.5-coder:7b', 'provider': 'ollama', 'name': 'Qwen 2.5 Coder 7B', 'free': True, 'local': True},
    {'id': 'ollama/deepseek-coder:6.7b', 'provider': 'ollama', 'name': 'DeepSeek Coder 6.7B', 'free': True, 'local': True},
    {'id': 'lmstudio/local-model', 'provider': 'lmstudio', 'name': 'LM Studio loaded model', 'free': True, 'local': True},
    {'id': 'llama.cpp/local-model', 'provider': 'llama.cpp', 'name': 'llama.cpp loaded model', 'free': True, 'local': True},
    {'id': 'openrouter/free', 'provider': 'openrouter', 'name': 'OpenRouter free route', 'free': True, 'local': False},
    {'id': 'huggingface/auto', 'provider': 'huggingface', 'name': 'Hugging Face automatic model', 'free': False, 'local': False},
]
DEFAULT_CONFIG = {
    'active_model': 'ollama/llama3.2:3b',
    'small_model': 'ollama/llama3.2:3b',
    'confirm_sensitive_actions': True,
    'notifications': True,
    'request_timeout_ms': 10000,
    'custom_providers': [],
    'custom_models': [],
}

def load_config():
    HERMES_HOME.mkdir(parents=True, exist_ok=True)
    if not CONFIG_PATH.exists():
        save_config(DEFAULT_CONFIG.copy())
    try:
        data = json.loads(CONFIG_PATH.read_text())
    except (OSError, json.JSONDecodeError):
        data = DEFAULT_CONFIG.copy()
    return {**DEFAULT_CONFIG, **data}

def save_config(data):
    HERMES_HOME.mkdir(parents=True, exist_ok=True)
    CONFIG_PATH.write_text(json.dumps(data, indent=2) + '\n')

def all_providers(config):
    return PROVIDERS + config.get('custom_providers', [])

def all_models(config):
    return MODELS + config.get('custom_models', [])

def print_table(rows, fields):
    if not rows:
        print('No entries found.')
        return
    widths = [max([len(field)] + [len(str(row.get(field, ''))) for row in rows]) for field in fields]
    print('  '.join(field.upper().ljust(widths[i]) for i, field in enumerate(fields)))
    print('  '.join('-' * width for width in widths))
    for row in rows:
        print('  '.join(str(row.get(field, '')).ljust(widths[i]) for i, field in enumerate(fields)))

def show_help():
    print('''Hermes commands:\n  /models                 List built-in and custom models\n  /providers              List OpenRouter, Hugging Face, OpenCode, local, and custom providers\n  /model <provider/id>    Select the active model\n  /provider add           Add a custom OpenAI-compatible provider\n  /connector add          Add a custom API connector\n  /connectors             List saved connector names (secrets hidden)\n  /skills                 List all installed skills\n  /settings               Show Hermes settings\n  /settings set key val   Change a setting\n  /help                   Show this help\n  /time                   Show local time\n  /exit                   Quit Hermes''')

def command_models(config):
    print_table(all_models(config), ['id', 'name', 'free', 'local'])
    print(f"\nActive model: {config['active_model']}")

def command_providers(config):
    print_table(all_providers(config), ['id', 'name', 'kind', 'base_url', 'free'])

def command_skills():
    skills = sorted(path.name for path in SKILLS_PATH.iterdir() if path.is_dir()) if SKILLS_PATH.exists() else []
    print(f'Installed skills: {len(skills)}')
    for skill in skills:
        print(f'  ✓ {skill}')

def add_provider(config):
    provider_id = input('Provider ID: ').strip()
    name = input('Display name: ').strip() or provider_id
    base_url = input('OpenAI-compatible base URL: ').strip().rstrip('/')
    if not provider_id or not base_url:
        print('Provider ID and base URL are required.'); return
    config['custom_providers'] = [p for p in config['custom_providers'] if p['id'] != provider_id]
    config['custom_providers'].append({'id': provider_id, 'name': name, 'kind': 'custom', 'base_url': base_url, 'free': False})
    save_config(config); print(f'Provider saved: {provider_id}')

def add_connector(config):
    name = input('Connector name: ').strip()
    base_url = input('API base URL: ').strip().rstrip('/')
    auth = input('Auth type (none/bearer/header): ').strip() or 'none'
    if not name or not base_url:
        print('Connector name and base URL are required.'); return
    config.setdefault('connectors', []).append({'name': name, 'base_url': base_url, 'auth_type': auth, 'secret_configured': auth != 'none', 'created_at': datetime.now().isoformat()})
    save_config(config); print(f'Connector saved: {name}. Secret values are not displayed or stored by this interactive command.')

def handle_command(raw, config):
    parts = raw.strip().split()
    command = parts[0].lower() if parts else ''
    if command in ('/exit', '/quit'): return False
    if command in ('/help', '/?'): show_help()
    elif command == '/models': command_models(config)
    elif command == '/providers': command_providers(config)
    elif command == '/skills': command_skills()
    elif command == '/connectors': print_table(config.get('connectors', []), ['name', 'base_url', 'auth_type', 'secret_configured'])
    elif command == '/provider' and len(parts) > 1 and parts[1] == 'add': add_provider(config)
    elif command == '/connector' and len(parts) > 1 and parts[1] == 'add': add_connector(config)
    elif command == '/model' and len(parts) > 1:
        if any(model['id'] == parts[1] for model in all_models(config)):
            config['active_model'] = parts[1]; save_config(config); print(f"Active model: {parts[1]}")
        else: print('Unknown model. Run /models to see available models.')
    elif command == '/settings':
        if len(parts) >= 4 and parts[1] == 'set':
            key, value = parts[2], ' '.join(parts[3:])
            if key in ('confirm_sensitive_actions', 'notifications'): value = value.lower() in ('1', 'true', 'yes', 'on')
            elif key == 'request_timeout_ms': value = max(1000, min(30000, int(value)))
            else: print('Unknown setting.'); return True
            config[key] = value; save_config(config); print(f'Saved {key} = {value}')
        else: print(json.dumps({k: v for k, v in config.items() if k not in ('connectors',)}, indent=2))
    elif command == '/time': print(datetime.now().isoformat(timespec='seconds'))
    elif command: print('Hermes:', raw)
    return True

def main():
    config = load_config()
    print('''\n=========================\n   VirgoYT Hermes AI\n=========================\n''')
    print(f"Loaded {len(list(SKILLS_PATH.iterdir())) if SKILLS_PATH.exists() else 0} skills. Active model: {config['active_model']}")
    print('Type /help for models, providers, connectors, skills, and settings.')
    while True:
        try: raw = input('\nHermes> ')
        except (EOFError, KeyboardInterrupt): print(); break
        if not handle_command(raw, config): break

if __name__ == '__main__': main()
