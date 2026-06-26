import React from "react";
import { 
  Mic, 
  Share2, 
  BarChart3, 
  Compass, 
  ClipboardCheck, 
  Layers, 
  Smartphone, 
  BrainCircuit, 
  Network 
} from "lucide-react";

export default function FutureScope() {
  const enhancements = [
    {
      title: "Voice Assistant Integration",
      desc: "Allow shop floor technicians to query safety procedures hands-free using offline voice recognition.",
      icon: Mic,
      color: "hsl(221, 83%, 53%)"
    },
    {
      title: "Multi-Agent AI Reasoning",
      desc: "Coordinate multiple specialized agents (e.g. Safety Agent, Electrical Agent, Operations Agent) for complex cross-disciplinary inquiries.",
      icon: Share2,
      color: "hsl(199, 89%, 48%)"
    },
    {
      title: "Advanced Learning Analytics",
      desc: "Provide L&D administrators with deep insights into course completion speeds, quiz score trends, and learning engagement metrics.",
      icon: BarChart3,
      color: "hsl(142, 71%, 45%)"
    },
    {
      title: "Skill Gap Analysis",
      desc: "Automatically map employee quiz scores against role requirements to identify organizational training deficiencies.",
      icon: Compass,
      color: "hsl(270, 90%, 50%)"
    },
    {
      title: "AI Assessment Generator",
      desc: "Instantly draft customized review quizzes and practical evaluation check-sheets based on uploaded operational manuals.",
      icon: ClipboardCheck,
      color: "hsl(35, 92%, 50%)"
    },
    {
      title: "HRMS Integration",
      desc: "Connect seamlessly with existing Workday, SAP SuccessFactors, or local databases to sync employee profile roles.",
      icon: Layers,
      color: "hsl(0, 84%, 60%)"
    },
    {
      title: "LMS Integration",
      desc: "Export courses and path completions directly to SCORM-compliant Learning Management Systems.",
      icon: Network,
      color: "hsl(180, 80%, 40%)"
    },
    {
      title: "Mobile App Companion",
      desc: "Native iOS and Android apps with full offline synchronization for offline field operations in high-security facilities.",
      icon: Smartphone,
      color: "hsl(320, 80%, 50%)"
    },
    {
      title: "Predictive Learning Paths",
      desc: "Leverage machine learning to suggest preventative training modules based on recent machinery breakdown logs.",
      icon: BrainCircuit,
      color: "hsl(160, 80%, 35%)"
    }
  ];

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "700" }}>Future Enhancements</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          Explore the technological roadmap planned for Mentora's enterprise deployment.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
        {enhancements.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx} 
              className="glass scale-up-hover" 
              style={{
                padding: "1.5rem",
                borderRadius: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                border: "1px solid var(--border)"
              }}
            >
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: `${item.color}15`,
                color: item.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Icon size={20} />
              </div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: "600" }}>{item.title}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", lineHeight: "1.4" }}>
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
