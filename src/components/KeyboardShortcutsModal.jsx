import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function KeyboardShortcutsModal({ isOpen, onClose, shortcuts, onSaveShortcut, onRestoreDefaults }) {
  const [recordingId, setRecordingId] = useState(null);

  useEffect(() => {
    if (!recordingId) return;

    const handleGlobalKeyDown = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const key = e.key;
      if (key === "Control" || key === "Alt" || key === "Shift" || key === "Meta") {
        // Wait for base key
        return;
      }

      // Base key captured! Construct custom shortcut array
      const newKeys = [];
      if (e.ctrlKey || e.metaKey) newKeys.push("Ctrl");
      if (e.altKey) newKeys.push("Alt");
      if (e.shiftKey) newKeys.push("Shift");

      let baseKey = key;
      if (baseKey === " ") baseKey = "Space";
      if (baseKey === "ArrowUp") baseKey = "Up";
      if (baseKey === "ArrowDown") baseKey = "Down";
      if (baseKey === "ArrowLeft") baseKey = "Left";
      if (baseKey === "ArrowRight") baseKey = "Right";
      
      if (baseKey.length === 1) {
        baseKey = baseKey.toUpperCase();
      }

      onSaveShortcut(recordingId, { keys: newKeys });
      setRecordingId(null);
    };

    window.addEventListener("keydown", handleGlobalKeyDown, true);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown, true);
  }, [recordingId, onSaveShortcut]);

  if (!isOpen) return null;

  // Group shortcuts by section
  const sections = ["Composer", "App"];

  return (
    <div className="modal-overlay" style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(9, 9, 11, 0.82)",
      backdropFilter: "blur(12px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1100,
      padding: "1rem"
    }}>
      <div className="slide-up" style={{
        width: "100%",
        maxWidth: "520px",
        maxHeight: "92vh",
        backgroundColor: "rgba(23, 23, 23, 0.95)",
        backdropFilter: "blur(32px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "20px",
        color: "#ececec",
        boxShadow: "0 24px 60px rgba(0, 0, 0, 0.6)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative"
      }}>
        {/* Mobile Drag Handle */}
        <div className="mobile-drag-handle">
          <div className="drag-handle-pill"></div>
        </div>

        {/* Close Circular Button */}
        <button 
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            background: "transparent",
            border: "1.5px solid rgba(255, 255, 255, 0.25)",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "white",
            transition: "all 0.2s"
          }}
          className="hover-circle-close"
          title="Close"
        >
          <X size={16} />
        </button>

        {/* Title & Subtitle */}
        <div style={{ padding: "2.25rem 2.25rem 0.5rem 2.25rem" }}>
          <h2 style={{
            fontSize: "17px",
            fontWeight: "600",
            textAlign: "center",
            margin: "0 0 0.75rem 0",
            color: "white",
            fontFamily: "var(--font-title)"
          }}>
            Keyboard shortcuts
          </h2>
          <p style={{
            fontSize: "12.5px",
            color: "rgba(255, 255, 255, 0.5)",
            textAlign: "center",
            margin: 0,
            lineHeight: 1.4
          }}>
            To change a shortcut, select the key combination, and then type the new keys.
          </p>
        </div>

        {/* Sections & Shortcut Lists */}
        <div style={{
          padding: "1.25rem 2.25rem 1.5rem 2.25rem",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem"
        }}>
          {sections.map((section) => {
            const sectionItems = shortcuts.filter(s => s.section === section);
            if (sectionItems.length === 0) return null;

            return (
              <div key={section} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <h3 style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "rgba(255, 255, 255, 0.6)",
                  margin: "0 0 0.25rem 0"
                }}>
                  {section}
                </h3>
                
                {/* Row Container */}
                <div style={{
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  borderRadius: "12px",
                  padding: "0.25rem 0.75rem"
                }}>
                  {sectionItems.map((s, idx) => {
                    const isRecording = recordingId === s.id;
                    return (
                      <div 
                        key={s.id} 
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "0.65rem 0",
                          borderBottom: idx === sectionItems.length - 1 ? "none" : "1px solid rgba(255, 255, 255, 0.04)"
                        }}
                      >
                        {/* Toggle Switch + Description */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          {/* Toggle Switch */}
                          <div 
                            onClick={() => onSaveShortcut(s.id, { enabled: !s.enabled })}
                            style={{
                              width: "34px",
                              height: "18px",
                              borderRadius: "9px",
                              backgroundColor: s.enabled ? "var(--accent)" : "rgba(255, 255, 255, 0.1)",
                              position: "relative",
                              cursor: "pointer",
                              transition: "all 0.2s"
                            }}
                          >
                            <div style={{
                              width: "12px",
                              height: "12px",
                              borderRadius: "50%",
                              backgroundColor: "white",
                              position: "absolute",
                              top: "3px",
                              left: s.enabled ? "19px" : "3px",
                              transition: "all 0.2s"
                            }} />
                          </div>

                          <span style={{
                            fontSize: "13.5px",
                            fontWeight: "500",
                            color: s.enabled ? "#ffffff" : "rgba(255,255,255,0.3)",
                            transition: "all 0.2s"
                          }}>
                            {s.desc}
                          </span>
                        </div>

                        {/* Interactive Keycaps */}
                        <div 
                          onClick={() => s.enabled && setRecordingId(s.id)}
                          style={{
                            padding: "0.3rem 0.6rem",
                            borderRadius: "6px",
                            backgroundColor: isRecording ? "rgba(139, 92, 246, 0.15)" : "transparent",
                            border: isRecording ? "1px solid var(--accent)" : "1px solid transparent",
                            cursor: s.enabled ? "pointer" : "default",
                            color: isRecording ? "var(--accent-light)" : s.enabled ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.2)",
                            fontSize: "13px",
                            fontWeight: "600",
                            transition: "all 0.2s",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem"
                          }}
                          className={s.enabled ? "key-caps-button" : ""}
                        >
                          {isRecording ? (
                            <span style={{ fontSize: "12px", fontStyle: "italic", animation: "pulse 1.5s infinite" }}>
                              Type new keys...
                            </span>
                          ) : (
                            s.keys.join(" + ")
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: "1.25rem 2.25rem 2rem 2.25rem",
          display: "flex",
          justifyContent: "flex-end"
        }}>
          <button 
            onClick={onRestoreDefaults}
            style={{
              padding: "0.55rem 1.25rem",
              fontSize: "12.5px",
              fontWeight: "600",
              borderRadius: "20px",
              border: "none",
              background: "rgba(255, 255, 255, 0.08)",
              color: "white",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            className="hover-grey-bg"
          >
            Restore defaults
          </button>
        </div>

        <style>{`
          .hover-circle-close:hover {
            background-color: rgba(255, 255, 255, 0.08) !important;
            border-color: white !important;
          }
          .hover-grey-bg:hover {
            background-color: rgba(255, 255, 255, 0.15) !important;
          }
          .key-caps-button:hover {
            background-color: rgba(255, 255, 255, 0.05) !important;
            color: white !important;
          }
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
        `}</style>
      </div>
    </div>
  );
}
