'use client';
import { useChat } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon } from "lucide-react";
import { BorderBeam } from "@/components/magicui/border-beam";

const ChatInput = ({ onSendMessage, disabled }) => {
  const { inputMessage, updateInputMessage, clearInputMessage } = useChat();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && !disabled) {
      onSendMessage(inputMessage);
      clearInputMessage();
    }
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
        <div className="flex-1 relative overflow-hidden rounded-xl">
        <BorderBeam
        duration={12}
        size={100}
        reverse
        className="from-transparent via-[#ea580c] to-transparent"
      />

          <Textarea
            className="min-h-20 max-h-[200px] pr-10 resize-none rounded-xl transition-all focus-visible:ring-0 focus-visible:border-primary/30"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => updateInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={disabled}
          />
          
          <div className="absolute right-2 bottom-2.5 text-xs text-muted-foreground">
            <kbd className="px-1.5 py-0.5 rounded border bg-muted/50 opacity-70">Shift+Enter</kbd> for new line
          </div>
        </div>
        
        <Button 
          type="submit" 
          size="icon" 
          className="rounded-full h-10 w-10" 
          disabled={!inputMessage.trim() || disabled}
        >
          <SendIcon className="h-5 w-5" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
