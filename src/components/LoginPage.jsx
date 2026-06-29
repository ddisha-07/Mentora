import React, { useState } from "react";
import { Lock, Mail, ChevronRight, HelpCircle, Sparkles, User, Eye, EyeOff } from "lucide-react";

export default function LoginPage({ onLogin }) {
  // Remember Me checkbox and saved credentials states
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem("mentora_remember_me") === "true";
  });
  const [email, setEmail] = useState(() => {
    return localStorage.getItem("mentora_saved_email") || "";
  });
  const [password, setPassword] = useState(() => {
    return localStorage.getItem("mentora_saved_password") || "";
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  
  // Step 2 profile states
  const [step, setStep] = useState("credentials"); // "credentials" or "profile-setup"
  const [isGuestSession, setIsGuestSession] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileJob, setProfileJob] = useState("");

  const handleSubmitCredentials = (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please fill in your email address.");
      return;
    }
    if (!password) {
      setError("Please fill in your password.");
      return;
    }

    // Basic password validation guideline check (optional helper validation)
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setError("");
    setIsGuestSession(false);
    
    // Save/Clear credentials depending on rememberMe checkbox
    if (rememberMe) {
      localStorage.setItem("mentora_remember_me", "true");
      localStorage.setItem("mentora_saved_email", email);
      localStorage.setItem("mentora_saved_password", password);
    } else {
      localStorage.setItem("mentora_remember_me", "false");
      localStorage.removeItem("mentora_saved_email");
      localStorage.removeItem("mentora_saved_password");
    }

    // Prefill name states
    const prefix = email.split("@")[0];
    const parts = prefix.split(/[._-]/).map(part => part.charAt(0).toUpperCase() + part.slice(1));
    
    // Load pre-filled names if saved, otherwise derive them
    const savedFirstName = localStorage.getItem("mentora_saved_first_name");
    const savedLastName = localStorage.getItem("mentora_saved_last_name");
    const savedMiddleName = localStorage.getItem("mentora_saved_middle_name");
    const savedJobProfile = localStorage.getItem("mentora_saved_job_profile");

    if (rememberMe && savedFirstName) {
      setFirstName(savedFirstName);
      setLastName(savedLastName || "");
      setMiddleName(savedMiddleName || "");
      setProfileJob(savedJobProfile || "");
    } else {
      if (parts.length >= 2) {
        setFirstName(parts[0]);
        setLastName(parts[parts.length - 1]);
        if (parts.length > 2) {
          setMiddleName(parts.slice(1, -1).join(" "));
        } else {
          setMiddleName("");
        }
      } else if (parts.length === 1) {
        setFirstName(parts[0]);
        setMiddleName("");
        setLastName("");
      } else {
        setFirstName("");
        setMiddleName("");
        setLastName("");
      }
      setProfileJob("");
    }
    setStep("profile-setup");
  };

  const handleContinueAsGuest = () => {
    setError("");
    setIsGuestSession(true);
    
    if (rememberMe) {
      localStorage.setItem("mentora_remember_me", "true");
    } else {
      localStorage.setItem("mentora_remember_me", "false");
    }

    const savedFirstName = localStorage.getItem("mentora_saved_first_name");
    const savedLastName = localStorage.getItem("mentora_saved_last_name");
    const savedMiddleName = localStorage.getItem("mentora_saved_middle_name");
    const savedJobProfile = localStorage.getItem("mentora_saved_job_profile");

    if (rememberMe && savedFirstName) {
      setFirstName(savedFirstName);
      setLastName(savedLastName || "");
      setMiddleName(savedMiddleName || "");
      setProfileJob(savedJobProfile || "Guest Mode");
    } else {
      setFirstName("Guest");
      setMiddleName("");
      setLastName("");
      setProfileJob("Guest Mode");
    }
    setStep("profile-setup");
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setError("Please enter your first name.");
      return;
    }
    if (!isGuestSession && !lastName.trim()) {
      setError("Please enter your last name.");
      return;
    }
    if (!profileJob.trim()) {
      setError("Please enter your job profile / title.");
      return;
    }
    setError("");
    
    if (rememberMe) {
      localStorage.setItem("mentora_saved_first_name", firstName.trim());
      localStorage.setItem("mentora_saved_middle_name", middleName.trim());
      localStorage.setItem("mentora_saved_last_name", lastName.trim());
      localStorage.setItem("mentora_saved_job_profile", profileJob.trim());
    } else {
      localStorage.removeItem("mentora_saved_first_name");
      localStorage.removeItem("mentora_saved_middle_name");
      localStorage.removeItem("mentora_saved_last_name");
      localStorage.removeItem("mentora_saved_job_profile");
    }

    const fullName = [firstName.trim(), middleName.trim(), lastName.trim()].filter(Boolean).join(" ");
    onLogin(isGuestSession ? null : email, fullName, profileJob.trim(), isGuestSession, rememberMe);
  };

  if (step === "profile-setup") {
    return (
      <div className="fade-in" style={{
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        position: "relative",
        background: "var(--bg-app)",
        padding: "2rem 1rem",
        overflowY: "auto"
      }}>
        {/* Background ambient elements */}
        <div className="grid-bg" />
        <div className="logo-radial-glow" />

        <div className="card-dark slide-up" style={{
          width: "100%",
          maxWidth: "440px",
          borderRadius: "20px",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          zIndex: 10,
          background: "rgba(13, 20, 38, 0.55)",
          backdropFilter: "blur(20px)",
          border: "1px solid var(--border)"
        }}>
          {/* Header Branding */}
          <div style={{ textAlign: "center" }}>
            <div style={{ position: "relative", display: "inline-flex", marginBottom: "1rem" }}>
              <img src="/logo.png" alt="Kai Logo" className="logo-pulse" style={{ width: "48px", height: "48px", borderRadius: "12px", objectFit: "cover" }} />
            </div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#FFFFFF", fontFamily: "var(--font-title)", letterSpacing: "-0.01em" }}>Set Up Your Profile</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "0.25rem", fontFamily: "var(--font-sans)" }}>
              {isGuestSession ? "Customize your guest details before entering the workspace." : "Tell us your name and title to personalize your workspace."}
            </p>
          </div>

          {error && (
            <div style={{
              background: "rgba(239, 68, 68, 0.1)",
              color: "var(--error)",
              padding: "0.75rem",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: "500",
              border: "1px solid rgba(239, 68, 68, 0.2)"
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* First Name & Last Name Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#FFFFFF", fontFamily: "var(--font-title)" }}>
                  First Name
                </label>
                <div style={{ position: "relative" }}>
                  <User size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Siddharth"
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem 0.75rem 2.25rem",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      background: "var(--bg-input)",
                      color: "white",
                      fontSize: "0.95rem",
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#FFFFFF", fontFamily: "var(--font-title)" }}>
                  Last Name
                </label>
                <div style={{ position: "relative" }}>
                  <User size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Sen"
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem 0.75rem 2.25rem",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      background: "var(--bg-input)",
                      color: "white",
                      fontSize: "0.95rem",
                      outline: "none"
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Middle Name field */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#FFFFFF", fontFamily: "var(--font-title)" }}>
                Middle Name <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: "400" }}>(Optional)</span>
              </label>
              <div style={{ position: "relative" }}>
                <User size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  type="text"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  placeholder="Kumar"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem 0.75rem 2.25rem",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    background: "var(--bg-input)",
                    color: "white",
                    fontSize: "0.95rem",
                    outline: "none"
                  }}
                />
              </div>
            </div>

            {/* Job Profile / Title field */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#FFFFFF", fontFamily: "var(--font-title)" }}>
                Job Profile / Title
              </label>
              <div style={{ position: "relative" }}>
                <Sparkles size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  type="text"
                  value={profileJob}
                  onChange={(e) => setProfileJob(e.target.value)}
                  placeholder="e.g., Maintenance Tech"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem 0.75rem 2.5rem",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    background: "var(--bg-input)",
                    color: "white",
                    fontSize: "0.95rem",
                    outline: "none"
                  }}
                />
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="btn-accent" style={{ width: "100%", justifyContent: "center", padding: "0.85rem", fontSize: "0.95rem", boxShadow: "none" }}>
              Enter Dashboard <ChevronRight size={18} />
            </button>
          </form>

          {/* Back button */}
          <div style={{ textAlign: "center", borderTop: "1px solid var(--border)", paddingTop: "1.25rem" }}>
            <button 
              type="button"
              onClick={() => { setStep("credentials"); setError(""); }}
              style={{ background: "transparent", border: "none", color: "var(--text-secondary)", fontSize: "0.8rem", fontWeight: "600", cursor: "pointer" }}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      position: "relative",
      background: "var(--bg-app)",
      padding: "2rem 1rem",
      overflowY: "auto"
    }}>
      {/* Background ambient elements */}
      <div className="grid-bg" />
      <div className="logo-radial-glow" />

      <div className="card-dark slide-up" style={{
        width: "100%",
        maxWidth: "440px",
        borderRadius: "20px",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
        zIndex: 10,
        background: "rgba(13, 20, 38, 0.55)",
        backdropFilter: "blur(20px)",
        border: "1px solid var(--border)"
      }}>
        {/* Header Branding */}
        <div style={{ textAlign: "center" }}>
          <div style={{ position: "relative", display: "inline-flex", marginBottom: "1rem" }}>
            <img src="/logo.png" alt="Kai Logo" className="logo-pulse" style={{ width: "48px", height: "48px", borderRadius: "12px", objectFit: "cover" }} />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#FFFFFF", fontFamily: "var(--font-title)", letterSpacing: "-0.01em" }}>Welcome to Mentora</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "0.25rem", fontFamily: "var(--font-sans)" }}>
            Sign in to access Kai, your Agentic Learning L&D Assistant.
          </p>
        </div>

        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.1)",
            color: "var(--error)",
            padding: "0.75rem",
            borderRadius: "8px",
            fontSize: "0.85rem",
            fontWeight: "500",
            border: "1px solid rgba(239, 68, 68, 0.2)"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmitCredentials} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Email field */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#FFFFFF", fontFamily: "var(--font-title)" }}>
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem 0.75rem 2.5rem",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "var(--bg-input)",
                  color: "white",
                  fontSize: "0.95rem",
                  outline: "none"
                }}
              />
            </div>
          </div>

          {/* Password field */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }} className="fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#FFFFFF", fontFamily: "var(--font-title)" }}>
                Password
              </label>
              <button 
                type="button" 
                onClick={() => alert("Simulated password reset email sent.")}
                style={{ background: "none", border: "none", color: "var(--accent-light)", fontSize: "0.8rem", fontWeight: "500", cursor: "pointer" }}
              >
                Forgot Password?
              </button>
            </div>
            <div style={{ position: "relative" }}>
              <Lock size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "0.75rem 2.5rem 0.75rem 2.5rem",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "var(--bg-input)",
                  color: "white",
                  fontSize: "0.95rem",
                  outline: "none"
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {/* Password guidelines */}
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "0.25rem", lineHeight: "1.4" }}>
              <div style={{ fontWeight: "600", color: "var(--text-secondary)", marginBottom: "0.15rem" }}>Password guidelines:</div>
              • Minimum 8 characters long
              <br />
              • Should contain letters and numbers
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "-0.25rem", marginBottom: "0.25rem" }}>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{
                width: "16px",
                height: "16px",
                accentColor: "var(--accent-light)",
                cursor: "pointer"
              }}
            />
            <label htmlFor="rememberMe" style={{ fontSize: "0.85rem", color: "var(--text-secondary)", cursor: "pointer", fontFamily: "var(--font-sans)", userSelect: "none" }}>
              Remember me
            </label>
          </div>

          {/* Submit */}
          <button type="submit" className="btn-accent" style={{ width: "100%", justifyContent: "center", padding: "0.85rem", fontSize: "0.95rem", boxShadow: "none" }}>
            Login to Dashboard <ChevronRight size={18} />
          </button>
        </form>

        {/* Toggle Login Option */}
        <div style={{ textTransform: "uppercase", fontSize: "10px", fontWeight: "700", color: "var(--text-muted)", textAlign: "center", borderTop: "1px solid var(--border)", paddingTop: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <span>Or access via:</span>
          <button 
            type="button"
            onClick={handleContinueAsGuest}
            style={{ 
              background: "transparent", 
              border: "1px solid var(--border)", 
              padding: "0.65rem", 
              borderRadius: "8px", 
              color: "white", 
              cursor: "pointer", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: "0.5rem", 
              fontSize: "11px", 
              fontWeight: "600",
              transition: "all 0.2s" 
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = "var(--accent-light)"; e.currentTarget.style.background = "rgba(139, 92, 246, 0.05)"; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "transparent"; }}
          >
            <User size={14} style={{ color: "var(--accent-light)" }} /> Continue as Guest
          </button>
        </div>

        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.25rem" }}>
            <HelpCircle size={14} /> Need help? Contact L&D Administration.
          </p>
        </div>
      </div>
    </div>
  );
}
