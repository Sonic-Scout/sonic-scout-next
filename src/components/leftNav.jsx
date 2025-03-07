"use client";
import { useState } from "react";
import RainbowKitConnectButton from "@/components/ui/RainbowKitConnectButton";
import { useTutorial } from "../context/TutorialContext";
import { useExplore } from "@/context/ExploreContext";
import { Tutorial } from "./ui/action/Tutorial";
import { Explore } from "./ui/action/Explore";

import Link from "next/link";
import {
  ChevronRight,
  Edit,
  LayoutGrid,
  BadgeHelp,
  ChevronLeft,
} from "lucide-react";
import WidgetPrice from "./WidgetPrice"; // You'll need to create this component

export default function LeftNav({
  width = "260px",
  isMobile = false,
  initialCollapsed = false,
  chatHistory = [],
  recentChats = [],
  onToggleSidebar,
  onNewChat,
  onSelectChat,
}) {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  const { isOpenTutorial, openTutorial, closeTutorial } = useTutorial();
  const { isOpenExplore, openExplore, closeExplore } = useExplore();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (onToggleSidebar) onToggleSidebar();
  };

  const startNewChat = () => {
    if (onNewChat) onNewChat();
  };

  const selectChat = (id) => {
    if (onSelectChat) onSelectChat({ id });
  };

  // Group chats similar to the Svelte component
  const groupedChats = {
    recent: recentChats.slice(0, 5),
    previousWeek: chatHistory.filter(
      (chat) =>
        new Date(chat.timestamp) >
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ),
    previousMonth: chatHistory.filter(
      (chat) =>
        new Date(chat.timestamp) >
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) &&
        new Date(chat.timestamp) <=
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ),
  };

  return (
    <>
      <div
        className="flex-shrink-0 overflow-x-hidden bg-card border-r transition-all duration-300"
        style={{
          width: isCollapsed ? "60px" : width,
          willChange: "width",
          animation: "flyIn 300ms ease-out",
        }}
      >
        <div className="h-full w-full flex flex-col">
          {/* Header/Controls */}
          <div
            className={`flex justify-${
              isCollapsed ? "center" : "between"
            } h-[60px] items-center px-3 flex-shrink-0`}
          >
            <span className="flex">
              <button
                className="h-10 rounded-lg bg-transparent hover:bg-accent p-2"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                onClick={toggleSidebar}
              >
                {isMobile ? (
                  <ChevronRight size={20} />
                ) : isCollapsed ? (
                  <ChevronRight size={20} />
                ) : (
                  <ChevronLeft size={20} />
                )}
              </button>
            </span>
          </div>

          {/* Main scrollable area - only show when not collapsed */}
          {!isCollapsed && (
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto pl-3 pr-3">
                {/* Main menu items */}
                <div className="bg-card pt-0">
                  <div
                    className="block w-full text-left text-base font-medium mb-1 h-9 px-3 py-2 rounded hover:bg-accent"
                    onClick={openTutorial}
                  >
                    <div className="flex items-center">
                      <div className="flex h-6 w-6 items-center justify-center mr-2.5 text-muted-foreground">
                        <div className="relative flex h-full items-center justify-center rounded-full text-foreground">
                          <BadgeHelp size={16} />
                        </div>
                      </div>
                      <span>Tutorial</span>
                    </div>
                  </div>

                  <div
                    className="block w-full text-left text-base font-medium mb-1 h-9 px-3 py-2 rounded hover:bg-accent cursor-pointer"
                    onClick={openExplore}
                  >
                    <div className="flex items-center">
                      <div className="flex h-6 w-6 items-center justify-center mr-2.5 text-muted-foreground">
                        <div className="relative flex h-full items-center justify-center rounded-full text-foreground">
                          <LayoutGrid size={16} />
                        </div>
                      </div>
                      <span>Explore</span>
                    </div>
                  </div>
                </div>

                {/* Widget coin price */}
                <hr className="mt-3 mb-2" />
                <div className="flex flex-col gap-2 text-primary mt-5">
                  <div className="relative mt-5 first:mt-0 last:mb-5">
                    <WidgetPrice />
                  </div>
                </div>
              </div>

              <div className="border-t p-3 flex justify-center">
                <RainbowKitConnectButton />
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
          .overflow-y-auto {
            scrollbar-width: thin;
          }

          .overflow-y-auto::-webkit-scrollbar {
            width: 4px;
          }

          .overflow-y-auto::-webkit-scrollbar-track {
            background-color: transparent;
          }

          .overflow-y-auto::-webkit-scrollbar-thumb {
            background-color: rgba(128, 128, 128, 0.3);
            border-radius: 4px;
          }

          @keyframes flyIn {
            from {
              transform: translateX(-20px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}</style>
      </div>

      {/* Render modals outside the main layout */}
      {isOpenTutorial && <Tutorial onClose={closeTutorial} />}
      {isOpenExplore && <Explore onClose={closeExplore} />}
    </>
  );
}
