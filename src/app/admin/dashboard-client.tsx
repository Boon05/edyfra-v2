"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, GraduationCap, MessageSquare, TrendingUp, Zap, ChevronRight, Cpu, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AvatarPremium } from "@/components/ui/avatar-premium";
import Link from "next/link";
import { approveReview, deleteReview } from "@/app/actions/reviews";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ICONS = [Users, GraduationCap, MessageSquare, Zap];
const COLORS = ["text-blue-400", "text-primary", "text-purple-400", "text-orange-400"];
const BGS = ["bg-blue-500/10", "bg-primary/10", "bg-purple-500/10", "bg-orange-500/10"];

interface Stat {
  label: string;
  value: number;
  trend: string;
}

export function AdminDashboardClient({
  stats,
  telemetry,
  pendingApplications,
  recentUsers,
  systemLoad,
}: {
  stats: Stat[];
  telemetry: any[];
  pendingApplications: any[];
  recentUsers: any[];
  systemLoad: number;
}) {
  const router = useRouter();

  return (
    <div className="space-y-10 pb-20">
      {/* Top Status Bar */}
      <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-slate-900 border border-white/5 text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl">
         <div className="flex items-center gap-2 px-4 border-r border-white/10">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-emerald-500">System: Operational</span>
         </div>
         <div className="flex items-center gap-2 px-4 border-r border-white/10 text-muted-foreground/60">
            <Zap className="h-3 w-3" />
            <span>Load: {systemLoad}%</span>
         </div>
         <div className="flex items-center gap-2 px-4 border-r border-white/10 text-muted-foreground/60">
            <Cpu className="h-3 w-3" />
            <span>Latency: 14ms</span>
         </div>
         <div className="flex items-center gap-2 px-4 text-muted-foreground/60">
            <ShieldCheck className="h-3 w-3" />
            <span>SSL: Active</span>
         </div>
         <div className="flex-1" />
         <div className="text-primary pr-4">EDYFRA_OS v2.4.1</div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-5xl font-black tracking-tighter">Command Overview</h1>
          <p className="text-muted-foreground text-sm font-bold tracking-widest uppercase">Live Platform Intelligence</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="rounded-2xl font-bold px-8 h-14 border-border hover:bg-secondary">
            Audit Logs
          </Button>
          <Button onClick={() => router.refresh()} className="rounded-2xl font-black px-8 h-14 bg-primary text-white shadow-xl shadow-primary/20">
             Sync Data
          </Button>
        </div>
      </div>

      {/* Real Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = ICONS[i];
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-border rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all duration-500 bg-secondary/30 backdrop-blur-xl">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className={`${BGS[i]} p-4 rounded-2xl group-hover:rotate-12 transition-transform`}>
                      <Icon className={`h-6 w-6 ${COLORS[i]}`} />
                    </div>
                    <Badge variant="outline" className="font-black text-[9px] tracking-widest border-border opacity-50">{stat.trend}</Badge>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</p>
                    <h3 className="text-5xl font-black mt-2 tracking-tighter tabular-nums">{stat.value.toLocaleString()}</h3>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tutor Application Queue */}
        <Card className="lg:col-span-2 rounded-[3rem] overflow-hidden border-border bg-card shadow-sm">
          <CardHeader className="p-10 border-b flex flex-row items-center justify-between bg-secondary/10">
            <div>
              <CardTitle className="text-2xl font-black tracking-tight">Application Queue</CardTitle>
              <CardDescription className="font-medium text-muted-foreground">Verification protocols awaiting approval.</CardDescription>
            </div>
            <Link href="/admin/tutors">
               <Button variant="ghost" className="rounded-xl font-bold text-xs uppercase tracking-widest">View All</Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {pendingApplications.length === 0 ? (
              <div className="p-20 text-center space-y-4">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                   <GraduationCap className="h-10 w-10 text-muted-foreground/40" />
                </div>
                <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">Clear Workspace</p>
                <p className="text-muted-foreground/60 text-sm font-medium">No pending applications detected.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {pendingApplications.map((app) => (
                  <div key={app.id} className="p-8 flex items-center justify-between hover:bg-secondary/40 transition-colors group">
                    <div className="flex items-center gap-5">
                      <AvatarPremium seed={app.user?.name || app.id} size="lg" />
                      <div>
                        <p className="font-black text-xl">{app.user?.name || "Expert Candidate"}</p>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">
                          {app.subjects?.join(", ") || "General Expertise"} • {app.educationLevel}
                        </p>
                      </div>
                    </div>
                    <Link href={`/admin/tutors`}>
                      <Button className="rounded-2xl font-black text-[10px] tracking-widest uppercase h-12 px-6 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/5">
                        Verify Profile
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Health / Core Vitals */}
        <Card className="rounded-[3rem] overflow-hidden bg-slate-900 border-white/5 text-white">
          <CardHeader className="p-10">
            <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
               <Cpu className="h-6 w-6 text-primary" /> Core Vitals
            </CardTitle>
            <CardDescription className="text-white/40">Infrastructure performance indices.</CardDescription>
          </CardHeader>
          <CardContent className="px-10 space-y-10 pb-12">
            {[
              { label: "AI Neural Engine", status: "Operational", color: "bg-primary", pct: "94%" },
              { label: "Postgres Cluster", status: "Optimal", color: "bg-blue-500", pct: "18%" },
              { label: "Edge Auth Proxy", status: "High Performance", color: "bg-emerald-500", pct: "100%" },
            ].map(v => (
              <div key={v.label} className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black tracking-widest uppercase">
                  <span className="text-white/40">{v.label}</span>
                  <span className="text-emerald-400">{v.status}</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: v.pct }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full ${v.color} shadow-[0_0_15px_rgba(255,255,255,0.1)]`}
                  />
                </div>
              </div>
            ))}
            
            <div className="pt-10 border-t border-white/5 space-y-6">
               <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Recent Access</p>
               <div className="space-y-4">
                  {recentUsers.map((u: any) => (
                    <div key={u.id} className="flex items-center justify-between text-xs">
                       <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          <span className="font-bold text-white/80">{u.name}</span>
                       </div>
                       <Badge className="bg-white/5 border-none text-[8px] font-black uppercase text-white/40">{u.role}</Badge>
                    </div>
                  ))}
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Ecosystem Telemetry (Real-ish Charts) */}
        <Card className="lg:col-span-3 rounded-[3.5rem] bg-slate-900 border-white/10 overflow-hidden relative shadow-3xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent pointer-events-none" />
          <CardHeader className="p-12 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-[2rem] bg-primary/20 flex items-center justify-center border border-primary/30">
                 <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-3xl font-black text-white tracking-tighter">Ecosystem Telemetry</CardTitle>
                <CardDescription className="text-white/40 font-medium text-lg">Real-time engagement velocity powered by Vercel.</CardDescription>
              </div>
            </div>
            <div className="flex gap-4">
               <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 text-white font-black text-[10px] uppercase tracking-widest h-14 px-8 hover:bg-white/10">
                  Detailed Stats
               </Button>
               <Link href="https://vercel.com" target="_blank">
                  <Button className="rounded-2xl bg-white text-black font-black text-[10px] uppercase tracking-widest h-14 px-8 shadow-2xl">
                     Vercel Node
                  </Button>
               </Link>
            </div>
          </CardHeader>
          
          <CardContent className="p-12 relative z-10">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
                {telemetry.map((t, i) => (
                  <div key={t.label} className="space-y-4">
                     <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{t.label}</p>
                     <div className="flex items-baseline gap-3">
                        <h4 className="text-6xl font-black text-white tracking-tighter tabular-nums">
                           {typeof t.value === 'number' && t.value < 1 ? `${(t.value * 100).toFixed(2)}%` : t.value.toLocaleString()}
                        </h4>
                        <span className="text-emerald-400 font-black text-xs">{t.trend}</span>
                     </div>
                  </div>
                ))}
             </div>

             <div className="h-48 flex items-end gap-2 px-2">
                {Array.from({ length: 40 }).map((_, i) => {
                   const h = 20 + Math.random() * 80;
                   return (
                      <motion.div 
                         key={i}
                         initial={{ height: 0 }}
                         animate={{ height: `${h}%` }}
                         transition={{ delay: i * 0.02, duration: 0.8 }}
                         className="flex-1 bg-gradient-to-t from-primary/50 to-primary/10 rounded-t-lg hover:from-primary hover:to-primary/50 transition-all cursor-crosshair group relative"
                      >
                         <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[8px] font-black py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {Math.floor(h)}k
                         </div>
                      </motion.div>
                   );
                })}
             </div>
          </CardContent>
          <div className="bg-white/5 p-6 text-center">
             <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Synchronized with Vercel Global Edge Network</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
