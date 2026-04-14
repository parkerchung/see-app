import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
  });

  if (target) {
    await prisma.trackingEvent.create({
      data: {
        campaignTargetId: target.id,
        eventType: "CREDENTIALS_SUBMITTED",
        ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || null,
        userAgent: request.headers.get("user-agent") || null,
      },
    });
  }

  return NextResponse.json({ redirectUrl: "/education" });
}
