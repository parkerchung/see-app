import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-check";
import { sendCampaign } from "@/lib/email";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  try {
    const result = await sendCampaign(id);
    return NextResponse.json({
      message: `成功發送 ${result.sent}/${result.total} 封信件`,
      ...result,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "發送失敗";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
