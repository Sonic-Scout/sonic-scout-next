'use client';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const ChatMessage = ({ sender, content, timestamp, isBot }) => {
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
            <p key={i}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
