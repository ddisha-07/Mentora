import React from "react";
import { User, Mail, Building, Calendar, ShieldCheck, Award, BookOpen, Clock } from "lucide-react";

export default function MyProfile({ userRole }) {
  const getProfileData = () => {
    switch (userRole) {
      case "Administrator":
        return {
          name: "Alex Vance",
          email: "alex.vance@admin.com",
          dept: "L&D Administration",
          joined: "2022-04-10",
          stats: [
            { label: "Systems Monitored", value: "3 Active", icon: Building },
            { label: "Audit Log Status", value: "Compliant", icon: ShieldCheck },
            { label: "Courses Curated", value: "12 Modules", icon: BookOpen }
          ],
          certs: ["L&D Lead auditor", "IT Security Administrator"]
        };
      case "Retired Expert":
        return {
          name: "Harish Mehta",
          email: "harish.mehta@expert.com",
          dept: "Metallurgy & Blast Furnace Operations",
          joined: "1994-08-15 (Retired 2024)",
          stats: [
            { label: "Years Experience", value: "30 Years", icon: Calendar },
            { label: "Articles Contributed", value: "14 Guides", icon: Award },
            { label: "Answered FAQs", value: "48 Answers", icon: Clock }
          ],
          certs: ["Chief Ironmaking Metallurgist", "High Temperature Systems Lead"]
        };
      default:
        return {
          name: "Siddharth Sen",
          email: "siddharth@company.com",
          dept: "Mechanical Maintenance",
          joined: "2025-01-10",
          stats: [
            { label: "Training Hours", value: "48 Hours", icon: Clock },
            { label: "Active Modules", value: "2 Paths", icon: BookOpen },
            { label: "Completed Certs", value: "1 Certified", icon: Award }
          ],
          certs: ["LOTO Safety Level-I", "SMAW Welding Basic"]
        };
    }
  };

  const data = getProfileData();

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "800px", margin: "0 auto", width: "100%" }}>
      <div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "700" }}>My Profile</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          Manage your account credentials, view certifications, and track safety compliance statuses.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem", width: "100%" }}>
        {/* Left Column: Avatar & Role */}
        <div className="glass" style={{ padding: "2rem", borderRadius: "16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", textAlign: "center" }}>
          <div style={{
            width: "96px",
            height: "96px",
            borderRadius: "50%",
            background: "var(--primary-light)",
            color: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.5rem",
            fontWeight: "700",
            border: "3px solid white",
            boxShadow: "var(--shadow-md)"
          }}>
            {data.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "700" }}>{data.name}</h3>
            <span className="badge badge-training" style={{ marginTop: "0.25rem" }}>{userRole}</span>
          </div>
          <div style={{ width: "100%", borderTop: "1px solid var(--border)", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem", textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)" }}>
              <Mail size={16} /> <span>{data.email}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)" }}>
              <Building size={16} /> <span>{data.dept}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)" }}>
              <Calendar size={16} /> <span>Joined {data.joined}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Stats & Certifications */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Quick Metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            {data.stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="glass" style={{ padding: "1.25rem", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  <Icon size={20} style={{ color: "var(--primary)" }} />
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{s.label}</span>
                  <span style={{ fontSize: "1.1rem", fontWeight: "700" }}>{s.value}</span>
                </div>
              );
            })}
          </div>

          {/* Certifications Card */}
          <div className="glass" style={{ padding: "1.5rem", borderRadius: "16px" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: "700", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Award size={20} style={{ color: "var(--warning)" }} /> Earned Credentials
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {data.certs.map((c, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "white", padding: "0.85rem 1rem", borderRadius: "10px", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <ShieldCheck size={18} style={{ color: "var(--success)" }} />
                    <span style={{ fontSize: "0.9rem", fontWeight: "600" }}>{c}</span>
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: "500" }}>Verified by L&D</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
