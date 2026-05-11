export interface Proposal {
  id: string;
  title: string;
  clientName: string;
  clientEmail: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  sections: ProposalSection[];
  pricing: PricingSection;
  branding: BrandingConfig;
  prompt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProposalSection {
  id: string;
  type: 'scope' | 'timeline' | 'terms' | 'overview' | 'approach' | 'deliverables' | 'custom';
  title: string;
  content: string;
  order: number;
}

export interface PricingSection {
  items: PricingItem[];
  subtotal: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
  tax: number;
  total: number;
  currency: string;
}

export interface PricingItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface BrandingConfig {
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  companyName: string;
  tagline: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  sections: ProposalSection[];
  pricing: PricingSection;
  branding: BrandingConfig;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  address: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIModelConfig {
  id: string;
  name: string;
  modelId: string;
  description: string;
  downloadSize: string;
  useCase: string;
  backend: 'webgpu' | 'wasm';
}

export interface ModelLoadProgress {
  modelId: string;
  status: 'idle' | 'downloading' | 'loading' | 'ready' | 'error' | 'cached';
  progress: number;
  message: string;
}

export interface GenerationRequest {
  prompt: string;
  projectType: ProjectType;
  clientName?: string;
  templateId?: string;
}

export type ProjectType =
  | 'web-development'
  | 'mobile-app'
  | 'marketing-campaign'
  | 'design-project'
  | 'consulting'
  | 'custom';

export const PROJECT_TYPES: Record<ProjectType, string> = {
  'web-development': 'Web Development',
  'mobile-app': 'Mobile App',
  'marketing-campaign': 'Marketing Campaign',
  'design-project': 'Design Project',
  consulting: 'Consulting',
  custom: 'Custom Project',
};

export const DEFAULT_BRANDING: BrandingConfig = {
  logoUrl: '',
  primaryColor: '#9fe870',
  secondaryColor: '#163300',
  accentColor: '#0e0f0c',
  fontFamily: 'Inter',
  companyName: 'Your Company',
  tagline: 'Professional Services',
};

export const DEFAULT_PRICING: PricingSection = {
  items: [],
  subtotal: 0,
  discount: 0,
  discountType: 'percentage',
  tax: 0,
  total: 0,
  currency: 'USD',
};
