import React, { useState } from "react";
import { X, Settings, Sliders, Cpu, Save } from "lucide-react";

export default function SettingsModal({ isOpen, onClose }) {
  const [model, setModel] = useState("Kai-Pro-v2 (Agentic)");
  const [temperature, setTemperature] = useState(0.2);
  const [chunkSize, setChunkSize] = useState(500);
  const [chunkOverlap, setChunkOverlap] = useState(50);
  const [systemPrompt, setSystemPrompt] = useState(
    "You are Kai, an Agentic AI L&D assistant of the Mentora platform. Always search the knowledge base before answering, cite source documents, recommend next learning steps, and respond in the user's detected language."
  );

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    alert("Settings saved successfully! Ingestion variables synced.");
    onClose();
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(9, 9, 11, 0.8)",
      backdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "1rem"
    }}>
      <div className="card-dark slide-up" style={{
        width: "100%",
        maxWidth: "550px",
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}>
        {/* Header */}
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Settings style={{ color: "var(--accent)" }} size={20} />
            <h2 style={{ fontSize: "18px", fontWeight: "700", fontFamily: "var(--font-title)" }}>System Configuration</h2>
          </div>
          <button 
            onClick={onClose}
            style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content form */}
        <form onSubmit={handleSave} style={{ padding: "1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          
          {/* Model selection */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.25rem", fontFamily: "var(--font-title)" }}>
              <Cpu size={14} /> Cognitive Model Preset
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              style={{
                width: "100%",
                padding: "0.6rem",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "var(--bg-app)",
                fontSize: "14px",
                outline: "none"
              }}
            >
              <option value="Kai-Pro-v2 (Agentic)">Kai-Pro-v2 (Agentic LLM)</option>
              <option value="GPT-4o-Turbo">GPT-4o-Turbo (Generic Core)</option>
              <option value="Claude-3.5-Sonnet">Claude-3.5-Sonnet (Reasoning Engine)</option>
            </select>
          </div>

          {/* Temperature Slider */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", fontFamily: "var(--font-title)" }}>
              <label>Temperature (Creativity Parameter)</label>
              <span style={{ color: "var(--accent-light)" }}>{temperature}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05" 
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              style={{ width: "100%", cursor: "pointer", accentColor: "var(--accent)" }}
            />
            <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
              Lower temperatures focus output on specific context facts.
            </span>
          </div>

          {/* RAG Chunk size slider */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", fontFamily: "var(--font-title)" }}>
              <label>RAG Index Chunk Size</label>
              <span style={{ color: "var(--accent-light)" }}>{chunkSize} tokens</span>
            </div>
            <input 
              type="range" 
              min="100" 
              max="1500" 
              step="50" 
              value={chunkSize}
              onChange={(e) => setChunkSize(parseInt(e.target.value, 10))}
              style={{ width: "100%", cursor: "pointer", accentColor: "var(--accent)" }}
            />
          </div>

          {/* RAG Chunk overlap slider */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", fontFamily: "var(--font-title)" }}>
              <label>Chunk Overlap Margin</label>
              <span style={{ color: "var(--accent-light)" }}>{chunkOverlap} tokens</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="200" 
              step="10" 
              value={chunkOverlap}
              onChange={(e) => setChunkOverlap(parseInt(e.target.value, 10))}
              style={{ width: "100%", cursor: "pointer", accentColor: "var(--accent)" }}
            />
          </div>

          {/* System prompt instruction */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.25rem", fontFamily: "var(--font-title)" }}>
              <Sliders size={14} /> System Directive (System Prompt)
            </label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows="3"
              style={{
                width: "100%",
                padding: "0.6rem",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "var(--bg-app)",
                fontSize: "13px",
                outline: "none",
                resize: "none",
                lineHeight: "1.4"
              }}
            />
          </div>

          {/* Buttons footer */}
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem", marginTop: "0.5rem", display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
            <button type="button" onClick={onClose} className="btn-outline" style={{ padding: "0.5rem 1rem", fontSize: "14px" }}>
              Cancel
            </button>
            <button type="submit" className="btn-accent" style={{ padding: "0.5rem 1rem", fontSize: "14px", boxShadow: "none" }}>
              <Save size={16} /> Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
