import React, { useState } from "react";
import { UploadCloud, FileText, CheckCircle2, MessageSquare, Send, Tag, HelpCircle, X } from "lucide-react";

export default function UploadDocs() {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  
  // Doc-specific chat state
  const [docMessages, setDocMessages] = useState([]);
  const [docInput, setDocInput] = useState("");

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const simulateUpload = (fileName, fileSize) => {
    setUploading(true);
    setProgress(0);
    
    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        
        // Generate mock parsed document details
        const baseName = fileName.split(".")[0].replace(/[-_]/g, " ");
        const simulatedText = `INSTITUTIONAL ARCHIVE INGESTION SUMMARY\nDocument: ${fileName}\n\nSECTION 1: OPERATIONAL SAFETY\nAlways verify that Lockout-Tagout (LOTO) protocols have been completed prior to engaging with mechanical subsystems. Proper safety helmet and thermal gloves are required when accessing heating zones.\n\nSECTION 2: MAINTENANCE FREQUENCY\nRoutine inspections of the electrical terminals should be conducted every 30 days. Contact Lead Maintenance Engineer if any cable terminal measures a temperature higher than 55°C during thermographic scanning.`;
        
        setUploadedFile({
          name: fileName,
          size: fileSize,
          text: simulatedText,
          summary: `This document establishes the safety guidelines and maintenance protocols for ${baseName}. It emphasizes strict LOTO compliance, PPE standards (helmet and thermal gloves), and monthly electrical inspections, highlighting a maximum connection temperature threshold of 55°C.`,
          keywords: [baseName.toUpperCase(), "SAFETY", "MAINTENANCE", "LOTO", "INSPECTION", "TEMPERATURE"]
        });
        
        setDocMessages([
          { sender: "ai", text: `I have finished parsing "${fileName}". You can ask me questions about this document now!` }
        ]);
        setUploading(false);
      }
    }, 150);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      simulateUpload(file.name, (file.size / 1024).toFixed(1) + " KB");
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      simulateUpload(file.name, (file.size / 1024).toFixed(1) + " KB");
    }
  };

  const handleSendDocQuery = (e) => {
    e.preventDefault();
    if (!docInput.trim()) return;

    const userQ = docInput;
    const userMsg = { sender: "user", text: userQ };
    setDocMessages((prev) => [...prev, userMsg]);
    setDocInput("");

    // Simulate localized AI answer based on uploaded text
    setTimeout(() => {
      let aiAns = `Based on the uploaded document "${uploadedFile.name}":\n\n`;
      const qLower = userQ.toLowerCase();

      if (qLower.includes("loto") || qLower.includes("lockout") || qLower.includes("safety")) {
        aiAns += "It is mandatory to complete Lockout-Tagout (LOTO) protocols before working on mechanical subsystems. You must wear a safety helmet and thermal gloves when in heating zones.";
      } else if (qLower.includes("temperature") || qLower.includes("scan") || qLower.includes("electric") || qLower.includes("terminals")) {
        aiAns += "Electrical terminals must be inspected every 30 days. If any terminal exceeds 55°C during thermographic scanning, contact the Lead Maintenance Engineer immediately.";
      } else {
        aiAns += `The document covers safety guidelines and maintenance protocols for ${uploadedFile.name.split(".")[0]}. Let me know if you would like me to summarize the temperature isolation rules or the LOTO requirements.`;
      }

      setDocMessages((prev) => [...prev, { sender: "ai", text: aiAns }]);
    }, 800);
  };

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "700" }}>Ingest & Upload Knowledge</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          Upload new SOPs, training manuals, or retired expert guides to add them to Mentora's intelligence engine.
        </p>
      </div>

      {!uploadedFile ? (
        // Dropzone Area
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`upload-dropzone glass ${dragActive ? "dragging" : ""}`}
        >
          {uploading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
              <div className="agent-spinner" style={{ width: "40px", height: "40px" }} />
              <h3 style={{ fontSize: "1.1rem", fontWeight: "600" }}>Parsing document content...</h3>
              <div style={{ width: "100%", maxWidth: "300px", height: "6px", background: "var(--border)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ width: `${progress}%`, height: "100%", background: "var(--primary)", transition: "width 0.2s" }} />
              </div>
              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{progress}% Ingested</span>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
              <UploadCloud size={48} style={{ color: "var(--primary)" }} />
              <div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: "600", marginBottom: "0.25rem" }}>
                  Drag and drop your document here
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  Supports PDF, DOCX, and TXT files up to 25MB
                </p>
              </div>
              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>or</span>
              <label 
                className="btn-primary scale-up-hover" 
                style={{ cursor: "pointer", fontSize: "0.9rem", padding: "0.5rem 1.25rem" }}
              >
                Browse Files
                <input 
                  type="file" 
                  accept=".pdf,.docx,.txt" 
                  onChange={handleFileInput} 
                  style={{ display: "none" }} 
                />
              </label>
            </div>
          )}
        </div>
      ) : (
        // Upload Results Container
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", width: "100%" }}>
          {/* Left panel: Parsed Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className="glass" style={{ padding: "1.5rem", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "1rem" }}>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FileText size={24} style={{ color: "var(--primary)" }} />
                  <div>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: "700" }}>{uploadedFile.name}</h3>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{uploadedFile.size}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setUploadedFile(null)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-secondary)",
                    display: "flex",
                    alignItems: "center"
                  }}
                  className="scale-up-hover"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Status Alert */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "hsl(142, 70%, 93%)", color: "hsl(142, 70%, 25%)", padding: "0.75rem", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "600" }}>
                <CheckCircle2 size={16} /> Document successfully parsed & index built!
              </div>

              {/* Extracted Summary */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <h4 style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--primary)" }}>AI INGESTION SUMMARY</h4>
                <p style={{ fontSize: "0.85rem", color: "var(--text-primary)", background: "var(--primary-light)", padding: "0.85rem", borderRadius: "8px", border: "1px solid var(--border)", lineHeight: 1.5 }}>
                  {uploadedFile.summary}
                </p>
              </div>

              {/* Extracted Tags */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <h4 style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <Tag size={12} /> SUGGESTED KEYWORD TAGS
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                  {uploadedFile.keywords.map((kw, i) => (
                    <span key={i} style={{ fontSize: "0.75rem", background: "white", border: "1px solid var(--border)", padding: "0.2rem 0.5rem", borderRadius: "4px", fontWeight: "600" }}>
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Extracted Raw Text */}
            <div className="glass" style={{ padding: "1.5rem", borderRadius: "16px" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "0.75rem" }}>Extracted Text Segment</h3>
              <div style={{
                maxHeight: "220px",
                overflowY: "auto",
                background: "var(--bg-app)",
                padding: "0.85rem",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                fontSize: "0.8rem",
                fontFamily: "var(--font-body)",
                whiteSpace: "pre-wrap",
                color: "var(--text-primary)",
                lineHeight: "1.5"
              }}>
                {uploadedFile.text}
              </div>
            </div>
          </div>

          {/* Right panel: Document specific chatbot */}
          <div className="glass" style={{ padding: "1.5rem", borderRadius: "16px", display: "flex", flexDirection: "column", height: "540px" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: "700", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <MessageSquare size={18} style={{ color: "var(--primary)" }} /> Ask Questions About This Document
            </h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", borderBottom: "1px solid var(--border)", paddingBottom: "0.75rem", marginBottom: "1rem" }}>
              Queries in this pane are scoped specifically to the context of <strong>{uploadedFile.name}</strong>.
            </p>

            {/* Chat Box Scroll Container */}
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.75rem", padding: "0.5rem", marginBottom: "1rem" }}>
              {docMessages.map((msg, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                    maxWidth: "85%",
                    background: msg.sender === "user" ? "var(--primary-light)" : "white",
                    border: msg.sender === "user" ? "none" : "1px solid var(--border)",
                    color: "var(--text-primary)",
                    padding: "0.75rem",
                    borderRadius: "12px",
                    borderBottomRightRadius: msg.sender === "user" ? "2px" : "12px",
                    borderBottomLeftRadius: msg.sender === "user" ? "12px" : "2px",
                    fontSize: "0.85rem",
                    whiteSpace: "pre-wrap",
                    lineHeight: "1.4"
                  }}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Suggested prompts helper */}
            {docMessages.length === 1 && (
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem", fontSize: "0.75rem" }}>
                <span style={{ color: "var(--text-secondary)", alignSelf: "center", fontWeight: "600" }}>Try:</span>
                {["Is LOTO required?", "What temperature is unsafe?"].map((p, i) => (
                  <button 
                    key={i} 
                    onClick={() => {
                      setDocInput(p);
                    }}
                    style={{ background: "white", border: "1px solid var(--border)", padding: "0.25rem 0.5rem", borderRadius: "20px", cursor: "pointer" }}
                    className="scale-up-hover"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Input bar */}
            <form onSubmit={handleSendDocQuery} style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                value={docInput}
                onChange={(e) => setDocInput(e.target.value)}
                placeholder="Ask about LOTO rules or temperature..."
                style={{
                  flex: 1,
                  padding: "0.6rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  outline: "none",
                  fontSize: "0.85rem"
                }}
              />
              <button type="submit" className="btn-primary" style={{ padding: "0.6rem 1rem", borderRadius: "8px", boxShadow: "none" }}>
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
