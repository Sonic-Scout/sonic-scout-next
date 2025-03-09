'use client';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const ChatMessage = ({ sender, content, timestamp, isBot, url }) => {

  console.log(`result >>>`, sender, content, timestamp, isBot, url);
  // Function to detect URLs in text and make them clickable
  const renderTextWithLinks = (text) => {
    // Regular expression to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    
    // Split text by URLs and map through parts
    const parts = text.split(urlRegex);
    const matches = text.match(urlRegex) || [];
    
    // Combine parts and matches
    return parts.map((part, i) => {
      // If this is a URL match, render it as a link
      if (matches[i - 1]) {
        return (
          <>
            {part}
            <a 
              key={i} 
              href={matches[i - 1]} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {matches[i - 1]}
            </a>
          </>
        );
      }
      return part;
    });
  };

  return (
    <div className="flex gap-3 p-4 rounded-lg bg-muted/50">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="bg-primary/10 text-primary">
          {sender.charAt(0)}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-2">
        <div className="flex items-center">
          <p className="font-semibold">{sender}</p>
          <span className="ml-auto text-xs text-muted-foreground">{timestamp}</span>
        </div>
        
        <div className="prose dark:prose-invert !max-w-[100vw]">
          {content.split('\n').map((line, i) => (
            <p key={i}>{renderTextWithLinks(line)}</p>
          ))}
          
          {/* Render URL button if provided */}
          {url && (
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
              >
                <ExternalLink size={14} />
                Open Link
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
