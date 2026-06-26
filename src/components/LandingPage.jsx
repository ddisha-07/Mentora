import React from "react";
import { 
  MessageSquare, 
  Map, 
  Search, 
  FileText, 
  Globe, 
  ShieldCheck, 
  ChevronRight 
} from "lucide-react";

export default function LandingPage({ onGetStarted }) {
  const features = [
    {
      title: "AI Knowledge Assistant",
      desc: "Instant conversational guidance utilizing full institutional context, SOPs, and manuals.",
      icon: MessageSquare,
      color: "hsl(221, 83%, 53%)"
    },
    {
      title: "Learning Recommendations",
      desc: "Custom-tailored learning paths dynamically mapped out for engineer and technician profiles.",
      icon: Map,
      color: "hsl(199, 89%, 48%)"
    },
    {
      title: "SOP Search",
      desc: "Intelligent search and retrieval across safety protocols and mechanical guides in real-time.",
      icon: Search,
      color: "hsl(142, 71%, 45%)"
    },
    {
      title: "Document Summarization",
      desc: "Instantly parse and summarize uploaded manuals, manuals text, and standard directives.",
      icon: FileText,
      color: "hsl(270, 90%, 50%)"
    },
    {
      title: "Multilingual Support",
      desc: "Support for English, Hindi, Marathi, Bengali, Tamil, and Telugu with automatic language detection.",
      icon: Globe,
      color: "hsl(35, 92%, 50%)"
    },
    {
      title: "Knowledge Preservation",
      desc: "Bridge the gap by capturing retired experts' insights and lessons learned permanently.",
      icon: ShieldCheck,
      color: "hsl(0, 84%, 60%)"
    }
  ];

  return (
    <div className="fade-in" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "radial-gradient(circle at top left, hsl(214, 100%, 98%) 0%, white 100%)" }}>
      {/* Header */}
      <header className="glass" style={{ position: "sticky", top: 0, zIndex: 10, padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: "32px", 
            height: "32px", 
            borderRadius: "8px", 
            background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold"
          }}>
            M
          </div>
          <span style={{ fontSize: "1.15rem", fontWeight: "700", background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Mentora
          </span>
        </div>
        <div>
          <button 
            onClick={onGetStarted}
            className="btn-secondary scale-up-hover" 
            style={{ padding: "0.5rem 1.25rem", fontSize: "0.9rem" }}
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: "5rem 2rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Glow effect */}
        <div style={{
          position: "absolute",
          top: "-50%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, rgba(37, 99, 235, 0) 70%)",
          zIndex: 0,
          pointerEvents: "none"
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "800px", margin: "0 auto" }}>
          <span className="badge badge-training" style={{ padding: "0.4rem 1rem", fontSize: "0.85rem", marginBottom: "1.5rem", borderRadius: "20px", fontWeight: "600", letterSpacing: "0.05em" }}>
            AI-POWERED L&D ASSISTANT
          </span>
          <h1 style={{ fontSize: "3.5rem", fontWeight: "800", lineHeight: "1.1", marginBottom: "1rem", letterSpacing: "-0.03em" }}>
            Mentora
          </h1>
          <h2 style={{ fontSize: "1.75rem", fontWeight: "500", color: "var(--primary)", marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>
            Knowledge Beyond Boundaries
          </h2>
          <p style={{ fontSize: "1.15rem", color: "var(--text-secondary)", marginBottom: "2.5rem", lineHeight: "1.6", maxWidth: "680px", margin: "0 auto 2.5rem auto" }}>
            An AI-powered Learning & Development platform that transforms organizational knowledge into accessible, personalized learning experiences. Preserves institutional wisdom and accelerates employee onboarding.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button onClick={onGetStarted} className="btn-primary scale-up-hover" style={{ fontSize: "1.05rem", padding: "0.85rem 2rem" }}>
              Get Started <ChevronRight size={18} />
            </button>
            <a href="#features" className="btn-secondary scale-up-hover" style={{ fontSize: "1.05rem", padding: "0.85rem 2rem", textDecoration: "none" }}>
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" style={{ padding: "5rem 2rem", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1rem" }}>
            Engineered for Industrial Learning & Development
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto" }}>
            Preserving expertise, standardizing operations, and automating training cycles with intelligent cognitive search.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div 
                key={i} 
                className="glass scale-up-hover" 
                style={{
                  padding: "2rem",
                  borderRadius: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  border: "1px solid var(--border)"
                }}
              >
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "var(--primary-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: feature.color
                }}>
                  <Icon size={24} />
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "600" }}>{feature.title}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.5" }}>{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ marginTop: "auto", borderTop: "1px solid var(--border)", padding: "2rem", textAlign: "center", background: "white" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
          © {new Date().getFullYear()} Mentora Inc. All rights reserved. Knowledge Beyond Boundaries.
        </p>
      </footer>
    </div>
  );
}
