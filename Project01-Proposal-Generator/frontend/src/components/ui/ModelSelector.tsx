'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { Modal, Button, Badge } from '@/components/ui';
import type { AIModelConfig } from '@/types';
import { MODEL_SPECS } from '@/lib/ai/models';

interface ModelSelectorProps {
  models: AIModelConfig[];
  selectedModelId: string | null;
  onSelect: (modelId: string) => void;
  isOpen: boolean;
  onClose: () => void;
  activeModelId?: string | null;
}

export function ModelSelector({
  models,
  selectedModelId,
  onSelect,
  isOpen,
  onClose,
  activeModelId,
}: ModelSelectorProps) {
  const [pendingSelection, setPendingSelection] = useState<string | null>(selectedModelId);
  const availableModels = models.filter(
    (m) => m.downloadSize !== 'Server-side only'
  );

  const handleConfirm = () => {
    if (pendingSelection) {
      onSelect(pendingSelection);
      onClose();
    }
  };

  const handleOpen = () => {
    setPendingSelection(selectedModelId);
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose} title="Select AI Model">
      <div className="space-y-3">
        <p className="text-sm text-[var(--color-gray)]">
          Choose a model for proposal generation. One model is loaded at a time.
        </p>

        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {availableModels.map((model) => {
            const specs = MODEL_SPECS[model.id];
            const isSelected = pendingSelection === model.id;
            const isActive = activeModelId === model.id;

            return (
              <button
                key={model.id}
                onClick={() => setPendingSelection(model.id)}
                className={`w-full text-left p-4 rounded-[var(--radius-card)] border transition-all ${
                  isSelected
                    ? 'border-[var(--color-primary)] bg-[var(--color-light-mint)] ring-2 ring-[var(--color-primary)]'
                    : 'border-[rgba(14,15,12,0.12)] hover:border-[var(--color-primary)] hover:bg-[var(--color-light-surface)]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-[var(--color-near-black)]">
                        {model.name}
                      </h3>
                      {isActive && (
                        <Badge variant="success" size="sm">
                          <Check className="w-3 h-3" />
                          Active
                        </Badge>
                      )}
                      {isSelected && !isActive && (
                        <Badge variant="info" size="sm">
                          Selected
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-[var(--color-gray)] mt-1">
                      {model.description}
                    </p>
                    {specs && (
                      <div className="flex flex-wrap gap-2 mt-2 text-xs text-[var(--color-gray)]">
                        <span>Size: {model.downloadSize}</span>
                        <span>Context: {specs.contextLength}</span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} disabled={!pendingSelection}>
          <Check className="w-4 h-4" />
          Confirm Selection
        </Button>
      </div>
    </Modal>
  );
}
