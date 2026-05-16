# Day 02: AI Website Blueprint Generator

An AI-powered tool that transforms website descriptions into comprehensive blueprints including sitemaps, tech stacks, component plans, database schemas, and UI recommendations.

## Project Overview

This tool accepts a natural language description of a website idea via a REST API and automatically generates a complete project blueprint that developers can use as a starting point for implementation.

## Architecture

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: FastAPI server running locally (TODO: not yet built)
- **LLM**: onnx-community/Qwen3.5-0.8B-ONNX (TODO: not yet integrated)
- **Vector DB**: Qdrant (TODO: not yet integrated)
- **API**: RESTful endpoints for blueprint generation

## Features

- **Sitemap Generation**: Hierarchical page structure based on requirements
- **Tech Stack Selection**: Recommended technologies (frontend, backend, databases, hosting)
- **Component Architecture**: React/Vue components with props and state management
- **Database Schema**: Tables, relationships, and data models
- **UI Recommendations**: Design patterns, layouts, and UI library suggestions
- **Local LLM**: Runs entirely offline using ONNX-optimized Qwen model

## Monetization

Sell to freelancers and startups who need quick project scaffolding and architecture planning.

## Goals

1. Set up FastAPI backend server with proper endpoints
2. Integrate Qwen3.5-0.8B-ONNX model for local inference
3. Create REST API for blueprint generation
4. Build parsers for different blueprint formats
5. Implement export capabilities (JSON, Markdown, YAML)

## API Endpoints

```bash
# Generate a blueprint
POST /api/generate
Content-Type: application/json
{
  "description": "An e-commerce site for selling handmade jewelry"
}

# Get a specific blueprint
GET /api/blueprint/{id}

# List all blueprints
GET /api/blueprints
```

## Running the Project

### Frontend (React + Vite + Tailwind CSS)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend (FastAPI - TODO)

```bash
# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload

# Generate a blueprint via API
curl -X POST http://localhost:8000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"description": "An e-commerce site for selling handmade jewelry"}'
```

The backend will be available at `http://localhost:8000`

## Output Example

The tool generates a complete blueprint including:

- `sitemap.json` - Page hierarchy
- `tech-stack.md` - Technology recommendations
- `components.md` - Component breakdown
- `schema.sql` - Database structure
- `ui-guide.md` - Design suggestions