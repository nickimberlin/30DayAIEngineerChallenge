const API_BASE = "http://localhost:8000";

export interface Blueprint {
  id: string;
  project_name: string;
  description: string;
  sitemap: { pages: Array<{ path: string; name: string; description: string }> };
  tech_stack: {
    frontend: { framework: string; styling: string; state_management: string };
    backend: { framework: string; language: string };
    database: { primary: string; cache?: string; search?: string };
    hosting: { provider: string; ci_cd: string; monitoring?: string };
  };
  components: { components: Array<{ name: string; props: string[] }> };
  database_schema: { tables: Array<{ name: string; columns: Array<{ name: string; type: string; primary_key?: boolean; foreign_key?: string }> }> };
  ui_recommendations: { design_patterns: string[]; color_scheme: string; typography: string; ui_library: string; accessibility?: string };
  created_at: string;
  react_code?: string;
}

export async function generateBlueprint(description: string, projectName?: string): Promise<Blueprint> {
  const response = await fetch(`${API_BASE}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description, project_name: projectName }),
  });
  if (!response.ok) throw new Error("Failed to generate blueprint");
  return response.json();
}

export async function listBlueprints(): Promise<Blueprint[]> {
  const response = await fetch(`${API_BASE}/api/blueprints`);
  if (!response.ok) {
    const text = await response.text();
    console.error("listBlueprints error:", response.status, text);
    throw new Error(`Failed to fetch blueprints: ${response.status} - ${text}`);
  }
  return response.json();
}

export async function getBlueprint(id: string): Promise<Blueprint> {
  const response = await fetch(`${API_BASE}/api/blueprint/${id}`);
  if (!response.ok) throw new Error("Blueprint not found");
  return response.json();
}

export async function exportBlueprint(id: string, format: "json" | "markdown" | "yaml") {
  const response = await fetch(`${API_BASE}/api/blueprint/${id}/export/${format}`);
  if (!response.ok) throw new Error("Failed to export blueprint");
  return response.json();
}

export async function checkHealth() {
  const response = await fetch(`${API_BASE}/health`);
  return response.json();
}