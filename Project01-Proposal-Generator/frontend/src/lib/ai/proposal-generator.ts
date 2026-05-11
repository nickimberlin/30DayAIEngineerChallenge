import type { GenerationRequest, ProposalSection, PricingSection, PricingItem } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { SUGGESTED_SAMPLING_CONFIG } from './models';

export function generateDefaultSections(request: GenerationRequest): ProposalSection[] {
  console.log('[generateDefaultSections] called with projectType:', request.projectType, 'prompt:', request.prompt.substring(0, 50));
  
  const sections: ProposalSection[] = [
    {
      id: uuidv4(),
      type: 'overview',
      title: 'Project Overview',
      content: generateOverviewContent(request),
      order: 1,
    },
    {
      id: uuidv4(),
      type: 'scope',
      title: 'Scope of Work',
      content: generateScopeContent(request),
      order: 2,
    },
    {
      id: uuidv4(),
      type: 'approach',
      title: 'Our Approach',
      content: generateApproachContent(request),
      order: 3,
    },
    {
      id: uuidv4(),
      type: 'timeline',
      title: 'Timeline & Milestones',
      content: generateTimelineContent(request),
      order: 4,
    },
    {
      id: uuidv4(),
      type: 'deliverables',
      title: 'Deliverables',
      content: generateDeliverablesContent(request),
      order: 5,
    },
    {
      id: uuidv4(),
      type: 'terms',
      title: 'Terms & Conditions',
      content: generateTermsContent(request),
      order: 6,
    },
  ];

  return sections;
}

export function generateDefaultPricing(request: GenerationRequest): PricingSection {
  const pricingByType: Record<string, PricingItem[]> = {
    'web-development': [
      { id: uuidv4(), description: 'Discovery & Planning', quantity: 1, unitPrice: 2500, total: 2500 },
      { id: uuidv4(), description: 'UI/UX Design', quantity: 1, unitPrice: 5000, total: 5000 },
      { id: uuidv4(), description: 'Frontend Development', quantity: 1, unitPrice: 8000, total: 8000 },
      { id: uuidv4(), description: 'Backend Development', quantity: 1, unitPrice: 10000, total: 10000 },
      { id: uuidv4(), description: 'QA & Testing', quantity: 1, unitPrice: 3000, total: 3000 },
      { id: uuidv4(), description: 'Deployment & Launch', quantity: 1, unitPrice: 2000, total: 2000 },
    ],
    'mobile-app': [
      { id: uuidv4(), description: 'Discovery & Wireframes', quantity: 1, unitPrice: 3000, total: 3000 },
      { id: uuidv4(), description: 'UI/UX Design', quantity: 1, unitPrice: 6000, total: 6000 },
      { id: uuidv4(), description: 'iOS Development', quantity: 1, unitPrice: 12000, total: 12000 },
      { id: uuidv4(), description: 'Android Development', quantity: 1, unitPrice: 12000, total: 12000 },
      { id: uuidv4(), description: 'Backend API', quantity: 1, unitPrice: 8000, total: 8000 },
      { id: uuidv4(), description: 'QA & App Store Submission', quantity: 1, unitPrice: 4000, total: 4000 },
    ],
    'marketing-campaign': [
      { id: uuidv4(), description: 'Strategy & Research', quantity: 1, unitPrice: 3000, total: 3000 },
      { id: uuidv4(), description: 'Content Creation', quantity: 1, unitPrice: 4000, total: 4000 },
      { id: uuidv4(), description: 'Creative Design', quantity: 1, unitPrice: 5000, total: 5000 },
      { id: uuidv4(), description: 'Campaign Setup & Management', quantity: 1, unitPrice: 3000, total: 3000 },
      { id: uuidv4(), description: 'Analytics & Reporting', quantity: 1, unitPrice: 2000, total: 2000 },
    ],
    'design-project': [
      { id: uuidv4(), description: 'Discovery & Brief', quantity: 1, unitPrice: 1500, total: 1500 },
      { id: uuidv4(), description: 'Concept Development', quantity: 1, unitPrice: 4000, total: 4000 },
      { id: uuidv4(), description: 'Design Iterations', quantity: 3, unitPrice: 2000, total: 6000 },
      { id: uuidv4(), description: 'Final Deliverables', quantity: 1, unitPrice: 3000, total: 3000 },
      { id: uuidv4(), description: 'Style Guide', quantity: 1, unitPrice: 2500, total: 2500 },
    ],
    consulting: [
      { id: uuidv4(), description: 'Initial Assessment', quantity: 1, unitPrice: 2000, total: 2000 },
      { id: uuidv4(), description: 'Strategy Development', quantity: 1, unitPrice: 5000, total: 5000 },
      { id: uuidv4(), description: 'Implementation Guidance', quantity: 5, unitPrice: 1500, total: 7500 },
      { id: uuidv4(), description: 'Progress Reviews', quantity: 4, unitPrice: 1000, total: 4000 },
      { id: uuidv4(), description: 'Final Report & Recommendations', quantity: 1, unitPrice: 3000, total: 3000 },
    ],
    custom: [
      { id: uuidv4(), description: 'Consultation & Scoping', quantity: 1, unitPrice: 2000, total: 2000 },
      { id: uuidv4(), description: 'Implementation', quantity: 1, unitPrice: 10000, total: 10000 },
      { id: uuidv4(), description: 'Testing & Delivery', quantity: 1, unitPrice: 3000, total: 3000 },
    ],
  };

  const items = pricingByType[request.projectType] || pricingByType['custom'];
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);

  return {
    items,
    subtotal,
    discount: 0,
    discountType: 'percentage',
    tax: 0,
    total: subtotal,
    currency: 'USD',
  };
}

function parsePromptDetails(prompt: string): {
  keywords: string[];
  features: string[];
  isEcommerce: boolean;
  isMobile: boolean;
  isMarketing: boolean;
  isDesign: boolean;
} {
  const lowerPrompt = prompt.toLowerCase();
  const keywords = prompt.split(/[,\s]+/).filter(w => w.length > 3).slice(0, 10);

  const featurePatterns = [
    'payment integration', 'seo', 'social media', 'analytics', 'dashboard',
    'custom theme', 'mobile app', 'ios', 'android', 'real-time',
    'chat', 'messaging', 'blog', 'cms', 'ecommerce', 'shopify', 'wordpress',
    'landing page', 'portfolio', 'branding', 'logo', 'hosting', 'database',
    'api', 'authentication', 'multi-user', 'admin', 'reporting'
  ];

  const features = featurePatterns.filter(p => lowerPrompt.includes(p));

  return {
    keywords,
    features,
    isEcommerce: lowerPrompt.includes('shopify') || lowerPrompt.includes('ecommerce') || lowerPrompt.includes('store') || lowerPrompt.includes('woocommerce'),
    isMobile: lowerPrompt.includes('ios') || lowerPrompt.includes('android') || lowerPrompt.includes('mobile') || lowerPrompt.includes('app'),
    isMarketing: lowerPrompt.includes('marketing') || lowerPrompt.includes('seo') || lowerPrompt.includes('ppc') || lowerPrompt.includes('social media'),
    isDesign: lowerPrompt.includes('branding') || lowerPrompt.includes('logo') || lowerPrompt.includes('design') || lowerPrompt.includes('identity'),
  };
}

function generateOverviewContent(request: GenerationRequest): string {
  console.log('[generateOverviewContent] called');
  const details = parsePromptDetails(request.prompt);
  const typeLabels: Record<string, string> = {
    'web-development': 'web development',
    'mobile-app': 'mobile application',
    'marketing-campaign': 'marketing campaign',
    'design-project': 'design project',
    'consulting': 'consulting services',
    'custom': 'custom project',
  };

  const projectTypeLabel = typeLabels[request.projectType] || 'project';
  console.log('[generateOverviewContent] projectTypeLabel:', projectTypeLabel);

  let featureList = '';
  if (details.features.length > 0) {
    featureList = `\n\n**Key Features:**
${details.features.map(f => `- ${f.charAt(0).toUpperCase() + f.slice(1)}`).join('\n')}`;
  }

  const content = `This proposal outlines our approach to delivering ${projectTypeLabel} services for your project: "${request.prompt}"

**Project Summary:**
${request.prompt}${featureList}

**Key Objectives:**
- Deliver a high-quality solution tailored to your specific needs
- Ensure timely completion within the proposed timeline
- Maintain clear communication throughout the project lifecycle
- Provide ongoing support and documentation
${request.clientName ? `\n**Client:** ${request.clientName}` : ''}`;

  console.log('[generateOverviewContent] returning content of length:', content.length);
  return content;
}

function generateScopeContent(request: GenerationRequest): string {
  const details = parsePromptDetails(request.prompt);

  let customScope = '';
  if (details.isEcommerce) {
    customScope = `\n**E-commerce Specific:**
- Product catalog setup with ${details.features.includes('50 products') ? '50 products' : 'product inventory management'}
- Payment gateway integration (Stripe, PayPal, or similar)
- Shopping cart functionality and checkout flow
- Order management and tracking system`;
  }
  if (details.isMobile) {
    customScope = `\n**Mobile App Specific:**
- Native iOS and/or Android development
- Push notification system
- Offline capability and data synchronization
- App store submission support`;
  }
  if (details.isMarketing) {
    customScope = `\n**Marketing Specific:**
- SEO optimization and keyword research
- Social media strategy and management
- Content calendar and posting schedule
- Performance analytics and reporting`;
  }
  if (details.isDesign) {
    customScope = `\n**Design Specific:**
- Logo design with multiple concept directions
- Brand identity guidelines document
- Typography and color palette selection
- Print and digital asset preparation`;
  }

  return `**Included in Scope:**
- Project discovery and requirements gathering
- Design and development of all agreed deliverables
- Quality assurance testing across target platforms
- Documentation and handover materials
- Post-launch support period (30 days)${customScope}

**Out of Scope:**
- Third-party integrations not explicitly listed
- Content creation (unless specified)
- Hosting and infrastructure costs
- Ongoing maintenance beyond support period

**Assumptions:**
- Client will provide all necessary content and assets
- Feedback will be provided within 2 business days
- Access to required systems will be granted promptly`;
}

function generateApproachContent(request: GenerationRequest): string {
  const details = parsePromptDetails(request.prompt);
  const projectTypes: Record<string, string> = {
    'web-development': 'web development',
    'mobile-app': 'mobile app development',
    'marketing-campaign': 'marketing campaign execution',
    'design-project': 'design and branding work',
    'consulting': 'consulting and strategy',
    'custom': 'project delivery',
  };

  let phases = `**Phase 1: Discovery & Planning**
We begin with a thorough discovery phase to understand your goals, audience, and technical requirements.

**Phase 2: Design & Prototyping**
Our design team creates wireframes and high-fidelity prototypes for your review.

**Phase 3: Development & Implementation**
Our engineering team builds the solution using modern, maintainable technologies.

**Phase 4: Testing & Quality Assurance**
Comprehensive testing ensures everything works as expected.

**Phase 5: Launch & Support**
We handle deployment and provide a 30-day support period.`;

  if (details.isEcommerce) {
    phases = `**Phase 1: Discovery & Planning**
E-commerce specialist consultation, platform selection, and requirements documentation.

**Phase 2: Store Setup & Design**
Shopify theme customization, product import, and payment configuration.

**Phase 3: Development & Integration**
Custom theme development, app integrations, and functionality testing.

**Phase 4: Content & Launch**
Product population, SEO setup, and store launch.

**Phase 5: Training & Support**
Admin training, documentation, and 30-day support.`;
  }
  if (details.isMobile) {
    phases = `**Phase 1: Discovery & Planning**
Mobile architecture planning, feature prioritization, and UI/UX scoping.

**Phase 2: UI/UX Design**
App wireframes, user flows, and high-fidelity mockups for both platforms.

**Phase 3: Development**
Native development for iOS and Android with API integration.

**Phase 4: Testing & Optimization**
Device testing, performance optimization, and bug fixes.

**Phase 5: App Store Launch**
App store submission, final testing, and launch support.`;
  }

  return phases;
}

function generateTimelineContent(request: GenerationRequest): string {
  const details = parsePromptDetails(request.prompt);

  let timeline = `| Phase | Duration | Milestone |
|-------|----------|-----------|
| Discovery & Planning | 1–2 weeks | Requirements signed off |
| Design & Prototyping | 2–3 weeks | Designs approved |
| Development | 4–6 weeks | Core functionality complete |
| Testing & QA | 1–2 weeks | All tests passing |
| Launch & Support | 1 week | Live deployment |

**Total Estimated Duration: 8–14 weeks**`;

  if (details.isEcommerce) {
    timeline = `| Phase | Duration | Milestone |
|-------|----------|-----------|
| Discovery & Planning | 1 week | Requirements and platform confirmed |
| Store Setup | 1–2 weeks | Shopify configured, theme selected |
| Design & Development | 3–4 weeks | Custom theme and features complete |
| Content & Testing | 1–2 weeks | Products loaded, QA complete |
| Launch | 1 week | Store goes live |

**Total Estimated Duration: 6–10 weeks**`;
  }
  if (details.isMobile) {
    timeline = `| Phase | Duration | Milestone |
|-------|----------|-----------|
| Discovery & Planning | 1–2 weeks | Feature scope finalized |
| Design | 2–3 weeks | UI/UX approved for both platforms |
| Development | 6–8 weeks | iOS and Android complete |
| Testing | 2 weeks | QA and bug fixes |
| App Store Launch | 1–2 weeks | Apps approved and live |

**Total Estimated Duration: 12–16 weeks**`;
  }
  if (details.isMarketing) {
    timeline = `| Phase | Duration | Milestone |
|-------|----------|-----------|
| Strategy & Audit | 1–2 weeks | Strategy document approved |
| Setup & Content | 2–3 weeks | Campaigns created, content ready |
| Active Campaign | 8–10 weeks | Running and optimizing |
| Analysis | 2 weeks | Final report and recommendations |

**Total Estimated Duration: 12–16 weeks**`;
  }

  timeline += `\n\n*Note: Timeline may vary based on scope complexity and feedback turnaround.*`;
  return timeline;
}

function generateDeliverablesContent(request: GenerationRequest): string {
  const details = parsePromptDetails(request.prompt);

  let deliverables = `**Final Deliverables Include:**
- All designed and developed assets
- Source code and design files
- Technical documentation
- User guide / training materials
- 30-day post-launch support`;

  if (details.isEcommerce) {
    deliverables = `**Final Deliverables Include:**
- Fully configured Shopify store with custom theme
- Product catalog with inventory (up to agreed quantity)
- Payment gateway configuration
- SEO setup and basic tracking
- Admin training session
- Technical documentation
- 30-day post-launch support`;
  }
  if (details.isMobile) {
    deliverables = `**Final Deliverables Include:**
- iOS app (compatible with iOS 14+)
- Android app (compatible with Android 8+)
- API backend (if applicable)
- App store listing assets
- User documentation
- Admin panel (if included)
- 30-day post-launch support`;
  }
  if (details.isMarketing) {
    deliverables = `**Final Deliverables Include:**
- SEO audit and optimization report
- Content calendar (3-month)
- Social media post templates
- Analytics dashboard setup
- Performance reports (weekly)
- Final campaign analysis
- Recommendations for ongoing work`;
  }
  if (details.isDesign) {
    deliverables = `**Final Deliverables Include:**
- Logo files (PNG, SVG, AI format)
- Brand guidelines document
- Color palette and typography specs
- Business card and letterhead templates
- Social media profile assets
- Source files with usage rights`;
  }

  deliverables += `\n\n**Handover Process:**
1. Formal walkthrough of all deliverables
2. Knowledge transfer session
3. Documentation package delivery
4. Support period activation`;

  return deliverables;
}

function generateTermsContent(request: GenerationRequest): string {
  const details = parsePromptDetails(request.prompt);

  let terms = `**Payment Terms:**
- 30% deposit upon project kickoff
- 40% upon completion of development phase
- 30% upon final delivery and sign-off`;

  if (details.isMarketing) {
    terms = `**Payment Terms:**
- 50% deposit upon campaign kickoff
- 50% upon campaign launch
- Monthly retainer option available`;

    if (details.features.includes('seo') || details.features.includes('ppc')) {
      terms += `\n\n**Ad Spend:** Billed separately, requires advance`;
    }
  }
  if (details.isDesign) {
    terms = `**Payment Terms:**
- 50% deposit upon project kickoff
- 50% upon final deliverables
- Rush fees may apply for expedited delivery`;
  }

  terms += `

**Revision Policy:**
- Up to 2 rounds of revisions included per phase
- Additional revisions billed at $150/hour

**Intellectual Property:**
- Full IP rights transfer upon final payment
- Client retains all rights to provided materials

**Confidentiality:**
- All project details remain confidential
- NDA available upon request

**Termination:**
- Either party may terminate with 14 days written notice
- Work completed to date will be billed and delivered`;

  return terms;
}

export interface AIModelResult {
  type: ProposalSection['type'];
  title: string;
  content: string;
}

interface Gemma4Model {
  generate(options: Record<string, unknown>): unknown;
}

interface Gemma4Processor {
  (prompt: string, options?: Record<string, unknown>): Record<string, unknown>;
  tokenizer?: {
    batch_decode(batch: unknown, options?: Record<string, unknown>): string[];
  };
}

export async function generateProposalWithGemma4(
  request: GenerationRequest,
  model: Gemma4Model,
  processor: Gemma4Processor,
  onProgress?: (step: string) => void
): Promise<AIModelResult[]> {
  const results: AIModelResult[] = [];

  const generationTasks: Array<{ type: ProposalSection['type']; title: string; prompt: string }> = [
    {
      type: 'scope' as const,
      title: 'Scope of Work',
      prompt: `You are an expert proposal writer. Generate a detailed scope of work section for this project. Return ONLY valid JSON in this exact format, no markdown code blocks or extra text:

{
  "type": "scope",
  "title": "Scope of Work",
  "content": "Your detailed scope content with **bold** markdown sections and bullet points"
}

Project: ${request.prompt}
Type: ${request.projectType}
${request.clientName ? `Client: ${request.clientName}` : ''}`,
    },
    {
      type: 'approach' as const,
      title: 'Our Approach',
      prompt: `You are a methodology expert. Generate an approach section for this project. Return ONLY valid JSON in this exact format, no markdown code blocks or extra text:

{
  "type": "approach",
  "title": "Our Approach",
  "content": "Your methodology content with **bold** section headers for each phase"
}

Project: ${request.prompt}
Type: ${request.projectType}
${request.clientName ? `Client: ${request.clientName}` : ''}`,
    },
    {
      type: 'timeline' as const,
      title: 'Timeline & Milestones',
      prompt: `You are a project manager. Generate a project timeline. Return ONLY valid JSON in this exact format, no markdown code blocks or extra text:

{
  "type": "timeline",
  "title": "Timeline & Milestones",
  "content": "Your timeline content using | Phase | Duration | Milestone | markdown tables"
}

Project: ${request.prompt}
Type: ${request.projectType}
${request.clientName ? `Client: ${request.clientName}` : ''}`,
    },
    {
      type: 'terms' as const,
      title: 'Terms & Conditions',
      prompt: `You are a legal consultant. Generate standard project terms. Return ONLY valid JSON in this exact format, no markdown code blocks or extra text:

{
  "type": "terms",
  "title": "Terms & Conditions",
  "content": "Your terms content with **bold** section headers"
}

Project: ${request.prompt}
Type: ${request.projectType}
${request.clientName ? `Client: ${request.clientName}` : ''}`,
    },
  ];

  for (const task of generationTasks) {
    onProgress?.(`Generating ${task.title}...`);

    try {
      const inputs = processor(task.prompt, { add_special_tokens: false });
      const inputLength = (inputs as { input_ids?: { dims?: number[] } }).input_ids?.dims?.at(-1) ?? 0;

      const outputs = model.generate({
        ...inputs,
        max_new_tokens: 1024,
        do_sample: false,
        temperature: SUGGESTED_SAMPLING_CONFIG.temperature,
        top_p: SUGGESTED_SAMPLING_CONFIG.top_p,
      });

      let generatedText = getFallbackContent(task.type);
      if (processor.tokenizer && outputs) {
        try {
          let rawText = '';
          if (Array.isArray(outputs)) {
            rawText = processor.tokenizer.batch_decode(outputs, { skip_special_tokens: true })[0] || '';
          } else if (typeof outputs === 'object' && outputs !== null && 'slice' in outputs) {
            rawText = processor.tokenizer.batch_decode((outputs as { slice: (start: unknown, end: unknown) => unknown }).slice(null, [inputLength, null]), { skip_special_tokens: true })[0] || '';
          }

          generatedText = parseJSONResponse(rawText, task.type);
        } catch {
          console.log('Decoding failed, using fallback');
        }
      }

      results.push({
        type: task.type,
        title: task.title,
        content: generatedText,
      });
    } catch (error) {
      console.error(`AI generation failed for ${task.title}:`, error);
      results.push({
        type: task.type,
        title: task.title,
        content: getFallbackContent(task.type),
      });
    }
  }

  return results;
}

function parseJSONResponse(rawText: string, fallbackType: ProposalSection['type']): string {
  try {
    const cleaned = rawText.trim();

    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.content && typeof parsed.content === 'string') {
        return parsed.content;
      }
    }

    const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch) {
      const parsed = JSON.parse(codeBlockMatch[1].trim());
      if (parsed.content && typeof parsed.content === 'string') {
        return parsed.content;
      }
    }

    const directMatch = cleaned.match(/"content"\s*:\s*"([\s\S]*?)"(?:\s*,|\s*\})/);
    if (directMatch) {
      return directMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
    }

    return rawText;
  } catch {
    return rawText || getFallbackContent(fallbackType);
  }
}

function getFallbackContent(type: ProposalSection['type']): string {
  switch (type) {
    case 'scope':
      return `**Scope of Work**

This project will include comprehensive planning, design, development, testing, and deployment phases tailored to meet your specific requirements.

**In Scope:**
- Requirements analysis and documentation
- Design and prototyping
- Development and implementation
- Quality assurance testing
- Deployment and launch support

Contact us to customize this scope for your needs.`;
    case 'approach':
      return `**Our Approach**

We follow an agile methodology with iterative development cycles, ensuring continuous feedback and alignment with your vision throughout the project.

**Key Principles:**
- Clear communication and regular updates
- Incremental delivery with testing
- Flexible adaptation to feedback
- Quality-first development practices`;
    case 'timeline':
      return `| Phase | Duration | Milestone |
|-------|----------|-----------|
| Discovery | 2 weeks | Requirements approved |
| Design | 3 weeks | Designs signed off |
| Development | 6 weeks | Core features complete |
| Testing | 2 weeks | QA passed |
| Launch | 1 week | Live deployment |

**Total: 12-14 weeks**`;
    case 'terms':
      return `**Payment Terms:**
- 30% deposit upon project kickoff
- 40% upon development completion
- 30% upon final delivery

**Revisions:** Up to 2 rounds per phase included
**IP:** Full rights transfer upon payment
**Confidentiality:** All project details protected
**Termination:** 14-day notice required`;
    default:
      return 'Content generation in progress. Please edit this section.';
  }
}

export function recalculatePricing(pricing: PricingSection): PricingSection {
  const subtotal = pricing.items.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = pricing.discountType === 'percentage'
    ? (subtotal * pricing.discount) / 100
    : pricing.discount;
  const afterDiscount = subtotal - discountAmount;
  const taxAmount = (afterDiscount * pricing.tax) / 100;
  const total = afterDiscount + taxAmount;

  return {
    ...pricing,
    subtotal,
    total: Math.round(total * 100) / 100,
  };
}
