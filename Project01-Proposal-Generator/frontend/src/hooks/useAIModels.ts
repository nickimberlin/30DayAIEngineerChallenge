'use client';

import { useState, useEffect, useCallback } from 'react';
import type { AIModelConfig, ModelLoadProgress } from '@/types';
import { AI_MODELS } from '@/lib/ai/models';
import { onLoadProgress, getModelStatus, getActiveModelId, loadActiveModel } from '@/lib/ai/model-loader';

const SELECTED_MODEL_KEY = 'selected-model-id';

function getSelectedModelId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(SELECTED_MODEL_KEY);
  } catch {
    return null;
  }
}

function setSelectedModelId(modelId: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (modelId) {
      localStorage.setItem(SELECTED_MODEL_KEY, modelId);
    } else {
      localStorage.removeItem(SELECTED_MODEL_KEY);
    }
  } catch {
    console.log('[useAIModels] Failed to save selected model');
  }
}

export interface AIModelState {
  models: AIModelConfig[];
  statuses: Map<string, ModelLoadProgress>;
  loadedCount: number;
  totalCount: number;
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
  selectedModelId: string | null;
  activeModelId: string | null;
}

export function useAIModels() {
  const [state, setState] = useState<AIModelState>({
    models: AI_MODELS,
    statuses: new Map(),
    loadedCount: 0,
    totalCount: AI_MODELS.filter(m => m.downloadSize !== 'Server-side only').length,
    isReady: false,
    isLoading: false,
    error: null,
    selectedModelId: null,
    activeModelId: null,
  });

  useEffect(() => {
    const savedSelectedModel = getSelectedModelId();
    const availableBrowserModels = AI_MODELS.filter(m => m.downloadSize !== 'Server-side only');
    const defaultModel = savedSelectedModel && availableBrowserModels.some(m => m.id === savedSelectedModel)
      ? savedSelectedModel
      : availableBrowserModels[0]?.id || null;

    const initialStatuses = new Map<string, ModelLoadProgress>();
    AI_MODELS.forEach((model) => {
      initialStatuses.set(model.id, getModelStatus(model.id));
    });

    setState((prev) => ({
      ...prev,
      statuses: initialStatuses,
      selectedModelId: defaultModel,
    }));

    onLoadProgress((progress: ModelLoadProgress) => {
      setState((prev) => {
        const newStatuses = new Map(prev.statuses);
        newStatuses.set(progress.modelId, progress);
        return {
          ...prev,
          statuses: newStatuses,
          isLoading: progress.status === 'loading' || progress.status === 'downloading' || prev.isLoading,
          isReady: progress.status === 'ready' || prev.isReady,
          activeModelId: progress.status === 'ready' ? progress.modelId : prev.activeModelId,
          loadedCount: progress.status === 'ready' ? 1 : prev.loadedCount,
          error: progress.status === 'error' ? progress.message : prev.error,
        };
      });
    });
  }, []);

  const selectModel = useCallback((modelId: string) => {
    setSelectedModelId(modelId);
    setState((prev) => ({ ...prev, selectedModelId: modelId }));
  }, []);

  const initializeModel = useCallback(async (modelId: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      await loadActiveModel(modelId);
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to load model',
      }));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const clearCachedModels = useCallback(() => {
    localStorage.removeItem(SELECTED_MODEL_KEY);
    setState((prev) => {
      const newStatuses = new Map<string, ModelLoadProgress>();
      AI_MODELS.forEach((model) => {
        newStatuses.set(model.id, getModelStatus(model.id));
      });
      return {
        ...prev,
        statuses: newStatuses,
        loadedCount: 0,
        isReady: false,
        activeModelId: null,
        selectedModelId: null,
      };
    });
  }, []);

  return {
    ...state,
    selectModel,
    initializeModel,
    clearCachedModels,
  };
}
