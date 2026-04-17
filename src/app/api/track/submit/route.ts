import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkCampaignCompletion } from "@/lib/campaign-status";

// SECURITY: This endpoint records ONLY the fact that a submission occurred.
// It NEVER receives, processes, or stores any credential data.
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { token } = body;

  if (!token) {
    return NextResponse.json({ redirectUrl: "/education" });
  }

  const target = await prisma.campaignTarget.findUnique({
    where: { token },
    include: {
      campaign: { select: { id: true, educationHtml: true } },
    },
  });

  if (target) {
    const alreadySubmitted = await prisma.trackingEvent.findFirst({
      where: { campaignTargetId: target.id, eventType: "CREDENTIALS_SUBMITTED" },
    });
    if (!alreadySubmitted) {
      await prisma.trackingEvent.create({
        data: {
          campaignTargetId: target.id,
          eventType: "CREDENTIALS_SUBMITTED",
          ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || null,
          userAgent: request.headers.get("user-agent") || null,
        },
      });
      await checkCampaignCompletion(target.id);
    }

    // If campaign has custom education HTML, redirect to the dynamic page
    if (target.campaign.educationHtml) {
      return NextResponse.json({ redirectUrl: `/education/${target.campaign.id}` });
    }
  }

  return NextResponse.json({ redirectUrl: "/education" });
}
