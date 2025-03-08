'use client';

import { ChatProvider } from "./context/chat-context";

export default function ChatLayout({ children }) {
  return (
    <ChatProvider>
      {children}
    </ChatProvider>
  );
}
