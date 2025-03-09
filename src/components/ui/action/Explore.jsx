"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Wallet, 
  ArrowRightLeft, 
  RefreshCw, 
  Info,
  X,
  Clock
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useChat } from "@/context/ChatContext";
import { useRouter } from "next/navigation";

export const Explore = ({ onClose }) => {
  const modalRef = useRef(null);
  const { sendMessage, updateInputMessage } = useChat();
  const router = useRouter();
  
  const handleCheckBalance = () => {
    sendMessage("Can you check my balance?");
    onClose();
  };

  const handleTransfer = () => {
    updateInputMessage("I want to transfer [amount] to [wallet address]");
    onClose();
  };
  
  const handleTokenList = () => {
    sendMessage("Give me the top 5 tokens and their prices.");
    onClose();
  };

  const handleTokenInfo = () => {
    sendMessage("Give me information about Sonic and its tokenomics.");
    onClose();
  };
  
  const actions = [
    {
      title: "Check Balance",
      description: "View your current account balance and recent transactions",
      icon: <Wallet className="h-10 w-10 text-primary" />,
      color: "bg-primary/10 hover:bg-primary/20",
      onClick: handleCheckBalance,
      available: true
    },
    {
      title: "Transfer",
      description: "Send funds to another account or wallet address",
      icon: <ArrowRightLeft className="h-10 w-10 text-primary" />,
      color: "bg-primary/10 hover:bg-primary/20",
      onClick: handleTransfer,
      available: true
    },
    {
      title: "Token List",
      description: "View a list of available tokens and their details",
      icon: <RefreshCw className="h-10 w-10 text-primary" />,
      color: "bg-primary/10 hover:bg-primary/20",
      onClick: handleTokenList,
      available: true
    },
    {
      title: "Token Info",
      description: "View detailed information about specific tokens",
      icon: <Info className="h-10 w-10 text-primary" />,
      color: "bg-primary/10 hover:bg-primary/20",
      onClick: handleTokenInfo,
      available: true
    }
  ];

  // Handle clicks outside the modal and ESC key press
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    // Add event listeners
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup event listeners
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
      aria-modal="true"
      role="dialog"
      aria-labelledby="actions-title"
    >
      <div 
        ref={modalRef}
        className="bg-background border border-border shadow-xl rounded-xl max-w-4xl w-full overflow-hidden relative"
      >
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-4 top-4 z-10 rounded-full hover:bg-destructive/10"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="p-8">
          <h2 id="actions-title" className="text-3xl font-bold mb-8 text-foreground text-center">
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {actions.map((action, index) => (
              <Card 
                key={index}
                className="overflow-hidden transition-all duration-300 hover:shadow-lg border-border hover:border-primary/50 group relative"
              >
                <CardContent 
                  className="p-6 flex items-start gap-4 cursor-pointer"
                  onClick={action.available ? action.onClick : undefined}
                >
                  <div className={cn(
                    "p-3 rounded-xl transition-colors", 
                    action.color
                  )}>
                    {action.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium text-xl group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {action.description}
                    </p>
                  </div>
                  
                  {!action.available && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
                      <div className="bg-card/70 px-4 py-2 rounded-md shadow-lg flex items-center gap-2 border border-border">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">Coming Soon</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
