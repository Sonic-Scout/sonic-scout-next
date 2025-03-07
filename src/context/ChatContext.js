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

  // Chat action to send a message
  const sendMessage = useCallback(async (message) => {
    try {
      setIsLoading(true);
      
      // Add user message to the chat
      setMessages(prev => [...prev, { role: 'user', content: message }]);
      
      // Here you would typically make an API call to your chat service
      // For example:
      // const response = await fetch('/api/chat', {
      //   method: 'POST',
      //   body: JSON.stringify({ message }),
      //   headers: { 'Content-Type': 'application/json' }
      // });
      // const data = await response.json();
      
      // For demonstration, let's simulate a response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add response to the chat
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `This is a response to: "${message}"` 
      }]);
      
      return { success: true };
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
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
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
