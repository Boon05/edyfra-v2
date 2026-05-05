"use client";

import { motion } from "framer-motion";
import { FileText, Scale, UserCheck, AlertTriangle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="bg-background pt-32 pb-48">
      <div className="container-max max-w-4xl space-y-16">
        <div className="space-y-6">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Scholarly Standards</p>
           <h1 className="text-6xl font-black tracking-tightest text-foreground">Terms of <span className="text-muted-foreground">Service.</span></h1>
           <p className="text-xl text-muted-foreground font-medium">The foundation of our institutional ecosystem.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-16 border-b border-border">
           {[
             { icon: Scale, title: "Fair Use", desc: "Respect intellectual property and peers." },
             { icon: UserCheck, title: "Verification", desc: "Authentic profiles only." },
             { icon: AlertTriangle, title: "Conduct", desc: "Zero tolerance for academic dishonesty." },
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
                 Institutional Integrity
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed font-medium">
                <p>
                  Edyfra is a high-performance academic ecosystem. By accessing our platform, you commit to maintaining the "Scholarly Code of Conduct." This includes:
                </p>
                <ul className="list-disc pl-6 space-y-2 marker:text-primary">
                  <li>Academic Honesty: Prohibiting the use of the platform for cheating, plagiarism, or unauthorized resource sharing.</li>
                  <li>Peer Respect: Zero tolerance for harassment, discrimination, or non-scholarly conduct in Research Labs.</li>
                  <li>Identity Veracity: Ensuring all profile information reflects your true academic status and educational background.</li>
                </ul>
              </div>
           </section>

           <section className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight flex items-center gap-4">
                 <span className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-sm">02</span>
                 User Node Obligations
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed font-medium">
                <p>
                  Users (Scholars and Mentors) are responsible for the security of their institutional credentials. Any breach of security resulting from negligent credential management is the sole responsibility of the node owner.
                </p>
                <p>
                  Edyfra reserves the right to terminate any node (user account) that demonstrates patterns of "Ecosystem Disturbance," including but not limited to spamming, bot-like behavior, or repeated violations of academic integrity.
                </p>
              </div>
           </section>

           <section className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight flex items-center gap-4">
                 <span className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-sm">03</span>
                 Mission-Critical Availability
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed font-medium">
                <p>
                  While we strive for 99.9% synchronization uptime, service may be occasionally suspended for institutional upgrades, database maintenance, or AI engine retraining. 
                </p>
                <p>
                  Edyfra is not liable for any academic deadlines missed due to scheduled or unscheduled platform downtime. We recommend all scholars maintain local backups of critical study materials.
                </p>
              </div>
           </section>

           <section className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight flex items-center gap-4">
                 <span className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-sm">04</span>
                 Intellectual Property
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed font-medium">
                <p>
                  All content generated within the Edyfra ecosystem—including proprietary algorithms, UI/UX designs, and institutional data—is the property of Edyfra Platforms. 
                </p>
                <p>
                  Scholars retain ownership of their original research notes, but grant Edyfra a non-exclusive license to process this data to improve the ecosystem's AI-assisted learning capabilities.
                </p>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
}
