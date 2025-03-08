'use client';
import { useState, useEffect } from "react";
import Chat from "./chat";
import { apiClient } from "@/lib/chat-api";
import { useChat } from "@/context/ChatContext";

const getElizaAgent = async () => {
  return await apiClient.getAgents();
};

export default function ClientChat({ agentId }) {

    const {setElizaAgentId} = useChat();

  useEffect(() => {
    getElizaAgent().then((data) => {
      setElizaAgentId(data.agents[0].id);
    });
  }, []);
  
  return <Chat agentId={agentId} />;
}
