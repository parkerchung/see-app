"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Template {
  id: string;
  name: string;
  subject: string;
  createdAt: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", subject: "", htmlBody: "" });

  const fetchTemplates = useCallback(async () => {
    const res = await fetch("/api/templates");
    const data = await res.json();
    setTemplates(data);
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success("範本已建立");
      setDialogOpen(false);
      setForm({ name: "", subject: "", htmlBody: "" });
      fetchTemplates();
    } else {
      toast.error("建立失敗");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("確定要刪除此範本？")) return;
    const res = await fetch(`/api/templates/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("範本已刪除");
      fetchTemplates();
    } else {
      toast.error("刪除失敗");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">郵件範本</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button />}>
            <Plus className="h-4 w-4 mr-2" />
            新增範本
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>新增郵件範本</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label>範本名稱</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="例：密碼重設通知"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>信件主旨</Label>
                <Input
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  placeholder="例：[緊急] 您的帳號密碼即將到期"
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
                  className="w-full min-h-[200px] rounded-md border px-3 py-2 text-sm font-mono"
                  value={form.htmlBody}
                  onChange={(e) =>
                    setForm({ ...form, htmlBody: e.target.value })
                  }
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                建立範本
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center py-8">
            尚未建立任何範本
          </p>
        ) : (
          templates.map((tpl) => (
            <Card key={tpl.id}>
              <CardHeader>
                <CardTitle className="text-lg">{tpl.name}</CardTitle>
                <CardDescription className="truncate">
                  {tpl.subject}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Link href={`/admin/templates/${tpl.id}`} className="flex-1">
                    <Button variant="outline" className="w-full" size="sm">
                      <Pencil className="h-3 w-3 mr-2" />
                      編輯
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(tpl.id)}
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
