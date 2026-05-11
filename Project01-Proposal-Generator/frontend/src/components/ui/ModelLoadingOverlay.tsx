'use client';

import { X } from 'lucide-react';
import { Progress } from '@/components/ui';
import type { ModelLoadProgress } from '@/types';

interface ModelLoadingOverlayProps {
  models: ModelLoadProgress[];
  onClose?: () => void;
}

export function ModelLoadingOverlay({ models, onClose }: ModelLoadingOverlayProps) {
  const downloadingModels = models.filter(
    (m) => m.status === 'downloading' || m.status === 'loading'
  );

  if (downloadingModels.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-md p-8 bg-white rounded-[var(--radius-section)] border border-[rgba(14,15,12,0.12)] shadow-[var(--shadow-ring)]">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--color-light-surface)] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-[var(--color-gray)]" />
          </button>
        )}

        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-[var(--color-near-black)] mb-2">
            Loading AI Models
          </h2>
          <p className="text-[var(--color-gray)]">
            Downloading models for the first time. This may take a few minutes.
          </p>
        </div>

        <div className="space-y-6">
          {downloadingModels.map((model) => (
            <div key={model.modelId} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-[var(--color-near-black)]">
                  {model.modelId}
                </span>
                <span className="text-[var(--color-gray)]">{model.message}</span>
              </div>
              <Progress value={model.progress} />
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-[var(--color-light-mint)] rounded-[var(--radius-card)]">
          <p className="text-sm text-[var(--color-dark-green)]">
            Models are downloaded once and cached in your browser. Future visits will be instant.
          </p>
        </div>
      </div>
    </div>
  );
}
