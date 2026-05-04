"use server";

import prisma from "@/lib/prisma";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createMatchRequest(data: { subject: string; topic: string }) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {}
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Create the request in Prisma
  const matchRequest = await prisma.matchRequest.create({
    data: {
      studentId: user.id,
      subject: data.subject,
      topic: data.topic,
    },
  });

  revalidatePath("/tutor/requests");
  return { success: true, matchRequestId: matchRequest.id };
}

export async function acceptMatchRequest(requestId: string) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {}
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const matchRequest = await prisma.matchRequest.findUnique({
    where: { id: requestId },
  });

  if (!matchRequest || matchRequest.sessionId) {
    throw new Error("Request already matched or not found");
  }

  const userData = await prisma.user.findUnique({ 
    where: { id: user.id },
    include: { tutorProfile: true }
  });
  
  const tier = userData?.role === "TUTOR" ? "TUTOR" : "PEER";

  // Create the session with a UNIQUE room ID
  const roomId = `room-${requestId}-${Math.random().toString(36).substring(2, 7)}`;
  const session = await prisma.session.create({
    data: {
      studentId: matchRequest.studentId,
      partnerId: user.id,
      tier: tier === "TUTOR" ? "TUTOR" : "PEER",
      subject: matchRequest.subject,
      topic: matchRequest.topic,
      status: "ACTIVE",
      roomId: roomId,
      startedAt: new Date(),
    },
  });

  // Update the request
  await prisma.matchRequest.update({
    where: { id: requestId },
    data: {
      sessionId: session.id,
      resolvedAs: tier === "TUTOR" ? "TUTOR" : "PEER",
      resolvedAt: new Date(),
    }
  });

  // Notify the student
  try {
    await prisma.notification.create({
      data: {
        userId: matchRequest.studentId,
        type: "MATCH_FOUND",
        title: "Expert Connected!",
        body: `${userData?.name || 'An expert'} has accepted your request. Entering room...`,
        actionUrl: `/study-room/${session.id}`,
      }
    });
  } catch (e) {
    console.error("Failed to notify student:", e);
  }

  revalidatePath("/tutor/requests");
  revalidatePath("/dashboard/study");
  revalidatePath("/dashboard/sessions");
  
  return { success: true, sessionId: session.id };
}

export async function forceAIFallback(requestId: string) {
  const matchRequest = await prisma.matchRequest.findUnique({
    where: { id: requestId },
  });

  if (!matchRequest || matchRequest.sessionId) {
    return { success: false, message: "Already matched or not found" };
  }

  // Create the AI session
  const session = await prisma.session.create({
    data: {
      studentId: matchRequest.studentId,
      partnerId: null, // AI
      tier: "MASH",
      subject: matchRequest.subject,
      topic: matchRequest.topic,
      status: "ACTIVE",
      roomId: `ai-room-${requestId}`,
      startedAt: new Date(),
    },
  });

  // Update the request
  await prisma.matchRequest.update({
    where: { id: requestId },
    data: {
      sessionId: session.id,
      resolvedAs: "MASH",
      resolvedAt: new Date(),
    }
  });

  return { success: true, sessionId: session.id };
}

export async function sweepUnmatchedRequests() {
  try {
    // Find requests older than 1 minute that haven't been resolved
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    
    const unmatchedRequests = await prisma.matchRequest.findMany({
      where: {
        sessionId: null,
        createdAt: { lt: oneMinuteAgo }
      }
    });

    for (const request of unmatchedRequests) {
      console.log(`Auto-matching stale request ${request.id} with AI`);
      await forceAIFallback(request.id);
    }

    return { success: true, swept: unmatchedRequests.length };
  } catch (error) {
    console.error("Error sweeping unmatched requests:", error);
    return { success: false };
  }
}
