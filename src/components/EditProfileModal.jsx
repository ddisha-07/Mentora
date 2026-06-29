import React, { useState, useEffect } from "react";
import { X, User, Tag, ShieldAlert, Save } from "lucide-react";

export default function EditProfileModal({ isOpen, onClose, user, onSave }) {
  const [name, setName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [avatar, setAvatar] = useState("");
  const [profilePic, setProfilePic] = useState("");

  // Sync state with user prop when modal opens
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setUserRole(user.userRole || "");
      setAvatar(user.avatar || "");
      setProfilePic(user.profilePic || "");
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size should be less than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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

    onSave({ 
      name, 
      userRole, 
      avatar: avatar.substring(0, 3).toUpperCase(),
      profilePic
    });
    onClose();
  };

  return (
    <div className="modal-overlay" style={{
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
      <div className="slide-up" style={{
        width: "100%",
        maxWidth: "460px",
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: "rgba(10, 14, 28, 0.85)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "16px",
        color: "var(--text-primary)",
        boxShadow: "0 24px 64px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.05)"
      }}>
        {/* Mobile Drag Handle */}
        <div className="mobile-drag-handle">
          <div className="drag-handle-pill"></div>
        </div>

        {/* Header */}
        <div style={{ padding: "1.25rem 1.75rem", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <User style={{ color: "var(--accent-light)" }} size={18} />
            <h2 style={{ fontSize: "16px", fontWeight: "700", fontFamily: "var(--font-title)", color: "white", margin: 0 }}>Edit Profile Details</h2>
          </div>
          <button 
            onClick={onClose}
            style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-secondary)", display: "flex", alignItems: "center" }}
            className="hover-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "1.5rem 1.75rem 1.75rem 1.75rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          
          {/* Full Name */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <label style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-title)" }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Siddharth Sen"
              className="minimal-input"
              style={{
                width: "100%",
                padding: "0.55rem 0.75rem",
                borderRadius: "6px",
                color: "var(--text-primary)",
                fontSize: "13px",
                outline: "none"
              }}
            />
          </div>

          {/* Job Title / Role */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <label style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-title)" }}>
              Job Title / Designation
            </label>
            <input
              type="text"
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              placeholder="e.g. Metallurgy Expert"
              className="minimal-input"
              style={{
                width: "100%",
                padding: "0.55rem 0.75rem",
                borderRadius: "6px",
                color: "var(--text-primary)",
                fontSize: "13px",
                outline: "none"
              }}
            />
          </div>

          {/* Profile Avatar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <label style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-title)" }}>
              Profile Avatar
            </label>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              {/* Preview Circle */}
              <div 
                onClick={() => document.getElementById("profile-pic-upload").click()}
                style={{ 
                  position: "relative", 
                  flexShrink: 0,
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent-light)",
                  fontWeight: "bold",
                  fontSize: "16px",
                  fontFamily: "var(--font-title)",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                title="Click to upload image"
                className="scale-hover"
              >
                {profilePic ? (
                  <img src={profilePic} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  avatar.substring(0, 3) || "?"
                )}
              </div>

              {/* Upload & Initials Controls */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", width: "100%" }}>
                  <input
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value.toUpperCase())}
                    placeholder="SS"
                    maxLength={3}
                    className="minimal-input"
                    style={{
                      width: "54px",
                      padding: "0.45rem 0.25rem",
                      borderRadius: "6px",
                      color: "var(--text-primary)",
                      fontSize: "13px",
                      outline: "none",
                      textAlign: "center"
                    }}
                    title="Text initials badge"
                  />
                  <input
                    type="file"
                    id="profile-pic-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById("profile-pic-upload").click()}
                    style={{
                      padding: "0.45rem 0.75rem",
                      borderRadius: "6px",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      background: "rgba(255, 255, 255, 0.03)",
                      color: "rgba(255,255,255,0.9)",
                      fontSize: "12px",
                      cursor: "pointer",
                      fontWeight: "600",
                      transition: "all 0.2s"
                    }}
                    className="hover-white-bg"
                  >
                    Upload Image
                  </button>
                  {profilePic && (
                    <button
                      type="button"
                      onClick={() => setProfilePic("")}
                      style={{
                        padding: "0.45rem 0.75rem",
                        borderRadius: "6px",
                        border: "1px solid rgba(239, 68, 68, 0.2)",
                        background: "rgba(239, 68, 68, 0.05)",
                        color: "var(--error)",
                        fontSize: "12px",
                        cursor: "pointer",
                        fontWeight: "600",
                        transition: "all 0.2s"
                      }}
                      className="hover-red-bg"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <span style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>
                  Supports JPEG, PNG, SVG. Max 2MB.
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "1.25rem", marginTop: "0.5rem", display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
            <button 
              type="button" 
              onClick={onClose} 
              style={{
                padding: "0.5rem 1.25rem",
                fontSize: "13px",
                fontWeight: "600",
                borderRadius: "6px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                background: "transparent",
                color: "var(--text-secondary)",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              className="hover-white-bg-btn"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              style={{
                padding: "0.5rem 1.25rem",
                fontSize: "13px",
                fontWeight: "600",
                borderRadius: "6px",
                border: "none",
                background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%)",
                color: "white",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(139, 92, 246, 0.25)",
                transition: "all 0.2s"
              }}
              className="hover-opacity-btn"
            >
              Save Profile
            </button>
          </div>

        </form>

        <style>{`
          .minimal-input {
            border: 1px solid rgba(255, 255, 255, 0.08) !important;
            background: rgba(0, 0, 0, 0.25) !important;
            transition: all 0.2s ease !important;
            box-shadow: none !important;
          }
          .minimal-input:focus {
            border-color: var(--accent-light) !important;
            box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.15) !important;
            background: rgba(0, 0, 0, 0.35) !important;
          }
          .hover-white:hover {
            color: white !important;
          }
          .hover-white-bg:hover {
            background-color: rgba(255, 255, 255, 0.08) !important;
            color: white !important;
          }
          .hover-red-bg:hover {
            background-color: rgba(239, 68, 68, 0.1) !important;
            border-color: rgba(239, 68, 68, 0.3) !important;
          }
          .hover-white-bg-btn:hover {
            background-color: rgba(255, 255, 255, 0.03) !important;
            color: white !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
          }
          .hover-opacity-btn:hover {
            opacity: 0.95 !important;
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(139, 92, 246, 0.35) !important;
          }
        `}</style>
      </div>
    </div>
  );
}
