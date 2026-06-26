import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import IntegrationModal from "./components/IntegrationModal";
import SettingsModal from "./components/SettingsModal";
import KBModal from "./components/KBModal";

export default function App() {
  const [chats, setChats] = useState([
    { id: "chat-1", title: "New Conversation", messages: [], document: null }
  ]);
  const [activeChatId, setActiveChatId] = useState("chat-1");
  
  // Dialog Open States
  const [integrationOpen, setIntegrationOpen] = useState(false);
  const [kbOpen, setKbOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // Responsive sidebar layouts
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Retrieve active chat object
  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];

  // Create a new chat session
  const handleNewChat = () => {
    const newId = `chat-${Date.now()}`;
    const newSession = {
      id: newId,
      title: "New Conversation",
      messages: [],
      document: null
    };
    setChats((prev) => [newSession, ...prev]);
    setActiveChatId(newId);
  };

  // Delete a chat session
  const handleDeleteChat = (chatId) => {
    if (chats.length <= 1) return;
    
    // Filter out session
    const updatedChats = chats.filter((c) => c.id !== chatId);
    setChats(updatedChats);

    // If we deleted the active one, switch active tab to another chat
    if (activeChatId === chatId) {
      setActiveChatId(updatedChats[0].id);
    }
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

          if (sender === "user") {
            const userMsgText = typeof msgData === "string" ? msgData : msgData.text;
            updatedMessages.push({ sender: "user", text: userMsgText });

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
              tool: msgData.tool
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

  return (
    <div className="app-container">
      
      {/* Sidebar Navigation Panel */}
      <Sidebar 
        chats={chats}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
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
      />

      {/* RAG Document Library Modal */}
      <KBModal 
        isOpen={kbOpen}
        onClose={() => setKbOpen(false)}
        onSelectDocForChat={handleSelectDocForChat}
      />

    </div>
  );
}
