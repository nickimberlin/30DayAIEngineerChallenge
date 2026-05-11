'use client';

import { Cpu, Trash2, CheckCircle, Info, Settings2, Loader2, Play } from 'lucide-react';
import { Card, Button, Badge, Progress } from '@/components/ui';
import { useAIModels } from '@/hooks';
import { AI_MODELS, MODEL_SPECS } from '@/lib/ai/models';
import { ModelSelector } from '@/components/ui/ModelSelector';
import { useState } from 'react';

export default function SettingsPage() {
  const {
    statuses,
    clearCachedModels,
    selectedModelId,
    selectModel,
    isLoading,
    initializeModel,
  } = useAIModels();
  const [showSelector, setShowSelector] = useState(false);

  const activeModelId = Array.from(statuses.values()).find(s => s.status === 'ready')?.modelId || null;
  const selectedModel = AI_MODELS.find(m => m.id === selectedModelId);

  const clearCache = async () => {
    if (typeof window !== 'undefined') {
      const caches = await window.caches.keys();
      await Promise.all(caches.map(cache => window.caches.delete(cache)));
      clearCachedModels();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Card padding="lg" className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[var(--color-light-mint)]">
              {activeModelId ? (
                <CheckCircle className="w-5 h-5 text-[var(--color-positive-green)]" />
              ) : (
                <Settings2 className="w-5 h-5 text-[var(--color-dark-green)]" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-near-black)]">
                {activeModelId ? 'Active Model' : 'No Model Loaded'}
              </h2>
              <p className="text-sm text-[var(--color-gray)]">
                {activeModelId
                  ? `${selectedModel?.name} loaded and ready`
                  : 'Select a model before generating proposals'}
              </p>
            </div>
          </div>
          <Button size="sm" variant="secondary" onClick={() => setShowSelector(true)}>
            {activeModelId ? 'Change Model' : 'Select Model'}
          </Button>
        </div>
        {selectedModel && activeModelId && (
          <div className="mt-3 p-3 rounded-[var(--radius-card)] bg-[var(--color-light-surface)]">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-[var(--color-near-black)]">
                  {selectedModel.name}
                </span>
                <span className="text-xs text-[var(--color-gray)] ml-2">
                  {selectedModel.downloadSize}
                </span>
              </div>
              <Badge variant="success" size="sm">In Memory</Badge>
            </div>
          </div>
        )}
      </Card>

      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-near-black)] display-text">
          Settings
        </h1>
        <p className="text-sm sm:text-base text-[var(--color-gray)] mt-1">
          Configure AI models and preferences.
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <Card padding="lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-[var(--color-light-mint)]">
              <Cpu className="w-5 h-5 text-[var(--color-dark-green)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-near-black)]">
                AI Models (Gemma 4)
              </h2>
              <p className="text-sm text-[var(--color-gray)]">
                Local models run in your browser. One model loaded at a time.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {AI_MODELS.map((model) => {
              const status = statuses.get(model.id);
              const isActive = status?.status === 'ready';
              const isLoadingThis = isLoading && selectedModelId === model.id;
              const specs = MODEL_SPECS[model.id];
              const needsBackend = model.downloadSize === 'Server-side only';

              return (
                <div
                  key={model.id}
                  className="p-4 rounded-[var(--radius-card)] border border-[rgba(14,15,12,0.12)] bg-[var(--color-light-surface)]"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-[var(--color-near-black)]">
                          {model.name}
                        </h3>
                        {isActive ? (
                          <Badge variant="success" size="sm">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </Badge>
                        ) : needsBackend ? (
                          <Badge variant="default" size="sm">
                            Server Required
                          </Badge>
                        ) : isLoadingThis ? (
                          <Badge variant="warning" size="sm">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Loading
                          </Badge>
                        ) : (
                          <Badge variant="default" size="sm">
                            Available
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-[var(--color-gray)] mt-1">
                        {model.description}
                      </p>
                    </div>
                    {!needsBackend && !isActive && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => initializeModel(model.id)}
                        disabled={isLoading}
                      >
                        {isLoadingThis ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                        Load Model
                      </Button>
                    )}
                  </div>

                  {isLoadingThis && status && (
                    <div className="mt-2">
                      <Progress value={status.progress} showLabel />
                    </div>
                  )}

                  {specs && (
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-[var(--color-gray)]">
                      <span>Size: {model.downloadSize}</span>
                      <span>Context: {specs.contextLength}</span>
                      <span>Modalities: {specs.modalities.join(', ')}</span>
                    </div>
                  )}

                  {specs?.notes && (
                    <p className="text-xs text-[var(--color-dark-green)] mt-1">{specs.notes}</p>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        <Card padding="lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-[var(--color-background-accent)]">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-near-black)]">
                About Local AI
              </h2>
              <p className="text-sm text-[var(--color-gray)]">
                How browser-based AI inference works.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-3 rounded-[var(--radius-card)] bg-[var(--color-light-surface)]">
              <h4 className="font-semibold text-[var(--color-near-black)] mb-1">Gemma 4 E4B (ONNX)</h4>
              <p className="text-xs text-[var(--color-gray)]">~4 GB. 128K context. Text + Image + Audio. Optimized for browser.</p>
            </div>
            <div className="p-3 rounded-[var(--radius-card)] bg-[var(--color-light-surface)]">
              <h4 className="font-semibold text-[var(--color-near-black)] mb-1">Gemma 4 E2B (ONNX)</h4>
              <p className="text-xs text-[var(--color-gray)]">~2 GB. 128K context. Text + Image + Audio. Best for mobile/laptop.</p>
            </div>
            <div className="p-3 rounded-[var(--radius-card)] bg-[var(--color-light-surface)]">
              <h4 className="font-semibold text-[var(--color-near-black)] mb-1">Gemma 4 31B</h4>
              <p className="text-xs text-[var(--color-gray)]">Server-side only. Best performance for complex proposals.</p>
            </div>
            <div className="p-3 rounded-[var(--radius-card)] bg-[var(--color-light-surface)]">
              <h4 className="font-semibold text-[var(--color-near-black)] mb-1">Privacy</h4>
              <p className="text-xs text-[var(--color-gray)]">Browser models process everything locally. No data leaves your device.</p>
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-[rgba(208,50,56,0.10)]">
              <Trash2 className="w-5 h-5 text-[var(--color-danger-red)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-near-black)]">
                Clear Cache
              </h2>
              <p className="text-sm text-[var(--color-gray)]">
                Remove downloaded models and free up browser storage.
              </p>
            </div>
          </div>

          <Button variant="danger" onClick={clearCache}>
            <Trash2 className="w-4 h-4" />
            Clear Model Cache
          </Button>
        </Card>
      </div>

      <ModelSelector
        models={AI_MODELS}
        selectedModelId={selectedModelId}
        onSelect={selectModel}
        isOpen={showSelector}
        onClose={() => setShowSelector(false)}
        activeModelId={activeModelId}
      />
    </div>
  );
}
