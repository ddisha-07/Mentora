import React, { useState } from "react";
import { X, Search, FileText, Calendar, Tag, MessageSquare, ArrowRight, Library } from "lucide-react";
import { mockDocuments } from "../data/mockData";

export default function KBModal({ isOpen, onClose, onSelectDocForChat }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocId, setSelectedDocId] = useState(null);

  if (!isOpen) return null;

  const filteredDocs = mockDocuments.filter((doc) => {
    return (
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const activeDoc = mockDocuments.find((d) => d.id === selectedDocId) || null;

  return (
    <div style={{
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
        maxWidth: "850px",
        height: "85vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}>
        {/* Header */}
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Library style={{ color: "var(--accent)" }} size={20} />
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: "700", fontFamily: "var(--font-title)" }}>Knowledge Base (RAG Library)</h2>
              <p style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Verify source documents indexed in Kai's Vector Database</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content splits into list and preview details */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          
          {/* Left: Search and List */}
          <div style={{ width: "340px", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", background: "rgba(0,0,0,0.1)" }}>
            <div style={{ padding: "1rem", borderBottom: "1px solid var(--border)", position: "relative" }}>
              <Search size={15} style={{ position: "absolute", left: "24px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search index..."
                style={{
                  width: "100%",
                  padding: "0.5rem 0.5rem 0.5rem 2rem",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "var(--bg-app)",
                  fontSize: "13px",
                  outline: "none",
                  color: "var(--text-primary)"
                }}
              />
            </div>
            
            <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {filteredDocs.map((doc) => {
                const isActive = doc.id === selectedDocId;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    style={{
                      padding: "0.75rem",
                      borderRadius: "8px",
                      background: isActive ? "rgba(255, 255, 255, 0.03)" : "transparent",
                      border: isActive ? "1px solid var(--border)" : "1px solid transparent",
                      cursor: "pointer"
                    }}
                    className="scale-hover"
                  >
                    <h3 style={{ fontSize: "13px", fontWeight: "600", color: "white", marginBottom: "0.25rem", fontFamily: "var(--font-title)" }}>{doc.title}</h3>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--text-secondary)" }}>
                      <span>{doc.category}</span>
                      <span>{doc.uploadDate}</span>
                    </div>
                  </div>
                );
              })}

              {filteredDocs.length === 0 && (
                <p style={{ textAlign: "center", fontSize: "12px", color: "var(--text-secondary)", marginTop: "2rem" }}>
                  No indexed files found.
                </p>
              )}
            </div>
          </div>

          {/* Right: Active Document details preview */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {activeDoc ? (
              <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                
                {/* Meta details */}
                <div>
                  <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "10px", fontWeight: "700", padding: "0.2rem 0.5rem", background: "rgba(59, 130, 246, 0.15)", color: "var(--accent-light)", borderRadius: "4px", fontFamily: "var(--font-title)" }}>
                      {activeDoc.category.toUpperCase()}
                    </span>
                    <span style={{ fontSize: "10px", fontWeight: "700", padding: "0.2rem 0.5rem", background: "rgba(16, 185, 129, 0.15)", color: "var(--success)", borderRadius: "4px", fontFamily: "var(--font-title)" }}>
                      INDEXED
                    </span>
                  </div>
                  <h2 style={{ fontSize: "20px", fontWeight: "700", fontFamily: "var(--font-title)" }}>{activeDoc.title}</h2>
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                    By {activeDoc.author} • Updated {activeDoc.uploadDate}
                  </p>
                </div>

                {/* AI Summary card */}
                <div style={{ background: "rgba(59, 130, 246, 0.03)", border: "1px solid rgba(59, 130, 246, 0.15)", padding: "1rem", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <h4 style={{ fontSize: "12px", fontWeight: "700", color: "var(--accent-light)", display: "flex", alignItems: "center", gap: "0.25rem", fontFamily: "var(--font-title)" }}>
                    <MessageSquare size={13} /> VECTOR INGESTION SUMMARY
                  </h4>
                  <p style={{ fontSize: "13px", color: "white", lineHeight: "1.5" }}>{activeDoc.summary}</p>
                </div>

                {/* Raw content preview */}
                <div>
                  <h4 style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "0.5rem", fontFamily: "var(--font-title)" }}>Extracted Text Ingestion Check</h4>
                  <pre style={{
                    background: "rgba(0,0,0,0.2)",
                    border: "1px solid var(--border)",
                    padding: "1rem",
                    borderRadius: "10px",
                    fontSize: "12px",
                    fontFamily: "var(--font-body)",
                    whiteSpace: "pre-wrap",
                    lineHeight: "1.5",
                    maxHeight: "240px",
                    overflowY: "auto"
                  }}>
                    {activeDoc.content}
                  </pre>
                </div>

                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: "600", fontFamily: "var(--font-title)" }}>Indexed tags:</span>
                  {activeDoc.keywords.map((kw, idx) => (
                    <span key={idx} style={{ fontSize: "10px", background: "var(--bg-card)", border: "1px solid var(--border)", padding: "0.15rem 0.4rem", borderRadius: "4px" }}>
                      {kw}
                    </span>
                  ))}
                </div>

              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-secondary)", gap: "0.5rem" }}>
                <FileText size={40} style={{ opacity: 0.5 }} />
                <p style={{ fontSize: "14px" }}>Select a document from the left pane to check vector previews.</p>
              </div>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
          <button onClick={onClose} className="btn-outline" style={{ padding: "0.5rem 1rem", fontSize: "13px" }}>
            Close Library
          </button>
          {activeDoc && (
            <button 
              onClick={() => {
                onSelectDocForChat(activeDoc);
                onClose();
              }}
              className="btn-accent" 
              style={{ padding: "0.5rem 1rem", fontSize: "13px", boxShadow: "none" }}
            >
              Ask Kai About This Doc <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
