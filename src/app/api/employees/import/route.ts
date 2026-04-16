import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-check";

export async function POST(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const body = await request.json();
  const { rows } = body as { rows: { name: string; email: string; department: string }[] };

  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ error: "沒有資料可匯入" }, { status: 400 });
  }

  let created = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const row of rows) {
    const name = row.name?.trim();
    const email = row.email?.trim();
    const department = row.department?.trim();

    if (!name || !email || !department) {
      errors.push(`跳過無效資料：${JSON.stringify(row)}`);
      skipped++;
      continue;
    }

    const existing = await prisma.employee.findUnique({ where: { email } });
    if (existing) {
      errors.push(`${email} 已存在，跳過`);
      skipped++;
      continue;
    }

    await prisma.employee.create({ data: { name, email, department } });
    created++;
  }

  return NextResponse.json({ created, skipped, errors }, { status: 201 });
}
