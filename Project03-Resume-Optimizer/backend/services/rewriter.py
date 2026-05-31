from typing import Optional
from models.resume import RewriteSuggestion, KeywordGap


class RewriterService:
    def generate_rewrites(
        self,
        resume_text: str,
        job_description: str,
        gaps: list[KeywordGap],
    ) -> list[RewriteSuggestion]:
        suggestions: list[RewriteSuggestion] = []

        for gap in gaps:
            suggestion = self._build_suggestion(resume_text, gap)
            if suggestion:
                suggestions.append(suggestion)

        return suggestions

    def _build_suggestion(
        self,
        resume_text: str,
        gap: KeywordGap,
    ) -> Optional[RewriteSuggestion]:
        lines = resume_text.split("\n")
        target_line = None
        section = "skills"

        for i, line in enumerate(lines):
            lower = line.lower().strip()
            if lower.startswith(("experience", "work", "employment")):
                section = "experience"
            elif lower.startswith(("education", "academic")):
                section = "education"
            elif lower.startswith(("certification", "certificates")):
                section = "certifications"

            if gap.keyword.lower() in lower:
                target_line = line
                break

        if target_line:
            original = target_line.strip()
            optimized = original + f" [{gap.keyword}]"
            return RewriteSuggestion(
                original=original,
                optimized=optimized,
                section=section,
                reason=f"Add missing keyword '{gap.keyword}' ({gap.category})"
            )

        return None
