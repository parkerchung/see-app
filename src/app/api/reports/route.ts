import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-check";

export async function GET(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const campaignId = request.nextUrl.searchParams.get("campaignId");

  const where = campaignId
    ? { campaign: { id: campaignId } }
    : {};

  const targets = await prisma.campaignTarget.findMany({
    where,
    include: {
      employee: true,
      events: { orderBy: { timestamp: "asc" } },
      campaign: { select: { name: true, status: true } },
    },
  });

  const totalTargets = targets.length;
  const sent = targets.filter((t) =>
    t.events.some((e) => e.eventType === "EMAIL_SENT")
  ).length;
  const opened = targets.filter((t) =>
    t.events.some((e) => e.eventType === "EMAIL_OPENED")
  ).length;
  const clicked = targets.filter((t) =>
    t.events.some((e) => e.eventType === "LINK_CLICKED")
  ).length;
  const submitted = targets.filter((t) =>
    t.events.some((e) => e.eventType === "CREDENTIALS_SUBMITTED")
  ).length;

  return NextResponse.json({
    totalTargets,
    sent,
    opened,
    clicked,
    submitted,
    openRate: sent > 0 ? ((opened / sent) * 100).toFixed(1) : "0",
    clickRate: sent > 0 ? ((clicked / sent) * 100).toFixed(1) : "0",
    submitRate: sent > 0 ? ((submitted / sent) * 100).toFixed(1) : "0",
  });
}
