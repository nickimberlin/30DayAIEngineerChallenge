import { CopyButton, Button, InlineLoading } from "@carbon/react";

interface CoverLetterOutputProps {
  content: string | null;
  loading: boolean;
  onGenerate: () => void;
}

export default function CoverLetterOutput({ content, loading, onGenerate }: CoverLetterOutputProps) {
  return (
    <div
      style={{
        border: "1px solid #e0e0e0",
        padding: 32,
        backgroundColor: "#ffffff",
        borderRadius: 4,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
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
        Cover Letter
      </h3>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "16px" }}>
        <Button kind="primary" onClick={onGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate Cover Letter"}
        </Button>
        {loading && <InlineLoading description="Writing cover letter..." />}
      </div>
      {content && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
            <CopyButton onClick={() => navigator.clipboard.writeText(content!)} />
          </div>
          <div
            style={{
              backgroundColor: "#f4f4f4",
              padding: "16px",
              fontSize: "14px",
              lineHeight: 1.5,
              letterSpacing: "0.16px",
              whiteSpace: "pre-wrap",
            }}
          >
            {content}
          </div>
        </div>
      )}
    </div>
  );
}
