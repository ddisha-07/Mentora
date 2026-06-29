import React, { useState, useEffect } from "react";
import { 
  MessageCircle, 
  Trash2, 
  Cpu, 
  Settings, 
  Database, 
  Plus, 
  User, 
  ChevronLeft, 
  ChevronRight,
  PanelLeftClose,
  Clock,
  LayoutGrid,
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
  MoreHorizontal,
  SquarePen,
  Search,
  Bell,
  Shield,
  Download,
  Keyboard,
  Info,
  HelpCircle
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
  onOpenSettings,
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
  user,
  onLogout,
  onOpenProfile,
  onClearAllChats,
  onOpenShortcuts
}) {

  const activeUser = user || {
    name: "Siddharth Sen",
    userRole: "Maintenance Tech",
    avatar: "SS"
  };

  const [activeMenuChatId, setActiveMenuChatId] = useState(null);
  const [toast, setToast] = useState(null);
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      setIsMobileViewport(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const menuOptionStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    width: "100%",
    padding: "0.55rem 0.75rem",
    background: "transparent",
    border: "none",
    borderRadius: "8px",
    color: "rgba(255, 255, 255, 0.75)",
    fontSize: "13.5px",
    fontWeight: "500",
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "var(--font-title)",
    transition: "all 0.15s ease"
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => {
      setToast((curr) => (curr === msg ? null : curr));
    }, 3000);
  };
  const handleExportConversations = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(chats, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `mentora_conversations_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast("Conversations exported successfully!");
    } catch (e) {
      showToast("Failed to export conversations.");
    }
  };

  const renderProfileMenu = () => {
    if (!showProfileMenu) return null;
    const popoverItemStyle = {
      display: "flex",
      alignItems: "center",
      gap: "0.65rem",
      width: "100%",
      background: "transparent",
      border: "none",
      padding: "0.45rem 0.6rem",
      borderRadius: "8px",
      color: "var(--text-primary)",
      fontSize: "13px",
      cursor: "pointer",
      textAlign: "left",
      justifyContent: "flex-start",
      fontFamily: "var(--font-title)",
      boxShadow: "none"
    };

    const popoverItemRedStyle = {
      ...popoverItemStyle,
      color: "var(--error)"
    };

    return (
      <>
        {/* Overlay catcher */}
        <div 
          onClick={() => setShowProfileMenu(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9998,
            background: "transparent",
            cursor: "default"
          }}
        />
        {/* Popover container */}
        <div 
          style={{
            position: "absolute",
            bottom: "65px",
            left: isCollapsed ? "12px" : "16px",
            width: "250px",
            backgroundColor: "rgba(10, 14, 28, 0.95)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "14px",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.55)",
            padding: "0.4rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.15rem",
            zIndex: 9999,
            animation: "fadeInUp 0.18s ease-out"
          }}
        >
          {/* Header Card */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.6rem 0.6rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
            marginBottom: "0.25rem"
          }}>
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
              overflow: "hidden",
              flexShrink: 0
            }}>
              {activeUser.profilePic ? (
                <img src={activeUser.profilePic} alt="User Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                activeUser.avatar
              )}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "var(--font-title)", lineHeight: 1.2 }}>
                {activeUser.name}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: "2px" }}>
                {activeUser.userRole}
              </div>
            </div>
          </div>

          {/* Edit Profile */}
          <button 
            onClick={() => {
              setShowProfileMenu(false);
              onOpenProfile();
            }}
            style={popoverItemStyle}
            className="popover-menu-item"
          >
            <User size={14} style={{ color: "var(--text-secondary)" }} />
            <span>Edit Profile</span>
          </button>

          {/* Settings */}
          <button 
            onClick={() => {
              setShowProfileMenu(false);
              onOpenSettings("general");
            }}
            style={popoverItemStyle}
            className="popover-menu-item"
          >
            <Settings size={14} style={{ color: "var(--text-secondary)" }} />
            <span>Settings</span>
          </button>

          {/* Notifications */}
          <button 
            onClick={() => {
              setShowProfileMenu(false);
              onOpenSettings("personalization");
              showToast("Notifications opened");
            }}
            style={popoverItemStyle}
            className="popover-menu-item"
          >
            <Bell size={14} style={{ color: "var(--text-secondary)" }} />
            <span>Notifications</span>
          </button>

          {/* Privacy & Security */}
          <button 
            onClick={() => {
              setShowProfileMenu(false);
              onOpenSettings("account");
              showToast("Privacy & Security opened");
            }}
            style={popoverItemStyle}
            className="popover-menu-item"
          >
            <Shield size={14} style={{ color: "var(--text-secondary)" }} />
            <span>Privacy & Security</span>
          </button>

          {/* Export Conversations */}
          <button 
            onClick={() => {
              setShowProfileMenu(false);
              handleExportConversations();
            }}
            style={popoverItemStyle}
            className="popover-menu-item"
          >
            <Download size={14} style={{ color: "var(--text-secondary)" }} />
            <span>Export Conversations</span>
          </button>

          <div style={{ height: "1px", backgroundColor: "rgba(255, 255, 255, 0.05)", margin: "0.25rem 0" }} />

          {/* Keyboard Shortcuts */}
          <button 
            onClick={() => {
              setShowProfileMenu(false);
              if (onOpenShortcuts) onOpenShortcuts();
            }}
            style={popoverItemStyle}
            className="popover-menu-item"
          >
            <Keyboard size={14} style={{ color: "var(--text-secondary)" }} />
            <span>Keyboard Shortcuts</span>
          </button>

          {/* About Kai */}
          <button 
            onClick={() => {
              setShowProfileMenu(false);
              showToast("Mentora AI v1.0.0 — Your Knowledge Companion");
            }}
            style={popoverItemStyle}
            className="popover-menu-item"
          >
            <Info size={14} style={{ color: "var(--text-secondary)" }} />
            <span>About Kai</span>
          </button>

          {/* Help & Support */}
          <button 
            onClick={() => {
              setShowProfileMenu(false);
              showToast("Wiki docs available at docs.mentora.ai");
            }}
            style={popoverItemStyle}
            className="popover-menu-item"
          >
            <HelpCircle size={14} style={{ color: "var(--text-secondary)" }} />
            <span>Help & Support</span>
          </button>

          <div style={{ height: "1px", backgroundColor: "rgba(255, 255, 255, 0.05)", margin: "0.25rem 0" }} />

          {/* Clear All Chats */}
          <button 
            onClick={() => {
              setShowProfileMenu(false);
              if (onClearAllChats) onClearAllChats();
            }}
            style={popoverItemRedStyle}
            className="popover-menu-item-red"
          >
            <Trash2 size={14} style={{ color: "var(--error)" }} />
            <span>Clear All Chats</span>
          </button>

          {/* Sign Out */}
          <button 
            onClick={() => {
              setShowProfileMenu(false);
              if (onLogout) onLogout();
            }}
            style={popoverItemRedStyle}
            className="popover-menu-item-red"
          >
            <LogOut size={14} style={{ color: "var(--error)" }} />
            <span>Sign Out</span>
          </button>
        </div>
      </>
    );
  };

  const [renamingChatId, setRenamingChatId] = useState(null);
  const [renamingText, setRenamingText] = useState("");

  const handleSaveRename = (chatId) => {
    if (renamingText.trim()) {
      onRenameChat(chatId, renamingText.trim());
      showToast("Conversation renamed!");
    }
    setRenamingChatId(null);
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
      if (chat.temporary) return;
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
          borderRadius: "8px",
          background: isActive ? "rgba(255, 255, 255, 0.05)" : "transparent",
          border: "none",
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
          <MessageCircle size={16} style={{ color: isActive ? "var(--accent-light)" : "var(--text-secondary)", minWidth: "16px" }} />
          {!isCollapsed && (
            renamingChatId === chat.id ? (
              <input
                type="text"
                value={renamingText}
                onChange={(e) => setRenamingText(e.target.value)}
                onBlur={() => handleSaveRename(chat.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSaveRename(chat.id);
                  } else if (e.key === "Escape") {
                    setRenamingChatId(null);
                  }
                }}
                autoFocus
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid var(--accent-light)",
                  borderRadius: "6px",
                  color: "white",
                  fontSize: "14px",
                  padding: "2px 6px",
                  width: "100%",
                  outline: "none",
                  fontFamily: "var(--font-title)"
                }}
              />
            ) : (
              <span style={{ fontSize: "14px", color: isActive ? "white" : "var(--text-secondary)", fontWeight: isActive ? "600" : "400", overflow: "hidden", textOverflow: "ellipsis" }}>
                {chat.title}
              </span>
            )
          )}
        </div>

        {!isCollapsed && (
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (isMenuOpen) {
                  setActiveMenuChatId(null);
                } else {
                  setActiveMenuChatId(chat.id);
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
                {/* Group Chat */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    showToast("Group Chat capability coming soon!");
                    setActiveMenuChatId(null);
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
                    setRenamingChatId(chat.id);
                    setRenamingText(chat.title);
                    setActiveMenuChatId(null);
                  }}
                  className="dropdown-item"
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Edit2 size={14} />
                    <span>Rename</span>
                  </div>
                </button>

                <div className="dropdown-divider" />

                {/* Pin / Unpin */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPinChat(chat.id);
                    showToast(chat.pinned ? "Chat unpinned!" : "Chat pinned to top!");
                    setActiveMenuChatId(null);
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

  if (isCollapsed && !isMobileViewport) {
    return (
      <aside 
        className={`sidebar collapsed ${mobileOpen ? "mobile-open" : ""}`}
        style={{ 
          borderRight: "1px solid var(--border)", 
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "1rem 0",
          gap: "1rem",
          backgroundColor: "var(--bg-sidebar)",
          width: "56px",
          height: "100vh"
        }}
      >
        {/* 1. Kai Logo */}
        <button
          onClick={() => setIsCollapsed(false)}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "32px",
            height: "32px",
            marginBottom: "0.25rem"
          }}
          title="Expand Sidebar"
        >
          <img src="/logo.png" alt="Kai Logo" className="logo-pulse" style={{ width: "32px", height: "32px", borderRadius: "8px", objectFit: "cover" }} />
        </button>

        {/* 2. New Chat Button */}
        {!activeUser.isGuest && (
          <button
            onClick={() => {
              onNewChat();
              showToast("New conversation started!");
            }}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--text-secondary)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              transition: "all 0.2s"
            }}
            className="collapsed-nav-btn scale-hover"
            title="New Conversation"
          >
            <SquarePen size={18} />
          </button>
        )}

        {/* 3. Search Icon */}
        <button
          onClick={() => {
            onOpenSettings("kb");
            showToast("Opening Knowledge Base RAG Search...");
          }}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "var(--text-secondary)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "36px",
            height: "36px",
            borderRadius: "8px",
            transition: "all 0.2s"
          }}
          className="collapsed-nav-btn scale-hover"
          title="Search Knowledge Base"
        >
          <Search size={18} />
        </button>

        {/* 4. Pin Icon */}
        <button
          onClick={() => {
            setIsCollapsed(false);
            showToast("Showing Pinned Conversations");
          }}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "var(--text-secondary)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "36px",
            height: "36px",
            borderRadius: "8px",
            transition: "all 0.2s"
          }}
          className="collapsed-nav-btn scale-hover"
          title="Pinned Chats"
        >
          <Pin size={18} style={{ transform: "rotate(45deg)" }} />
        </button>

        {/* 5. Chat Icon */}
        <button
          onClick={() => {
            setIsCollapsed(false);
          }}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "var(--text-secondary)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "36px",
            height: "36px",
            borderRadius: "8px",
            transition: "all 0.2s"
          }}
          className="collapsed-nav-btn scale-hover"
          title="Recent Chats"
        >
          <MessageCircle size={18} />
        </button>

        {/* Spacer to push profile to bottom */}
        <div style={{ flex: 1 }} />

        {/* 6. Profile Avatar at the Bottom */}
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          title={`Profile: ${activeUser.name}`}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "36px",
            height: "36px",
            position: "relative"
          }}
        >
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
            fontSize: "12px",
            fontFamily: "var(--font-title)",
            overflow: "hidden"
          }}>
            {activeUser.profilePic ? (
              <img src={activeUser.profilePic} alt="User Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              activeUser.avatar
            )}
          </div>
          {/* Green Online Dot */}
          <div style={{
            position: "absolute",
            bottom: "0px",
            right: "0px",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "var(--success)",
            border: "2px solid var(--bg-sidebar)"
          }} />
        </button>

        {/* Toast Alert */}
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

        {/* Profile menu popover overlay */}
        {renderProfileMenu()}

        <style>{`
          .collapsed-nav-btn:hover {
            color: white !important;
            background-color: rgba(255, 255, 255, 0.05) !important;
          }
        `}</style>
      </aside>
    );
  }

  return (
    <aside 
      className={`sidebar ${isCollapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}
      style={{ borderRight: "1px solid var(--border)", position: "relative" }}
    >
      {/* Sidebar Header */}
      <div style={{ 
        padding: "1rem 0.75rem 0.5rem 0.75rem", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        position: "relative"
      }}>
        {/* Kai Logo */}
        <div 
          onClick={() => {
            onNewChat();
            setMobileOpen(false);
          }}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "0.5rem", 
            cursor: "pointer",
            padding: "4px"
          }}
          className="scale-hover"
          title="New Chat"
        >
          <img src="/logo.png" alt="Kai Logo" style={{ width: "24px", height: "24px", borderRadius: "50%", objectFit: "cover" }} />
          <span style={{ fontSize: "15px", fontWeight: "700", color: "white", fontFamily: "var(--font-title)" }}>Kai</span>
        </div>

        {/* Collapse Button */}
        <button 
          onClick={() => {
            setIsCollapsed(true);
            setMobileOpen(false);
          }} 
          style={{
            background: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "8px",
            cursor: "pointer",
            color: "var(--text-secondary)",
            padding: "6px",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s"
          }}
          className="scale-hover hover-white-border"
          title="Collapse Sidebar"
        >
          <PanelLeftClose size={16} />
        </button>
      </div>

      {/* Navigation Links / Options */}
      <div style={{ 
        padding: "0.5rem 0.75rem 0.25rem 0.75rem", 
        display: "flex", 
        flexDirection: "column", 
        gap: "0.2rem" 
      }}>
        {/* New Chat Button */}
        <button
          onClick={() => {
            onNewChat();
            setMobileOpen(false);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            width: "100%",
            padding: "0.65rem 0.75rem",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontSize: "13.5px",
            fontWeight: "600",
            cursor: "pointer",
            textAlign: "left",
            fontFamily: "var(--font-title)"
          }}
          className="scale-hover"
        >
          <SquarePen size={16} />
          <span>New chat</span>
        </button>

        {/* Search Chats */}
        <button 
          onClick={() => {
            onOpenSettings("kb");
            setMobileOpen(false);
          }}
          style={menuOptionStyle}
          className="sidebar-menu-btn"
        >
          <Search size={16} />
          <span>Search chats</span>
        </button>

        {/* Library */}
        <button 
          onClick={() => {
            onOpenSettings("kb");
            setMobileOpen(false);
          }}
          style={menuOptionStyle}
          className="sidebar-menu-btn"
        >
          <Database size={16} />
          <span>Library</span>
        </button>

        {/* Projects */}
        <button 
          onClick={() => {
            onOpenSettings("integrations");
            setMobileOpen(false);
          }}
          style={menuOptionStyle}
          className="sidebar-menu-btn"
        >
          <Folder size={16} />
          <span>Projects</span>
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
              <div style={{ paddingBottom: "0.75rem", marginBottom: "0.5rem" }}>
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
        borderTop: "none", 
        backgroundColor: "transparent",
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
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            title="Profile Menu"
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
                fontFamily: "var(--font-title)",
                overflow: "hidden"
              }}>
                {activeUser.profilePic ? (
                  <img src={activeUser.profilePic} alt="User Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  activeUser.avatar
                )}
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
      `}</style>

      {/* Profile menu popover overlay */}
      {renderProfileMenu()}

      <style>{`
        .popover-menu-item {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          width: 100%;
          background: transparent;
          border: none;
          padding: 0.45rem 0.6rem;
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 13px;
          cursor: pointer;
          text-align: left;
          transition: background 0.15s;
        }
        .popover-menu-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        .popover-menu-item-red {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          width: 100%;
          background: transparent;
          border: none;
          padding: 0.45rem 0.6rem;
          border-radius: 8px;
          color: var(--error);
          font-size: 13px;
          cursor: pointer;
          text-align: left;
          transition: background 0.15s;
        }
        .popover-menu-item-red:hover {
          background: rgba(239, 68, 68, 0.08);
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
        .hover-white-border:hover {
          border-color: rgba(255, 255, 255, 0.4) !important;
          color: white !important;
          background-color: rgba(255, 255, 255, 0.05) !important;
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
