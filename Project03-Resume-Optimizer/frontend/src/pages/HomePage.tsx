import { useState } from "react";
import { Button, CopyButton, InlineLoading } from "@carbon/react";
import { ArrowRight, DocumentAdd, TextNewLine, DocumentExport, ChevronDown, ChevronRight } from "@carbon/icons-react";
import ResumeUpload from "../components/upload/ResumeUpload";
import JobDescriptionInput from "../components/upload/JobDescriptionInput";
import ScoreCard from "../components/analysis/ScoreCard";
import KeywordGaps from "../components/analysis/KeywordGaps";
import RewriteSuggestions from "../components/analysis/RewriteSuggestions";
import CoverLetterOutput from "../components/cover-letter/CoverLetterOutput";
import ApiKeyInput from "../components/api-key/ApiKeyInput";
import StructuredResumeEditor from "../components/resume/StructuredResumeEditor";
import { parseResumeText } from "../lib/resume-parser";
import { analyzeResume, generateCoverLetter, analyzeLocal, analyzeLocalCoverLetter, rewriteResume, rewriteResumeLocal, structureResume, structureResumeLocal, extractText, getUseLocalModel, getSavedApiKeyConfig } from "../lib/api";
import type { AnalysisResponse, CoverLetterResponse, StructuredResume } from "../types/resume";
import type { ApiKeyConfig } from "../components/api-key/ApiKeyInput";

type Step = "input" | "analyzing" | "results";

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [apiKeyConfig, setApiKeyConfig] = useState<ApiKeyConfig>(getSavedApiKeyConfig);
  const [loading, setLoading] = useState(false);
  const [coverLoading, setCoverLoading] = useState(false);
  const [rewriteLoading, setRewriteLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [rewrittenResume, setRewrittenResume] = useState<string | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [structuredResume, setStructuredResume] = useState<StructuredResume | null>(null);
  const [structuringLoading, setStructuringLoading] = useState(false);
  const [rawTextCollapsed, setRawTextCollapsed] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const useLocalModel = getUseLocalModel();
  const apiProvider = useLocalModel ? "local" : apiKeyConfig.provider;
  const step: Step = loading ? "analyzing" : result ? "results" : (resumeText ? "results" : "input");

  const handleFileChange = async (f: File | null) => {
    setFile(f);
    if (!f) {
      setResumeText("");
      setStructuredResume(null);
      setResult(null);
      return;
    }

    setError(null);
    setResult(null);
    setRawTextCollapsed(true);

    try {
      const text = await extractText(f);
      setResumeText(text);
      const regexData = parseResumeText(text);
      setStructuredResume(regexData);
      enrichStructure(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to extract resume text");
    }
  };

  const enrichStructure = async (text: string) => {
    setStructuringLoading(true);
    try {
      const llmData = useLocalModel
        ? await structureResumeLocal(text)
        : await structureResume(text, apiKeyConfig);
      setStructuredResume((prev) => {
        if (!prev) return llmData;
        return {
          contact: prev.contact,
          summary: prev.summary || llmData.summary,
          skills: prev.skills.length > 0 ? prev.skills : llmData.skills,
          experience: llmData.experience.length > 0 ? llmData.experience : prev.experience,
          education: llmData.education.length > 0 ? llmData.education : prev.education,
        };
      });
    } catch {
      // regex data already shown; LLM enrichment is non-critical
    } finally {
      setStructuringLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !hasJobDescription) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setCoverLetter(null);
    setRewrittenResume(null);
    try {
      let data: AnalysisResponse;
      if (useLocalModel) {
        data = await analyzeLocal(file, jobDescription);
      } else {
        const cfg = { ...apiKeyConfig, provider: apiProvider as "gemini" | "local" };
        const res = await analyzeResume(file, jobDescription, cfg);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        data = await res.json();
      }
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCoverLetter = async () => {
    if (!result || !jobDescription.trim()) return;
    setCoverLoading(true);
    setError(null);
    try {
      if (useLocalModel) {
        const data = await analyzeLocalCoverLetter(result.resume_text, jobDescription);
        setCoverLetter(data.cover_letter);
      } else {
        const cfg = { ...apiKeyConfig, provider: apiProvider as "gemini" | "local" };
        const res = await generateCoverLetter(result.resume_text, jobDescription, cfg);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data: CoverLetterResponse = await res.json();
        setCoverLetter(data.cover_letter);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cover letter generation failed");
    } finally {
      setCoverLoading(false);
    }
  };

  const handleRewriteResume = async () => {
    if (!result || !file || !jobDescription.trim()) return;
    setRewriteLoading(true);
    setError(null);
    setRewrittenResume(null);
    try {
      if (useLocalModel) {
        const data = await rewriteResumeLocal(result.resume_text, jobDescription);
        setRewrittenResume(data.rewritten_resume);
      } else {
        const cfg = { ...apiKeyConfig, provider: apiProvider as "gemini" | "local" };
        const data = await rewriteResume(file, jobDescription, cfg);
        setRewrittenResume(data.rewritten_resume);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Resume rewrite failed");
    } finally {
      setRewriteLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setFile(null);
    setResumeText("");
    setResult(null);
    setCoverLetter(null);
    setRewrittenResume(null);
    setStructuredResume(null);
    setError(null);
  };

  const readyToAnalyze = !!file;
  const hasJobDescription = jobDescription.trim().length > 0;

  return (
    <div>

      {/* ── Header ────────────────────────────────────────────── */}
      <section style={{ padding: "64px 16px 48px", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: 1056, margin: "0 auto" }}>
          <div style={{ textAlign: "center" as const }}>
            <h1
              style={{
                fontSize: 42, fontWeight: 300, lineHeight: 1.2,
                marginBottom: 12, letterSpacing: 0,
              }}
            >
              Resume Optimizer
            </h1>
            <p
              style={{
                fontSize: 16, color: "#525252", lineHeight: 1.5,
                letterSpacing: "0.16px", maxWidth: 520,
                margin: "0 auto",
              }}
            >
              Upload your resume, paste a job description, and get an ATS match score
              with AI-powered rewrite suggestions.
            </p>
          </div>

          {/* Step indicator */}
          <div
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 0, marginTop: 32,
            }}
          >
            {[
              { label: "Upload & analyze", key: "input" as const },
              { label: "Review results", key: "results" as const },
            ].map((s, i) => {
              const active = step === s.key || (s.key === "results" && (step === "analyzing" || step === "results"));
              const done = step === "results" && s.key === "input";
              return (
                <div key={s.key} style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "8px 16px",
                      backgroundColor: active || done ? "#0f62fe" : "#ffffff",
                      color: active || done ? "#ffffff" : "#8c8c8c",
                      fontSize: 13, fontWeight: 600, letterSpacing: "0.16px",
                      borderRadius: 4,
                      border: active || done ? "1px solid #0f62fe" : "1px solid #e0e0e0",
                    }}
                  >
                    <span
                      style={{
                        width: 20, height: 20, borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        backgroundColor: active || done ? "rgba(255,255,255,0.2)" : "#e0e0e0",
                        color: active || done ? "#ffffff" : "#8c8c8c",
                        fontSize: 11, fontWeight: 600,
                      }}
                    >
                      {done ? "✓" : i + 1}
                    </span>
                    {s.label}
                  </div>
                  {i === 0 && (
                    <div
                      style={{
                        width: 32, height: 2,
                        backgroundColor: done ? "#0f62fe" : "#e0e0e0",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Input area ────────────────────────────────────────── */}
      <section style={{ padding: "0 16px 48px", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: 1056, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 32,
            }}
            className="analyze-grid"
          >
            {/* Left column */}
            <div>
              <div
                style={{
                  border: "1px solid #e0e0e0",
                  padding: 32,
                  backgroundColor: "#ffffff",
                  marginBottom: 24,
                  borderRadius: 4,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                  <DocumentAdd size={20} style={{ color: "#0f62fe" }} />
                  <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0, letterSpacing: "0.16px" }}>
                    Upload resume
                  </h2>
                </div>
                <ResumeUpload file={file} onFileChange={handleFileChange} />
                {file && (
                  <p style={{ fontSize: 12, color: "#0f62fe", marginTop: 12, letterSpacing: "0.16px" }}>
                    {file.name}
                  </p>
                )}
              </div>

              {useLocalModel ? (
                <div
                  style={{
                    border: "1px solid #e0e0e0",
                    padding: 32,
                    backgroundColor: "#ffffff",
                    borderRadius: 4,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                    <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0, letterSpacing: "0.16px" }}>
                      AI model
                    </h2>
                  </div>
                  <div
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "12px 16px", backgroundColor: "#f4f4f4",
                    }}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#24a148" }} />
                    <span style={{ fontSize: 13, letterSpacing: "0.16px" }}>
                      Using local Gemma 2B model
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    border: "1px solid #e0e0e0",
                    padding: 32,
                    backgroundColor: "#ffffff",
                    borderRadius: 4,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                    <span style={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f4f4f4", fontSize: 11, fontWeight: 600 }}>⚙</span>
                    <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0, letterSpacing: "0.16px" }}>
                      API key <span style={{ fontWeight: 400, color: "#8c8c8c" }}>(optional)</span>
                    </h2>
                  </div>
                  <ApiKeyInput config={apiKeyConfig} onChange={setApiKeyConfig} />
                </div>
              )}
            </div>

            {/* Right column */}
            <div
              style={{
                border: "1px solid #e0e0e0",
                padding: 32,
                backgroundColor: "#ffffff",
                display: "flex",
                flexDirection: "column",
                borderRadius: 4,
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                <TextNewLine size={20} style={{ color: "#0f62fe" }} />
                <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0, letterSpacing: "0.16px" }}>
                  Paste job description
                </h2>
              </div>

              <div style={{ flex: 1 }}>
                <JobDescriptionInput value={jobDescription} onChange={setJobDescription} />
              </div>

              <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 12 }}>
                  <Button
                    kind="primary"
                    size="lg"
                    onClick={handleAnalyze}
                    disabled={!readyToAnalyze || !hasJobDescription || loading}
                    renderIcon={ArrowRight}
                  >
                    {loading ? "Analyzing..." : "Analyze match"}
                  </Button>
                {loading && <InlineLoading description="Running analysis..." />}
              </div>
              {error && (
                <p style={{ color: "#da1e28", marginTop: 16, fontSize: 14, letterSpacing: "0.16px" }}>
                  {error}
                </p>
              )}
            </div>
          </div>

          <style>{`
            @media (max-width: 671px) {
              .analyze-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </div>
      </section>

      {/* ── Data / Results ─────────────────────────────────────── */}
      {(resumeText || result) && (
        <section style={{ padding: "0 16px 64px", backgroundColor: "#f4f4f4" }}>
          <div style={{ maxWidth: 1056, margin: "0 auto" }}>
            {/* Section header */}
            <div
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "32px 0 24px",
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: 24, fontWeight: 400, margin: 0, marginBottom: 4,
                    letterSpacing: 0,
                  }}
                >
                  {result && hasJobDescription ? "Analysis results" : "Resume extracted"}
                </h2>
                <p style={{ fontSize: 14, color: "#525252", margin: 0, letterSpacing: "0.16px" }}>
                  {result && hasJobDescription
                    ? `Your resume scored ${Math.round(result.overall_score)}% against this job description.`
                    : result
                      ? "Add a job description above and re-analyze to get ATS scoring and rewrite suggestions."
                      : "Fill in missing fields or paste a job description above for ATS scoring."}
                </p>
              </div>
              <Button kind="ghost" size="sm" onClick={handleNewAnalysis}>
                New analysis
              </Button>
            </div>

            {result && hasJobDescription && (
              <div style={{ marginBottom: 32 }}>
                <ScoreCard overallScore={result.overall_score} breakdown={result.breakdown} />
              </div>
            )}

            {/* Structured resume editor */}
            {structuredResume && (
              <StructuredResumeEditor
                data={structuredResume}
                loading={structuringLoading}
                onRefresh={() => {
                  if (resumeText) setStructuredResume(parseResumeText(resumeText));
                }}
              />
            )}

            {/* Collapsible raw text */}
            {resumeText && (
              <div
                style={{
                  border: "1px solid #e0e0e0", padding: "16px 24px", backgroundColor: "#ffffff",
                  marginBottom: 32, borderRadius: 4, boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    cursor: "pointer", userSelect: "none",
                  }}
                  onClick={() => setRawTextCollapsed(!rawTextCollapsed)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {rawTextCollapsed ? <ChevronRight size={18} style={{ color: "#8c8c8c" }} /> : <ChevronDown size={18} style={{ color: "#8c8c8c" }} />}
                    <span style={{ fontSize: 13, color: "#525252", letterSpacing: "0.16px" }}>
                      Raw extracted text ({resumeText.length} chars)
                    </span>
                  </div>
                  <CopyButton onClick={() => navigator.clipboard.writeText(resumeText)} />
                </div>
                {!rawTextCollapsed && (
                  <div
                    style={{
                      backgroundColor: "#f4f4f4", padding: 16, marginTop: 12,
                      fontSize: 13, lineHeight: 1.6, letterSpacing: "0.16px",
                      whiteSpace: "pre-wrap", maxHeight: 240, overflowY: "auto",
                      fontFamily: "'IBM Plex Mono', 'Menlo', 'Courier New', monospace",
                      color: "#161616",
                    }}
                  >
                    {resumeText}
                  </div>
                )}
              </div>
            )}

            {result && hasJobDescription && (
              <>
                {/* Two-column results */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 32,
                    marginBottom: 32,
                  }}
                  className="results-grid"
                >
                  <KeywordGaps gaps={result.keyword_gaps} />
                  <RewriteSuggestions suggestions={result.rewrite_suggestions} />
                </div>

                <style>{`
                  @media (max-width: 671px) {
                    .results-grid { grid-template-columns: 1fr !important; }
                  }
                `}</style>

                {/* Cover letter / Resume rewrite */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 32 }} className="results-grid">
                  <CoverLetterOutput
                    content={coverLetter}
                    loading={coverLoading}
                    onGenerate={handleCoverLetter}
                  />

                  <div style={{ border: "1px solid #e0e0e0", padding: 32, backgroundColor: "#ffffff", borderRadius: 4, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                    <h3 style={{ fontSize: "24px", fontWeight: 400, marginBottom: "16px", letterSpacing: 0 }}>
                      Rewrite Resume
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "16px" }}>
                      <Button kind="secondary" onClick={handleRewriteResume} disabled={rewriteLoading} renderIcon={DocumentExport}>
                        {rewriteLoading ? "Rewriting..." : "Rewrite Resume"}
                      </Button>
                      {rewriteLoading && <InlineLoading description="Rewriting resume to fit the role..." />}
                    </div>
                    {rewrittenResume && (
                      <div>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
                          <CopyButton onClick={() => navigator.clipboard.writeText(rewrittenResume!)} />
                        </div>
                        <div
                          style={{
                            backgroundColor: "#f4f4f4",
                            padding: "16px",
                            fontSize: "14px",
                            lineHeight: 1.5,
                            letterSpacing: "0.16px",
                            whiteSpace: "pre-wrap",
                            maxHeight: 400,
                            overflowY: "auto",
                          }}
                        >
                          {rewrittenResume}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* ── Empty state ────────────────────────────────────────── */}
      {!resumeText && !result && !loading && !file && !jobDescription && (
        <section style={{ padding: "0 16px 80px", backgroundColor: "#f4f4f4" }}>
          <div style={{ maxWidth: 1056, margin: "0 auto" }}>
            <div
              style={{
                border: "1px solid #e0e0e0",
                padding: "64px 32px",
                backgroundColor: "#ffffff",
                textAlign: "center" as const,
                borderRadius: 4,
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              <p style={{ fontSize: 16, color: "#525252", margin: "0 0 8px", letterSpacing: "0.16px" }}>
                Upload a resume to extract and edit your details. Add a job description for ATS scoring.
              </p>
              <p style={{ fontSize: 14, color: "#8c8c8c", margin: 0, letterSpacing: "0.16px" }}>
                Supports PDF, DOCX, and plain text files.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
