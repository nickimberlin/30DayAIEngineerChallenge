# TODO — AI Proposal Generator

## Phase 1: Foundation & Setup

- [x] Create todo.md with full task breakdown
- [x] Initialize Next.js 14 frontend project with TypeScript and Tailwind CSS
- [x] Install dependencies: @huggingface/transformers, jspdf, html2canvas, lucide-react
- [x] Configure Tailwind with design system tokens (colors, fonts, spacing, radius)
- [x] Set up global CSS with design system variables, font imports, `"calt"` feature
- [x] Create project directory structure (components/ui, lib/ai, lib/pdf, lib/storage, hooks, types)

## Phase 2: Design System & UI Primitives

- [x] Build Button component (Primary Green Pill, Secondary Subtle Pill, scale hover/active)
- [x] Build Card component (30px/40px radius, ring shadow, border variants)
- [x] Build Input component (ring shadow, inset focus, 10px radius)
- [x] Build Textarea component (same as Input, resizable)
- [x] Build Badge component (pill shape, semantic colors)
- [x] Build Progress component (model loading bar, Wise Green fill)
- [x] Build Modal/Dialog component (overlay, card-style container)
- [x] Build Tabs component (for proposal editor sections)
- [x] Build Skeleton component (loading states)

## Phase 3: AI Integration

- [x] Create TypeScript types for AI models, proposals, templates, clients
- [x] Create `lib/ai/models.ts` — model registry (Gemma 4, E2B, E4B configs)
- [x] Create `lib/ai/model-loader.ts` — Transformers.js model loading with progress tracking
- [x] Create `lib/ai/proposal-generator.ts` — prompt engineering for proposal generation
- [x] Create `hooks/useAIModels.ts` — React hook for model state management
- [x] Create `hooks/useProposalGenerator.ts` — React hook for generation flow
- [x] Build ModelLoadingOverlay component (download progress, inference status)

## Phase 4: Data Persistence

- [x] Create `lib/storage/proposals.ts` — CRUD operations for proposals in localStorage
- [x] Create `lib/storage/templates.ts` — CRUD operations for templates in localStorage
- [x] Create `hooks/useLocalStorage.ts` — generic localStorage hook with SSR safety

## Phase 5: Core Pages & Layout

- [x] Build Header component (logo, nav links, pill CTA)
- [x] Build Sidebar component (proposal sections navigation)
- [x] Build Dashboard page (recent proposals, quick actions, stats)
- [x] Build New Proposal page (prompt input → AI generation → preview)
- [x] Build Proposal Editor page (tabbed sections, live preview)
- [x] Build Templates page (template grid, create/edit)
- [x] Build Clients page (client list, CRUD)
- [x] Build Proposals list page (all proposals with status)
- [x] Build Home/Landing page

## Phase 6: Proposal Generation Flow

- [x] Build PromptInput component (textarea, project type selector, generate button)
- [x] Build Proposal Editor with inline editing
- [x] Build PricingTable component (editable line items, subtotals)
- [x] Build BrandingPanel component (via client info in editor)

## Phase 7: PDF Export

- [x] Create `lib/pdf/generator.ts` — PDF generation logic using jspdf + html2canvas
- [x] Create `lib/pdf/templates.ts` — PDF layout templates with branding
- [x] Build PDFPreviewModal component (preview before download)
- [x] Build ExportButton component (PDF download trigger with progress)

## Phase 8: Backend (FastAPI) - Optional

- [ ] Initialize FastAPI project with Python 3.11+
- [ ] Set up Pydantic models for proposals, templates, clients
- [ ] Create `/api/proposals` endpoints (CRUD + generate)
- [ ] Create `/api/templates` endpoints (CRUD)
- [ ] Create `/api/clients` endpoints (CRUD)
- [ ] Create `/api/proposals/:id/pdf` endpoint (server-side PDF export)
- [ ] Set up CORS middleware for frontend communication
- [ ] Add SQLite database with SQLAlchemy

## Phase 9: Polish & Production

- [ ] Add error boundaries and fallback UI
- [ ] Add loading states and skeleton screens throughout
- [ ] Add responsive design (mobile, tablet, desktop breakpoints)
- [ ] Add dark mode support
- [ ] Add Service Worker for offline caching
- [ ] Add meta tags, Open Graph, and SEO
- [ ] Add analytics event tracking
- [ ] Performance audit and optimization
- [ ] Accessibility audit (keyboard nav, screen readers, ARIA)

---

## Completed Features Summary

### Core MVP Achieved:
- Next.js 14 frontend with TypeScript and Tailwind CSS v4
- Wise-inspired design system with custom CSS variables
- UI components: Button, Card, Input, Textarea, Badge, Progress, Modal, Tabs, Skeleton
- AI integration with Transformers.js (Gemma 4 model)
- Proposal generation with fallback content
- Full CRUD operations via localStorage
- PDF export functionality
- Complete page structure (Home, Dashboard, Proposals, Editor, Templates, Clients)
