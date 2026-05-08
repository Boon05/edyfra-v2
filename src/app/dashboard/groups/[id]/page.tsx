"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AvatarPremium } from "@/components/ui/avatar-premium";
import { Badge } from "@/components/ui/badge";
import { Send, Users, Loader2, ChevronLeft } from "lucide-react";
import { getGroupById, sendGroupMessage } from "@/app/actions/groups";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface GroupMessage {
  id: string;
  content: string;
  createdAt: string | Date;
  sender?: { name: string; avatar?: string };
  senderId?: string;
}

interface Group {
  id: string;
  name: string;
  subject: string;
  topic: string;
  level: string;
  members: string[];
  groupMessages: GroupMessage[];
}

export default function GroupChatPage() {
  const params = useParams();
  const groupId = params.id as string;
  const router = useRouter();
  const supabase = createClient();

  const [group, setGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const getCurrentUser = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setCurrentUser(user);
  }, [supabase]);

  const loadGroup = useCallback(async () => {
    try {
      const data = await getGroupById(groupId);
      setGroup(data as any);
      setMessages(data.groupMessages || []);
    } catch (e) {
      toast.error("Failed to load group");
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    getCurrentUser();
    loadGroup();
  }, [getCurrentUser, loadGroup]);

  useEffect(() => {
    const pollInterval = setInterval(loadGroup, 3000);

    const channel = supabase
      .channel(`group-${groupId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "GroupMessage", filter: `groupId=eq.${groupId}` },
        () => {
          loadGroup();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      clearInterval(pollInterval);
    };
  }, [groupId, loadGroup, supabase]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentUser) return;

    const currentInput = input;
    setInput("");

    // Optimistic update
    const tempId = Math.random().toString();
    const newMessage: GroupMessage = {
      id: tempId,
      groupId,
      senderId: currentUser.id,
      content: currentInput,
      createdAt: new Date().toISOString(),
      sender: { name: "You", avatar: undefined }
    };
    setMessages(prev => [...prev, newMessage]);

    const { success } = await sendGroupMessage(groupId, currentInput);
    if (!success) {
      toast.error("Failed to send message");
      setMessages(prev => prev.filter(m => m.id !== tempId));
      return;
    }

    loadGroup();
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mt-4">
        Loading group...
      </p>
    </div>
  );

  if (!group) return null;

  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden font-sans">
      {/* Header */}
      <header className="h-20 border-b border-border/50 px-8 flex items-center justify-between bg-background/80 backdrop-blur-2xl z-50">
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 text-foreground hover:bg-primary/5 rounded-xl transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-black uppercase tracking-widest">{group.name}</h1>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                {group.subject} • {group.topic}
              </p>
            </div>
          </div>
          <div className="h-8 w-[1px] bg-border" />
          <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-black tracking-widest uppercase">
            {group.members.length} members
          </Badge>
        </div>
      </header>

      {/* Chat */}
      <section className="flex-1 flex flex-col bg-background relative">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 scroll-smooth">
          <div className="max-w-4xl mx-auto space-y-8">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground font-medium">Start the conversation!</p>
              </div>
            )}
            {messages.map((msg) => {
              const isMe = currentUser && msg.senderId === currentUser.id;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-start gap-4 ${isMe ? "flex-row-reverse" : "flex-row"}`}
                >
                  <AvatarPremium seed={msg.sender?.name || "User"} size="md" />
                  <div className={`space-y-2 max-w-[80%] ${isMe ? "items-end" : "items-start"}`}>
                    <div className={`px-6 py-4 rounded-[2rem] text-sm md:text-base font-medium leading-relaxed shadow-sm border ${
                      isMe ? "bg-primary text-white border-primary/20 rounded-tr-none" : "bg-secondary text-foreground border-border/50 rounded-tl-none"
                    }`}>
                      {msg.content}
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground px-2">
                      {msg.sender?.name || "User"} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Input */}
        <div className="p-8 bg-background/50 backdrop-blur-xl border-t border-border/50">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-4">
            <div className="relative flex-1">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message to the group..."
                className="h-16 pl-6 pr-20 rounded-[2rem] border-border bg-secondary shadow-inner focus-visible:ring-primary text-lg font-medium"
              />
            </div>
            <Button
              type="submit"
              disabled={!input.trim()}
              className="h-16 w-16 rounded-[2rem] bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-90 shadow-xl"
            >
              <Send className="h-6 w-6" />
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}