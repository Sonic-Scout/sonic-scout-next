"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { ChatProvider } from "../context/ChatContext";
import { TutorialProvider } from "../context/TutorialContext";
import { ExploreProvider } from "../context/ExploreContext";
import { LoginProvider } from "../context/LoginContext";

export default function Providers({ children, rainbowkitConfig }) {
  // Create a QueryClient instance that persists only for the lifecycle of the component
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={rainbowkitConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
            modalSize="compact"
            theme={darkTheme({})}
        >
          <LoginProvider>
            <ChatProvider>
              <TutorialProvider>
                <ExploreProvider>
                  {children}
                </ExploreProvider>
              </TutorialProvider>
            </ChatProvider>
          </LoginProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
