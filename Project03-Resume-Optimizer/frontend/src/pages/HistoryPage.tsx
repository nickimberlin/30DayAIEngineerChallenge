import { Column, Grid, Tile, Tag } from "@carbon/react";

const historyItems = [
  { title: "Software Engineer @ Google", score: 87, date: "May 28, 2026" },
  { title: "Product Manager @ Stripe", score: 72, date: "May 25, 2026" },
  { title: "Data Scientist @ OpenAI", score: 63, date: "May 20, 2026" },
  { title: "Frontend Engineer @ Vercel", score: 91, date: "May 15, 2026" },
];

export default function HistoryPage() {
  return (
    <div>
      <section className="r-section-side" style={{ paddingTop: 64, paddingBottom: 32, backgroundColor: "#ffffff" }}>
        <Grid style={{ maxWidth: "1584px", margin: "0 auto" }}>
          <Column lg={16} md={8} sm={4}>
            <h1
              className="r-hero-lg"
              style={{
                fontWeight: 300,
                lineHeight: 1.2,
                marginBottom: "8px",
              }}
            >
              Analysis History
            </h1>
            <p
              style={{
                fontSize: "16px",
                color: "#525252",
                letterSpacing: "0.16px",
                lineHeight: 1.5,
              }}
            >
              Your recent resume analyses and their ATS scores.
            </p>
          </Column>
        </Grid>
      </section>

      <section className="r-section-side" style={{ paddingTop: 24, paddingBottom: 64, backgroundColor: "#f4f4f4" }}>
        <Grid style={{ maxWidth: "1584px", margin: "0 auto" }}>
          {historyItems.length === 0 ? (
            <Column lg={16} md={8} sm={4}>
              <Tile style={{ textAlign: "center", padding: "64px 32px" }}>
                <p style={{ color: "#8c8c8c", fontSize: "16px", letterSpacing: "0.16px" }}>
                  No analyses yet. Upload a resume to get started.
                </p>
              </Tile>
            </Column>
          ) : (
            historyItems.map((item) => (
              <Column lg={8} md={4} sm={4} key={item.title}>
                <Tile
                  style={{
                    padding: 32,
                    border: "1px solid #e0e0e0",
                    marginBottom: 24,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "8px",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "16px",
                        fontWeight: 400,
                        letterSpacing: "0.16px",
                        margin: 0,
                      }}
                    >
                      {item.title}
                    </h3>
                    <Tag type={item.score >= 80 ? "green" : item.score >= 60 ? "warm-gray" : "red"}>
                      {item.score}%
                    </Tag>
                  </div>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#8c8c8c",
                      letterSpacing: "0.32px",
                      margin: 0,
                    }}
                  >
                    {item.date}
                  </p>
                </Tile>
              </Column>
            ))
          )}
        </Grid>
      </section>
    </div>
  );
}
