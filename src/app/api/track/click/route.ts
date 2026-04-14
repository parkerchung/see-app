import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkCampaignCompletion } from "@/lib/campaign-status";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/education", request.url));
  }

  const target = await prisma.campaignTarget.findUnique({
    where: { token },
  });

  if (!target) {
    return NextResponse.redirect(new URL("/education", request.url));
  }

  // Record click event (only first click per target)
  const alreadyClicked = await prisma.trackingEvent.findFirst({
    where: { campaignTargetId: target.id, eventType: "LINK_CLICKED" },
  });
  if (!alreadyClicked) {
    await prisma.trackingEvent.create({
      data: {
        campaignTargetId: target.id,
        eventType: "LINK_CLICKED",
        ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || null,
        userAgent: request.headers.get("user-agent") || null,
      },
    });
    await checkCampaignCompletion(target.id);
  }

  // Redirect to fake login page
  return NextResponse.redirect(new URL(`/t/${token}`, request.url));
}
