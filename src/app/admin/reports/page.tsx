"use client";

import { useEffect, useState, useCallback } from "react";
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
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

interface CampaignSummary {
  id: string;
  name: string;
  templateName: string;
  status: string;
  targetCount: number;
  sentCount: number;
  clickedCount: number;
  submittedCount: number;
}

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

export default function ReportsPage() {
  const [campaigns, setCampaigns] = useState<CampaignSummary[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  const fetchData = useCallback(async () => {
    const [campRes, statsRes] = await Promise.all([
      fetch("/api/campaigns"),
      fetch("/api/reports"),
    ]);
    if (campRes.ok) setCampaigns(await campRes.json());
    if (statsRes.ok) setStats(await statsRes.json());
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const sentCampaigns = campaigns.filter((c) => c.status !== "DRAFT");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">總覽報告</h1>

      {stats && stats.sent > 0 && (
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">總發送數</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.sent}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">開啟率</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.openRate}%</div>
              <div className="mt-2 h-2 bg-gray-100 rounded-full">
                <div
                  className="h-2 bg-blue-500 rounded-full"
                  style={{ width: `${stats.openRate}%` }}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">點擊率</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {stats.clickRate}%
              </div>
              <div className="mt-2 h-2 bg-gray-100 rounded-full">
                <div
                  className="h-2 bg-orange-500 rounded-full"
                  style={{ width: `${stats.clickRate}%` }}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">提交率</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {stats.submitRate}%
              </div>
              <div className="mt-2 h-2 bg-gray-100 rounded-full">
                <div
                  className="h-2 bg-red-500 rounded-full"
                  style={{ width: `${stats.submitRate}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>各活動統計</CardTitle>
        </CardHeader>
        <CardContent>
          {sentCampaigns.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              尚無已發送的活動
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>活動名稱</TableHead>
                  <TableHead>範本</TableHead>
                  <TableHead className="text-center">對象數</TableHead>
                  <TableHead className="text-center">已發送</TableHead>
                  <TableHead className="text-center">已點擊</TableHead>
                  <TableHead className="text-center">已提交</TableHead>
                  <TableHead className="text-center">點擊率</TableHead>
                  <TableHead className="text-center">提交率</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sentCampaigns.map((c) => {
                  const clickRate =
                    c.sentCount > 0
                      ? ((c.clickedCount / c.sentCount) * 100).toFixed(1)
                      : "0";
                  const submitRate =
                    c.sentCount > 0
                      ? ((c.submittedCount / c.sentCount) * 100).toFixed(1)
                      : "0";
                  return (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>{c.templateName}</TableCell>
                      <TableCell className="text-center">
                        {c.targetCount}
                      </TableCell>
                      <TableCell className="text-center">
                        {c.sentCount}
                      </TableCell>
                      <TableCell className="text-center text-orange-600">
                        {c.clickedCount}
                      </TableCell>
                      <TableCell className="text-center text-red-600">
                        {c.submittedCount}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{clickRate}%</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            Number(submitRate) > 0 ? "destructive" : "outline"
                          }
                        >
                          {submitRate}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
