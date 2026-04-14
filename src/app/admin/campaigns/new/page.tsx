"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
}

interface Template {
  id: string;
  name: string;
  subject: string;
}

export default function NewCampaignPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [name, setName] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const [empRes, tplRes] = await Promise.all([
        fetch("/api/employees"),
        fetch("/api/templates"),
      ]);
      setEmployees(await empRes.json());
      setTemplates(await tplRes.json());
    }
    load();
  }, []);

  function toggleEmployee(id: string) {
    setSelectedEmployees((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selectedEmployees.size === employees.length) {
      setSelectedEmployees(new Set());
    } else {
      setSelectedEmployees(new Set(employees.map((e) => e.id)));
    }
  }

  async function handleCreate() {
    if (!name || !templateId || selectedEmployees.size === 0) {
      toast.error("請填寫所有欄位並選擇至少一名員工");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        templateId,
        employeeIds: Array.from(selectedEmployees),
      }),
    });

    if (res.ok) {
      const campaign = await res.json();
      toast.success("活動已建立");
      router.push(`/admin/campaigns/${campaign.id}`);
    } else {
      toast.error("建立失敗");
      setLoading(false);
    }
  }

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

      <h1 className="text-2xl font-bold mb-6">建立演練活動</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>活動設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>活動名稱</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例：2026年4月社交工程演練"
                />
              </div>
              <div className="space-y-2">
                <Label>選擇郵件範本</Label>
                <Select value={templateId} onValueChange={(v) => setTemplateId(v ?? "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="請選擇範本" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((tpl) => (
                      <SelectItem key={tpl.id} value={tpl.id}>
                        {tpl.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Button
            className="w-full"
            size="lg"
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? "建立中..." : "建立活動"}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>選擇演練對象</span>
              <Button variant="outline" size="sm" onClick={toggleAll}>
                {selectedEmployees.size === employees.length
                  ? "取消全選"
                  : "全選"}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {employees.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                尚未新增員工，請先至員工管理新增
              </p>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {employees.map((emp) => (
                  <label
                    key={emp.id}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedEmployees.has(emp.id)}
                      onCheckedChange={() => toggleEmployee(emp.id)}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{emp.name}</div>
                      <div className="text-xs text-gray-500">
                        {emp.email} · {emp.department}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
            <div className="mt-4 pt-4 border-t text-sm text-gray-500">
              已選擇 {selectedEmployees.size} / {employees.length} 人
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
