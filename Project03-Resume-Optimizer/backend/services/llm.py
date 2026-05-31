import json
import os
from typing import Optional
from enum import Enum

from services.rewriter import RewriterService
from services.local_llm import LocalLLMService
from models.resume import KeywordGap, RewriteSuggestion, StructuredResume


class LLMProvider(str, Enum):
    GEMINI = "gemini"
    LOCAL = "local"


REWRITE_SYSTEM_PROMPT = """You are an expert resume writer and ATS optimization specialist.

Given a resume, a job description, and a list of missing keywords, produce rewrite suggestions that:
1. Naturally integrate the missing keywords into existing bullet points
2. Preserve truthfulness — never fabricate experience the candidate doesn't have
3. Use action verbs and quantify results where possible
4. Match the job description's tone and terminology
5. Return a JSON array of objects with fields: original (string), optimized (string), section (string), reason (string)"""

REWRITE_RESUME_SYSTEM_PROMPT = """You are an expert resume writer and ATS optimization specialist.

Given a resume and a job description, rewrite the entire resume to better match the position.

Rules:
1. Preserve truthfulness — never fabricate experience, skills, or credentials the candidate doesn't have
2. Rephrase existing bullet points using stronger action verbs and more impactful language
3. Reorder bullet points within each section to highlight the most relevant experience first
4. Naturally integrate keywords from the job description where they align with the candidate's actual experience
5. Use quantified results where the original resume already implies them
6. Keep the same section structure (summary, skills, experience, education, certifications) but improve the wording
7. Match the job description's tone and terminology
8. Return ONLY the rewritten resume text — no JSON, no preamble, no markdown formatting"""

COVER_LETTER_SYSTEM_PROMPT = """You are an expert cover letter writer.

Given a resume and a job description, write a professional cover letter that:
1. Opens with a strong hook referencing the role and company
2. Maps 2-3 specific qualifications from the resume to requirements in the job description
3. Uses a confident, professional tone
4. Closes with a call to action
5. Is 3-4 paragraphs long
6. Returns ONLY the letter text — no JSON, no preamble"""

STRUCTURE_SYSTEM_PROMPT = """You are a resume parsing expert. Extract structured information from the given resume text.

Return ONLY valid JSON with this exact structure (use empty strings for missing fields, no markdown fences):
{
  "contact": { "name": "", "email": "", "phone": "", "location": "", "linkedin": "", "github": "" },
  "summary": "",
  "skills": [],
  "experience": [{"company": "", "title": "", "start_date": "", "end_date": "", "description": ""}],
  "education": [{"institution": "", "degree": "", "field": "", "start_date": "", "end_date": ""}]
}"""


class LLMService:
    def __init__(self, provider: LLMProvider, api_key: Optional[str] = None):
        self.provider = provider
        self._api_key = api_key or os.getenv("GOOGLE_API_KEY", "")
        self._fallback = RewriterService()
        self._local = LocalLLMService()

    def generate_rewrites(
        self,
        resume_text: str,
        job_description: str,
        gaps: list[KeywordGap],
    ) -> list[RewriteSuggestion]:
        if not gaps:
            return []

        if self.provider == LLMProvider.LOCAL:
            try:
                return self._call_local_rewrites(resume_text, job_description, gaps)
            except Exception:
                return self._fallback.generate_rewrites(resume_text, job_description, gaps)

        if not self._api_key:
            return self._fallback.generate_rewrites(resume_text, job_description, gaps)

        try:
            return self._call_gemini_rewrites(resume_text, job_description, gaps)
        except Exception:
            return self._fallback.generate_rewrites(resume_text, job_description, gaps)

    def generate_cover_letter(self, resume_text: str, job_description: str) -> str:
        if self.provider == LLMProvider.LOCAL:
            try:
                return self._call_local_cover_letter(resume_text, job_description)
            except Exception:
                return self._fallback_cover_letter()

        if not self._api_key:
            return self._fallback_cover_letter()

        try:
            return self._call_gemini_cover_letter(resume_text, job_description)
        except Exception:
            return self._fallback_cover_letter()

    def generate_resume_rewrite(self, resume_text: str, job_description: str) -> str:
        prompt = f"""Resume:
{resume_text}

Job Description:
{job_description}

Rewrite the entire resume to better match this position while preserving all facts."""

        if self.provider == LLMProvider.LOCAL:
            try:
                return self._call_local_resume_rewrite(resume_text, job_description)
            except Exception:
                return resume_text

        if not self._api_key:
            return resume_text

        try:
            return self._call_gemini_resume_rewrite(resume_text, job_description)
        except Exception:
            return resume_text

    def structure_resume(self, resume_text: str) -> StructuredResume:
        prompt = f"Extract structured data from this resume:\n\n{resume_text}"

        if self.provider == LLMProvider.LOCAL:
            try:
                return self._call_local_structure(resume_text)
            except Exception:
                return StructuredResume()

        if not self._api_key:
            return StructuredResume()

        try:
            return self._call_gemini_structure(resume_text)
        except Exception:
            return StructuredResume()

    # ── Local (Ollama / Gemma) ──────────────────────────────────

    def _call_local_rewrites(
        self,
        resume_text: str,
        job_description: str,
        gaps: list[KeywordGap],
    ) -> list[RewriteSuggestion]:
        gap_text = "\n".join(f"- {g.keyword} ({g.category}, severity: {g.severity})" for g in gaps)

        prompt = f"""Resume:
{resume_text}

Job Description:
{job_description}

Missing Keywords to Integrate:
{gap_text}

Produce rewrite suggestions as a JSON array. Each object must have: original (string), optimized (string), section (string), reason (string)."""

        raw = self._local.generate(prompt=prompt, system_prompt=REWRITE_SYSTEM_PROMPT)
        raw = raw.strip()
        raw = raw.removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        data = json.loads(raw)

        if isinstance(data, list):
            return [RewriteSuggestion(**item) for item in data]
        return []

    def _call_local_cover_letter(self, resume_text: str, job_description: str) -> str:
        prompt = f"""Resume:
{resume_text}

Job Description:
{job_description}

Write the cover letter."""

        return self._local.generate(prompt=prompt, system_prompt=COVER_LETTER_SYSTEM_PROMPT)

    def _call_local_structure(self, resume_text: str) -> StructuredResume:
        prompt = f"Extract structured data from this resume:\n\n{resume_text}"
        raw = self._local.generate(prompt=prompt, system_prompt=STRUCTURE_SYSTEM_PROMPT)
        raw = raw.strip()
        raw = raw.removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        try:
            data = json.loads(raw)
            return StructuredResume(**data)
        except (json.JSONDecodeError, TypeError):
            return StructuredResume()

    # ── Gemini ──────────────────────────────────────────────────────

    def _call_gemini_rewrites(
        self,
        resume_text: str,
        job_description: str,
        gaps: list[KeywordGap],
    ) -> list[RewriteSuggestion]:
        from google import genai

        client = genai.Client(api_key=self._api_key)

        gap_text = "\n".join(f"- {g.keyword} ({g.category}, severity: {g.severity})" for g in gaps)

        prompt = f"""Resume:
{resume_text}

Job Description:
{job_description}

Missing Keywords to Integrate:
{gap_text}

Produce rewrite suggestions as a JSON array. Each object must have: original (string), optimized (string), section (string), reason (string)."""

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
            config={
                "system_instruction": REWRITE_SYSTEM_PROMPT,
                "temperature": 0.4,
            },
        )

        raw = response.text.strip()
        raw = raw.removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        data = json.loads(raw)

        if isinstance(data, list):
            return [RewriteSuggestion(**item) for item in data]
        return []

    def _call_gemini_cover_letter(self, resume_text: str, job_description: str) -> str:
        from google import genai

        client = genai.Client(api_key=self._api_key)

        prompt = f"""Resume:
{resume_text}

Job Description:
{job_description}

Write the cover letter."""

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
            config={
                "system_instruction": COVER_LETTER_SYSTEM_PROMPT,
                "temperature": 0.7,
            },
        )

        return response.text.strip()

    def _call_gemini_structure(self, resume_text: str) -> StructuredResume:
        from google import genai

        client = genai.Client(api_key=self._api_key)

        prompt = f"Extract structured data from this resume:\n\n{resume_text}"

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
            config={
                "system_instruction": STRUCTURE_SYSTEM_PROMPT,
                "temperature": 0.2,
            },
        )

        raw = response.text.strip()
        raw = raw.removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        try:
            data = json.loads(raw)
            return StructuredResume(**data)
        except (json.JSONDecodeError, TypeError):
            return StructuredResume()

    # ── Resume Rewrite ──────────────────────────────────────────

    def _call_local_resume_rewrite(self, resume_text: str, job_description: str) -> str:
        prompt = f"""Resume:
{resume_text}

Job Description:
{job_description}

Rewrite the entire resume to better match this position while preserving all facts."""

        return self._local.generate(prompt=prompt, system_prompt=REWRITE_RESUME_SYSTEM_PROMPT)

    def _call_gemini_resume_rewrite(self, resume_text: str, job_description: str) -> str:
        from google import genai

        client = genai.Client(api_key=self._api_key)

        prompt = f"""Resume:
{resume_text}

Job Description:
{job_description}

Rewrite the entire resume to better match this position while preserving all facts."""

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
            config={
                "system_instruction": REWRITE_RESUME_SYSTEM_PROMPT,
                "temperature": 0.4,
            },
        )

        return response.text.strip()

    # ── Fallback ────────────────────────────────────────────────────

    def _fallback_cover_letter(self) -> str:
        return (
            "Dear Hiring Manager,\n\n"
            "After reviewing the job description for this role, "
            "I am confident that my background aligns closely with your needs. "
            "My experience has prepared me to contribute immediately.\n\n"
            "To generate a tailored cover letter, provide a Gemini API key "
            "in the settings above.\n\n"
            "Sincerely,\n[Your Name]"
        )
