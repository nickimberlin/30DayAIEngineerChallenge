import json
import urllib.request
import urllib.error
import os
from typing import Optional

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
DEFAULT_MODEL = "gemma2:2b"


class LocalLLMService:
    def __init__(self):
        self._model: Optional[str] = None

    def set_model(self, name: str):
        self._model = name

    def check_ollama(self) -> dict:
        try:
            req = urllib.request.Request(f"{OLLAMA_HOST}/api/tags")
            with urllib.request.urlopen(req, timeout=5) as resp:
                data = json.loads(resp.read().decode())
                models = [m["name"] for m in data.get("models", [])]
                return {"running": True, "models": models}
        except (urllib.error.URLError, ConnectionError, OSError):
            return {"running": False, "models": []}

    def pull_model(self, model_name: str = DEFAULT_MODEL) -> dict:
        payload = json.dumps({"name": model_name}).encode()
        req = urllib.request.Request(
            f"{OLLAMA_HOST}/api/pull",
            data=payload,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=300) as resp:
                lines = resp.read().decode().strip().split("\n")
                for line in lines:
                    if not line.strip():
                        continue
                    try:
                        obj = json.loads(line)
                        if obj.get("status") == "success":
                            return {"ok": True, "model": model_name}
                    except json.JSONDecodeError:
                        continue
                return {"ok": True, "model": model_name}
        except urllib.error.HTTPError as e:
            body = e.read().decode()
            return {"ok": False, "error": body}
        except urllib.error.URLError as e:
            return {"ok": False, "error": str(e.reason)}

    def remove_model(self, model_name: str = DEFAULT_MODEL) -> dict:
        payload = json.dumps({"name": model_name}).encode()
        req = urllib.request.Request(
            f"{OLLAMA_HOST}/api/delete",
            data=payload,
            headers={"Content-Type": "application/json"},
            method="DELETE",
        )
        try:
            with urllib.request.urlopen(req, timeout=30):
                return {"ok": True}
        except urllib.error.HTTPError as e:
            body = e.read().decode()
            return {"ok": False, "error": body}
        except urllib.error.URLError as e:
            return {"ok": False, "error": str(e.reason)}

    def generate(self, prompt: str, system_prompt: str = "", model: str = "") -> str:
        model_name = model or self._model or DEFAULT_MODEL
        payload_dict = {
            "model": model_name,
            "prompt": prompt,
            "stream": False,
            "options": {"temperature": 0.4},
        }
        if system_prompt:
            payload_dict["system"] = system_prompt

        payload = json.dumps(payload_dict).encode()
        req = urllib.request.Request(
            f"{OLLAMA_HOST}/api/generate",
            data=payload,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read().decode())
            return data.get("response", "")
