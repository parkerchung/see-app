"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface Template {
  id: string;
  name: string;
  subject: string;
  htmlBody: string;
}

export default function TemplateEditorPage() {
  const params = useParams();
  const router = useRouter();
  const [template, setTemplate] = useState<Template | null>(null);
  const [form, setForm] = useState({ name: "", subject: "", htmlBody: "" });

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/templates/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setTemplate(data);
        setForm({ name: data.name, subject: data.subject, htmlBody: data.htmlBody });
      }
    }
    load();
  }, [params.id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/templates/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success("範本已儲存");
    } else {
      toast.error("儲存失敗");
    }
  }

  if (!template) {
    return <div className="text-gray-500">載入中...</div>;
  }

  return (
    <div>
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.push("/admin/templates")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        返回範本列表
      </Button>

      <h1 className="text-2xl font-bold mb-6">編輯範本</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label>範本名稱</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>信件主旨</Label>
            <Input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>
              HTML 內容{" "}
              <span className="text-gray-400 font-normal">
                (使用 {"{{trackingUrl}}"} 作為追蹤連結佔位符)
              </span>
            </Label>
            <textarea
              className="w-full min-h-[400px] rounded-md border px-3 py-2 text-sm font-mono"
              value={form.htmlBody}
              onChange={(e) => setForm({ ...form, htmlBody: e.target.value })}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            儲存變更
          </Button>
        </form>

        <div>
          <Label className="mb-2 block">預覽</Label>
          <div className="rounded-md border bg-white">
            <div className="border-b px-4 py-2 text-sm text-gray-500">
              主旨：{form.subject}
            </div>
            <iframe
              srcDoc={form.htmlBody}
              className="w-full h-[500px]"
              sandbox=""
              title="Email preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
