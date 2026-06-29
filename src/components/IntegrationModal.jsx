import React from "react";
import { X, Database, Workflow, Link2, Users, UsersRound, Mic, Layers, CheckCircle2 } from "lucide-react";

export default function IntegrationModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const components = [
    {
      title: "Vector Database (Chroma / PgVector)",
      desc: "Stores high-dimensional embeddings of SOPs, training manuals, and transcripts for semantic search.",
      icon: Database,
      status: "Ready for Connection"
    },
    {
      title: "RAG Pipeline (LangChain / LlamaIndex)",
      desc: "Orchestrates prompt building, retrieves top-k documents, and feeds them into the LLM context.",
      icon: Workflow,
      status: "Ready for Connection"
    },
    {
      title: "LMS Sync (Moodle / Cornerstone)",
      desc: "Saves training path progress and updates course completions to SCORM specifications.",
      icon: Link2,
      status: "API Hook Ready"
    },
    {
      title: "HRMS Integration (Workday / SuccessFactors)",
      desc: "Synchronizes user credentials, job functions, and safety certification prerequisites.",
      icon: Users,
      status: "API Hook Ready"
    },
    {
      title: "Multi-Agent Workflows",
      desc: "Dispatches sub-agents for safety inspection checksheets, compliance monitoring, and quiz creation.",
      icon: UsersRound,
      status: "Framework Mocked"
    },
    {
      title: "Voice Assistant API",
      desc: "Hands-free speech-to-text API allowing technicians to trigger checklists in the field.",
      icon: Mic,
      status: "Hardware Spec Built"
    }
  ];

  return (
    <div className="modal-overlay" style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(9, 9, 11, 0.8)",
      backdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "1rem"
    }}>
      <div className="card-dark slide-up" style={{
        width: "100%",
        maxWidth: "760px",
        maxHeight: "85vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}>
        {/* Mobile Drag Handle */}
        <div className="mobile-drag-handle">
          <div className="drag-handle-pill"></div>
        </div>

        {/* Header */}
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Layers style={{ color: "var(--accent)" }} size={20} />
            <div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: "700" }}>System Integrations Roadmap</h2>
              <p style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Modular enterprise architecture specifications for Kai</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          
          <div style={{ background: "rgba(59, 130, 246, 0.03)", border: "1px solid rgba(59, 130, 246, 0.15)", padding: "1rem", borderRadius: "10px", fontSize: "13px", lineHeight: "1.5" }}>
            💡 <strong>RAG Pipeline Alert:</strong> All database queries, translations, and file uploads in this demo are processed instantly in the client layer. The interfaces are engineered to bind directly to vector API endpoints, RAG routers, and local databases when deployed.
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
            {components.map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--border)", background: "rgba(255,255,255,0.01)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                    <div style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      backgroundColor: "var(--bg-app)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--accent)"
                    }}>
                      <Icon size={18} />
                    </div>
                    <span style={{ fontSize: "10px", padding: "0.2rem 0.5rem", borderRadius: "20px", background: "rgba(59, 130, 246, 0.1)", color: "var(--accent-light)", border: "1px solid rgba(59, 130, 246, 0.2)", fontWeight: "600" }}>
                      {c.status}
                    </span>
                  </div>
                  <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "0.25rem" }}>{c.title}</h3>
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.4" }}>{c.desc}</p>
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer */}
        <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
          <button onClick={onClose} className="btn-accent" style={{ padding: "0.5rem 1.25rem", fontSize: "13px", boxShadow: "none" }}>
            Close Spec
          </button>
        </div>
      </div>
    </div>
  );
}
