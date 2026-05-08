"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getGroups() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const groups = await prisma.struggleGroup.findMany({
    where: {
      members: { has: user.id }
    },
    include: {
      groupMessages: {
        take: 1,
        orderBy: { createdAt: 'desc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return groups;
}

export async function getGroupById(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const group = await prisma.struggleGroup.findUnique({
    where: { id },
    include: {
      groupMessages: {
        include: { sender: { select: { name: true, avatar: true } } },
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  if (!group) throw new Error("Group not found");

  return group;
}

export async function createGroup(data: {
  name: string;
  subject: string;
  topic: string;
  level: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const userData = await prisma.user.findUnique({
    where: { id: user.id }
  });

  if (!userData) throw new Error("User not found");

  const group = await prisma.struggleGroup.create({
    data: {
      name: data.name,
      subject: data.subject,
      topic: data.topic,
      level: data.level as any,
      members: [user.id]
    }
  });

  revalidatePath("/dashboard/groups");
  return { success: true, group };
}

export async function joinGroup(groupId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await prisma.struggleGroup.update({
    where: { id: groupId },
    data: {
      members: { push: user.id }
    }
  });

  revalidatePath("/dashboard/groups");
  return { success: true };
}

export async function sendGroupMessage(groupId: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const group = await prisma.struggleGroup.findUnique({
    where: { id: groupId }
  });

  if (!group) throw new Error("Group not found");

  const message = await prisma.groupMessage.create({
    data: {
      groupId,
      senderId: user.id,
      content
    }
  });

  revalidatePath(`/dashboard/groups/${groupId}`);
  return { success: true, message };
}

export async function findAvailableGroups(subject?: string, topic?: string) {
  const groups = await prisma.struggleGroup.findMany({
    where: {
      status: "ACTIVE",
      ...(subject && { subject })
    },
    orderBy: { createdAt: 'desc' }
  });

  return groups;
}