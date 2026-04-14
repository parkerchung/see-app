import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-check";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const templates = await prisma.emailTemplate.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(templates);
}

export async function POST(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const body = await request.json();
  const { name, subject, htmlBody } = body;

  if (!name || !subject || !htmlBody) {
    return NextResponse.json({ error: "缺少必填欄位" }, { status: 400 });
  }

  const template = await prisma.emailTemplate.create({
    data: { name, subject, htmlBody },
  });
  return NextResponse.json(template, { status: 201 });
}
