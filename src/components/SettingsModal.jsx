import React, { useState, useEffect, useRef } from "react";
import { 
  X, Settings, Sliders, Cpu, Save, User, Sparkles, Key,
  Search, FileText, Calendar, Tag, MessageSquare, ArrowRight, Library,
  Layers, Workflow, Link2, Users, UsersRound, Mic, Database 
} from "lucide-react";
import { mockDocuments } from "../data/mockData";

// Theme and Accent helpers
const applyTheme = (appearance) => {
  const root = document.documentElement;
  if (appearance === "Light") {
    root.style.setProperty("--bg-app", "#F8FAFC");
    root.style.setProperty("--bg-sidebar", "#FFFFFF");
    root.style.setProperty("--bg-card", "#FFFFFF");
    root.style.setProperty("--bg-input", "#F1F5F9");
    root.style.setProperty("--text-primary", "#0F172A");
    root.style.setProperty("--text-secondary", "#475569");
    root.style.setProperty("--text-muted", "#94A3B8");
    root.style.setProperty("--border", "#E2E8F0");
    root.style.setProperty("--border-hover", "#CBD5E1");
  } else {
    // Dark (default)
    root.style.setProperty("--bg-app", "#090D1A");
    root.style.setProperty("--bg-sidebar", "#090D1A");
    root.style.setProperty("--bg-card", "rgba(13, 20, 38, 0.4)");
    root.style.setProperty("--bg-input", "#111625");
    root.style.setProperty("--text-primary", "#FFFFFF");
    root.style.setProperty("--text-secondary", "#8E9BAE");
    root.style.setProperty("--text-muted", "#5F6E80");
    root.style.setProperty("--border", "rgba(255, 255, 255, 0.08)");
    root.style.setProperty("--border-hover", "rgba(255, 255, 255, 0.16)");
  }
};

const applyAccentColor = (color) => {
  const root = document.documentElement;
  if (color === "Green") {
    root.style.setProperty("--accent", "#10B981");
    root.style.setProperty("--accent-hover", "#059669");
    root.style.setProperty("--accent-light", "#34D399");
    root.style.setProperty("--accent-gradient", "linear-gradient(135deg, #10B981 0%, #059669 100%)");
  } else if (color === "Blue") {
    root.style.setProperty("--accent", "#2563EB");
    root.style.setProperty("--accent-hover", "#1D4ED8");
    root.style.setProperty("--accent-light", "#60A5FA");
    root.style.setProperty("--accent-gradient", "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)");
  } else if (color === "Orange") {
    root.style.setProperty("--accent", "#EA580C");
    root.style.setProperty("--accent-hover", "#D97706");
    root.style.setProperty("--accent-light", "#FDBA74");
    root.style.setProperty("--accent-gradient", "linear-gradient(135deg, #EA580C 0%, #D97706 100%)");
  } else if (color === "Rose") {
    root.style.setProperty("--accent", "#E11D48");
    root.style.setProperty("--accent-hover", "#BE123C");
    root.style.setProperty("--accent-light", "#FDA4AF");
    root.style.setProperty("--accent-gradient", "linear-gradient(135deg, #E11D48 0%, #BE123C 100%)");
  } else {
    // Purple (default)
    root.style.setProperty("--accent", "#4F46E5");
    root.style.setProperty("--accent-hover", "#5850EC");
    root.style.setProperty("--accent-light", "#C084FC");
    root.style.setProperty("--accent-gradient", "linear-gradient(135deg, #4F46E5 0%, #5850EC 100%)");
  }
};

// Premium Custom Select Component
function CustomSelect({ value, onChange, options, align = "right" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedOption = options.find(opt => 
    typeof opt === "object" ? opt.value === value : opt === value
  );

  const displayLabel = typeof selectedOption === "object" ? selectedOption.label : selectedOption;
  const displayColor = typeof selectedOption === "object" ? selectedOption.colorCircle : null;

  return (
    <div ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "transparent",
          border: "none",
          color: "var(--text-primary)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "14px",
          fontWeight: "600",
          outline: "none",
          padding: "6px 12px",
          borderRadius: "6px",
          transition: "background 0.2s"
        }}
        className="custom-select-trigger"
      >
        {displayColor && (
          <span style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: displayColor,
            display: "inline-block"
          }} />
        )}
        <span>{displayLabel}</span>
        <span style={{ 
          fontSize: "9px", 
          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", 
          transition: "transform 0.2s",
          opacity: 0.7 
        }}>▼</span>
      </button>

      {/* Floating Options Menu */}
      {isOpen && (
        <div style={{
          position: "absolute",
          top: "100%",
          right: align === "right" ? 0 : "auto",
          left: align === "left" ? 0 : "auto",
          marginTop: "4px",
          background: "var(--bg-input)",
          backdropFilter: "blur(24px)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          boxShadow: "var(--shadow-md)",
          zIndex: 1100,
          minWidth: "160px",
          padding: "4px",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          maxHeight: "240px",
          overflowY: "auto"
        }}>
          {options.map((opt) => {
            const val = typeof opt === "object" ? opt.value : opt;
            const label = typeof opt === "object" ? opt.label : opt;
            const color = typeof opt === "object" ? opt.colorCircle : null;
            const isSelected = val === value;

            return (
              <button
                key={val}
                type="button"
                onClick={() => {
                  onChange(val);
                  setIsOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  width: "100%",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "6px",
                  border: "none",
                  background: isSelected ? "rgba(139, 92, 246, 0.12)" : "transparent",
                  color: isSelected ? "var(--accent-light)" : "var(--text-primary)",
                  fontSize: "13px",
                  fontWeight: isSelected ? "700" : "500",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "background 0.2s, color 0.2s"
                }}
                className="custom-select-option"
              >
                {color && (
                  <span style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: color,
                    display: "inline-block"
                  }} />
                )}
                <span style={{ flex: 1 }}>{label}</span>
                {isSelected && <span style={{ fontSize: "10px", color: "var(--accent-light)" }}>✔</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SettingsModal({ isOpen, onClose, user, onSaveProfile, onSelectDocForChat, initialTab = "general" }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // RAG Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocId, setSelectedDocId] = useState(null);

  // General Tab States
  const [appearance, setAppearance] = useState("Dark");
  const [contrast, setContrast] = useState("Standard");
  const [accentColor, setAccentColor] = useState("Purple");
  const [language, setLanguage] = useState("Auto-detect");
  const [higherIntelligence, setHigherIntelligence] = useState(true);
  const [enableDictation, setEnableDictation] = useState(true);
  const [separateVoice, setSeparateVoice] = useState(false);

  // Personalization Tab States
  const [baseStyle, setBaseStyle] = useState("Friendly");
  const [warm, setWarm] = useState("Default");
  const [enthusiastic, setEnthusiastic] = useState("Default");
  const [headersLists, setHeadersLists] = useState("Default");
  const [emoji, setEmoji] = useState("Default");
  const [fastAnswers, setFastAnswers] = useState(true);
  const [customInstructions, setCustomInstructions] = useState("");
  const [nickname, setNickname] = useState("Disha");
  const [occupation, setOccupation] = useState("Student");
  const [moreAboutYou, setMoreAboutYou] = useState("");
  const [enableMemory, setEnableMemory] = useState(true);

  // Apply visual theme / accents dynamically
  useEffect(() => {
    if (isOpen) {
      applyTheme(appearance);
      applyAccentColor(accentColor);
    }
  }, [appearance, accentColor, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    alert("Settings saved successfully! Customizations applied globally.");
    onClose();
  };

  // Custom Toggle switch component
  const renderToggle = (checkedState, setCheckedState) => {
    const unselectedBg = appearance === "Light" ? "#CBD5E1" : "#3F3F46";
    return (
      <label style={{ position: "relative", display: "inline-block", width: "42px", height: "24px", cursor: "pointer", flexShrink: 0 }}>
        <input 
          type="checkbox" 
          checked={checkedState} 
          onChange={(e) => setCheckedState(e.target.checked)} 
          style={{ opacity: 0, width: 0, height: 0 }} 
        />
        <span style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: checkedState ? "var(--accent)" : unselectedBg,
          borderRadius: "24px",
          transition: "background-color 0.2s"
        }} />
        <span style={{
          position: "absolute",
          left: checkedState ? "22px" : "4px",
          bottom: "4px",
          width: "16px",
          height: "16px",
          backgroundColor: "white",
          borderRadius: "50%",
          transition: "left 0.2s"
        }} />
      </label>
    );
  };

  // Render functions for individual tabs (removing redundant headers)
  const renderGeneralTab = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      
      {/* Appearance select */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>Appearance</span>
        </div>
        <CustomSelect
          value={appearance}
          onChange={setAppearance}
          options={[
            { value: "Dark", label: "Dark" },
            { value: "Light", label: "Light" }
          ]}
        />
      </div>
      <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

      {/* Contrast select */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>Contrast</span>
        </div>
        <CustomSelect
          value={contrast}
          onChange={setContrast}
          options={[
            { value: "Standard", label: "Standard" },
            { value: "Increased", label: "Increased" }
          ]}
        />
      </div>
      <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

      {/* Accent Color select */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>Accent color</span>
        </div>
        <CustomSelect
          value={accentColor}
          onChange={setAccentColor}
          options={[
            { value: "Purple", label: "Purple", colorCircle: "#C084FC" },
            { value: "Blue", label: "Blue", colorCircle: "#60A5FA" },
            { value: "Green", label: "Green", colorCircle: "#34D399" },
            { value: "Orange", label: "Orange", colorCircle: "#FDBA74" },
            { value: "Rose", label: "Rose", colorCircle: "#FDA4AF" }
          ]}
        />
      </div>
      <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

      {/* Language select */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>Language</span>
        </div>
        <CustomSelect
          value={language}
          onChange={setLanguage}
          options={[
            { value: "Auto-detect", label: "Auto-detect" },
            { value: "English", label: "English" },
            { value: "Spanish", label: "Spanish" },
            { value: "French", label: "French" },
            { value: "German", label: "German" },
            { value: "Hindi", label: "Hindi" }
          ]}
        />
      </div>
      <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

      {/* Higher Intelligence */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ marginRight: "1rem" }}>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>Higher intelligence</div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
            Kai can automatically use a higher intelligence setting when you ask a complex question.
          </div>
        </div>
        {renderToggle(higherIntelligence, setHigherIntelligence)}
      </div>
      <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

      {/* Enable Dictation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ marginRight: "1rem" }}>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>Enable Dictation</div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
            Use dictation in the chat composer.
          </div>
        </div>
        {renderToggle(enableDictation, setEnableDictation)}
      </div>
      <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

      {/* Separate Voice */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ marginRight: "1rem" }}>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>Separate Voice</div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
            Keep Kai Voice in a separate full screen, without real time transcripts and visuals.
          </div>
        </div>
        {renderToggle(separateVoice, setSeparateVoice)}
      </div>

    </div>
  );

  const renderPersonalizationTab = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      
      {/* Base Style & Tone */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>Base style and tone</div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
            Set the style and tone of how Kai responds to you. This doesn't impact Kai's capabilities.
          </div>
        </div>
        <CustomSelect
          value={baseStyle}
          onChange={setBaseStyle}
          options={[
            { value: "Friendly", label: "Friendly" },
            { value: "Professional", label: "Professional" },
            { value: "Concise", label: "Concise" },
            { value: "Gen Z", label: "Gen Z" }
          ]}
        />
      </div>
      <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

      {/* Characteristics Header */}
      <div>
        <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)", fontFamily: "var(--font-title)" }}>Characteristics</span>
        <p style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>Choose additional customizations on top of your base style and tone.</p>
      </div>

      {/* Warm select */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: "0.5rem" }}>
        <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)" }}>Warm</span>
        <CustomSelect
          value={warm}
          onChange={setWarm}
          options={["Default", "High", "Low"]}
        />
      </div>

      {/* Enthusiastic select */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: "0.5rem" }}>
        <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)" }}>Enthusiastic</span>
        <CustomSelect
          value={enthusiastic}
          onChange={setEnthusiastic}
          options={["Default", "High", "Low"]}
        />
      </div>

      {/* Headers & Lists select */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: "0.5rem" }}>
        <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)" }}>Headers & Lists</span>
        <CustomSelect
          value={headersLists}
          onChange={setHeadersLists}
          options={["Default", "Always", "Never"]}
        />
      </div>

      {/* Emoji select */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: "0.5rem" }}>
        <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)" }}>Emoji</span>
        <CustomSelect
          value={emoji}
          onChange={setEmoji}
          options={["Default", "Frequently", "Rarely"]}
        />
      </div>
      <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

      {/* Fast Answers Toggle */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ marginRight: "1rem" }}>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>Fast answers</div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
            Kai can sometimes use its general knowledge to give fast, in-depth answers. These aren't personalized and don't use your memory.
          </div>
        </div>
        {renderToggle(fastAnswers, setFastAnswers)}
      </div>
      <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

      {/* Custom Instructions */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
        <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>Custom instructions</span>
        <textarea
          value={customInstructions}
          onChange={(e) => setCustomInstructions(e.target.value)}
          rows="2"
          style={{
            width: "100%",
            padding: "0.6rem",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            background: "var(--bg-input)",
            fontSize: "13px",
            outline: "none",
            resize: "none",
            color: "var(--text-primary)",
            lineHeight: "1.4"
          }}
        />
      </div>
      <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

      {/* User Info Fields */}
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)" }}>Nickname</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-input)", color: "var(--text-primary)", fontSize: "13px", outline: "none" }}
          />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)" }}>Occupation</label>
          <input
            type="text"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-input)", color: "var(--text-primary)", fontSize: "13px", outline: "none" }}
          />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
        <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)" }}>More about you</label>
        <input
          type="text"
          value={moreAboutYou}
          onChange={(e) => setMoreAboutYou(e.target.value)}
          placeholder="Interests, values, or preferences to keep in mind"
          style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-input)", color: "var(--text-primary)", fontSize: "13px", outline: "none" }}
        />
      </div>
      <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

      {/* Memory Header */}
      <div>
        <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)", fontFamily: "var(--font-title)" }}>Memory</span>
      </div>

      {/* Enable Memory Toggle */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ marginRight: "1rem" }}>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>Enable memory</div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
            Let Kai personalize your experience based on your chats, files, and connected apps. <span style={{ color: "var(--accent-light)", cursor: "pointer" }}>Learn more</span>
          </div>
        </div>
        {renderToggle(enableMemory, setEnableMemory)}
      </div>

      {/* Memory summary Row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>Memory summary</div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
            View a brief overview of what Kai has learned about you. You can still view and manage your old <span style={{ textDecoration: "underline", cursor: "pointer" }}>saved memories</span>.
          </div>
        </div>
        <button 
          type="button" 
          onClick={() => alert("Simulated memory manager opened.")}
          style={{ background: "rgba(139, 92, 246, 0.08)", border: "1px solid var(--border)", color: "var(--text-primary)", padding: "0.4rem 1rem", borderRadius: "99px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
        >
          Manage
        </button>
      </div>

    </div>
  );



  const renderAccountTab = () => {
    const displayName = user ? user.name : "D Disha Shree";
    const displayEmail = user ? user.email : "ddishashree2006@gmail.com";

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        
        {/* Name Display */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Name</div>
            <div style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-primary)", marginTop: "2px" }}>{displayName}</div>
          </div>
          <button
            type="button"
            onClick={() => alert("To change your name, click your profile card in the sidebar footer.")}
            style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-primary)", padding: "0.4rem 0.85rem", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
          >
            Edit
          </button>
        </div>
        <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

        {/* Email Display */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Email</div>
            <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-secondary)", marginTop: "2px" }}>{displayEmail}</div>
          </div>
        </div>
        <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />



        {/* Delete Account */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>Delete account</div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
              Permanently delete your account and all associated data.
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (confirm("Are you sure you want to permanently delete your account? This action is irreversible.")) {
                alert("Account deleted.");
              }
            }}
            style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "var(--error)", padding: "0.4rem 1rem", borderRadius: "99px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
          >
            Delete
          </button>
        </div>

      </div>
    );
  };

  const renderKBTab = () => {
    const filteredDocs = mockDocuments.filter((doc) => {
      return (
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });

    const activeDoc = mockDocuments.find((d) => d.id === selectedDocId) || null;

    return (
      <div style={{ display: "flex", height: "420px", overflow: "hidden", margin: "-1.5rem -2rem -2rem -2rem", borderTop: "1px solid var(--border)" }}>
        {/* Left: Document List */}
        <div style={{ width: "200px", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", background: "rgba(0,0,0,0.1)", flexShrink: 0 }}>
          <div style={{ padding: "0.75rem", borderBottom: "1px solid var(--border)", position: "relative" }}>
            <Search size={13} style={{ position: "absolute", left: "18px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search index..."
              style={{
                width: "100%",
                padding: "0.4rem 0.4rem 0.4rem 1.6rem",
                borderRadius: "6px",
                border: "1px solid var(--border)",
                background: "var(--bg-app)",
                fontSize: "12px",
                outline: "none",
                color: "var(--text-primary)"
              }}
            />
          </div>
          
          <div style={{ flex: 1, overflowY: "auto", padding: "0.4rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
            {filteredDocs.map((doc) => {
              const isActive = doc.id === selectedDocId;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  style={{
                    padding: "0.6rem",
                    borderRadius: "6px",
                    background: isActive ? "rgba(255, 255, 255, 0.03)" : "transparent",
                    border: isActive ? "1px solid var(--border)" : "1px solid transparent",
                    cursor: "pointer"
                  }}
                  className="scale-hover"
                >
                  <h3 style={{ fontSize: "12px", fontWeight: "600", color: "white", marginBottom: "0.15rem", fontFamily: "var(--font-title)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {doc.title}
                  </h3>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: "var(--text-secondary)" }}>
                    <span>{doc.category}</span>
                  </div>
                </div>
              );
            })}

            {filteredDocs.length === 0 && (
              <p style={{ textAlign: "center", fontSize: "11px", color: "var(--text-secondary)", marginTop: "1rem" }}>
                No files found.
              </p>
            )}
          </div>
        </div>

        {/* Right: Document Preview */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {activeDoc ? (
            <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <div style={{ display: "flex", gap: "0.35rem", marginBottom: "0.35rem" }}>
                  <span style={{ fontSize: "9px", fontWeight: "700", padding: "0.15rem 0.4rem", background: "rgba(59, 130, 246, 0.15)", color: "var(--accent-light)", borderRadius: "3px", fontFamily: "var(--font-title)" }}>
                    {activeDoc.category.toUpperCase()}
                  </span>
                  <span style={{ fontSize: "9px", fontWeight: "700", padding: "0.15rem 0.4rem", background: "rgba(16, 185, 129, 0.15)", color: "var(--success)", borderRadius: "3px", fontFamily: "var(--font-title)" }}>
                    INDEXED
                  </span>
                </div>
                <h2 style={{ fontSize: "15px", fontWeight: "700", fontFamily: "var(--font-title)", margin: 0 }}>{activeDoc.title}</h2>
                <p style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "0.15rem" }}>
                  Updated {activeDoc.uploadDate}
                </p>
              </div>

              <div style={{ background: "rgba(59, 130, 246, 0.03)", border: "1px solid rgba(59, 130, 246, 0.15)", padding: "0.75rem", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <h4 style={{ fontSize: "11px", fontWeight: "700", color: "var(--accent-light)", display: "flex", alignItems: "center", gap: "0.25rem", fontFamily: "var(--font-title)", margin: 0 }}>
                  <MessageSquare size={12} /> VECTOR INGESTION SUMMARY
                </h4>
                <p style={{ fontSize: "12px", color: "white", lineHeight: "1.4", margin: 0 }}>{activeDoc.summary}</p>
              </div>

              <div>
                <h4 style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "0.35rem", fontFamily: "var(--font-title)", margin: 0 }}>Extracted Text Ingestion Check</h4>
                <pre style={{
                  background: "rgba(0,0,0,0.2)",
                  border: "1px solid var(--border)",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  fontSize: "11px",
                  fontFamily: "var(--font-body)",
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.4",
                  maxHeight: "140px",
                  overflowY: "auto",
                  margin: 0
                }}>
                  {activeDoc.content}
                </pre>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid var(--border)", paddingTop: "0.75rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => {
                    onSelectDocForChat(activeDoc);
                    onClose();
                  }}
                  className="btn-accent"
                  style={{ padding: "0.4rem 0.85rem", fontSize: "12px", boxShadow: "none" }}
                >
                  Bind Document Context
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-secondary)", gap: "0.5rem" }}>
              <FileText size={32} style={{ opacity: 0.5 }} />
              <p style={{ fontSize: "13px", margin: 0 }}>Select a document from the left pane to check vector previews.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderIntegrationsTab = () => {
    const components = [
      {
        title: "Vector Database (Chroma / PgVector)",
        desc: "Stores high-dimensional embeddings of SOPs, training manuals, and transcripts for semantic search.",
        icon: Database,
        status: "Ready for Connection"
      },
      {
        title: "RAG Pipeline (LangChain / LlamaIndex)",
        desc: "Orchestrates prompt building, retrieves top-k documents, and feeds them into the LLM context.",
        icon: Workflow,
        status: "Ready for Connection"
      },
      {
        title: "LMS Sync (Moodle / Cornerstone)",
        desc: "Saves training path progress and updates course completions to SCORM specifications.",
        icon: Link2,
        status: "API Hook Ready"
      },
      {
        title: "HRMS Integration (Workday / SuccessFactors)",
        desc: "Synchronizes user credentials, job functions, and safety certification prerequisites.",
        icon: Users,
        status: "API Hook Ready"
      },
      {
        title: "Multi-Agent Workflows",
        desc: "Dispatches sub-agents for safety checklist, compliance monitoring, and quiz creation.",
        icon: UsersRound,
        status: "Framework Mocked"
      },
      {
        title: "Voice Assistant API",
        desc: "Hands-free speech-to-text API allowing technicians to trigger checklists in the field.",
        icon: Mic,
        status: "Hardware Spec Built"
      }
    ];

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", height: "420px", overflowY: "auto", margin: "-1.5rem -2rem -2rem -2rem", padding: "1.5rem 2rem", borderTop: "1px solid var(--border)" }}>
        <div style={{ background: "rgba(59, 130, 246, 0.03)", border: "1px solid rgba(59, 130, 246, 0.15)", padding: "0.75rem 1rem", borderRadius: "8px", fontSize: "12px", lineHeight: "1.5" }}>
          💡 <strong>RAG Pipeline Alert:</strong> All database queries, translations, and file uploads in this demo are processed instantly in the client layer. The interfaces are engineered to bind directly to vector API endpoints, RAG routers, and local databases when deployed.
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.75rem" }}>
          {components.map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} style={{ padding: "0.75rem", borderRadius: "10px", border: "1px solid var(--border)", background: "rgba(255,255,255,0.01)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.35rem" }}>
                  <div style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "6px",
                    backgroundColor: "var(--bg-app)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent)"
                  }}>
                     <Icon size={15} />
                  </div>
                  <span style={{ fontSize: "9px", padding: "0.15rem 0.4rem", borderRadius: "20px", background: "rgba(59, 130, 246, 0.1)", color: "var(--accent-light)", border: "1px solid rgba(59, 130, 246, 0.2)", fontWeight: "600" }}>
                    {c.status}
                  </span>
                </div>
                <h3 style={{ fontSize: "13px", fontWeight: "600", marginBottom: "0.2rem", margin: 0 }}>{c.title}</h3>
                <p style={{ fontSize: "11px", color: "var(--text-secondary)", lineHeight: "1.4", margin: 0, marginTop: "0.25rem" }}>{c.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const sidebarBg = appearance === "Light" ? "rgba(0, 0, 0, 0.02)" : "rgba(0, 0, 0, 0.2)";

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
        maxWidth: "760px",
        height: "560px",
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
        backgroundColor: "var(--bg-card)",
        color: "var(--text-primary)",
        borderColor: "var(--border)"
      }}>
        
        {/* Sidebar Nav */}
        <div style={{
          width: "220px",
          backgroundColor: sidebarBg,
          borderRight: "1px solid var(--border)",
          padding: "1.25rem 0.75rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
          flexShrink: 0
        }}>
          <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", paddingLeft: "0.6rem", marginBottom: "0.5rem", fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}>
            Settings
          </div>
          
          <button 
            type="button"
            onClick={() => setActiveTab("general")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.65rem",
              padding: "0.6rem 0.85rem",
              borderRadius: "8px",
              background: activeTab === "general" ? "rgba(139, 92, 246, 0.12)" : "transparent",
              border: "none",
              color: activeTab === "general" ? "var(--text-primary)" : "var(--text-secondary)",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              textAlign: "left",
              width: "100%"
            }}
          >
            <Settings size={16} /> General
          </button>
          
          <button 
            type="button"
            onClick={() => setActiveTab("personalization")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.65rem",
              padding: "0.6rem 0.85rem",
              borderRadius: "8px",
              background: activeTab === "personalization" ? "rgba(139, 92, 246, 0.12)" : "transparent",
              border: "none",
              color: activeTab === "personalization" ? "var(--text-primary)" : "var(--text-secondary)",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              textAlign: "left",
              width: "100%"
            }}
          >
            <Sparkles size={16} /> Personalization
          </button>
          
          <button 
            type="button"
            onClick={() => setActiveTab("account")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.65rem",
              padding: "0.6rem 0.85rem",
              borderRadius: "8px",
              background: activeTab === "account" ? "rgba(139, 92, 246, 0.12)" : "transparent",
              border: "none",
              color: activeTab === "account" ? "var(--text-primary)" : "var(--text-secondary)",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              textAlign: "left",
              width: "100%"
            }}
          >
            <User size={16} /> Account
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab("kb")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.65rem",
              padding: "0.6rem 0.85rem",
              borderRadius: "8px",
              background: activeTab === "kb" ? "rgba(139, 92, 246, 0.12)" : "transparent",
              border: "none",
              color: activeTab === "kb" ? "var(--text-primary)" : "var(--text-secondary)",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              textAlign: "left",
              width: "100%"
            }}
          >
            <Library size={16} /> Knowledge Base
          </button>
          
          <button 
            type="button"
            onClick={() => setActiveTab("integrations")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.65rem",
              padding: "0.6rem 0.85rem",
              borderRadius: "8px",
              background: activeTab === "integrations" ? "rgba(139, 92, 246, 0.12)" : "transparent",
              border: "none",
              color: activeTab === "integrations" ? "var(--text-primary)" : "var(--text-secondary)",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              textAlign: "left",
              width: "100%"
            }}
          >
            <Cpu size={16} /> Future Integrations
          </button>
        </div>

        {/* Content Panel */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
          
          {/* Sticky Header with Title and Close button */}
          <div style={{ 
            padding: "1rem 1.5rem", 
            borderBottom: "1px solid var(--border)", 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            height: "56px",
            flexShrink: 0
          }}>
            <h2 style={{ 
              fontSize: "16px", 
              fontWeight: "700", 
              fontFamily: "var(--font-title)", 
              color: "var(--text-primary)", 
              margin: 0
            }}>
              {activeTab === "kb" ? "Knowledge Base (RAG Library)" : activeTab === "integrations" ? "System Integrations Roadmap" : `${activeTab} Settings`}
            </h2>
            <button 
              onClick={onClose}
              style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-secondary)", display: "flex", alignItems: "center" }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Form / Scroll area */}
          <form onSubmit={handleSave} style={{ 
            flex: 1, 
            overflowY: "auto", 
            padding: "1.5rem 2rem 2rem 2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}>
            <div style={{ flex: 1 }}>
              {activeTab === "general" && renderGeneralTab()}
              {activeTab === "personalization" && renderPersonalizationTab()}
              {activeTab === "account" && renderAccountTab()}
              {activeTab === "kb" && renderKBTab()}
              {activeTab === "integrations" && renderIntegrationsTab()}
            </div>

            {/* Buttons Footer (Only show for standard settings) */}
            {activeTab !== "kb" && activeTab !== "integrations" && (
              <div style={{ 
                borderTop: "1px solid var(--border)", 
                paddingTop: "1.25rem", 
                marginTop: "1.5rem", 
                display: "flex", 
                justifyContent: "flex-end", 
                gap: "0.5rem",
                flexShrink: 0
              }}>
                <button type="button" onClick={onClose} className="btn-outline" style={{ padding: "0.5rem 1rem", fontSize: "14px" }}>
                  Cancel
                </button>
                <button type="submit" className="btn-accent" style={{ padding: "0.5rem 1rem", fontSize: "14px", display: "flex", alignItems: "center", gap: "0.35rem", boxShadow: "none" }}>
                  <Save size={16} /> Save Changes
                </button>
              </div>
            )}
          </form>

        </div>

      </div>
      
      {/* Visual overrides to custom dropdown styles */}
      <style>{`
        .custom-select-trigger:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }
        .custom-select-option:hover {
          background-color: rgba(139, 92, 246, 0.08) !important;
          color: var(--accent-light) !important;
        }
      `}</style>
    </div>
  );
}
