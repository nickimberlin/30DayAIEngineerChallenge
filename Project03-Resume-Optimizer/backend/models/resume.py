from pydantic import BaseModel


class ScoreBreakdown(BaseModel):
    skills: float
    experience: float
    education: float
    certifications: float


class KeywordGap(BaseModel):
    keyword: str
    category: str
    severity: str


class RewriteSuggestion(BaseModel):
    original: str
    optimized: str
    section: str
    reason: str


class AnalysisRequest(BaseModel):
    resume_text: str
    job_description: str


class AnalysisResponse(BaseModel):
    overall_score: float
    breakdown: ScoreBreakdown
    keyword_gaps: list[KeywordGap]
    rewrite_suggestions: list[RewriteSuggestion]
    resume_text: str


class RewriteResumeResponse(BaseModel):
    rewritten_resume: str


class CoverLetterRequest(BaseModel):
    resume_text: str
    job_description: str


class CoverLetterResponse(BaseModel):
    cover_letter: str


class ContactInfo(BaseModel):
    name: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    linkedin: str = ""
    github: str = ""


class ExperienceEntry(BaseModel):
    company: str = ""
    title: str = ""
    start_date: str = ""
    end_date: str = ""
    description: str = ""


class EducationEntry(BaseModel):
    institution: str = ""
    degree: str = ""
    field: str = ""
    start_date: str = ""
    end_date: str = ""


class StructuredResume(BaseModel):
    contact: ContactInfo = ContactInfo()
    summary: str = ""
    skills: list[str] = []
    experience: list[ExperienceEntry] = []
    education: list[EducationEntry] = []
