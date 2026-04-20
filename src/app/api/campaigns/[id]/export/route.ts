import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-check";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;
  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: {
      targets: {
        include: {
          employee: true,
          events: { orderBy: { timestamp: "asc" } },
        },
      },
    },
  });

  if (!campaign) {
    return NextResponse.json({ error: "活動不存在" }, { status: 404 });
  }

  const header = "姓名,電子郵件,部門,郵件已發送,郵件已開啟,連結已點擊,已提交憑證\n";
  const rows = campaign.targets
    .map((t) => {
      const events = t.events.map((e) => e.eventType);
      return [
        t.employee.name,
        t.employee.email,
        t.employee.department,
        events.includes("EMAIL_SENT") ? "是" : "否",
        events.includes("EMAIL_OPENED") ? "是" : "否",
        events.includes("LINK_CLICKED") ? "是" : "否",
        events.includes("CREDENTIALS_SUBMITTED") ? "是" : "否",
      ].join(",");
    })
    .join("\n");

  const bom = "\uFEFF";
  const csv = bom + header + rows;

  const asciiFallback = `campaign-${campaign.id}-report.csv`;
  const utf8Name = encodeURIComponent(`${campaign.name}-report.csv`);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${asciiFallback}"; filename*=UTF-8''${utf8Name}`,
    },
  });
}
