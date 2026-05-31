import { ProgressBar, Column, Grid } from "@carbon/react";
import type { ScoreBreakdown } from "../../types/resume";

interface ScoreCardProps {
  overallScore: number;
  breakdown: ScoreBreakdown;
}

const labels: Record<keyof ScoreBreakdown, string> = {
  skills: "Skills",
  experience: "Experience",
  education: "Education",
  certifications: "Certifications",
};

export default function ScoreCard({ overallScore, breakdown }: ScoreCardProps) {
  return (
    <div
      style={{
        border: "1px solid #e0e0e0",
        padding: 32,
        backgroundColor: "#ffffff",
      }}
    >
      <h2
        style={{
          fontSize: "32px",
          fontWeight: 400,
          marginBottom: "24px",
          letterSpacing: 0,
        }}
      >
        ATS Match Score
      </h2>
      <div style={{ marginBottom: 40 }}>
        <p
          style={{
            fontSize: "14px",
            color: "#525252",
            marginBottom: "8px",
            letterSpacing: "0.16px",
          }}
        >
          Overall Match
        </p>
        <p
          className="r-score"
          style={{
            fontWeight: 300,
            color: "#161616",
            lineHeight: 1.17,
          }}
        >
          {Math.round(overallScore)}%
        </p>
      </div>
      <Grid style={{ margin: 0 }}>
        {(Object.keys(breakdown) as Array<keyof ScoreBreakdown>).map((key) => (
          <Column lg={6} md={4} sm={4} key={key} style={{ marginBottom: "16px" }}>
            <ProgressBar
              label={labels[key]}
              value={Math.round(breakdown[key])}
              max={100}
            />
          </Column>
        ))}
      </Grid>
    </div>
  );
}
