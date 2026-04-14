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
    const message = result.sent === 0
      ? `發送失敗，${result.total} 封信件均未成功寄出`
      : result.failed > 0
        ? `部分發送完成：成功 ${result.sent} 封，失敗 ${result.failed} 封`
        : `成功發送 ${result.sent}/${result.total} 封信件`;
    return NextResponse.json({ message, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "發送失敗";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
