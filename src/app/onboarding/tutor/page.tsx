"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  GraduationCap, BookOpen, Clock, 
  Wallet, ShieldCheck, Loader2, Sparkles, Phone,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { completeOnboarding } from "@/app/actions/onboarding";
import { EDUCATIONAL_SUBJECTS } from "@/utils/subjects";
import { cn } from "@/lib/utils";

export default function TutorOnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subjects: [] as string[],
    hourlyRate: "500",
    bio: "",
    mpesaNumber: "",
    curriculum: [] as string[],
    educationLevel: "UNIVERSITY",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.subjects.length === 0) {
      toast.error("Select at least one subject.");
      return;
    }
    setLoading(true);

    try {
      await completeOnboarding({
        role: "TUTOR",
        educationLevel: formData.educationLevel,
        curriculum: formData.curriculum.join(", "),
        formYear: "1",
        county: "Nairobi",
        subjects: formData.subjects,
        weakTopics: [],
        studyStyle: "solo",
        bio: formData.bio,
        verificationPath: "GRADES",
        hourlyRate: formData.hourlyRate,
      });

      toast.success("Application submitted! Welcome to the Expert Team.");
      window.location.href = "/tutor";
    } catch (error) {
      toast.error("Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex flex-col items-center justify-center p-6 selection:bg-teal-500/30 font-sans">
      <div className="max-w-3xl w-full">
        <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white/80 dark:bg-slate-900/50 backdrop-blur-3xl">
          <CardHeader className="p-12 text-center bg-teal-600 text-white relative">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-teal-400/20 via-transparent to-transparent opacity-50" />
            <div className="mx-auto w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 relative z-10 shadow-2xl">
               <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-4xl font-black tracking-tightest relative z-10 uppercase">Expert Onboarding.</CardTitle>
            <CardDescription className="text-teal-50 font-bold text-[10px] uppercase tracking-[0.3em] mt-4 relative z-10 opacity-80">Phase 01: Professional Credentials</CardDescription>
          </CardHeader>
          
          <CardContent className="p-12 space-y-12">
            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                   <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-900/20">
                      <BookOpen className="h-4 w-4 text-teal-600" />
                   </div>
                   <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Expertise Map</Label>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                  {[...EDUCATIONAL_SUBJECTS.HIGH_SCHOOL, ...EDUCATIONAL_SUBJECTS.UNIVERSITY].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSubject(s)}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-between text-left group",
                        formData.subjects.includes(s) 
                          ? "border-teal-600 bg-teal-50 dark:bg-teal-900/10" 
                          : "border-border bg-secondary/30 hover:border-teal-600/50"
                      )}
                    >
                       <span className={cn(
                         "text-[10px] font-black uppercase tracking-tightest transition-colors",
                         formData.subjects.includes(s) ? "text-teal-700 dark:text-teal-400" : "text-muted-foreground group-hover:text-teal-600"
                       )}>
                         {s}
                       </span>
                       {formData.subjects.includes(s) && <CheckCircle2 className="h-4 w-4 text-teal-600" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                   <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-900/20">
                      <Sparkles className="h-4 w-4 text-teal-600" />
                   </div>
                   <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Curriculum Proficiency</Label>
                </div>
                <div className="grid grid-cols-3 gap-4">
                   {["8-4-4", "CBC", "IGCSE"].map((curr) => (
                     <button
                       key={curr}
                       type="button"
                       onClick={() => toggleCurriculum(curr)}
                       className={cn(
                         "py-4 rounded-xl border-2 transition-all font-black text-[11px] uppercase tracking-tighter",
                         formData.curriculum.includes(curr) ? "border-teal-600 bg-teal-50 dark:bg-teal-900/10 text-teal-700" : "border-border bg-background"
                       )}
                     >
                       {curr}
                     </button>
                   ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-4">
                    <div className="flex items-center gap-2">
                       <Wallet className="h-4 w-4 text-teal-600" />
                       <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Hourly Rate (Ksh)</Label>
                    </div>
                    <Input 
                      required
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
                      required
                      placeholder="07XX XXX XXX"
                      className="h-16 rounded-2xl border-border bg-secondary/50 font-black px-6 focus-visible:ring-teal-600"
                      value={formData.mpesaNumber}
                      onChange={(e) => setFormData({ ...formData, mpesaNumber: e.target.value })}
                    />
                 </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                   <ShieldCheck className="h-4 w-4 text-teal-600" />
                   <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Professional Bio</Label>
                </div>
                <Textarea 
                  required
                  placeholder="Summarize your academic background and teaching style..." 
                  className="min-h-[150px] rounded-[2rem] border-border bg-secondary/50 font-bold p-8 focus-visible:ring-teal-600"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>

              <div className="pt-6">
                <Button 
                  disabled={loading}
                  className="w-full h-20 rounded-[2rem] bg-teal-600 hover:bg-teal-700 text-white font-black text-xs tracking-[0.3em] uppercase shadow-2xl shadow-teal-600/30 transition-all active:scale-95"
                >
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "FINALIZE EXPERT PROTOCOL"}
                </Button>
                <p className="text-center text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-6 opacity-60">
                   Note: High-fidelity verification will be required for session activation.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
