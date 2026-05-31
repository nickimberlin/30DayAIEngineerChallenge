import type { ApiKeyConfig } from "../components/api-key/ApiKeyInput";
import type { AnalysisResponse, CoverLetterResponse, RewriteResumeResponse, KeywordGap, RewriteSuggestion, StructuredResume } from "../types/resume";
import {
  isModelLoaded,
  generateRewrites as browserRewrites,
  generateCoverLetter as browserCoverLetter,
  getModelStatus as getBrowserModelStatus,
} from "./ai/browser-llm";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

function authHeaders(config: ApiKeyConfig): Record<string, string> {
  const headers: Record<string, string> = {
    "X-LLM-Provider": config.provider,
  };
  if (config.key) {
    headers["X-API-Key"] = config.key;
  }
  return headers;
}

export async function analyzeResume(
  resumeFile: File,
  jobDescription: string,
  apiKeyConfig: ApiKeyConfig,
): Promise<Response> {
  const form = new FormData();
  form.append("resume", resumeFile);
  form.append("job_description", jobDescription);

  return fetch(`${API_BASE}/api/analyze`, {
    method: "POST",
    headers: authHeaders(apiKeyConfig),
    body: form,
  });
}

export async function generateCoverLetter(
  resumeText: string,
  jobDescription: string,
  apiKeyConfig: ApiKeyConfig,
): Promise<Response> {
  return fetch(`${API_BASE}/api/cover-letter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(apiKeyConfig),
    },
    body: JSON.stringify({ resume_text: resumeText, job_description: jobDescription }),
  });
}

export async function rewriteResume(
  resumeFile: File,
  jobDescription: string,
  apiKeyConfig: ApiKeyConfig,
): Promise<RewriteResumeResponse> {
  const form = new FormData();
  form.append("resume_file", resumeFile);
  form.append("job_description", jobDescription);

  const res = await fetch(`${API_BASE}/api/rewrite-resume`, {
    method: "POST",
    headers: authHeaders(apiKeyConfig),
    body: form,
  });
  if (!res.ok) throw new Error(`Rewrite failed: ${res.status}`);
  return res.json();
}

export async function rewriteResumeLocal(
  resumeText: string,
  jobDescription: string,
): Promise<RewriteResumeResponse> {
  if (!isModelLoaded()) {
    throw new Error("Browser model not loaded. Load it in Settings first.");
  }
  const { generateRewriteResume } = await import("./ai/browser-llm");
  const rewritten = await generateRewriteResume(resumeText, jobDescription);
  return { rewritten_resume: rewritten };
}

export async function extractText(resumeFile: File): Promise<string> {
  const form = new FormData();
  form.append("resume", resumeFile);

  const res = await fetch(`${API_BASE}/api/extract-text`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(`Text extraction failed: ${res.status}`);
  const data = await res.json();
  return data.resume_text as string;
}

export async function structureResume(
  resumeText: string,
  apiKeyConfig: ApiKeyConfig,
): Promise<StructuredResume> {
  const form = new FormData();
  form.append("resume_text", resumeText);

  const res = await fetch(`${API_BASE}/api/analyze/structure`, {
    method: "POST",
    headers: authHeaders(apiKeyConfig),
    body: form,
  });
  if (!res.ok) throw new Error(`Structure extraction failed: ${res.status}`);
  return res.json();
}

export async function structureResumeLocal(
  resumeText: string,
): Promise<StructuredResume> {
  if (!isModelLoaded()) {
    throw new Error("Browser model not loaded. Load it in Settings first.");
  }
  const { generateStructuredResume } = await import("./ai/browser-llm");
  return generateStructuredResume(resumeText);
}

export async function healthCheck(): Promise<Response> {
  return fetch(`${API_BASE}/health`);
}

// ── Settings / Local model ────────────────────────────────────

export interface ModelStatus {
  browser_model_loaded: boolean;
  model_name: string;
}

export async function getModelStatus(): Promise<ModelStatus> {
  const loaded = getBrowserModelStatus() === "ready";
  return {
    browser_model_loaded: loaded,
    model_name: "Gemma 4 E2B (ONNX)",
  };
}

export async function getReadme(): Promise<string> {
  const res = await fetch(`${API_BASE}/api/settings/readme`);
  if (!res.ok) throw new Error("Failed to fetch README");
  const data = await res.json();
  return data.content as string;
}

// ── Browser-based local analysis (extract text + scores via backend, LLM in browser) ──

export interface ExtractResult {
  resume_text: string;
  overall_score: number;
  breakdown: { skills: number; experience: number; education: number; certifications: number };
  keyword_gaps: KeywordGap[];
}

export async function analyzeLocal(
  resumeFile: File,
  jobDescription: string,
): Promise<AnalysisResponse> {
  const form = new FormData();
  form.append("resume", resumeFile);
  form.append("job_description", jobDescription);

  const res = await fetch(`${API_BASE}/api/analyze/extract`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(`Extraction failed: ${res.status}`);
  const data: ExtractResult = await res.json();

  let rewrites: RewriteSuggestion[] = [];
  if (isModelLoaded()) {
    rewrites = await browserRewrites(data.resume_text, jobDescription, data.keyword_gaps);
  }

  return {
    overall_score: data.overall_score,
    breakdown: data.breakdown,
    keyword_gaps: data.keyword_gaps,
    rewrite_suggestions: rewrites,
    resume_text: data.resume_text,
  };
}

export async function analyzeLocalCoverLetter(
  resumeText: string,
  jobDescription: string,
): Promise<CoverLetterResponse> {
  if (!isModelLoaded()) {
    return { cover_letter: "" };
  }
  const letter = await browserCoverLetter(resumeText, jobDescription);
  return { cover_letter: letter };
}

// ── localStorage helpers ──────────────────────────────────────

export function getUseLocalModel(): boolean {
  return localStorage.getItem("useLocalModel") === "true";
}

export function setUseLocalModel(val: boolean) {
  localStorage.setItem("useLocalModel", val ? "true" : "false");
}

export function getSavedApiKeyConfig(): ApiKeyConfig {
  const saved = localStorage.getItem("apiKeyConfig");
  if (saved) {
    try {
      return JSON.parse(saved) as ApiKeyConfig;
    } catch {
      // fall through
    }
  }
  return { provider: "gemini", key: "" };
}

export function setSavedApiKeyConfig(config: ApiKeyConfig) {
  localStorage.setItem("apiKeyConfig", JSON.stringify(config));
}
