"use client";

import { createContext, useContext, useState, useCallback } from 'react';

// Create the context
const ChatContext = createContext();

// Custom hook for using the chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState("");

  // Input handling functions
  const updateInputMessage = useCallback((text) => {
    setInputMessage(text);
  }, []);

  const clearInputMessage = useCallback(() => {
    setInputMessage("");
  }, []);

  // Chat action to send a message
  const sendMessage = useCallback(async (message, isSystemMessage = false) => {
    try {
      // If it's a system/welcome message, don't set loading state
      if (!isSystemMessage) {
        setIsLoading(true);
        console.log('Sending message:', message);
        // Add user message to the chat
        setMessages(prev => [...prev, { role: 'user', content: message }]);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Add assistant response
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `This is a response to: "${message}"` 
        }]);
      } else {
        // Add system/welcome message directly as assistant message
        setMessages(prev => [...prev, { role: 'assistant', content: message }]);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, error };
    } finally {
      if (!isSystemMessage) {
        setIsLoading(false);
      }
    }
  }, []);

  // Clear all messages
  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  const value = {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    inputMessage,
    updateInputMessage,
    clearInputMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
