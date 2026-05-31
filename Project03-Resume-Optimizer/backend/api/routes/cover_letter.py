from typing import Optional
from fastapi import APIRouter, Header, HTTPException

from models.resume import CoverLetterRequest, CoverLetterResponse
from services.llm import LLMService, LLMProvider

router = APIRouter()


@router.post("/cover-letter", response_model=CoverLetterResponse)
async def generate_cover_letter(
    body: CoverLetterRequest,
    x_api_key: Optional[str] = Header(default=None),
    x_llm_provider: str = Header(default="gemini"),
):
    if not body.resume_text.strip() or not body.job_description.strip():
        raise HTTPException(status_code=400, detail="Resume text and job description are required")

    llm = LLMService(
        provider=LLMProvider(x_llm_provider),
        api_key=x_api_key,
    )
    letter = llm.generate_cover_letter(body.resume_text, body.job_description)
    return CoverLetterResponse(cover_letter=letter)
