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
      campaign: { select: { id: true, educationTemplateId: true } },
    },
  });

  if (target) {
    const result = await prisma.trackingEvent.createMany({
      data: [
        {
          campaignTargetId: target.id,
          eventType: "CREDENTIALS_SUBMITTED",
          ipAddress:
            request.headers.get("x-forwarded-for") ||
            request.headers.get("x-real-ip") ||
            null,
          userAgent: request.headers.get("user-agent") || null,
        },
      ],
      skipDuplicates: true,
    });
    if (result.count > 0) {
      await checkCampaignCompletion(target.id);
    }

    if (target.campaign.educationTemplateId) {
      return NextResponse.json({
        redirectUrl: `/education?tid=${target.campaign.educationTemplateId}`,
      });
    }
  }

  return NextResponse.json({ redirectUrl: "/education" });
}
