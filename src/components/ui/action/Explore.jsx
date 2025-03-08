"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Wallet, 
  ArrowRightLeft, 
  RefreshCw, 
  Info,
  X
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const Explore = ({ onClose }) => {
  const modalRef = useRef(null);
  
  const actions = [
    {
      title: "Check Balance",
      description: "View your current account balance and recent transactions",
      icon: <Wallet className="h-10 w-10 text-primary" />,
      color: "bg-primary/10 hover:bg-primary/20",
      onClick: () => console.log("Check balance")
    },
    {
      title: "Transfer",
      description: "Send funds to another account or wallet address",
      icon: <ArrowRightLeft className="h-10 w-10 text-primary" />,
      color: "bg-primary/10 hover:bg-primary/20",
      onClick: () => console.log("Transfer")
    },
    {
      title: "Swap",
      description: "Exchange between different tokens and currencies",
      icon: <RefreshCw className="h-10 w-10 text-primary" />,
      color: "bg-primary/10 hover:bg-primary/20",
      onClick: () => console.log("Swap")
    },
    {
      title: "Token Info",
      description: "View detailed information about specific tokens",
      icon: <Info className="h-10 w-10 text-primary" />,
      color: "bg-primary/10 hover:bg-primary/20",
      onClick: () => console.log("Token info")
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
                className="overflow-hidden transition-all duration-300 hover:shadow-lg border-border hover:border-primary/50 group"
              >
                <CardContent 
                  className="p-6 flex items-start gap-4 cursor-pointer"
                  onClick={action.onClick}
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
