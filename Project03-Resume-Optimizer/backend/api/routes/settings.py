import os
from fastapi import APIRouter
from pydantic import BaseModel

from services.local_llm import LocalLLMService, DEFAULT_MODEL

router = APIRouter()
local_llm = LocalLLMService()

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))


@router.get("/settings/model")
async def get_model_status():
    """Check Ollama status and whether the default model is available."""
    status = local_llm.check_ollama()
    installed = DEFAULT_MODEL in status.get("models", [])
    return {
        "ollama_running": status["running"],
        "model_installed": installed,
        "model_name": DEFAULT_MODEL,
        "available_models": status.get("models", []),
    }


class PullModelRequest(BaseModel):
    model_name: str = DEFAULT_MODEL


@router.post("/settings/model/pull")
async def pull_model(body: PullModelRequest):
    """Pull/download the Gemma model via Ollama."""
    result = local_llm.pull_model(body.model_name)
    return result


@router.delete("/settings/model")
async def delete_model(body: PullModelRequest = PullModelRequest()):
    """Remove a downloaded model from Ollama."""
    result = local_llm.remove_model(body.model_name)
    return result


@router.get("/settings/readme")
async def get_readme():
    """Return the project README.md content."""
    readme_path = os.path.join(PROJECT_ROOT, "README.md")
    if os.path.exists(readme_path):
        with open(readme_path, "r") as f:
            content = f.read()
        return {"content": content}
    return {"content": "# AI Resume Optimizer\n\nREADME not found."}
