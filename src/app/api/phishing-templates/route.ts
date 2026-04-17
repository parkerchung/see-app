import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-check";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const templates = await prisma.phishingTemplate.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      builtIn: true,
      thumbnail: true,
      createdAt: true,
    },
  });

  return NextResponse.json(templates);
}
