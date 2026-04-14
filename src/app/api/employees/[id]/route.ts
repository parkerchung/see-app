import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-check";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;
  const employee = await prisma.employee.findUnique({ where: { id } });
  if (!employee) {
    return NextResponse.json({ error: "員工不存在" }, { status: 404 });
  }
  return NextResponse.json(employee);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;
  const body = await request.json();
  const { name, email, department } = body;

  if (email) {
    const existing = await prisma.employee.findFirst({
      where: { email, id: { not: id } },
    });
    if (existing) {
      return NextResponse.json({ error: "此電子郵件已存在" }, { status: 409 });
    }
  }

  const employee = await prisma.employee.update({
    where: { id },
    data: { name, email, department },
  });
  return NextResponse.json(employee);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  const activeTargets = await prisma.campaignTarget.count({
    where: { employeeId: id },
  });
  if (activeTargets > 0) {
    return NextResponse.json(
      { error: `此員工已參與 ${activeTargets} 個演練活動，無法刪除` },
      { status: 409 }
    );
  }

  await prisma.employee.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
