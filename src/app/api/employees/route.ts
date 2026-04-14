import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-check";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const employees = await prisma.employee.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(employees);
}

export async function POST(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const body = await request.json();
  const { name, email, department } = body;

  if (!name || !email || !department) {
    return NextResponse.json({ error: "缺少必填欄位" }, { status: 400 });
  }

  const existing = await prisma.employee.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "此電子郵件已存在" }, { status: 409 });
  }

  const employee = await prisma.employee.create({
    data: { name, email, department },
  });
  return NextResponse.json(employee, { status: 201 });
}
