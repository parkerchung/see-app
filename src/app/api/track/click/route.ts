import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkCampaignCompletion } from "@/lib/campaign-status";

export async function GET(request: NextRequest) {
  const baseUrl = process.env.BASE_URL || request.url;
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/education", baseUrl));
  }

  const target = await prisma.campaignTarget.findUnique({
    where: { token },
  });

  if (!target) {
    return NextResponse.redirect(new URL("/education", baseUrl));
  }

  const ipAddress =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    null;
  const userAgent = request.headers.get("user-agent") || null;

  // Clicking implies the email was opened. Backfill EMAIL_OPENED if the
  // tracking pixel was blocked (common in Outlook). Skip if already recorded.
  await prisma.trackingEvent.createMany({
    data: [
      {
        campaignTargetId: target.id,
        eventType: "EMAIL_OPENED",
        ipAddress,
        userAgent,
      },
    ],
    skipDuplicates: true,
  });

  const clickResult = await prisma.trackingEvent.createMany({
    data: [
      {
        campaignTargetId: target.id,
        eventType: "LINK_CLICKED",
        ipAddress,
        userAgent,
      },
    ],
    skipDuplicates: true,
  });
  if (clickResult.count > 0) {
    await checkCampaignCompletion(target.id);
  }

  // Redirect to fake login page
  return NextResponse.redirect(new URL(`/t/${token}`, baseUrl));
}
