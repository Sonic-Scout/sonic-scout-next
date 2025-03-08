import AppLayout from "@/components/appLayout";
import ClientChat from "./components/client-chat";

export default function ChatPage({ params }) {
  const { agentId } = params;
  
  return (
    <AppLayout>
        <ClientChat agentId={agentId} />
    </AppLayout>
  );
}
