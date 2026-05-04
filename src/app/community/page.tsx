"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, Star, Globe, ShieldCheck, Loader2, UserCheck, Sparkles } from "lucide-react";
import { AvatarPremium } from "@/components/ui/avatar-premium";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

interface Scholar {
  id: string;
  name: string;
  county: string;
  points: number;
}

export default function CommunityPage() {
  const [scholars, setScholars] = useState<Scholar[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchTopScholars();
  }, []);

  const fetchTopScholars = async () => {
    const { data, error } = await supabase
      .from("User")
      .select("id, name, county, points")
      .eq("role", "STUDENT")
      .order("points", { ascending: false })
      .limit(4);

    if (!error && data) setScholars(data);
    setLoading(false);
  };

  return (
    <div className="bg-background pt-32 pb-48">
      <div className="container-max space-y-32">

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
          <div className="max-w-3xl space-y-6">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">A Community of Scholars</p>
            <h1 className="text-6xl md:text-8xl font-black tracking-tightest leading-none">
              Learn <br /><span className="text-muted-foreground">Together.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed max-w-xl">
              Connect with students from across the country. Find your study partners and mentors in one place.
            </p>
          </div>
          <Link href="/signup">
            <Button className="h-16 px-12 rounded-full bg-foreground text-background font-black text-xs tracking-widest uppercase shadow-2xl transition-all active:scale-95">
              Join the Community
            </Button>
          </Link>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Live Status", value: "ACTIVE", icon: ShieldCheck },
            { label: "Subjects", value: "40+", icon: GraduationCap },
            { label: "Counties", value: "47", icon: Globe },
            { label: "Powered by AI", value: "Mash AI", icon: Star },
          ].map((stat) => (
            <div key={stat.label} className="p-8 bg-secondary/50 rounded-[2rem] border border-border/50 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center text-primary mx-auto shadow-sm border border-border">
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-3xl font-black tracking-tightest">{stat.value}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Knowledge Feed */}
        <div className="space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-black tracking-tightest">Community Feed.</h2>
              <p className="text-muted-foreground text-lg font-medium max-w-xl">
                See what other students are studying right now.
              </p>
            </div>
            <Link href="/dashboard/feed">
              <Button className="h-12 px-8 rounded-full bg-primary text-white font-black text-[10px] tracking-widest uppercase">
                Post Something
              </Button>
            </Link>
          </div>
          
          <div className="py-16 text-center space-y-6 bg-secondary/30 rounded-[3rem] border border-border">
            <Sparkles className="h-10 w-10 text-muted-foreground/20 mx-auto" />
            <div className="space-y-2">
              <h3 className="text-xl font-black tracking-tightest">The feed is quiet.</h3>
              <p className="text-muted-foreground font-medium max-w-md mx-auto">Be the first to share your learning progress with the community.</p>
            </div>
            <Link href="/dashboard/feed">
              <Button className="h-12 px-10 rounded-full bg-primary text-white font-black text-[10px] tracking-widest uppercase mt-2">
                Share an Update
              </Button>
            </Link>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="p-8 md:p-16 bg-secondary rounded-[3rem] border border-border space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-black tracking-tightest">Top Scholars.</h2>
              <p className="text-muted-foreground text-lg font-medium">Recognizing the most active students in the ecosystem.</p>
            </div>
            <Link href="/dashboard/leaderboard">
              <Button variant="ghost" className="font-black text-[10px] tracking-widest uppercase text-primary hover:text-primary underline">
                View All
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : scholars.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <UserCheck className="h-12 w-12 text-muted-foreground/20 mx-auto" />
              <p className="text-muted-foreground font-medium">No scholars ranked yet. Be the first to earn points!</p>
              <Link href="/signup">
                <Button className="h-10 px-8 rounded-full bg-primary text-white font-black text-[10px] tracking-widest uppercase mt-2">
                  Get Started
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {scholars.map((s, i) => (
                <div key={s.id} className="p-6 bg-background rounded-2xl border border-border flex items-center gap-4 group hover:shadow-lg transition-all">
                  <div className="text-2xl font-black text-muted-foreground w-8">#{i + 1}</div>
                  <AvatarPremium seed={s.id} name={s.name} size="md" />
                  <div className="min-w-0">
                    <h4 className="font-black text-sm tracking-tight truncate">{s.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase truncate">{s.county}</span>
                      <div className="w-1 h-1 rounded-full bg-border flex-shrink-0" />
                      <span className="text-[9px] font-black text-primary uppercase flex-shrink-0">{s.points.toLocaleString()} PTS</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
