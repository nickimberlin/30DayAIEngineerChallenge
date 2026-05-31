import { useState, useEffect } from "react";
import { getReadme } from "../lib/api";

export default function AboutPage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReadme()
      .then(setContent)
      .catch(() => setContent("Failed to load README."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "48px 16px", backgroundColor: "#f4f4f4", minHeight: "calc(100vh - 48px)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" as const }}>
          <p style={{ fontSize: 14, color: "#8c8c8c", letterSpacing: "0.16px" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 16px 64px", backgroundColor: "#f4f4f4", minHeight: "calc(100vh - 48px)" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ padding: "40px 0 24px" }}>
          <h1 style={{ fontSize: 32, fontWeight: 300, margin: "0 0 8px", letterSpacing: 0 }}>
            About
          </h1>
          <p style={{ fontSize: 14, color: "#525252", margin: 0, letterSpacing: "0.16px" }}>
            Project overview, architecture, and roadmap.
          </p>
        </div>

        <div
          style={{
            border: "1px solid #e0e0e0",
            backgroundColor: "#ffffff",
            padding: 32,
            fontSize: 13,
            lineHeight: 1.6,
            color: "#161616",
            letterSpacing: "0.16px",
          }}
          className="about-readme"
        >
          {content.split("\n").map((line, i) => {
            if (line.startsWith("# ")) {
              return (
                <h1 key={i} style={{ fontSize: 22, fontWeight: 400, margin: "0 0 16px", letterSpacing: 0 }}>
                  {line.replace(/^# /, "")}
                </h1>
              );
            }
            if (line.startsWith("## ")) {
              return (
                <h2 key={i} style={{ fontSize: 16, fontWeight: 600, margin: "24px 0 12px", letterSpacing: "0.16px" }}>
                  {line.replace(/^## /, "")}
                </h2>
              );
            }
            if (line.startsWith("### ")) {
              return (
                <h3 key={i} style={{ fontSize: 14, fontWeight: 600, margin: "20px 0 8px", letterSpacing: "0.16px" }}>
                  {line.replace(/^### /, "")}
                </h3>
              );
            }
            if (line.startsWith("- ")) {
              return (
                <li key={i} style={{ marginLeft: 20, marginBottom: 4, listStyle: "disc" as const }}>
                  {line.replace(/^- /, "")}
                </li>
              );
            }
            if (line.startsWith("|")) {
              if (line.includes("---")) return null;
              const cells = line.split("|").filter(Boolean).map((c) => c.trim());
              const last = i > 0 && content.split("\n")[i - 1]?.includes("---");
              if (last) return null;
              const prev = i > 1 ? content.split("\n")[i - 2] : "";
              const isHeader = prev && prev.startsWith("|") && content.split("\n")[i - 1]?.includes("---");
              return (
                <div key={i} style={{ display: "flex", gap: 16, padding: "4px 0", borderBottom: isHeader ? "2px solid #e0e0e0" : "1px solid #f4f4f4" }}>
                  {cells.map((c, ci) => (
                    <span key={ci} style={{ flex: 1, fontWeight: isHeader ? 600 : 400, fontSize: 12 }}>
                      {c}
                    </span>
                  ))}
                </div>
              );
            }
            if (line.startsWith("```")) return null;
            if (line.trim() === "") return <br key={i} />;
            return (
              <p key={i} style={{ margin: "0 0 8px", whiteSpace: "pre-wrap" as const }}>
                {line}
              </p>
            );
          })}
        </div>

        <style>{`
          .about-readme code {
            font-size: 12px;
            background: #f4f4f4;
            padding: 2px 6px;
          }
          .about-readme pre {
            font-size: 12px;
            background: #f4f4f4;
            padding: 16px;
            overflow-x: auto;
            border: 1px solid #e0e0e0;
            margin: 12px 0;
          }
          .about-readme a {
            color: #0f62fe;
            text-decoration: none;
          }
          .about-readme a:hover {
            text-decoration: underline;
          }
        `}</style>
      </div>
    </div>
  );
}
