import React from "react";
import { 
  MessageSquare, 
  Trash2, 
  Cpu, 
  Settings, 
  Database, 
  Plus, 
  User, 
  ChevronLeft, 
  ChevronRight,
  Bot,
  Sparkles
} from "lucide-react";

export default function Sidebar({ 
  chats, 
  activeChatId, 
  setActiveChatId, 
  onNewChat, 
  onDeleteChat,
  onOpenIntegrations,
  onOpenKB,
  onOpenSettings,
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen
}) {

  // Group chats dynamically for visual prototype mapping
  const groupChats = () => {
    const today = [];
    const yesterday = [];
    const previous = [];

    chats.forEach((chat, idx) => {
      if (idx === 0) {
        today.push(chat);
      } else if (idx === 1) {
        yesterday.push(chat);
      } else {
        previous.push(chat);
      }
    });

    return { today, yesterday, previous };
  };

  const { today, yesterday, previous } = groupChats();

  const renderChatLink = (chat) => {
    const isActive = chat.id === activeChatId;
    return (
      <div 
        key={chat.id}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
          padding: isCollapsed ? "0" : "0.6rem 0.85rem",
          width: isCollapsed ? "42px" : "100%",
          height: isCollapsed ? "42px" : "auto",
          margin: isCollapsed ? "0 auto" : "0",
          borderRadius: "10px",
          background: isActive ? "rgba(139, 92, 246, 0.08)" : "transparent",
          border: isActive ? "1px solid rgba(139, 92, 246, 0.35)" : "1px solid transparent",
          cursor: "pointer",
          transition: "all 0.2s"
        }}
        onClick={() => {
          setActiveChatId(chat.id);
          setMobileOpen(false);
        }}
        className="chat-history-item"
      >
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: isCollapsed ? "center" : "flex-start",
          gap: isCollapsed ? "0" : "0.75rem", 
          overflow: "hidden", 
          textOverflow: "ellipsis", 
          whiteSpace: "nowrap", 
          flex: isCollapsed ? "none" : 1 
        }}>
          <MessageSquare size={16} style={{ color: isActive ? "var(--accent-light)" : "var(--text-secondary)", minWidth: "16px" }} />
          {!isCollapsed && (
            <span style={{ fontSize: "14px", color: isActive ? "white" : "var(--text-secondary)", fontWeight: isActive ? "600" : "400", overflow: "hidden", textOverflow: "ellipsis" }}>
              {chat.title}
            </span>
          )}
        </div>

        {!isCollapsed && chats.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteChat(chat.id);
            }}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--text-secondary)",
              opacity: isActive ? 0.7 : 0,
              transition: "opacity 0.2s",
              display: "flex",
              alignItems: "center"
            }}
            className="delete-button"
          >
            <Trash2 size={13} className="trash-hover" />
          </button>
        )}
      </div>
    );
  };

  return (
    <aside 
      className={`sidebar ${isCollapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}
      style={{ borderRight: "1px solid var(--border)", position: "relative" }}
    >
      {/* Sidebar Header */}
      <div style={{ 
        padding: isCollapsed ? "1.25rem 0" : "1.25rem 1.25rem", 
        borderBottom: "1px solid var(--border)", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: isCollapsed ? "center" : "space-between",
        position: "relative"
      }}>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: isCollapsed ? "center" : "flex-start",
          gap: isCollapsed ? "0" : "0.75rem", 
          overflow: "hidden",
          width: isCollapsed ? "100%" : "auto"
        }}>
          
          {/* Logo container with gradient and Sparkle */}
          <img src="/logo.png" alt="Kai Logo" className="logo-pulse" style={{ width: "36px", height: "36px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }} />

          {!isCollapsed && (
            <div style={{ minWidth: "120px" }}>
              <h1 style={{ fontSize: "18px", fontWeight: "700", color: "#FFFFFF", fontFamily: "var(--font-serif)", letterSpacing: "-0.01em" }}>
                Kai
              </h1>
              <p style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: "500" }}>Mentora AI</p>
            </div>
          )}
        </div>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            background: "var(--bg-sidebar)",
            border: "1px solid var(--border)",
            borderRadius: "50%",
            width: "24px",
            height: "24px",
            cursor: "pointer",
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: isCollapsed ? "absolute" : "static",
            right: isCollapsed ? "-12px" : "auto",
            top: isCollapsed ? "50%" : "auto",
            transform: isCollapsed ? "translateY(-50%)" : "none",
            zIndex: 110,
            boxShadow: isCollapsed ? "0 2px 8px rgba(0,0,0,0.5)" : "none"
          }}
          className="desktop-only-toggle"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* New Chat Action */}
      <div style={{ padding: isCollapsed ? "1rem 0" : "1rem 0.75rem 0.5rem 0.75rem", display: "flex", justifyContent: "center" }}>
        <button
          onClick={() => {
            onNewChat();
            setMobileOpen(false);
          }}
          className="btn-new-conv"
          style={{
            width: isCollapsed ? "42px" : "100%",
            height: isCollapsed ? "42px" : "auto",
            borderRadius: isCollapsed ? "50%" : "99px",
            justifyContent: "center",
            padding: isCollapsed ? "0" : "0.65rem 1rem",
            display: "flex",
            alignItems: "center"
          }}
        >
          <Plus size={16} /> {!isCollapsed && "New conversation"}
        </button>
      </div>

      {/* Navigation Links */}
      <div style={{ padding: isCollapsed ? "0.5rem 0" : "0.5rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem", borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
        <button 
          onClick={() => {
            onOpenKB();
            setMobileOpen(false);
          }}
          className="nav-btn scale-hover"
          style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: isCollapsed ? "center" : "flex-start",
            gap: isCollapsed ? "0" : "0.75rem", 
            background: "transparent", 
            border: "none", 
            width: isCollapsed ? "42px" : "100%", 
            height: isCollapsed ? "42px" : "auto", 
            margin: isCollapsed ? "0 auto" : "0", 
            padding: isCollapsed ? "0" : "0.6rem 0.85rem", 
            borderRadius: "8px", 
            cursor: "pointer" 
          }}
        >
          <Database size={16} style={{ color: "var(--text-secondary)" }} />
          {!isCollapsed && <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-secondary)", fontFamily: "var(--font-title)" }}>Knowledge Base</span>}
        </button>
        <button 
          onClick={() => {
            onOpenIntegrations();
            setMobileOpen(false);
          }}
          className="nav-btn scale-hover"
          style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: isCollapsed ? "center" : "flex-start",
            gap: isCollapsed ? "0" : "0.75rem", 
            background: "transparent", 
            border: "none", 
            width: isCollapsed ? "42px" : "100%", 
            height: isCollapsed ? "42px" : "auto", 
            margin: isCollapsed ? "0 auto" : "0", 
            padding: isCollapsed ? "0" : "0.6rem 0.85rem", 
            borderRadius: "8px", 
            cursor: "pointer" 
          }}
        >
          <Cpu size={16} style={{ color: "var(--text-secondary)" }} />
          {!isCollapsed && <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-secondary)", fontFamily: "var(--font-title)" }}>Future Integrations</span>}
        </button>
        <button 
          onClick={() => {
            onOpenSettings();
            setMobileOpen(false);
          }}
          className="nav-btn scale-hover"
          style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: isCollapsed ? "center" : "flex-start",
            gap: isCollapsed ? "0" : "0.75rem", 
            background: "transparent", 
            border: "none", 
            width: isCollapsed ? "42px" : "100%", 
            height: isCollapsed ? "42px" : "auto", 
            margin: isCollapsed ? "0 auto" : "0", 
            padding: isCollapsed ? "0" : "0.6rem 0.85rem", 
            borderRadius: "8px", 
            cursor: "pointer" 
          }}
        >
          <Settings size={16} style={{ color: "var(--text-secondary)" }} />
          {!isCollapsed && <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-secondary)", fontFamily: "var(--font-title)" }}>Settings</span>}
        </button>
      </div>

      {/* History Scroller */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem 0.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {/* Today Section */}
        {today.length > 0 && (
          <div>
            {!isCollapsed && <p className="history-section-header">Today</p>}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {today.map(renderChatLink)}
            </div>
          </div>
        )}

        {/* Yesterday Section */}
        {yesterday.length > 0 && (
          <div>
            {!isCollapsed && <p className="history-section-header">Yesterday</p>}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {yesterday.map(renderChatLink)}
            </div>
          </div>
        )}

        {/* Previous Days Section */}
        {previous.length > 0 && (
          <div>
            {!isCollapsed && <p className="history-section-header">Previous 7 Days</p>}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {previous.map(renderChatLink)}
            </div>
          </div>
        )}

      </div>

      {/* User profile footer */}
      <div style={{ padding: "1.25rem 1rem", borderTop: "1px solid var(--border)", backgroundColor: "rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          
          {/* Avatar with green dot */}
          <div style={{ position: "relative" }}>
            <div style={{
              width: "36px",
              height: "36px",
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
              SS
            </div>
            {/* Green Online Dot */}
            <div style={{
              position: "absolute",
              bottom: "1px",
              right: "1px",
              width: "9px",
              height: "9px",
              borderRadius: "50%",
              backgroundColor: "var(--success)",
              border: "2px solid var(--bg-sidebar)"
            }} />
          </div>

          {!isCollapsed && (
            <div style={{ overflow: "hidden", flex: 1 }}>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "var(--font-title)" }}>
                Siddharth Sen
              </p>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                Maintenance Tech
              </p>
            </div>
          )}

        </div>
      </div>

      {/* Styles for hover delete actions */}
      <style>{`
        .chat-history-item:hover .delete-button {
          opacity: 0.8 !important;
        }
        .trash-hover:hover {
          color: var(--error) !important;
        }
        .history-section-header {
          font-family: var(--font-title);
          font-size: 11px;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          padding-left: 0.85rem;
          margin-bottom: 0.5rem;
          letter-spacing: 0.05em;
        }
        .nav-btn:hover span {
          color: white !important;
        }
        .nav-btn:hover svg {
          color: var(--accent-light) !important;
        }
        @media (max-width: 768px) {
          .desktop-only-toggle {
            display: none !important;
          }
        }
      `}</style>
    </aside>
  );
}
