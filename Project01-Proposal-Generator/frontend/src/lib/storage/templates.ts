console.log('[storage-templates] Module initialized');

const STORAGE_KEY = 'proposal-generator-templates';

import type { Template, ProposalSection, PricingSection, BrandingConfig, DEFAULT_BRANDING, DEFAULT_PRICING } from '@/types';

export function getTemplates(): Template[] {
  console.log('[storage-templates] getTemplates called');
  const stored = getFromStorage<Template[]>(STORAGE_KEY, []);
  if (stored.length === 0) {
    console.log('[storage-templates] No templates found, creating default');
    return createDefaultTemplates();
  }
  console.log('[storage-templates] Found', stored.length, 'templates');
  return stored;
}

export function getTemplate(id: string): Template | null {
  console.log('[storage-templates] getTemplate called for:', id);
  const templates = getTemplates();
  return templates.find((t) => t.id === id) || null;
}

export function saveTemplate(template: Template): Template {
  console.log('[storage-templates] saveTemplate called for:', template.id, template.name);
  const templates = getTemplates();
  const existingIndex = templates.findIndex((t) => t.id === template.id);

  const updated = {
    ...template,
    updatedAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    templates[existingIndex] = updated;
  } else {
    templates.unshift(updated);
  }

  setToStorage(STORAGE_KEY, templates);
  console.log('[storage-templates] Template saved. Total:', templates.length);
  return updated;
}

export function deleteTemplate(id: string): boolean {
  console.log('[storage-templates] deleteTemplate called for:', id);
  const templates = getTemplates();
  const filtered = templates.filter((t) => t.id !== id);

  if (filtered.length < templates.length) {
    setToStorage(STORAGE_KEY, filtered);
    console.log('[storage-templates] Template deleted');
    return true;
  }
  return false;
}

function createDefaultTemplates(): Template[] {
  console.log('[storage-templates] Creating default templates');
  const defaults: Template[] = [
    {
      id: 'default-web',
      name: 'Web Development',
      description: 'Standard web development project template',
      sections: [
        { id: 's1', type: 'overview', title: 'Project Overview', content: '', order: 1 },
        { id: 's2', type: 'scope', title: 'Scope of Work', content: '', order: 2 },
        { id: 's3', type: 'approach', title: 'Our Approach', content: '', order: 3 },
        { id: 's4', type: 'timeline', title: 'Timeline', content: '', order: 4 },
        { id: 's5', type: 'deliverables', title: 'Deliverables', content: '', order: 5 },
        { id: 's6', type: 'terms', title: 'Terms', content: '', order: 6 },
      ],
      pricing: {
        items: [],
        subtotal: 0,
        discount: 0,
        discountType: 'percentage',
        tax: 0,
        total: 0,
        currency: 'USD',
      },
      branding: {
        logoUrl: '',
        primaryColor: '#9fe870',
        secondaryColor: '#163300',
        accentColor: '#0e0f0c',
        fontFamily: 'Inter',
        companyName: 'Your Company',
        tagline: 'Professional Services',
      },
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'default-mobile',
      name: 'Mobile App',
      description: 'Standard mobile app development template',
      sections: [
        { id: 's1', type: 'overview', title: 'Project Overview', content: '', order: 1 },
        { id: 's2', type: 'scope', title: 'Scope of Work', content: '', order: 2 },
        { id: 's3', type: 'approach', title: 'Our Approach', content: '', order: 3 },
        { id: 's4', type: 'timeline', title: 'Timeline', content: '', order: 4 },
        { id: 's5', type: 'deliverables', title: 'Deliverables', content: '', order: 5 },
        { id: 's6', type: 'terms', title: 'Terms', content: '', order: 6 },
      ],
      pricing: {
        items: [],
        subtotal: 0,
        discount: 0,
        discountType: 'percentage',
        tax: 0,
        total: 0,
        currency: 'USD',
      },
      branding: {
        logoUrl: '',
        primaryColor: '#9fe870',
        secondaryColor: '#163300',
        accentColor: '#0e0f0c',
        fontFamily: 'Inter',
        companyName: 'Your Company',
        tagline: 'Professional Services',
      },
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  setToStorage(STORAGE_KEY, defaults);
  console.log('[storage-templates] Default templates created');
  return defaults;
}

function getFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('[storage-templates] Save error:', error);
  }
}
