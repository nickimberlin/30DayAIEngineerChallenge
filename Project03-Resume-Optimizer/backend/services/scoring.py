from dataclasses import dataclass
from models.resume import ScoreBreakdown, KeywordGap


CATEGORY_KEYWORDS = {
    "skills": [
        "python", "javascript", "typescript", "react", "node", "sql",
        "aws", "docker", "kubernetes", "git", "api", "rest", "graphql",
        "machine learning", "deep learning", "nlp", "data science",
        "agile", "scrum", "devops", "ci/cd", "terraform", "linux",
    ],
    "experience": [
        "lead", "managed", "built", "developed", "designed", "architected",
        "implemented", "deployed", "optimized", "scaled", "mentored",
        "coordinated", "delivered", "launched", "migrated",
    ],
    "education": [
        "bachelor", "master", "phd", "bs", "ba", "ms", "ma", "ph.d",
        "computer science", "engineering", "mathematics", "statistics",
        "degree", "university", "college", "gpa",
    ],
    "certifications": [
        "certified", "certification", "aws certified", "azure",
        "google cloud", "pmp", "scrum master", "cissp", "comptia",
        "ccna", "ceh", "cfa", "cpa",
    ],
}


@dataclass
class ScoreResult:
    overall: float
    breakdown: ScoreBreakdown


class ScoreService:
    def compute_match(self, resume_text: str, job_text: str) -> ScoreResult:
        resume_lower = resume_text.lower()
        job_lower = job_text.lower()

        categories = {}
        for category, keywords in CATEGORY_KEYWORDS.items():
            matched = sum(1 for kw in keywords if kw in resume_lower and kw in job_lower)
            total = sum(1 for kw in keywords if kw in job_lower)
            categories[category] = round((matched / max(total, 1)) * 100, 1)

        breakdown = ScoreBreakdown(**categories)
        overall = round(sum(categories.values()) / max(len(categories), 1), 1)

        return ScoreResult(overall=overall, breakdown=breakdown)

    def find_keyword_gaps(self, resume_text: str, job_text: str) -> list[KeywordGap]:
        resume_lower = resume_text.lower()
        job_lower = job_text.lower()
        gaps: list[KeywordGap] = []

        for category, keywords in CATEGORY_KEYWORDS.items():
            for kw in keywords:
                if kw in job_lower and kw not in resume_lower:
                    severity = "high" if kw in self._high_priority_keywords() else "medium"
                    gaps.append(KeywordGap(keyword=kw, category=category, severity=severity))

        return gaps

    def _high_priority_keywords(self) -> set:
        return {
            "python", "javascript", "react", "aws", "docker",
            "kubernetes", "machine learning", "sql", "typescript",
        }
