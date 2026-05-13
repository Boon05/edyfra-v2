import { NextResponse } from "next/server";
import { StreamChat } from "stream-chat";
import { AIService } from "@/utils/ai-service";
import prisma from "@/lib/prisma";

const STREAM_KEY = process.env.NEXT_PUBLIC_STREAM_KEY!;
const STREAM_SECRET = process.env.STREAM_SECRET!;

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { type, message, cid } = payload;

    // 1. Only handle new messages
    if (type !== "message.new" || !message || !cid) {
      return NextResponse.json({ success: true, message: "Ignored event type" });
    }

    // 2. Prevent infinite loops (ignore messages sent by mash-ai)
    if (message.user.id === "mash-ai") {
      return NextResponse.json({ success: true, message: "Ignored AI's own message" });
    }

    // 3. Verify if this is an AI-tier session
    // We check if the channel ID starts with 'mash-' or if the session is marked as MASH in DB
    const channelId = cid.split(":")[1];
    
    // Quick check by ID prefix first
    if (!channelId.startsWith("mash-")) {
      return NextResponse.json({ success: true, message: "Not an AI session (prefix check)" });
    }

    // 4. Fetch session details for context (Subject/Topic)
    const session = await prisma.session.findFirst({
      where: { roomId: channelId, tier: "MASH" },
      select: { subject: true, topic: true, studentId: true }
    });

    if (!session) {
      return NextResponse.json({ success: true, message: "No active MASH session found for this room" });
    }

    // 5. Generate AI Response
    const systemPrompt = `
      You are Mash AI, a supportive and expert Kenyan tutor on the Edyfra platform.
      Session Context:
      - Subject: ${session.subject}
      - Topic: ${session.topic || "General"}
      
      Guidelines:
      - Be encouraging, professional, and clear.
      - Do NOT just give the final answer. Guide the student with questions and hints.
      - Use standard Kenyan English (professional tone).
      - If they ask something outside of ${session.subject}, gently remind them to stay on topic.
    `;

    const aiResponse = await AIService.generateCompletion(message.text, systemPrompt);

    // 6. Post response back to Stream
    const client = StreamChat.getInstance(STREAM_KEY, STREAM_SECRET);
    const channel = client.channel("messaging", channelId);

    await channel.sendMessage({
      text: aiResponse,
      user_id: "mash-ai",
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("[StreamWebhook] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
