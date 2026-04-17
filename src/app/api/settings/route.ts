import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-check";

export async function GET(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const key = request.nextUrl.searchParams.get("key");
  if (!key) {
    return NextResponse.json({ error: "缺少 key 參數" }, { status: 400 });
  }

  const setting = await prisma.siteSetting.findUnique({ where: { key } });
  return NextResponse.json({ value: setting?.value ?? null });
}

export async function PUT(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const { key, value } = await request.json();
  if (!key || typeof value !== "string") {
    return NextResponse.json({ error: "缺少 key 或 value" }, { status: 400 });
  }

  const setting = await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });

  return NextResponse.json(setting);
}
