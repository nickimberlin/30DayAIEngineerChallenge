import os
import sys
import json
import logging
from typing import Optional, Any, Dict
from sentence_transformers import SentenceTransformer
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
    datefmt='%H:%M:%S'
)
logger = logging.getLogger("llm_service")

def print_error(msg: str):
    logger.error(msg)
    print(f"\033[91mERROR: {msg}\033[0m", file=sys.stderr)

def print_success(msg: str):
    logger.info(msg)
    print(f"\033[92m{msg}\033[0m")

def print_warning(msg: str):
    logger.warning(msg)
    print(f"\033[93mWARNING: {msg}\033[0m")

class LLMService:
    def __init__(self):
        self.embedding_model_name = "sentence-transformers/all-MiniLM-L6-v2"
        self.generation_model_name = "Qwen/Qwen2.5-0.5B-Instruct"
        self.embedding_model: Optional[Any] = None
        self.generation_model: Optional[Any] = None
        self.tokenizer: Optional[Any] = None
        self._embedding_loaded = False
        self._generation_loaded = False
    
    async def load(self):
        if not self._embedding_loaded:
            try:
                self.embedding_model = SentenceTransformer(self.embedding_model_name)
                self._embedding_loaded = True
                print_success("Embedding model loaded successfully")
            except Exception as e:
                print_error(f"Failed to load embedding model: {e}")
                self._embedding_loaded = False
    
    async def load_generation_model(self):
        if not self._generation_loaded:
            print("Loading generation model...", end=" ", flush=True)
            try:
                self.tokenizer = AutoTokenizer.from_pretrained(
                    self.generation_model_name,
                    trust_remote_code=True
                )
                self.generation_model = AutoModelForCausalLM.from_pretrained(
                    self.generation_model_name,
                    dtype=torch.float32,
                    trust_remote_code=True
                )
                self.generation_model.eval()
                self._generation_loaded = True
                print_success("Generation model loaded successfully")
            except Exception as e:
                print_error(f"Failed to load generation model: {e}")
                self._generation_loaded = False
    
    def generate_embedding(self, text: str) -> list[float]:
        logger.debug(f"generate_embedding: text length = {len(text)}")
        if not self._embedding_loaded:
            raise RuntimeError("Embedding model not loaded. Call load() first.")
        embedding = self.embedding_model.encode(text, convert_to_numpy=True)
        logger.debug(f"generate_embedding: output shape = {embedding.shape}")
        return embedding.tolist()
    
    def generate_blueprint(self, description: str) -> Dict:
        logger.info(f"generate_blueprint: processing description (length={len(description)})")
        if not self._generation_loaded:
            logger.warning("generate_blueprint: generation model not loaded")
            return None
        
        try:
            messages = [
                {"role": "system", "content": "You are an expert web architect. Generate a detailed website blueprint in JSON format based on the description. Respond ONLY with valid JSON, no other text."},
                {"role": "user", "content": f"Generate a complete website blueprint for: {description}\n\nRespond with this exact JSON structure:\n{{\"sitemap\": {{\"pages\": [{{\"path\": \"/\", \"name\": \"Home\", \"description\": \"...\"}}]}}, \"tech_stack\": {{...}}, \"components\": {{...}}, \"database_schema\": {{...}}, \"ui_recommendations\": {{...}}}}"}
            ]
            
            text = self.tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
            inputs = self.tokenizer(text, return_tensors="pt")
            logger.debug(f"generate_blueprint: input tokens = {inputs.input_ids.shape[1]}")
            
            with torch.no_grad():
                outputs = self.generation_model.generate(
                    **inputs,
                    max_new_tokens=512,
                    temperature=0.7,
                    do_sample=True,
                    pad_token_id=self.tokenizer.eos_token_id,
                )
            
            response = self.tokenizer.decode(outputs[0][len(inputs.input_ids[0]):], skip_special_tokens=True)
            logger.debug(f"generate_blueprint: response length = {len(response)}")
            
            result = self._parse_json_response(response)
            if result:
                logger.info("generate_blueprint: SUCCESS (LLM)")
                print_success("Generated blueprint using LLM")
                return result
            else:
                logger.warning("generate_blueprint: LLM returned invalid JSON")
        except Exception as e:
            logger.error(f"generate_blueprint: LLM generation failed: {e}")
            print_warning(f"LLM generation failed: {e}")
        
        logger.info("generate_blueprint: using fallback")
        return self._fallback_blueprint(description)
    
    def _parse_json_response(self, response: str) -> Optional[Dict]:
        try:
            start_idx = response.find('{')
            if start_idx == -1:
                return None
            
            brace_count = 0
            for i in range(start_idx, len(response)):
                if response[i] == '{':
                    brace_count += 1
                elif response[i] == '}':
                    brace_count -= 1
                    if brace_count == 0:
                        json_str = response[start_idx:i+1]
                        return json.loads(json_str)
        except:
            pass
        return None
    
    def _fallback_blueprint(self, description: str) -> Dict:
        desc_lower = description.lower()
        
        if any(w in desc_lower for w in ["blog", "news", "article", "post"]):
            website_type = "blog"
        elif any(w in desc_lower for w in ["shop", "store", "product", "e-commerce", "buy", "sell"]):
            website_type = "ecommerce"
        elif any(w in desc_lower for w in ["portfolio", "design", "creative", "photographer"]):
            website_type = "portfolio"
        elif any(w in desc_lower for w in ["restaurant", "food", "menu"]):
            website_type = "restaurant"
        elif any(w in desc_lower for w in ["task", "project", "team", "manage"]):
            website_type = "saas"
        else:
            website_type = "generic"
        
        return self._get_contextual_blueprint(description, website_type)
    
    def _get_contextual_blueprint(self, description: str, website_type: str) -> Dict:
        blueprints = {
            "blog": {
                "sitemap": {"pages": [
                    {"path": "/", "name": "Home", "description": "Latest articles and featured posts"},
                    {"path": "/blog", "name": "Blog", "description": "All blog posts with filtering"},
                    {"path": "/blog/{slug}", "name": "Post", "description": "Individual blog post"},
                    {"path": "/categories", "name": "Categories", "description": "Browse by category"},
                    {"path": "/about", "name": "About", "description": "About the author"},
                    {"path": "/contact", "name": "Contact", "description": "Contact form"},
                ]},
                "tech_stack": {"frontend": {"framework": "Next.js", "styling": "Tailwind CSS", "state_management": "Zustand"}, "backend": {"framework": "Next.js API", "language": "TypeScript"}, "database": {"primary": "PostgreSQL", "cache": "Redis", "search": "Algolia"}, "hosting": {"provider": "Vercel", "ci_cd": "GitHub Actions"}},
                "components": {"components": [
                    {"name": "Header", "props": ["logo", "navigation", "search", "themeToggle"]},
                    {"name": "Hero", "props": ["title", "subtitle", "featuredPost"]},
                    {"name": "PostCard", "props": ["title", "excerpt", "coverImage", "author", "date", "category"]},
                    {"name": "PostGrid", "props": ["posts", "columns"]},
                    {"name": "Newsletter", "props": ["title", "description", "subscribeForm"]},
                    {"name": "Footer", "props": ["links", "social", "copyright"]},
                ]},
                "database_schema": {"tables": [
                    {"name": "users", "columns": [{"name": "id", "type": "UUID", "primary_key": True}, {"name": "email", "type": "VARCHAR(255)", "primary_key": False}, {"name": "name", "type": "VARCHAR(255)", "primary_key": False}]},
                    {"name": "posts", "columns": [{"name": "id", "type": "UUID", "primary_key": True}, {"name": "title", "type": "VARCHAR(500)", "primary_key": False}, {"name": "slug", "type": "VARCHAR(255)", "primary_key": False}, {"name": "content", "type": "TEXT", "primary_key": False}, {"name": "excerpt", "type": "TEXT", "primary_key": False}]},
                    {"name": "categories", "columns": [{"name": "id", "type": "UUID", "primary_key": True}, {"name": "name", "type": "VARCHAR(100)", "primary_key": False}, {"name": "slug", "type": "VARCHAR(100)", "primary_key": False}]},
                ]},
                "ui_recommendations": {"design_patterns": ["clean_reading_layout", "typography_focused", "card_grid"], "color_scheme": "minimal_light", "typography": "serif_body", "ui_library": "shadcn/ui"}
            },
            "ecommerce": {
                "sitemap": {"pages": [
                    {"path": "/", "name": "Home", "description": "Featured products and promotions"},
                    {"path": "/products", "name": "Products", "description": "Product catalog with filters"},
                    {"path": "/products/{id}", "name": "Product", "description": "Product details page"},
                    {"path": "/cart", "name": "Cart", "description": "Shopping cart"},
                    {"path": "/checkout", "name": "Checkout", "description": "Order placement"},
                    {"path": "/account", "name": "Account", "description": "User account and orders"},
                ]},
                "tech_stack": {"frontend": {"framework": "React", "styling": "Tailwind CSS", "state_management": "Zustand"}, "backend": {"framework": "FastAPI", "language": "Python"}, "database": {"primary": "PostgreSQL", "cache": "Redis", "search": "Elasticsearch"}, "hosting": {"provider": "Vercel", "ci_cd": "GitHub Actions"}},
                "components": {"components": [
                    {"name": "Header", "props": ["logo", "navigation", "cartIcon", "userMenu"]},
                    {"name": "HeroCarousel", "props": ["slides", "autoPlay"]},
                    {"name": "ProductCard", "props": ["image", "name", "price", "rating", "addToCart"]},
                    {"name": "ProductGrid", "props": ["products", "columns", "filters"]},
                    {"name": "ProductGallery", "props": ["images", "selectedIndex"]},
                    {"name": "CartDrawer", "props": ["items", "total", "checkout"]},
                ]},
                "database_schema": {"tables": [
                    {"name": "users", "columns": [{"name": "id", "type": "UUID", "primary_key": True}, {"name": "email", "type": "VARCHAR(255)", "primary_key": False}, {"name": "password_hash", "type": "VARCHAR(255)", "primary_key": False}]},
                    {"name": "products", "columns": [{"name": "id", "type": "UUID", "primary_key": True}, {"name": "name", "type": "VARCHAR(255)", "primary_key": False}, {"name": "description", "type": "TEXT", "primary_key": False}, {"name": "price", "type": "DECIMAL(10,2)", "primary_key": False}, {"name": "stock", "type": "INTEGER", "primary_key": False}]},
                    {"name": "orders", "columns": [{"name": "id", "type": "UUID", "primary_key": True}, {"name": "user_id", "type": "UUID", "primary_key": False}, {"name": "total", "type": "DECIMAL(10,2)", "primary_key": False}, {"name": "status", "type": "VARCHAR(50)", "primary_key": False}]},
                    {"name": "order_items", "columns": [{"name": "id", "type": "UUID", "primary_key": True}, {"name": "order_id", "type": "UUID", "primary_key": False}, {"name": "product_id", "type": "UUID", "primary_key": False}, {"name": "quantity", "type": "INTEGER", "primary_key": False}]},
                ]},
                "ui_recommendations": {"design_patterns": ["product_grid", "quick_view", "cart_sidebar"], "color_scheme": "modern_neutral", "typography": "clean_sans", "ui_library": "shadcn/ui"}
            },
            "portfolio": {
                "sitemap": {"pages": [
                    {"path": "/", "name": "Home", "description": "Hero and featured work"},
                    {"path": "/work", "name": "Work", "description": "Project portfolio"},
                    {"path": "/work/{slug}", "name": "Project", "description": "Case study"},
                    {"path": "/about", "name": "About", "description": "About me"},
                    {"path": "/contact", "name": "Contact", "description": "Get in touch"},
                ]},
                "tech_stack": {"frontend": {"framework": "Next.js", "styling": "Tailwind CSS", "state_management": "Zustand"}, "backend": {"framework": "Not needed", "language": "Static"}, "database": {"primary": "Not needed", "cache": "None", "search": "None"}, "hosting": {"provider": "Vercel", "ci_cd": "GitHub Actions"}},
                "components": {"components": [
                    {"name": "Header", "props": ["logo", "navigation", "themeToggle"]},
                    {"name": "Hero", "props": ["tagline", "cta", "avatar"]},
                    {"name": "ProjectCard", "props": ["title", "thumbnail", "category", "link"]},
                    {"name": "ProjectGrid", "props": ["projects", "filters"]},
                    {"name": "CaseStudy", "props": ["title", "description", "images", "tags"]},
                    {"name": "ContactForm", "props": ["name", "email", "message", "submit"]},
                ]},
                "database_schema": {"tables": []},
                "ui_recommendations": {"design_patterns": ["masonry_grid", "full_bleed_images", "minimal_navigation"], "color_scheme": "dark_or_light", "typography": "editorial_sans", "ui_library": "custom"}
            },
            "restaurant": {
                "sitemap": {"pages": [
                    {"path": "/", "name": "Home", "description": "Hero and restaurant info"},
                    {"path": "/menu", "name": "Menu", "description": "Food and drink menu"},
                    {"path": "/reservations", "name": "Reservations", "description": "Book a table"},
                    {"path": "/about", "name": "About", "description": "Our story"},
                    {"path": "/contact", "name": "Contact", "description": "Location and hours"},
                ]},
                "tech_stack": {"frontend": {"framework": "Next.js", "styling": "Tailwind CSS", "state_management": "Zustand"}, "backend": {"framework": "FastAPI", "language": "Python"}, "database": {"primary": "PostgreSQL", "cache": "Redis", "search": "None"}, "hosting": {"provider": "Vercel", "ci_cd": "GitHub Actions"}},
                "components": {"components": [
                    {"name": "Header", "props": ["logo", "navigation", "reservationBtn"]},
                    {"name": "Hero", "props": ["backgroundImage", "title", "subtitle"]},
                    {"name": "MenuSection", "props": ["title", "items"]},
                    {"name": "MenuItem", "props": ["name", "description", "price", "image"]},
                    {"name": "ReservationForm", "props": ["date", "time", "partySize", "submit"]},
                    {"name": "Gallery", "props": ["images", "lightbox"]},
                ]},
                "database_schema": {"tables": [
                    {"name": "reservations", "columns": [{"name": "id", "type": "UUID", "primary_key": True}, {"name": "name", "type": "VARCHAR(255)", "primary_key": False}, {"name": "email", "type": "VARCHAR(255)", "primary_key": False}, {"name": "date", "type": "DATE", "primary_key": False}, {"name": "time", "type": "TIME", "primary_key": False}, {"name": "party_size", "type": "INTEGER", "primary_key": False}]},
                    {"name": "menu_items", "columns": [{"name": "id", "type": "UUID", "primary_key": True}, {"name": "name", "type": "VARCHAR(255)", "primary_key": False}, {"name": "description", "type": "TEXT", "primary_key": False}, {"name": "price", "type": "DECIMAL(10,2)", "primary_key": False}, {"name": "category", "type": "VARCHAR(50)", "primary_key": False}]},
                ]},
                "ui_recommendations": {"design_patterns": ["elegant_typography", "image_heavy", "warm_colors"], "color_scheme": "warm_inviting", "typography": "elegant_serif", "ui_library": "custom"}
            },
            "saas": {
                "sitemap": {"pages": [
                    {"path": "/", "name": "Home", "description": "Product overview"},
                    {"path": "/features", "name": "Features", "description": "Product features"},
                    {"path": "/pricing", "name": "Pricing", "description": "Plans and pricing"},
                    {"path": "/dashboard", "name": "Dashboard", "description": "User dashboard"},
                    {"path": "/settings", "name": "Settings", "description": "Account settings"},
                ]},
                "tech_stack": {"frontend": {"framework": "React", "styling": "Tailwind CSS", "state_management": "Zustand"}, "backend": {"framework": "FastAPI", "language": "Python"}, "database": {"primary": "PostgreSQL", "cache": "Redis", "search": "Algolia"}, "hosting": {"provider": "AWS", "ci_cd": "GitHub Actions"}},
                "components": {"components": [
                    {"name": "Header", "props": ["logo", "nav", "loginBtn", "ctaBtn"]},
                    {"name": "FeatureCard", "props": ["icon", "title", "description"]},
                    {"name": "PricingCard", "props": ["plan", "price", "features", "cta"]},
                    {"name": "Dashboard", "props": ["sidebar", "content", "header"]},
                    {"name": "DataTable", "props": ["columns", "data", "pagination"]},
                    {"name": "Modal", "props": ["title", "content", "actions"]},
                ]},
                "database_schema": {"tables": [
                    {"name": "users", "columns": [{"name": "id", "type": "UUID", "primary_key": True}, {"name": "email", "type": "VARCHAR(255)", "primary_key": False}, {"name": "name", "type": "VARCHAR(255)", "primary_key": False}, {"name": "role", "type": "VARCHAR(50)", "primary_key": False}]},
                    {"name": "teams", "columns": [{"name": "id", "type": "UUID", "primary_key": True}, {"name": "name", "type": "VARCHAR(255)", "primary_key": False}, {"name": "owner_id", "type": "UUID", "primary_key": False}]},
                    {"name": "projects", "columns": [{"name": "id", "type": "UUID", "primary_key": True}, {"name": "name", "type": "VARCHAR(255)", "primary_key": False}, {"name": "team_id", "type": "UUID", "primary_key": False}]},
                ]},
                "ui_recommendations": {"design_patterns": ["dashboard_layout", "data_visualization", "collaboration"], "color_scheme": "professional", "typography": "clean_sans", "ui_library": "shadcn/ui"}
            },
            "generic": {
                "sitemap": {"pages": [
                    {"path": "/", "name": "Home", "description": "Landing page"},
                    {"path": "/about", "name": "About", "description": "About us"},
                    {"path": "/services", "name": "Services", "description": "What we offer"},
                    {"path": "/contact", "name": "Contact", "description": "Get in touch"},
                ]},
                "tech_stack": {"frontend": {"framework": "Next.js", "styling": "Tailwind CSS", "state_management": "Zustand"}, "backend": {"framework": "Next.js API", "language": "TypeScript"}, "database": {"primary": "PostgreSQL", "cache": "Redis", "search": "None"}, "hosting": {"provider": "Vercel", "ci_cd": "GitHub Actions"}},
                "components": {"components": [
                    {"name": "Header", "props": ["logo", "navigation", "cta"]},
                    {"name": "Hero", "props": ["title", "subtitle", "cta"]},
                    {"name": "FeatureSection", "props": ["title", "features"]},
                    {"name": "ContactForm", "props": ["fields", "submit"]},
                    {"name": "Footer", "props": ["links", "social", "copyright"]},
                ]},
                "database_schema": {"tables": [
                    {"name": "users", "columns": [{"name": "id", "type": "UUID", "primary_key": True}, {"name": "email", "type": "VARCHAR(255)", "primary_key": False}, {"name": "name", "type": "VARCHAR(255)", "primary_key": False}]},
                ]},
                "ui_recommendations": {"design_patterns": ["clean_modern", "responsive", "accessibility"], "color_scheme": "neutral", "typography": "modern_sans", "ui_library": "shadcn/ui"}
            }
        }
        
        return blueprints.get(website_type, blueprints["generic"])

llm_service = LLMService()

async def get_llm_service() -> LLMService:
    await llm_service.load()
    return llm_service

async def get_llm_generation_service() -> LLMService:
    await llm_service.load()
    await llm_service.load_generation_model()
    return llm_service