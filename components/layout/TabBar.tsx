"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, User, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const tabItems = [
  { href: "/", label: "首页", icon: Home },
  { href: "/tools/finance-center", label: "财务", icon: Wallet },
  { href: "/community", label: "社区", icon: Users },
  { href: "/profile", label: "我的", icon: User },
];

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-macaron-pink/20 safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {tabItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                isActive ? "text-macaron-pink" : "text-gray-500"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "fill-current")} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
