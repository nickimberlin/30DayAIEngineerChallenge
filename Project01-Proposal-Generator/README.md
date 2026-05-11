# Day 01: AI Proposal Generator for Agencies

> Generate polished, professional client proposals from short prompts using AI. Transform brief ideas into comprehensive, branded proposals in seconds — entirely in your browser.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)
![Transformers.js](https://img.shields.io/badge/Transformers.js-Local_AI-yellow?logo=javascript&logoColor=white)
![Gemma 4](https://img.shields.io/badge/Gemma_4-Local_Model-blue)
![E2B/E4B](https://img.shields.io/badge/E2B_E4B-Local_Model-green)

---

<!-- HERO MOCKUP PLACEHOLDER -->
<!--
  Replace with actual screenshot:
  ![AI Proposal Generator Hero](./assets/screenshots/hero.png)
-->
> **🖼️ Screenshot Placeholder** — Add hero mockup here showing the main dashboard with proposal generation interface.

---

## Overview

The AI Proposal Generator is a powerful SaaS tool designed for agencies and freelancers who need to create professional client proposals quickly. By leveraging **local AI models** running entirely in the browser via **Transformers.js**, the tool transforms short prompts into comprehensive, branded proposals complete with pricing tables, scope of work, timelines, and terms — with zero API costs and full client-side privacy.

### Use Cases

- **Digital Agencies**: Generate client proposals for web development, marketing campaigns, or design projects
- **Freelancers**: Create polished proposals without spending hours on formatting and content
- **Consultants**: Produce detailed scope documents with pricing structures automatically
- **Creative Studios**: Build branded proposals that reflect your unique identity

---

## How It Works

The proposal generation flow is designed to be fast, intuitive, and entirely client-side:

```
┌─────────────────────────────────────────────────────────────┐
│                    PROPOSAL GENERATION FLOW                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. PROMPT          2. GENERATE        3. REVIEW            │
│  ┌───────────┐     ┌───────────┐      ┌───────────┐        │
│  │ Enter a   │────▶│ AI models │─────▶│ Edit &    │        │
│  │ project   │     │ run local │      │ refine    │        │
│  │ brief     │     │ in browser│      │ content   │        │
│  └───────────┘     └───────────┘      └───────────┘        │
│                                             │               │
│  6. SEND           5. EXPORT          4. BRAND             │
│  ┌───────────┐     ┌───────────┐      ┌───────────┐        │
│  │ Share via │◀────│ Download  │◀─────│ Apply     │        │
│  │ email or  │     │ as PDF    │      │ logo &    │        │
│  │ link      │     │           │      │ colors    │        │
│  └───────────┘     └───────────┘      └───────────┘        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Step-by-Step

1. **Enter a Project Prompt** — Describe the project in a few sentences (e.g., "Build a Shopify store for a sustainable fashion brand")
2. **AI Generates Proposal** — Gemma 4, E2B, and E4B models run locally in your browser to produce scope, timeline, pricing, and terms
3. **Review & Edit** — Browse generated sections, edit text, rearrange content, and adjust pricing line items
4. **Customize Branding** — Upload your logo, set brand colors, and apply your visual identity to the proposal
5. **Export as PDF** — Generate a polished, print-ready PDF with one click
6. **Share** — Send directly via email integration or copy a shareable link

---

## Features

### Core Functionality

- **AI-Powered Content Generation**: Transform brief prompts into detailed proposals with scope, timeline, and deliverables — powered by local Gemma 4, E2B, and E4B models
- **Branding Support**: Upload your logo, colors, and brand guidelines for consistent proposal styling
- **PDF Export**: Generate professional PDF documents ready for client delivery
- **Pricing Tables**: Dynamic pricing structures with line items, discounts, and totals
- **Scope Generation**: AI-generated scope of work sections based on project type
- **Editable Templates**: Customize and save templates for recurring proposal types

### Additional Capabilities

- **Zero API Costs**: All AI inference runs locally in the browser via Transformers.js — no per-token charges
- **Client-Side Privacy**: Proposal data never leaves the user's browser — no server-side AI processing
- **Offline Capable**: Once models are cached in the browser, proposals can be generated without an internet connection
- **Multi-Template Support**: Create different templates for various service offerings
- **Client Management**: Store client details for quick proposal generation
- **Version History**: Track changes and revisions across proposal iterations
- **E-Signature Ready**: Integrate with signature tools for instant acceptance
- **Email Integration**: Send proposals directly from the platform

---

## Screenshots

<!-- Replace these placeholders with actual screenshots -->

| Dashboard | Proposal Editor |
|-----------|----------------|
| ![Dashboard](./assets/screenshots/dashboard.png) | ![Editor](./assets/screenshots/editor.png) |
| *Main dashboard with recent proposals and quick actions* | *AI-powered editor with live generation* |

| PDF Export | Model Loading |
|------------|---------------|
| ![PDF Export](./assets/screenshots/pdf-export.png) | ![Model Loading](./assets/screenshots/model-loading.png) |
| *Polished PDF output with branding applied* | *First-use model download with progress indicator* |

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | Next.js 14, React, Tailwind CSS |
| **AI Runtime** | Transformers.js (browser-based inference) |
| **AI Models** | Gemma 4, E2B, E4B (local, cached in browser) |
| **Backend** | FastAPI, Python 3.11+ |
| **PDF Generation** | Puppeteer / Playwright |
| **Database** | PostgreSQL / SQLite |
| **Authentication** | NextAuth.js |
| **Deployment** | Vercel (Frontend), Railway / Docker (Backend) |

### AI Architecture

All AI inference runs **client-side** using [Transformers.js](https://huggingface.co/docs/transformers.js):

- **Gemma 4** — Primary proposal generation model, runs locally in the browser via WebGPU/WASM
- **E2B** — Lightweight local model for scope and pricing suggestions
- **E4B** — Local model for template customization and content refinement

Models are downloaded and cached in the browser on first use, enabling fully offline proposal generation thereafter. No API keys or cloud AI services are required.

---

## Why Local AI?

This project runs AI models directly in the browser — a fundamentally different approach from cloud-based alternatives. Here's how it compares:

| Factor | 🟢 Local AI (This Project) | 🔴 Cloud AI (ChatGPT, Claude, etc.) |
|--------|----------------------------|--------------------------------------|
| **Cost** | Zero per-token charges — models are free after download | $0.03–$0.12 per 1K tokens, scales with usage |
| **Privacy** | Data never leaves the browser — perfect for sensitive proposals | All prompts sent to third-party servers |
| **Latency** | No network round-trip — inference starts instantly after model load | Depends on API response time and queue |
| **Offline** | Works fully offline once models are cached | Requires constant internet connection |
| **Vendor Lock-in** | Models are portable, open-source — swap anytime | Tied to a single provider's API and pricing |
| **Rate Limits** | None — generate unlimited proposals | API rate limits apply (tokens/min, requests/min) |
| **Scalability** | Each user brings their own compute | Server infrastructure costs grow with users |
| **Customization** | Swap models, fine-tune locally, adjust parameters | Limited to provider's model options |

### The Bottom Line

For a proposal generation tool, local AI is the clear winner:
- **Agencies** save hundreds per month on API costs
- **Clients** trust that their project details stay private
- **Freelancers** aren't blocked by rate limits during busy periods
- **Everyone** gets a tool that works even without internet

---

## Model Performance

### Model Specifications

| Model | Download Size | Inference Speed | Primary Use | Architecture |
|-------|--------------|-----------------|-------------|--------------|
| **Gemma 4** | ~1.5–3 GB (quantized) | ~15–30 tokens/sec | Full proposal generation (scope, timeline, terms) | Transformer, WebGPU |
| **E2B** | ~500 MB–1 GB (quantized) | ~30–60 tokens/sec | Scope & pricing suggestions | Lightweight Transformer, WebGPU/WASM |
| **E4B** | ~500 MB–1 GB (quantized) | ~30–60 tokens/sec | Template customization & content refinement | Lightweight Transformer, WebGPU/WASM |

> **Note**: Sizes and speeds are approximate and depend on quantization level (Q4/Q8) and hardware. Models are downloaded once and cached in the browser's Cache API / IndexedDB for subsequent visits.

### Model Loading Strategy

1. **First visit**: Models download with a progress indicator — user sees estimated time remaining
2. **Subsequent visits**: Models load from browser cache — near-instant startup
3. **Offline**: Models load from cache without any network request
4. **Updates**: New model versions are detected and downloaded in the background

### Browser Compatibility

| Browser | WebGPU | WASM Fallback | Status |
|---------|--------|---------------|--------|
| **Chrome 113+** | ✅ Full support | ✅ | 🟢 Best experience |
| **Edge 113+** | ✅ Full support | ✅ | 🟢 Best experience |
| **Firefox 130+** | ⚠️ Behind flag | ✅ | 🟡 Good (WASM) |
| **Safari 18+** | ⚠️ Experimental | ✅ | 🟡 Good (WASM) |
| **Opera 99+** | ✅ Full support | ✅ | 🟢 Best experience |
| **Mobile Chrome** | ⚠️ Limited | ✅ | 🟡 Good (WASM, slower) |
| **Mobile Safari** | ❌ Not available | ✅ | 🟠 Functional but slow |

### Hardware Recommendations

| Tier | Specs | Experience |
|------|-------|------------|
| **Optimal** | 16+ GB RAM, dedicated GPU, WebGPU-enabled browser | Fast generation, smooth UX |
| **Good** | 8+ GB RAM, integrated GPU, WebGPU-enabled browser | Comfortable generation speed |
| **Minimum** | 4+ GB RAM, no GPU, WASM fallback | Slower but functional |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          BROWSER (CLIENT)                           │
│                                                                     │
│  ┌──────────────┐    ┌──────────────────┐    ┌──────────────────┐  │
│  │   Next.js    │    │  Transformers.js │    │   Browser Cache  │  │
│  │   React App  │───▶│  AI Runtime      │───▶│  (IndexedDB /    │  │
│  │              │    │                  │    │   Cache API)     │  │
│  │  ┌────────┐  │    │  ┌────────────┐  │    │                  │  │
│  │  │Proposal│  │    │  │  Gemma 4   │  │    │  • Model weights │  │
│  │  │Editor  │  │    │  │  (WebGPU)  │  │    │  • Model config  │  │
│  │  └────────┘  │    │  ├────────────┤  │    │  • Tokenizer     │  │
│  │  ┌────────┐  │    │  │   E2B      │  │    │                  │  │
│  │  │Branding│  │    │  │(WebGPU/WASM│  │    └──────────────────┘  │
│  │  │Panel   │  │    │  ├────────────┤  │                          │
│  │  └────────┘  │    │  │   E4B      │  │    ┌──────────────────┐  │
│  │  ┌────────┐  │    │  │(WebGPU/WASM│  │    │   LocalStorage   │  │
│  │  │  PDF   │  │    │  └────────────┘  │    │  • Proposals     │  │
│  │  │Exporter│  │    │                  │    │  • Templates     │  │
│  │  └────────┘  │    └──────────────────┘    │  • Client data   │  │
│  └──────────────┘                            └──────────────────┘  │
│         │                                                         │
└─────────┼─────────────────────────────────────────────────────────┘
          │ HTTP (REST API)
          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        SERVER (OPTIONAL)                             │
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐  │
│  │   FastAPI     │    │  PostgreSQL  │    │   NextAuth.js        │  │
│  │   REST API    │───▶│  / SQLite    │    │   Authentication     │  │
│  │               │    │              │    │                      │  │
│  │  • /proposals │    │  • Users     │    │  • OAuth providers   │  │
│  │  • /templates │    │  • Proposals │    │  • Session mgmt      │  │
│  │  • /clients   │    │  • Templates │    │  • JWT tokens        │  │
│  └──────────────┘    └──────────────┘    └──────────────────────┘  │
│                                                                     │
│  ⚠️ No AI processing happens on the server                         │
│  ⚠️ Server only handles auth, persistence, and sharing             │
└─────────────────────────────────────────────────────────────────────┘
```

**Key Design Decisions:**
- **AI runs 100% client-side** — no proposal content is ever sent to the server for AI processing
- **Server is optional** — the app works without a backend for local-only use
- **Browser cache is the model store** — models persist across sessions without re-downloading
- **LocalStorage for data** — proposals, templates, and client data can live entirely in the browser

---

## Design System

The UI follows a **Wise-inspired design system** — bold, confident, and fintech-grade. Full specifications live in [`design.md`](./design.md).

### Key Design Tokens

| Token | Value | Preview |
|-------|-------|---------|
| Near Black | `#0e0f0c` | 🟫 |
| Wise Green | `#9fe870` | 🟩 |
| Dark Green | `#163300` | 🌲 |
| Light Mint | `#e2f6d5` | 🌿 |
| Danger Red | `#d03238` | 🟥 |
| Warning Yellow | `#ffd11a` | 🟨 |

### Typography at a Glance

- **Display**: Wise Sans, weight 900, line-height 0.85 — billboard-scale headlines
- **Body**: Inter, weight 600 — confident reading weight
- **All text**: OpenType `"calt"` contextual alternates enabled

### Component Highlights

- **Buttons**: Pill-shaped (9999px radius), `scale(1.05)` hover, `scale(0.95)` active
- **Cards**: 30px–40px radius, ring shadows only (`rgba(14,15,12,0.12)`)
- **Spacing**: 8px base unit

> 📖 **Full design system**: See [`design.md`](./design.md) for complete color palette, typography hierarchy, component stylings, layout principles, and implementation code.

---

## Project Structure

```
Day01-Proposal-Generator/
├── frontend/              # Next.js application
│   ├── app/              # App router pages
│   ├── components/       # React components
│   │   ├── ui/           # Design system primitives (Button, Card, Input)
│   │   ├── proposal/     # Proposal-specific components
│   │   └── branding/     # Branding panel components
│   ├── lib/              # Utilities and helpers
│   │   ├── ai/           # Transformers.js model loading & inference
│   │   ├── pdf/          # PDF generation logic
│   │   └── storage/      # LocalStorage / IndexedDB helpers
│   ├── hooks/            # Custom React hooks
│   └── public/           # Static assets
│       └── models/       # Model config files (weights loaded from HuggingFace)
├── backend/              # FastAPI server
│   ├── api/              # API routes
│   ├── models/           # Pydantic models
│   ├── services/         # Business logic
│   └── utils/            # Helper functions
├── assets/               # Design assets & screenshots
│   └── screenshots/      # App screenshots for README
├── design.md             # Full design system documentation
└── README.md             # This file
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- A modern browser with WebGPU support (Chrome 113+, Edge 113+) or WASM fallback
- npm or yarn

> **Note**: No API keys are needed. Gemma 4, E2B, and E4B models run locally in the browser via Transformers.js.

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Day01-Proposal-Generator
   ```

2. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   ```

3. **Set up the backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env
   ```

4. **Configure environment variables**
   ```env
   # Frontend (.env.local)
   NEXT_PUBLIC_API_URL=http://localhost:8000

   # Backend (.env)
   DATABASE_URL=sqlite:///proposals.db
   ```

   > **No AI API keys needed** — Models run locally in the browser via Transformers.js and are cached after first download.

5. **Run the development servers**
   ```bash
   # Frontend
   npm run dev

   # Backend
   uvicorn main:app --reload
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/proposals/generate` | Generate proposal from prompt |
| POST | `/api/proposals/:id/pdf` | Export proposal as PDF |
| GET | `/api/templates` | List all templates |
| POST | `/api/templates` | Create new template |
| PUT | `/api/templates/:id` | Update template |
| DELETE | `/api/templates/:id` | Delete template |
| GET | `/api/clients` | List all clients |
| POST | `/api/clients` | Create new client |

---

## Roadmap

### Phase 1 — MVP (Weeks 1–2)

- [ ] Transformers.js integration with Gemma 4, E2B, E4B
- [ ] Basic proposal generation from text prompt
- [ ] Single proposal template with branding support
- [ ] PDF export with logo and colors
- [ ] Model download with progress indicator
- [ ] LocalStorage persistence for proposals
- [ ] Wise-inspired UI with design system tokens

### Phase 2 — v2 (Weeks 3–4)

- [ ] Multi-template support with template editor
- [ ] Client management (CRUD, auto-fill)
- [ ] Version history and revision tracking
- [ ] Full offline mode (Service Worker + model caching)
- [ ] Pricing table editor with line items and discounts
- [ ] Proposal sharing via link
- [ ] Dark mode toggle

### Phase 3 — v3 (Weeks 5–8)

- [ ] E-signature integration (DocuSign / HelloSign)
- [ ] Email delivery from the platform
- [ ] Team collaboration (multi-user, roles, comments)
- [ ] REST API for third-party integrations
- [ ] Custom model support (upload fine-tuned weights)
- [ ] Analytics dashboard (proposal views, acceptance rates)
- [ ] Multi-language proposal generation

---

## Monetization Strategy

This project is designed as a **Monthly SaaS** for agencies and freelancers:

| Plan | Price | Features |
|------|-------|----------|
| **Starter** | $19/mo | 10 proposals/month, 2 templates, basic branding |
| **Professional** | $49/mo | Unlimited proposals, 10 templates, full branding, PDF export |
| **Agency** | $99/mo | Everything in Pro + team collaboration, API access, priority support |

### Revenue Potential

- 100 users @ $49/mo = **$4,900 MRR**
- 500 users @ $49/mo = **$24,500 MRR**
- 1000 users @ $49/mo = **$49,000 MRR**

### Competitive Edge

Unlike cloud-based proposal tools (PandaDoc, Proposify), our local AI approach means:
- **Lower operating costs** — no GPU servers to maintain, users bring their own compute
- **Higher margins** — AI inference costs are $0, not $0.03–$0.12 per 1K tokens
- **Privacy selling point** — "Your data never leaves your browser" is a powerful differentiator

---

## Portfolio Value

This project demonstrates:

- **Full-Stack Development**: Complete frontend and backend integration
- **Browser-Based AI**: Transformers.js running Gemma 4, E2B, and E4B locally — zero API costs, full privacy
- **WebGPU / WASM**: Cutting-edge browser APIs for GPU-accelerated ML inference
- **SaaS Architecture**: Multi-tenant design with subscription models
- **PDF Generation**: Server-side document creation
- **Design System Implementation**: Wise-inspired UI with comprehensive token system
- **Offline-First Architecture**: Service Worker + model caching for full offline capability
- **Modern UI/UX**: Responsive, accessible design with Next.js

**Perfect for MarkMango** — A standout portfolio piece that showcases real-world SaaS development with cutting-edge browser AI.

---

## FAQ

### How large are the model downloads?

Gemma 4 is approximately 1.5–3 GB (quantized), while E2B and E4B are ~500 MB–1 GB each. Models are downloaded on first use and cached in the browser — you only download them once. Total initial download is ~2.5–5 GB depending on quantization level.

### What browsers are supported?

**Best experience**: Chrome 113+ or Edge 113+ with WebGPU enabled. These browsers provide GPU-accelerated inference for fast generation. **Good experience**: Firefox 130+ and Safari 18+ with WASM fallback — generation works but is slower. See the [Browser Compatibility](#browser-compatibility) table above for full details.

### Can I use this without an internet connection?

Yes! After the initial model download, the app works fully offline. Models are cached in the browser's Cache API, and proposal data is stored in LocalStorage. You can generate, edit, and export proposals without any network connection. The backend is only needed for cloud sync and sharing features.

### How does this compare to using ChatGPT or Claude for proposals?

Cloud AI tools like ChatGPT and Claude produce excellent content, but they:
- **Cost money per use** — each proposal generation costs $0.10–$0.50 in API tokens
- **Send data to servers** — your client's project details leave your machine
- **Require internet** — no offline capability
- **Have rate limits** — you can only generate so many proposals per minute

Our local AI approach eliminates all of these downsides while still producing high-quality proposals. The tradeoff is that local models are smaller and may produce less nuanced output than GPT-4 — but for structured proposal content, they perform exceptionally well.

### Is my data sent to any server?

**AI processing**: Never. All model inference runs in your browser. Your prompt and generated content stay on your device.

**Proposal storage**: By default, proposals are stored in your browser's LocalStorage. If you enable cloud sync (requires account), proposals are stored on our server encrypted at rest. You can use the app entirely locally without ever creating an account.

### What if my device doesn't support WebGPU?

The app automatically falls back to WASM (WebAssembly) inference, which works in all modern browsers. WASM is slower than WebGPU — expect 2–5x slower generation — but all features remain fully functional.

### Can I use custom or fine-tuned models?

Phase 3 of the roadmap includes support for uploading custom model weights. You'll be able to fine-tune Gemma 4 on your own proposal data and load the custom weights into the browser alongside (or replacing) the default models.

### Why Transformers.js instead of a Python backend with llama.cpp?

Transformers.js runs models directly in the browser, which means:
1. **Zero server-side GPU costs** — users bring their own hardware
2. **Zero data transfer** — no prompts sent over the network
3. **Offline capability** — works without a server at all
4. **Infinite horizontal scale** — each user's browser is its own inference server

A Python backend approach would require expensive GPU infrastructure and sends all user data to the server, defeating the privacy-first design.

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Author

**30 Day AI Engineer Challenge** - Day 01 Project

[Repository](https://github.com/yourusername/30DayAIEngineerChallenge)
