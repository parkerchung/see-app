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
import { ArrowLeft, Search, X, Eye, EyeOff } from "lucide-react";
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

interface PhishingTemplate {
  id: string;
  name: string;
  slug: string;
  builtIn: boolean;
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
  const [phishingTemplates, setPhishingTemplates] = useState<PhishingTemplate[]>([]);
  const [phishingTemplateId, setPhishingTemplateId] = useState("");
  const [educationHtml, setEducationHtml] = useState("");
  const [showEducationPreview, setShowEducationPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [templateSearch, setTemplateSearch] = useState("");
  const [templateDropdownOpen, setTemplateDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  useEffect(() => {
    async function load() {
      const [empRes, tplRes, ptRes] = await Promise.all([
        fetch("/api/employees"),
        fetch("/api/templates"),
        fetch("/api/phishing-templates"),
      ]);
      setEmployees(await empRes.json());
      setTemplates(await tplRes.json());
      setPhishingTemplates(await ptRes.json());
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
        phishingTemplateId: phishingTemplateId || null,
        educationHtml: educationHtml || null,
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
          <Card className="overflow-visible">
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
                    <div className="absolute z-50 bottom-full mb-1 w-full bg-white border rounded-md shadow-lg max-h-[50vh] overflow-y-auto">
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
              <div className="space-y-2">
                <Label>選擇釣魚頁面樣式</Label>
                <Select value={phishingTemplateId} onValueChange={(v) => setPhishingTemplateId(v ?? "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="預設 Microsoft 登入頁" />
                  </SelectTrigger>
                  <SelectContent>
                    {phishingTemplates.map((pt) => (
                      <SelectItem key={pt.id} value={pt.id}>
                        {pt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  未選擇時預設使用 Microsoft 登入頁面
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Education page editor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>教育說明頁面</span>
                {educationHtml && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowEducationPreview(!showEducationPreview)}
                  >
                    {showEducationPreview ? (
                      <><EyeOff className="h-4 w-4 mr-1" />編輯</>
                    ) : (
                      <><Eye className="h-4 w-4 mr-1" />預覽</>
                    )}
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-gray-500">
                自訂使用者提交表單後看到的教育說明頁面。留空則使用預設內容。支援 HTML。
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEducationHtml(DEFAULT_EDUCATION_HTML)}
                disabled={!!educationHtml}
              >
                載入預設範本
              </Button>
              {showEducationPreview && educationHtml ? (
                <div
                  className="border rounded-md p-4 min-h-[200px] max-h-[400px] overflow-y-auto prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: educationHtml }}
                />
              ) : (
                <textarea
                  value={educationHtml}
                  onChange={(e) => setEducationHtml(e.target.value)}
                  placeholder="<h1>這是一次社交工程演練</h1><p>您剛才參與了一次釣魚郵件模擬測試...</p>"
                  className="w-full min-h-[200px] max-h-[400px] px-3 py-2 border rounded-md text-sm font-mono outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                />
              )}
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

const DEFAULT_EDUCATION_HTML = `<div style="max-width: 700px; margin: 0 auto; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <div style="text-align: center; margin-bottom: 32px;">
    <div style="display: inline-flex; align-items: center; justify-content: center; width: 80px; height: 80px; border-radius: 50%; background: #fef3c7; margin-bottom: 16px;">
      <span style="font-size: 40px;">&#x1F6E1;</span>
    </div>
    <h1 style="font-size: 28px; font-weight: bold; color: #111; margin: 0 0 12px;">這是一次社交工程演練</h1>
    <p style="font-size: 18px; color: #555;">您剛才參與了一次釣魚郵件模擬測試。請不要擔心，這只是一次安全意識訓練。</p>
  </div>

  <div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 32px; margin-bottom: 24px;">
    <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 16px;">⚠️ 發生了什麼事？</h2>
    <p style="color: #555; line-height: 1.8;">您收到了一封看似來自公司內部的信件，並點擊了信中的連結，進入了一個模擬的登入頁面。在真實的釣魚攻擊中，攻擊者會利用這個假登入頁面竊取您的帳號密碼，進而存取公司機密資料、發送惡意信件、或進行財務詐騙。</p>
  </div>

  <div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 32px; margin-bottom: 24px;">
    <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 20px;">如何辨識釣魚郵件？</h2>
    <ul style="list-style: none; padding: 0; margin: 0;">
      <li style="margin-bottom: 16px; padding-left: 36px; position: relative;"><span style="position: absolute; left: 0;">📧</span><strong>檢查寄件者地址</strong> — 仔細查看寄件者的電子郵件地址，釣魚信件常使用與公司相似但不完全相同的網域。</li>
      <li style="margin-bottom: 16px; padding-left: 36px; position: relative;"><span style="position: absolute; left: 0;">🔗</span><strong>懸停查看連結</strong> — 點擊前將滑鼠懸停在連結上查看實際網址，如網址可疑請不要點擊。</li>
      <li style="margin-bottom: 16px; padding-left: 36px; position: relative;"><span style="position: absolute; left: 0;">⚡</span><strong>注意緊急語氣</strong> — 釣魚信件常用緊急威脅語言，遇到時請保持冷靜先向 IT 確認。</li>
      <li style="padding-left: 36px; position: relative;"><span style="position: absolute; left: 0;">👁️</span><strong>確認登入頁面網址</strong> — 輸入帳密前請確認瀏覽器網址列顯示的是官方網址。</li>
    </ul>
  </div>

  <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 32px; margin-bottom: 24px;">
    <h2 style="font-size: 20px; font-weight: 600; color: #1e3a5f; margin: 0 0 16px;">下次遇到可疑信件該怎麼辦？</h2>
    <ol style="color: #1e40af; line-height: 2; padding-left: 20px;">
      <li>不要點擊信件中的任何連結或附件</li>
      <li>不要回覆該信件或提供任何個人資訊</li>
      <li>向 IT 資訊安全部門回報該可疑信件</li>
      <li>如果已經點擊了連結，請立即更改您的密碼</li>
      <li>開啟帳號的雙重驗證（MFA）以增加安全性</li>
    </ol>
  </div>

  <p style="text-align: center; font-size: 13px; color: #aaa;">此頁面為社交工程演練教育宣導頁面 · 由 IT 資訊安全部門提供</p>
</div>`;
