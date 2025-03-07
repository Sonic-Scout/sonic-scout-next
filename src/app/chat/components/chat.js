'use client';
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatHeader from "./chat-header";
import ChatMessage from "./chat-message";
import ChatInput from "./chat-input";

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "SonicScout",
      content: "Greetings! I am here to assist you with all aspects of tokenomics. From analyzing token distribution to optimizing market strategies, I'm ready to help you achieve your crypto project's goals.\nHow can I assist you today?",
      timestamp: "07:36 PM",
      isBot: true,
    },
  ]);

  const handleSendMessage = (message) => {
    if (!message.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      sender: "You",
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isBot: false,
    };
    
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="flex h-[calc(100vh-1rem)] w-full flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <ChatHeader />
      
      <div id="chatContainer" className="relative flex-1 p-4 pb-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-5">
            {messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                sender={message.sender} 
                content={message.content} 
                timestamp={message.timestamp} 
                isBot={message.isBot} 
              />
            ))}
          </div>
        </ScrollArea>
      </div>
      
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default Chat;