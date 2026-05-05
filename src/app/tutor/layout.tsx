"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { 
  LayoutDashboard, Users, GraduationCap, 
  Settings, LogOut, Zap, Calendar, Wallet
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

export default function TutorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkTutor();
  }, []);

  const checkTutor = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // Role check
    if (user.user_metadata?.role !== "TUTOR") {
      router.push("/dashboard");
      return;
    }

    setUser(user);
    setLoading(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const navItems = [
    { href: "/tutor", label: "Hub", icon: LayoutDashboard },
    { href: "/tutor/requests", label: "Requests", icon: Users },
    { href: "/tutor/sessions", label: "Sessions", icon: Zap },
    { href: "/tutor/schedule", label: "Schedule", icon: Calendar },
    { href: "/tutor/earnings", label: "Earnings", icon: Wallet },
    { href: "/tutor/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-background font-sans">
      {/* Premium Sidebar */}
      <aside className="w-72 bg-card border-r border-border flex flex-col fixed h-full z-50">
        <div className="p-8 border-b border-border/50">
          <Link href="/tutor" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
              <GraduationCap className="text-white h-6 w-6" />
            </div>
            <div className="flex flex-col">
               <span className="text-2xl font-black text-foreground tracking-tighter leading-none">Edyfra</span>
               <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">Tutor Hub</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300",
                pathname === item.href
                  ? "bg-primary text-white shadow-xl shadow-primary/10"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-border/50 space-y-6 bg-secondary/20">
          <div className="flex items-center justify-between px-2">
             <ThemeToggle />
             <button 
                onClick={() => supabase.auth.signOut().then(() => router.push("/login"))}
                className="p-3 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
             >
                <LogOut className="h-5 w-5" />
             </button>
          </div>
          
          <div className="p-4 rounded-[1.5rem] bg-card border border-border flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-black text-lg shadow-lg shadow-primary/20">
              {user?.email?.[0].toUpperCase() || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black truncate text-foreground uppercase tracking-tight">{user?.user_metadata?.name || "Tutor"}</p>
              <Badge className="bg-primary/10 text-primary border-none text-[8px] h-4 font-black uppercase tracking-widest mt-1">Verified Expert</Badge>
            </div>
          </div>
          <Link href="/dashboard" className="flex items-center gap-2 justify-center w-full py-3 rounded-xl bg-secondary text-muted-foreground text-[10px] font-black uppercase tracking-widest border border-border hover:bg-primary/5 hover:text-primary transition-all">
             <LayoutDashboard className="h-3.5 w-3.5" /> Student Dashboard
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-10 lg:p-16">
        <div className="max-w-6xl mx-auto">
           {children}
        </div>
      </main>
    </div>
  );
}
