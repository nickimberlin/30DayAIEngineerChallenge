# TODO - Website Blueprint Generator

## Phase 1: Backend Setup
- [x] Set up FastAPI project structure
- [x] Create main.py with app initialization
- [x] Set up CORS and middleware
- [x] Configure API endpoints (/api/generate, /api/blueprints, /api/blueprint/{id})

## Phase 2: LLM + Vector DB Integration
- [x] Install onnxruntime and transformers (using sentence-transformers for embeddings)
- [x] Create LLM client wrapper
- [x] Set up Qdrant client
- [x] Create collection for blueprint embeddings
- [x] Implement embedding generation for blueprints
- [x] Add similarity search for blueprint retrieval

## Phase 3: Blueprint Generation
- [x] Build sitemap generator module (context-aware)
- [x] Create tech stack advisor (context-aware)
- [x] Implement component planner (context-aware)
- [x] Design database schema builder (context-aware)
- [x] Add UI recommendations engine (context-aware)
- [x] Integrate with LLM for generation

## Phase 4: Output & Export
- [x] Create JSON export formatter
- [x] Implement Markdown export
- [x] Add YAML export option
- [x] Build blueprint storage (in-memory)

## Phase 5: Frontend
- [x] Set up React + Vite + Tailwind CSS project
- [x] Create API service for backend communication
- [x] Build UI with design system
- [x] Add blueprint generation form
- [x] Add blueprint listing and viewing

## Phase 6: Polish & Testing
- [ ] Test API endpoints
- [ ] Add input validation and error handling
- [ ] Create example prompts/tests
- [ ] Document API usage
- [ ] Add unit tests for core modules
- [ ] Benchmark LLM inference performance