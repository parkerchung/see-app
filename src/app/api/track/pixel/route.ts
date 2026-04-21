import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkCampaignCompletion } from "@/lib/campaign-status";

// 1x1 transparent GIF
const PIXEL = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64"
);

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (token) {
    const target = await prisma.campaignTarget.findUnique({
      where: { token },
    });

    if (target) {
      const result = await prisma.trackingEvent.createMany({
        data: [
          {
            campaignTargetId: target.id,
            eventType: "EMAIL_OPENED",
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
    }
  }

  return new NextResponse(PIXEL, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
