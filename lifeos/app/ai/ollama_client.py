"""
LifeOS Local AI Engine & Ollama Client
Supports streaming, connection testing, and model switching (Qwen, Gemma, DeepSeek, Llama).
"""
import json
import requests
from typing import Generator, Dict, Any

class OllamaClient:
    def __init__(self, base_url: str = "http://127.0.0.1:11434"):
        self.base_url = base_url.rstrip("/")

    def test_connection(self) -> Dict[str, Any]:
        try:
            resp = requests.get(f"{self.base_url}/api/tags", timeout=3)
            if resp.status_code == 200:
                data = resp.json()
                models = [m.get("name") for m in data.get("models", [])]
                return {
                    "connected": True,
                    "models": models,
                    "message": f"Ollama is online. {len(models)} models available."
                }
            return {"connected": False, "models": [], "message": f"HTTP {resp.status_code}"}
        except Exception as e:
            return {
                "connected": False,
                "models": [],
                "message": f"Ollama service unreachable ({str(e)}). Ensure 'ollama serve' is running."
            }

    def chat_stream(self, model: str, messages: list, temperature: float = 0.7) -> Generator[str, None, None]:
        url = f"{self.base_url}/api/chat"
        payload = {
            "model": model,
            "messages": messages,
            "stream": True,
            "options": {"temperature": temperature}
        }
        try:
            with requests.post(url, json=payload, stream=True, timeout=30) as resp:
                if resp.status_code != 200:
                    yield f"Error: Ollama returned status {resp.status_code}"
                    return
                for line in resp.iter_lines(decode_unicode=True):
                    if line:
                        chunk = json.loads(line)
                        content = chunk.get("message", {}).get("content", "")
                        if content:
                            yield content
        except Exception as e:
            yield f"\n[Ollama Connection Error]: {str(e)}"
