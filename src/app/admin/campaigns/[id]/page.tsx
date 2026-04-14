"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Send, Download, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface Campaign {
  id: string;
  name: string;
  status: string;
  sentAt: string | null;
  createdAt: string;
  template: { name: string; subject: string };
  targets: Array<{
    id: string;
    employee: { name: string; email: string; department: string };
    events: Array<{
      id: string;
      eventType: string;
      timestamp: string;
      ipAddress: string | null;
    }>;
  }>;
}

const eventLabels: Record<string, string> = {
  EMAIL_SENT: "郵件已發送",
  EMAIL_OPENED: "郵件已開啟",
  LINK_CLICKED: "連結已點擊",
  CREDENTIALS_SUBMITTED: "已提交憑證",
};

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  DRAFT: { label: "草稿", variant: "secondary" },
  SENDING: { label: "發送中", variant: "default" },
  SENT: { label: "已發送", variant: "outline" },
  COMPLETED: { label: "已完成", variant: "default" },
};

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [sending, setSending] = useState(false);

  const fetchCampaign = useCallback(async () => {
    const res = await fetch(`/api/campaigns/${params.id}`);
    if (res.ok) {
      setCampaign(await res.json());
    }
  }, [params.id]);

  useEffect(() => {
    fetchCampaign();
  }, [fetchCampaign]);

  async function handleSend() {
    if (!confirm("確定要發送此演練活動？信件將立即寄出。")) return;
    setSending(true);
    const res = await fetch(`/api/campaigns/${params.id}/send`, {
      method: "POST",
    });
    const data = await res.json();
    if (res.ok) {
      toast.success(data.message);
      fetchCampaign();
    } else {
      toast.error(data.error || "發送失敗");
    }
    setSending(false);
  }

  if (!campaign) {
    return <div className="text-gray-500">載入中...</div>;
  }

  const targets = campaign.targets;
  const totalTargets = targets.length;
  const sentCount = targets.filter((t) =>
    t.events.some((e) => e.eventType === "EMAIL_SENT")
  ).length;
  const openedCount = targets.filter((t) =>
    t.events.some((e) => e.eventType === "EMAIL_OPENED")
  ).length;
  const clickedCount = targets.filter((t) =>
    t.events.some((e) => e.eventType === "LINK_CLICKED")
  ).length;
  const submittedCount = targets.filter((t) =>
    t.events.some((e) => e.eventType === "CREDENTIALS_SUBMITTED")
  ).length;
  const status = statusMap[campaign.status] || statusMap.DRAFT;

  return (
    <div>
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.push("/admin/campaigns")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        返回活動列表
      </Button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{campaign.name}</h1>
          <p className="text-gray-500">
            範本：{campaign.template.name} · 主旨：{campaign.template.subject}
          </p>
        </div>
        <div className="flex gap-2">
          {campaign.status === "DRAFT" && (
            <Button onClick={handleSend} disabled={sending}>
              <Send className="h-4 w-4 mr-2" />
              {sending ? "發送中..." : "發送活動"}
            </Button>
          )}
          {campaign.status !== "DRAFT" && (
            <a href={`/api/campaigns/${campaign.id}/export`}>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                匯出 CSV
              </Button>
            </a>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">狀態</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={status.variant}>{status.label}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">已發送</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sentCount}/{totalTargets}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">已開啟</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">已點擊</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {clickedCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">已提交憑證</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {submittedCount}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>員工演練結果</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>姓名</TableHead>
                <TableHead>電子郵件</TableHead>
                <TableHead>部門</TableHead>
                <TableHead>已發送</TableHead>
                <TableHead>已開啟</TableHead>
                <TableHead>已點擊</TableHead>
                <TableHead>已提交</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {targets.map((t) => {
                const events = t.events.map((e) => e.eventType);
                return (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">
                      {t.employee.name}
                    </TableCell>
                    <TableCell>{t.employee.email}</TableCell>
                    <TableCell>{t.employee.department}</TableCell>
                    <TableCell>
                      {events.includes("EMAIL_SENT") ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-300" />
                      )}
                    </TableCell>
                    <TableCell>
                      {events.includes("EMAIL_OPENED") ? (
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-300" />
                      )}
                    </TableCell>
                    <TableCell>
                      {events.includes("LINK_CLICKED") ? (
                        <CheckCircle className="h-4 w-4 text-orange-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-300" />
                      )}
                    </TableCell>
                    <TableCell>
                      {events.includes("CREDENTIALS_SUBMITTED") ? (
                        <CheckCircle className="h-4 w-4 text-red-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-300" />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {campaign.status !== "DRAFT" && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>事件時間線</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {targets
                .flatMap((t) =>
                  t.events.map((e) => ({
                    ...e,
                    employeeName: t.employee.name,
                    employeeEmail: t.employee.email,
                  }))
                )
                .sort(
                  (a, b) =>
                    new Date(a.timestamp).getTime() -
                    new Date(b.timestamp).getTime()
                )
                .map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-4 text-sm py-2 border-b last:border-0"
                  >
                    <span className="text-gray-400 w-[160px] shrink-0">
                      {new Date(event.timestamp).toLocaleString("zh-TW")}
                    </span>
                    <span className="font-medium w-[100px] shrink-0">
                      {event.employeeName}
                    </span>
                    <Badge variant="outline">
                      {eventLabels[event.eventType] || event.eventType}
                    </Badge>
                    {event.ipAddress && (
                      <span className="text-gray-400 text-xs">
                        IP: {event.ipAddress}
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
