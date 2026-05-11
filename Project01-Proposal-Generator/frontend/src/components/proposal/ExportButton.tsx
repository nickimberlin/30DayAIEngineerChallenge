'use client';

import { useState } from 'react';
import { Download, Loader2, FileText } from 'lucide-react';
import { Button } from '@/components/ui';
import { PDFPreviewModal } from './PDFPreviewModal';
import type { Proposal } from '@/types';

interface ExportButtonProps {
  proposal: Proposal;
  className?: string;
}

export function ExportButton({ proposal, className = '' }: ExportButtonProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const element = document.getElementById('proposal-preview');
      if (!element) {
        throw new Error('Preview element not found');
      }

      const { generateAndDownloadPDF } = await import('@/lib/pdf/generator');
      await generateAndDownloadPDF(proposal, element, {
        filename: `${proposal.title.replace(/\s+/g, '-').toLowerCase()}-proposal.pdf`,
      });
    } catch (error) {
      console.error('Failed to export PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setShowPreview(true)}
        variant="secondary"
        className={className}
      >
        <Download className="w-4 h-4" />
        Export PDF
      </Button>

      <PDFPreviewModal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        proposal={proposal}
        onExport={handleExport}
      />
    </>
  );
}
