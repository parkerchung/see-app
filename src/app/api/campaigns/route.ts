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
      _count: { select: { targets: true } },
    },
  });

  const result = await Promise.all(
    campaigns.map(async (c) => {
      const [sentCount, clickedCount, submittedCount] = await Promise.all([
        prisma.trackingEvent.count({
          where: { campaignTarget: { campaignId: c.id }, eventType: "EMAIL_SENT" },
        }),
        prisma.trackingEvent.count({
          where: { campaignTarget: { campaignId: c.id }, eventType: "LINK_CLICKED" },
        }),
        prisma.trackingEvent.count({
          where: { campaignTarget: { campaignId: c.id }, eventType: "CREDENTIALS_SUBMITTED" },
        }),
      ]);
      return {
        id: c.id,
        name: c.name,
        templateName: c.template.name,
        status: c.status,
        sentAt: c.sentAt,
        createdAt: c.createdAt,
        targetCount: c._count.targets,
        sentCount,
        clickedCount,
        submittedCount,
      };
    })
  );

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
