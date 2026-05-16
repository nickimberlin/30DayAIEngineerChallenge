import { useState } from 'react'
import { generateBlueprint, listBlueprints, getBlueprint, checkHealth, type Blueprint } from './api'

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'loading' | 'info';
}

function App() {
  const [description, setDescription] = useState('')
  const [projectName, setProjectName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null)
  const [blueprints, setBlueprints] = useState<Blueprint[]>([])
  const [health, setHealth] = useState<{ status: string; llm_loaded: boolean; llm_generation: boolean; qdrant_loaded: boolean } | null>(null)
  const [showList, setShowList] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [healthPanelOpen, setHealthPanelOpen] = useState(true)
  const [operationLog, setOperationLog] = useState<string[]>([])
  const [showVerboseLog, setShowVerboseLog] = useState(false)
  const [previewMode, setPreviewMode] = useState<'details' | 'preview' | 'code'>('details')

  const addToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).substring(7)
    setToasts(prev => [...prev, { id, message, type }])
    setOperationLog(prev => [...prev.slice(-19), `[${new Date().toLocaleTimeString()}] ${message}`])
    if (type !== 'loading') {
      setTimeout(() => removeToast(id), 4000)
    }
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const updateLoadingToast = (message: string) => {
    setToasts(prev => prev.map(t => t.type === 'loading' ? { ...t, message } : t))
  }

  const handleCheckHealth = async () => {
    const toastId = Math.random().toString(36).substring(7)
    setToasts(prev => [...prev, { id: toastId, message: 'Checking API health...', type: 'loading' }])
    try {
      const h = await checkHealth()
      setHealth(h)
      setHealthPanelOpen(true)
      const statusMsg = h.status === 'healthy' 
        ? `API is healthy - LLM: ${h.llm_loaded ? '✓' : '✗'}, Qdrant: ${h.qdrant_loaded ? '✓' : '✗'}`
        : 'API is unhealthy'
      addToast(statusMsg, h.status === 'healthy' ? 'success' : 'error')
      removeToast(toastId)
    } catch {
      setHealth({ status: 'unhealthy', llm_loaded: false, llm_generation: false, qdrant_loaded: false })
      addToast('Failed to connect to API - server may be down', 'error')
      removeToast(toastId)
    }
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const toastId = Math.random().toString(36).substring(7)
    setToasts(prev => [...prev, { id: toastId, message: 'Generating blueprint...', type: 'loading' }])
    addToast(`Starting generation for: "${projectName || 'Untitled Project'}"`, 'info')
    try {
      updateLoadingToast('Analyzing description and generating sitemap...')
      const bp = await generateBlueprint(description, projectName || undefined)
      updateLoadingToast('Determining tech stack...')
      await new Promise(r => setTimeout(r, 300))
      updateLoadingToast('Creating component list...')
      await new Promise(r => setTimeout(r, 300))
      updateLoadingToast('Designing database schema...')
      await new Promise(r => setTimeout(r, 300))
      updateLoadingToast('Finalizing UI recommendations...')
      setBlueprint(bp)
      removeToast(toastId)
      addToast(`Blueprint "${bp.project_name}" created successfully!`, 'success')
      console.log("Full API Response:", bp)
    } catch (err) {
      removeToast(toastId)
      const errMsg = err instanceof Error ? err.message : 'Failed to generate blueprint'
      setError(errMsg)
      addToast(`Error: ${errMsg}`, 'error')
    } finally {
      setLoading(false)
      setToasts(prev => prev.filter(t => t.type !== 'loading'))
    }
  }

  const handleLoadBlueprints = async () => {
    const toastId = Math.random().toString(36).substring(7)
    setToasts(prev => [...prev, { id: toastId, message: 'Loading blueprints...', type: 'loading' }])
    try {
      const list = await listBlueprints()
      setBlueprints(list)
      setShowList(true)
      removeToast(toastId)
      addToast(`Loaded ${list.length} blueprint${list.length !== 1 ? 's' : ''}`, 'success')
    } catch (err) {
      removeToast(toastId)
      setError('Failed to load blueprints')
      addToast('Failed to load blueprints', 'error')
    }
  }

  const handleSelectBlueprint = async (id: string) => {
    const toastId = Math.random().toString(36).substring(7)
    setToasts(prev => [...prev, { id: toastId, message: 'Loading blueprint...', type: 'loading' }])
    try {
      const bp = await getBlueprint(id)
      setBlueprint(bp)
      setShowList(false)
      removeToast(toastId)
      addToast(`Loaded blueprint: ${bp.project_name}`, 'success')
    } catch {
      removeToast(toastId)
      setError('Failed to load blueprint')
      addToast('Failed to load blueprint', 'error')
    }
  }

  const exportToPDF = () => {
    if (!blueprint) return
    
    const printContent = `
<!DOCTYPE html>
<html>
<head>
  <title>${blueprint.project_name} - Blueprint</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; color: #201515; }
    h1 { font-size: 32px; margin-bottom: 8px; }
    h2 { font-size: 24px; margin-top: 32px; border-bottom: 2px solid #ff4f00; padding-bottom: 8px; }
    h3 { font-size: 18px; margin-top: 24px; }
    p { color: #605d52; line-height: 1.6; }
    .meta { color: #939084; font-size: 14px; margin-bottom: 24px; }
    .section { margin: 24px 0; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .card { background: #f8f4f0; padding: 16px; border-radius: 8px; border: 1px solid #201515; }
    .card h4 { margin: 0 0 8px 0; font-size: 16px; }
    .tag { display: inline-block; background: #fffefb; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin: 2px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { text-align: left; padding: 8px; border-bottom: 1px solid #c5c0b1; }
    th { background: #f8f4f0; }
    code { background: #f8f4f0; padding: 2px 6px; border-radius: 4px; font-size: 12px; }
    .footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid #c5c0b1; text-align: center; color: #939084; font-size: 12px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <h1>${blueprint.project_name}</h1>
  <p class="meta">Created: ${new Date(blueprint.created_at).toLocaleString()}</p>
  <p>${blueprint.description}</p>
  
  <h2>Sitemap (${blueprint.sitemap.pages.length} pages)</h2>
  <div class="section">
    ${blueprint.sitemap.pages.map(page => `
      <div class="card" style="margin-bottom: 8px;">
        <code>${page.path}</code> - <strong>${page.name}</strong>
        <p>${page.description}</p>
      </div>
    `).join('')}
  </div>
  
  <h2>Tech Stack</h2>
  <div class="grid">
    <div class="card">
      <h4>Frontend</h4>
      <p>${blueprint.tech_stack.frontend.framework}</p>
      <p><small>${blueprint.tech_stack.frontend.styling}</small></p>
    </div>
    <div class="card">
      <h4>Backend</h4>
      <p>${blueprint.tech_stack.backend.framework}</p>
      <p><small>${blueprint.tech_stack.backend.language}</small></p>
    </div>
    <div class="card">
      <h4>Database</h4>
      <p>${blueprint.tech_stack.database.primary}</p>
      <p><small>Cache: ${blueprint.tech_stack.database.cache || 'N/A'}</small></p>
    </div>
    <div class="card">
      <h4>Hosting</h4>
      <p>${blueprint.tech_stack.hosting.provider}</p>
      <p><small>${blueprint.tech_stack.hosting.ci_cd}</small></p>
    </div>
  </div>
  
  <h2>Components (${blueprint.components.components.length})</h2>
  <div class="grid">
    ${blueprint.components.components.map(comp => `
      <div class="card">
        <h4>${comp.name}</h4>
        <div>${comp.props.map(prop => `<span class="tag">${prop}</span>`).join('')}</div>
      </div>
    `).join('')}
  </div>
  
  <h2>Database Schema (${blueprint.database_schema.tables.length} tables)</h2>
  ${blueprint.database_schema.tables.length === 0 ? '<p>No database required</p>' : 
    blueprint.database_schema.tables.map(table => `
      <h3>${table.name} (${table.columns.length} columns)</h3>
      <table>
        <tr><th>Column</th><th>Type</th><th>Keys</th></tr>
        ${table.columns.map(col => `
          <tr>
            <td><code>${col.name}</code></td>
            <td>${col.type}</td>
            <td>${col.primary_key ? 'PK' : ''} ${col.foreign_key ? 'FK' : ''}</td>
          </tr>
        `).join('')}
      </table>
    `).join('')
  }
  
  <h2>UI Recommendations</h2>
  <div class="grid">
    <div class="card"><h4>Design Patterns</h4>${blueprint.ui_recommendations.design_patterns.map(p => `<span class="tag">${p}</span>`).join('')}</div>
    <div class="card"><h4>Color Scheme</h4><p>${blueprint.ui_recommendations.color_scheme}</p></div>
    <div class="card"><h4>Typography</h4><p>${blueprint.ui_recommendations.typography}</p></div>
    <div class="card"><h4>UI Library</h4><p>${blueprint.ui_recommendations.ui_library}</p></div>
  </div>
  
  ${blueprint.react_code ? `
  <h2>React Code</h2>
  <pre style="background: #201515; color: #22c55e; padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 11px;">${blueprint.react_code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
  ` : ''}
  
  <div class="footer">
    Generated by Blueprint Generator
  </div>
</body>
</html>`

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.print()
      addToast('PDF exported!', 'success')
    } else {
      addToast('Could not open print window', 'error')
    }
  }

  const exampleChips = [
    "An e-commerce site for selling handmade jewelry with product listings, shopping cart, and checkout",
    "A blog platform for tech tutorials with categories, search, and newsletter signup",
    "A task management app for teams with drag-and-drop boards, assignments, and due dates",
    "A restaurant website with online reservations, menu display, and photo gallery",
    "A portfolio site for a freelance designer with case studies, contact form, and dark mode",
  ]

  const handleChipClick = (chip: string) => {
    setDescription(chip)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-canvas)' }}>
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="animate-in px-5 py-4 flex items-center gap-3 shadow-lg"
            style={{
              backgroundColor: toast.type === 'success' ? '#fef2f2' : 
                             toast.type === 'error' ? '#fef2f2' :
                             'var(--color-canvas-soft)',
              border: '1px solid var(--color-ink)',
              borderRadius: 'var(--rounded-md)',
              color: 'var(--color-ink)'
            }}
          >
            {toast.type === 'loading' && (
              <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }} />
            )}
            {toast.type === 'success' && <span className="text-xl" style={{ color: '#22c55e' }}>✓</span>}
            {toast.type === 'error' && <span className="text-xl" style={{ color: '#c64545' }}>✕</span>}
            {toast.type === 'info' && <span className="text-xl" style={{ color: 'var(--color-primary)' }}>ℹ</span>}
            <span className="text-base flex-1" style={{ color: 'var(--color-body)' }}>{toast.message}</span>
            <button 
              onClick={() => removeToast(toast.id)}
              className="text-sm cursor-pointer p-1"
              style={{ color: 'var(--color-mute)' }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40" style={{ backgroundColor: 'var(--color-canvas)', borderBottom: '1px solid var(--color-ink)' }}>
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center rounded-md" style={{ backgroundColor: 'var(--color-primary)' }}>
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <h1 className="text-xl font-semibold" style={{ color: 'var(--color-ink)' }}>Blueprint Generator</h1>
          </div>
          <div className="flex items-center gap-4">
            {!healthPanelOpen && health && (
              <button 
                onClick={() => setHealthPanelOpen(true)}
                className="text-xs flex items-center gap-1 cursor-pointer px-2 py-1 rounded-pill"
                style={{ backgroundColor: health.status === 'healthy' ? '#dcfce7' : '#fef2f2', color: health.status === 'healthy' ? '#16a34a' : '#dc2626' }}
              >
                ● {health.status}
              </button>
            )}
            <button 
              onClick={handleCheckHealth}
              className="text-sm cursor-pointer"
              style={{ color: 'var(--color-body)' }}
            >
              Health
            </button>
            <button 
              onClick={handleLoadBlueprints}
              className="px-5 py-2.5 text-base font-semibold cursor-pointer transition-all hover:opacity-90"
              style={{ 
                backgroundColor: 'var(--color-primary)', 
                color: 'var(--color-on-primary)',
                borderRadius: 'var(--rounded-md)'
              }}
            >
              My Blueprints
            </button>
          </div>
        </div>
      </header>

      {/* Health Panel */}
      {health && healthPanelOpen && (
        <div className="px-6 py-3 text-sm flex items-center justify-between" style={{ backgroundColor: 'var(--color-canvas-soft)', borderBottom: '1px solid var(--color-ink)', color: 'var(--color-body)' }}>
          <div className="flex items-center gap-6">
            <span>API Status: <span style={{ color: health.status === 'healthy' ? '#22c55e' : '#c64545', fontWeight: 600 }}>{health.status}</span></span>
            <span style={{ color: 'var(--color-mute)' }}>|</span>
            <span>LLM Embeddings: <span style={{ color: health.status === 'healthy' ? '#22c55e' : 'var(--color-mute)' }}>{health.llm_loaded ? '✓' : '✗'}</span></span>
            <span>LLM Generation: <span style={{ color: health.status === 'healthy' ? '#22c55e' : 'var(--color-mute)' }}>{health.llm_generation ? '✓' : '✗'}</span></span>
            <span>Qdrant: <span style={{ color: health.status === 'healthy' ? '#22c55e' : 'var(--color-mute)' }}>{health.qdrant_loaded ? '✓' : '✗'}</span></span>
          </div>
          <button 
            onClick={() => setHealthPanelOpen(false)}
            className="text-xs cursor-pointer px-2 py-1 rounded-sm"
            style={{ color: 'var(--color-mute)' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        {!blueprint && !showList ? (
          <div className="max-w-3xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-pill mb-6" style={{ backgroundColor: 'var(--color-canvas-soft)', color: 'var(--color-primary)' }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }}></span>
                <span className="text-sm font-medium">AI-Powered</span>
              </div>
              <h2 className="mb-6" style={{ 
                fontSize: '56px',
                fontWeight: 500,
                lineHeight: '1.1',
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-display)'
              }}>
                Build websites<br />
                <span style={{ color: 'var(--color-primary)' }}>faster than ever</span>
              </h2>
              <p className="text-xl" style={{ color: 'var(--color-body)', maxWidth: '540px', margin: '0 auto' }}>
                Describe your website idea and get a complete project blueprint with tech stack, sitemap, components, and database schema.
              </p>
            </div>

            {/* Form */}
            <div className="p-8" style={{ backgroundColor: 'var(--color-canvas-soft)', border: '1px solid var(--color-ink)', borderRadius: 'var(--rounded-md)' }}>
              <form onSubmit={handleGenerate} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-ink)' }}>Project Name (optional)</label>
                  <input
                    type="text"
                    placeholder="My Awesome Website"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full px-4 py-3 border text-lg"
                    style={{ 
                      backgroundColor: 'var(--color-canvas)', 
                      borderColor: 'var(--color-ink)', 
                      color: 'var(--color-ink)',
                      borderRadius: 'var(--rounded-sm)'
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-ink)' }}>What do you want to build?</label>
                  <textarea
                    placeholder="Describe your website idea in detail..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
                    minLength={10}
                    className="w-full px-4 py-3 border text-lg resize-none"
                    style={{ 
                      backgroundColor: 'var(--color-canvas)', 
                      borderColor: 'var(--color-ink)', 
                      color: 'var(--color-ink)',
                      borderRadius: 'var(--rounded-sm)'
                    }}
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm" style={{ color: 'var(--color-body-mid)' }}>Try:</span>
                  {exampleChips.map((chip, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleChipClick(chip)}
                      className="px-3 py-1.5 text-sm cursor-pointer transition-all hover:bg-white"
                      style={{ 
                        backgroundColor: 'var(--color-canvas)', 
                        color: 'var(--color-body)',
                        borderRadius: 'var(--rounded-pill)',
                        border: '1px solid var(--color-mute)'
                      }}
                    >
                      {chip.split(' ').slice(0, 2).join(' ')}...
                    </button>
                  ))}
                </div>

                {error && <p style={{ color: '#c64545', fontSize: '14px' }}>{error}</p>}
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 text-lg font-semibold cursor-pointer transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  style={{ 
                    backgroundColor: 'var(--color-primary)', 
                    color: 'var(--color-on-primary)',
                    borderRadius: 'var(--rounded-md)'
                  }}
                >
                  {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {loading ? 'Generating Blueprint...' : 'Generate Blueprint'}
                </button>
              </form>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-6 mt-16">
              {[
                { icon: '📁', title: 'Sitemap', desc: 'Complete page structure' },
                { icon: '⚛️', title: 'Tech Stack', desc: 'Framework & tools' },
                { icon: '🗃️', title: 'Database', desc: 'Schema & tables' },
              ].map((item, i) => (
                <div key={i} className="text-center p-6" style={{ backgroundColor: 'var(--color-canvas-soft)', borderRadius: 'var(--rounded-md)' }}>
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-semibold mb-1" style={{ color: 'var(--color-ink)' }}>{item.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--color-body)' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : showList ? (
          <div>
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-4xl mb-2" style={{ 
                  fontWeight: 500,
                  color: 'var(--color-ink)',
                  fontFamily: 'var(--font-display)'
                }}>
                  My Blueprints
                </h2>
                <p style={{ color: 'var(--color-body)' }}>{blueprints.length} project{blueprints.length !== 1 ? 's' : ''}</p>
              </div>
              <button 
                onClick={() => setShowList(false)}
                className="px-5 py-2.5 text-base font-semibold cursor-pointer transition-all hover:opacity-80"
                style={{ 
                  backgroundColor: 'var(--color-ink)', 
                  color: 'var(--color-on-primary)',
                  borderRadius: 'var(--rounded-md)'
                }}
              >
                ← Back
              </button>
            </div>
            {blueprints.length === 0 ? (
              <div className="text-center py-16" style={{ backgroundColor: 'var(--color-canvas-soft)', borderRadius: 'var(--rounded-md)' }}>
                <div className="text-5xl mb-4">📋</div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-ink)' }}>No blueprints yet</h3>
                <p className="mb-6" style={{ color: 'var(--color-body)' }}>Create your first blueprint to get started!</p>
                <button 
                  onClick={() => { setShowList(false); }}
                  className="px-6 py-3 text-base font-semibold cursor-pointer"
                  style={{ 
                    backgroundColor: 'var(--color-primary)', 
                    color: 'var(--color-on-primary)',
                    borderRadius: 'var(--rounded-md)'
                  }}
                >
                  Create Blueprint
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blueprints.map((bp) => (
                  <button
                    key={bp.id}
                    onClick={() => handleSelectBlueprint(bp.id)}
                    className="text-left p-6 cursor-pointer transition-all hover:translate-y-[-2px]"
                    style={{ 
                      backgroundColor: 'var(--color-canvas-soft)', 
                      border: '1px solid var(--color-ink)',
                      borderRadius: 'var(--rounded-md)'
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 flex items-center justify-center rounded-md" style={{ backgroundColor: 'var(--color-primary)' }}>
                        <span className="text-white font-bold">{bp.project_name.charAt(0).toUpperCase()}</span>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-pill" style={{ backgroundColor: 'var(--color-canvas)', color: 'var(--color-body-mid)' }}>
                        {bp.sitemap.pages.length} pages
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-ink)' }}>{bp.project_name}</h3>
                    <p className="text-sm line-clamp-2 mb-4" style={{ color: 'var(--color-body)' }}>{bp.description}</p>
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-mute)' }}>
                      <span>{new Date(bp.created_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{bp.tech_stack.frontend.framework}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : blueprint ? (
          <div>
            {/* Blueprint Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 flex items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--color-primary)' }}>
                  <span className="text-white font-bold text-2xl">{blueprint.project_name.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <h2 className="text-3xl" style={{ 
                    fontWeight: 500,
                    color: 'var(--color-ink)',
                    fontFamily: 'var(--font-display)'
                  }}>
                    {blueprint.project_name}
                  </h2>
                  <p style={{ color: 'var(--color-body)' }}>{blueprint.description}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex" style={{ backgroundColor: 'var(--color-canvas-soft)', borderRadius: 'var(--rounded-md)', padding: '4px' }}>
                  <button 
                    onClick={() => setPreviewMode('details')}
                    className="px-4 py-2 text-sm cursor-pointer transition-all"
                    style={{ 
                      backgroundColor: previewMode === 'details' ? 'var(--color-ink)' : 'transparent',
                      color: previewMode === 'details' ? 'var(--color-on-primary)' : 'var(--color-body)',
                      borderRadius: 'var(--rounded-sm)'
                    }}
                  >
                    Details
                  </button>
                  <button 
                    onClick={() => setPreviewMode('preview')}
                    className="px-4 py-2 text-sm cursor-pointer transition-all"
                    style={{ 
                      backgroundColor: previewMode === 'preview' ? 'var(--color-ink)' : 'transparent',
                      color: previewMode === 'preview' ? 'var(--color-on-primary)' : 'var(--color-body)',
                      borderRadius: 'var(--rounded-sm)'
                    }}
                  >
                    Preview
                  </button>
                  <button 
                    onClick={() => setPreviewMode('code')}
                    className="px-4 py-2 text-sm cursor-pointer transition-all"
                    style={{ 
                      backgroundColor: previewMode === 'code' ? 'var(--color-ink)' : 'transparent',
                      color: previewMode === 'code' ? 'var(--color-on-primary)' : 'var(--color-body)',
                      borderRadius: 'var(--rounded-sm)'
                    }}
                  >
                    Code
                  </button>
                </div>
                <button 
                  onClick={() => exportToPDF()}
                  className="px-4 py-2.5 text-sm cursor-pointer transition-all hover:opacity-80"
                  style={{ 
                    backgroundColor: 'var(--color-canvas)', 
                    border: '1px solid var(--color-ink)', 
                    color: 'var(--color-ink)',
                    borderRadius: 'var(--rounded-md)'
                  }}
                >
                  📄 Export PDF
                </button>
                <button 
                  onClick={() => { 
                    setBlueprint(null); 
                    setDescription(''); 
                    setProjectName(''); 
                    setPreviewMode('details');
                    addToast('Ready for new blueprint', 'info')
                  }}
                  className="px-5 py-2.5 text-base font-semibold cursor-pointer transition-all hover:opacity-80"
                  style={{ 
                    backgroundColor: 'var(--color-ink)', 
                    color: 'var(--color-on-primary)',
                    borderRadius: 'var(--rounded-md)'
                  }}
                >
                  ← New
                </button>
              </div>
            </div>

            {/* Details View */}
            {previewMode === 'details' && (
            <div>
              <div className="flex items-center gap-8 mb-10 p-4" style={{ backgroundColor: 'var(--color-ink)', borderRadius: 'var(--rounded-md)' }}>
                {[
                  { label: 'Pages', value: blueprint.sitemap.pages.length, icon: '📄' },
                  { label: 'Components', value: blueprint.components.components.length, icon: '🧩' },
                  { label: 'Database Tables', value: blueprint.database_schema.tables.length, icon: '🗃️' },
                  { label: 'Frontend', value: blueprint.tech_stack.frontend.framework, icon: '⚛️' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span style={{ color: 'var(--color-on-primary)' }}>{item.label}:</span>
                    <span className="font-semibold" style={{ color: 'var(--color-on-primary)' }}>{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-6">
              {/* Sitemap */}
              <section className="p-6" style={{ backgroundColor: 'var(--color-canvas-soft)', borderRadius: 'var(--rounded-md)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">📁</span>
                  <h3 className="text-xl font-semibold" style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-display)' }}>Sitemap</h3>
                </div>
                <p className="text-sm mb-4" style={{ color: 'var(--color-body)' }}>{blueprint.sitemap.pages.length} pages</p>
                <div className="space-y-2">
                  {blueprint.sitemap.pages.map((page, i) => (
                    <div key={i} className="p-3" style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-sm)' }}>
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--color-canvas-soft)', color: 'var(--color-primary)' }}>{page.path}</code>
                        <span className="font-semibold text-sm" style={{ color: 'var(--color-ink)' }}>{page.name}</span>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--color-body)' }}>{page.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Tech Stack */}
              <section className="p-6" style={{ backgroundColor: 'var(--color-canvas-soft)', borderRadius: 'var(--rounded-md)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">⚙️</span>
                  <h3 className="text-xl font-semibold" style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-display)' }}>Tech Stack</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Frontend', value: blueprint.tech_stack.frontend.framework, sub: blueprint.tech_stack.frontend.styling },
                    { label: 'Backend', value: blueprint.tech_stack.backend.framework, sub: blueprint.tech_stack.backend.language },
                    { label: 'Database', value: blueprint.tech_stack.database.primary, sub: blueprint.tech_stack.database.cache },
                    { label: 'Hosting', value: blueprint.tech_stack.hosting.provider, sub: blueprint.tech_stack.hosting.ci_cd },
                  ].map((item, i) => (
                    <div key={i} className="p-3" style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-sm)' }}>
                      <p className="text-xs mb-1" style={{ color: 'var(--color-body-mid)' }}>{item.label}</p>
                      <p className="font-semibold text-sm" style={{ color: 'var(--color-ink)' }}>{item.value}</p>
                      <p className="text-xs" style={{ color: 'var(--color-body)' }}>{item.sub}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Components */}
              <section className="p-6" style={{ backgroundColor: 'var(--color-canvas-soft)', borderRadius: 'var(--rounded-md)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🧩</span>
                  <h3 className="text-xl font-semibold" style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-display)' }}>Components</h3>
                </div>
                <p className="text-sm mb-4" style={{ color: 'var(--color-body)' }}>{blueprint.components.components.length} components</p>
                <div className="grid grid-cols-2 gap-2">
                  {blueprint.components.components.map((comp, i) => (
                    <div key={i} className="p-3" style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-sm)' }}>
                      <h4 className="font-semibold text-sm mb-2" style={{ color: 'var(--color-ink)' }}>{comp.name}</h4>
                      <div className="flex flex-wrap gap-1">
                        {comp.props.slice(0, 3).map((prop, j) => (
                          <span key={j} className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--color-canvas-soft)', color: 'var(--color-body)' }}>{prop}</span>
                        ))}
                        {comp.props.length > 3 && <span className="text-xs" style={{ color: 'var(--color-mute)' }}>+{comp.props.length - 3}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Database Schema */}
              <section className="p-6" style={{ backgroundColor: 'var(--color-canvas-soft)', borderRadius: 'var(--rounded-md)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🗃️</span>
                  <h3 className="text-xl font-semibold" style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-display)' }}>Database</h3>
                </div>
                <p className="text-sm mb-4" style={{ color: 'var(--color-body)' }}>{blueprint.database_schema.tables.length} tables</p>
                {blueprint.database_schema.tables.length === 0 ? (
                  <p style={{ color: 'var(--color-body)' }}>No database required</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {blueprint.database_schema.tables.map((table, i) => (
                      <div key={i} className="p-2" style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-sm)' }}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm" style={{ color: 'var(--color-ink)' }}>{table.name}</span>
                          <span className="text-xs" style={{ color: 'var(--color-mute)' }}>({table.columns.length})</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {table.columns.slice(0, 4).map((col, j) => (
                            <span key={j} className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--color-canvas-soft)', color: 'var(--color-body-mid)' }}>
                              {col.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* UI Recommendations */}
              <section className="col-span-2 p-6" style={{ backgroundColor: 'var(--color-canvas-soft)', borderRadius: 'var(--rounded-md)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🎨</span>
                  <h3 className="text-xl font-semibold" style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-display)' }}>UI Recommendations</h3>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: 'Design', value: blueprint.ui_recommendations.design_patterns[0] },
                    { label: 'Color', value: blueprint.ui_recommendations.color_scheme },
                    { label: 'Typography', value: blueprint.ui_recommendations.typography },
                    { label: 'UI Library', value: blueprint.ui_recommendations.ui_library },
                  ].map((item, i) => (
                    <div key={i} className="p-4 text-center" style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-sm)' }}>
                      <p className="text-xs mb-1" style={{ color: 'var(--color-body-mid)' }}>{item.label}</p>
                      <p className="font-semibold text-sm" style={{ color: 'var(--color-ink)' }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </section>
              </div>
            </div>
            )}

            {/* Code View */}
            {previewMode === 'code' && (
              <div className="p-6" style={{ backgroundColor: 'var(--color-ink)', borderRadius: 'var(--rounded-md)' }}>
                <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-on-primary)', fontFamily: 'var(--font-display)' }}>React Wireframe Code</h3>
                {blueprint.react_code ? (
                  <pre className="text-xs overflow-x-auto whitespace-pre-wrap max-h-[500px]" style={{ color: '#22c55e', fontFamily: 'var(--font-mono)' }}>
                    {blueprint.react_code}
                  </pre>
                ) : (
                  <p style={{ color: 'var(--color-on-dark-soft)' }}>No React code generated. Create a new blueprint to generate code.</p>
                )}
              </div>
            )}

            {/* Simple Wireframe Preview */}
            {previewMode === 'preview' && (
              <div className="border" style={{ borderColor: 'var(--color-ink)', borderRadius: 'var(--rounded-md)', overflow: 'hidden' }}>
                {/* Preview Header */}
                <div className="flex items-center gap-3 p-4" style={{ backgroundColor: 'var(--color-ink)' }}>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ef4444' }}></div>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#eab308' }}></div>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#22c55e' }}></div>
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-sm px-4 py-1" style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-sm)', color: 'var(--color-body)' }}>
                      {blueprint.project_name}.app
                    </span>
                  </div>
                </div>
                
                {/* Preview Content */}
                <div style={{ minHeight: '500px', backgroundColor: 'var(--color-canvas)' }}>
                  {/* Navigation */}
                  <div className="flex items-center justify-between p-4" style={{ backgroundColor: 'var(--color-ink)', color: 'var(--color-on-primary)' }}>
                    <span className="font-semibold" style={{ fontSize: '18px' }}>{blueprint.project_name}</span>
                    <div className="flex gap-4">
                      {blueprint.sitemap.pages.slice(0, 4).map((page, i) => (
                        <span key={i} className="text-sm opacity-80">{page.name}</span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Hero Section */}
                  <div className="text-center py-16" style={{ backgroundColor: 'var(--color-canvas-soft)' }}>
                    <h1 className="text-4xl font-semibold mb-4" style={{ color: 'var(--color-ink)' }}>Welcome to {blueprint.project_name}</h1>
                    <p className="text-lg mb-6" style={{ color: 'var(--color-body)' }}>{blueprint.description.slice(0, 100)}...</p>
                    <button className="px-6 py-3 text-white font-semibold" style={{ backgroundColor: 'var(--color-primary)', borderRadius: 'var(--rounded-md)' }}>
                      Get Started
                    </button>
                  </div>
                  
                  {/* Features Grid */}
                  <div className="p-8">
                    <h2 className="text-2xl font-semibold mb-6 text-center" style={{ color: 'var(--color-ink)' }}>Features</h2>
                    <div className="grid grid-cols-3 gap-6">
                      {blueprint.components.components.slice(0, 3).map((comp, i) => (
                        <div key={i} className="p-6" style={{ backgroundColor: 'var(--color-canvas-soft)', border: '1px solid var(--color-ink)', borderRadius: 'var(--rounded-md)' }}>
                          <h3 className="font-semibold mb-2" style={{ color: 'var(--color-ink)' }}>{comp.name}</h3>
                          <div className="flex flex-wrap gap-1">
                            {comp.props.slice(0, 3).map((prop, j) => (
                              <span key={j} className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'var(--color-canvas)', color: 'var(--color-body)' }}>{prop}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="text-center py-8" style={{ backgroundColor: 'var(--color-ink)', color: 'var(--color-canvas-soft)' }}>
                    <p>© 2024 {blueprint.project_name}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </main>

      {/* Operation Log */}
      {operationLog.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 mb-8">
          <button 
            onClick={() => setShowVerboseLog(!showVerboseLog)}
            className="text-sm flex items-center gap-2 mb-2 cursor-pointer"
            style={{ color: 'var(--color-body)' }}
          >
            <span>{showVerboseLog ? '▼' : '▶'}</span>
            Operation Log ({operationLog.length})
          </button>
          {showVerboseLog && (
            <div className="p-4 max-h-48 overflow-y-auto" style={{ backgroundColor: 'var(--color-ink)', borderRadius: 'var(--rounded-md)' }}>
              <pre className="text-xs whitespace-pre-wrap" style={{ color: '#22c55e', fontFamily: 'var(--font-mono)' }}>
                {operationLog.join('\n')}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="py-8 mt-12" style={{ backgroundColor: 'var(--color-ink)' }}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-6 flex items-center justify-center rounded" style={{ backgroundColor: 'var(--color-primary)' }}>
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-base font-semibold" style={{ color: 'var(--color-on-primary)' }}>Blueprint Generator</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--color-canvas-soft)' }}>AI-powered website blueprint generator</p>
        </div>
      </footer>
    </div>
  )
}

export default App