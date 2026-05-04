"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, BookOpen, Loader2, Save,
  AlertCircle, Sparkles, Wallet, Phone
} from "lucide-react";
import { getUserData, updateProfile } from "@/app/actions/user";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function TutorSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    subjects: "",
    hourlyRate: "",
    mpesaNumber: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const user = await getUserData();
    if (user && user.tutorProfile) {
      setFormData({
        name: user.name || "",
        bio: user.tutorProfile.bio || "",
        subjects: user.tutorProfile.subjects.join(", "),
        hourlyRate: user.tutorProfile.hourlyRate.toString(),
        mpesaNumber: user.tutorProfile.mpesaNumber || "",
      });
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await updateProfile({
        name: formData.name,
        bio: formData.bio,
        subjects: formData.subjects.split(",").map(s => s.trim()).filter(Boolean),
        hourlyRate: parseInt(formData.hourlyRate),
        mpesaNumber: formData.mpesaNumber,
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[600px]">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700 font-sans pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black tracking-tightest">Settings.</h1>
          <p className="text-muted-foreground text-lg font-medium">Manage your public profile and teaching preferences.</p>
        </div>
        <Badge className="bg-primary/10 text-primary border-none px-5 py-2 font-black uppercase tracking-[0.2em] text-[10px] rounded-full">
           Verified Expert
        </Badge>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <Card className="border-border bg-card/50 rounded-[3rem] overflow-hidden group">
          <CardHeader className="p-10 border-b border-border">
             <CardTitle className="text-2xl font-black tracking-tightest flex items-center gap-3">
                <User className="h-6 w-6 text-primary" /> Basic Info
             </CardTitle>
          </CardHeader>
          <CardContent className="p-10 space-y-8">
             <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Display Name</Label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="h-16 rounded-2xl border-border bg-secondary/50 font-bold px-6 focus-visible:ring-primary" 
                />
             </div>
             <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Teaching Bio</Label>
                <Textarea 
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="min-h-[150px] rounded-[2rem] border-border bg-secondary/50 font-bold p-6 focus-visible:ring-primary" 
                  placeholder="Share your teaching philosophy..."
                />
             </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/50 rounded-[3rem] overflow-hidden group">
          <CardHeader className="p-10 border-b border-border">
             <CardTitle className="text-2xl font-black tracking-tightest flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-primary" /> Expertise & Rates
             </CardTitle>
          </CardHeader>
          <CardContent className="p-10 space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                   <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Subjects (comma separated)</Label>
                   <Input 
                     value={formData.subjects}
                     onChange={(e) => setFormData({...formData, subjects: e.target.value})}
                     className="h-16 rounded-2xl border-border bg-secondary/50 font-bold px-6 focus-visible:ring-primary" 
                   />
                </div>
                <div className="space-y-3">
                   <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Hourly Rate (Ksh)</Label>
                   <Input 
                     type="number"
                     value={formData.hourlyRate}
                     onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                     className="h-16 rounded-2xl border-border bg-secondary/50 font-bold px-6 focus-visible:ring-primary" 
                   />
                </div>
             </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/50 rounded-[3rem] overflow-hidden group">
          <CardHeader className="p-10 border-b border-border">
             <CardTitle className="text-2xl font-black tracking-tightest flex items-center gap-3">
                <Wallet className="h-6 w-6 text-primary" /> Withdrawal Account
             </CardTitle>
          </CardHeader>
          <CardContent className="p-10 space-y-8">
             <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">M-Pesa Number</Label>
                <div className="relative group">
                   <Phone className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-all" />
                   <Input 
                     value={formData.mpesaNumber}
                     onChange={(e) => setFormData({...formData, mpesaNumber: e.target.value})}
                     placeholder="07XX XXX XXX"
                     className="h-16 rounded-2xl border-border bg-secondary/50 font-bold pl-14 pr-6 focus-visible:ring-primary" 
                   />
                </div>
                <p className="text-[10px] font-bold text-muted-foreground ml-4 italic">Earnings will be sent to this number upon withdrawal request.</p>
             </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
           <Button 
             type="submit"
             disabled={saving}
             className="h-16 px-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-xs tracking-widest uppercase shadow-xl shadow-primary/20 transition-all active:scale-95"
           >
              {saving ? <Loader2 className="h-5 w-5 animate-spin mr-3" /> : <Save className="h-5 w-5 mr-3" />}
              Save Changes
           </Button>
        </div>
      </form>
    </div>
  );
}
