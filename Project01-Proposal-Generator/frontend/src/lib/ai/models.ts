import type { AIModelConfig } from '@/types';

export const AI_MODELS: AIModelConfig[] = [
  {
    id: 'gemma-4-31b',
    name: 'Gemma 4 31B',
    modelId: 'google/gemma-4-31b-it',
    description: 'Most capable model for full proposal generation. Note: Requires backend server for full 31B model.',
    downloadSize: 'Server-side only',
    useCase: 'Full proposal generation',
    backend: 'webgpu',
  },
  {
    id: 'gemma-4-e4b',
    name: 'Gemma 4 E4B (ONNX)',
    modelId: 'onnx-community/gemma-4-E4B-it-ONNX',
    description: 'On-device multimodal model. Text, Image, Audio support. Optimized for browser via ONNX.',
    downloadSize: '~4 GB (quantized)',
    useCase: 'Full proposal generation',
    backend: 'webgpu',
  },
  {
    id: 'gemma-4-e2b',
    name: 'Gemma 4 E2B (ONNX)',
    modelId: 'onnx-community/gemma-4-E2B-it-ONNX',
    description: 'Compact on-device model. Text, Image, Audio support. Best for browsers and mobile.',
    downloadSize: '~2 GB (quantized)',
    useCase: 'Scope & pricing suggestions',
    backend: 'wasm',
  },
  {
    id: 'qwen2-0.5b',
    name: 'Qwen2 0.5B',
    modelId: 'Xenova/qwen2-0.5b-instruct',
    description: 'Fast, lightweight model for quick suggestions. Great for offline use.',
    downloadSize: '~400 MB',
    useCase: 'Quick refinements',
    backend: 'wasm',
  },
  {
    id: 'phi-3-mini',
    name: 'Phi-3 Mini',
    modelId: 'Xenova/phi-3-mini-4k-instruct',
    description: 'Capable mini model. 4K context, good balance of size and quality.',
    downloadSize: '~2.4 GB',
    useCase: 'Scope suggestions',
    backend: 'wasm',
  },
  {
    id: 'distilgpt2',
    name: 'DistilGPT2',
    modelId: 'Xenova/distilgpt2',
    description: 'Fastest model for quick completions. ~167 MB, great for demos.',
    downloadSize: '~167 MB',
    useCase: 'Template customization',
    backend: 'wasm',
  },
];

export function getModelConfig(modelId: string): AIModelConfig | undefined {
  return AI_MODELS.find((m) => m.id === modelId);
}

export function getPrimaryModel(): AIModelConfig {
  return AI_MODELS.find((m) => m.id === 'gemma-4-e4b') || AI_MODELS[1];
}

export function getSupportModels(): AIModelConfig[] {
  return AI_MODELS.slice(2);
}

export const MODEL_SPECS: Record<string, {
  contextLength: string;
  modalities: string[];
  architecture: string;
  notes?: string;
}> = {
  'gemma-4-31b': {
    contextLength: '256K tokens',
    modalities: ['Text', 'Image'],
    architecture: 'Dense 31B',
    notes: 'Best performance - requires FastAPI backend',
  },
  'gemma-4-e4b': {
    contextLength: '128K tokens',
    modalities: ['Text', 'Image', 'Audio'],
    architecture: 'Dense 4.5B (PLE)',
    notes: 'ONNX optimized for browser',
  },
  'gemma-4-e2b': {
    contextLength: '128K tokens',
    modalities: ['Text', 'Image', 'Audio'],
    architecture: 'Dense 2.3B (PLE)',
    notes: 'ONNX optimized for browser',
  },
  'qwen2-0.5b': {
    contextLength: '32K tokens',
    modalities: ['Text'],
    architecture: 'Dense 0.5B',
    notes: 'Fast local inference',
  },
  'phi-3-mini': {
    contextLength: '4K tokens',
    modalities: ['Text'],
    architecture: 'Dense 3.8B',
    notes: 'Good quality/size balance',
  },
  'distilgpt2': {
    contextLength: '1K tokens',
    modalities: ['Text'],
    architecture: 'Distilled 86M',
    notes: 'Fastest inference',
  },
};

export const SUGGESTED_SAMPLING_CONFIG = {
  temperature: 0.7,
  top_p: 0.9,
  top_k: 40,
};

export const BROWSER_GEMMA_MODELS = AI_MODELS.filter(m => m.id.startsWith('gemma-4-e'));
