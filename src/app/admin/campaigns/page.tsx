"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface CampaignSummary {
  id: string;
  name: string;
  templateName: string;
  status: string;
  sentAt: string | null;
  createdAt: string;
  targetCount: number;
  sentCount: number;
  clickedCount: number;
  submittedCount: number;
}

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  DRAFT: { label: "草稿", variant: "secondary" },
  SENDING: { label: "發送中", variant: "default" },
  SENT: { label: "已發送", variant: "outline" },
  COMPLETED: { label: "已完成", variant: "default" },
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignSummary[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/campaigns");
      const data = await res.json();
      setCampaigns(data);
    }
    load();
  }, [refreshKey]);

  async function handleDelete(id: string) {
    if (!confirm("確定要刪除此活動？")) return;
    const res = await fetch(`/api/campaigns/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("活動已刪除");
      setRefreshKey((k) => k + 1);
    } else {
      toast.error("刪除失敗");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">演練活動</h1>
        <Link href="/admin/campaigns/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            建立活動
          </Button>
        </Link>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>活動名稱</TableHead>
              <TableHead>範本</TableHead>
              <TableHead>狀態</TableHead>
              <TableHead>對象數</TableHead>
              <TableHead>點擊數</TableHead>
              <TableHead>提交數</TableHead>
              <TableHead>建立時間</TableHead>
              <TableHead className="w-[100px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-500">
                  尚未建立任何活動
                </TableCell>
              </TableRow>
            ) : (
              campaigns.map((c) => {
                const status = statusMap[c.status] || statusMap.DRAFT;
                return (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.templateName}</TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell>{c.targetCount}</TableCell>
                    <TableCell>{c.clickedCount}</TableCell>
                    <TableCell>{c.submittedCount}</TableCell>
                    <TableCell>
                      {new Date(c.createdAt).toLocaleDateString("zh-TW")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/admin/campaigns/${c.id}`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        {c.status === "DRAFT" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(c.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
