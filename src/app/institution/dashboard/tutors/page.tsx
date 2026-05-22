"use client";

import { useState } from "react";
import { Search, Plus, CheckCircle2, ShieldCheck, GraduationCap, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const mockInstitutionTutors = [
  { id: 1, name: "Dr. Sarah Wanjiku", subject: "Calculus & Advanced Math", rating: 4.9, students: 142, status: "Active" },
  { id: 2, name: "Mr. David Ochieng", subject: "Physics & Mechanics", rating: 4.8, students: 89, status: "Active" },
  { id: 3, name: "Ms. Faith Mutua", subject: "Chemistry", rating: 4.7, students: 110, status: "Active" },
];

const mockGlobalTutors = [
  { id: 4, name: "Prof. John Kariuki", subject: "Computer Science", rating: 5.0, verified: true },
  { id: 5, name: "Dr. Alice Njoroge", subject: "Biology", rating: 4.8, verified: true },
  { id: 6, name: "Mr. Kevin Kiprono", subject: "History", rating: 4.6, verified: false },
];

export default function InstitutionTutors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roster, setRoster] = useState(mockInstitutionTutors);

  const handleAddTutor = (tutor: any) => {
    toast.success(`Added ${tutor.name} to institution roster!`);
  };

  const handleRemoveTutor = (name: string) => {
    toast.error(`Removed ${name} from roster.`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 bg-[#111111] min-h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Institution Tutor Roster
          </h1>
          <p className="text-white/50 text-xs sm:text-sm mt-1">Select and approve specific Edyfra tutors for your students.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm h-9 sm:h-10">
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
            <span className="hidden sm:inline">Invite External Tutor</span>
            <span className="sm:hidden">Invite</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Roster */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <h2 className="text-lg font-bold text-white">Approved Roster</h2>
          </div>
          <p className="text-sm text-white/50">
            These tutors are prioritized in your students' dashboards and bypass general search algorithms.
          </p>

          <div className="space-y-4">
            {roster.map((tutor) => (
              <div key={tutor.id} className="bg-[#1A1A1A] rounded-2xl p-5 border border-emerald-500/20 relative group">
                <div className="absolute top-5 right-5">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleRemoveTutor(tutor.name)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <GraduationCap className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base">{tutor.name}</h3>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    </div>
                    <p className="text-sm text-white/60">{tutor.subject}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs font-medium">
                      <span className="flex items-center gap-1 text-yellow-500">
                        <Star className="h-3 w-3 fill-current" /> {tutor.rating}
                      </span>
                      <span className="text-white/40">{tutor.students} Linked Students</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search Global Tutors */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-white">Discover & Add Tutors</h2>
          <p className="text-sm text-white/50">
            Search Edyfra's global network to add specialized tutors to your roster.
          </p>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by subject, name, or expertise..." 
              className="pl-12 h-14 bg-white/5 border-white/10 text-white focus-visible:ring-indigo-500 w-full rounded-xl"
            />
          </div>

          <div className="space-y-4">
            {mockGlobalTutors.map((tutor) => (
              <div key={tutor.id} className="bg-[#1A1A1A] rounded-2xl p-5 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <span className="text-white font-bold">{tutor.name.charAt(tutor.name.indexOf(" ") + 1)}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-sm">{tutor.name}</h3>
                      {tutor.verified && <ShieldCheck className="h-3 w-3 text-blue-400" />}
                    </div>
                    <p className="text-xs text-white/60">{tutor.subject} • {tutor.rating} Rating</p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleAddTutor(tutor)}
                  variant="secondary" 
                  size="sm" 
                  className="bg-white/10 hover:bg-white/20 text-white"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
