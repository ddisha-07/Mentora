import React, { useState } from "react";
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
  Sparkles,
  LogOut,
  Lock,
  Share2,
  Users,
  Edit2,
  Folder,
  Pin,
  Archive,
  MoreHorizontal
} from "lucide-react";

export default function Sidebar({ 
  chats, 
  activeChatId, 
  setActiveChatId, 
  onNewChat, 
  onDeleteChat,
  onRenameChat,
  onPinChat,
  onArchiveChat,
  onOpenIntegrations,
  onOpenKB,
  onOpenSettings,
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
  user,
  onLogout,
  onOpenProfile
}) {

  const activeUser = user || {
    name: "Siddharth Sen",
    userRole: "Maintenance Tech",
    avatar: "SS"
  };

  const [activeMenuChatId, setActiveMenuChatId] = useState(null);
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => {
      setToast((curr) => (curr === msg ? null : curr));
    }, 3000);
  };

  // Group chats dynamically for visual prototype mapping
  const groupChats = () => {
    const pinned = [];
    const today = [];
    const yesterday = [];
    const previous = [];

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;

    chats.forEach((chat) => {
      if (chat.archived) return;
      if (chat.pinned) {
        pinned.push(chat);
        return;
      }
      
      const chatTime = chat.createdAt ? new Date(chat.createdAt).getTime() : Date.now();

      if (chatTime >= todayStart) {
        today.push(chat);
      } else if (chatTime >= yesterdayStart) {
        yesterday.push(chat);
      } else {
        previous.push(chat);
      }
    });

    return { pinned, today, yesterday, previous };
  };

  const { pinned, today, yesterday, previous } = groupChats();

  const renderChatLink = (chat) => {
    const isActive = chat.id === activeChatId;
    const isMenuOpen = activeMenuChatId === chat.id;

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
          position: "relative",
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

        {!isCollapsed && (
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (isMenuOpen) {
                  setActiveMenuChatId(null);
                  setProjectMenuOpen(false);
                } else {
                  setActiveMenuChatId(chat.id);
                  setProjectMenuOpen(false);
                }
              }}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "var(--text-secondary)",
                opacity: (isActive || isMenuOpen) ? 0.8 : 0,
                transition: "opacity 0.2s",
                display: "flex",
                alignItems: "center",
                padding: "2px",
                borderRadius: "4px"
              }}
              className="more-options-btn"
            >
              <MoreHorizontal size={14} />
            </button>

            {isMenuOpen && (
              <div 
                style={{
                  position: "absolute",
                  right: "0",
                  top: "24px",
                  width: "200px",
                  backgroundColor: "rgba(20, 20, 30, 0.95)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "12px",
                  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                  padding: "6px",
                  zIndex: 999,
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px"
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Share */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    try {
                      navigator.clipboard.writeText(`https://mentora.ai/share/${chat.id}`);
                      showToast("Share link copied to clipboard!");
                    } catch (err) {
                      showToast("Mock link generated for sharing!");
                    }
                    setActiveMenuChatId(null);
                    setProjectMenuOpen(false);
                  }}
                  className="dropdown-item"
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Share2 size={14} />
                    <span>Share</span>
                  </div>
                </button>

                {/* Group Chat */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    showToast("Group Chat capability coming soon!");
                    setActiveMenuChatId(null);
                    setProjectMenuOpen(false);
                  }}
                  className="dropdown-item"
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Users size={14} />
                    <span>Start a group chat</span>
                  </div>
                </button>

                {/* Rename */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newTitle = prompt("Rename conversation:", chat.title);
                    if (newTitle && newTitle.trim()) {
                      onRenameChat(chat.id, newTitle.trim());
                      showToast("Conversation renamed!");
                    }
                    setActiveMenuChatId(null);
                    setProjectMenuOpen(false);
                  }}
                  className="dropdown-item"
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Edit2 size={14} />
                    <span>Rename</span>
                  </div>
                </button>

                {/* Move to project */}
                <div style={{ position: "relative" }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setProjectMenuOpen(!projectMenuOpen);
                    }}
                    onMouseEnter={() => setProjectMenuOpen(true)}
                    className="dropdown-item"
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Folder size={14} />
                      <span>Move to project</span>
                    </div>
                    <ChevronRight size={14} />
                  </button>

                  {projectMenuOpen && (
                    <div 
                      style={{
                        position: "absolute",
                        right: "100%",
                        top: "0",
                        marginRight: "6px",
                        width: "180px",
                        backgroundColor: "rgba(20, 20, 30, 0.95)",
                        backdropFilter: "blur(16px)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "12px",
                        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.6)",
                        padding: "6px",
                        zIndex: 1000,
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px"
                      }}
                      onMouseEnter={() => setProjectMenuOpen(true)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {["EHS Safety", "Mechanical Maintenance", "Steel Production"].map((proj) => (
                        <button
                          key={proj}
                          onClick={(e) => {
                            e.stopPropagation();
                            showToast(`Moved chat to ${proj}!`);
                            setActiveMenuChatId(null);
                            setProjectMenuOpen(false);
                          }}
                          className="dropdown-item"
                        >
                          {proj}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="dropdown-divider" />

                {/* Pin / Unpin */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPinChat(chat.id);
                    showToast(chat.pinned ? "Chat unpinned!" : "Chat pinned to top!");
                    setActiveMenuChatId(null);
                    setProjectMenuOpen(false);
                  }}
                  className="dropdown-item"
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Pin size={14} style={chat.pinned ? { transform: "rotate(45deg)", color: "var(--accent-light)" } : {}} />
                    <span>{chat.pinned ? "Unpin chat" : "Pin chat"}</span>
                  </div>
                </button>

                {/* Archive */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onArchiveChat(chat.id);
                    showToast("Chat archived!");
                    setActiveMenuChatId(null);
                    setProjectMenuOpen(false);
                  }}
                  className="dropdown-item"
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Archive size={14} />
                    <span>Archive</span>
                  </div>
                </button>

                {/* Delete */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const hasMessages = chat.messages && chat.messages.length > 0;
                    const confirmMsg = hasMessages 
                      ? "Are you sure you want to delete this conversation and all its messages?"
                      : "Are you sure you want to delete this conversation?";
                    if (window.confirm(confirmMsg)) {
                      onDeleteChat(chat.id);
                      showToast("Conversation deleted!");
                    }
                    setActiveMenuChatId(null);
                    setProjectMenuOpen(false);
                  }}
                  className="dropdown-item dropdown-item-danger"
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Trash2 size={14} style={{ color: "#ef4444" }} />
                    <span>Delete</span>
                  </div>
                </button>
              </div>
            )}
          </div>
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
      {!activeUser.isGuest && (
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
      )}

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
        
        {activeUser.isGuest ? (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            height: "100%",
            padding: isCollapsed ? "0.25rem" : "1.25rem 1rem",
            gap: "0.75rem",
            color: "var(--text-secondary)",
            background: "rgba(255, 255, 255, 0.01)",
            border: "1px dashed var(--border)",
            borderRadius: "12px",
            margin: "0 0.5rem"
          }}>
            <Lock size={isCollapsed ? 16 : 24} style={{ color: "var(--accent-light)", opacity: 0.8 }} />
            {!isCollapsed && (
              <>
                <p style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "white",
                  margin: 0,
                  fontFamily: "var(--font-title)"
                }}>
                  Guest Mode Active
                </p>
                <p style={{
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  margin: 0,
                  lineHeight: "1.4"
                }}>
                  Conversation history is not saved in Guest Mode.
                </p>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Pinned Section */}
            {pinned.length > 0 && (
              <div style={{ borderBottom: "1px dashed rgba(255, 255, 255, 0.08)", paddingBottom: "0.75rem", marginBottom: "0.5rem" }}>
                {!isCollapsed && (
                  <p className="history-section-header" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Pin size={11} style={{ transform: "rotate(45deg)", color: "var(--accent-light)" }} />
                    Pinned
                  </p>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  {pinned.map(renderChatLink)}
                </div>
              </div>
            )}

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
          </>
        )}

      </div>

      {/* User profile footer */}
      <div style={{ 
        padding: isCollapsed ? "1.25rem 0.5rem" : "1.25rem 1rem", 
        borderTop: "1px solid var(--border)", 
        backgroundColor: "rgba(0,0,0,0.15)",
        transition: "padding 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
      }}>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: isCollapsed ? "center" : "space-between",
          gap: "0.5rem",
          width: "100%"
        }}>
          
          <div 
            onClick={onOpenProfile}
            title="Edit Profile"
            className="profile-info-container"
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "0.75rem", 
              overflow: "hidden",
              flex: isCollapsed ? "0 0 auto" : 1,
              cursor: "pointer",
              borderRadius: "8px",
              padding: "4px",
              transition: "background 0.2s"
            }}
          >
            {/* Avatar with green dot */}
            <div style={{ position: "relative", flexShrink: 0 }}>
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
                {activeUser.avatar}
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
                <p style={{ fontSize: "14px", fontWeight: "600", color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "var(--font-title)", margin: 0 }}>
                  {activeUser.name}
                </p>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", margin: 0 }}>
                  {activeUser.userRole}
                </p>
              </div>
            )}
          </div>

          {!isCollapsed && onLogout && (
            <button
              onClick={onLogout}
              title="Sign Out"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "6px",
                borderRadius: "6px",
                transition: "all 0.2s"
              }}
              className="logout-btn"
            >
              <LogOut size={16} />
            </button>
          )}

        </div>
      </div>
      
      {/* Backdrop overlay for closing dropdown menus on click outside */}
      {activeMenuChatId && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 998,
            background: "transparent",
            cursor: "default"
          }}
          onClick={(e) => {
            e.stopPropagation();
            setActiveMenuChatId(null);
            setProjectMenuOpen(false);
          }}
        />
      )}

      {/* Visual Toast Notification Alert */}
      {toast && (
        <div style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          backgroundColor: "rgba(15, 15, 25, 0.85)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(139, 92, 246, 0.4)",
          borderRadius: "8px",
          padding: "10px 16px",
          color: "white",
          zIndex: 9999,
          fontSize: "13px",
          fontWeight: "500",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          animation: "fadeInUp 0.3s ease-out"
        }}>
          <Sparkles size={14} style={{ color: "var(--accent-light)" }} />
          <span>{toast}</span>
        </div>
      )}

      {/* Styles for options actions and dropdown */}
      <style>{`
        .chat-history-item:hover .more-options-btn {
          opacity: 0.8 !important;
        }
        .more-options-btn:hover {
          color: white !important;
          background-color: rgba(255, 255, 255, 0.08) !important;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 8px 10px;
          background: transparent;
          border: none;
          border-radius: 6px;
          color: var(--text-secondary);
          font-size: 13px;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
          font-family: var(--font-title);
          gap: 8px;
        }
        .dropdown-item:hover {
          background-color: rgba(139, 92, 246, 0.15) !important;
          color: white !important;
        }
        .dropdown-item-danger {
          color: #ef4444 !important;
        }
        .dropdown-item-danger:hover {
          background-color: rgba(239, 68, 68, 0.15) !important;
          color: #ff6b6b !important;
        }
        .dropdown-divider {
          height: 1px;
          background-color: rgba(255, 255, 255, 0.08);
          margin: 4px 0;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
        .profile-info-container:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }
        .logout-btn:hover {
          color: var(--error) !important;
          background-color: rgba(239, 68, 68, 0.1) !important;
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
