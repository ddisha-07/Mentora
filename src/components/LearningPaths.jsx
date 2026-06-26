import React, { useState } from "react";
import { Award, CheckCircle2, Circle, Clock, BookOpen, AlertCircle, FileText, ArrowRight, ShieldCheck } from "lucide-react";
import { mockLearningPaths } from "../data/mockData";

export default function LearningPaths({ selectedPathId, setSelectedPathId }) {
  const [paths, setPaths] = useState(mockLearningPaths);

  const handleToggleStep = (pathKey, stepId) => {
    const path = paths[pathKey];
    const updatedSteps = path.steps.map((step) => {
      if (step.id === stepId) {
        let newStatus = "Locked";
        if (step.status === "Locked") newStatus = "In Progress";
        else if (step.status === "In Progress") newStatus = "Completed";
        else newStatus = "Locked";

        return { ...step, status: newStatus, score: newStatus === "Completed" ? "Passed" : "-" };
      }
      return step;
    });

    // Recalculate progress percentage
    const completedCount = updatedSteps.filter((s) => s.status === "Completed").length;
    const progress = Math.round((completedCount / updatedSteps.length) * 100);

    setPaths({
      ...paths,
      [pathKey]: {
        ...path,
        steps: updatedSteps,
        progress
      }
    });
  };

  const getStepIcon = (status) => {
    switch (status) {
      case "Completed": return <CheckCircle2 size={18} style={{ color: "var(--success)" }} />;
      case "In Progress": return <Clock size={18} style={{ color: "var(--primary)" }} />;
      default: return <Circle size={18} style={{ color: "var(--text-secondary)", opacity: 0.5 }} />;
    }
  };

  const activePath = paths[selectedPathId];

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "700" }}>Learning roadmaps & Certifications</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          Track structured training programs and industrial certifications.
        </p>
      </div>

      {/* Path Tabs Selector */}
      <div style={{ display: "flex", gap: "1rem", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>
        {Object.entries(paths).map(([key, path]) => (
          <button
            key={key}
            onClick={() => setSelectedPathId(key)}
            style={{
              padding: "0.6rem 1.25rem",
              background: "none",
              border: "none",
              borderBottom: selectedPathId === key ? "3px solid var(--primary)" : "3px solid transparent",
              color: selectedPathId === key ? "var(--primary)" : "var(--text-secondary)",
              fontWeight: selectedPathId === key ? "700" : "500",
              fontSize: "0.95rem",
              cursor: "pointer",
              outline: "none"
            }}
          >
            {path.title}
          </button>
        ))}
      </div>

      {/* Main Roadmap Details */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "2rem", width: "100%" }}>
        
        {/* Left Side: Step checklist road nodes */}
        <div className="glass" style={{ padding: "2rem", borderRadius: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: "700" }}>Roadmap Workflow</h3>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontStyle: "italic" }}>
              Click nodes to toggle progress
            </span>
          </div>

          <div className="roadmap-flow">
            {activePath.steps.map((step, idx) => (
              <div 
                key={step.id} 
                className={`roadmap-step ${step.status.toLowerCase().replace(" ", "-")}`}
                style={{ cursor: "pointer" }}
                onClick={() => handleToggleStep(selectedPathId, step.id)}
              >
                {/* Flow Connector Dot */}
                <div className="roadmap-node" />
                
                {/* Step content box */}
                <div 
                  className="scale-up-hover"
                  style={{
                    flex: 1,
                    background: step.status === "In Progress" ? "var(--primary-light)" : "white",
                    border: step.status === "In Progress" ? "1px solid var(--border-focus)" : "1px solid var(--border)",
                    padding: "1rem 1.25rem",
                    borderRadius: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    {getStepIcon(step.status)}
                    <div>
                      <h4 style={{ 
                        fontSize: "0.95rem", 
                        fontWeight: "600", 
                        color: step.status === "Locked" ? "var(--text-secondary)" : "var(--text-primary)",
                        textDecoration: step.status === "Completed" ? "line-through" : "none",
                        opacity: step.status === "Locked" ? 0.7 : 1
                      }}>
                        {step.name}
                      </h4>
                      <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.15rem" }}><Clock size={10} /> {step.duration}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.15rem" }}><FileText size={10} /> {step.type}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <span style={{ 
                      fontSize: "0.8rem", 
                      fontWeight: "700", 
                      color: step.score.includes("%") || step.score === "Passed" ? "var(--success)" : "var(--text-secondary)" 
                    }}>
                      {step.score}
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Progress overview & details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Progress Card */}
          <div className="glass" style={{ padding: "1.5rem", borderRadius: "16px", background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)", color: "white" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "white", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Award size={20} /> Certification Progress
            </h3>
            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.8)", marginBottom: "1.5rem" }}>
              {activePath.department}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", fontWeight: "600" }}>
                <span>Overall Completion</span>
                <span>{activePath.progress}%</span>
              </div>
              <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.2)", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: `${activePath.progress}%`, height: "100%", background: "white", borderRadius: "4px", transition: "width 0.3s ease" }} />
              </div>
            </div>

            {activePath.progress === 100 && (
              <div style={{ marginTop: "1.5rem", background: "rgba(255,255,255,0.15)", padding: "0.75rem", borderRadius: "8px", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", fontWeight: "600" }}>
                <ShieldCheck size={18} /> Congratulations! You have fully certified.
              </div>
            )}
          </div>

          {/* Guidelines */}
          <div className="glass" style={{ padding: "1.5rem", borderRadius: "16px" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <AlertCircle size={16} style={{ color: "var(--primary)" }} /> Roadmap Rules
            </h3>
            <ul style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "0.5rem", paddingLeft: "1.2rem" }}>
              <li>Complete courses and SOP read reviews to unlock assessments.</li>
              <li>You must score at least <strong>80%</strong> on assessments to pass.</li>
              <li>Failing an assessment triggers a review recommendations cycle.</li>
              <li>Practical assessments require physical retired expert approval signoffs.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
