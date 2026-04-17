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
  const template = await prisma.educationTemplate.findUnique({ where: { id } });
  if (!template) {
    return NextResponse.json({ error: "找不到範本" }, { status: 404 });
  }

  return NextResponse.json(template);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;
  const { name, htmlBody } = await request.json();

  const template = await prisma.educationTemplate.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(htmlBody !== undefined && { htmlBody }),
    },
  });

  return NextResponse.json(template);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  const usedByCampaign = await prisma.campaign.findFirst({
    where: { educationTemplateId: id },
    select: { id: true },
  });
  if (usedByCampaign) {
    return NextResponse.json(
      { error: "此範本已被活動使用，無法刪除" },
      { status: 409 }
    );
  }

  await prisma.educationTemplate.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
