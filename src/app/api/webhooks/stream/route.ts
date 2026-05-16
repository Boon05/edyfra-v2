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

    // Only handle new messages
    if (type !== "message.new" || !message || !cid) {
      return NextResponse.json({ success: true, message: "Ignored event type" });
    }

    // Prevent infinite loops (ignore messages sent by mash-ai)
    if (message.user.id === "mash-ai") {
      return NextResponse.json({ success: true, message: "Ignored AI's own message" });
    }

    // Channel ID = session UUID (matches the DB session id)
    const channelId = cid.split(":")[1];

    // Fetch session — Stream channel ID is the session UUID
    const session = await prisma.session.findUnique({
      where: { id: channelId },
      select: { id: true, tier: true, subject: true, topic: true, studentId: true, partnerId: true }
    });

    if (!session) {
      return NextResponse.json({ success: true, message: "No session found for this channel" });
    }

    // Determine if AI should respond
    let prompt = message.text || "";
    let shouldRespond = false;

    if (session.tier === "MASH") {
      // AI-only session — auto-respond to every student message
      shouldRespond = true;
    } else {
      // Human session — only respond when @mentioned
      const mentionPattern = /@(?:Mash|AI|mash|ai|mash-ai)\b/;
      const mention = prompt.match(mentionPattern);
      if (mention) {
        shouldRespond = true;
        prompt = prompt.replace(mentionPattern, "").trim();
      }
    }

    if (!shouldRespond || !prompt) {
      return NextResponse.json({ success: true, message: "Skipped — no AI trigger" });
    }

    // Generate AI Response
    const systemPrompt = `
      You are Mash AI, a supportive and expert Kenyan tutor on the Edyfra platform.
      Session Context:
      - Subject: ${session.subject}
      - Topic: ${session.topic || "General"}
      - Session Type: ${session.tier === "MASH" ? "One-on-one AI tutoring" : "Study group with human participants"}

      Guidelines:
      - Be encouraging, professional, and clear.
      - Do NOT just give the final answer. Guide the student with questions and hints.
      - Use standard Kenyan English (professional tone).
      - If they ask something outside of ${session.subject}, gently remind them to stay on topic.
    `;

    const aiResponse = await AIService.generateCompletion(prompt, systemPrompt);

    // Ensure mash-ai user exists in Stream, then post response
    const client = StreamChat.getInstance(STREAM_KEY, STREAM_SECRET);
    await client.upsertUser({ id: "mash-ai", name: "Mash AI", role: "user" });

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
