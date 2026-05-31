import type { RewriteSuggestion, KeywordGap, StructuredResume } from "../types/resume";

export type ModelStatusType = "idle" | "loading" | "ready" | "error";
export type ProgressCallback = (status: ModelStatusType, progress: number, message: string) => void;

const MODEL_ID = "onnx-community/gemma-4-E2B-it-ONNX";
const MODEL_DTYPE = "q4f16";

const LOCAL_STORAGE_KEY = "browserModelLoaded";

export const PROGRESS_DETECT_DEVICE = 5;
export const PROGRESS_DEVICE_READY = 10;
export const PROGRESS_TOKENIZER_START = 15;
export const PROGRESS_TOKENIZER_END = 35;
export const PROGRESS_MODEL_START = 40;
export const PROGRESS_MODEL_END = 95;
export const PROGRESS_COMPLETE = 100;

const DEFAULT_MAX_NEW_TOKENS = 2048;
const REWRITE_TEMPERATURE = 0.4;
const COVER_LETTER_TEMPERATURE = 0.7;

const REWRITE_SYSTEM_PROMPT = `You are an expert resume writer and ATS optimization specialist.

Given a resume, a job description, and a list of missing keywords, produce rewrite suggestions that:
1. Naturally integrate the missing keywords into existing bullet points
2. Preserve truthfulness — never fabricate experience the candidate doesn't have
3. Use action verbs and quantify results where possible
4. Match the job description's tone and terminology
5. Return a JSON array of objects with fields: original (string), optimized (string), section (string), reason (string)`;

const REWRITE_RESUME_SYSTEM_PROMPT = `You are an expert resume writer and ATS optimization specialist.

Given a resume and a job description, rewrite the entire resume to better match the position.

Rules:
1. Preserve truthfulness — never fabricate experience, skills, or credentials the candidate doesn't have
2. Rephrase existing bullet points using stronger action verbs and more impactful language
3. Reorder bullet points within each section to highlight the most relevant experience first
4. Naturally integrate keywords from the job description where they align with the candidate's actual experience
5. Use quantified results where the original resume already implies them
6. Keep the same section structure but improve the wording
7. Match the job description's tone and terminology
8. Return ONLY the rewritten resume text — no JSON, no preamble, no markdown formatting`;

const COVER_LETTER_SYSTEM_PROMPT = `You are an expert cover letter writer.

Given a resume and a job description, write a professional cover letter that:
1. Opens with a strong hook referencing the role and company
2. Maps 2-3 specific qualifications from the resume to requirements in the job description
3. Uses a confident, professional tone
4. Closes with a call to action
5. Is 3-4 paragraphs long
6. Returns ONLY the letter text — no JSON, no preamble`;

const STRUCTURE_SYSTEM_PROMPT = `You are a resume parsing expert. Extract structured information from the given resume text.

Return ONLY valid JSON with this exact structure (use empty strings for missing fields, no markdown fences):
{
  "contact": { "name": "", "email": "", "phone": "", "location": "", "linkedin": "", "github": "" },
  "summary": "",
  "skills": [],
  "experience": [{"company": "", "title": "", "start_date": "", "end_date": "", "description": ""}],
  "education": [{"institution": "", "degree": "", "field": "", "start_date": "", "end_date": ""}]
}`;

let activeInstance: {
  model: unknown;
  processor: unknown;
  id: string;
} | null = null;
let loadProgress: ProgressCallback | null = null;

export function onLoadProgress(cb: ProgressCallback) {
  loadProgress = cb;
}

function emitProgress(status: ModelStatusType, progress: number, message: string) {
  loadProgress?.(status, progress, message);
}

async function detectDevice(): Promise<"webgpu" | "wasm"> {
  if (typeof navigator !== "undefined" && "gpu" in navigator) {
    try {
      const gpu = (navigator as { gpu?: { requestAdapter: () => Promise<unknown> } }).gpu;
      if (gpu) {
        const adapter = await gpu.requestAdapter();
        if (adapter) return "webgpu";
      }
    } catch {
      // fall through
    }
  }
  return "wasm";
}

export function wasModelEverLoaded(): boolean {
  return localStorage.getItem(LOCAL_STORAGE_KEY) === "true";
}

export async function loadModel(restore = false): Promise<void> {
  if (activeInstance) return;

  const action = restore ? "Restoring" : "Downloading";
  console.log(`🔄 ${action} Gemma 4 E2B model...`);

  emitProgress("loading", PROGRESS_DETECT_DEVICE, "Detecting device...");

  const device = await detectDevice();

  emitProgress("loading", PROGRESS_DEVICE_READY, `Using ${device} backend...`);

  const { AutoProcessor, Gemma4ForConditionalGeneration } = await import("@huggingface/transformers");

  const makeProgressCallback = (label: string, min: number, max: number) =>
    (progress: { status: string; name?: string; file?: string; progress?: number; loaded?: number; total?: number }) => {
      if (progress.status === "progress" && typeof progress.progress === "number") {
        const pct = min + (progress.progress / 100) * (max - min);
        const fileInfo = progress.file || progress.name || "";
        emitProgress("loading", Math.round(pct), `${label}: ${fileInfo} (${Math.round(progress.progress)}%)`);
      }
    };

  emitProgress("loading", PROGRESS_TOKENIZER_START, `${action} tokenizer...`);

  const processor = await AutoProcessor.from_pretrained(MODEL_ID, {
    device,
    progress_callback: makeProgressCallback("Tokenizer", PROGRESS_TOKENIZER_START, PROGRESS_TOKENIZER_END),
  });

  emitProgress("loading", PROGRESS_MODEL_START, `${action} model...`);

  const model = await Gemma4ForConditionalGeneration.from_pretrained(MODEL_ID, {
    dtype: MODEL_DTYPE,
    device,
    progress_callback: makeProgressCallback("Model", PROGRESS_MODEL_START, PROGRESS_MODEL_END),
  });

  if (activeInstance) {
    try {
      (activeInstance.model as { dispose?: () => void }).dispose?.();
    } catch {
      // ignore
    }
  }
  activeInstance = { id: MODEL_ID, model, processor };

  localStorage.setItem(LOCAL_STORAGE_KEY, "true");
  emitProgress("ready", PROGRESS_COMPLETE, "Gemma 4 E2B ready");
}

export function unloadModel(): void {
  if (activeInstance) {
    try {
      (activeInstance.model as { dispose?: () => void }).dispose?.();
    } catch {
      // ignore
    }
    activeInstance = null;
  }
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}

export function isModelLoaded(): boolean {
  return activeInstance !== null;
}

export function getModelStatus(): ModelStatusType {
  if (activeInstance) return "ready";
  if (localStorage.getItem(LOCAL_STORAGE_KEY) === "true") return "loading";
  return "idle";
}

async function generate(
  prompt: string,
  systemPrompt?: string,
  options?: { max_new_tokens?: number; temperature?: number },
): Promise<string> {
  if (!activeInstance) {
    throw new Error("Model not loaded. Call loadModel() first.");
  }

  const { model, processor } = activeInstance;
  const modelObj = model as {
    generate: (inputs: Record<string, unknown>) => Promise<ArrayLike<number>[]>;
  };
  const processorObj = processor as {
    apply_chat_template: (
      messages: Array<{ role: string; content: string }>,
      opts: { enable_thinking: boolean; add_generation_prompt: boolean },
    ) => string;
    (text: string, a: null, b: null, opts: { add_special_tokens: boolean }): Promise<Record<string, unknown>>;
    decode: (tokens: ArrayLike<number>, opts: { skip_special_tokens: boolean }) => string;
  };

  const messages = [
    ...(systemPrompt
      ? [{ role: "system" as const, content: systemPrompt }]
      : []),
    { role: "user" as const, content: prompt },
  ];

  const formattedPrompt = processorObj.apply_chat_template(messages, {
    enable_thinking: false,
    add_generation_prompt: true,
  });

  const inputs = await processorObj(formattedPrompt, null, null, { add_special_tokens: false });

  const outputs = await modelObj.generate({
    ...inputs,
    max_new_tokens: options?.max_new_tokens ?? DEFAULT_MAX_NEW_TOKENS,
    do_sample: options?.temperature ? true : false,
    ...(options?.temperature ? { temperature: options.temperature } : {}),
  });

  let decoded = processorObj.decode(outputs[0], { skip_special_tokens: true });

  const thoughtMatch = decoded.match(/<\|channel\|>thought\n[\s\S]*?<\|channel\|>\s*/);
  if (thoughtMatch) {
    decoded = decoded.replace(thoughtMatch[0], "");
  }

  return decoded.trim();
}

export async function generateRewrites(
  resumeText: string,
  jobDescription: string,
  gaps: KeywordGap[],
): Promise<RewriteSuggestion[]> {
  if (!gaps.length) return [];

  const gapText = gaps.map((g) => `- ${g.keyword} (${g.category}, severity: ${g.severity})`).join("\n");

  const prompt = `Resume:
${resumeText}

Job Description:
${jobDescription}

Missing Keywords to Integrate:
${gapText}

Produce rewrite suggestions as a JSON array. Each object must have: original (string), optimized (string), section (string), reason (string).`;

  let raw = await generate(prompt, REWRITE_SYSTEM_PROMPT, { temperature: REWRITE_TEMPERATURE });
  raw = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();

  try {
    const data = JSON.parse(raw);
    if (Array.isArray(data)) {
      return data as RewriteSuggestion[];
    }
  } catch {
    // fall through
  }
  return [];
}

export async function generateRewriteResume(resumeText: string, jobDescription: string): Promise<string> {
  const prompt = `Resume:
${resumeText}

Job Description:
${jobDescription}

Rewrite the entire resume to better match this position while preserving all facts.`;

  return generate(prompt, REWRITE_RESUME_SYSTEM_PROMPT, { temperature: REWRITE_TEMPERATURE });
}

export async function generateCoverLetter(resumeText: string, jobDescription: string): Promise<string> {
  const prompt = `Resume:
${resumeText}

Job Description:
${jobDescription}

Write the cover letter.`;

  return generate(prompt, COVER_LETTER_SYSTEM_PROMPT, { temperature: COVER_LETTER_TEMPERATURE });
}

export async function generateStructuredResume(resumeText: string): Promise<StructuredResume> {
  const prompt = `Extract structured data from this resume:\n\n${resumeText}`;
  let raw = await generate(prompt, STRUCTURE_SYSTEM_PROMPT, { temperature: 0.2 });
  raw = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
  try {
    return JSON.parse(raw) as StructuredResume;
  } catch {
    return {
      contact: { name: "", email: "", phone: "", location: "", linkedin: "", github: "" },
      summary: "",
      skills: [],
      experience: [],
      education: [],
    };
  }
}

export { MODEL_ID };
