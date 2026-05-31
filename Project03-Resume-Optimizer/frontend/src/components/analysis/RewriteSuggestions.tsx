import { Accordion, AccordionItem, Tag } from "@carbon/react";
import type { RewriteSuggestion } from "../../types/resume";

interface RewriteSuggestionsProps {
  suggestions: RewriteSuggestion[];
}

export default function RewriteSuggestions({ suggestions }: RewriteSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div
      style={{
        border: "1px solid #e0e0e0",
        padding: 32,
        backgroundColor: "#ffffff",
      }}
    >
      <h3
        style={{
          fontSize: "24px",
          fontWeight: 400,
          marginBottom: "16px",
          letterSpacing: 0,
        }}
      >
        Rewrite Suggestions
      </h3>
      <Accordion>
        {suggestions.map((s, i) => (
          <AccordionItem
            key={i}
            title={
              <span>
                <Tag type="blue" style={{ marginRight: "8px" }}>
                  {s.section}
                </Tag>
                {s.reason}
              </span>
            }
          >
            <div style={{ marginBottom: "12px" }}>
              <p
                style={{
                  fontSize: "12px",
                  color: "#8c8c8c",
                  marginBottom: "4px",
                  letterSpacing: "0.32px",
                }}
              >
                ORIGINAL
              </p>
              <p style={{ fontSize: "14px", color: "#525252", letterSpacing: "0.16px" }}>
                {s.original}
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: "12px",
                  color: "#8c8c8c",
                  marginBottom: "4px",
                  letterSpacing: "0.32px",
                }}
              >
                OPTIMIZED
              </p>
              <p style={{ fontSize: "14px", color: "#161616", letterSpacing: "0.16px", fontWeight: 600 }}>
                {s.optimized}
              </p>
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
