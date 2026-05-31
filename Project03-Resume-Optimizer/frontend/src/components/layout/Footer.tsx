import { Link } from "react-router-dom";
import { Column, Grid } from "@carbon/react";

const routeMap: Record<string, string> = {
  "Analyze Resume": "/",
  "Cover Letter": "/",
  "Pricing": "/pricing",
  "About": "/about",
};

const footerLinks = [
  {
    heading: "Product",
    links: ["Analyze Resume", "Cover Letter", "Pricing", "API"],
  },
  {
    heading: "Resources",
    links: ["Documentation", "Blog", "FAQ", "Support"],
  },
  {
    heading: "Company",
    links: ["About", "Careers", "Privacy", "Terms"],
  },
];

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#161616",
        color: "#c6c6c6",
        padding: "64px 32px",
        fontSize: "14px",
      }}
    >
      <Grid style={{ maxWidth: "1584px", margin: "0 auto" }}>
        <Column lg={4} md={2} sm={4}>
          <h4
            style={{
              color: "#ffffff",
              fontWeight: 600,
              marginBottom: "16px",
              fontSize: "14px",
              letterSpacing: "0.16px",
            }}
          >
            Resume Optimizer
          </h4>
          <p style={{ lineHeight: 1.5, color: "#c6c6c6" }}>
            AI-powered resume tailoring built on the Carbon Design System.
          </p>
        </Column>
        {footerLinks.map((group) => (
          <Column lg={4} md={2} sm={4} key={group.heading}>
            <h4
              style={{
                color: "#ffffff",
                fontWeight: 600,
                marginBottom: "16px",
                fontSize: "14px",
                letterSpacing: "0.16px",
              }}
            >
              {group.heading}
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {group.links.map((link) => {
                const to = routeMap[link];
                return (
                  <li key={link} style={{ marginBottom: "8px" }}>
                    {to ? (
                      <Link
                        to={to}
                        style={{
                          color: "#c6c6c6",
                          textDecoration: "none",
                          lineHeight: 1.5,
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.color = "#ffffff";
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.color = "#c6c6c6";
                        }}
                      >
                        {link}
                      </Link>
                    ) : (
                      <span style={{ color: "#6f6f6f", lineHeight: 1.5 }}>
                        {link}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </Column>
        ))}
      </Grid>
    </footer>
  );
}
