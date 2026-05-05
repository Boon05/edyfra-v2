import { AIService } from "@/utils/ai-service";
import { PrismaClient, Role } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { sessionId, message, subject, topic } = await req.json();

    // 1. Check for Dynamic API Key from Admin Settings
    const adminUser = await prisma.user.findFirst({
      where: { role: Role.ADMIN },
      select: { settings: true }
    });

    const dynamicSettings = adminUser?.settings as any;
    const googleAiKey = dynamicSettings?.googleAiKey || process.env.GOOGLE_AI_KEY;

    if (!googleAiKey) {
      return NextResponse.json({ error: "AI key not configured" }, { status: 500 });
    }
    
    const ai = new AIService({
      provider: "google",
      apiKey: googleAiKey, // Assuming AIService supports apiKey override
      systemPrompt: `You are Mash AI, a friendly and expert Kenyan tutor on the Edyfra platform. 
          You are helping a student with ${subject}${topic ? ` - Topic: ${topic}` : ""}. 
          Be encouraging, clear, and use Kenyan context/examples where appropriate. 
          Keep your responses concise and helpful.`,
    });

    const aiMessage = await ai.generateResponse(message);

    await prisma.message.create({
      data: {
        sessionId,
        content: aiMessage,
        isMash: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "AI failed" }, { status: 500 });
  }
}
