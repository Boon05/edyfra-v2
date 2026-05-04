"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Search, Star, MessageSquare, Clock, MapPin, Filter, Loader2, Users, Sparkles } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { AvatarPremium } from "@/components/ui/avatar-premium";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getSubjectsByLevel } from "@/utils/subjects";
import { getUserData } from "@/app/actions/user";
import { getVerifiedTutors } from "@/app/actions/tutor";
import { searchStudents } from "@/app/actions/search";
import { toggleFollow, trackProfileView } from "@/app/actions/social";
import { User, TutorProfile } from "@prisma/client";

type TutorWithProfile = User & { tutorProfile: TutorProfile | null };

export default function TutorsPage() {
  const [tutors, setTutors] = useState<TutorWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<User | null>(null);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("all");

  useEffect(() => {
    getUserData().then(setUserData);
    fetchTutors();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search.length >= 2) {
        performSearch();
      } else if (search.length === 0) {
        fetchTutors();
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const fetchTutors = async () => {
    setLoading(true);
    try {
      const data = await getVerifiedTutors();
      setTutors(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async () => {
    setLoading(true);
    try {
      const { searchTutors } = await import("@/app/actions/tutor");
      const data = await searchTutors(search);
      setTutors(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const subjects = getSubjectsByLevel(userData?.educationLevel || "HIGH_SCHOOL");

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-border/50">
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Scholarly Directory</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tightest leading-none">
            Expert <br /> <span className="text-muted-foreground">Synchronization.</span>
          </h1>
        </div>
        <div className="flex flex-col sm:row gap-4 w-full md:w-auto">
          <div className="relative group flex-1 sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              className="h-14 pl-12 rounded-2xl border-border bg-secondary shadow-sm focus-visible:ring-primary" 
              placeholder="Search experts by name or school..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {loading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary" />}
          </div>
          <Select value={subject} onValueChange={(v) => setSubject(v || "all")}>
            <SelectTrigger className="h-14 w-full sm:w-[220px] rounded-2xl border-border bg-secondary font-bold">
              <SelectValue placeholder="All Disciplines" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border bg-background shadow-2xl">
              <SelectItem value="all" className="font-bold">All Disciplines</SelectItem>
              {subjects.map(s => (
                <SelectItem key={s} value={s} className="font-bold">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading && tutors.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-[400px] bg-secondary animate-pulse rounded-[2.5rem] border border-border/50" />
          ))}
        </div>
      ) : tutors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tutors.map((tutor) => (
            <div key={tutor.id} className="group p-8 rounded-[2.5rem] bg-secondary border border-border/50 hover:bg-background hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-500 flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <AvatarPremium 
                    seed={tutor.id} 
                    src={tutor.avatar_url || tutor.avatar} 
                    size="lg" 
                    name={tutor.name} 
                  />
                  <div className="px-4 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                    {tutor.tutorProfile?.rating?.toFixed(1) || "5.0"}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">{tutor.name}</h3>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <GraduationCap className="h-3 w-3" />
                    {tutor.school || tutor.county || ""}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tutor.tutorProfile?.subjects?.map((s: string) => (
                    <span key={s} className="px-3 py-1 rounded-full bg-background border border-border text-[9px] font-black uppercase tracking-widest">
                      {s}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed italic line-clamp-3">
                  &quot;{tutor.tutorProfile?.bio || ""}&quot;
                </p>
              </div>

              <div className="pt-6 border-t border-border flex items-center justify-between gap-4">
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Base Rate</span>
                    <span className="text-xl font-black tracking-tightest">KSH {tutor.tutorProfile?.hourlyRate || "500"}</span>
                 </div>
                  <div className="flex gap-2">
                    <Link href="/study-room/preview">
                       <Button variant="outline" size="icon" className="w-12 h-12 rounded-xl border-border hover:bg-primary hover:text-white transition-all">
                          <Sparkles className="h-4 w-4" />
                       </Button>
                    </Link>
                    <Button 
                      onClick={() => toggleFollow(tutor.id)}
                      className="h-12 px-6 rounded-xl bg-foreground text-background font-black text-[10px] tracking-widest uppercase active:scale-95 transition-all"
                    >
                       Connect
                    </Button>
                  </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-48 space-y-8 bg-secondary/30 rounded-[3rem] border-2 border-dashed border-border">
          <div className="w-20 h-20 rounded-full bg-background flex items-center justify-center text-muted-foreground shadow-sm">
             <Users className="h-10 w-10 opacity-20" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black tracking-tight">Zero Scholars Detected.</h3>
            <p className="text-muted-foreground font-medium max-w-sm mx-auto">The ecosystem has no active mentors matching your current search parameters. Broaden your mission scope.</p>
          </div>
          <Button onClick={() => { setSearch(""); setSubject("all"); }} variant="outline" className="h-12 px-8 rounded-full font-black text-[10px] tracking-widest uppercase border-border">
             Reset Search Grid
          </Button>
        </div>
      )}
    </div>
  );
}
