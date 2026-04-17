"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function EducationSettingPage() {
  const router = useRouter();
  const [html, setHtml] = useState("");
  const [saved, setSaved] = useState("");
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/settings?key=educationHtml")
      .then((r) => r.json())
      .then((data) => {
        if (data.value) {
          setHtml(data.value);
          setSaved(data.value);
        }
      });
  }, []);

  const isDirty = html !== saved;

  async function handleSave() {
    setLoading(true);
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "educationHtml", value: html }),
    });
    if (res.ok) {
      setSaved(html);
      toast.success("已儲存");
    } else {
      toast.error("儲存失敗");
    }
    setLoading(false);
  }

  async function handleReset() {
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "educationHtml", value: "" }),
    });
    if (res.ok) {
      setHtml("");
      setSaved("");
      toast.success("已恢復為預設內容");
    } else {
      toast.error("恢復失敗");
    }
  }

  return (
    <div>
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.push("/admin")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        返回
      </Button>

      <h1 className="text-2xl font-bold mb-6">教育說明頁面設定</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>頁面內容</span>
            <div className="flex gap-2">
              {html && (
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
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500">
            編輯使用者提交表單後看到的教育說明頁面。留空則使用系統預設內容。支援 HTML。
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setHtml(DEFAULT_EDUCATION_HTML)}
              disabled={!!html}
            >
              載入預設範本
            </Button>
            {saved && (
              <Button variant="outline" size="sm" onClick={handleReset}>
                恢復為預設
              </Button>
            )}
          </div>

          {preview && html ? (
            <div
              className="border rounded-md p-4 min-h-[300px] max-h-[600px] overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              placeholder="<h1>這是一次社交工程演練</h1><p>您剛才參與了一次釣魚郵件模擬測試...</p>"
              className="w-full min-h-[300px] max-h-[600px] px-3 py-2 border rounded-md text-sm font-mono outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          )}

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={loading || !isDirty}>
              {loading ? "儲存中..." : "儲存"}
            </Button>
          </div>
        </CardContent>
      </Card>
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
