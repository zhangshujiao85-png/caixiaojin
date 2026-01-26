"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calculator, Users, User, Menu, LogOut, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/store/useAuth";

const navItems = [
  { href: "/", label: "首页", icon: Home },
  { href: "/tools", label: "工具", icon: Calculator },
  { href: "/community", label: "社区", icon: Users },
  { href: "/profile", label: "我的", icon: User },
];

export function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-macaron-pink/20">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-macaron-pink flex items-center justify-center">
              <span className="text-white font-bold text-lg">财</span>
            </div>
            <span className="text-xl font-bold text-gray-800">小财进</span>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className="gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <UserCircle className="w-4 h-4" />
                    {user.username}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-3 py-2 border-b">
                    <p className="text-sm font-medium">{user.username}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <Link href="/profile">
                    <DropdownMenuItem>
                      <User className="w-4 h-4 mr-2" />
                      个人中心
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={logout} className="text-macaron-blue">
                    <LogOut className="w-4 h-4 mr-2" />
                    退出登录
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="outline" size="sm">
                    登录
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button size="sm" className="bg-macaron-pink hover:bg-macaron-pink/90">
                    注册
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-macaron-pink/20">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-macaron-pink flex items-center justify-center">
              <span className="text-white font-bold">财</span>
            </div>
            <span className="text-lg font-bold text-gray-800">小财进</span>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <DropdownMenuItem className="gap-2">
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </DropdownMenuItem>
                  </Link>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="md:hidden h-14" />
      <div className="hidden md:block h-16" />
    </>
  );
}
