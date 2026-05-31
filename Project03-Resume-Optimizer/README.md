# Day 03: AI Resume Optimizer

A web application that intelligently tailors resumes to job descriptions using AI. Scans a resume against any job posting, scores it for ATS (Applicant Tracking System) compatibility, and provides actionable rewrite suggestions — all within a clean, professional interface built on the **Carbon Design System by IBM**.

## Problem

Job seekers submit hundreds of applications. Most are rejected not because of lack of qualifications, but because the resume isn't optimized for the specific role or the ATS parsing it. Manual tailoring is time-consuming and inconsistent.

**The AI Resume Optimizer solves this** by automating the alignment between what a candidate has done and what a job description asks for — preserving the candidate's authentic experience while maximizing match score.

## Features

### ATS Scoring
- Parses a resume and job description, then computes a match score across skills, experience, education, and certifications.
- Breaks down scoring by category so the user knows exactly where they're weak.

### Rewrite Suggestions
- For each under-matched bullet point or skill, the system generates a rewrite suggestion that preserves truthfulness while improving keyword alignment.
- Suggests alternative phrasing, reordering, and section restructuring.

### Keyword Optimization
- Extracts key terms from the job description (required skills, tools, methodologies, soft skills).
- Flags missing keywords from the resume and suggests where to integrate them naturally.

### Cover Letter Generation
- Generates a draft cover letter tailored to the job description, referencing specific qualifications from the user's resume.

### Resume Parsing & Export
- Supports PDF, DOCX, and plain-text uploads.
- Exports the optimized resume as PDF or DOCX with formatting preserved.

## Architecture

```
┌─────────────────────────────┐
│        Frontend (React)     │
│  ┌───────────┬───────────┐  │
│  │ Resume    │ Job Desc  │  │
│  │ Upload    │ Input     │  │
│  ├───────────┴───────────┤  │
│  │    Analysis Engine    │  │
│  │  (ATS Score + Diff)   │  │
│  ├───────────┬───────────┤  │
│  │ Rewrite   │ Cover     │  │
│  │ Editor    │ Letter    │  │
│  └───────────┴───────────┘  │
├─────────────────────────────┤
│   API Gateway (FastAPI)     │
├─────────────────────────────┤
│   LLM Service (OpenAI/Claude)│
│   PDF/DOCX Processing       │
│   Vector Store (skills DB)  │
└─────────────────────────────┘
```

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript, Carbon Design System (IBM Plex Sans) |
| Backend | Python (FastAPI) |
| AI | OpenAI GPT-4 / Claude API |
| Document Processing | pdfplumber, python-docx |
| Vector Store | ChromaDB (skills & keyword embeddings) |
| Auth | Supabase / Clerk |

## Design System

This project follows the **IBM Carbon Design System** faithfully.

See [`DESIGN.md`](./DESIGN.md) for the full system reference — including color tokens, typography hierarchy, spacing grid, component definitions, and responsive behavior.

### Quick Reference

- **Font**: IBM Plex Sans (weight 300 for display sizes, 400 for body)
- **Corners**: 0px (`rounded.none`) on every button, card, and input — the flat-square Carbon aesthetic
- **Accent**: IBM Blue (`#0f62fe`) is the single brand color — links, primary CTAs, focus rings
- **Surfaces**: White canvas (`#ffffff`), light gray surface-1 (`#f4f4f4`) for cards/bands, charcoal ink (`#161616`) for text
- **Spacing**: Carbon 4px base grid; card padding at 24px, section gaps at 96px
- **Elevation**: No drop shadows — hierarchy via 1px hairlines and surface change

## Getting Started

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-resume-optimizer.git
cd ai-resume-optimizer

# Install backend dependencies
pip install -r requirements.txt

# Install frontend dependencies
cd frontend && npm install

# Set up environment
cp .env.example .env
# Add your OpenAI/Claude API key

# Start development servers
# Terminal 1: Backend
uvicorn api.main:app --reload

# Terminal 2: Frontend
npm run dev
```

### Environment Variables

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | OpenAI API key for GPT-4 |
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude (fallback) |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous key |
| `CHROMA_DB_PATH` | Path to ChromaDB persistent storage |

## Usage

1. **Upload your resume** — PDF, DOCX, or paste plain text.
2. **Paste a job description** — URL or raw text.
3. **Review your ATS score** — see the match breakdown by category.
4. **Accept or edit rewrites** — each suggestion shows the original vs. optimized version.
5. **Export** — download the optimized resume or generated cover letter.

## Monetization

| Tier | Price | Limits |
|---|---|---|
| Free | $0 | 3 analyses/month, basic scoring |
| Pro | $12/month | Unlimited analyses, AI rewrites, cover letters, PDF export |
| Pay-per-use | $3/analysis | No subscription, single-use credits |

## Roadmap

- [ ] **LinkedIn Integration** — import profile directly, compare against job listings
- [ ] **Batch Apply** — optimize one resume against multiple job descriptions at once
- [ ] **Company Research** — auto-fetch company values, culture, and recent news for deeper tailoring
- [ ] **Interview Question Prep** — generate likely questions based on the job description
- [ ] **Salary Benchmarking** — surface market rate data for the role and location
- [ ] **Team Workspaces** — shared resume libraries for recruiting teams and career centers
- [ ] **Dark Mode** — Carbon Gray-100 theme for the full app
