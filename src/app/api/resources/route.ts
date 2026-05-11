import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const subject = searchParams.get("subject") || "";
    const level = searchParams.get("level") || "";
    const type = searchParams.get("type") || "";
    const topic = searchParams.get("topic") || "";
    const price = searchParams.get("price") || ""; // free or paid
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      status: "approved",
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (subject) {
      where.subject = { contains: subject, mode: "insensitive" };
    }

    if (level) {
      where.educationLevel = level;
    }

    if (type) {
      where.resourceType = type;
    }

    if (topic) {
      where.topic = { contains: topic, mode: "insensitive" };
    }

    if (price) {
      if (price === "free") {
        where.price = 0;
      } else if (price === "paid") {
        where.price = { gt: 0 };
      }
    }

    const [resources, total] = await Promise.all([
      prisma.resource.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          seller: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.resource.count({ where }),
    ]);

    return NextResponse.json({
      resources,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("[Resources API] Error:", error.message);
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // This endpoint is for creating a resource via API (alternative to direct upload)
  // But we'll keep the upload client-side to Supabase Storage for simplicity
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}