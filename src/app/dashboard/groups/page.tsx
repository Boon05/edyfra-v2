"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AvatarPremium } from "@/components/ui/avatar-premium";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Search, MessageCircle, Loader2, GraduationCap } from "lucide-react";
import { getGroups, createGroup } from "@/app/actions/groups";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Group {
  id: string;
  name: string;
  subject: string;
  topic: string;
  level: string;
  members: string[];
  groupMessages: { content: string }[];
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupSubject, setNewGroupSubject] = useState("");
  const [newGroupTopic, setNewGroupTopic] = useState("");
  const [newGroupLevel, setNewGroupLevel] = useState("HIGH_SCHOOL");
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    setLoading(true);
    try {
      const data = await getGroups();
      setGroups(data as any);
    } catch (error) {
      console.error("Failed to load groups:", error);
      toast.error("Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim() || !newGroupSubject.trim()) return;

    setIsCreating(true);
    try {
      await createGroup({
        name: newGroupName,
        subject: newGroupSubject,
        topic: newGroupTopic,
        level: newGroupLevel
      });
      toast.success("Group created!");
      setShowCreateModal(false);
      setNewGroupName("");
      setNewGroupSubject("");
      setNewGroupTopic("");
      loadGroups();
    } catch (error) {
      toast.error("Failed to create group");
    } finally {
      setIsCreating(false);
    }
  };

  const filteredGroups = groups.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tightest">Study Groups</h1>
          <p className="text-muted-foreground font-medium mt-1">Study together, learn faster.</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="rounded-full bg-primary hover:bg-primary/90 font-black text-xs tracking-widest uppercase"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search groups by name or subject..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-12 rounded-full border-border text-base font-medium"
        />
      </div>

      {/* Groups Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : filteredGroups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group, i) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/dashboard/groups/${group.id}`}>
                <Card className="border-border rounded-2xl hover:shadow-lg hover:translate-y-[-2px] transition-all cursor-pointer h-full">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <Badge variant="outline" className="text-[9px] font-black uppercase">
                        {group.members.length} members
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-black text-lg tracking-tight">{group.name}</h3>
                      <p className="text-sm text-muted-foreground font-medium line-clamp-2">
                        {group.topic}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                      <GraduationCap className="h-3 w-3" />
                      <span>{group.subject}</span>
                      <span className="text-muted-foreground">•</span>
                      <span>{group.level.replace('_', ' ')}</span>
                    </div>

{group.groupMessages[0] && (
                       <div className="pt-3 border-t border-border space-y-1">
                         <p className="text-xs text-muted-foreground line-clamp-1">
                           {group.groupMessages[0].content}
                         </p>
                         <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                           <MessageCircle className="h-3 w-3" />
                           <span>{group.groupMessages.length} messages</span>
                         </div>
                       </div>
                     )}
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 space-y-6">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto">
            <Users className="h-10 w-10 text-muted-foreground/30" />
          </div>
          <div className="space-y-2">
             <h3 className="text-xl font-bold">No groups yet</h3>
             <p className="text-muted-foreground max-w-md mx-auto">
               Start a group and invite classmates to study together.
             </p>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="rounded-full font-black text-xs tracking-widest uppercase"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Group
          </Button>
        </div>
      )}

      {/* Create Group Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background rounded-2xl p-6 w-full max-w-md space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-black">Create Study Group</h3>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest">Group Name</label>
                  <Input
                    placeholder="e.g., Calculus Class of 2026"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest">Subject</label>
                  <Input
                    placeholder="e.g., Mathematics"
                    value={newGroupSubject}
                    onChange={(e) => setNewGroupSubject(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest">Topic (Optional)</label>
                  <Input
                    placeholder="e.g., Calculus, Algebra"
                    value={newGroupTopic}
                    onChange={(e) => setNewGroupTopic(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest">Level</label>
                  <select
                    value={newGroupLevel}
                    onChange={(e) => setNewGroupLevel(e.target.value)}
                    className="w-full mt-1 h-10 px-3 rounded-md border border-border bg-background"
                  >
                    <option value="HIGH_SCHOOL">High School</option>
                    <option value="UNIVERSITY">University</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="ghost"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 rounded-full"
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateGroup}
                  disabled={isCreating || !newGroupName.trim() || !newGroupSubject.trim()}
                  className="flex-1 rounded-full"
                >
                  {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}