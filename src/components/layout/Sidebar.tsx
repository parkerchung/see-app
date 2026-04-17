"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Mail,
  Target,
  BarChart3,
  BookOpen,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin", label: "儀表板", icon: LayoutDashboard },
  { href: "/admin/employees", label: "員工管理", icon: Users },
  { href: "/admin/templates", label: "郵件範本", icon: Mail },
  { href: "/admin/campaigns", label: "演練活動", icon: Target },
  { href: "/admin/reports", label: "報告", icon: BarChart3 },
  { href: "/admin/education", label: "教育頁面", icon: BookOpen },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="p-6">
        <h1 className="text-xl font-bold">SEE 演練系統</h1>
        <p className="text-sm text-gray-500">Social Engineering Exercise</p>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-600"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="h-4 w-4" />
          登出
        </Button>
      </div>
    </div>
  );
}
