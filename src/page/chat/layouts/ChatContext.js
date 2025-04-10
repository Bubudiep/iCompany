import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [lastMessages, setLastMessages] = useState({}); // Lưu tin nhắn cuối cùng theo room ID

  const updateLastMessage = (roomId, message) => {
    setLastMessages((prev) => ({
      ...prev,
      [roomId]: message,
    }));
  };

  return (
    <ChatContext.Provider value={{ lastMessages, updateLastMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);