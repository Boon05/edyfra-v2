"use server";

import { Role, EduLevel, Tier, VerifPath } from "@prisma/client";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { sendWelcomeEmail } from "@/lib/email";

interface OnboardingData {
  role: string;
  educationLevel: string;
  curriculum?: string;
  formYear: string;
  county: string;
  subjects: string[];
  weakTopics: string[];
  studyStyle: string;
  bio?: string;
  verificationPath?: string;
  hourlyRate?: string;
  mpesaNumber?: string;
}

export async function completeOnboarding(data: OnboardingData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { 
    role, educationLevel, curriculum, formYear, 
    county, subjects, weakTopics, studyStyle, 
    bio, verificationPath, hourlyRate, mpesaNumber 
  } = data;
  
  const isTutor = role === "TUTOR";
  const isHS = educationLevel === "HIGH_SCHOOL";
  const prismaRole = isTutor ? Role.TUTOR : Role.STUDENT;

  // 1. Update Supabase Auth Metadata
  await supabase.auth.updateUser({
    data: { 
      role: isTutor ? "TUTOR" : "STUDENT", 
      onboarding_completed: true,
    }
  });

  // 2. EXPLICIT SYNC WITH HEALING (ID or Email)
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { id: user.id },
        { email: user.email! }
      ]
    }
  });

  const baseData = {
    email: user.email!,
    name: user.user_metadata.name || user.user_metadata.full_name || "New User",
    role: prismaRole,
    educationLevel: isHS ? EduLevel.HIGH_SCHOOL : EduLevel.UNIVERSITY,
    curriculum: curriculum || "8-4-4",
    formYear: parseInt(formYear) || null,
    county: county || "Nairobi",
    isUnder18: isHS,
    bio: bio || "",
  };

  if (existingUser) {
    // CRITICAL: DO NOT update 'id' in data block
    await prisma.user.update({
      where: { id: existingUser.id },
      data: baseData
    });
  } else {
    await prisma.user.create({
      data: {
        ...baseData,
        id: user.id, // Only set ID on creation
        tier: Tier.BRONZE,
      }
    });
  }

  // 3. Create Student Profile
  await prisma.studentProfile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      subjects: subjects || [],
      weakTopics: weakTopics || [],
      studyStyle: studyStyle || "solo",
      preferredTimes: {},
      goals: []
    },
    update: {
      subjects: subjects || [],
      weakTopics: weakTopics || [],
      studyStyle: studyStyle || "solo",
    }
  });

  // 4. If TUTOR, Create Tutor Profile
  if (isTutor) {
    await prisma.tutorProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        subjects: subjects || [],
        levelsTaught: [educationLevel],
        verificationPath: verificationPath === "GRADES" ? VerifPath.GRADES : VerifPath.POINTS,
        hourlyRate: parseInt(hourlyRate || "500"),
        bio: bio || "Professional Academic Mentor",
        mpesaNumber: mpesaNumber || "",
        isVerified: true,
        availability: { isOnline: false }
      },
      update: {
        subjects: subjects || [],
        bio: bio || "Professional Academic Mentor",
        hourlyRate: parseInt(hourlyRate || "500"),
        mpesaNumber: mpesaNumber || "",
        isVerified: true
      }
    });
  }

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/tutor");

  // 5. Send Welcome Email
  try {
    await sendWelcomeEmail(user.email!, user.user_metadata.name || "Scholar");
  } catch (e) {
    console.error("Welcome email failed:", e);
  }

  return { success: true };
}
