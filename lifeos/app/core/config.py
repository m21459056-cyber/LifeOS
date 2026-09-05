"""
LifeOS JSON-based Configuration Manager
"""
import json
from pathlib import Path

CONFIG_DIR = Path.home() / ".lifeos"
CONFIG_FILE = CONFIG_DIR / "settings.json"

DEFAULT_SETTINGS = {
    "general": {
        "language": "tr",
        "launch_at_startup": False,
        "notifications_enabled": True
    },
    "appearance": {
        "theme": "dark",
        "accent_color": "#06b6d4",  # Cyan
        "animations": True,
        "compact_mode": False
    },
    "ai": {
        "provider": "ollama",
        "ollama_url": "http://127.0.0.1:11434",
        "model": "qwen2.5:coder",
        "temperature": 0.7,
        "context_size": 4096
    },
    "hardware": {
        "default_baud_rate": 115200,
        "auto_detect": True
    },
    "privacy": {
        "screen_analysis": True,
        "ai_memory": True,
        "telemetry": False
    }
}

class ConfigManager:
    def __init__(self):
        CONFIG_DIR.mkdir(parents=True, exist_ok=True)
        self.settings = self.load()

    def load(self):
        if not CONFIG_FILE.exists():
            self.save(DEFAULT_SETTINGS)
            return DEFAULT_SETTINGS.copy()
        try:
            with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                merged = DEFAULT_SETTINGS.copy()
                for cat, vals in data.items():
                    if cat in merged and isinstance(vals, dict):
                        merged[cat].update(vals)
                    else:
                        merged[cat] = vals
                return merged
        except Exception:
            return DEFAULT_SETTINGS.copy()

    def save(self, data=None):
        if data:
            self.settings = data
        with open(CONFIG_FILE, "w", encoding="utf-8") as f:
            json.dump(self.settings, f, indent=2, ensure_ascii=False)

    def get(self, category, key, default=None):
        return self.settings.get(category, {}).get(key, default)

    def set(self, category, key, value):
        if category not in self.settings:
            self.settings[category] = {}
        self.settings[category][key] = value
        self.save()

config_manager = ConfigManager()
