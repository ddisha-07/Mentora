import React, { useState, useEffect } from "react";
import { X, User, Tag, ShieldAlert, Save } from "lucide-react";

export default function EditProfileModal({ isOpen, onClose, user, onSave }) {
  const [name, setName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [avatar, setAvatar] = useState("");

  // Sync state with user prop when modal opens
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setUserRole(user.userRole || "");
      setAvatar(user.avatar || "");
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Name cannot be empty.");
      return;
    }
    if (!userRole.trim()) {
      alert("Role/Title cannot be empty.");
      return;
    }
    if (!avatar.trim()) {
      alert("Avatar initials cannot be empty.");
      return;
    }

    onSave({ name, userRole, avatar: avatar.substring(0, 3).toUpperCase() });
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
        maxWidth: "480px",
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: "var(--bg-card)",
        color: "var(--text-primary)",
        borderColor: "var(--border)"
      }}>
        {/* Header */}
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <User style={{ color: "var(--accent-light)" }} size={20} />
            <h2 style={{ fontSize: "18px", fontWeight: "700", fontFamily: "var(--font-title)", color: "var(--text-primary)", margin: 0 }}>Edit Profile Details</h2>
          </div>
          <button 
            onClick={onClose}
            style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          
          {/* Full Name */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.25rem", fontFamily: "var(--font-title)" }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Siddharth Sen"
              style={{
                width: "100%",
                padding: "0.65rem 0.85rem",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "var(--bg-input)",
                color: "var(--text-primary)",
                fontSize: "14px",
                outline: "none"
              }}
            />
          </div>

          {/* Job Title / Role */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.25rem", fontFamily: "var(--font-title)" }}>
              Job Title / Designation
            </label>
            <input
              type="text"
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              placeholder="e.g. Metallurgy Expert"
              style={{
                width: "100%",
                padding: "0.65rem 0.85rem",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "var(--bg-input)",
                color: "var(--text-primary)",
                fontSize: "14px",
                outline: "none"
              }}
            />
          </div>

          {/* Avatar Initials */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.25rem", fontFamily: "var(--font-title)" }}>
              Avatar Initials (Max 3 chars)
            </label>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value.toUpperCase())}
                placeholder="e.g. SS"
                maxLength={3}
                style={{
                  width: "80px",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "var(--bg-input)",
                  color: "var(--text-primary)",
                  fontSize: "14px",
                  outline: "none",
                  textAlign: "center"
                }}
              />
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent-light)",
                fontWeight: "bold",
                fontSize: "14px",
                fontFamily: "var(--font-title)"
              }}>
                {avatar.substring(0, 3) || "?"}
              </div>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                Live preview of your dashboard badge
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.25rem", marginTop: "0.5rem", display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
            <button type="button" onClick={onClose} className="btn-outline" style={{ padding: "0.5rem 1rem", fontSize: "14px" }}>
              Cancel
            </button>
            <button type="submit" className="btn-accent" style={{ padding: "0.5rem 1rem", fontSize: "14px", display: "flex", alignItems: "center", gap: "0.35rem", boxShadow: "none" }}>
              <Save size={16} /> Save Profile
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
