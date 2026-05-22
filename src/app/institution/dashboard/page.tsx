"use client";

import { Download, Plus, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

const metrics = [
  { label: "Total Students", value: "1,284", change: "+48 this month", trend: "up" },
  { label: "Sessions This Week", value: "347", change: "+12% vs last week", trend: "up" },
  { label: "Avg. Engagement", value: "74%", change: "-3% vs last month", trend: "down" },
  { label: "Avg. Tutor Rating", value: "4.7", change: "Stable", trend: "neutral" },
];

const topStudents = [
  { initials: "AM", name: "Amina Mwangi", detail: "Year 2 · Mathematics", progress: 92, color: "bg-[#7C3AED]" },
  { initials: "BK", name: "Brian Kamau", detail: "Form 4 · Physics", progress: 87, color: "bg-[#10B981]" },
  { initials: "FK", name: "Faith Korir", detail: "Year 3 · Biology", progress: 75, color: "bg-[#3B82F6]" },
  { initials: "DO", name: "Dennis Otieno", detail: "Year 1 · Chemistry", progress: 68, color: "bg-[#F43F5E]" },
  { initials: "NW", name: "Naomi Wambui", detail: "Form 3 · English", progress: 41, color: "bg-[#F59E0B]" },
];

const subjectEngagement = [
  { subject: "Mathematics", percent: "88%" },
  { subject: "Physics", percent: "76%" },
  { subject: "Biology", percent: "71%" },
  { subject: "Chemistry", percent: "65%" },
  { subject: "English", percent: "58%" },
  { subject: "History", percent: "44%" },
  { subject: "Computer Sci.", percent: "39%" },
];

const recentActivity = [
  {
    content: "Amina Mwangi completed a Calculus session with Dr. Wanjiku",
    time: "2 minutes ago",
    dotColor: "bg-blue-500",
  },
  {
    content: "New study room opened — KCSE Physics Revision Group",
    time: "18 minutes ago",
    dotColor: "bg-emerald-500",
  },
  {
    content: "Brian Kamau submitted a past paper for review",
    time: "1 hour ago",
    dotColor: "bg-amber-500",
  },
  {
    content: "3 students flagged as low engagement this week",
    time: "3 hours ago",
    dotColor: "bg-red-500",
  },
  {
    content: "Mash AI handled 94 queries with no tutor escalation",
    time: "Today, 8:00 AM",
    dotColor: "bg-blue-500",
  },
];

const announcements = [
  {
    title: "Mid-semester reminder",
    content: "All Year 2 students are reminded to book revision sessions before the 30th. Slots are filling up fast.",
    meta: "Sent May 18 · 1,102 students reached",
  },
  {
    title: "New past papers uploaded",
    content: "2024 KCSE Chemistry and Biology papers are now available in the Resource Hub.",
    meta: "Sent May 15 · 847 students reached",
  },
];

export default function InstitutionDashboard() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 bg-[#111111] min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Overview — May 2026
        </h1>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="outline" size="sm" className="bg-transparent border-white/20 text-white hover:bg-white/10 text-xs sm:text-sm h-9 sm:h-10">
            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
            <span className="hidden sm:inline">Export Report</span>
            <span className="sm:hidden">Export</span>
          </Button>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm h-9 sm:h-10">
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
            <span className="hidden sm:inline">Announce</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <div key={i} className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5 space-y-4">
            <p className="text-sm font-medium text-white/50">{metric.label}</p>
            <p className="text-4xl font-bold text-white tracking-tight">{metric.value}</p>
            <div className="flex items-center gap-1.5 text-xs font-medium">
              {metric.trend === "up" && <TrendingUp className="h-3 w-3 text-emerald-500" />}
              {metric.trend === "down" && <TrendingDown className="h-3 w-3 text-red-500" />}
              {metric.trend === "neutral" && <Minus className="h-3 w-3 text-white/40" />}
              <span 
                className={
                  metric.trend === "up" ? "text-emerald-500" :
                  metric.trend === "down" ? "text-red-500" :
                  "text-white/40"
                }
              >
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Students */}
          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-white">Top Students by Activity</h3>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-white">This week</span>
                <span className="px-3 py-1 text-white/40 text-xs font-medium">All time</span>
              </div>
            </div>
            
            <div className="space-y-6">
              {topStudents.map((student, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                    <span className="text-black font-bold text-sm">{student.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{student.name}</p>
                    <p className="text-xs text-white/50 truncate">{student.detail}</p>
                  </div>
                  <div className="w-24 md:w-32 flex items-center gap-3">
                    <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${student.color}`} 
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-white/80 w-8">{student.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5">
            <h3 className="font-bold text-white mb-6">Recent Activity</h3>
            <div className="space-y-6">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex gap-4 relative">
                  {i !== recentActivity.length - 1 && (
                    <div className="absolute left-1.5 top-6 bottom-[-20px] w-px bg-white/10" />
                  )}
                  <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${activity.dotColor} shadow-[0_0_8px_rgba(0,0,0,0.5)]`} />
                  <div>
                    <p className="text-sm font-medium text-white/90">{activity.content}</p>
                    <p className="text-xs text-white/40 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Subject Engagement */}
          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5">
            <h3 className="font-bold text-white mb-6">Subject Engagement Breakdown</h3>
            <div className="space-y-4">
              {subjectEngagement.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white/80">{item.subject}</span>
                  <span className="text-sm font-bold text-white">{item.percent}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements Sent */}
          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5">
            <h3 className="font-bold text-white mb-6">Announcements Sent</h3>
            <div className="space-y-4">
              {announcements.map((ann, i) => (
                <div key={i} className="bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-4 space-y-3">
                  <h4 className="text-sm font-bold text-indigo-300">{ann.title}</h4>
                  <p className="text-sm text-indigo-100/70 leading-relaxed">{ann.content}</p>
                  <p className="text-xs text-indigo-400/60 font-medium">{ann.meta}</p>
                </div>
              ))}
              
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-sm font-medium text-white/60">Subscription</span>
                <span className="px-2 py-1 bg-white/10 rounded-md text-xs font-bold text-white flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Pro Plan · Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
