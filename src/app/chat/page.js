import Image from "next/image";
import AppLayout from "@/components/appLayout";
import Chat from "./components/chat";

export default function ChatPage() {
  return (
    <AppLayout>
        <Chat />
    </AppLayout>
  );
}
