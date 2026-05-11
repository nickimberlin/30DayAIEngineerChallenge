'use client';

import { useState, useEffect } from 'react';
import { X, RefreshCw, Check, Loader2 } from 'lucide-react';
import { Modal, Button, Textarea, Badge } from '@/components/ui';
import type { ProposalSection } from '@/types';

interface GeneratedSection {
  type: ProposalSection['type'];
  title: string;
  content: string;
}

interface AIGeneratedContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (sections: ProposalSection[]) => void;
  onRetry: () => void;
  sections: GeneratedSection[];
  isRetrying: boolean;
  projectType: string;
}

export function AIGeneratedContentModal({
  isOpen,
  onClose,
  onConfirm,
  onRetry,
  sections,
  isRetrying,
  projectType,
}: AIGeneratedContentModalProps) {
  const [editedSections, setEditedSections] = useState<GeneratedSection[]>([]);
  const [activeSection, setActiveSection] = useState<number>(0);

  useEffect(() => {
    console.log('[AIGeneratedContentModal] useEffect triggered, sections length:', sections?.length, 'isOpen:', isOpen);
    if (sections && sections.length > 0) {
      console.log('[AIGeneratedContentModal] Setting sections from prop, first section content length:', sections[0]?.content?.length);
      const newSections = sections.map(s => ({ ...s }));
      setEditedSections(newSections);
      setActiveSection(0);
    }
  }, [sections]);

  const handleContentChange = (index: number, content: string) => {
    const updated = [...editedSections];
    updated[index] = { ...updated[index], content };
    setEditedSections(updated);
  };

  const handleConfirm = () => {
    console.log('[AIGeneratedContentModal] handleConfirm, editedSections:', editedSections.length);
    
    const proposalSections: ProposalSection[] = editedSections.map((s, i) => ({
      id: `${s.type}-${i}`,
      type: s.type,
      title: s.title,
      content: s.content || '',
      order: i + 1,
    }));
    
    console.log('[AIGeneratedContentModal] sending sections:', proposalSections.length);
    onConfirm(proposalSections);
  };

  const getTypeLabel = (type: ProposalSection['type']): string => {
    const labels: Record<string, string> = {
      overview: 'Overview',
      scope: 'Scope of Work',
      approach: 'Our Approach',
      timeline: 'Timeline',
      deliverables: 'Deliverables',
      terms: 'Terms',
    };
    return labels[type] || type;
  };

  return (
    <Modal open={isOpen} onClose={onClose} title="Review AI-Generated Content">
      <div className="space-y-4">
        <div className="p-3 bg-[var(--color-light-mint)] rounded-[var(--radius-card)]">
          <p className="text-sm text-[var(--color-dark-green)]">
            Review each section below. You can edit the content directly or click "Retry" to generate new content.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {editedSections.map((section, index) => (
            <button
              key={section.type}
              onClick={() => setActiveSection(index)}
              className={`px-3 py-1.5 text-sm rounded-[var(--radius-pill)] transition-colors ${
                activeSection === index
                  ? 'bg-[var(--color-wise-green)] text-[var(--color-dark-green)]'
                  : 'bg-[var(--color-light-surface)] text-[var(--color-near-black)] hover:bg-[var(--color-light-mint)]'
              }`}
            >
              {getTypeLabel(section.type)}
            </button>
          ))}
        </div>

        <div className="min-h-[300px]">
          {editedSections.length === 0 ? (
            <div className="flex items-center justify-center h-full p-8 text-[var(--color-gray)]">
              <p>No sections available. Please generate content first.</p>
            </div>
          ) : editedSections[activeSection] ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[var(--color-near-black)]">
                  {editedSections[activeSection].title}
                </h3>
                <Badge variant="info" size="sm">
                  {getTypeLabel(editedSections[activeSection].type)}
                </Badge>
              </div>
              <Textarea
                value={editedSections[activeSection]?.content || ''}
                onChange={(e) => handleContentChange(activeSection, e.target.value)}
                className="min-h-[250px] font-mono text-sm"
                placeholder="No content generated yet"
              />
              <p className="text-xs text-[var(--color-gray)]">
                Content length: {editedSections[activeSection]?.content?.length || 0} characters
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full p-8 text-[var(--color-gray)]">
              <p>Loading section...</p>
            </div>
          )}
        </div>

        {isRetrying && (
          <div className="flex items-center justify-center gap-2 py-3 bg-[var(--color-light-surface)] rounded-[var(--radius-card)]">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm text-[var(--color-gray)]">Generating new content...</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-[rgba(14,15,12,0.12)]">
          <Button variant="secondary" onClick={onRetry} disabled={isRetrying}>
            <RefreshCw className="w-4 h-4" />
            Retry All
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose} disabled={isRetrying}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={isRetrying}>
              <Check className="w-4 h-4" />
              Add to Proposal
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export type { GeneratedSection };