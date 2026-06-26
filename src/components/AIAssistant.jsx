import React, { useState, useEffect, useRef } from "react";
import { 
  Send, 
  Sparkles, 
  BookOpen, 
  FileText, 
  Globe, 
  ArrowRight,
  RefreshCw,
  Cpu,
  Bot
} from "lucide-react";
import { getResponseForQuery } from "../data/mockData";

export default function AIAssistant({ setCurrentTab, setSelectedPathId }) {
  const renderMarkdown = (text) => {
    if (!text) return "";
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    const lines = html.split("\n");
    let inList = false;
    const formattedLines = [];
    lines.forEach((line) => {
      const trimmed = line.trim();
      const headerMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
      const listMatch = trimmed.match(/^[\*\-]\s+(.*)$/);
      if (headerMatch) {
        if (inList) {
          formattedLines.push("</ul>");
          inList = false;
        }
        formattedLines.push(`<strong>${headerMatch[2]}</strong>`);
      } else if (listMatch) {
        if (!inList) {
          formattedLines.push("<ul style='padding-left: 1.25rem; margin: 0.25rem 0; list-style-type: disc;'>");
          inList = true;
        }
        formattedLines.push(`<li style='margin-bottom: 0.15rem;'>${listMatch[1]}</li>`);
      } else {
        if (inList) {
          formattedLines.push("</ul>");
          inList = false;
        }
        formattedLines.push(line);
      }
    });
    if (inList) {
      formattedLines.push("</ul>");
    }
    
    let finalHtml = "";
    for (let i = 0; i < formattedLines.length; i++) {
      const line = formattedLines[i];
      if (line.startsWith("<ul") || line.startsWith("<li") || line.startsWith("</ul>")) {
        finalHtml += line;
      } else {
        const nextLine = formattedLines[i + 1];
        const needsBr = i < formattedLines.length - 1 && 
                        !line.startsWith("<ul") && !line.startsWith("<li") && !line.startsWith("</ul>") &&
                        nextLine !== undefined &&
                        !nextLine.startsWith("<ul") && !nextLine.startsWith("<li") && !nextLine.startsWith("</ul>");
        finalHtml += line + (needsBr ? "<br />" : "");
      }
    }
    return finalHtml;
  };
  const [messages, setMessages] = useState([
    {
      id: "m-init",
      sender: "ai",
      text: "Hello! I am Mentora's Agentic L&D Assistant. Ask me questions about operations, safety manuals, training resources, or SOPs, and I will search our institutional knowledge base to assist you.",
      source: null,
      learning: null,
      topics: []
    }
  ]);
  const [input, setInput] = useState("");
  const [selectedLang, setSelectedLang] = useState("en");
  
  // Workflow Loader State
  const [activeWorkflow, setActiveWorkflow] = useState(null);
  const [workflowStep, setWorkflowStep] = useState(0);
  const messagesEndRef = useRef(null);

  const workflowSteps = [
    "Understanding your question...",
    "Searching knowledge base...",
    "Retrieving relevant documents...",
    "Generating response...",
    "Suggesting learning resources..."
  ];

  const suggestedPrompts = [
    "Explain Lockout-Tagout.",
    "Summarize this SOP.",
    "Recommend training for a maintenance engineer.",
    "What PPE is required before furnace maintenance?",
    "Explain blast furnace operation.",
    "What are common startup mistakes?"
  ];

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi (हिन्दी)" },
    { code: "mr", name: "Marathi (मराठी)" },
    { code: "bn", name: "Bengali (বাংলা)" },
    { code: "ta", name: "Tamil (தமிழ்)" },
    { code: "te", name: "Telugu (తెలుగు)" }
  ];

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeWorkflow, workflowStep]);

  // Handle Query Submission
  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    // Add user message
    const userMsg = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: query
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Start Agentic Workflow animation
    setActiveWorkflow(query);
    setWorkflowStep(0);
  };

  // Run the step-by-step workflow loader
  useEffect(() => {
    if (activeWorkflow === null) return;

    if (workflowStep < workflowSteps.length) {
      const timer = setTimeout(() => {
        setWorkflowStep((prev) => prev + 1);
      }, 700); // 700ms per step
      return () => clearTimeout(timer);
    } else {
      // Completed reasoning workflow. Retrieve real mock response.
      const responseData = getResponseForQuery(activeWorkflow, selectedLang);
      
      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: responseData.ans,
        source: responseData.source,
        learning: responseData.learning,
        topics: responseData.topics,
        intent: responseData.intent,
        tool: responseData.tool
      };

      setMessages((prev) => [...prev, aiMsg]);
      setActiveWorkflow(null);
      setWorkflowStep(0);
    }
  }, [activeWorkflow, workflowStep]);

  // Helper to resolve route for learning path links
  const handleLearningLink = (pathName) => {
    if (!pathName) return;
    if (pathName.toLowerCase().includes("welding")) {
      setSelectedPathId("welding-tech");
    } else if (pathName.toLowerCase().includes("electrical")) {
      setSelectedPathId("electrical-eng");
    } else {
      setSelectedPathId("maintenance-eng");
    }
    setCurrentTab("paths");
  };

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 8rem)", maxWidth: "900px", margin: "0 auto", width: "100%" }}>
      
      {/* Header bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "1rem", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Bot size={24} style={{ color: "var(--primary)" }} />
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>AI Knowledge Assistant</h3>
            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Agentic Cognitive Ingestion Engine</p>
          </div>
        </div>

        {/* Multilingual Selector */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "white", padding: "0.35rem 0.75rem", borderRadius: "8px", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
          <Globe size={16} style={{ color: "var(--text-secondary)" }} />
          <select 
            value={selectedLang} 
            onChange={(e) => setSelectedLang(e.target.value)}
            style={{
              border: "none",
              fontSize: "0.85rem",
              fontWeight: "600",
              color: "var(--text-primary)",
              outline: "none",
              background: "transparent",
              cursor: "pointer"
            }}
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code}>{l.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Chat scroll window */}
      <div className="glass" style={{ flex: 1, overflowY: "auto", borderRadius: "16px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1rem", background: "rgba(255, 255, 255, 0.75)" }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: "flex", flexDirection: "column", width: "100%" }}>
            
            <div className={`chat-bubble ${msg.sender === "user" ? "chat-bubble-user" : "chat-bubble-ai"}`}>
              {/* Message text */}
              {msg.sender === "user" ? (
                <div style={{ whiteSpace: "pre-line", fontSize: "0.95rem" }}>{msg.text}</div>
              ) : (
                <div 
                  style={{ fontSize: "0.95rem", lineHeight: "1.6" }}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }}
                />
              )}
            </div>
          </div>
        ))}

        {/* Workflow Loader animation */}
        {activeWorkflow && (
          <div className="chat-bubble chat-bubble-ai slide-down" style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%", maxWidth: "80%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", fontSize: "0.8rem", fontWeight: "700", color: "var(--primary)" }}>
              <Cpu size={14} className="agent-spinner" /> MENTORA COGNITIVE WORKFLOW RUNNING...
            </div>
            
            {workflowSteps.map((step, idx) => {
              const isActive = workflowStep === idx;
              const isCompleted = workflowStep > idx;
              return (
                <div key={idx} className={`agent-step ${isActive ? "active" : isCompleted ? "completed" : ""}`}>
                  {isCompleted ? (
                    <span style={{ color: "var(--success)" }}>✓</span>
                  ) : isActive ? (
                    <div className="agent-spinner" />
                  ) : (
                    <span style={{ color: "var(--border)", marginRight: "0.25rem" }}>○</span>
                  )}
                  <span>{step}</span>
                </div>
              );
            })}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts list (pills) */}
      {messages.length === 1 && !activeWorkflow && (
        <div style={{ marginBottom: "1rem" }}>
          <p style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <Sparkles size={14} /> SUGGESTED L&D PROMPTS
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            {suggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                style={{
                  background: "white",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  padding: "0.75rem 1rem",
                  fontSize: "0.85rem",
                  textAlign: "left",
                  fontWeight: "500",
                  cursor: "pointer",
                  color: "var(--text-primary)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
                className="scale-up-hover"
              >
                <span>{prompt}</span>
                <ArrowRight size={14} style={{ color: "var(--border)" }} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Input form */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        style={{ display: "flex", gap: "0.5rem", width: "100%" }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={activeWorkflow !== null}
          placeholder="Ask Mentora about LOTO isolation, welding manuals, startup errors..."
          style={{
            flex: 1,
            padding: "0.85rem 1.25rem",
            borderRadius: "12px",
            border: "1px solid var(--border)",
            outline: "none",
            fontSize: "0.95rem",
            background: "white",
            boxShadow: "var(--shadow-sm)"
          }}
        />
        <button 
          type="submit" 
          disabled={activeWorkflow !== null || !input.trim()}
          className="btn-primary scale-up-hover" 
          style={{ 
            borderRadius: "12px", 
            padding: "0.85rem 1.25rem", 
            boxShadow: "none",
            opacity: activeWorkflow !== null || !input.trim() ? 0.6 : 1,
            cursor: activeWorkflow !== null || !input.trim() ? "not-allowed" : "pointer" 
          }}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
