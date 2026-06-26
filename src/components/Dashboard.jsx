import React, { useState, useEffect } from "react";
import { 
  Users, 
  FileText, 
  BookOpen, 
  MessageSquare,
  ArrowUpRight,
  TrendingUp,
  Plus,
  CheckCircle2,
  Calendar,
  ShieldAlert,
  ArrowRight,
  MessageCircle,
  HelpCircle
} from "lucide-react";

// CountUp animator component
function AnimatedNumber({ value, suffix = "" }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10);
    if (isNaN(end)) return;
    
    const duration = 1200; // Total duration in ms
    const frameRate = 1000 / 60; // 60 FPS
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Ease out quad formula
      const easeVal = progress * (2 - progress);
      const currentVal = Math.round(easeVal * end);
      
      if (frame >= totalFrames) {
        clearInterval(timer);
        setCurrent(end);
      } else {
        setCurrent(currentVal);
      }
    }, frameRate);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{current.toLocaleString()}{suffix}</span>;
}

export default function Dashboard({ userRole, setCurrentTab }) {
  const [expertFaqs, setExpertFaqs] = useState([
    { question: "What is the pre-heating period for slag runner refurbishment?", department: "Operations", status: "Approved" },
    { question: "How to isolate the high-voltage capacitor panel before manual grounding?", department: "Electrical", status: "Approved" }
  ]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newDept, setNewDept] = useState("Operations");

  const handleAddFaq = (e) => {
    e.preventDefault();
    if (!newQuestion || !newAnswer) return;
    alert("Expert FAQs added successfully! Saved to the institutional knowledge base.");
    setExpertFaqs([
      { question: newQuestion, department: newDept, status: "Approved" },
      ...expertFaqs
    ]);
    setNewQuestion("");
    setNewAnswer("");
  };

  // Static stats definition
  const stats = [
    { label: "Total Employees", value: 1248, icon: Users, color: "var(--primary)" },
    { label: "Total Documents", value: 342, icon: FileText, color: "var(--secondary)" },
    { label: "Active Learning Modules", value: 18, icon: BookOpen, color: "var(--success)" },
    { label: "AI Queries Today", value: 256, icon: MessageSquare, color: "var(--warning)" }
  ];

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Welcome banner */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: "700" }}>
            Welcome back, {userRole === "Administrator" ? "Alex" : userRole === "Retired Expert" ? "Harish" : "Siddharth"}
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Here is your L&D overview for today. Role: <span style={{ fontWeight: "600", color: "var(--primary)" }}>{userRole}</span>
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "white", padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
          <Calendar size={16} style={{ color: "var(--text-secondary)" }} />
          <span style={{ fontSize: "0.85rem", fontWeight: "500" }}>June 25, 2026</span>
        </div>
      </div>

      {/* Stats Counter Section */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass scale-up-hover" style={{ padding: "1.5rem", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: "500", color: "var(--text-secondary)" }}>{stat.label}</span>
                <span style={{ fontSize: "2rem", fontWeight: "800", color: "var(--text-primary)", fontFamily: "var(--font-title)", lineHeight: 1 }}>
                  <AnimatedNumber value={stat.value} />
                </span>
              </div>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: `${stat.color}15`,
                color: stat.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Adapts based on Role */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem", width: "100%" }}>
        
        {/* Left Column depending on role */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Chart or Action Item */}
          {userRole === "Administrator" ? (
            <div className="glass" style={{ padding: "1.75rem", borderRadius: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: "600" }}>System Query Activity</h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Weekly breakdown of employee AI assistance searches</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--success)", fontSize: "0.85rem", fontWeight: "600" }}>
                  <TrendingUp size={16} /> +12.4% this week
                </div>
              </div>
              {/* Custom SVG Bar Chart */}
              <div style={{ height: "180px", display: "flex", alignItems: "flex-end", gap: "1.5rem", padding: "1rem 0" }}>
                {[140, 180, 160, 220, 190, 256].map((h, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ 
                      width: "100%", 
                      height: `${(h / 256) * 120}px`, 
                      background: "linear-gradient(to top, var(--primary) 0%, var(--secondary) 100%)",
                      borderRadius: "6px 6px 0 0",
                      position: "relative"
                    }} />
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: "500" }}>
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Today"][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : userRole === "Retired Expert" ? (
            <div className="glass" style={{ padding: "1.75rem", borderRadius: "16px" }}>
              <h3 style={{ fontSize: "1.15rem", fontWeight: "600", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Plus size={20} style={{ color: "var(--primary)" }} /> Contribute Knowledge / Lessons Learned
              </h3>
              <form onSubmit={handleAddFaq} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Department</label>
                    <select 
                      value={newDept} 
                      onChange={(e) => setNewDept(e.target.value)}
                      style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid var(--border)", outline: "none" }}
                    >
                      <option value="Operations">Operations</option>
                      <option value="Safety">Safety</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Electrical">Electrical</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Question Topic</label>
                    <input 
                      type="text" 
                      value={newQuestion} 
                      onChange={(e) => setNewQuestion(e.target.value)} 
                      placeholder="e.g. Blast furnace tuyere inspection intervals" 
                      style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid var(--border)", outline: "none" }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Lessons Learned / Expert Answer</label>
                  <textarea 
                    value={newAnswer} 
                    onChange={(e) => setNewAnswer(e.target.value)} 
                    rows="3" 
                    placeholder="Provide detailed best practices and troubleshooting recommendations..."
                    style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid var(--border)", outline: "none", resize: "none" }}
                  />
                </div>
                <button type="submit" className="btn-primary scale-up-hover" style={{ alignSelf: "flex-end" }}>
                  Publish Article
                </button>
              </form>
            </div>
          ) : (
            // Employee View
            <div className="glass" style={{ padding: "1.75rem", borderRadius: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <h3 style={{ fontSize: "1.15rem", fontWeight: "600" }}>Your Active Learning Paths</h3>
                <button onClick={() => setCurrentTab("paths")} style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.85rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.25rem", cursor: "pointer" }}>
                  View All Paths <ArrowRight size={16} />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ background: "white", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontWeight: "600", fontSize: "0.9rem" }}>Maintenance Engineer (Mechanical/Electrical)</span>
                    <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--primary)" }}>75% Complete</span>
                  </div>
                  <div style={{ width: "100%", height: "8px", background: "var(--border)", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ width: "75%", height: "100%", background: "var(--primary)", borderRadius: "4px" }} />
                  </div>
                </div>
                <div style={{ background: "white", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontWeight: "600", fontSize: "0.9rem" }}>Electrical Engineer Roadmap</span>
                    <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--primary)" }}>15% Complete</span>
                  </div>
                  <div style={{ width: "100%", height: "8px", background: "var(--border)", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ width: "15%", height: "100%", background: "var(--primary)", borderRadius: "4px" }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions Panel */}
          <div className="glass" style={{ padding: "1.75rem", borderRadius: "16px" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: "600", marginBottom: "1.25rem" }}>Quick L&D Actions</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              <div onClick={() => setCurrentTab("assistant")} style={{ cursor: "pointer", background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid var(--border)" }} className="scale-up-hover">
                <h4 style={{ fontSize: "0.95rem", fontWeight: "600", color: "var(--primary)", marginBottom: "0.25rem" }}>Consult AI Assistant</h4>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Ask LOTO safety details or furnace operations SOPs</p>
              </div>
              <div onClick={() => setCurrentTab("kb")} style={{ cursor: "pointer", background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid var(--border)" }} className="scale-up-hover">
                <h4 style={{ fontSize: "0.95rem", fontWeight: "600", color: "var(--primary)", marginBottom: "0.25rem" }}>Explore SOP Library</h4>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Browse the searchable document repository</p>
              </div>
              <div onClick={() => setCurrentTab("upload")} style={{ cursor: "pointer", background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid var(--border)" }} className="scale-up-hover">
                <h4 style={{ fontSize: "0.95rem", fontWeight: "600", color: "var(--primary)", marginBottom: "0.25rem" }}>Ingest New Document</h4>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Upload TXT/DOCX/PDF files and extract insights</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Information, Activity feed, or Admin pending alerts */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          {userRole === "Administrator" ? (
            <div className="glass" style={{ padding: "1.5rem", borderRadius: "16px", flex: 1 }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <ShieldAlert size={18} style={{ color: "var(--warning)" }} /> Admin Alerts
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ borderLeft: "3px solid var(--warning)", paddingLeft: "0.75rem" }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: "600" }}>Document Pending Review</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Welding Gas Standards updates submitted by Harish Mehta.</p>
                  <button onClick={() => setCurrentTab("kb")} style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.75rem", fontWeight: "600", cursor: "pointer", marginTop: "0.25rem" }}>
                    Review Document
                  </button>
                </div>
                <div style={{ borderLeft: "3px solid var(--primary)", paddingLeft: "0.75rem" }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: "600" }}>System Audit Completed</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Knowledge graph sync successfully completed at 02:00 AM.</p>
                </div>
              </div>
            </div>
          ) : userRole === "Retired Expert" ? (
            <div className="glass" style={{ padding: "1.5rem", borderRadius: "16px", flex: 1 }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "1.25rem" }}>My Contributions</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {expertFaqs.map((faq, i) => (
                  <div key={i} style={{ background: "white", padding: "0.85rem", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.8rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                      <span className="badge badge-training" style={{ padding: "0.15rem 0.4rem", fontSize: "0.65rem" }}>{faq.department}</span>
                      <span className="badge badge-approved" style={{ padding: "0.15rem 0.4rem", fontSize: "0.65rem" }}>{faq.status}</span>
                    </div>
                    <p style={{ fontWeight: "600", color: "var(--text-primary)" }}>{faq.question}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Employee view Right Column: Suggested learning topics & announcements
            <div className="glass" style={{ padding: "1.5rem", borderRadius: "16px", flex: 1 }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "1rem" }}>Trending Learning Topics</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {["Lockout-Tagout", "High Voltage Safety", "SMAW Welding", "Refractory Maintenance", "Infrared Scanning", "Burden Charging"].map((topic, i) => (
                  <span 
                    key={i} 
                    onClick={() => setCurrentTab("assistant")}
                    style={{ 
                      cursor: "pointer",
                      background: "white", 
                      border: "1px solid var(--border)", 
                      padding: "0.4rem 0.75rem", 
                      borderRadius: "20px", 
                      fontSize: "0.75rem", 
                      fontWeight: "500",
                      color: "var(--text-primary)"
                    }}
                    className="scale-up-hover"
                  >
                    {topic}
                  </span>
                ))}
              </div>

              <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem" }}>L&D Announcements</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.8rem" }}>
                <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: "0.75rem" }}>
                  <p style={{ fontWeight: "600" }}>Annual Safety Certification Deadline</p>
                  <p style={{ color: "var(--text-secondary)" }}>Please complete your EHS refreshers by November 30th.</p>
                </div>
                <div>
                  <p style={{ fontWeight: "600" }}>New Blast Furnace Manual Uploaded</p>
                  <p style={{ color: "var(--text-secondary)" }}>Amitabha Bose uploaded the new standard operating guide.</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
