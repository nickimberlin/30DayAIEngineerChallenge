/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ModelLoadProgress } from '@/types';
import { AI_MODELS } from './models';

let loadCallback: ((progress: ModelLoadProgress) => void) | null = null;

export function onLoadProgress(cb: (progress: ModelLoadProgress) => void) {
  loadCallback = cb;
}

function emitProgress(progress: ModelLoadProgress) {
  if (loadCallback) {
    loadCallback(progress);
  }
}

let activeModel: {
  id: string;
  model: any;
  processor: any;
} | null = null;

export function getActiveModelId(): string | null {
  return activeModel?.id ?? null;
}

export async function loadActiveModel(modelId: string): Promise<{ model: any; processor: any }> {
  const config = AI_MODELS.find((m) => m.id === modelId);
  if (!config) {
    throw new Error(`Model config not found for: ${modelId}`);
  }

  if (activeModel?.id === modelId) {
    return { model: activeModel.model, processor: activeModel.processor };
  }

  emitProgress({ modelId, status: 'loading', progress: 5, message: `Loading ${config.name}...` });

  let device: 'webgpu' | 'wasm' = 'wasm';
  if (typeof navigator !== 'undefined' && 'gpu' in navigator) {
    try {
      const gpu = (navigator as { gpu?: { requestAdapter: () => Promise<unknown> } }).gpu;
      if (gpu) {
        const adapter = await gpu.requestAdapter();
        device = adapter ? 'webgpu' : 'wasm';
      }
    } catch {
      device = 'wasm';
    }
  }

  const {
    AutoProcessor,
    Gemma4ForConditionalGeneration,
  } = await import('@huggingface/transformers');

  emitProgress({ modelId, status: 'loading', progress: 20, message: `Downloading ${config.name}...` });

  const processor = await AutoProcessor.from_pretrained(config.modelId, {
    device: device as 'webgpu' | 'wasm',
  });

  emitProgress({ modelId, status: 'loading', progress: 50, message: `Loading ${config.name} model...` });

  const model = await Gemma4ForConditionalGeneration.from_pretrained(config.modelId, {
    dtype: 'q4f16',
    device: device as 'webgpu' | 'wasm',
  });

  if (activeModel) {
    try {
      activeModel.model.dispose?.();
    } catch (e) {
      console.warn('[model-loader] dispose error:', e);
    }
  }
  activeModel = { id: modelId, model, processor };

  emitProgress({ modelId, status: 'ready', progress: 100, message: `${config.name} ready` });

  return { model, processor };
}

export async function generateText(
  modelId: string,
  promptText: string,
  options?: { max_new_tokens?: number; temperature?: number }
): Promise<string> {
  if (!activeModel || activeModel.id !== modelId) {
    throw new Error('Model not loaded. Call loadActiveModel first.');
  }

  const { model, processor } = activeModel;

  const messages = [
    { role: 'user' as const, content: [{ type: 'text' as const, text: promptText }] },
  ];

  const prompt = processor.apply_chat_template(messages, {
    enable_thinking: false,
    add_generation_prompt: true,
  });

  const inputs = await processor(prompt, null, null, { add_special_tokens: false });

  const outputs = await model.generate({
    ...inputs,
    max_new_tokens: options?.max_new_tokens ?? 2048,
    do_sample: options?.temperature ? true : false,
    ...(options?.temperature ? { temperature: options.temperature } : {}),
  });

  const decoded = processor.decode(outputs[0], { skip_special_tokens: true });

  const thoughtMatch = decoded.match(/<\|channel\|>thought\n[\s\S]*?<\|channel\|>\s*/);
  const response = thoughtMatch ? decoded.replace(thoughtMatch[0], '') : decoded;

  return response.trim();
}

export function isModelReady(modelId: string): boolean {
  return activeModel?.id === modelId;
}

export function getModelStatus(modelId: string): ModelLoadProgress {
  const config = AI_MODELS.find((m) => m.id === modelId);
  if (!config) return { modelId, status: 'idle', progress: 0, message: 'Unknown model' };
  if (activeModel?.id === modelId) return { modelId, status: 'ready', progress: 100, message: `${config.name} ready` };
  return { modelId, status: 'idle', progress: 0, message: 'Not loaded' };
}

export function getAllModelStatuses(): ModelLoadProgress[] {
  return AI_MODELS.map((m) => getModelStatus(m.id));
}

export async function unloadActiveModel(): Promise<void> {
  if (activeModel) {
    try {
      activeModel.model.dispose?.();
    } catch (e) {
      console.warn('[model-loader] dispose error:', e);
    }
    activeModel = null;
  }
}
