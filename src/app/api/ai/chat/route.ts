import { AIService } from "@/utils/ai-service";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { StreamChat } from "stream-chat";

const STREAM_KEY = process.env.NEXT_PUBLIC_STREAM_KEY!;
const STREAM_SECRET = process.env.STREAM_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, subject, topic, userId } = body;

    let messageText = "";
    if (typeof body.message === 'string') {
      messageText = body.message;
    } else if (body.message && typeof body.message === 'object') {
      messageText = body.message.text || body.message.content || JSON.stringify(body.message);
    } else {
      messageText = String(body.message || '');
    }

    // Dynamic API Key from Admin Settings
    const adminUser = await prisma.user.findFirst({
      where: { role: Role.ADMIN },
      select: { settings: true }
    });

    const settings = adminUser?.settings as Record<string, unknown> | undefined;
    const googleAiKey = (settings?.googleAiKey as string | undefined) || process.env.GOOGLE_AI_KEY;

    if (!googleAiKey) {
      console.error("AI Error: Google AI Key is missing");
      return NextResponse.json({ error: "AI key not configured." }, { status: 500 });
    }

    // Get session context for AI
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: { subject: true, topic: true },
    });

    const aiSubject = subject || session?.subject || "general";
    const aiTopic = topic || session?.topic || undefined;

    const ai = new AIService({
      provider: "google",
      apiKey: googleAiKey,
      systemPrompt: `You are Mash AI, a friendly and expert Kenyan tutor on the Edyfra platform. 
          You are helping a student with ${aiSubject}${aiTopic ? ` - Topic: ${aiTopic}` : ""}. 
          Be encouraging, clear, and use Kenyan context/examples where appropriate. 
          Focus on providing scholarly, accurate, and high-performance guidance.
          Keep your responses concise and helpful.`,
    });

    const aiMessage = await ai.generateResponse(messageText);

    // Save to Prisma for history
    await prisma.message.create({
      data: {
        sessionId,
        content: aiMessage,
        isMash: true,
      },
    });

    // Post AI message to Stream Chat channel
    try {
      const streamClient = StreamChat.getInstance(STREAM_KEY, STREAM_SECRET);
      await streamClient.upsertUser({
        id: "mash-ai",
        name: "Mash AI",
      });
      const channel = streamClient.channel("messaging", sessionId);
      await channel.sendMessage({
        text: aiMessage,
        user_id: "mash-ai",
      });
    } catch (streamErr) {
      console.error("Failed to post AI message to Stream:", streamErr);
    }

    // Notify Online Tutors
    try {
      const onlineTutors = await prisma.tutorProfile.findMany({
        where: { availability: { path: ["isOnline"], equals: true } },
        select: { userId: true }
      });

      if (onlineTutors.length > 0) {
        await prisma.notification.createMany({
          data: onlineTutors.map(t => ({
            userId: t.userId,
            type: "MATCH_FOUND",
            title: "Expert Needed!",
            body: `Mash AI is assisting a student with ${aiSubject}. Join now to provide human expertise!`,
            actionUrl: `/study-room/${sessionId}`,
          }))
        });
      }
    } catch (notifyError) {
      console.error("Failed to notify tutors:", notifyError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "AI failed" }, { status: 500 });
  }
}
