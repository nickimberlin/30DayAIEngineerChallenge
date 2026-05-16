from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import uuid
from datetime import datetime
import json
import os
import sys
import logging
from pathlib import Path

from services.llm_service import get_llm_service, get_llm_generation_service
from services.qdrant_service import get_qdrant_service
from services.wireframe_service import get_wireframe_service

BLUEPRINTS_FILE = Path(__file__).parent / "blueprints.json"

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
    datefmt='%H:%M:%S'
)
logger = logging.getLogger("main")

def print_error(msg: str):
    logger.error(msg)
    print(f"\033[91mERROR: {msg}\033[0m", file=sys.stderr)

def print_success(msg: str):
    logger.info(msg)
    print(f"\033[92m{msg}\033[0m")

def print_warning(msg: str):
    logger.warning(msg)
    print(f"\033[93mWARNING: {msg}\033[0m")

def _validate_llm_result(result: Dict[str, Any]) -> bool:
    """Validate that LLM result has the expected structure."""
    try:
        required_keys = ["sitemap", "tech_stack", "components", "database_schema", "ui_recommendations"]
        for key in required_keys:
            if key not in result:
                return False
        
        if not isinstance(result.get("sitemap", {}).get("pages"), list):
            return False
        
        if not isinstance(result.get("tech_stack"), dict):
            return False
        
        if "frontend" not in result.get("tech_stack", {}) or "backend" not in result.get("tech_stack", {}):
            return False
        
        if not isinstance(result.get("components", {}).get("components"), list):
            return False
        
        if not isinstance(result.get("database_schema", {}).get("tables"), list):
            return False
        
        if not isinstance(result.get("ui_recommendations", {}).get("design_patterns"), list):
            return False
        
        return True
    except:
        return False

app = FastAPI(
    title="AI Website Blueprint Generator",
    description="Transform website descriptions into comprehensive blueprints",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BlueprintRequest(BaseModel):
    description: str = Field(..., min_length=10, max_length=2000)
    project_name: Optional[str] = None

class BlueprintResponse(BaseModel):
    id: str
    project_name: str
    description: str
    sitemap: dict
    tech_stack: dict
    components: dict
    database_schema: dict
    ui_recommendations: dict
    created_at: str

blueprints_storage: dict = {}
llm_loaded = False
qdrant_loaded = False
generation_loaded = False

def load_blueprints() -> dict:
    print("Loading blueprints from file...")
    if BLUEPRINTS_FILE.exists():
        print(f"  Found blueprints file: {BLUEPRINTS_FILE}")
        try:
            with open(BLUEPRINTS_FILE, 'r') as f:
                data = json.load(f)
                print(f"  Loaded {len(data)} blueprints from file")
                valid = {}
                for key, bp in data.items():
                    if isinstance(bp, dict) and "id" in bp and "project_name" in bp:
                        valid[key] = bp
                    else:
                        print_warning(f"  Skipping invalid blueprint: {key}")
                print(f"  Valid blueprints: {len(valid)}")
                return valid
        except json.JSONDecodeError as e:
            print_error(f"  Invalid JSON in blueprints file, resetting: {e}")
            return {}
        except Exception as e:
            print_warning(f"  Could not load blueprints: {e}")
    else:
        print("  No blueprints file found, starting fresh")
    return {}

def save_blueprints():
    print(f"Saving {len(blueprints_storage)} blueprints to file...")
    try:
        with open(BLUEPRINTS_FILE, 'w') as f:
            json.dump(blueprints_storage, f, indent=2)
        print_success(f"  Saved {len(blueprints_storage)} blueprints successfully")
    except Exception as e:
        print_error(f"  Could not save blueprints: {e}")

@app.on_event("startup")
async def startup():
    global llm_loaded, qdrant_loaded, generation_loaded
    print("\n" + "="*50)
    print("Starting AI Website Blueprint Generator")
    print("="*50)
    print("Starting AI Website Blueprint Generator")
    print("="*50)
    
    blueprints_storage = load_blueprints()
    print(f"Loaded {len(blueprints_storage)} blueprints from storage")
    
    try:
        llm_service = await get_llm_service()
        llm_loaded = True
        print("LLM service loaded successfully")
    except Exception as e:
        print(f"Warning: LLM service not available: {e}")
    
    try:
        generation_service = await get_llm_generation_service()
        if generation_service._generation_loaded:
            generation_loaded = True
            print("LLM generation model loaded successfully")
    except Exception as e:
        print(f"Warning: LLM generation model not available: {e}")
    
    try:
        qdrant_service = await get_qdrant_service()
        qdrant_loaded = True
        print("Qdrant service loaded successfully")
    except Exception as e:
        print(f"Warning: Qdrant service not available: {e}")

@app.get("/")
async def root():
    return {"message": "AI Website Blueprint Generator API", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "llm_loaded": llm_loaded,
        "llm_generation": generation_loaded,
        "qdrant_loaded": qdrant_loaded
    }

@app.post("/api/generate", response_model=BlueprintResponse)
async def generate_blueprint(request: BlueprintRequest):
    logger.info(f"REQUEST: POST /api/generate")
    logger.debug(f"  description: {request.description[:100]}...")
    logger.debug(f"  project_name: {request.project_name}")
    
    project_name = request.project_name or f"Project-{uuid.uuid4().hex[:8]}"
    blueprint_id = str(uuid.uuid4())
    logger.info(f"  [ID: {blueprint_id}] Processing request...")
    
    llm_sitemap = None
    llm_tech_stack = None
    llm_components = None
    llm_database_schema = None
    llm_ui_recommendations = None
    
    if generation_loaded:
        logger.debug(f"  [ID: {blueprint_id}] Attempting LLM generation...")
        try:
            generation_service = await get_llm_generation_service()
            llm_result = generation_service.generate_blueprint(request.description)
            if llm_result and _validate_llm_result(llm_result):
                llm_sitemap = llm_result.get("sitemap")
                llm_tech_stack = llm_result.get("tech_stack")
                llm_components = llm_result.get("components")
                llm_database_schema = llm_result.get("database_schema")
                llm_ui_recommendations = llm_result.get("ui_recommendations")
                logger.info(f"  [ID: {blueprint_id}] LLM generation: SUCCESS")
            else:
                logger.warning(f"  [ID: {blueprint_id}] LLM returned invalid format, using fallback")
        except Exception as e:
            logger.error(f"  [ID: {blueprint_id}] LLM generation failed: {e}")
    
    blueprint = {
        "id": blueprint_id,
        "project_name": project_name,
        "description": request.description,
        "sitemap": llm_sitemap or _generate_sitemap(request.description),
        "tech_stack": llm_tech_stack or _generate_tech_stack(request.description),
        "components": llm_components or _generate_components(request.description),
        "database_schema": llm_database_schema or _generate_database_schema(request.description),
        "ui_recommendations": llm_ui_recommendations or _generate_ui_recommendations(request.description),
        "created_at": datetime.utcnow().isoformat(),
        "react_code": _generate_react_code({"project_name": project_name, "description": request.description, "sitemap": llm_sitemap or _generate_sitemap(request.description), "components": llm_components or _generate_components(request.description)})
    }
    
    if llm_loaded and qdrant_loaded:
        logger.debug(f"  [ID: {blueprint_id}] Storing in Qdrant...")
        try:
            llm_service = await get_llm_service()
            qdrant_service = await get_qdrant_service()
            
            embedding = llm_service.generate_embedding(request.description)
            await qdrant_service.add_blueprint(blueprint_id, request.description, embedding)
            
            similar = await qdrant_service.search_similar(embedding, limit=3)
            blueprint["similar_blueprints"] = similar
            logger.info(f"  [ID: {blueprint_id}] Qdrant: stored + found {len(similar)} similar")
        except Exception as e:
            logger.warning(f"  [ID: {blueprint_id}] Qdrant store failed: {e}")
    
    blueprints_storage[blueprint_id] = blueprint
    save_blueprints()
    logger.info(f"  [ID: {blueprint_id}] RESPONSE: 200 OK")
    return blueprint

@app.get("/api/blueprints")
async def list_blueprints():
    logger.info("REQUEST: GET /api/blueprints")
    try:
        valid_blueprints = []
        for bp_id, bp in blueprints_storage.items():
            try:
                BlueprintResponse.model_validate(bp)
                valid_blueprints.append(bp)
            except Exception as e:
                logger.warning(f"Skipping invalid blueprint {bp_id}: {e}")
        logger.info(f"RESPONSE: 200 OK ({len(valid_blueprints)} blueprints)")
        return valid_blueprints
    except Exception as e:
        logger.error(f"Error in list_blueprints: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/blueprint/{blueprint_id}", response_model=BlueprintResponse)
async def get_blueprint(blueprint_id: str):
    logger.info(f"REQUEST: GET /api/blueprint/{blueprint_id}")
    if blueprint_id not in blueprints_storage:
        logger.warning(f"  Not found: {blueprint_id}")
        raise HTTPException(status_code=404, detail="Blueprint not found")
    logger.info(f"RESPONSE: 200 OK")
    return blueprints_storage[blueprint_id]

@app.delete("/api/blueprint/{blueprint_id}")
async def delete_blueprint(blueprint_id: str):
    logger.info(f"REQUEST: DELETE /api/blueprint/{blueprint_id}")
    if blueprint_id not in blueprints_storage:
        logger.warning(f"  Not found: {blueprint_id}")
        raise HTTPException(status_code=404, detail="Blueprint not found")
    del blueprints_storage[blueprint_id]
    save_blueprints()
    logger.info(f"RESPONSE: 200 OK (deleted)")
    return {"message": "Blueprint deleted"}

@app.get("/api/blueprint/{blueprint_id}/export/{format}")
async def export_blueprint(blueprint_id: str, format: str):
    logger.info(f"REQUEST: GET /api/blueprint/{blueprint_id}/export/{format}")
    if blueprint_id not in blueprints_storage:
        logger.warning(f"  Not found: {blueprint_id}")
        raise HTTPException(status_code=404, detail="Blueprint not found")
    
    blueprint = blueprints_storage[blueprint_id]
    
    if format == "json":
        logger.info(f"RESPONSE: 200 OK (json)")
        return blueprint
    elif format == "markdown":
        logger.info(f"RESPONSE: 200 OK (markdown)")
        return {"content": _export_markdown(blueprint)}
    elif format == "yaml":
        logger.info(f"RESPONSE: 200 OK (yaml)")
        return {"content": _export_yaml(blueprint)}
    else:
        raise HTTPException(status_code=400, detail="Unsupported format. Use: json, markdown, or yaml")

@app.post("/api/search")
async def search_blueprints(query: str, limit: int = 5):
    logger.info(f"REQUEST: POST /api/search (query: '{query[:50]}...', limit: {limit})")
    if not llm_loaded:
        raise HTTPException(status_code=503, detail="LLM service not available")
    
    try:
        llm_service = await get_llm_service()
        query_embedding = llm_service.generate_embedding(query)
        
        if qdrant_loaded:
            qdrant_service = await get_qdrant_service()
            similar_ids = await qdrant_service.search_similar(query_embedding, limit)
            results = [blueprints_storage[id] for id in similar_ids if id in blueprints_storage]
            logger.info(f"RESPONSE: 200 OK ({len(results)} results)")
            return {"results": results}
        else:
            logger.warning("Qdrant not available for similarity search")
            return {"results": [], "message": "Qdrant not available for similarity search"}
    except Exception as e:
        logger.error(f"Search failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/blueprint/{blueprint_id}/wireframe")
async def generate_wireframe(blueprint_id: str):
    logger.info(f"REQUEST: POST /api/blueprint/{blueprint_id}/wireframe")
    
    if blueprint_id not in blueprints_storage:
        logger.warning(f"  Not found: {blueprint_id}")
        raise HTTPException(status_code=404, detail="Blueprint not found")
    
    blueprint = blueprints_storage[blueprint_id]
    wireframe_service = get_wireframe_service()
    result = wireframe_service.generate_wireframe(blueprint)
    
    logger.info(f"RESPONSE: 200 OK ({result['file_count']} files)")
    return result

@app.get("/api/blueprint/{blueprint_id}/wireframe/{filename}")
async def get_wireframe_file(blueprint_id: str, filename: str):
    logger.info(f"REQUEST: GET /api/blueprint/{blueprint_id}/wireframe/{filename}")
    
    if blueprint_id not in blueprints_storage:
        logger.warning(f"  Not found: {blueprint_id}")
        raise HTTPException(status_code=404, detail="Blueprint not found")
    
    blueprint = blueprints_storage[blueprint_id]
    wireframe_service = get_wireframe_service()
    result = wireframe_service.generate_wireframe(blueprint)
    
    if filename not in result["files"]:
        raise HTTPException(status_code=404, detail="File not found")
    
    return {"filename": filename, "content": result["files"][filename]}

def _generate_sitemap(description: str) -> dict:
    desc_lower = description.lower()
    
    pages = [{"path": "/", "name": "Home", "description": "Main landing page"}]
    
    if any(w in desc_lower for w in ["blog", "news", "article", "post"]):
        pages.append({"path": "/blog", "name": "Blog", "description": "Blog listing and posts"})
    
    if any(w in desc_lower for w in ["shop", "store", "product", "e-commerce", "buy", "sell"]):
        pages.append({"path": "/products", "name": "Products", "description": "Product catalog"})
        pages.append({"path": "/cart", "name": "Cart", "description": "Shopping cart"})
        pages.append({"path": "/checkout", "name": "Checkout", "description": "Checkout process"})
    
    if any(w in desc_lower for w in ["about", "company", "team"]):
        pages.append({"path": "/about", "name": "About", "description": "About us page"})
    
    if any(w in desc_lower for w in ["contact", "support", "help", "faq"]):
        pages.append({"path": "/contact", "name": "Contact", "description": "Contact form page"})
    
    if any(w in desc_lower for w in ["dashboard", "admin", "user", "account", "profile"]):
        pages.append({"path": "/dashboard", "name": "Dashboard", "description": "User dashboard"})
        pages.append({"path": "/profile", "name": "Profile", "description": "User profile"})
    
    pages.append({"path": "/privacy", "name": "Privacy", "description": "Privacy policy"})
    
    return {"pages": pages}

def _generate_tech_stack(description: str) -> dict:
    desc_lower = description.lower()
    
    if any(w in desc_lower for w in ["react", "vue", "angular", "frontend"]):
        frontend = {"framework": "React", "styling": "Tailwind CSS", "state_management": "Zustand"}
    else:
        frontend = {"framework": "React", "styling": "Tailwind CSS", "state_management": "Zustand"}
    
    if any(w in desc_lower for w in ["fastapi", "flask", "django", "python", "backend"]):
        backend = {"framework": "FastAPI", "language": "Python"}
    else:
        backend = {"framework": "FastAPI", "language": "Python"}
    
    if any(w in desc_lower for w in ["ecommerce", "shop", "store"]):
        database = {"primary": "PostgreSQL", "cache": "Redis", "search": "Elasticsearch"}
    else:
        database = {"primary": "PostgreSQL", "cache": "Redis"}
    
    hosting = {"provider": "Vercel", "ci_cd": "GitHub Actions", "monitoring": "Sentry"}
    
    return {
        "frontend": frontend,
        "backend": backend,
        "database": database,
        "hosting": hosting
    }

def _generate_components(description: str) -> dict:
    desc_lower = description.lower()
    
    components = [
        {"name": "Header", "props": ["logo", "navigation", "userMenu", "theme"]},
        {"name": "Hero", "props": ["title", "subtitle", "cta", "backgroundImage"]},
        {"name": "Footer", "props": ["links", "social", "copyright", "newsletter"]},
    ]
    
    if any(w in desc_lower for w in ["blog", "news", "article"]):
        components.append({"name": "BlogCard", "props": ["title", "excerpt", "image", "date", "author"]})
    
    if any(w in desc_lower for w in ["product", "shop", "store"]):
        components.append({"name": "ProductCard", "props": ["name", "price", "image", "addToCart"]})
        components.append({"name": "ProductGrid", "props": ["products", "columns"]})
    
    if any(w in desc_lower for w in ["form", "contact", "signup", "register"]):
        components.append({"name": "FormInput", "props": ["label", "type", "required", "error"]})
        components.append({"name": "Button", "props": ["label", "variant", "size", "disabled"]})
    
    return {"components": components}

def _generate_database_schema(description: str) -> dict:
    desc_lower = description.lower()
    
    tables = [
        {"name": "users", "columns": [
            {"name": "id", "type": "UUID", "primary_key": True},
            {"name": "email", "type": "VARCHAR(255)", "unique": True},
            {"name": "password_hash", "type": "VARCHAR(255)"},
            {"name": "created_at", "type": "TIMESTAMP"},
            {"name": "updated_at", "type": "TIMESTAMP"}
        ]}
    ]
    
    if any(w in desc_lower for w in ["product", "shop", "store", "ecommerce"]):
        tables.append({"name": "products", "columns": [
            {"name": "id", "type": "UUID", "primary_key": True},
            {"name": "name", "type": "VARCHAR(255)"},
            {"name": "description", "type": "TEXT"},
            {"name": "price", "type": "DECIMAL(10,2)"},
            {"name": "image_url", "type": "VARCHAR(500)"},
            {"name": "created_at", "type": "TIMESTAMP"}
        ]})
        tables.append({"name": "orders", "columns": [
            {"name": "id", "type": "UUID", "primary_key": True},
            {"name": "user_id", "type": "UUID", "foreign_key": "users.id"},
            {"name": "total", "type": "DECIMAL(10,2)"},
            {"name": "status", "type": "VARCHAR(50)"},
            {"name": "created_at", "type": "TIMESTAMP"}
        ]})
    
    if any(w in desc_lower for w in ["blog", "article", "post", "news"]):
        tables.append({"name": "posts", "columns": [
            {"name": "id", "type": "UUID", "primary_key": True},
            {"name": "title", "type": "VARCHAR(255)"},
            {"name": "content", "type": "TEXT"},
            {"name": "author_id", "type": "UUID", "foreign_key": "users.id"},
            {"name": "published_at", "type": "TIMESTAMP"},
            {"name": "created_at", "type": "TIMESTAMP"}
        ]})
    
    return {"tables": tables}

def _generate_ui_recommendations(description: str) -> dict:
    desc_lower = description.lower()
    
    if any(w in desc_lower for w in ["modern", "clean", "minimal"]):
        design_patterns = ["minimalist_layout", "generous_whitespace", "clean_typography"]
    elif any(w in desc_lower for w in ["creative", "art", "portfolio", "design"]):
        design_patterns = ["grid_gallery", "visual_heavy", "custom_animations"]
    else:
        design_patterns = ["responsive_grid", "card_based_layout", "accessibility_first"]
    
    if any(w in desc_lower for w in ["dark", "night"]):
        color_scheme = "dark_mode"
    elif any(w in desc_lower for w in ["colorful", "vibrant", "creative"]):
        color_scheme = "colorful_accent"
    else:
        color_scheme = "warm_neutral"
    
    return {
        "design_patterns": design_patterns,
        "color_scheme": color_scheme,
        "typography": "humanist_sans",
        "ui_library": "shadcn/ui",
        "accessibility": "wcag_aa_compliant"
    }

def _generate_react_code(blueprint: dict) -> str:
    """Generate a wireframe React App component based on the blueprint."""
    project_name = blueprint.get('project_name', 'Website')
    sitemap = blueprint.get('sitemap', {})
    components = blueprint.get('components', {})
    description = blueprint.get('description', '')[:100]
    
    pages = sitemap.get('pages', [])
    comps = components.get('components', [])
    
    code = """// React Wireframe - Generated by Blueprint Generator
// Project: """ + project_name + """

import React, { useState } from 'react';

const styles = {
  app: { minHeight: '100vh', backgroundColor: '#fffefb', fontFamily: 'system-ui, sans-serif' },
  nav: { backgroundColor: '#201515', color: '#fffefb', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  navLink: { color: '#fffefb', marginLeft: '1.5rem', cursor: 'pointer' },
  hero: { textAlign: 'center', padding: '4rem 2rem', backgroundColor: '#f8f4f0' },
  title: { fontSize: '2.5rem', fontWeight: 'bold', color: '#201515', marginBottom: '1rem' },
  subtitle: { fontSize: '1.2rem', color: '#605d52', marginBottom: '2rem' },
  ctaButton: { backgroundColor: '#ff4f00', color: '#fffefb', border: 'none', padding: '1rem 2rem', borderRadius: '12px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
  card: { backgroundColor: '#f8f4f0', padding: '1.5rem', borderRadius: '12px', border: '1px solid #201515' },
  cardTitle: { fontSize: '1.1rem', fontWeight: '600', color: '#201515', marginBottom: '0.5rem' },
  tag: { display: 'inline-block', backgroundColor: '#fffefb', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', color: '#605d52', marginRight: '0.25rem', marginTop: '0.25rem' },
  footer: { backgroundColor: '#201515', color: '#f8f4f0', textAlign: 'center', padding: '2rem', marginTop: '4rem' },
  page: { padding: '3rem 2rem', maxWidth: '800px', margin: '0 auto' },
  pageTitle: { fontSize: '2rem', fontWeight: 'bold', color: '#201515', marginBottom: '1rem' }
};

function HomePage() {
  return (
    React.createElement('div', { style: styles.page },
    React.createElement('h1', { style: styles.pageTitle }, 'Home'),
    React.createElement('p', { style: { color: '#605d52' } }, 'Welcome to """ + project_name + """'),
    React.createElement('button', { style: styles.ctaButton }, 'Get Started')
  ));
}

function AboutPage() {
  return (
    React.createElement('div', { style: styles.page },
    React.createElement('h1', { style: styles.pageTitle }, 'About'),
    React.createElement('p', { style: { color: '#605d52' } }, 'Learn more about us')
  ));
}

function ContactPage() {
  return (
    React.createElement('div', { style: styles.page },
    React.createElement('h1', { style: styles.pageTitle }, 'Contact'),
    React.createElement('p', { style: { color: '#605d52' } }, 'Get in touch')
  ));
}

const pages = {
"""
    
    for p in pages[:5]:
        page_name = p["name"].replace(" ", "")
        code += '  "' + p["path"] + '": ' + page_name + 'Page,\n'
    
    code += """};

function App() {
  const [currentPage, setCurrentPage] = useState('/');
  const PageComponent = pages[currentPage] || HomePage;
  
  return (
    React.createElement('div', { style: styles.app },
      React.createElement('nav', { style: styles.nav },
        React.createElement('div', { style: { fontSize: '1.25rem', fontWeight: 'bold' } }, '""" + project_name + """'),
        React.createElement('div', null,
"""
    
    for p in pages[:5]:
        code += '          React.createElement("span", { key: "' + p["path"] + '", style: styles.navLink, onClick: () => setCurrentPage("' + p["path"] + '") }, "' + p["name"] + '"),\n'
    
    code += """        )
      ),
      currentPage === '/' ? 
        React.createElement('div', { style: styles.hero },
          React.createElement('h1', { style: styles.title }, 'Welcome to """ + project_name + """'),
          React.createElement('p', { style: styles.subtitle }, '""" + description + """'),
          React.createElement('button', { style: styles.ctaButton }, 'Get Started')
        ) : null,
      React.createElement('div', { style: { padding: '2rem' } },
        React.createElement(PageComponent)
      ),
      React.createElement('div', { style: styles.grid },
"""
    
    for comp in comps[:6]:
        code += "        React.createElement('div', { key: '" + comp["name"] + "', style: styles.card },\n"
        code += "          React.createElement('h3', { style: styles.cardTitle }, '" + comp["name"] + "'),\n"
        code += "          React.createElement('div', null,\n"
        for prop in comp.get("props", [])[:4]:
            code += "            React.createElement('span', { style: styles.tag }, '" + prop + "'),\n"
        code += "          )\n"
        code += "        ),\n"
    
    code += """      ),
      React.createElement('footer', { style: styles.footer },
        React.createElement('p', null, '© 2024 """ + project_name + """. Built with Blueprint Generator.')
      )
    )
  );
}

export default App;"""
    
    return code

def _export_markdown(blueprint: dict) -> str:
    md = f"""# {blueprint['project_name']}

## Description
{blueprint['description']}

## Sitemap

| Path | Name | Description |
|------|------|-------------|
"""
    for page in blueprint['sitemap']['pages']:
        md += f"| {page['path']} | {page['name']} | {page['description']} |\n"
    
    md += """
## Tech Stack

"""
    md += f"**Frontend:** {blueprint['tech_stack']['frontend']['framework']} with {blueprint['tech_stack']['frontend']['styling']}\n\n"
    md += f"**Backend:** {blueprint['tech_stack']['backend']['framework']} ({blueprint['tech_stack']['backend']['language']})\n\n"
    md += f"**Database:** {blueprint['tech_stack']['database']['primary']}\n\n"
    md += f"**Hosting:** {blueprint['tech_stack']['hosting']['provider']}\n"
    
    md += """
## Components

"""
    for comp in blueprint['components']['components']:
        md += f"### {comp['name']}\n"
        md += f"Props: {', '.join(comp['props'])}\n\n"
    
    md += """
## Database Schema

"""
    for table in blueprint['database_schema']['tables']:
        md += f"### {table['name']}\n\n"
        md += "| Column | Type | Key |\n|--------|------|-----|\n"
        for col in table['columns']:
            key = "PK" if col.get("primary_key") else "FK" if col.get("foreign_key") else ""
            md += f"| {col['name']} | {col['type']} | {key} |\n"
        md += "\n"
    
    md += """
## UI Recommendations

"""
    md += f"- Design Patterns: {', '.join(blueprint['ui_recommendations']['design_patterns'])}\n"
    md += f"- Color Scheme: {blueprint['ui_recommendations']['color_scheme']}\n"
    md += f"- Typography: {blueprint['ui_recommendations']['typography']}\n"
    md += f"- UI Library: {blueprint['ui_recommendations']['ui_library']}\n"
    
    return md

def _export_yaml(blueprint: dict) -> str:
    import yaml
    return yaml.dump(blueprint, default_flow_style=False)