"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, GraduationCap, BarChart3, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InstitutionLandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-8 border border-indigo-500/20">
            <Building2 className="h-4 w-4" />
            Edyfra for Institutions
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tightest mb-8 leading-tight">
            Empower your school with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              data-driven mentorship.
            </span>
          </h1>
          
          <p className="text-lg text-white/60 max-w-2xl mx-auto mb-12">
            Give your students exclusive access to verified tutors, track their performance, and manage your school's private roster—all from one powerful dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/institution/login">
              <Button className="h-14 px-8 rounded-2xl bg-white text-black hover:bg-white/90 font-bold text-base transition-all hover:scale-105">
                Institution Login <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" className="h-14 px-8 rounded-2xl border-white/20 hover:bg-white/10 font-bold text-base transition-all text-white hover:text-white">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Everything your school needs</h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">From managing dedicated tutor lists to deep dive analytics on student performance, we handle the heavy lifting so you can focus on education.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-[#111] p-8 rounded-3xl border border-white/5 space-y-4 hover:border-indigo-500/30 transition-all">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Private Tutor Rosters</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Curate a specialized list of approved Edyfra tutors exclusively for your students. These tutors appear in a 'Fast Track' section on their dashboards.
            </p>
          </div>

          <div className="bg-[#111] p-8 rounded-3xl border border-white/5 space-y-4 hover:border-cyan-500/30 transition-all">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Seamless Sync</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Upload your student lists via CSV or Excel, or connect directly to standard school management exports like Zeraki to onboard hundreds of students in seconds.
            </p>
          </div>

          <div className="bg-[#111] p-8 rounded-3xl border border-white/5 space-y-4 hover:border-emerald-500/30 transition-all">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Advanced Analytics</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Monitor engagement, track subjects where your students are struggling the most, and see real-time ROI on your educational investments.
            </p>
          </div>

          <div className="bg-[#111] p-8 rounded-3xl border border-white/5 space-y-4 hover:border-purple-500/30 transition-all">
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400">
              <Building2 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Custom Subdomains</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Give your students a branded portal. Your school's logo, your colors, and your rules, all hosted securely on our scalable infrastructure.
            </p>
          </div>

          <div className="bg-[#111] p-8 rounded-3xl border border-white/5 space-y-4 hover:border-orange-500/30 transition-all">
            <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Priority Support</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Get dedicated account managers, 24/7 technical support, and onboarding specialists to ensure a smooth transition for your staff and students.
            </p>
          </div>

          <div className="bg-[#111] p-8 rounded-3xl border border-white/5 space-y-4 hover:border-rose-500/30 transition-all">
            <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-400">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Parental Reporting</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Generate automated progress reports for parents, showcasing their child's improvements, study habits, and tutor feedback seamlessly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
