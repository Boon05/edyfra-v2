"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
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
  CreditCard,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const sidebarNavigation = [
  {
    section: "OVERVIEW",
    links: [
      { name: "Dashboard", href: "/institution/dashboard", icon: LayoutDashboard },
      { name: "Analytics", href: "/institution/dashboard/analytics", icon: BarChart3 },
      { name: "Announcements", href: "/institution/dashboard/announcements", icon: Megaphone, badge: 2 },
    ]
  },
  {
    section: "PEOPLE",
    links: [
      { name: "Students", href: "/institution/dashboard/students", icon: Users },
      { name: "Tutors", href: "/institution/dashboard/tutors", icon: GraduationCap },
    ]
  },
  {
    section: "CONTENT",
    links: [
      { name: "Resources", href: "/institution/dashboard/resources", icon: BookOpen },
      { name: "Sessions", href: "/institution/dashboard/sessions", icon: Video },
      { name: "Reports", href: "/institution/dashboard/reports", icon: FileText },
    ]
  },
  {
    section: "ACCOUNT",
    links: [
      { name: "Settings", href: "/institution/dashboard/settings", icon: Settings },
      { name: "Billing", href: "/institution/dashboard/billing", icon: CreditCard },
    ]
  }
];

function SidebarContent({ pathname, onClose }: { pathname: string; onClose?: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <Link href="/institution/dashboard" onClick={onClose} className="inline-block">
          <h1 className="text-xl font-bold tracking-tight text-white">Edyfra</h1>
          <p className="text-xs text-white/50 tracking-wider">Institution Portal</p>
        </Link>
      </div>

      <div className="px-4 space-y-6 mt-4 flex-1 overflow-y-auto">
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
                      onClick={onClose}
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
    </div>
  );
}

export default function InstitutionLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#111111] text-white font-sans overflow-hidden">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#1A1A1A] border-b border-white/10 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-xl hover:bg-white/5 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 text-white" />
          </button>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white">Edyfra</h1>
            <p className="text-[10px] text-white/50 tracking-wider">Institution Portal</p>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 260 }}
              className="fixed inset-y-0 left-0 w-[80vw] max-w-72 bg-[#1A1A1A] z-[70] shadow-2xl overflow-y-auto lg:hidden"
            >
              <div className="absolute top-4 right-4 z-50">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/5 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
              <SidebarContent pathname={pathname} onClose={() => setMobileMenuOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-[#1A1A1A] hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-40">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto lg:ml-64 pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
