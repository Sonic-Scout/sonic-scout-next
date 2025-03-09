'use client';
import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatHeader from "./chat-header";
import ChatMessage from "./chat-message";
import ChatInput from "./chat-input";
import { useChat } from "@/context/ChatContext";

const Chat = (props) => {
  const { agentId: userAgentId } = props;
  const { messages, isLoading, sendMessage, setUserAgentId, userAgentId: Ai, elizaAgentId  } = useChat();


  // Add initial welcome message if there are no messages
  useEffect(() => {
    setUserAgentId(userAgentId);
    if(!elizaAgentId || !Ai) return;
    if (messages.length === 0) {
      sendMessage("Greetings! I am here to assist you with all aspects of tokenomics. From analyzing token distribution to optimizing market strategies, I'm ready to help you achieve your crypto project's goals.\nHow can I assist you today?", true);
    }
  }, [messages.length, sendMessage, Ai, elizaAgentId]);


  const handleSendMessage = async (message) => {
    if (!message.trim()) return;
    await sendMessage(message);
  };

  // Convert context messages to the format expected by ChatMessage component
  const formattedMessages = messages.map((msg, index) => ({
    id: index,
    sender: msg.role === 'user' ? "You" : "SonicScoutAI",
    content: msg.content,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isBot: msg.role === 'assistant',
    url: msg.url || null, // Add support for URL
  }));

  return (
    <div className="flex h-[calc(100vh-1rem)] w-full flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <ChatHeader />
      
      <div id="chatContainer" className="relative flex-1 p-4 pb-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-5">
            {formattedMessages.map((message) => (
              <ChatMessage 
                key={message.id} 
                sender={message.sender} 
                content={message.content} 
                timestamp={message.timestamp} 
                isBot={message.isBot}
                url={message.url} // Pass URL to ChatMessage
              />
            ))}
            {isLoading && (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <div className="animate-pulse">SonicScout is typing...</div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      
      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  );
};

export default Chat;