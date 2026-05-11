'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { Card, Button, Textarea } from '@/components/ui';
import { useProposalGenerator, useLocalStorage, useAIModels } from '@/hooks';
import { ModelLoadingOverlay } from '@/components/ui/ModelLoadingOverlay';
import { AIGeneratedContentModal, type GeneratedSection } from '@/components/ui/AIGeneratedContentModal';
import { GenerationTerminal } from '@/components/ui/GenerationTerminal';
import { PROJECT_TYPES, type ProjectType, type Proposal, DEFAULT_BRANDING } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const EXAMPLE_PROMPTS: { label: string; prompt: string }[] = [
  {
    label: 'E-commerce',
    prompt: 'Build a Shopify store for a sustainable fashion brand with 50 products, payment integration, and custom theme design',
  },
  {
    label: 'SaaS App',
    prompt: 'Develop a B2B SaaS dashboard for project management with real-time collaboration, analytics, and billing integration',
  },
  {
    label: 'Mobile App',
    prompt: 'Create an iOS and Android fitness app with workout tracking, meal planning, and social features',
  },
  {
    label: 'Marketing',
    prompt: 'Launch a 3-month digital marketing campaign including SEO optimization, social media management, and PPC advertising',
  },
  {
    label: 'Branding',
    prompt: 'Design a complete brand identity including logo, color palette, typography, and brand guidelines document',
  },
];

export default function NewProposalPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [projectType, setProjectType] = useState<ProjectType>('web-development');
  const [clientName, setClientName] = useState('');
  const { isGenerating, progress, currentStep, error, generateForReview, logs, addLog, clearLogs } = useProposalGenerator();
  const { selectedModelId, selectModel } = useAIModels();
  const [proposals, setProposals] = useLocalStorage<Proposal[]>('proposals', []);

  const [showAIModal, setShowAIModal] = useState(false);
  const [aiSections, setAiSections] = useState<GeneratedSection[]>([]);
  const [aiPricing, setAiPricing] = useState<import('@/types').PricingSection | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setShowTerminal(true);
    console.log(`[NewProposalPage] handleGenerate called with selectedModelId: ${selectedModelId}`);
    try {
      const result = await generateForReview({
        prompt,
        projectType,
        clientName: clientName || undefined,
      }, selectedModelId || undefined);

      setAiSections(result.sections);
      setAiPricing(result.pricing);
      setShowAIModal(true);
    } catch (err) {
      console.error('Failed to generate proposal:', err);
    }
  };

  const handleRetry = async () => {
    if (!prompt.trim()) return;

    setIsRetrying(true);
    console.log(`[NewProposalPage] handleRetry called with selectedModelId: ${selectedModelId}`);
    try {
      const result = await generateForReview({
        prompt,
        projectType,
        clientName: clientName || undefined,
      }, selectedModelId || undefined);

      setAiSections(result.sections);
    } catch (err) {
      console.error('Failed to retry generation:', err);
    } finally {
      setIsRetrying(false);
    }
  };

  const handleConfirmSections = (sections: import('@/types').ProposalSection[]) => {
    console.log('[NewProposalPage] handleConfirmSections received, sections:', sections.length);
    const newProposal: Proposal = {
      id: uuidv4(),
      title: prompt.slice(0, 50) + (prompt.length > 50 ? '...' : ''),
      clientName: clientName || 'New Client',
      clientEmail: '',
      status: 'draft',
      sections,
      pricing: aiPricing || {
        items: [],
        subtotal: 0,
        discount: 0,
        discountType: 'percentage',
        tax: 0,
        total: 0,
        currency: 'USD',
      },
      branding: DEFAULT_BRANDING,
      prompt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('[NewProposalPage] creating proposal with', sections.length, 'sections');
    
    setProposals((currentProposals) => {
      console.log('[NewProposalPage] setProposals callback, current count:', currentProposals.length);
      const updated = [newProposal, ...currentProposals];
      console.log('[NewProposalPage] new count:', updated.length);
      return updated;
    });
    
    setShowAIModal(false);
    
    setTimeout(() => {
      console.log('[NewProposalPage] navigating to:', `/proposals/${newProposal.id}`);
      router.push(`/proposals/${newProposal.id}`);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-8 rounded-[var(--radius-section)] shadow-[var(--shadow-ring)] max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-light-mint)] mb-4">
                <Sparkles className="w-6 h-6 text-[var(--color-dark-green)]" />
              </div>
              <h2 className="text-xl font-semibold text-[var(--color-near-black)]">Generating Proposal</h2>
              <p className="text-sm text-[var(--color-gray)] mt-1">{currentStep}</p>
            </div>
            <div className="h-2 bg-[var(--color-light-surface)] rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-[var(--color-wise-green)] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-[var(--color-gray)] text-center">{progress}%</p>
          </div>
        </div>
      )}

      <GenerationTerminal
        logs={logs}
        isOpen={showTerminal}
        onToggle={() => setShowTerminal(!showTerminal)}
        currentStep={currentStep}
        progress={progress}
      />

      <AIGeneratedContentModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onConfirm={handleConfirmSections}
        onRetry={handleRetry}
        sections={aiSections}
        isRetrying={isRetrying}
        projectType={projectType}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Link href="/proposals" className="hidden sm:inline-flex items-center gap-2 text-sm text-[var(--color-gray)] hover:text-[var(--color-near-black)] mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Proposals
        </Link>

        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-[var(--color-light-mint)] rounded-[var(--radius-pill)] mb-3 sm:mb-4">
            <Sparkles className="w-4 h-4 text-[var(--color-dark-green)]" />
            <span className="text-xs sm:text-sm font-semibold text-[var(--color-dark-green)]">
              AI-Powered Generation
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[var(--color-near-black)] display-text mb-2 sm:mb-4">
            Create Your Proposal
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-[var(--color-gray)] max-w-2xl mx-auto px-2">
            Describe your project in a few sentences, and our AI will generate a comprehensive proposal with scope, timeline, and pricing.
          </p>
        </div>

        <Card padding="lg" className="mb-6 sm:mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[var(--color-near-black)] mb-2">
                Client Name (Optional)
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Enter client name"
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--color-near-black)] mb-2">
                Project Type
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(PROJECT_TYPES).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setProjectType(key as ProjectType)}
                    className={`
                      px-4 py-2 rounded-[var(--radius-pill)] text-sm font-semibold
                      transition-all duration-200
                      ${projectType === key
                        ? 'bg-[var(--color-wise-green)] text-[var(--color-dark-green)]'
                        : 'bg-[rgba(22,51,0,0.08)] text-[var(--color-near-black)] hover:bg-[rgba(22,51,0,0.12)]'
                      }
                    `}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--color-near-black)] mb-2">
                Project Description
              </label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Build a Shopify store for a sustainable fashion brand with 50 products, payment integration, and custom theme design..."
                className="min-h-[150px]"
              />
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs text-[var(--color-gray)] py-1">Try:</span>
                {EXAMPLE_PROMPTS.map((example) => (
                  <button
                    key={example.label}
                    onClick={() => {
                      setPrompt(example.prompt);
                      if (example.label === 'E-commerce') setProjectType('web-development');
                      else if (example.label === 'SaaS App') setProjectType('web-development');
                      else if (example.label === 'Mobile App') setProjectType('mobile-app');
                      else if (example.label === 'Marketing') setProjectType('marketing-campaign');
                      else if (example.label === 'Branding') setProjectType('design-project');
                    }}
                    className="px-3 py-1 text-xs rounded-[var(--radius-pill)] bg-[var(--color-light-surface)] text-[var(--color-near-black)] hover:bg-[var(--color-light-mint)] hover:text-[var(--color-dark-green)] border border-[rgba(14,15,12,0.08)] transition-colors"
                  >
                    {example.label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-4 bg-[rgba(208,50,56,0.10)] rounded-[var(--radius-card)] text-[var(--color-danger-red)] text-sm">
                {error}
              </div>
            )}

            {!selectedModelId && (
              <div className="p-4 bg-[var(--color-light-surface)] rounded-[var(--radius-card)] border border-[rgba(14,15,12,0.08)]">
                <p className="text-sm text-[var(--color-gray)] mb-3">
                  No AI model selected. Please select a model to continue:
                </p>
                <div className="flex flex-wrap gap-2">
                  {['gemma-4-e4b', 'gemma-4-e2b', 'qwen2-0.5b', 'phi-3-mini'].map((id) => (
                    <button
                      key={id}
                      onClick={() => selectModel(id)}
                      className="px-3 py-1.5 text-xs rounded-[var(--radius-pill)] bg-white border border-[rgba(14,15,12,0.12)] text-[var(--color-near-black)] hover:border-[var(--color-primary)] hover:bg-[var(--color-light-mint)] transition-colors"
                    >
                      {id}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating || !selectedModelId}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Proposal
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </Card>

        <div className="text-center">
          <p className="text-sm text-[var(--color-gray)]">
            All proposals are generated locally in your browser using AI. Your data stays private.
          </p>
        </div>
      </div>
    </div>
  );
}