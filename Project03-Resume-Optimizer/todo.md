# Todo

## Phase 1: Foundation

- [ ] **Initialize project structure**
  - [ ] Set up React + TypeScript frontend with Vite
  - [ ] Set up Python FastAPI backend
  - [ ] Configure ESLint, Prettier, and type checking
- [ ] **Integrate Carbon Design System**
  - [ ] Install `@carbon/react` and `@carbon/styles`
  - [ ] Load IBM Plex Sans (Google Fonts or self-hosted)
  - [ ] Configure theme tokens (colors, spacing, typography per `DESIGN.md`)
  - [ ] Set up 16-column grid layout shell
- [ ] **Document processing pipeline**
  - [ ] Implement PDF upload & parsing (`pdfplumber`)
  - [ ] Implement DOCX upload & parsing (`python-docx`)
  - [ ] Implement plain-text paste handler
  - [ ] Normalize all inputs to structured JSON (skills, experience, education)

## Phase 2: Core Features

- [ ] **ATS Scoring Engine**
  - [ ] Extract keywords from job description (required skills, tools, soft skills)
  - [ ] Compute category match scores (skills, experience, education, certifications)
  - [ ] Compute overall ATS match percentage
  - [ ] Display score breakdown with visual indicators (Carbon progress bars)
- [ ] **Keyword Optimization**
  - [ ] Cross-reference resume against extracted job keywords
  - [ ] Flag missing keywords with severity rating
  - [ ] Suggest natural integration points in existing bullet points
- [ ] **Rewrite Suggestions**
  - [ ] Call LLM API to generate bullet-point rewrites
  - [ ] Show original vs. optimized side-by-side
  - [ ] Accept / reject / edit individual suggestions
  - [ ] Preserve truthfulness constraint (no hallucinated experience)
- [ ] **Cover Letter Generation**
  - [ ] Generate draft referencing job description + resume highlights
  - [ ] Editable output with download as DOCX

## Phase 3: Polishing

- [ ] **Export**
  - [ ] Export optimized resume as PDF (preserve formatting)
  - [ ] Export as DOCX
  - [ ] Export cover letter as DOCX
- [ ] **Responsive design**
  - [ ] Test all views at 320px, 672px, 1056px, 1312px, 1584px
  - [ ] Nav collapses to hamburger below 672px
  - [ ] Card grids: 4-up → 2-up → 1-up
  - [ ] Touch targets at 48px minimum
- [ ] **Auth & user accounts**
  - [ ] Integrate Supabase / Clerk for authentication
  - [ ] Save analysis history per user
  - [ ] Rate-limit free tier to 3 analyses/month

## Phase 4: Monetization

- [ ] **Stripe integration**
  - [ ] Pro subscription ($12/month)
  - [ ] Pay-per-use credits ($3/analysis)
  - [ ] Webhook handling for subscription events
- [ ] **Usage tracking**
  - [ ] Meter API calls per user per billing period
  - [ ] Enforce free-tier caps
  - [ ] Display remaining credits in UI

## Phase 5: Stretch Goals

- [ ] **LinkedIn integration** — import profile via OAuth, compare against job listings
- [ ] **Batch Apply** — optimize one resume against multiple job descriptions
- [ ] **Company research** — auto-fetch company values, culture, news
- [ ] **Interview question prep** — generate questions based on job description
- [ ] **Salary benchmarking** — surface market rate data for role + location
- [ ] **Team workspaces** — shared resume libraries for recruiting teams
- [ ] **Dark mode** — implement Carbon Gray-100 theme

## Design Tokens Reference

When implementing any UI component, reference these tokens from `DESIGN.md`:

| Category | Key Tokens |
|---|---|
| Colors | `{colors.primary}` (#0f62fe), `{colors.canvas}` (#fff), `{colors.surface-1}` (#f4f4f4), `{colors.ink}` (#161616) |
| Typography | `{typography.display-md}` (42px/300), `{typography.headline}` (32px/400), `{typography.body}` (16px/400, ls 0.16px) |
| Spacing | `{spacing.lg}` (24px), `{spacing.xl}` (32px), `{spacing.section}` (96px) |
| Rounded | `{rounded.none}` (0px) — always |
| Buttons | `button-primary` (blue solid), `button-secondary` (charcoal), `button-tertiary` (outline), `button-ghost` (text) |
| Cards | `feature-card` (canvas + 1px hairline), `product-card` (32px padding) |
