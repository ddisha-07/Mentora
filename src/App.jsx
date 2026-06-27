import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import IntegrationModal from "./components/IntegrationModal";
import SettingsModal from "./components/SettingsModal";
import KBModal from "./components/KBModal";
import LoginPage from "./components/LoginPage";
import EditProfileModal from "./components/EditProfileModal";
import KeyboardShortcutsModal from "./components/KeyboardShortcutsModal";

const DEFAULT_SHORTCUTS = [
  { id: "send_msg", section: "Composer", desc: "Send message", keys: ["Enter"], enabled: true },
  { id: "attach_doc", section: "Composer", desc: "Add photos & files", keys: ["Ctrl", "Alt", "A"], enabled: true },
  { id: "dictation", section: "Composer", desc: "Toggle dictation", keys: ["Ctrl", "Alt", "D"], enabled: true },
  { id: "new_chat", section: "App", desc: "Open new chat", keys: ["Ctrl", "Alt", "N"], enabled: true },
  { id: "toggle_sidebar", section: "App", desc: "Toggle sidebar", keys: ["Ctrl", "Alt", "S"], enabled: true },
  { id: "open_settings", section: "App", desc: "Open settings", keys: ["Ctrl", "Alt", "K"], enabled: true },
  { id: "open_profile", section: "App", desc: "Show profile modal", keys: ["Ctrl", "Alt", "P"], enabled: true },
  { id: "clear_chats", section: "App", desc: "Clear all chats", keys: ["Ctrl", "Alt", "C"], enabled: true },
  { id: "show_shortcuts", section: "App", desc: "Show shortcuts", keys: ["Ctrl", "Alt", "/"], enabled: true }
];

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("mentora_active_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [chats, setChats] = useState(() => {
    try {
      const savedUserStr = localStorage.getItem("mentora_active_user");
      if (savedUserStr) {
        const savedUser = JSON.parse(savedUserStr);
        if (savedUser && !savedUser.isGuest) {
          const savedChats = localStorage.getItem("mentora_chats_" + savedUser.email);
          if (savedChats) {
            return JSON.parse(savedChats);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
    return [
      { id: "chat-1", title: "New Conversation", messages: [], document: null, createdAt: Date.now() }
    ];
  });

  const [activeChatId, setActiveChatId] = useState(() => {
    try {
      const savedUserStr = localStorage.getItem("mentora_active_user");
      if (savedUserStr) {
        const savedUser = JSON.parse(savedUserStr);
        if (savedUser && !savedUser.isGuest) {
          const savedActiveId = localStorage.getItem("mentora_active_chat_" + savedUser.email);
          if (savedActiveId) return savedActiveId;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return "chat-1";
  });

  // Synchronize chats history and active chat to localStorage
  useEffect(() => {
    if (user && !user.isGuest) {
      localStorage.setItem("mentora_chats_" + user.email, JSON.stringify(chats));
    }
  }, [chats, user]);

  useEffect(() => {
    if (user && !user.isGuest) {
      localStorage.setItem("mentora_active_chat_" + user.email, activeChatId);
    }
  }, [activeChatId, user]);
  
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState("general");
  const [profileOpen, setProfileOpen] = useState(false);
  
  // Responsive sidebar layouts
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Authentication Handlers
  const handleLogin = (email, enteredName, enteredJobProfile, isGuest, rememberMe) => {
    const name = enteredName || "Guest";
    const userRole = enteredJobProfile || "Guest Mode";
    const role = isGuest ? "Guest" : "Employee";
    
    let avatar = "GU";
    if (name) {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) {
        avatar = (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
      } else if (name.length >= 2) {
        avatar = name.slice(0, 2).toUpperCase();
      } else if (name.length === 1) {
        avatar = name.toUpperCase();
      }
    }
    
    if (isGuest) {
      // Start a clean/fresh guest session
      setChats([
        { id: "chat-guest", title: "Guest Session", messages: [], document: null, createdAt: Date.now() }
      ]);
      setActiveChatId("chat-guest");
    } else {
      // Regular user - try to retrieve saved chats
      let initialChats = null;
      let initialActiveId = null;
      try {
        const savedChats = localStorage.getItem("mentora_chats_" + email);
        if (savedChats) {
          initialChats = JSON.parse(savedChats);
          initialActiveId = localStorage.getItem("mentora_active_chat_" + email);
        }
      } catch (e) {
        console.error(e);
      }

      if (initialChats && initialChats.length > 0) {
        // If the first chat in the retrieved list is already empty, just select it
        if (initialChats[0].messages && initialChats[0].messages.length === 0) {
          setChats(initialChats);
          setActiveChatId(initialChats[0].id);
        } else {
          // Prepend a fresh new conversation so they log back in to a new conversation
          const newId = `chat-${Date.now()}`;
          const newSession = {
            id: newId,
            title: "New Conversation",
            messages: [],
            document: null,
            createdAt: Date.now()
          };
          setChats([newSession, ...initialChats]);
          setActiveChatId(newId);
        }
      } else {
        const newId = "chat-1";
        setChats([
          { id: newId, title: "New Conversation", messages: [], document: null, createdAt: Date.now() }
        ]);
        setActiveChatId(newId);
      }
    }
    
    const activeUser = { email: email || "guest@mentora.internal", role, name, userRole, avatar, isGuest };
    setUser(activeUser);

    if (rememberMe) {
      localStorage.setItem("mentora_active_user", JSON.stringify(activeUser));
    } else {
      localStorage.removeItem("mentora_active_user");
    }
  };

  const handleUpdateProfile = (updatedDetails) => {
    setUser((prev) => {
      const nextUser = {
        ...prev,
        ...updatedDetails
      };
      if (localStorage.getItem("mentora_active_user")) {
        localStorage.setItem("mentora_active_user", JSON.stringify(nextUser));
      }
      return nextUser;
    });
  };

  // Retrieve active chat object
  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];

  // Create a new chat session
  const handleNewChat = () => {
    const newId = `chat-${Date.now()}`;
    const newSession = {
      id: newId,
      title: "New Conversation",
      messages: [],
      document: null,
      createdAt: Date.now()
    };
    setChats((prev) => [newSession, ...prev]);
    setActiveChatId(newId);
  };

  // Delete a chat session
  const handleDeleteChat = (chatId) => {
    const updatedChats = chats.filter((c) => c.id !== chatId);
    if (updatedChats.length === 0) {
      const newId = `chat-${Date.now()}`;
      const newSession = {
        id: newId,
        title: "New Conversation",
        messages: [],
        document: null,
        createdAt: Date.now()
      };
      setChats([newSession]);
      setActiveChatId(newId);
    } else {
      setChats(updatedChats);
      if (activeChatId === chatId) {
        const nextActive = updatedChats.find(c => !c.archived) || updatedChats[0];
        setActiveChatId(nextActive.id);
      }
    }
  };

  const handleClearAllChats = () => {
    if (window.confirm("Are you sure you want to clear all conversations? This action cannot be undone.")) {
      const newId = `chat-${Date.now()}`;
      const newSession = {
        id: newId,
        title: "New Conversation",
        messages: [],
        document: null,
        createdAt: Date.now()
      };
      setChats([newSession]);
      setActiveChatId(newId);
    }
  };

  // Rename a chat session
  const handleRenameChat = (chatId, newTitle) => {
    setChats((prev) =>
      prev.map((chat) => (chat.id === chatId ? { ...chat, title: newTitle } : chat))
    );
  };

  // Toggle pinned state of a chat session
  const handlePinChat = (chatId) => {
    setChats((prev) =>
      prev.map((chat) => (chat.id === chatId ? { ...chat, pinned: !chat.pinned } : chat))
    );
  };

  // Toggle archived state of a chat session
  const handleArchiveChat = (chatId) => {
    setChats((prev) => {
      const updated = prev.map((chat) =>
        chat.id === chatId ? { ...chat, archived: !chat.archived } : chat
      );
      
      const target = prev.find(c => c.id === chatId);
      if (target && !target.archived && activeChatId === chatId) {
        const nextActive = updated.find(c => !c.archived);
        if (nextActive) {
          setActiveChatId(nextActive.id);
        } else {
          const newId = `chat-${Date.now()}`;
          const newSession = {
            id: newId,
            title: "New Conversation",
            messages: [],
            document: null,
            createdAt: Date.now()
          };
          setActiveChatId(newId);
          return [newSession, ...updated];
        }
      }
      return updated;
    });
  };

  // Attach upload parsed document to active chat
  const handleAttachDocument = (docData) => {
    setChats((prev) => 
      prev.map((chat) => {
        if (chat.id === activeChatId) {
          return { ...chat, document: docData };
        }
        return chat;
      })
    );
  };

  // Clear attached document from active chat
  const handleClearDocument = () => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === activeChatId) {
          return { ...chat, document: null };
        }
        return chat;
      })
    );
  };

  // Select document from KB and bind it to chat context
  const handleSelectDocForChat = (doc) => {
    // Generate document parsed data structure
    const docData = {
      name: doc.title,
      size: "Vector Ingested",
      summary: doc.summary,
      topics: doc.keywords,
      questions: [
        `Summarize ${doc.title}`,
        `What are the safety rules in ${doc.title}?`,
        `Ask about guidelines in ${doc.title}`
      ]
    };

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === activeChatId) {
          // If conversation has messages, add info text, else just bind it
          const updatedMessages = [...chat.messages];
          updatedMessages.push({
            sender: "ai",
            text: `✔ I have bound "${doc.title}" to this chat context. Ask me any questions specifically about it!`,
            source: doc.title,
            topics: doc.keywords,
            intent: "Context Binding",
            tool: "Knowledge Vector Ingestion"
          });

          return {
            ...chat,
            document: docData,
            messages: updatedMessages,
            title: `Chat re: ${doc.title.slice(0, 15)}...`
          };
        }
        return chat;
      })
    );
  };

  // Send message helper
  const handleSendMessage = (sender, msgData) => {
    setChats((prev) => 
      prev.map((chat) => {
        if (chat.id === activeChatId) {
          let updatedMessages = [...chat.messages];
          let updatedTitle = chat.title;
          const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          if (sender === "user") {
            const userMsgText = typeof msgData === "string" ? msgData : msgData.text;
            updatedMessages.push({ 
              sender: "user", 
              text: userMsgText,
              time: currentTime 
            });

            // If it's the first user message, rename the chat title automatically
            if (chat.messages.filter(m => m.sender === "user").length === 0) {
              const maxLen = 22;
              updatedTitle = userMsgText.length > maxLen 
                ? userMsgText.slice(0, maxLen) + "..." 
                : userMsgText;
            }
          } else {
            // AI response structured data
            updatedMessages.push({
              sender: "ai",
              text: msgData.text,
              source: msgData.source,
              learning: msgData.learning,
              topics: msgData.topics,
              intent: msgData.intent,
              tool: msgData.tool,
              time: currentTime
            });
          }

          return {
            ...chat,
            messages: updatedMessages,
            title: updatedTitle
          };
        }
        return chat;
      })
    );
  };
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [shortcuts, setShortcuts] = useState(() => {
    try {
      const saved = localStorage.getItem("mentora_keyboard_shortcuts");
      return saved ? JSON.parse(saved) : DEFAULT_SHORTCUTS;
    } catch {
      return DEFAULT_SHORTCUTS;
    }
  });

  // Persist custom shortcut configuration
  useEffect(() => {
    localStorage.setItem("mentora_keyboard_shortcuts", JSON.stringify(shortcuts));
  }, [shortcuts]);

  const handleSaveShortcut = (id, updatedFields) => {
    setShortcuts((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedFields } : s))
    );
  };

  const handleRestoreDefaults = () => {
    if (window.confirm("Restore all keyboard shortcuts to defaults?")) {
      setShortcuts(DEFAULT_SHORTCUTS);
    }
  };

  const isShortcutMatch = (shortcutKeys, e) => {
    const hasCtrl = shortcutKeys.includes("Ctrl");
    const hasAlt = shortcutKeys.includes("Alt");
    const hasShift = shortcutKeys.includes("Shift");

    // Modifier check
    if (hasCtrl !== (e.ctrlKey || e.metaKey)) return false;
    if (hasAlt !== e.altKey) return false;
    if (hasShift !== e.shiftKey) return false;

    // Find the base key
    const baseKey = shortcutKeys.find(k => k !== "Ctrl" && k !== "Alt" && k !== "Shift");
    if (!baseKey) return false;

    let eventKey = e.key;
    if (eventKey === " ") eventKey = "Space";
    if (eventKey === "ArrowUp") eventKey = "Up";
    if (eventKey === "ArrowDown") eventKey = "Down";
    if (eventKey === "ArrowLeft") eventKey = "Left";
    if (eventKey === "ArrowRight") eventKey = "Right";

    return eventKey.toLowerCase() === baseKey.toLowerCase();
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 1. General escape close handler
      if (e.key === "Escape") {
        setSettingsOpen(false);
        setProfileOpen(false);
        setShortcutsOpen(false);
        return;
      }

      // 2. Find matching, enabled shortcut
      const matched = shortcuts.find(s => s.enabled && isShortcutMatch(s.keys, e));
      if (!matched) return;

      e.preventDefault();
      e.stopPropagation();

      switch (matched.id) {
        case "new_chat":
          handleNewChat();
          break;
        case "toggle_sidebar":
          setIsCollapsed((prev) => !prev);
          break;
        case "open_settings":
          setSettingsTab("general");
          setSettingsOpen(true);
          break;
        case "open_profile":
          setProfileOpen(true);
          break;
        case "clear_chats":
          handleClearAllChats();
          break;
        case "show_shortcuts":
          setShortcutsOpen(true);
          break;
        case "attach_doc":
          const attachBtn = document.getElementById("chat-attach-trigger");
          if (attachBtn) attachBtn.click();
          break;
        case "dictation":
          alert("Dictation mode is a prototype interface component. Configure integrations in Settings roadmap!");
          break;
        case "send_msg":
          const sendBtn = document.getElementById("chat-send-trigger");
          if (sendBtn) sendBtn.click();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [chats, activeChatId, shortcuts]);

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      
      {/* Sidebar Navigation Panel */}
      <Sidebar 
        user={user}
        onLogout={() => {
          setUser(null);
          localStorage.removeItem("mentora_active_user");
          setChats([
            { id: "chat-1", title: "New Conversation", messages: [], document: null, createdAt: Date.now() }
          ]);
          setActiveChatId("chat-1");
        }}
        onOpenProfile={() => setProfileOpen(true)}
        chats={chats}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
        onPinChat={handlePinChat}
        onArchiveChat={handleArchiveChat}
        onOpenSettings={(tab) => {
          setSettingsTab(tab || "general");
          setSettingsOpen(true);
        }}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onClearAllChats={handleClearAllChats}
        onOpenShortcuts={() => setShortcutsOpen(true)}
      />

      {/* Main chat window container */}
      <main className="main-content">
        <ChatWindow 
          user={user}
          activeChat={activeChat}
          onSendMessage={handleSendMessage}
          onAttachDocument={handleAttachDocument}
          onClearDocument={handleClearDocument}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          isCollapsedSidebar={isCollapsed}
        />
      </main>

      {/* System Parameter Configurations & Administration Modal */}
      <SettingsModal 
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        user={user}
        onSaveProfile={handleUpdateProfile}
        onSelectDocForChat={handleSelectDocForChat}
        initialTab={settingsTab}
      />

      {/* Edit Profile Details Modal */}
      <EditProfileModal 
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={user}
        onSave={handleUpdateProfile}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal 
        isOpen={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
        shortcuts={shortcuts}
        onSaveShortcut={handleSaveShortcut}
        onRestoreDefaults={handleRestoreDefaults}
      />

    </div>
  );
}
