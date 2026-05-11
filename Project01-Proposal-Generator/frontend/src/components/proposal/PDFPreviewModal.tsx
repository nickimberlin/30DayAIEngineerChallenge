'use client';

import { useState } from 'react';
import { Download, X, Loader2 } from 'lucide-react';
import { Modal, Button } from '@/components/ui';
import type { Proposal } from '@/types';

interface PDFPreviewModalProps {
  open: boolean;
  onClose: () => void;
  proposal: Proposal;
  onExport: () => Promise<void>;
}

export function PDFPreviewModal({ open, onClose, proposal, onExport }: PDFPreviewModalProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport();
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Export PDF" description={`Export "${proposal.title}" as a PDF document.`}>
      <div className="space-y-6">
        <div className="aspect-[8.5/11] bg-white rounded-lg border border-[rgba(14,15,12,0.12)] overflow-hidden">
          <div className="p-8 text-sm">
            <h1 className="text-2xl font-bold text-[var(--color-near-black)] mb-2">
              {proposal.title}
            </h1>
            <p className="text-[var(--color-gray)] mb-6">
              Client: {proposal.clientName}
            </p>

            <div className="space-y-4">
              {proposal.sections.slice(0, 2).map((section) => (
                <div key={section.id}>
                  <h3 className="font-semibold text-[var(--color-near-black)] mb-1">
                    {section.title}
                  </h3>
                  <p className="text-[var(--color-gray)] text-xs line-clamp-3">
                    {section.content.slice(0, 150)}...
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[rgba(14,15,12,0.12)]">
              <p className="text-right font-bold text-lg">
                Total: ${proposal.pricing.total.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
