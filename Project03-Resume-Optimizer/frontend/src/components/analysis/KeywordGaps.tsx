import { Tag } from "@carbon/react";
import type { KeywordGap as KeywordGapType } from "../../types/resume";

interface KeywordGapsProps {
  gaps: KeywordGapType[];
}

export default function KeywordGaps({ gaps }: KeywordGapsProps) {
  if (gaps.length === 0) return null;

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
        Missing Keywords
      </h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {gaps.map((gap, i) => (
          <Tag
            key={`${gap.keyword}-${i}`}
            type={gap.severity === "high" ? "red" : "warm-gray"}
            title={`${gap.category}: ${gap.keyword}`}
          >
            {gap.keyword}
          </Tag>
        ))}
      </div>
    </div>
  );
}
