"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { completeOnboarding } from "@/app/actions/onboarding";
import { 
  Loader2, BookOpen, Wallet, 
  GraduationCap, ArrowRight, CheckCircle2, 
  Sparkles, Phone, ShieldCheck 
} from "lucide-react";
import { EDUCATIONAL_SUBJECTS } from "@/utils/subjects";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function TutorOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: "TUTOR",
    educationLevel: "UNIVERSITY",
    curriculum: [] as string[],
    subjects: [] as string[],
    hourlyRate: "500",
    mpesaNumber: "",
    bio: "",
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const toggleSubject = (s: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(s) 
        ? prev.subjects.filter(sub => sub !== s)
        : [...prev.subjects, s]
    }));
  };

  const toggleCurriculum = (c: string) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.includes(c) 
        ? prev.curriculum.filter(curr => curr !== c)
        : [...prev.curriculum, c]
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await completeOnboarding({
        ...formData,
        curriculum: formData.curriculum.join(", "),
        formYear: "1",
        county: "Nairobi",
        weakTopics: [],
        studyStyle: "solo",
        verificationPath: "GRADES",
      });
      if (result.success) {
        toast.success("Expert profile established.");
        window.location.href = "/tutor";
      }
    } catch (e) {
      toast.error("Protocol failure. Please retry.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-6 selection:bg-teal-500/30">
      <Card className="w-full max-w-2xl border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white/80 dark:bg-slate-900/50 backdrop-blur-3xl">
        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 w-full">
           <motion.div 
             className="h-full bg-teal-600 shadow-[0_0_15px_rgba(13,148,136,0.5)]" 
             initial={{ width: "25%" }}
             animate={{ width: `${(step/4) * 100}%` }}
           />
        </div>
        
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-12">
               <div className="text-center space-y-4 mb-10">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-teal-600/10 flex items-center justify-center shadow-xl shadow-teal-600/5">
                     <GraduationCap className="h-8 w-8 text-teal-600" />
                  </div>
                  <h2 className="text-4xl font-black tracking-tightest">Expert Tier.</h2>
                  <p className="text-muted-foreground font-bold text-[10px] uppercase tracking-[0.3em]">Phase 01: Academic Range</p>
               </div>
               
               <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-4">
                     {["HIGH_SCHOOL", "UNIVERSITY"].map((level) => (
                       <button
                         key={level}
                         onClick={() => setFormData({...formData, educationLevel: level})}
                         className={cn(
                           "p-8 rounded-[2rem] border-2 transition-all duration-300 flex flex-col items-center gap-4 group",
                           formData.educationLevel === level 
                             ? "border-teal-600 bg-teal-600/5 shadow-xl shadow-teal-600/5" 
                             : "border-border bg-secondary/50 hover:border-teal-600/50"
                         )}
                       >
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                            formData.educationLevel === level ? "bg-teal-600 text-white" : "bg-background text-muted-foreground group-hover:text-teal-600"
                          )}>
                             {level === "HIGH_SCHOOL" ? <BookOpen className="h-6 w-6" /> : <GraduationCap className="h-6 w-6" />}
                          </div>
                          <span className="font-black text-xs uppercase tracking-widest text-center">
                            {level.replace("_", " ")}
                          </span>
                       </button>
                     ))}
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Curriculum Mastery</label>
                    <div className="grid grid-cols-3 gap-3">
                       {["8-4-4", "CBC", "IGCSE"].map((curr) => (
                         <button
                           key={curr}
                           onClick={() => toggleCurriculum(curr)}
                           className={cn(
                             "py-4 rounded-xl border-2 transition-all font-black text-[11px] uppercase tracking-tighter",
                             formData.curriculum.includes(curr) ? "border-teal-600 bg-teal-600/5 text-teal-700" : "border-border bg-background"
                           )}
                         >
                           {curr}
                         </button>
                       ))}
                    </div>
                  </div>
               </div>
               
                <div className="pt-12 flex justify-end">
                  <Button 
                    disabled={formData.curriculum.length === 0} 
                    onClick={nextStep} 
                    className="rounded-2xl h-16 px-10 font-black text-xs tracking-[0.2em] uppercase bg-teal-600 hover:bg-teal-700 shadow-xl shadow-teal-600/20 transition-all active:scale-95"
                  >
                     NEXT PHASE <ArrowRight className="ml-3 h-4 w-4" />
                  </Button>
               </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-12">
               <div className="text-center space-y-4 mb-10">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-teal-600/10 flex items-center justify-center shadow-xl shadow-teal-600/5">
                     <Sparkles className="h-8 w-8 text-teal-600" />
                  </div>
                  <h2 className="text-4xl font-black tracking-tightest">Expertise Map.</h2>
                  <p className="text-muted-foreground font-bold text-[10px] uppercase tracking-[0.3em]">Phase 02: Specialization</p>
               </div>

               <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Select Subjects You Teach (Min 1)</label>
                    <div className="grid grid-cols-2 gap-3 h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {[...EDUCATIONAL_SUBJECTS.HIGH_SCHOOL, ...EDUCATIONAL_SUBJECTS.UNIVERSITY].map((s) => (
                        <button
                          key={s}
                          onClick={() => toggleSubject(s)}
                          className={cn(
                            "p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-between group",
                            formData.subjects.includes(s) 
                              ? "border-teal-600 bg-teal-600/5" 
                              : "border-border bg-secondary/30 hover:border-teal-600/50"
                          )}
                        >
                           <span className={cn(
                             "text-[10px] font-black uppercase tracking-tightest transition-colors",
                             formData.subjects.includes(s) ? "text-teal-700" : "text-muted-foreground group-hover:text-teal-600"
                           )}>
                             {s}
                           </span>
                           {formData.subjects.includes(s) && <CheckCircle2 className="h-4 w-4 text-teal-600" />}
                        </button>
                      ))}
                    </div>
                  </div>
               </div>

                <div className="pt-12 flex justify-between gap-4">
                  <Button variant="ghost" onClick={prevStep} className="rounded-2xl h-16 px-8 font-black text-xs tracking-widest uppercase hover:bg-secondary transition-all">Back</Button>
                  <Button 
                    disabled={formData.subjects.length < 1} 
                    onClick={nextStep} 
                    className="flex-1 rounded-2xl h-16 px-10 font-black text-xs tracking-[0.2em] uppercase bg-teal-600 hover:bg-teal-700 shadow-xl shadow-teal-600/20 transition-all active:scale-95"
                  >
                     NEXT PHASE <ArrowRight className="ml-3 h-4 w-4" />
                  </Button>
               </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-12">
               <div className="text-center space-y-4 mb-10">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-teal-600/10 flex items-center justify-center shadow-xl shadow-teal-600/5">
                     <Wallet className="h-8 w-8 text-teal-600" />
                  </div>
                  <h2 className="text-4xl font-black tracking-tightest">Financials.</h2>
                  <p className="text-muted-foreground font-bold text-[10px] uppercase tracking-[0.3em]">Phase 03: Economic Setup</p>
               </div>

               <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                       <Wallet className="h-4 w-4 text-teal-600" />
                       <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Hourly Rate (Ksh)</Label>
                    </div>
                    <Input 
                      type="number"
                      className="h-16 rounded-2xl border-border bg-secondary/50 font-black px-6 focus-visible:ring-teal-600"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                       <Phone className="h-4 w-4 text-teal-600" />
                       <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Withdrawal M-Pesa</Label>
                    </div>
                    <Input 
                      placeholder="07XX XXX XXX"
                      className="h-16 rounded-2xl border-border bg-secondary/50 font-black px-6 focus-visible:ring-teal-600"
                      value={formData.mpesaNumber}
                      onChange={(e) => setFormData({ ...formData, mpesaNumber: e.target.value })}
                    />
                  </div>
               </div>

                <div className="pt-12 flex justify-between gap-4">
                  <Button variant="ghost" onClick={prevStep} className="rounded-2xl h-16 px-8 font-black text-xs tracking-widest uppercase hover:bg-secondary transition-all">Back</Button>
                  <Button 
                    disabled={!formData.mpesaNumber || !formData.hourlyRate} 
                    onClick={nextStep} 
                    className="flex-1 rounded-2xl h-16 px-10 font-black text-xs tracking-[0.2em] uppercase bg-teal-600 hover:bg-teal-700 shadow-xl shadow-teal-600/20 transition-all active:scale-95"
                  >
                     NEXT PHASE <ArrowRight className="ml-3 h-4 w-4" />
                  </Button>
               </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-12">
               <div className="text-center space-y-4 mb-10">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-teal-600/10 flex items-center justify-center shadow-xl shadow-teal-600/5">
                     <ShieldCheck className="h-8 w-8 text-teal-600" />
                  </div>
                  <h2 className="text-4xl font-black tracking-tightest">Expert Bio.</h2>
                  <p className="text-muted-foreground font-bold text-[10px] uppercase tracking-[0.3em]">Phase 04: Final Protocol</p>
               </div>

               <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Professional Summary</Label>
                    <Textarea 
                      placeholder="Summarize your academic background and teaching style..." 
                      className="min-h-[200px] rounded-[2rem] border-border bg-secondary/50 font-bold p-8 focus-visible:ring-teal-600"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    />
                  </div>
               </div>

                <div className="pt-12 flex justify-between gap-4">
                  <Button variant="ghost" onClick={prevStep} disabled={loading} className="rounded-2xl h-16 px-8 font-black text-xs tracking-widest uppercase hover:bg-secondary transition-all">Back</Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={loading || !formData.bio} 
                    className="flex-1 rounded-2xl h-16 font-black text-xs tracking-[0.2em] uppercase bg-teal-600 hover:bg-teal-700 shadow-xl shadow-teal-600/20 transition-all active:scale-95"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "FINALIZE ONBOARDING"}
                  </Button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
