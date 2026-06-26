import React, { useState } from "react";
import { Lock, Mail, ChevronRight, HelpCircle } from "lucide-react";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("siddharth@company.com");
  const [password, setPassword] = useState("password123");
  const [role, setRole] = useState("Employee");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    // Perform simulated login
    setError("");
    onLogin(email, role);
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === "Employee") {
      setEmail("siddharth@company.com");
    } else if (selectedRole === "Retired Expert") {
      setEmail("harish.mehta@expert.com");
    } else if (selectedRole === "Administrator") {
      setEmail("alex.vance@admin.com");
    }
  };

  return (
    <div className="fade-in" style={{
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "radial-gradient(circle at 10% 20%, hsl(214, 100%, 97%) 0%, hsl(210, 40%, 98%) 90%)",
      padding: "1rem"
    }}>
      <div className="glass-premium" style={{
        width: "100%",
        maxWidth: "460px",
        borderRadius: "20px",
        padding: "2.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem"
      }}>
        {/* Header */}
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "48px", 
            height: "48px", 
            borderRadius: "12px", 
            background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: "1.5rem",
            margin: "0 auto 1rem auto",
            boxShadow: "0 4px 10px rgba(37, 99, 235, 0.2)"
          }}>
            M
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "700" }}>Welcome to Mentora</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            Sign in to access your organization's knowledge base.
          </p>
        </div>

        {error && (
          <div style={{
            background: "hsl(0, 90%, 96%)",
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

        {/* Role Quick Selector */}
        <div>
          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
            SELECT PROTOTYPE TESTING ROLE
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
            {["Employee", "Retired Expert", "Administrator"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRoleSelect(r)}
                style={{
                  padding: "0.5rem",
                  borderRadius: "8px",
                  border: "1px solid",
                  borderColor: role === r ? "var(--primary)" : "var(--border)",
                  background: role === r ? "var(--primary-light)" : "white",
                  color: role === r ? "var(--primary)" : "var(--text-secondary)",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Email field */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)" }}>
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
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
                  fontSize: "0.95rem",
                  outline: "none"
                }}
              />
            </div>
          </div>

          {/* Password field */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)" }}>
                Password
              </label>
              <button 
                type="button" 
                onClick={() => alert("Simulated password reset email sent.")}
                style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.8rem", fontWeight: "500", cursor: "pointer" }}
              >
                Forgot Password?
              </button>
            </div>
            <div style={{ position: "relative" }}>
              <Lock size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem 0.75rem 2.5rem",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  fontSize: "0.95rem",
                  outline: "none"
                }}
              />
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="btn-primary scale-up-hover" style={{ width: "100%", justifyContent: "center", padding: "0.85rem" }}>
            Login to Dashboard <ChevronRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: "center", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.25rem" }}>
            <HelpCircle size={14} /> Need help? Contact L&D Administration.
          </p>
        </div>
      </div>
    </div>
  );
}
