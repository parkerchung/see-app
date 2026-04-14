import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-check";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      template: { select: { name: true } },
      targets: {
        include: {
          events: true,
        },
      },
    },
  });

  const result = campaigns.map((c) => ({
    id: c.id,
    name: c.name,
    templateName: c.template.name,
    status: c.status,
    sentAt: c.sentAt,
    createdAt: c.createdAt,
    targetCount: c.targets.length,
    sentCount: c.targets.filter((t) =>
      t.events.some((e) => e.eventType === "EMAIL_SENT")
    ).length,
    clickedCount: c.targets.filter((t) =>
      t.events.some((e) => e.eventType === "LINK_CLICKED")
    ).length,
    submittedCount: c.targets.filter((t) =>
      t.events.some((e) => e.eventType === "CREDENTIALS_SUBMITTED")
    ).length,
  }));

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const body = await request.json();
  const { name, templateId, employeeIds } = body;

  if (!name || !templateId || !employeeIds?.length) {
    return NextResponse.json({ error: "缺少必填欄位" }, { status: 400 });
  }

  const campaign = await prisma.campaign.create({
    data: {
      name,
      templateId,
      targets: {
        create: employeeIds.map((employeeId: string) => ({
          employeeId,
        })),
      },
    },
    include: { targets: true },
  });

  return NextResponse.json(campaign, { status: 201 });
}
