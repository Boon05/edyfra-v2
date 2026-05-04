"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { completeOnboarding } from "@/app/actions/onboarding";
import { Loader2, BookOpen, MapPin, GraduationCap, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { EDUCATIONAL_SUBJECTS } from "@/utils/subjects";
import { cn } from "@/lib/utils";

export default function StudentOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: "STUDENT",
    educationLevel: "",
    curriculum: "8-4-4",
    formYear: "",
    county: "",
    subjects: [] as string[],
    weakTopics: [] as string[],
    studyStyle: "",
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

  const toggleWeakTopic = (s: string) => {
    setFormData(prev => ({
      ...prev,
      weakTopics: prev.weakTopics.includes(s) 
        ? prev.weakTopics.filter(sub => sub !== s)
        : [...prev.weakTopics, s]
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await completeOnboarding(formData);
      if (result.success) {
        window.location.href = "/dashboard";
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const availableSubjects = formData.educationLevel === "UNIVERSITY" 
    ? EDUCATIONAL_SUBJECTS.UNIVERSITY 
    : EDUCATIONAL_SUBJECTS.HIGH_SCHOOL;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-6 selection:bg-primary/30">
      <Card className="w-full max-w-2xl border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white/80 dark:bg-slate-900/50 backdrop-blur-3xl">
        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 w-full">
           <motion.div 
             className="h-full bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" 
             initial={{ width: "20%" }}
             animate={{ width: `${(step/5) * 100}%` }}
           />
        </div>
        
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-12">
               <div className="text-center space-y-4 mb-10">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shadow-xl shadow-primary/5">
                     <GraduationCap className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-4xl font-black tracking-tightest">Academic Tier.</h2>
                  <p className="text-muted-foreground font-bold text-[10px] uppercase tracking-[0.3em]">Phase 01: Identification</p>
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
                             ? "border-primary bg-primary/5 shadow-xl shadow-primary/5" 
                             : "border-border bg-secondary/50 hover:border-primary/50"
                         )}
                       >
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                            formData.educationLevel === level ? "bg-primary text-white" : "bg-background text-muted-foreground group-hover:text-primary"
                          )}>
                             {level === "HIGH_SCHOOL" ? <BookOpen className="h-6 w-6" /> : <GraduationCap className="h-6 w-6" />}
                          </div>
                          <span className="font-black text-xs uppercase tracking-widest text-center">
                            {level.replace("_", " ")}
                          </span>
                       </button>
                     ))}
                  </div>

                  {formData.educationLevel === "HIGH_SCHOOL" && (
                    <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Curriculum OS</label>
                      <div className="grid grid-cols-3 gap-3">
                         {["8-4-4", "CBC", "IGCSE"].map((curr) => (
                           <button
                             key={curr}
                             onClick={() => setFormData({...formData, curriculum: curr})}
                             className={cn(
                               "py-4 rounded-xl border-2 transition-all font-black text-[11px] uppercase tracking-tighter",
                               formData.curriculum === curr ? "border-primary bg-primary/5 text-primary" : "border-border bg-background"
                             )}
                           >
                             {curr}
                           </button>
                         ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Academic Year</label>
                    <Select onValueChange={(v: string | null) => v && setFormData({...formData, formYear: v})}>
                      <SelectTrigger className="h-16 rounded-2xl border-border bg-secondary/50 font-bold px-6">
                        <SelectValue placeholder="Current Level" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-border">
                        {[1,2,3,4,5,6].map(n => (
                          <SelectItem key={n} value={n.toString()} className="font-bold">
                            {formData.educationLevel === "UNIVERSITY" ? `Year ${n}` : `${formData.curriculum === "CBC" ? "Grade" : "Form"} ${n}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
               </div>
               
                <div className="pt-12 flex justify-end">
                  <Button 
                    disabled={!formData.educationLevel || !formData.formYear} 
                    onClick={nextStep} 
                    className="rounded-2xl h-16 px-10 font-black text-xs tracking-[0.2em] uppercase shadow-xl shadow-primary/20 transition-all active:scale-95"
                  >
                     NEXT PHASE <ArrowRight className="ml-3 h-4 w-4" />
                  </Button>
               </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-12">
               <div className="text-center space-y-4 mb-10">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center shadow-xl shadow-blue-500/5">
                     <MapPin className="h-8 w-8 text-blue-500" />
                  </div>
                  <h2 className="text-4xl font-black tracking-tightest">Regional Sync.</h2>
                  <p className="text-muted-foreground font-bold text-[10px] uppercase tracking-[0.3em]">Phase 02: Geolocation</p>
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Current County</label>
                  <Select onValueChange={(v: string | null) => v && setFormData({...formData, county: v})}>
                    <SelectTrigger className="h-16 rounded-2xl border-border bg-secondary/50 font-bold px-6">
                      <SelectValue placeholder="Select Deployment Zone" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-border">
                      {["Nairobi", "Mombasa", "Nakuru", "Kisumu", "Uasin Gishu", "Kiambu", "Machakos", "Kakamega", "Meru", "Nyeri", "Kisii", "Trans Nzoia", "Bungoma", "Kilifi"].map(c => (
                        <SelectItem key={c} value={c} className="font-bold">{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
               </div>

                <div className="pt-12 flex justify-between gap-4">
                  <Button variant="ghost" onClick={prevStep} className="rounded-2xl h-16 px-8 font-black text-xs tracking-widest uppercase hover:bg-secondary transition-all">Back</Button>
                  <Button 
                    disabled={!formData.county} 
                    onClick={nextStep} 
                    className="flex-1 rounded-2xl h-16 px-10 font-black text-xs tracking-[0.2em] uppercase shadow-xl shadow-primary/20 transition-all active:scale-95"
                  >
                     NEXT PHASE <ArrowRight className="ml-3 h-4 w-4" />
                  </Button>
               </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-12">
               <div className="text-center space-y-4 mb-10">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center shadow-xl shadow-orange-500/5">
                     <BookOpen className="h-8 w-8 text-orange-500" />
                  </div>
                  <h2 className="text-4xl font-black tracking-tightest">Expertise Map.</h2>
                  <p className="text-muted-foreground font-bold text-[10px] uppercase tracking-[0.3em]">Phase 03: Specialization (Strengths)</p>
               </div>

               <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Select Strong Subjects (Min 1)</label>
                    <div className="grid grid-cols-2 gap-3 h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {availableSubjects.map((s) => (
                        <button
                          key={s}
                          onClick={() => toggleSubject(s)}
                          className={cn(
                            "p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-between group",
                            formData.subjects.includes(s) 
                              ? "border-primary bg-primary/5" 
                              : "border-border bg-secondary/30 hover:border-primary/50"
                          )}
                        >
                           <span className={cn(
                             "text-[10px] font-black uppercase tracking-tightest transition-colors",
                             formData.subjects.includes(s) ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                           )}>
                             {s}
                           </span>
                           {formData.subjects.includes(s) && <CheckCircle2 className="h-4 w-4 text-primary" />}
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
                    className="flex-1 rounded-2xl h-16 px-10 font-black text-xs tracking-[0.2em] uppercase shadow-xl shadow-primary/20 transition-all active:scale-95"
                  >
                     NEXT PHASE <ArrowRight className="ml-3 h-4 w-4" />
                  </Button>
               </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-12">
               <div className="text-center space-y-4 mb-10">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center shadow-xl shadow-red-500/5">
                     <AlertCircle className="h-8 w-8 text-red-500" />
                  </div>
                  <h2 className="text-4xl font-black tracking-tightest">Gap Analysis.</h2>
                  <p className="text-muted-foreground font-bold text-[10px] uppercase tracking-[0.3em]">Phase 04: Support Requirement (Weaknesses)</p>
               </div>

               <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Select Subjects Needing Support</label>
                    <div className="grid grid-cols-2 gap-3 h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {availableSubjects.map((s) => (
                        <button
                          key={s}
                          onClick={() => toggleWeakTopic(s)}
                          className={cn(
                            "p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-between group",
                            formData.weakTopics.includes(s) 
                              ? "border-red-500 bg-red-500/5" 
                              : "border-border bg-secondary/30 hover:border-red-500/50"
                          )}
                        >
                           <span className={cn(
                             "text-[10px] font-black uppercase tracking-tightest transition-colors",
                             formData.weakTopics.includes(s) ? "text-red-500" : "text-muted-foreground group-hover:text-red-500"
                           )}>
                             {s}
                           </span>
                           {formData.weakTopics.includes(s) && <CheckCircle2 className="h-4 w-4 text-red-500" />}
                        </button>
                      ))}
                    </div>
                  </div>
               </div>

                <div className="pt-12 flex justify-between gap-4">
                  <Button variant="ghost" onClick={prevStep} className="rounded-2xl h-16 px-8 font-black text-xs tracking-widest uppercase hover:bg-secondary transition-all">Back</Button>
                  <Button 
                    disabled={formData.weakTopics.length < 1} 
                    onClick={nextStep} 
                    className="flex-1 rounded-2xl h-16 px-10 font-black text-xs tracking-[0.2em] uppercase shadow-xl shadow-primary/20 transition-all active:scale-95"
                  >
                     NEXT PHASE <ArrowRight className="ml-3 h-4 w-4" />
                  </Button>
               </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-12">
               <div className="text-center space-y-4 mb-10">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center shadow-xl shadow-emerald-500/5">
                     <Sparkles className="h-8 w-8 text-emerald-500" />
                  </div>
                  <h2 className="text-4xl font-black tracking-tightest">Final Protocol.</h2>
                  <p className="text-muted-foreground font-bold text-[10px] uppercase tracking-[0.3em]">Phase 05: Cognitive Style</p>
               </div>

               <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Preferred Methodology</label>
                    <div className="grid grid-cols-1 gap-4">
                      {[
                        { id: "visual", label: "Visual Integration", desc: "Graphs & Diagrams" },
                        { id: "auditory", label: "Auditory Processing", desc: "Lecture analysis" },
                        { id: "group", label: "Collaborative Sync", desc: "Peer-to-peer matching" },
                        { id: "solo", label: "Autonomous Deepwork", desc: "Independent research" },
                      ].map((style) => (
                        <button
                          key={style.id}
                          onClick={() => setFormData({...formData, studyStyle: style.id})}
                          className={cn(
                            "p-6 rounded-2xl border-2 transition-all duration-300 text-left group",
                            formData.studyStyle === style.id 
                              ? "border-primary bg-primary/5 shadow-xl shadow-primary/5" 
                              : "border-border bg-secondary/50 hover:border-primary/50"
                          )}
                        >
                           <p className={cn(
                             "font-black text-[11px] uppercase tracking-widest mb-1 transition-colors",
                             formData.studyStyle === style.id ? "text-primary" : "text-foreground group-hover:text-primary"
                           )}>{style.label}</p>
                           <p className="text-[10px] font-bold text-muted-foreground leading-tight">{style.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
               </div>

                <div className="pt-12 flex justify-between gap-4">
                  <Button variant="ghost" onClick={prevStep} disabled={loading} className="rounded-2xl h-16 px-8 font-black text-xs tracking-widest uppercase hover:bg-secondary transition-all">Back</Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={loading || !formData.studyStyle} 
                    className="flex-1 rounded-2xl h-16 font-black text-xs tracking-[0.2em] uppercase bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-95"
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
