import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import IntegrationModal from "./components/IntegrationModal";
import SettingsModal from "./components/SettingsModal";
import KBModal from "./components/KBModal";
import LoginPage from "./components/LoginPage";
import EditProfileModal from "./components/EditProfileModal";

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("mentora_active_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [chats, setChats] = useState([
    { id: "chat-1", title: "New Conversation", messages: [], document: null, createdAt: Date.now() }
  ]);
  const [activeChatId, setActiveChatId] = useState("chat-1");
  
  // Dialog Open States
  const [integrationOpen, setIntegrationOpen] = useState(false);
  const [kbOpen, setKbOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
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
      // Start a clean/fresh regular user session
      setChats([
        { id: "chat-1", title: "New Conversation", messages: [], document: null, createdAt: Date.now() }
      ]);
      setActiveChatId("chat-1");
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
    setUser((prev) => ({
      ...prev,
      ...updatedDetails
    }));
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
        onOpenIntegrations={() => setIntegrationOpen(true)}
        onOpenKB={() => setKbOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
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

      {/* RAG Integrations Specifications Modal */}
      <IntegrationModal 
        isOpen={integrationOpen}
        onClose={() => setIntegrationOpen(false)}
      />

      {/* System Parameter Configurations Modal */}
      <SettingsModal 
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        user={user}
        onSaveProfile={handleUpdateProfile}
      />

      {/* RAG Document Library Modal */}
      <KBModal 
        isOpen={kbOpen}
        onClose={() => setKbOpen(false)}
        onSelectDocForChat={handleSelectDocForChat}
      />

      {/* Edit Profile Details Modal */}
      <EditProfileModal 
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={user}
        onSave={handleUpdateProfile}
      />

    </div>
  );
}
