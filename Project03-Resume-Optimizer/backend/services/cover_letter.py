class CoverLetterService:
    def generate(self, resume_text: str, job_description: str) -> str:
        return (
            f"Dear Hiring Manager,\n\n"
            f"After reviewing the job description for this role, "
            f"I am confident that my background aligns closely with your needs. "
            f"My experience has prepared me to contribute immediately.\n\n"
            f"[Detailed cover letter would be generated here via LLM API"
            f" — see env vars OPENAI_API_KEY or ANTHROPIC_API_KEY]\n\n"
            f"Sincerely,\n[Your Name]"
        )
