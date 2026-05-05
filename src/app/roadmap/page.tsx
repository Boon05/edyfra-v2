"use client";

import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { 
  Zap, 
  Cpu, 
  Globe, 
  Rocket, 
  ShieldCheck, 
  Users,
  Award,
  BookOpen,
  ArrowRight
} from "lucide-react";

const roadmapItems = [
  {
    phase: "Phase 1",
    title: "The Foundation",
    status: "Completed",
    icon: ShieldCheck,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    desc: "Deployment of core infrastructure, institutional-grade authentication, and primary peer-matching algorithms.",
    milestones: [
      "Secure Supabase & Prisma Integration",
      "Multi-Role System (Student/Tutor/Admin)",
      "Real-time Study Room Synchronization",
      "Executive Command Center (God Mode)"
    ]
  },
  {
    phase: "Phase 2",
    title: "Neural Expansion",
    status: "In Progress",
    icon: Cpu,
    color: "text-primary",
    bg: "bg-primary/10",
    desc: "Integrating advanced AI-assisted learning and sophisticated matching to ensure every scholar finds the perfect mentor.",
    milestones: [
      "Mash AI v2.0 (Gemini 1.5 Pro Integration)",
      "Automated Session Summarization",
      "Dynamic Subject Taxonomy (CBC/8-4-4)",
      "WhatsApp Community Integration"
    ]
  },
  {
    phase: "Phase 3",
    title: "Global Scholarly Hub",
    status: "Scheduled",
    icon: Globe,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    desc: "Scaling the platform to support millions of scholars across East Africa and beyond.",
    milestones: [
      "Cross-Regional Server Clusters",
      "Scholarly Achievement NFT Marketplace",
      "Institutional Partnerships (Schools & Universities)",
      "Edyfra Mobile App (iOS & Android)"
    ]
  },
  {
    phase: "Phase 4",
    title: "The Singularity",
    status: "Visionary",
    icon: Zap,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    desc: "Achieving fully autonomous academic support ecosystems.",
    milestones: [
      "VR/AR Study Labs",
      "Predictive Performance Analytics",
      "Universal Education Access Protocol",
      "Global Academic Identity (GAI)"
    ]
  }
];

export default function RoadmapPage() {
  return (
    <div className="bg-background min-h-screen">
      <Navigation />
      
      <main className="pt-32 pb-48">
        <div className="container-max">
          {/* Hero Header */}
          <div className="max-w-4xl space-y-8 mb-32">
             <motion.p 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-[10px] font-black uppercase tracking-[0.5em] text-primary"
             >
                Strategic Trajectory
             </motion.p>
             <motion.h1 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="text-7xl md:text-8xl font-black tracking-tightest leading-none"
             >
                Edyfra <span className="text-muted-foreground">Roadmap.</span>
             </motion.h1>
             <motion.p 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl leading-relaxed"
             >
                Our mission is to build the world's most sophisticated academic ecosystem. Here's how we get there.
             </motion.p>
          </div>

          {/* Roadmap Timeline */}
          <div className="relative space-y-24 md:space-y-48">
            {/* Center Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2 opacity-50" />

            {roadmapItems.map((item, i) => (
              <motion.div 
                key={item.phase}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`relative flex flex-col md:flex-row items-start ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Connector Dot */}
                <div className="absolute left-8 md:left-1/2 top-0 w-4 h-4 rounded-full bg-background border-4 border-primary z-10 md:-translate-x-1/2" />

                {/* Content Side */}
                <div className={`pl-20 md:pl-0 md:w-1/2 ${i % 2 === 0 ? 'md:pl-24' : 'md:pr-24'}`}>
                   <div className="p-10 rounded-[3rem] bg-secondary/50 border border-border backdrop-blur-xl space-y-8 group hover:border-primary/30 transition-all duration-500 shadow-2xl">
                      <div className="flex items-center justify-between">
                         <div className={`p-4 rounded-2xl ${item.bg} group-hover:scale-110 transition-transform`}>
                            <item.icon className={`h-6 w-6 ${item.color}`} />
                         </div>
                         <span className={`text-[10px] font-black uppercase tracking-widest ${item.color}`}>
                            {item.status}
                         </span>
                      </div>

                      <div className="space-y-4">
                         <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.phase}</p>
                         <h2 className="text-3xl font-black tracking-tight">{item.title}</h2>
                         <p className="text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
                      </div>

                      <div className="space-y-4 pt-6 border-t border-border">
                         <p className="text-[10px] font-black uppercase tracking-widest text-foreground">Critical Milestones</p>
                         <ul className="space-y-3">
                            {item.milestones.map((milestone) => (
                               <li key={milestone} className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                                  <div className={`w-1.5 h-1.5 rounded-full ${item.status === "Completed" ? "bg-emerald-500" : "bg-primary/30"}`} />
                                  {milestone}
                               </li>
                            ))}
                         </ul>
                      </div>
                   </div>
                </div>

                {/* Empty Side (For Layout) */}
                <div className="hidden md:block md:w-1/2" />
              </motion.div>
            ))}
          </div>

          {/* CTA Footer */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-48 p-16 rounded-[4rem] bg-gradient-to-br from-primary to-primary/60 text-white text-center space-y-8 shadow-2xl shadow-primary/20"
          >
             <h2 className="text-4xl md:text-6xl font-black tracking-tightest">Shape the future of <br /> learning with us.</h2>
             <p className="text-lg md:text-xl font-medium opacity-90 max-w-2xl mx-auto">
                Edyfra is built for scholars, by scholars. Join our WhatsApp community to stay updated on these milestones.
             </p>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="https://whatsapp.com/channel/0029Vb7GgdmHLHQfoNgSjo1P" target="_blank" rel="noopener noreferrer">
                   <button className="h-16 px-10 rounded-full bg-white text-primary font-black text-xs tracking-widest uppercase hover:bg-white/90 transition-all flex items-center gap-3 shadow-xl">
                      Join the Channel
                   </button>
                </a>
                <Link href="/signup">
                   <button className="h-16 px-10 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-white font-black text-xs tracking-widest uppercase hover:bg-white/10 transition-all flex items-center gap-3">
                      Start Your Journey <ArrowRight className="h-4 w-4" />
                   </button>
                </Link>
             </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

import Link from "next/link";
