import React, { useState } from "react";
import { Search, Filter, FileText, ArrowRight, User, Calendar, Tag, MessageSquare, X } from "lucide-react";
import { mockDocuments } from "../data/mockData";

export default function KnowledgeBase({ setCurrentTab, handleAskAIDoc }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDoc, setSelectedDoc] = useState(null);

  const categories = ["All", "Safety", "Operations", "Maintenance", "Electrical", "Mechanical", "HR", "Training"];

  // Filter and Search logic
  const filteredDocs = mockDocuments.filter((doc) => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.keywords.some((kw) => kw.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getCategoryBadge = (cat) => {
    switch (cat.toLowerCase()) {
      case "safety": return <span className="badge badge-safety">Safety</span>;
      case "operations": return <span className="badge badge-operations">Operations</span>;
      case "maintenance": return <span className="badge badge-maintenance">Maintenance</span>;
      case "electrical": return <span className="badge badge-electrical">Electrical</span>;
      case "mechanical": return <span className="badge badge-mechanical">Mechanical</span>;
      case "hr": return <span className="badge badge-hr">HR</span>;
      default: return <span className="badge badge-training">{cat}</span>;
    }
  };

  const getStatusBadge = (status) => {
    if (status === "Approved") return <span className="badge badge-approved">Approved</span>;
    return <span className="badge badge-pending">Pending Review</span>;
  };

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "700" }}>SOP & Knowledge Base</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          Browse institutional documents, technical manuals, and standard procedures.
        </p>
      </div>

      {/* Search & Category Filter Controls */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
        
        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: "260px" }}>
          <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents by title or keywords..."
            style={{
              width: "100%",
              padding: "0.75rem 1rem 0.75rem 2.5rem",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              outline: "none",
              fontSize: "0.9rem",
              background: "white"
            }}
          />
        </div>

        {/* Category Pills scrollable */}
        <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", padding: "0.25rem 0" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "20px",
                border: "1px solid",
                borderColor: selectedCategory === cat ? "var(--primary)" : "var(--border)",
                background: selectedCategory === cat ? "var(--primary-light)" : "white",
                color: selectedCategory === cat ? "var(--primary)" : "var(--text-secondary)",
                fontSize: "0.85rem",
                fontWeight: "600",
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
              className="scale-up-hover"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
        {filteredDocs.map((doc) => (
          <div 
            key={doc.id} 
            onClick={() => setSelectedDoc(doc)}
            className="glass scale-up-hover" 
            style={{
              padding: "1.5rem",
              borderRadius: "14px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              border: "1px solid var(--border)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              {getCategoryBadge(doc.category)}
              {getStatusBadge(doc.status)}
            </div>
            
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.5rem", lineHeight: "1.4" }}>
                {doc.title}
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>
                {doc.summary}
              </p>
            </div>

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <Calendar size={12} /> {doc.uploadDate}
              </span>
              <span style={{ fontWeight: "600", color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.15rem" }}>
                View Preview <ArrowRight size={12} />
              </span>
            </div>
          </div>
        ))}

        {filteredDocs.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "3rem", background: "white", borderRadius: "14px", border: "1px solid var(--border)" }}>
            <p style={{ color: "var(--text-secondary)" }}>No documents found matching your search parameters.</p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {selectedDoc && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "1.5rem"
        }}>
          <div className="glass-premium slide-down" style={{
            background: "white",
            width: "100%",
            maxWidth: "750px",
            maxHeight: "85vh",
            borderRadius: "20px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxShadow: "var(--shadow-lg)"
          }}>
            {/* Modal Header */}
            <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  {getCategoryBadge(selectedDoc.category)}
                  {getStatusBadge(selectedDoc.status)}
                </div>
                <h2 style={{ fontSize: "1.4rem", fontWeight: "700" }}>{selectedDoc.title}</h2>
              </div>
              <button 
                onClick={() => setSelectedDoc(null)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem" }}
              >
                <X size={20} style={{ color: "var(--text-secondary)" }} />
              </button>
            </div>

            {/* Modal Scroll Content */}
            <div style={{ padding: "1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Author & Info */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", background: "var(--bg-app)", padding: "1rem", borderRadius: "10px", fontSize: "0.85rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <User size={16} style={{ color: "var(--text-secondary)" }} />
                  <span><strong>Author:</strong> {selectedDoc.author}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Calendar size={16} style={{ color: "var(--text-secondary)" }} />
                  <span><strong>Uploaded:</strong> {selectedDoc.uploadDate}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", gridColumn: "1/-1" }}>
                  <Tag size={16} style={{ color: "var(--text-secondary)" }} />
                  <span><strong>Keywords:</strong> {selectedDoc.keywords.join(", ")}</span>
                </div>
              </div>

              {/* AI Summary Card */}
              <div style={{ background: "var(--primary-light)", border: "1px solid var(--border-focus)", padding: "1.25rem", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <MessageSquare size={16} /> COGNITIVE AI SUMMARY
                </h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-primary)", lineHeight: "1.5" }}>
                  {selectedDoc.summary}
                </p>
              </div>

              {/* Document Full Text */}
              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "0.75rem" }}>Document Preview</h3>
                <pre style={{
                  background: "var(--bg-app)",
                  padding: "1rem",
                  borderRadius: "10px",
                  whiteSpace: "pre-wrap",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.85rem",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border)",
                  lineHeight: "1.6"
                }}>
                  {selectedDoc.content}
                </pre>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ padding: "1.25rem 1.5rem", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", gap: "1rem", background: "white" }}>
              <button 
                onClick={() => setSelectedDoc(null)}
                className="btn-secondary" 
                style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
              >
                Close
              </button>
              <button 
                onClick={() => {
                  handleAskAIDoc(selectedDoc.title);
                  setSelectedDoc(null);
                }}
                className="btn-primary" 
                style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
              >
                <MessageSquare size={16} /> Ask AI About This Doc
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
