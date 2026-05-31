from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, Header, HTTPException

from models.resume import AnalysisResponse, RewriteResumeResponse, StructuredResume
from services.scoring import ScoreService
from services.llm import LLMService, LLMProvider
from utils.pdf_parser import parse_pdf
from utils.docx_parser import parse_docx

router = APIRouter()
score_service = ScoreService()


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(""),
    x_api_key: Optional[str] = Header(default=None),
    x_llm_provider: str = Header(default="gemini"),
):
    resume_text = await _extract_text(resume)
    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from resume")

    has_jd = bool(job_description.strip())

    score = score_service.compute_match(resume_text, job_description)
    keyword_gaps = score_service.find_keyword_gaps(resume_text, job_description) if has_jd else []

    llm = LLMService(
        provider=LLMProvider(x_llm_provider),
        api_key=x_api_key,
    )
    rewrites = llm.generate_rewrites(resume_text, job_description, keyword_gaps) if has_jd else []

    return AnalysisResponse(
        overall_score=score.overall,
        breakdown=score.breakdown,
        keyword_gaps=keyword_gaps,
        rewrite_suggestions=rewrites,
        resume_text=resume_text,
    )


@router.post("/analyze/extract")
async def extract_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(""),
):
    """Extract text and compute ATS scores without running any LLM.
    Used by the browser-based local LLM flow."""
    resume_text = await _extract_text(resume)
    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from resume")

    has_jd = bool(job_description.strip())

    score = score_service.compute_match(resume_text, job_description)
    keyword_gaps = score_service.find_keyword_gaps(resume_text, job_description) if has_jd else []

    return {
        "resume_text": resume_text,
        "overall_score": score.overall,
        "breakdown": score.breakdown.model_dump(),
        "keyword_gaps": [g.model_dump() for g in keyword_gaps],
    }

@router.post("/extract-text")
async def extract_text_only(
    resume: UploadFile = File(...),
):
    """Lightweight text extraction — no LLM, no scoring. Returns plain text only."""
    resume_text = await _extract_text(resume)
    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from resume")
    return {"resume_text": resume_text}


@router.post("/analyze/structure", response_model=StructuredResume)
async def structure_resume_endpoint(
    resume_text: str = Form(...),
    x_api_key: Optional[str] = Header(default=None),
    x_llm_provider: str = Header(default="gemini"),
):
    llm = LLMService(
        provider=LLMProvider(x_llm_provider),
        api_key=x_api_key,
    )
    return llm.structure_resume(resume_text)


@router.post("/rewrite-resume", response_model=RewriteResumeResponse)
async def rewrite_resume(
    resume_file: UploadFile = File(...),
    job_description: str = Form(...),
    x_api_key: Optional[str] = Header(default=None),
    x_llm_provider: str = Header(default="gemini"),
):
    resume_text = await _extract_text(resume_file)
    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from resume")

    llm = LLMService(
        provider=LLMProvider(x_llm_provider),
        api_key=x_api_key,
    )
    rewritten = llm.generate_resume_rewrite(resume_text, job_description)
    return RewriteResumeResponse(rewritten_resume=rewritten)


async def _extract_text(file: UploadFile) -> str:
    content = await file.read()
    if file.filename.endswith(".pdf"):
        return parse_pdf(content)
    elif file.filename.endswith(".docx"):
        return parse_docx(content)
    else:
        return content.decode("utf-8", errors="ignore")
