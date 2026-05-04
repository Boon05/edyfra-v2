"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const PRICING_PASSWORD = "4255";

export default function PricingPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState("");
  const [show, setShow] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleUnlock = () => {
    if (input === PRICING_PASSWORD) {
      setUnlocked(true);
      toast.success("Access granted. Welcome to the inner sanctum.");
    } else {
      setAttempts(a => a + 1);
      toast.error(`Incorrect access code. Attempt ${attempts + 1}.`);
      setInput("");
    }
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[160px] rounded-full" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-md space-y-10 text-center"
        >
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-[2rem] bg-secondary border border-border flex items-center justify-center shadow-2xl">
              <Lock className="h-9 w-9 text-primary" />
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Restricted Access</p>
              <h1 className="text-4xl font-black tracking-tightest">Pricing Protocols</h1>
              <p className="text-muted-foreground font-medium">
                This section is currently locked during our beta synchronization phase. Enter the access code to continue.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleUnlock()}
                type={show ? "text" : "password"}
                placeholder="Access code"
                className="h-16 rounded-2xl text-center text-2xl font-black tracking-[0.5em] bg-secondary border-border"
              />
              <button
                onClick={() => setShow(!show)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <Button
              onClick={handleUnlock}
              className="w-full h-14 rounded-2xl bg-foreground text-background font-black text-xs tracking-widest uppercase shadow-xl transition-all active:scale-95"
            >
              <ShieldCheck className="h-4 w-4 mr-2" /> Authenticate
            </Button>
          </div>

          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
            Edyfra is currently in beta — pricing will be published at launch.
          </p>
        </motion.div>
      </div>
    );
  }

  const tiers = [
    {
      name: "Free",
      price: "0",
      description: "Ideal for individual scholars starting their trajectory.",
      features: ["AI Matching (Limited)", "Public Knowledge Desk", "Standard Analytics", "Community Chat"],
      button: "Get Started",
      href: "/signup",
      popular: false,
    },
    {
      name: "Pro",
      price: "499",
      description: "For elite scholars demanding peak performance.",
      features: ["Priority AI Matching", "Private Study Rooms", "Advanced Growth Metrics", "Expert Q&A Access", "Ad-free Experience"],
      button: "Go Pro",
      href: "/signup",
      popular: true,
    },
    {
      name: "Institution",
      price: "Custom",
      description: "Complete ecosystem synchronization for schools.",
      features: ["Unlimited Scholars", "Dedicated Admin Console", "Institutional Verification", "SLA Support", "API Integration"],
      button: "Contact Sales",
      href: "/contact",
      popular: false,
    },
  ];

  return (
    <div className="bg-background pt-32 pb-48">
      <div className="container-max space-y-32">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Internal Pricing</p>
          <h1 className="text-6xl md:text-8xl font-black tracking-tightest leading-none">
            Scalable <br /><span className="text-muted-foreground">Scholarship.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed">
            Choose the protocol that fits your academic ambitions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-10 rounded-[3rem] border transition-all flex flex-col justify-between space-y-12 ${
                tier.popular
                  ? "bg-foreground text-background border-foreground shadow-[0_40px_100px_-20px_rgba(0,113,227,0.3)] scale-105 z-10"
                  : "bg-secondary border-border"
              }`}
            >
              {tier.popular && (
                <div className="absolute top-6 right-10">
                  <span className="px-4 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full">Recommended</span>
                </div>
              )}
              <div className="space-y-6">
                <h3 className="text-2xl font-black tracking-tight">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tightest">KSH {tier.price}</span>
                  {tier.price !== "Custom" && <span className="text-sm font-bold opacity-60">/mo</span>}
                </div>
                <p className={`text-sm font-medium ${tier.popular ? "text-background/60" : "text-muted-foreground"}`}>{tier.description}</p>
              </div>
              <div className="space-y-6">
                <ul className="space-y-4">
                  {tier.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm font-medium">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${tier.popular ? "bg-primary text-white" : "bg-primary/10 text-primary"}`}>
                        <svg className="h-3 w-3 stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href={tier.href} className="block w-full">
                  <Button className={`w-full h-14 rounded-full font-black text-xs tracking-widest uppercase transition-all shadow-xl active:scale-95 ${
                    tier.popular ? "bg-primary hover:bg-primary/90 text-white" : "bg-foreground text-background"
                  }`}>
                    {tier.button}
                  </Button>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
