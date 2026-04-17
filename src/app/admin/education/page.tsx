"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Plus, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface EducationTemplate {
  id: string;
  name: string;
  htmlBody?: string;
  createdAt: string;
}

export default function EducationTemplatesPage() {
  const [templates, setTemplates] = useState<EducationTemplate[]>([]);
  const [editing, setEditing] = useState<EducationTemplate | null>(null);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [htmlBody, setHtmlBody] = useState("");
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  async function loadTemplates() {
    const res = await fetch("/api/education-templates");
    setTemplates(await res.json());
  }

  useEffect(() => {
    fetch("/api/education-templates")
      .then((r) => r.json())
      .then(setTemplates);
  }, []);

  function startCreate() {
    setEditing(null);
    setCreating(true);
    setName("");
    setHtmlBody(DEFAULT_EDUCATION_HTML);
    setPreview(false);
  }

  async function startEdit(id: string) {
    const res = await fetch(`/api/education-templates/${id}`);
    const tpl = await res.json();
    setCreating(false);
    setEditing(tpl);
    setName(tpl.name);
    setHtmlBody(tpl.htmlBody);
    setPreview(false);
  }

  function cancelEdit() {
    setEditing(null);
    setCreating(false);
  }

  async function handleSave() {
    if (!name.trim() || !htmlBody.trim()) {
      toast.error("請填寫名稱和內容");
      return;
    }

    setSaving(true);

    if (editing) {
      const res = await fetch(`/api/education-templates/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, htmlBody }),
      });
      if (res.ok) {
        toast.success("已更新");
        cancelEdit();
        loadTemplates();
      } else {
        toast.error("更新失敗");
      }
    } else {
      const res = await fetch("/api/education-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, htmlBody }),
      });
      if (res.ok) {
        toast.success("已建立");
        cancelEdit();
        loadTemplates();
      } else {
        toast.error("建立失敗");
      }
    }

    setSaving(false);
  }

  async function handleDelete(id: string, tplName: string) {
    if (!confirm(`確定要刪除「${tplName}」嗎？`)) return;

    const res = await fetch(`/api/education-templates/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("已刪除");
      if (editing?.id === id) cancelEdit();
      loadTemplates();
    } else {
      const data = await res.json();
      toast.error(data.error || "刪除失敗");
    }
  }

  // Show editor
  if (creating || editing) {
    return (
      <div>
        <Button variant="ghost" className="mb-4" onClick={cancelEdit}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回列表
        </Button>

        <h1 className="text-2xl font-bold mb-6">
          {editing ? `編輯：${editing.name}` : "新增教育頁面範本"}
        </h1>

        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label>範本名稱</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例：標準版教育頁面"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>HTML 內容</Label>
                {htmlBody && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreview(!preview)}
                  >
                    {preview ? (
                      <><EyeOff className="h-4 w-4 mr-1" />編輯</>
                    ) : (
                      <><Eye className="h-4 w-4 mr-1" />預覽</>
                    )}
                  </Button>
                )}
              </div>

              {preview && htmlBody ? (
                <div
                  className="border rounded-md p-4 min-h-[300px] max-h-[600px] overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: htmlBody }}
                />
              ) : (
                <textarea
                  value={htmlBody}
                  onChange={(e) => setHtmlBody(e.target.value)}
                  placeholder="<h1>這是一次社交工程演練</h1>"
                  className="w-full min-h-[300px] max-h-[600px] px-3 py-2 border rounded-md text-sm font-mono outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                />
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={cancelEdit}>取消</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "儲存中..." : "儲存"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show template list
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">教育頁面範本</h1>
        <Button onClick={startCreate}>
          <Plus className="h-4 w-4 mr-2" />
          新增範本
        </Button>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        建立多個教育說明頁面版本，在建立演練活動時選擇使用。未選擇時使用系統預設頁面。
      </p>

      {templates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            <p>尚未建立任何教育頁面範本</p>
            <Button className="mt-4" variant="outline" onClick={startCreate}>
              建立第一個範本
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {templates.map((tpl) => (
            <Card key={tpl.id}>
              <CardHeader className="py-4">
                <CardTitle className="flex items-center justify-between text-base">
                  <span>{tpl.name}</span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(tpl.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(tpl.id, tpl.name)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
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
    <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 16px;">發生了什麼事？</h2>
    <p style="color: #555; line-height: 1.8;">您收到了一封看似來自公司內部的信件，並點擊了信中的連結，進入了一個模擬的登入頁面。在真實的釣魚攻擊中，攻擊者會利用這個假登入頁面竊取您的帳號密碼，進而存取公司機密資料、發送惡意信件、或進行財務詐騙。</p>
  </div>

  <div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 32px; margin-bottom: 24px;">
    <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 20px;">如何辨識釣魚郵件？</h2>
    <ul style="list-style: none; padding: 0; margin: 0;">
      <li style="margin-bottom: 16px; padding-left: 36px; position: relative;"><span style="position: absolute; left: 0;">&#x1F4E7;</span><strong>檢查寄件者地址</strong> — 仔細查看寄件者的電子郵件地址，釣魚信件常使用與公司相似但不完全相同的網域。</li>
      <li style="margin-bottom: 16px; padding-left: 36px; position: relative;"><span style="position: absolute; left: 0;">&#x1F517;</span><strong>懸停查看連結</strong> — 點擊前將滑鼠懸停在連結上查看實際網址，如網址可疑請不要點擊。</li>
      <li style="margin-bottom: 16px; padding-left: 36px; position: relative;"><span style="position: absolute; left: 0;">&#x26A1;</span><strong>注意緊急語氣</strong> — 釣魚信件常用緊急威脅語言，遇到時請保持冷靜先向 IT 確認。</li>
      <li style="padding-left: 36px; position: relative;"><span style="position: absolute; left: 0;">&#x1F441;</span><strong>確認登入頁面網址</strong> — 輸入帳密前請確認瀏覽器網址列顯示的是官方網址。</li>
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
