// /src/context/ChatContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ChatContextType {
  messages: any[];
  setMessages: (messages: any[]) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<any[]>([]);
  return (
    <ChatContext.Provider value={{ messages, setMessages }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
