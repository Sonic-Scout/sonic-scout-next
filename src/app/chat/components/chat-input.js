'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon } from "lucide-react";

const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendMessage(message);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t p-4 bg-card/30">
      <form className="flex gap-2 items-end" onSubmit={handleSubmit}>
        <div className="flex-1 relative overflow-hidden">
          <div className="pointer-events-none absolute inset-[0] rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent] ![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)] after:absolute after:aspect-square after:w-[calc(var(--size)*1px)] after:animate-border-beam after:[animation-delay:var(--delay)] after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] after:[offset-anchor:calc(var(--anchor)*1%)_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))] rounded-xl" 
            style={{
              "--border-width": 1.5,
              "--size": 150,
              "--color-from": "#ffaa40",
              "--color-to": "#9c40ff",
              "--delay": "0s",
              "--anchor": 90,
              "--duration": 12
            }}
          />
          
          <Textarea
            className="min-h-20 max-h-[200px] pr-10 resize-none rounded-xl transition-all focus-visible:ring-0"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          
          <div className="absolute right-2 bottom-2.5 text-xs text-muted-foreground">
            <kbd className="px-1.5 py-0.5 rounded border bg-muted/50 opacity-70">Shift+Enter</kbd> for new line
          </div>
        </div>
        
        <Button 
          type="submit" 
          size="icon" 
          className="rounded-full h-10 w-10" 
          disabled={!message.trim()}
        >
          <SendIcon className="h-5 w-5" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
