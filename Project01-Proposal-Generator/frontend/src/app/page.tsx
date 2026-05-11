'use client';

import Link from 'next/link';
import { Sparkles, ArrowRight, Zap, Shield, Download } from 'lucide-react';
import { Button, Card } from '@/components/ui';

export default function HomePage() {
  return (
    <div className="pb-20">
      <section className="max-w-7xl mx-auto px-6 pt-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-light-mint)] rounded-[var(--radius-pill)] mb-6">
            <Sparkles className="w-4 h-4 text-[var(--color-dark-green)]" />
            <span className="text-sm font-semibold text-[var(--color-dark-green)]">
              100% Local AI • Zero API Costs
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-[var(--color-near-black)] display-text mb-6">
            Proposals That<br />
            <span className="text-[var(--color-wise-green)]">Write Themselves</span>
          </h1>
          <p className="text-xl text-[var(--color-gray)] mb-8">
            Transform a brief idea into a professional client proposal in seconds.
            Powered by local AI — your data never leaves your browser.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/proposals/new">
              <Button size="lg">
                <Sparkles className="w-5 h-5" />
                Create Your First Proposal
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="secondary" size="lg">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: Sparkles,
              title: 'AI-Powered',
              description: 'Generate comprehensive proposals from simple prompts using local Gemma 4 AI.',
            },
            {
              icon: Shield,
              title: '100% Private',
              description: 'All processing happens in your browser. Your client data never leaves your device.',
            },
            {
              icon: Zap,
              title: 'Zero Costs',
              description: 'No API fees or subscription costs. Models run locally after initial download.',
            },
          ].map((feature) => (
            <Card key={feature.title} padding="lg" variant="accent">
              <div className="w-12 h-12 rounded-full bg-[var(--color-light-mint)] flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-[var(--color-dark-green)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-near-black)] mb-2">
                {feature.title}
              </h3>
              <p className="text-[var(--color-gray)]">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6">
        <Card padding="lg" variant="outline">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-black text-[var(--color-near-black)] display-text mb-4">
                Ready to Try It?
              </h2>
              <p className="text-lg text-[var(--color-gray)] mb-6">
                Start creating professional proposals in under a minute.
                No sign-up required, no API keys, no monthly fees.
              </p>
              <Link href="/proposals/new">
                <Button size="lg">
                  <Sparkles className="w-5 h-5" />
                  Create New Proposal
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
            <div className="bg-[var(--color-light-surface)] rounded-[var(--radius-section)] p-8">
              <div className="space-y-4">
                {[
                  'Describe your project',
                  'AI generates proposal',
                  'Edit & customize',
                  'Export as PDF',
                ].map((step, i) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-wise-green)] flex items-center justify-center">
                      <span className="text-sm font-bold text-[var(--color-dark-green)]">{i + 1}</span>
                    </div>
                    <span className="text-sm text-[var(--color-gray)]">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </section>

      <footer className="mt-20 border-t border-[rgba(14,15,12,0.12)] py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-[var(--color-gray)]">
          <p>AI Proposal Generator • Powered by Transformers.js & Gemma 4</p>
        </div>
      </footer>
    </div>
  );
}
