"use client";

import { createContext, useContext, useState, useCallback } from 'react';
import { apiClient } from '@/lib/chat-api';

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
  const [userAgentId, setUserAgentId] = useState(null);
  const [elizaAgentId, setElizaAgentId] = useState(null);

  // Input handling functions
  const updateInputMessage = useCallback((text) => {
    setInputMessage(text);
  }, []);

  const clearInputMessage = useCallback(() => {
    setInputMessage("");
  }, []);

  // Chat action to send a message
  const sendMessage = useCallback(async (message, isSystemMessage = false, selectedFile = null) => {
    try {
      // If it's a system/welcome message, don't set loading state and don't call API
      if (!isSystemMessage) {
        setIsLoading(true);
        console.log('Sending message:', message);
        
        // Add user message to the chat
        setMessages(prev => [...prev, { role: 'user', content: message }]);
        
        // Use the appropriate agent ID (checking if it's null and falling back to userAgentId if needed)
        const activeAgentId = elizaAgentId || userAgentId;
        
        if (!activeAgentId) {
          throw new Error('No agent selected. Please select an agent before sending a message.');
        }
        
        // Call API with the active agent ID and message
        const response = await apiClient.sendMessage(activeAgentId, message, selectedFile, userAgentId);
        
        // Handle array response format
        if (Array.isArray(response)) {
          // Process each item in the response array
          response.forEach(item => {
            setMessages(prev => [...prev, { 
              role: 'assistant', 
              content: item.text || item.message || 'No response received',
              url: item.url || null
            }]);
          });
        } else {
          // Handle single object response
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: response.text || response.message || 'No response received',
            url: response.url || null
          }]);
        }
      } else {
        // Add system/welcome message directly as assistant message
        setMessages(prev => [...prev, { role: 'assistant', content: message }]);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message to chat
      setMessages(prev => [...prev, { 
        role: 'system', 
        content: `Error: ${error.message || 'Failed to send message'}` 
      }]);
      return { success: false, error };
    } finally {
      if (!isSystemMessage) {
        setIsLoading(false);
      }
    }
  }, [elizaAgentId, userAgentId]);

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
    userAgentId,
    setUserAgentId,
    elizaAgentId,
    setElizaAgentId,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
