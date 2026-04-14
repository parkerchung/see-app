"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Mail, Target, AlertTriangle, MousePointer, ShieldCheck } from "lucide-react";

interface Stats {
  totalTargets: number;
  sent: number;
  opened: number;
  clicked: number;
  submitted: number;
  openRate: string;
  clickRate: string;
  submitRate: string;
}

interface CampaignSummary {
  id: string;
  name: string;
  templateName: string;
  status: string;
  targetCount: number;
  clickedCount: number;
  submittedCount: number;
  createdAt: string;
}

const statusMap: Record<string, string> = {
  DRAFT: "草稿",
  SENDING: "發送中",
  SENT: "已發送",
  COMPLETED: "已完成",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [campaigns, setCampaigns] = useState<CampaignSummary[]>([]);

  const fetchData = useCallback(async () => {
    const [statsRes, campaignsRes] = await Promise.all([
      fetch("/api/reports"),
      fetch("/api/campaigns"),
    ]);
    if (statsRes.ok) setStats(await statsRes.json());
    if (campaignsRes.ok) setCampaigns(await campaignsRes.json());
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">儀表板</h1>

      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                總演練對象
              </CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTargets}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                郵件開啟率
              </CardTitle>
              <Mail className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.openRate}%</div>
              <p className="text-xs text-gray-500">{stats.opened} / {stats.sent} 人</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                連結點擊率
              </CardTitle>
              <MousePointer className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.clickRate}%
              </div>
              <p className="text-xs text-gray-500">{stats.clicked} / {stats.sent} 人</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                憑證提交率
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.submitRate}%
              </div>
              <p className="text-xs text-gray-500">{stats.submitted} / {stats.sent} 人</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">最近活動</h2>
        <Link href="/admin/campaigns">
          <Button variant="outline" size="sm">查看全部</Button>
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ShieldCheck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">尚未建立任何演練活動</p>
            <Link href="/admin/campaigns/new">
              <Button>
                <Target className="h-4 w-4 mr-2" />
                建立第一個演練活動
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.slice(0, 6).map((c) => (
            <Link key={c.id} href={`/admin/campaigns/${c.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{c.name}</CardTitle>
                    <Badge variant="secondary">{statusMap[c.status] || c.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-2">{c.templateName}</p>
                  <div className="flex gap-4 text-xs text-gray-400">
                    <span>對象 {c.targetCount}</span>
                    <span className="text-orange-500">點擊 {c.clickedCount}</span>
                    <span className="text-red-500">提交 {c.submittedCount}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
