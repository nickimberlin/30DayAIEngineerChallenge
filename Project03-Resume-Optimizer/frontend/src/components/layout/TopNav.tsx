import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Analyze", to: "/" },
  { label: "History", to: "/history" },
  { label: "Pricing", to: "/pricing" },
  { label: "Settings", to: "/settings" },
  { label: "About", to: "/about" },
];

export default function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        height: 48,
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e0e0e0",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        fontFamily: 'IBM Plex Sans, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: 1584,
          margin: "0 auto",
        }}
      >
        <Link
          to="/"
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#161616",
            textDecoration: "none",
            letterSpacing: "0.16px",
            whiteSpace: "nowrap",
          }}
        >
          Resume Optimizer
        </Link>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <ul
            style={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
            className="nav-links-desktop"
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      height: 48,
                      padding: "0 12px",
                      fontSize: 14,
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? "#161616" : "#525252",
                      textDecoration: "none",
                      letterSpacing: "0.16px",
                      borderBottom: isActive ? "2px solid #0f62fe" : "2px solid transparent",
                      transition: "color 0.1s, border-color 0.1s",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.target as HTMLElement;
                      if (!isActive) el.style.color = "#161616";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.target as HTMLElement;
                      if (!isActive) el.style.color = "#525252";
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="nav-hamburger"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            style={{
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#161616",
            }}
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                <path d="M24 8L8 24M8 8l16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                <path d="M4 8h24M4 16h24M4 24h24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          style={{
            position: "absolute",
            top: 48,
            left: 0,
            right: 0,
            backgroundColor: "#ffffff",
            borderBottom: "1px solid #e0e0e0",
            padding: "8px 0",
          }}
        >
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "block",
                  padding: "12px 16px",
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#0f62fe" : "#161616",
                  textDecoration: "none",
                  letterSpacing: "0.16px",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}

      <style>{`
        @media (max-width: 671px) {
          .nav-links-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
