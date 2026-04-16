"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
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
import { ArrowLeft, Search, X } from "lucide-react";
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
  const [templateSearch, setTemplateSearch] = useState("");
  const [templateDropdownOpen, setTemplateDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

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

  const filteredTemplates = useMemo(
    () =>
      templates.filter(
        (tpl) =>
          !templateSearch ||
          tpl.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
          tpl.subject.toLowerCase().includes(templateSearch.toLowerCase())
      ),
    [templates, templateSearch]
  );

  const selectedTemplateName = templates.find((t) => t.id === templateId)?.name || "";

  const departments = useMemo(
    () => [...new Set(employees.map((e) => e.department))].sort(),
    [employees]
  );

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchSearch =
        !searchQuery ||
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDept = !departmentFilter || emp.department === departmentFilter;
      return matchSearch && matchDept;
    });
  }, [employees, searchQuery, departmentFilter]);

  function toggleEmployee(id: string) {
    setSelectedEmployees((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectFiltered() {
    setSelectedEmployees((prev) => {
      const next = new Set(prev);
      for (const emp of filteredEmployees) {
        next.add(emp.id);
      }
      return next;
    });
  }

  function clearAll() {
    setSelectedEmployees(new Set());
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
                <div className="relative">
                  <Input
                    placeholder="輸入關鍵字搜尋範本"
                    value={templateDropdownOpen ? templateSearch : selectedTemplateName}
                    onChange={(e) => {
                      setTemplateSearch(e.target.value);
                      setTemplateDropdownOpen(true);
                      if (!e.target.value) setTemplateId("");
                    }}
                    onFocus={() => {
                      setTemplateDropdownOpen(true);
                      setTemplateSearch("");
                    }}
                    onBlur={() => setTimeout(() => setTemplateDropdownOpen(false), 150)}
                  />
                  {templateDropdownOpen && (
                    <div className="absolute z-10 bottom-full mb-1 w-full bg-white border rounded-md shadow-lg max-h-[300px] overflow-y-auto">
                      {filteredTemplates.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-gray-500">沒有符合的範本</div>
                      ) : (
                        filteredTemplates.map((tpl) => (
                          <div
                            key={tpl.id}
                            className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                              tpl.id === templateId ? "bg-blue-50 font-medium" : ""
                            }`}
                            onMouseDown={() => {
                              setTemplateId(tpl.id);
                              setTemplateSearch("");
                              setTemplateDropdownOpen(false);
                            }}
                          >
                            <div>{tpl.name}</div>
                            <div className="text-xs text-gray-400 truncate">{tpl.subject}</div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
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
            <CardTitle>選擇演練對象</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="搜尋姓名或 email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={departmentFilter} onValueChange={(v) => setDepartmentFilter(v ?? "")}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="全部部門" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">全部部門</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={selectFiltered}>
                全選目前列表 ({filteredEmployees.length})
              </Button>
              {selectedEmployees.size > 0 && (
                <Button variant="outline" size="sm" onClick={clearAll}>
                  <X className="h-3 w-3 mr-1" />
                  清除全部
                </Button>
              )}
            </div>

            {/* Selected summary */}
            {selectedEmployees.size > 0 && (
              <div className="flex flex-wrap gap-1">
                {employees
                  .filter((e) => selectedEmployees.has(e.id))
                  .map((e) => (
                    <Badge
                      key={e.id}
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-100"
                      onClick={() => toggleEmployee(e.id)}
                    >
                      {e.name} ×
                    </Badge>
                  ))}
              </div>
            )}

            {/* Employee list */}
            {employees.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                尚未新增員工，請先至員工管理新增
              </p>
            ) : filteredEmployees.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                沒有符合條件的員工
              </p>
            ) : (
              <div className="space-y-1 max-h-[350px] overflow-y-auto">
                {filteredEmployees.map((emp) => (
                  <label
                    key={emp.id}
                    className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                      selectedEmployees.has(emp.id)
                        ? "bg-blue-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <Checkbox
                      checked={selectedEmployees.has(emp.id)}
                      onCheckedChange={() => toggleEmployee(emp.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{emp.name}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {emp.email}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">
                      {emp.department}
                    </span>
                  </label>
                ))}
              </div>
            )}

            <div className="pt-4 border-t text-sm font-medium">
              已選擇 {selectedEmployees.size} / {employees.length} 人
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
