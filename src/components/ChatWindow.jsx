import React, { useState, useEffect, useRef } from "react";
import { 
  Send, 
  Mic, 
  Paperclip, 
  Bot, 
  Cpu, 
  Sparkles, 
  BookOpen, 
  FileText, 
  ArrowRight,
  User,
  CheckCircle2,
  FileUp,
  X,
  Menu,
  Brain,
  Search,
  GraduationCap,
  Workflow,
  ShieldCheck,
  Languages,
  Activity,
  Layers,
  Copy,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronUp,
  Ghost
} from "lucide-react";
import { getResponseForQuery, detectLanguage } from "../data/mockData";

export default function ChatWindow({ 
  user,
  activeChat, 
  onSendMessage, 
  onAttachDocument, 
  onClearDocument,
  mobileOpen, 
  setMobileOpen,
  isCollapsedSidebar,
  onStartTemporaryChat
}) {
  const [input, setInput] = useState("");
  const getFirstName = (fullName) => {
    if (!fullName) return "Guest";
    const parts = fullName.trim().split(/\s+/);
    if ((parts[0].length === 1 || (parts[0].length === 2 && parts[0].endsWith("."))) && parts.length > 1) {
      return parts[1];
    }
    return parts[0];
  };
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
  const [activeWorkflow, setActiveWorkflow] = useState(null);
  const [workflowStep, setWorkflowStep] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isReasoningExpanded, setIsReasoningExpanded] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const workflowSteps = [
    { label: "Understanding your request...", icon: Brain },
    { label: "Searching knowledge base...", icon: Search },
    { label: "Retrieving relevant documents...", icon: FileText },
    { label: "Reasoning...", icon: Cpu },
    { label: "Generating response...", icon: Sparkles }
  ];

  const suggestedPrompts = [
    "Explain Lockout-Tagout.",
    "Recommend training for a maintenance engineer.",
    "Summarize this SOP.",
    "What PPE is required before furnace maintenance?",
    "Explain blast furnace operation.",
    "How should a new employee begin learning?"
  ];

  const suggestedChips = [
    "Explain Lockout-Tagout",
    "Summarize SOP",
    "Learning Roadmap",
    "Safety Guidelines",
    "Troubleshooting",
    "Machine Maintenance",
    "Training Recommendation"
  ];

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat.messages, activeWorkflow, workflowStep]);

  // Handle Form Submit
  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    onSendMessage("user", query);
    setInput("");

    // Start reasoning workflow animation
    setActiveWorkflow(query);
    setWorkflowStep(0);
  };

  // Reasoning step animation loop
  useEffect(() => {
    if (activeWorkflow === null) return;

    if (workflowStep < workflowSteps.length) {
      const timer = setTimeout(() => {
        setWorkflowStep((prev) => prev + 1);
      }, 650);
      return () => clearTimeout(timer);
    } else {
      // Completed animation. Add actual AI answer.
      const detectedLang = detectLanguage(activeWorkflow);
      
      let aiMsg = {};
      if (activeChat.document) {
        const docName = activeChat.document.name;
        let ans = `Based on the uploaded document "${docName}":\n\n`;
        const qLower = activeWorkflow.toLowerCase();

        if (qLower.includes("loto") || qLower.includes("lockout") || qLower.includes("safety") || qLower.includes("procedures")) {
          ans += "The document states that Lockout-Tagout (LOTO) procedures are mandatory prior to any mechanical maintenance. Technicians are strictly required to use insulated padlocks and carry tag labels with date and name stamps.";
        } else if (qLower.includes("summarize") || qLower.includes("summary") || qLower.includes("sop") || qLower.includes("manual")) {
          ans += "Here is the summary of the main clauses:\n- Section A details standard tool specifications and torque limits.\n- Section B defines mandatory physical hazards isolation checks before startup.\n- Section C mandates dielectric tests for electrical transformers.";
        } else if (qLower.includes("temperature") || qLower.includes("tuyere") || qLower.includes("fault") || qLower.includes("maintenance")) {
          ans += "The manual highlights monthly infrared thermographic tests. Any termination exceeding 55°C must be reported to the Lead Maintenance Engineer immediately.";
        } else {
          ans += `The document contains technical specifications for ${docName.split('.')[0]}. It details safety rules, LOTO rules, and check cycles. Please let me know if you would like me to extract torque values or safety guidelines.`;
        }

        aiMsg = {
          sender: "ai",
          text: ans,
          source: docName,
          learning: ["Industrial LOTO Basics", "Equipment Safety Procedures"],
          topics: ["Lockout-Tagout", "Thermographic Checks", "PPE Requirements"],
          intent: "Document Q&A",
          tool: "Document Reading Pipeline"
        };
      } else {
        const userMessages = activeChat.messages
          .filter(m => m.sender === "user" && m.text !== activeWorkflow)
          .map(m => m.text);
        const responseData = getResponseForQuery(activeWorkflow, userMessages);
        aiMsg = {
          sender: "ai",
          text: responseData.ans,
          source: responseData.source,
          learning: responseData.learning,
          topics: responseData.topics,
          intent: responseData.intent,
          tool: responseData.tool
        };
      }

      onSendMessage("ai", aiMsg);
      setActiveWorkflow(null);
      setWorkflowStep(0);
    }
  }, [activeWorkflow, workflowStep]);

  // Handle File Input selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      simulateFileUpload(file.name, file.size);
    }
  };

  // Simulate upload parser
  const simulateFileUpload = (fileName, fileSize) => {
    setIsUploading(true);
    setUploadProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        
        const sizeStr = (fileSize / 1024).toFixed(1) + " KB";
        const base = fileName.split(".")[0];
        
        const documentData = {
          name: fileName,
          size: sizeStr,
          summary: `Summary of ${base}:\nThis file provides official guidelines regarding safety protocols and operational parameters for L&D. It covers zero-energy state checks, mandatory thermographic imaging inspection lists, and PPE protocols (auto-darkening helmet shade 10-14).`,
          topics: ["LOTO Compliance", "Monthly Thermography Checks", "Insulated Padlocks", "PPE shade standards"],
          questions: [`What LOTO rules apply to ${base}?`, `What are the temperature inspection guidelines?`, `Summarize section 2 of this file.`]
        };

        onAttachDocument(documentData);
        setIsUploading(false);

        // Add System Messages to chat representing successful upload
        onSendMessage("user", `[Uploaded document: ${fileName}]`);
        
        const aiMessage = {
          sender: "ai",
          text: `✔ Document "${fileName}" uploaded successfully.\n\nHere is an automatically generated extraction summary:\n\n**Summary:**\n${documentData.summary}\n\n**Key Topics:**\n${documentData.topics.map(t => `• ${t}`).join("\n")}`,
          source: fileName,
          learning: ["Document Parsing Basics", "Context-Aware Q&A"],
          topics: documentData.topics,
          intent: "Document Summary",
          tool: "Document Summarization Tool"
        };
        onSendMessage("ai", aiMessage);
      }
    }, 150);
  };

  const getLanguageTag = (msgText) => {
    const lang = detectLanguage(msgText);
    if (lang === "en") return null;
    const langNames = { hi: "HINDI", mr: "MARATHI", bn: "BENGALI", pa: "PUNJABI", te: "TELUGU" };
    return (
      <span style={{ fontSize: "10px", color: "var(--accent-light)", border: "1px solid rgba(59, 130, 246, 0.3)", background: "rgba(59, 130, 246, 0.08)", padding: "0.15rem 0.4rem", borderRadius: "4px", display: "inline-flex", alignItems: "center", gap: "0.25rem", fontWeight: "600" }}>
        <Languages size={11} /> AUTO DETECTED: {langNames[lang]}
      </span>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", position: "relative" }}>
      <div className="grid-bg" />
      <div className="logo-radial-glow" />

      {/* Desktop Header */}
      <header className="chat-header glass desktop-header" style={{
        height: "4rem",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2rem",
        background: "rgba(9, 13, 26, 0.75)",
        backdropFilter: "blur(20px)",
        zIndex: 50,
        position: "relative"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "18px", fontWeight: "800", color: "white", fontFamily: "var(--font-serif)", letterSpacing: "-0.01em" }}>Kai</span>
            <span style={{ color: "var(--text-secondary)", opacity: 0.4 }}>·</span>
            <span style={{ fontSize: "14px", color: "var(--text-secondary)", fontStyle: "italic", fontFamily: "var(--font-sans)" }}>
              Mentora's AI assistant
            </span>
          </div>
        </div>

        {/* Right Section - Online Indicator */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "rgba(16, 185, 129, 0.05)",
          border: "1px solid rgba(16, 185, 129, 0.2)",
          padding: "0.35rem 0.85rem",
          borderRadius: "99px",
          fontSize: "12px",
          color: "#10B981",
          fontWeight: "600",
          fontFamily: "var(--font-title)"
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10B981" }} />
          Online
        </div>
      </header>

      {/* Mobile Header (Top-Left Burger & Brand Name, Top-Right Temporary Chat) */}
      <header className="chat-header glass mobile-header chat-mobile-header" style={{
        height: "4rem",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1.25rem",
        background: "rgba(9, 13, 26, 0.8)",
        backdropFilter: "blur(20px)",
        zIndex: 50,
        position: "relative"
      }}>
        {/* Left Side: Sidebar Burger Toggle Button & Kai Brand Label */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button 
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px",
              transition: "all 0.2s"
            }}
            className="mobile-burger-btn scale-hover"
            title="Toggle Sidebar"
          >
            <Menu size={24} />
          </button>
          <span style={{ fontSize: "17px", fontWeight: "800", color: "white", fontFamily: "var(--font-serif)" }}>Kai</span>
        </div>

        {/* Right Side: Temporary Chat Option Symbol */}
        <button 
          onClick={onStartTemporaryChat}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "var(--accent-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "4px",
            transition: "all 0.2s"
          }}
          className="mobile-temp-chat-btn scale-hover"
          title="Start Temporary Chat"
        >
          <Ghost size={24} />
        </button>
      </header>

      {/* Chat scroll box */}
      <div style={{ flex: 1, overflowY: "auto", padding: "2.5rem 2rem", display: "flex", flexDirection: "column", gap: "2rem", position: "relative", zIndex: 2 }}>
        
        {activeChat.temporary && (
          <div style={{
            background: "rgba(168, 85, 247, 0.08)",
            border: "1px solid rgba(168, 85, 247, 0.2)",
            borderRadius: "10px",
            padding: "0.75rem 1rem",
            color: "#d8b4fe",
            fontSize: "13px",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            maxWidth: "800px",
            margin: "0 auto 0.5rem auto",
            width: "100%",
            justifyContent: "center",
            zIndex: 10
          }}>
            <Ghost size={16} />
            <span><strong>Temporary Chat:</strong> Messages are not saved to your profile history.</span>
          </div>
        )}

        {activeChat.messages.length === 0 ? (
          // Redesigned empty state matching Figma spec
          <div className="fade-in" style={{ maxWidth: "800px", margin: "auto", display: "flex", flexDirection: "column", gap: "2.5rem", width: "100%", textAlign: "center", padding: "1.5rem 0" }}>
            
            {/* Central Branding */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem" }}>
              <img src="/logo.png" alt="Kai Logo" className="logo-pulse" style={{ width: "56px", height: "56px", borderRadius: "14px", objectFit: "cover" }} />
              <div>
                <h1 className="h-main" style={{ color: "#FFFFFF", marginBottom: "0.5rem" }}>
                  Hi <span style={{ fontFamily: "var(--font-cursive)", color: "var(--accent-light)", fontSize: "1.25em", fontWeight: "600", textTransform: "capitalize" }}>{getFirstName(user?.name)}</span>, How can I help you today?
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "15px", fontWeight: "400" }}>
                  Ask me anything — I'm here to guide and inspire.
                </p>
              </div>
            </div>

            {/* 2x2 Starter Cards Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }} className="capabilities-grid">
              
              <div className="feature-card" onClick={() => handleSend("Can you explain how machine learning works in simple terms?")}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--accent-light)", fontWeight: "600", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                  EXPLAIN A CONCEPT
                </div>
                <p style={{ fontSize: "14px", color: "#FFFFFF", fontWeight: "500", lineHeight: "1.4" }}>
                  Can you explain how machine learning works in simple terms?
                </p>
              </div>

              <div className="feature-card" onClick={() => handleSend("Help me brainstorm creative ways to improve my study habits.")}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--accent-light)", fontWeight: "600", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                  BRAINSTORM IDEAS
                </div>
                <p style={{ fontSize: "14px", color: "#FFFFFF", fontWeight: "500", lineHeight: "1.4" }}>
                  Help me brainstorm creative ways to improve my study habits.
                </p>
              </div>

              <div className="feature-card" onClick={() => handleSend("What are the most important skills to develop in the next decade?")}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--accent-light)", fontWeight: "600", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                  ASK ANYTHING
                </div>
                <p style={{ fontSize: "14px", color: "#FFFFFF", fontWeight: "500", lineHeight: "1.4" }}>
                  What are the most important skills to develop in the next decade?
                </p>
              </div>

              <div className="feature-card" onClick={() => handleSend("Summarize the key principles of effective communication.")}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--accent-light)", fontWeight: "600", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                  QUICK SUMMARY
                </div>
                <p style={{ fontSize: "14px", color: "#FFFFFF", fontWeight: "500", lineHeight: "1.4" }}>
                  Summarize the key principles of effective communication.
                </p>
              </div>

            </div>
          </div>
        ) : (
          // Message stream (redesigned with sub-cards and avatars)
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem", maxWidth: "800px", width: "100%", margin: "0 auto" }}>
            {activeChat.messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", gap: "1.25rem", width: "100%", alignItems: "flex-start" }} className="fade-in">
                
                {/* AI Avatar */}
                {msg.sender === "ai" && (
                  <div className="sparkle-logo" style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <Sparkles size={18} />
                  </div>
                )}

                <div style={{ flex: 1, display: "flex", flexDirection: "column", width: "100%" }}>
                  {msg.sender === "user" ? (
                    // User Message (gradient & shadow)
                    <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                      <div className="chat-bubble chat-bubble-user" style={{ wordBreak: "break-word", maxWidth: "80%" }}>
                        {msg.text}
                      </div>
                    </div>
                  ) : (
                    // AI Message - simple and clean response bubble like ChatGPT / Gemini
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
                      
                      {/* Section 1: Main Answer Text */}
                      <div className="chat-bubble chat-bubble-ai" style={{ width: "100%", maxWidth: "100%" }}>
                        <div 
                          style={{ fontSize: "15px", lineHeight: "1.6" }}
                          dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }}
                        />
                      </div>

                      {/* Per-Message Action Overlay */}
                      <div className="message-action-overlay" style={{ marginTop: "0.25rem" }}>
                        <span style={{ color: "var(--text-muted)", marginRight: "0.25rem" }}>
                          {msg.time || new Date(activeChat.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <button className="message-action-btn" title="Copy response" onClick={() => navigator.clipboard.writeText(msg.text)}>
                          <Copy size={13} />
                        </button>
                        <button className="message-action-btn" title="Like">
                          <ThumbsUp size={13} />
                        </button>
                        <button className="message-action-btn" title="Dislike">
                          <ThumbsDown size={13} />
                        </button>
                      </div>

                    </div>
                  )}
                </div>



              </div>
            ))}
          </div>
        )}

        {/* Reasoning workflow step loaders (Checkmarks) */}
        {activeWorkflow && (
          <div style={{ maxWidth: "800px", width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", gap: "1.25rem" }}>
              <div style={{ width: "36px" }} />
              
              <div className="reasoning-box slide-up" style={{ 
                width: "100%", 
                background: "transparent", 
                border: "none", 
                padding: "0.25rem 0",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem"
              }}>
                <button
                  type="button"
                  onClick={() => setIsReasoningExpanded(!isReasoningExpanded)}
                  style={{
                    background: "none",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "500",
                    outline: "none",
                    padding: 0,
                    width: "fit-content"
                  }}
                >
                  <Brain className="agent-spinner" size={16} style={{ color: "var(--accent-light)" }} />
                  <span>
                    {workflowStep < workflowSteps.length - 1 
                      ? `${workflowSteps[workflowStep]?.label || "Thinking..."}`
                      : "Thinking..."}
                  </span>
                  {isReasoningExpanded ? <ChevronUp size={14} style={{ opacity: 0.6 }} /> : <ChevronDown size={14} style={{ opacity: 0.6 }} />}
                </button>

                {isReasoningExpanded && (
                  <div style={{
                    marginTop: "0.25rem",
                    padding: "0.75rem 1rem",
                    borderRadius: "12px",
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    width: "fit-content",
                    minWidth: "240px",
                    animation: "fadeIn 0.2s ease-out"
                  }}>
                    {workflowSteps.map((step, idx) => {
                      const StepIcon = step.icon;
                      const isActive = workflowStep === idx;
                      const isCompleted = workflowStep > idx;
                      return (
                        <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.5rem", opacity: isCompleted || isActive ? 1 : 0.4 }}>
                          {isCompleted ? (
                            <ShieldCheck size={14} style={{ color: "var(--success)" }} />
                          ) : isActive ? (
                            <div className="agent-spinner" style={{ border: "1.5px solid var(--accent-light)", borderTopColor: "transparent", borderRadius: "50%", width: "10px", height: "10px" }} />
                          ) : (
                            <StepIcon size={13} style={{ color: "var(--border)" }} />
                          )}
                          <span style={{ fontSize: "12px", fontWeight: isActive ? "600" : "400", color: isActive ? "white" : "var(--text-secondary)" }}>{step.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            
            {/* Animated Typing Dots */}
            <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
              <div className="sparkle-logo" style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}>
                <Sparkles size={18} />
              </div>
              <div className="typing-bubble">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          </div>
        )}

        {/* Simulated Document upload status card */}
        {isUploading && (
          <div style={{ maxWidth: "800px", width: "100%", margin: "0 auto", display: "flex", gap: "1.25rem" }}>
            <div style={{ width: "36px" }} />
            <div className="card-dark slide-up" style={{ width: "100%", padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
              <FileUp size={24} style={{ color: "var(--accent)" }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "600", marginBottom: "0.25rem" }}>
                  <span>Parsing uploaded document and building vector indices...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div style={{ width: "100%", height: "4px", background: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ width: `${uploadProgress}%`, height: "100%", background: "var(--accent)", transition: "width 0.15s" }} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating glassmorphic input footer */}
      <div style={{ padding: "1.5rem", backgroundColor: "var(--bg-app)", zIndex: 10, position: "relative" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          
          {/* Quick chips above floating inputs - only show when typing */}
          {input.trim() !== "" && (
            <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.25rem" }} className="no-scrollbar">
              {activeChat.document ? (
                activeChat.document.questions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="prompt-chip"
                    style={{ background: "rgba(59, 130, 246, 0.08)", borderColor: "rgba(59, 130, 246, 0.2)", color: "var(--accent-light)" }}
                  >
                    {q}
                  </button>
                ))
              ) : (
                suggestedChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(chip)}
                    className="prompt-chip"
                  >
                    {chip}
                  </button>
                ))
              )}
            </div>
          )}

            {/* Floating glassmorphic input bar */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="floating-input-bar"
            >
              {/* Hidden File Input */}
              <input 
                type="file" 
                accept=".pdf,.docx,.txt" 
                ref={fileInputRef} 
                onChange={handleFileChange}
                style={{ display: "none" }} 
              />

              {/* Paperclip attachment button */}
              <button
                type="button"
                disabled={activeWorkflow !== null}
                onClick={() => fileInputRef.current?.click()}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-secondary)", display: "flex", alignItems: "center" }}
                className="hover-white"
              >
                <Paperclip size={20} />
              </button>

              {/* Prompt input field */}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={activeWorkflow !== null}
                placeholder={activeChat.document ? `Ask questions specifically about "${activeChat.document.name}"...` : "Message Kai..."}
                style={{
                  flex: 1,
                  minWidth: "0px",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "white",
                  fontSize: "15px",
                  padding: "0.5rem 0"
                }}
              />

              {/* Mic button (UI only) */}
              <button
                type="button"
                style={{ background: "transparent", border: "none", cursor: "default", color: "var(--text-secondary)", display: "flex", alignItems: "center" }}
              >
                <Mic size={20} />
              </button>

              {/* Send button (Dynamic state) */}
              <button
                type="submit"
                disabled={activeWorkflow !== null || !input.trim()}
                style={
                  !input.trim() 
                    ? {
                        background: "transparent",
                        border: "none",
                        cursor: "not-allowed",
                        color: "var(--text-muted)",
                        display: "flex",
                        alignItems: "center"
                      }
                    : {
                        background: "var(--accent-gradient)",
                        border: "none",
                        cursor: "pointer",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        boxShadow: "0 0 10px rgba(79, 70, 229, 0.35)"
                      }
                }
              >
                <Send size={!input.trim() ? 20 : 15} />
              </button>
            </form>

            {/* Helper text instructions */}
            <div style={{
              textAlign: "center",
              fontSize: "11px",
              fontFamily: "var(--font-mono)",
              color: "var(--text-muted)",
              marginTop: "0.15rem"
            }}>
              Press Enter to send · Shift+Enter for new line
            </div>

        </div>
      </div>

      <style>{`
        .chat-mobile-header {
          display: none !important;
        }
        .hover-white:hover {
          color: white !important;
        }
        .hover-white:disabled {
          opacity: 0.3 !important;
          cursor: not-allowed !important;
        }
        @media (max-width: 768px) {
          .chat-mobile-header {
            display: flex !important;
          }
          .capabilities-grid {
            grid-template-columns: 1fr !important;
          }
          .desktop-header-badges {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
