'use client';
import RainbowKitConnectButton from '@/components/ui/RainbowKitConnectButton';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const ChatHeader = () => {
  return (
    <div className="border-b p-4 flex items-center items-center justify-between">
      <h1 className="text-xl font-bold">Chat</h1>
      <RainbowKitConnectButton />
    </div>
  );
};

export default ChatHeader;
