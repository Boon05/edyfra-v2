"use client";

import { useEffect, useRef } from "react";
import { StreamChat } from "stream-chat";

interface UseMashAIOptions {
  client: StreamChat | null;
  channelId: string;
  tier: string;
  subject: string;
  topic?: string;
  currentUserId: string;
  enabled?: boolean;
}

export function useMashAI({
  client,
  channelId,
  tier,
  subject,
  topic,
  currentUserId,
  enabled = true,
}: UseMashAIOptions) {
  const processingRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!client || !enabled || tier !== "MASH") return;

    const channel = client.channel("messaging", channelId);

    const handleNewMessage = async (event: any) => {
      const message = event.message;
      if (!message) return;
      if (message.user?.id === "mash-ai") return;
      if (message.user?.id !== currentUserId) return;
      if (processingRef.current.has(message.id)) return;

      processingRef.current.add(message.id);

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: channelId,
            message: message.text,
            subject,
            topic,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          console.error("Mash AI API error:", err);
        }
      } catch (err) {
        console.error("Mash AI error:", err);
      }
    };

    channel.on("message.new", handleNewMessage);

    return () => {
      channel.off("message.new", handleNewMessage);
    };
  }, [client, channelId, tier, subject, topic, currentUserId, enabled]);
}
