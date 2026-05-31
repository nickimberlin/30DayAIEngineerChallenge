export interface ScoreBreakdown {
  skills: number;
  experience: number;
  education: number;
  certifications: number;
}

export interface KeywordGap {
  keyword: string;
  category: string;
  severity: string;
}

export interface RewriteSuggestion {
  original: string;
  optimized: string;
  section: string;
  reason: string;
}

export interface AnalysisResponse {
  overall_score: number;
  breakdown: ScoreBreakdown;
  keyword_gaps: KeywordGap[];
  rewrite_suggestions: RewriteSuggestion[];
  resume_text: string;
}

export interface RewriteResumeResponse {
  rewritten_resume: string;
}

export interface CoverLetterResponse {
  cover_letter: string;
}

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
}

export interface ExperienceEntry {
  company: string;
  title: string;
  start_date: string;
  end_date: string;
  description: string;
}

export interface EducationEntry {
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string;
}

export interface StructuredResume {
  contact: ContactInfo;
  summary: string;
  skills: string[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
}
