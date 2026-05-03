"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  ArrowRight, Zap, Shield, Users, 
  Globe, BookOpen, GraduationCap, 
  ChevronRight, Star, CheckCircle2,
  Code, BrainCircuit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-teal-500/30 overflow-x-hidden">
      {/* Techy Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">Edyfra</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-400">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#experts" className="hover:text-white transition-colors">Experts</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Enterprise</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="font-bold text-sm hover:bg-white/5">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-white text-black hover:bg-white/90 font-black text-xs tracking-widest px-6 rounded-xl h-10 uppercase">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden">
        {/* Background Visual */}
        <div className="absolute inset-0 z-0">
          <img 
            src="file:///C:/Users/Mash/.gemini/antigravity/brain/d7aaa8fd-3cc8-432c-9832-74bcb37dc4be/edyfra_hero_tech_background_1777818096176.png" 
            alt="Tech Background" 
            className="w-full h-full object-cover opacity-40 scale-110 animate-pulse duration-[5000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/0 via-slate-950/80 to-slate-950" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <Zap className="h-3 w-3 animate-pulse" /> Now Powered by Advanced AI Matching
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
              The Future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">Academic Mastery</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
              Edyfra is the intelligent operating system for scholars. Connect with global experts, solve complex challenges, and dominate your curriculum.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/signup">
                <Button className="h-16 px-10 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-sm tracking-widest shadow-2xl shadow-teal-600/20 group">
                  START LEARNING NOW <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/onboarding/choice">
                <Button variant="outline" className="h-16 px-10 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 font-bold text-sm">
                  Apply as an Expert
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
             <h2 className="text-4xl md:text-5xl font-black tracking-tight">Built for Performance</h2>
             <p className="text-slate-500 font-medium text-lg">Next-generation tools for the modern intellectual.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
             {/* Main Feature */}
             <div className="md:col-span-8 group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-950 border border-white/5 p-10 flex flex-col justify-between hover:border-teal-500/30 transition-all duration-500">
                <div className="space-y-4 relative z-10">
                   <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-400">
                      <BrainCircuit className="h-6 w-6" />
                   </div>
                   <h3 className="text-3xl font-black">AI-Powered Peer Matching</h3>
                   <p className="text-slate-400 max-w-sm font-medium">Our proprietary algorithm finds the perfect study partner or expert tutor in under 10 seconds.</p>
                </div>
                <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-teal-500/10 blur-[120px] rounded-full group-hover:bg-teal-500/20 transition-all" />
                <div className="relative z-10 flex gap-2 pt-10">
                   <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-teal-500">Latent Matching</div>
                   <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-blue-500">Geo-optimized</div>
                </div>
             </div>

             {/* Side Feature 1 */}
             <div className="md:col-span-4 rounded-[2.5rem] bg-slate-900 border border-white/5 p-10 flex flex-col items-center justify-center text-center hover:bg-slate-800/50 transition-all">
                <div className="w-16 h-16 rounded-3xl bg-orange-500/10 text-orange-400 flex items-center justify-center mb-6">
                   <Code className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-black">Code & Whiteboard</h3>
                <p className="text-slate-500 text-sm font-medium mt-2">Shared environments for complex problem solving.</p>
             </div>

             {/* Bottom Row */}
             <div className="md:col-span-4 rounded-[2.5rem] bg-slate-900 border border-white/5 p-10 flex flex-col justify-center hover:bg-slate-800/50 transition-all group">
                <h3 className="text-xl font-black mb-2">Daily Quests</h3>
                <p className="text-slate-500 text-sm font-medium">Gamified challenges to keep your streak alive.</p>
                <div className="mt-6 flex items-center gap-1">
                   {[1,2,3,4,5].map(i => <div key={i} className="h-1 flex-1 bg-teal-500/20 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ delay: i*0.1 }} className="h-full bg-teal-500" />
                   </div>)}
                </div>
             </div>

             <div className="md:col-span-8 rounded-[2.5rem] bg-teal-600 p-10 flex flex-col md:flex-row items-center justify-between gap-8 group">
                <div className="space-y-4">
                   <h3 className="text-3xl font-black">The Expert Network</h3>
                   <p className="text-teal-50 font-medium max-w-xs">Access thousands of verified tutors from Kenya's top universities.</p>
                   <Button variant="secondary" className="bg-white text-teal-600 font-black rounded-xl">View Directory</Button>
                </div>
                <div className="relative h-40 w-40 flex items-center justify-center bg-white/10 rounded-full">
                   <Users className="h-20 w-20 text-white/50" />
                   <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-2 border-dashed border-white/20 rounded-full" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 pt-24 pb-12">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2 md:col-span-1 space-y-6">
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
                    <GraduationCap className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-lg font-black tracking-tighter uppercase">Edyfra</span>
               </div>
               <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  The infrastructure for the next generation of African genius.
               </p>
            </div>
            {["Platform", "Community", "Company"].map((title) => (
              <div key={title} className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</h4>
                <ul className="space-y-4 text-sm font-bold text-slate-500">
                  <li className="hover:text-teal-500 transition-colors cursor-pointer">Changelog</li>
                  <li className="hover:text-teal-500 transition-colors cursor-pointer">Documentation</li>
                  <li className="hover:text-teal-500 transition-colors cursor-pointer">Status</li>
                </ul>
              </div>
            ))}
         </div>
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/5 pt-12 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <p>&copy; 2024 Edyfra Platforms Ltd. Distributed Education.</p>
            <div className="flex gap-8">
               <span className="hover:text-white cursor-pointer">Privacy</span>
               <span className="hover:text-white cursor-pointer">Terms</span>
               <span className="hover:text-white cursor-pointer">Cookies</span>
            </div>
         </div>
      </footer>
    </div>
  );
}
