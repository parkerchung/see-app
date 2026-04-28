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
  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: {
      template: true,
      targets: {
        include: {
          employee: true,
          events: { orderBy: { timestamp: "asc" } },
        },
      },
    },
  });

  if (!campaign) {
    return NextResponse.json({ error: "活動不存在" }, { status: 404 });
  }

  return NextResponse.json(campaign);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  const campaign = await prisma.campaign.findUnique({
    where: { id },
    select: { status: true },
  });
  if (!campaign) {
    return NextResponse.json({ error: "活動不存在" }, { status: 404 });
  }
  if (campaign.status === "SENDING") {
    return NextResponse.json(
      { error: "活動正在發送中，請待發送結束後再刪除" },
      { status: 409 }
    );
  }

  await prisma.campaign.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
