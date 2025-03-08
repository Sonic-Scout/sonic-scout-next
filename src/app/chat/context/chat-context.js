'use client';

import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "SonicScout",
      content: "Greetings! I am here to assist you with all aspects of tokenomics. From analyzing token distribution to optimizing market strategies, I'm ready to help you achieve your crypto project's goals.\nHow can I assist you today?",
      timestamp: "07:36 PM",
      isBot: true,
    },
  ]);
  const [isLogin, setIsLogin] = useState(false);

  const sendMessage = async (message) => {
    if (!message.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      sender: "You",
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isBot: false,
    };
    
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    
    // Here you would typically call an API to get the bot's response
    // Simulating a bot response after a short delay
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        sender: "SonicScout",
        content: `I received your message: "${message}". This is a placeholder response. In a real implementation, this would come from your backend or AI service.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isBot: true,
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    }, 1000);
  };

  const login = () => {
    setIsLogin(true);
  };

  const logout = () => {
    setIsLogin(false);
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, isLogin, login, logout }}>
      {children}
    </ChatContext.Provider>
  );
};
