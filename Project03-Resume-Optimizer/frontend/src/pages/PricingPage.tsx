import { Button } from "@carbon/react";
import { ArrowRight, Email } from "@carbon/icons-react";

export default function PricingPage() {
  return (
    <div>

      {/* ── Beta Hero ─────────────────────────────────────────── */}
      <section className="r-section-side" style={{ paddingTop: 120, paddingBottom: 80, backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" as const }}>
          <p
            style={{
              fontSize: "14px", color: "#525252", letterSpacing: "0.16px",
              marginBottom: 12,
            }}
          >
            Beta
          </p>
          <h1
            style={{
              fontSize: 60, fontWeight: 300, lineHeight: 1.17,
              letterSpacing: "-0.4px", marginBottom: 20,
            }}
          >
            Built to learn. <br />
            Shared to grow.
          </h1>
          <p
            style={{
              fontSize: 18, color: "#525252", lineHeight: 1.5,
              maxWidth: 560, margin: "0 auto 0", letterSpacing: 0,
            }}
          >
            This app is currently in beta — it's a personal project focused on
            building skills with AI, React, and the Carbon Design System.
            There are no plans, no pricing, no paywalls.
          </p>
        </div>
      </section>

      {/* ── Purpose ────────────────────────────────────────────── */}
      <section className="r-section-side" style={{ paddingTop: 64, paddingBottom: 80, backgroundColor: "#f4f4f4" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ border: "1px solid #e0e0e0", padding: 48, backgroundColor: "#ffffff" }}>
            <h2
              style={{
                fontSize: 24, fontWeight: 400, marginBottom: 16, letterSpacing: 0,
              }}
            >
              Why this exists
            </h2>
            <p
              style={{
                fontSize: 16, color: "#525252", lineHeight: 1.6,
                letterSpacing: "0.16px", marginBottom: 16,
              }}
            >
              Every engineer has that list of technologies they want to really
              understand — not just "know of" but build with end to end. This
              project is my deep dive into the full stack: LLM integration,
              prompt engineering, file parsing, responsive UI with a real design
              system, and deploying something useful from scratch.
            </p>
            <p
              style={{
                fontSize: 16, color: "#525252", lineHeight: 1.6,
                letterSpacing: "0.16px", marginBottom: 0,
              }}
            >
              If you found this useful or have feedback, I'd love to hear from
              you. And if you have a project you'd like to hire me for —
              let's talk.
            </p>
          </div>
        </div>
      </section>

      {/* ── Contact ────────────────────────────────────────────── */}
      <section className="r-section-side" style={{ paddingTop: 64, paddingBottom: 96, backgroundColor: "#ffffff" }}>
        <div
          style={{
            maxWidth: 600, margin: "0 auto", textAlign: "center" as const,
          }}
        >
          <h2
            style={{
              fontSize: 32, fontWeight: 300, lineHeight: 1.25,
              marginBottom: 12, letterSpacing: 0,
            }}
          >
            Want to work together?
          </h2>
          <p
            style={{
              fontSize: 16, color: "#525252", lineHeight: 1.5,
              marginBottom: 28, letterSpacing: "0.16px",
            }}
          >
            I'm open to freelance, contract, or full-time opportunities.
            Reach out and let's build something great.
          </p>
          <a
            href="mailto:markedmangoweb@gmail.com"
            style={{ textDecoration: "none" }}
          >
            <Button kind="primary" size="lg" renderIcon={Email}>
              markedmangoweb@gmail.com
            </Button>
          </a>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section
        className="r-section-side"
        style={{
          paddingTop: 64, paddingBottom: 64, backgroundColor: "#0f62fe",
        }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" as const }}>
          <h2
            style={{
              fontSize: 32, fontWeight: 400, lineHeight: 1.25,
              color: "#ffffff", marginBottom: 16, letterSpacing: 0,
            }}
          >
            Try the analyzer
          </h2>
          <p
            style={{
              fontSize: 16, color: "#ffffff", lineHeight: 1.5,
              letterSpacing: "0.16px", marginBottom: 24, opacity: 0.85,
            }}
          >
            Upload your resume and see how it scores — no sign-up required.
          </p>
          <Button kind="secondary" size="lg" renderIcon={ArrowRight}>
            Analyze your resume
          </Button>
        </div>
      </section>
    </div>
  );
}
