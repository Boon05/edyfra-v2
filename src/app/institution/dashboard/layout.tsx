"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  BarChart3, 
  Megaphone, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Video, 
  FileText, 
  Settings, 
  CreditCard 
} from "lucide-react";

const sidebarNavigation = [
  {
    section: "OVERVIEW",
    links: [
      { name: "Dashboard", href: "/institution", icon: LayoutDashboard },
      { name: "Analytics", href: "/institution/analytics", icon: BarChart3 },
      { name: "Announcements", href: "/institution/announcements", icon: Megaphone, badge: 2 },
    ]
  },
  {
    section: "PEOPLE",
    links: [
      { name: "Students", href: "/institution/students", icon: Users },
      { name: "Tutors", href: "/institution/tutors", icon: GraduationCap },
    ]
  },
  {
    section: "CONTENT",
    links: [
      { name: "Resources", href: "/institution/resources", icon: BookOpen },
      { name: "Sessions", href: "/institution/sessions", icon: Video },
      { name: "Reports", href: "/institution/reports", icon: FileText },
    ]
  },
  {
    section: "ACCOUNT",
    links: [
      { name: "Settings", href: "/institution/settings", icon: Settings },
      { name: "Billing", href: "/institution/billing", icon: CreditCard },
    ]
  }
];

export default function InstitutionLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[#111111] text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 flex flex-col justify-between bg-[#1A1A1A]">
        <div>
          {/* Logo Area */}
          <div className="p-6">
            <Link href="/" className="inline-block">
              <h1 className="text-xl font-bold tracking-tight text-white">Edyfra</h1>
              <p className="text-xs text-white/50 tracking-wider">Institution Portal</p>
            </Link>
          </div>

          {/* Navigation Sections */}
          <div className="px-4 space-y-6 mt-4">
            {sidebarNavigation.map((group) => (
              <div key={group.section}>
                <h2 className="text-[10px] font-bold text-white/40 tracking-widest px-4 mb-3">
                  {group.section}
                </h2>
                <ul className="space-y-1">
                  {group.links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <li key={link.name}>
                        <Link 
                          href={link.href}
                          className={cn(
                            "flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                            isActive 
                              ? "bg-white text-black" 
                              : "text-white/60 hover:text-white hover:bg-white/5"
                          )}
                        >
                          <link.icon className="h-4 w-4" />
                          <span className="flex-1">{link.name}</span>
                          {link.badge && (
                            <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {link.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Profile Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
              <span className="text-black font-bold text-sm">KU</span>
            </div>
            <div>
              <p className="text-sm font-bold text-white">Kenyatta Univ.</p>
              <p className="text-xs text-white/50">Pro Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
