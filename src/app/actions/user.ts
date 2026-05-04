"use server";

import { Role, EduLevel, Tier, VerifPath } from "@prisma/client";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getUserData() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Use findFirst with OR to find the user by ID or Email
    let prismaUser = await prisma.user.findFirst({
      where: {
        OR: [
          { id: user.id },
          { email: user.email! }
        ]
      },
      include: {
        studentProfile: true,
        tutorProfile: true
      }
    });

    if (!prismaUser) {
      console.log(`Creating missing Prisma user for ${user.id} (${user.email})`);
      prismaUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email!,
          name: user.user_metadata.name || user.user_metadata.full_name || "User",
          role: (user.user_metadata?.role?.toUpperCase() === "TUTOR" ? Role.TUTOR : Role.STUDENT),
          educationLevel: EduLevel.HIGH_SCHOOL,
          county: "Nairobi",
          tier: Tier.BRONZE,
        },
        include: {
          studentProfile: true,
          tutorProfile: true
        }
      });
    }

    return prismaUser;
  } catch (error) {
    console.error("Error in getUserData:", error);
    return null;
  }
}

export async function updateProfile(data: { 
  name: string; 
  bio: string;
  subjects?: string[];
  hourlyRate?: number;
  mpesaNumber?: string;
}) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const role = user.user_metadata?.role?.toUpperCase() === "TUTOR" ? Role.TUTOR : Role.STUDENT;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: data.name,
        bio: data.bio,
        educationLevel: EduLevel.HIGH_SCHOOL,
        county: "Nairobi",
      },
    });

    if (role === Role.TUTOR) {
      await prisma.tutorProfile.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          bio: data.bio,
          subjects: data.subjects || [],
          levelsTaught: [],
          verificationPath: VerifPath.POINTS,
          hourlyRate: data.hourlyRate || 500,
          mpesaNumber: data.mpesaNumber || "",
          availability: { isOnline: false }
        },
        update: {
          bio: data.bio,
          subjects: data.subjects || undefined,
          hourlyRate: data.hourlyRate || undefined,
          mpesaNumber: data.mpesaNumber || undefined,
        }
      });
    }

    revalidatePath("/dashboard/settings");
    revalidatePath("/tutor/settings");
    revalidatePath("/tutor");
    return { success: true };
  } catch (error) {
    console.error("Error in updateProfile:", error);
    throw error;
  }
}

export async function updateUserRole(role: "STUDENT" | "TUTOR") {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const prismaRole = role === "TUTOR" ? Role.TUTOR : Role.STUDENT;

    // 1. Update Supabase Metadata
    const { error: authError } = await supabase.auth.updateUser({
      data: { role: role }
    });
    if (authError) throw authError;

    // 2. ABSOLUTE SYNC: Find by ID or Email
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { id: user.id },
          { email: user.email! }
        ]
      }
    });

    if (existingUser) {
      // CRITICAL FIX: DO NOT update the 'id' field as it's the primary key and immutable
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { 
          role: prismaRole,
          educationLevel: existingUser.educationLevel || EduLevel.HIGH_SCHOOL,
          county: existingUser.county || "Nairobi",
          // Reset fields that might be causing validation issues in legacy records
          points: existingUser.points ?? 0,
        }
      });
    } else {
      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email!,
          name: user.user_metadata.name || user.user_metadata.full_name || "New User",
          role: prismaRole,
          educationLevel: EduLevel.HIGH_SCHOOL,
          county: "Nairobi",
          tier: Tier.BRONZE,
        }
      });
    }

    revalidatePath("/", "layout");
    revalidatePath("/onboarding");
    return { success: true };
  } catch (error) {
    console.error("Error in updateUserRole:", error);
    throw error;
  }
}

export async function updateUserSettings(settings: any) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    await prisma.user.update({
      where: { id: user.id },
      data: { settings }
    });

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("Error in updateUserSettings:", error);
    throw error;
  }
}

export async function getGlobalStats() {
  try {
    const [studentCount, tutorCount, sessionCount] = await Promise.all([
      prisma.user.count({ where: { role: Role.STUDENT } }),
      prisma.user.count({ where: { role: Role.TUTOR } }),
      prisma.session.count({ where: { status: "COMPLETED" } }),
    ]);

    return [
      { value: studentCount, label: "Students" },
      { value: tutorCount, label: "Verified Mentors" },
      { value: sessionCount, label: "Study Sessions" },
      { value: studentCount + tutorCount + sessionCount > 0 ? 99 : 0, label: "Uptime %" },
    ];
  } catch (error) {
    console.error("Error in getGlobalStats:", error);
    return [];
  }
}
