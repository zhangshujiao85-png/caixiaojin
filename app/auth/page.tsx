"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PiggyBankGirl } from "@/components/illustrations";
import { Mail as MailIcon, Lock as LockIcon, User as UserIcon, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { login, register, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      // 登录逻辑
      if (!formData.email || !formData.password) {
        setError("请填写所有字段");
        return;
      }

      const success = await login(formData.email, formData.password);
      if (success) {
        router.push("/");
      } else {
        setError("邮箱或密码错误");
      }
    } else {
      // 注册逻辑
      if (!formData.username || !formData.email || !formData.password) {
        setError("请填写所有字段");
        return;
      }

      if (formData.password.length < 6) {
        setError("密码至少需要6位");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("两次密码不一致");
        return;
      }

      const success = await register(formData.username, formData.email, formData.password);
      if (success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        setError("该邮箱已被注册");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-macaron-pink/20 via-macaron-cream to-macaron-purple/20 flex items-center justify-center p-4">
      {/* 装饰插画 */}
      <div className="absolute top-8 left-8 hidden lg:block animate-bounce" style={{ animationDuration: "3s" }}>
        <PiggyBankGirl size={80} />
      </div>

      <Card className="w-full max-w-md border-2 border-macaron-pink/30 shadow-2xl">
        <CardContent className="p-8">
          {/* Logo和标题 */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-macaron-pink to-macaron-purple rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-4xl">💰</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2 font-cute">
              {isLogin ? "欢迎回来" : "加入小财进"}
            </h1>
            <p className="text-gray-600 text-sm">
              {isLogin ? "登录继续你的理财之旅" : "开启你的财富成长之路"}
            </p>
          </div>

          {/* 切换登录/注册 */}
          <div className="flex mb-6 bg-macaron-cream p-1 rounded-2xl">
            <button
              onClick={() => {
                setIsLogin(true);
                setError("");
              }}
              className={`flex-1 py-2 rounded-xl font-cute transition-all ${
                isLogin
                  ? "bg-macaron-pink text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              登录
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError("");
              }}
              className={`flex-1 py-2 rounded-xl font-cute transition-all ${
                !isLogin
                  ? "bg-macaron-purple text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              注册
            </button>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  用户名
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="给自己起个可爱的名字"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                邮箱
              </label>
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                密码
              </label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="至少6位"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  确认密码
                </label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="再次输入密码"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            {/* 错误提示 */}
            {error && (
              <div className="bg-macaron-blue/10 border border-macaron-blue/30 text-macaron-blue px-4 py-2 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            {/* 成功提示 */}
            {success && (
              <div className="bg-macaron-green/10 border border-macaron-green/30 text-macaron-green px-4 py-2 rounded-xl text-sm text-center">
                🎉 注册成功！正在跳转...
              </div>
            )}

            {/* 提交按钮 */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-macaron-pink to-macaron-purple hover:from-macaron-pink/90 hover:to-macaron-purple/90 text-white font-cute font-bold py-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  处理中...
                </span>
              ) : (
                isLogin ? "登录" : "注册"
              )}
            </Button>
          </form>

          {/* 底部链接 */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-macaron-pink hover:underline">
              ← 返回首页
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
