import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AdminDashboardClient } from "./dashboard-client";
import { getAdminDashboardMetrics, getTutorApplications } from "@/app/actions/admin";
import prisma from "@/lib/prisma";
import { isFounderEmail } from "@/utils/admin-guard";
import { Role } from "@/generated/client";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // DEBUG: Print session email to console to verify what is being checked
  console.log("[ADMIN GUARD] Session email:", user?.email ?? "(no user)");
  console.log("[ADMIN GUARD] ADMIN_EMAIL_1:", process.env.ADMIN_EMAIL_1 ?? "(not set)");
  console.log("[ADMIN GUARD] ADMIN_EMAIL_2:", process.env.ADMIN_EMAIL_2 ?? "(not set)");

  if (!user) {
    console.log("[ADMIN GUARD] Blocked — no user session, redirecting to /dashboard");
    redirect("/dashboard");
  }

  // Check 1: email in founder env vars OR Prisma role is ADMIN
  const isFounder = isFounderEmail(user.email);
  
  const prismaUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  const isDbAdmin = prismaUser?.role === Role.ADMIN;

  console.log("[ADMIN GUARD] Session email:", user.email);
  console.log("[ADMIN GUARD] Is founder email:", isFounder);
  console.log("[ADMIN GUARD] Prisma role:", prismaUser?.role ?? "(not in DB)");

  if (!isFounder && !isDbAdmin) {
    console.log("[ADMIN GUARD] Blocked — not authorized, redirecting to /dashboard");
    redirect("/dashboard");
  }

  console.log("[ADMIN GUARD] Access granted for:", user.email);

  const metrics = await getAdminDashboardMetrics();
  const pendingApplications = await getTutorApplications();

  return (
    <AdminDashboardClient 
      stats={metrics.mainStats} 
      telemetry={metrics.telemetry}
      pendingApplications={pendingApplications} 
      recentUsers={metrics.recentUsers}
      systemLoad={metrics.systemLoad}
      completedSessions={metrics.completedSessions}
    />
  );
}
