import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-check";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const templates = await prisma.educationTemplate.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, createdAt: true, updatedAt: true },
  });

  return NextResponse.json(templates);
}

export async function POST(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const { name, htmlBody } = await request.json();
  if (!name || !htmlBody) {
    return NextResponse.json({ error: "缺少必填欄位" }, { status: 400 });
  }

  const template = await prisma.educationTemplate.create({
    data: { name, htmlBody },
  });

  return NextResponse.json(template, { status: 201 });
}
