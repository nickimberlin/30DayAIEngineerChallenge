from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import analysis, cover_letter, settings

app = FastAPI(
    title="AI Resume Optimizer API",
    version="0.1.0",
    description="Tailor resumes to job descriptions with AI-powered ATS scoring, keyword optimization, and rewrite suggestions.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analysis.router, prefix="/api", tags=["analysis"])
app.include_router(cover_letter.router, prefix="/api", tags=["cover-letter"])
app.include_router(settings.router, prefix="/api", tags=["settings"])


@app.get("/health")
async def health():
    return {"status": "ok"}
