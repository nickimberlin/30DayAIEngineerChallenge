import logging
import json

logger = logging.getLogger("wireframe_service")

class WireframeService:
    def __init__(self):
        self.generated_files = {}

    def generate_wireframe(self, blueprint: dict) -> dict:
        logger.info("Generating wireframe for blueprint: " + blueprint.get('id', 'unknown'))
        
        files = {}
        
        project_name = blueprint.get("project_name", "my-app").replace(" ", "-").lower()
        
        files["package.json"] = self._generate_package_json(project_name)
        files["tailwind.config.js"] = self._generate_tailwind_config()
        files["postcss.config.js"] = self._generate_postcss_config()
        files["src/index.css"] = self._generate_index_css()
        files["src/App.jsx"] = self._generate_app_jsx(blueprint)
        files["src/main.jsx"] = self._generate_main_jsx()
        
        sitemap = blueprint.get("sitemap", {})
        pages = sitemap.get("pages", [])
        for page in pages:
            page_name = page.get("name", "Page")
            slug = self._slugify(page_name)
            files["src/pages/" + slug + ".jsx"] = self._generate_page(page_name, page.get("description", ""))
        
        components = blueprint.get("components", {}).get("components", [])
        for comp in components:
            comp_name = comp.get("name", "Component")
            files["src/components/" + comp_name + ".jsx"] = self._generate_component(comp_name, comp.get("props", []))
        
        logger.info("Generated " + str(len(files)) + " files")
        return {"files": files, "file_count": len(files)}

    def _slugify(self, text: str) -> str:
        return text.lower().replace(" ", "-")

    def _generate_package_json(self, project_name: str) -> str:
        return '''{
  "name": "''' + project_name + '''",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0",
    "lucide-react": "^0.427.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.0",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "eslint": "^9.9.0",
    "eslint-plugin-react": "^7.35.0",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.9",
    "globals": "^15.9.0",
    "postcss": "^8.4.40",
    "tailwindcss": "^3.4.7",
    "vite": "^5.4.1"
  }
}'''

    def _generate_tailwind_config(self) -> str:
        return '''/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#10b981',
      },
    },
  },
  plugins: [],
}'''

    def _generate_postcss_config(self) -> str:
        return '''export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}'''

    def _generate_index_css(self) -> str:
        return '''@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f9fafb;
  color: #111827;
}'''

    def _generate_main_jsx(self) -> str:
        return '''import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)'''

    def _generate_app_jsx(self, blueprint: dict) -> str:
        project_name = blueprint.get('project_name', 'My App')
        pages = blueprint.get("sitemap", {}).get("pages", [])
        
        import_lines = []
        link_lines = []
        route_lines = []
        
        for page in pages:
            name = page.get("name", "Page")
            path = page.get("path", "/")
            slug = self._slugify(name)
            import_lines.append("import " + name + " from './pages/" + slug + ".jsx'")
            link_lines.append('                <Link to="' + path + '" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">' + name + '</Link>')
            route_lines.append('          <Route path="' + path + '" element={<' + name + ' />} />')
        
        imports_str = "\n".join(import_lines)
        links_str = "\n".join(link_lines)
        routes_str = "\n".join(route_lines)
        
        return '''import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
''' + imports_str + '''

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <Link to="/" className="text-xl font-bold text-gray-900">
                  ''' + project_name + '''
                </Link>
              </div>
              <div className="flex space-x-4">
                ''' + links_str + '''
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
                ''' + routes_str + '''
          </Routes>
        </main>
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-gray-500 text-sm">
              Generated from AI Website Blueprint
            </p>
          </div>
        </footer>
      </div>
    </Router>
  )
}'''

    def _generate_page(self, page_name: str, page_desc: str) -> str:
        if page_name.lower() == "home":
            return '''import React from 'react'
import Hero from '../components/Hero'

export default function ''' + page_name + '''() {
  return (
    <div className="space-y-12">
      <Hero
        title="Welcome"
        subtitle="Your description here"
        ctaText="Get Started"
        onCtaClick={() => console.log('CTA clicked')}
      />
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
            <p className="text-gray-600">Simple and intuitive interface</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold mb-2">Fast Performance</h3>
            <p className="text-gray-600">Built for speed and efficiency</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold mb-2">Secure</h3>
            <p className="text-gray-600">Enterprise-grade security</p>
          </div>
        </div>
      </section>
    </div>
  )
}'''
        
        if "blog" in page_name.lower():
            return '''import React, { useState } from 'react'

export default function ''' + page_name + '''() {
  const [posts] = useState([
    { id: 1, title: 'Getting Started', excerpt: 'Learn how to get started with our platform', date: '2024-01-15', author: 'Admin' },
    { id: 2, title: 'Advanced Features', excerpt: 'Explore the advanced features we offer', date: '2024-01-10', author: 'Admin' },
    { id: 3, title: 'Best Practices', excerpt: 'Follow these best practices for success', date: '2024-01-05', author: 'Admin' },
  ])

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">''' + page_name + '''</h1>
      <div className="space-y-6">
        {posts.map(post => (
          <article key={post.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{post.title}</h2>
            <p className="text-gray-600 mb-4">{post.excerpt}</p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{post.date}</span>
              <span>By {post.author}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}'''
        
        if "product" in page_name.lower() or "shop" in page_name.lower():
            return '''import React, { useState } from 'react'

export default function ''' + page_name + '''() {
  const [products] = useState([
    { id: 1, name: 'Product 1', price: 29.99, description: 'High quality product' },
    { id: 2, name: 'Product 2', price: 49.99, description: 'Premium quality' },
    { id: 3, name: 'Product 3', price: 19.99, description: 'Great value' },
  ])

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">''' + page_name + '''</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">Image</span>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-primary">${product.price}</span>
                <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}'''
        
        return '''import React from 'react'

export default function ''' + page_name + '''() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">''' + page_name + '''</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <p className="text-gray-600">''' + page_desc + '''</p>
      </div>
    </div>
  )
}'''

    def _generate_component(self, name: str, props: list) -> str:
        if name == "Header":
            return '''import React from 'react'

export default function Header({ logo = "Logo", navigation = [], userMenu = null }) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-900">{logo}</span>
          </div>
          <nav className="flex space-x-4">
            {navigation.map((item, index) => (
              <a key={index} href={item.href} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                {item.label}
              </a>
            ))}
          </nav>
          {userMenu && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{userMenu}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}'''
        
        if name == "Hero":
            return '''import React from 'react'

export default function Hero({
  title = "Welcome",
  subtitle = "",
  ctaText = "Get Started",
  onCtaClick = () => {}
}) {
  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl text-gray-600 mb-8">
            {subtitle}
          </p>
        )}
        <button
          onClick={onCtaClick}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-blue-600 transition-colors"
        >
          {ctaText}
        </button>
      </div>
    </section>
  )
}'''
        
        if name == "Footer":
            return '''import React from 'react'

export default function Footer({ links = [], social = [], copyright = "2024" }) {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {links.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              {social.map((item, index) => (
                <a key={index} href={item.href} className="hover:text-white transition-colors">
                  {item.name}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm">&copy; {copyright} All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}'''
        
        if name == "Button":
            return '''import React from 'react'

export default function Button({
  label = "Button",
  variant = "primary",
  size = "md",
  disabled = false,
  onClick = () => {}
}) {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
  
  const variants = {
    primary: "bg-primary text-white hover:bg-blue-600 focus:ring-blue-500",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary"
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  }
  
  const disabledClasses = "opacity-50 cursor-not-allowed"
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? disabledClasses : ''}`}
    >
      {label}
    </button>
  )
}'''
        
        if name == "FormInput":
            return '''import React from 'react'

export default function FormInput({
  label = "",
  type = "text",
  required = false,
  error = "",
  placeholder = ""
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}'''
        
        return '''import React from 'react'

export default function ''' + name + '''() {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <p className="text-gray-600">''' + name + ''' Component</p>
    </div>
  )
}'''

wireframe_service = WireframeService()

def get_wireframe_service() -> WireframeService:
    return wireframe_service