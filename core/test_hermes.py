import io
import json
import tempfile
import unittest
from contextlib import redirect_stdout
from pathlib import Path
from unittest.mock import patch

import hermes

class HermesRuntimeTests(unittest.TestCase):
    def test_models_lists_openrouter_huggingface_and_local_presets(self):
        config = hermes.DEFAULT_CONFIG.copy()
        output = io.StringIO()
        with redirect_stdout(output):
            hermes.command_models(config)
        text = output.getvalue()
        self.assertIn('ollama/llama3.2:3b', text)
        self.assertIn('openrouter/free', text)
        self.assertIn('huggingface/auto', text)

    def test_provider_list_includes_open_code_and_custom(self):
        config = hermes.DEFAULT_CONFIG.copy()
        output = io.StringIO()
        with redirect_stdout(output):
            hermes.command_providers(config)
        self.assertIn('OpenCode', output.getvalue())
        self.assertIn('Hugging Face', output.getvalue())

    def test_model_selection_persists(self):
        with tempfile.TemporaryDirectory() as directory:
            hermes.CONFIG_PATH = Path(directory) / 'hermes.json'
            hermes.HERMES_HOME = Path(directory)
            config = hermes.load_config()
            with patch('builtins.input', side_effect=[]):
                hermes.handle_command('/model openrouter/free', config)
            self.assertEqual(hermes.load_config()['active_model'], 'openrouter/free')

if __name__ == '__main__':
    unittest.main()
