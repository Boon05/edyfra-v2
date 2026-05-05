"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="bg-background pt-32 pb-48">
      <div className="container-max max-w-4xl space-y-16">
        <div className="space-y-6">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Institutional Security</p>
           <h1 className="text-6xl font-black tracking-tightest">Privacy <span className="text-muted-foreground">Protocol.</span></h1>
           <p className="text-xl text-muted-foreground font-medium">How we synchronize and protect your scholarly data.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-16 border-b border-border">
           {[
             { icon: Lock, title: "Encryption", desc: "End-to-end institutional grade security." },
             { icon: Eye, title: "Transparency", desc: "You own every byte of your knowledge." },
             { icon: ShieldCheck, title: "Protection", desc: "Zero-sharing policy with 3rd parties." },
           ].map((item, i) => (
             <div key={i} className="p-6 bg-secondary rounded-2xl space-y-4">
                <item.icon className="h-6 w-6 text-primary" />
                <h3 className="font-black text-sm uppercase tracking-widest">{item.title}</h3>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
             </div>
           ))}
        </div>

        <div className="prose prose-invert max-w-none space-y-16">
           <section className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight flex items-center gap-4">
                 <span className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-sm">01</span>
                 Data Acquisition Strategy
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed font-medium">
                <p>
                  Edyfra implements a strict "Data Minimization" protocol. We only acquire information that is fundamentally essential to the synchronization of scholarly connections. This primary data set includes:
                </p>
                <ul className="list-disc pl-6 space-y-2 marker:text-primary">
                  <li>Institutional Identity: Valid academic email addresses for verification.</li>
                  <li>Academic Metadata: Level of study, subject specializations, and curriculum (8-4-4, CBC, IGCSE).</li>
                  <li>Interaction Telemetry: Real-time study session metadata to optimize our matching algorithms.</li>
                </ul>
              </div>
           </section>

           <section className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight flex items-center gap-4">
                 <span className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-sm">02</span>
                 Scholarly Lab Synchronization
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed font-medium">
                <p>
                  Knowledge shared within Edyfra Research Labs (Study Rooms) is protected by transient encryption. While sessions are live, ephemeral data is processed to enable:
                </p>
                <ul className="list-disc pl-6 space-y-2 marker:text-primary">
                  <li>Mash AI Interventions: Providing real-time academic support when mentors are unavailable.</li>
                  <li>Session Synthesis: Automated generation of study summaries for later review.</li>
                  <li>Conflict Resolution: Ensuring institutional standards are maintained during peer-to-peer interactions.</li>
                </ul>
                <p className="text-xs italic bg-secondary p-4 rounded-xl border border-border">
                  Note: Users retain full sovereignty over their session logs and may execute a "Permanent Purge" command at any time.
                </p>
              </div>
           </section>

           <section className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight flex items-center gap-4">
                 <span className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-sm">03</span>
                 Global Infrastructure & Security
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed font-medium">
                <p>
                  Our security architecture is built on a multi-layer "Zero Trust" framework. Edyfra utilizes enterprise-grade providers (Supabase, Vercel, Prisma) to host your data across globally distributed clusters. 
                </p>
                <p>
                  We execute hourly automated security audits and implement Row Level Security (RLS) on all database tables to ensure that your private scholarly trajectory remains visible only to authorized nodes in the ecosystem.
                </p>
              </div>
           </section>

           <section className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight flex items-center gap-4">
                 <span className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-sm">04</span>
                 Institutional Transparency
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed font-medium">
                <p>
                  Edyfra does not participate in data commercialization. Your academic profile is never sold to 3rd party advertisers. Any data shared with institutional partners is strictly anonymized and used exclusively for academic research aimed at improving Kenyan educational outcomes.
                </p>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
}
