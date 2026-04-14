import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

  // Record click event
  await prisma.trackingEvent.create({
    data: {
      campaignTargetId: target.id,
      eventType: "LINK_CLICKED",
      ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || null,
      userAgent: request.headers.get("user-agent") || null,
    },
  });

  // Redirect to fake login page
  return NextResponse.redirect(new URL(`/t/${token}`, request.url));
}
