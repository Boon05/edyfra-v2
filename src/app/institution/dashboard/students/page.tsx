"use client";

import { useState } from "react";
import { UploadCloud, FileSpreadsheet, Download, Search, MoreHorizontal, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function InstitutionStudents() {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    toast.success("File dropped successfully! Processing data...");
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      toast.success("File selected! Processing data...");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 bg-[#111111] min-h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Student Management
          </h1>
          <p className="text-white/50 text-xs sm:text-sm mt-1">Manage your institution's roster and synchronize data.</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="outline" size="sm" className="bg-transparent border-white/20 text-white hover:bg-white/10 text-xs sm:text-sm h-9 sm:h-10">
            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
            <span className="hidden sm:inline">Template</span>
            <span className="sm:hidden">CSV</span>
          </Button>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm h-9 sm:h-10">
            <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
            <span className="hidden sm:inline">Add Student</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bulk Upload Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5 shadow-xl">
            <h3 className="font-bold text-white mb-2">Bulk Onboarding</h3>
            <p className="text-sm text-white/50 mb-6">
              Upload your student roster via Excel/CSV or sync directly from Zeraki to quickly grant access to Edyfra.
            </p>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                isDragging ? "border-indigo-500 bg-indigo-500/10" : "border-white/10 hover:border-white/20 hover:bg-white/5"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <UploadCloud className="h-6 w-6 text-white/60" />
              </div>
              <p className="text-sm font-medium text-white mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-white/40 mb-4">Excel, CSV, or Zeraki export (.xlsx, .csv)</p>
              
              <input 
                type="file" 
                id="file-upload" 
                className="hidden" 
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleFileInput}
              />
              <label htmlFor="file-upload">
                <Button type="button" variant="secondary" className="bg-white/10 text-white hover:bg-white/20 cursor-pointer" onClick={() => document.getElementById('file-upload')?.click()}>
                  Browse Files
                </Button>
              </label>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
              <FileSpreadsheet className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-blue-300">Zeraki Integration</p>
                <p className="text-xs text-blue-200/70 mt-1">
                  You can upload the raw student export file from Zeraki directly. We will automatically parse the classes and details.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Student Roster Table */}
        <div className="lg:col-span-2">
          <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="font-bold text-white">Current Roster (1,284)</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input 
                  placeholder="Search students..." 
                  className="pl-9 bg-white/5 border-white/10 text-white focus-visible:ring-indigo-500 w-full sm:w-64"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 text-white/50 text-xs uppercase tracking-wider">
                    <th className="p-4 font-medium">Student Name</th>
                    <th className="p-4 font-medium">Class/Year</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Last Active</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {[
                    { name: "Amina Mwangi", email: "amina.m@school.edu", class: "Year 2", status: "Active", active: "2 mins ago" },
                    { name: "Brian Kamau", email: "brian.k@school.edu", class: "Form 4", status: "Active", active: "1 hour ago" },
                    { name: "Faith Korir", email: "faith.k@school.edu", class: "Year 3", status: "Inactive", active: "5 days ago" },
                    { name: "Dennis Otieno", email: "dennis.o@school.edu", class: "Year 1", status: "Active", active: "Yesterday" },
                    { name: "Naomi Wambui", email: "naomi.w@school.edu", class: "Form 3", status: "Pending", active: "Never" },
                  ].map((student, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-white">{student.name}</p>
                        <p className="text-xs text-white/50">{student.email}</p>
                      </td>
                      <td className="p-4 text-white/80">{student.class}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          student.status === "Active" ? "bg-emerald-500/20 text-emerald-400" :
                          student.status === "Pending" ? "bg-amber-500/20 text-amber-400" :
                          "bg-red-500/20 text-red-400"
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="p-4 text-white/60 text-xs">{student.active}</td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="icon" className="text-white/40 hover:text-white hover:bg-white/10">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
