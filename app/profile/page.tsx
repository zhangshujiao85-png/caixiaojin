"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  BookOpen,
  MessageSquare,
  Heart,
  TrendingUp,
  Settings,
  LogOut,
  Users,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useLearningProgress } from "@/store/useLearningProgress";
import { useDailyCheckInStore } from "@/store/useDailyCheckInStore";
import { dailyQuotes } from "@/data/dailyQuotes";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"collections" | "posts" | "portfolio" | "following" | "quotes">(
    "collections"
  );
  const { totalPoints, level, currentLevelProgress, todayPoints, skills } = useLearningProgress();
  const { favoriteQuotes, toggleFavorite, isFavorite } = useDailyCheckInStore();

  // Mock data
  const user = {
    username: "小财友",
    email: "demo@example.com",
    level: "beginner",
    joinDate: "2024-01-15",
    avatar: null,
  };

  const stats = {
    collectionsCount: 12,
    postsCount: 5,
    followingCount: 28,
    simulationDays: 30,
  };

  // 模拟好友关注列表
  const followingUsers = [
    { id: "1", username: "小财友", level: "Lv.3", avatar: null },
    { id: "2", username: "理财达人", level: "Lv.5", avatar: null },
    { id: "3", username: "定投小能手", level: "Lv.4", avatar: null },
    { id: "4", username: "投资新星", level: "Lv.2", avatar: null },
    { id: "5", username: "稳健理财", level: "Lv.6", avatar: null },
  ];

  const collections = [
    {
      id: "1",
      type: "article",
      title: "定投是什么？像攒钱一样简单",
      summary: "定投就是在固定的时间，用固定的金额...",
      createdAt: "2024-01-20",
    },
    {
      id: "2",
      type: "article",
      title: "基金类型大盘点",
      summary: "买基金前先搞懂类型...",
      createdAt: "2024-01-18",
    },
    {
      id: "3",
      type: "post",
      title: "我的定投日记：坚持3个月啦",
      summary: "从3个月前开始定投...",
      createdAt: "2024-01-15",
    },
  ];

  const posts = [
    {
      id: "1",
      title: "我的定投日记：坚持3个月啦",
      content: "从3个月前开始定投...",
      likeCount: 234,
      commentCount: 45,
      createdAt: "2024-01-20",
    },
    {
      id: "2",
      title: "新手求指点",
      content: "刚刚入手了第一只基金...",
      likeCount: 156,
      commentCount: 67,
      createdAt: "2024-01-18",
    },
  ];

  const tabs = [
    { value: "collections", label: "我的收藏", icon: BookOpen },
    { value: "posts", label: "我的发布", icon: MessageSquare },
    { value: "portfolio", label: "我的组合", icon: TrendingUp },
    { value: "quotes", label: "收藏的句子", icon: Heart },
  ];

  return (
    <div className="min-h-screen py-8 md:py-12 relative">
      {/* 花草装饰 - 左上角 */}
      <div className="fixed top-20 left-4 text-5xl animate-pulse-slow z-10 hidden md:block" style={{ animationDuration: "3s" }}>
        🌸
      </div>
      {/* 花草装饰 - 右上角 */}
      <div className="fixed top-20 right-4 text-5xl animate-pulse-slow z-10 hidden md:block" style={{ animationDuration: "3.5s" }}>
        🌺
      </div>
      {/* 花草装饰 - 左下角 */}
      <div className="fixed bottom-8 left-4 text-4xl animate-bounce z-10 hidden md:block" style={{ animationDuration: "2.5s" }}>
        🌷
      </div>
      {/* 花草装饰 - 右下角 */}
      <div className="fixed bottom-8 right-4 text-4xl animate-bounce z-10 hidden md:block" style={{ animationDuration: "3s" }}>
        🌻
      </div>

      <div className="container mx-auto px-4 md:px-6">
        {/* Profile Header - 带花朵装饰 */}
        <Card className="mb-6 border-macaron-pink/20 relative">
          {/* 装饰花朵 - 卡片左上 */}
          <div className="absolute -top-4 -left-2 text-4xl">🌸</div>
          {/* 装饰花朵 - 卡片右上 */}
          <div className="absolute -top-4 -right-2 text-4xl">💐</div>
          {/* 装饰藤蔓 - 卡片左下 */}
          <div className="absolute -bottom-3 -left-2 text-3xl">🌿</div>
          {/* 装饰花朵 - 卡片右下 */}
          <div className="absolute -bottom-3 -right-2 text-3xl">🌼</div>

          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="bg-macaron-pink text-white text-2xl">
                  {user.username.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-1">
                      {user.username}
                    </h1>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Settings className="w-4 h-4" />
                    设置
                  </Button>
                </div>
                <div className="flex flex-wrap gap-4 md:gap-6">
                  <div>
                    <p className="text-2xl font-bold text-macaron-pink">
                      {stats.collectionsCount}
                    </p>
                    <p className="text-xs text-gray-600">收藏</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-macaron-pink">
                      {stats.postsCount}
                    </p>
                    <p className="text-xs text-gray-600">发布</p>
                  </div>
                  <div
                    className="cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => setActiveTab("following")}
                  >
                    <p className="text-2xl font-bold text-macaron-pink">
                      {stats.followingCount}
                    </p>
                    <p className="text-xs text-gray-600">关注</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-macaron-pink">
                      {stats.simulationDays}
                    </p>
                    <p className="text-xs text-gray-600">模拟交易天数</p>
                  </div>
                </div>

                {/* 财富等级展示 - 移到这里 */}
                <div className="mt-4 md:mt-6 p-4 bg-gradient-to-br from-macaron-pink/10 to-macaron-purple/10 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-macaron-pink" />
                      <span className="font-bold text-gray-800 font-cute">财富等级</span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-macaron-pink">Lv.{level}</p>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-macaron-pink via-macaron-purple to-macaron-blue transition-all duration-500"
                      style={{ width: `${currentLevelProgress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>今日积分: +{todayPoints}</span>
                    <span>总积分: {totalPoints}</span>
                  </div>
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 rounded-full bg-macaron-pink/20 text-macaron-pink text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <Card
            className="hover:shadow-md transition-shadow cursor-pointer border-macaron-pink/20"
            onClick={() => setActiveTab("following")}
          >
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-macaron-purple mx-auto mb-2" />
              <p className="font-medium text-sm">我的关注</p>
            </CardContent>
          </Card>
          <Card
            className="hover:shadow-md transition-shadow cursor-pointer border-macaron-pink/20"
            onClick={() => setActiveTab("collections")}
          >
            <CardContent className="p-4 text-center">
              <Heart className="w-8 h-8 text-macaron-pink mx-auto mb-2" />
              <p className="font-medium text-sm">我的收藏</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-macaron-pink/20">
            <CardContent className="p-4 text-center">
              <MessageSquare className="w-8 h-8 text-macaron-blue mx-auto mb-2" />
              <p className="font-medium text-sm">我的消息</p>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Card className="border-macaron-pink/20 relative">
          {/* 装饰花朵 - 卡片左上 */}
          <div className="absolute -top-3 -left-2 text-3xl">🌸</div>
          {/* 装饰花朵 - 卡片右上 */}
          <div className="absolute -top-3 -right-2 text-3xl">🌺</div>

          <CardHeader>
            <div className="flex gap-2 border-b border-gray-200">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value as any)}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                      activeTab === tab.value
                        ? "border-macaron-pink text-macaron-pink"
                        : "border-transparent text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </CardHeader>
          <CardContent>
            {activeTab === "collections" && (
              <div className="space-y-3">
                {collections.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">还没有收藏任何内容</p>
                  </div>
                ) : (
                  collections.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-macaron-cream rounded-card hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 mb-1">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {item.summary}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {item.createdAt}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "posts" && (
              <div className="space-y-3">
                {posts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">还没有发布任何帖子</p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <div
                      key={post.id}
                      className="p-4 bg-macaron-cream rounded-card hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <h3 className="font-semibold text-gray-800 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{post.likeCount} 点赞</span>
                        <span>{post.commentCount} 评论</span>
                        <span>{post.createdAt}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "portfolio" && (
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">我的投资组合</p>
                <p className="text-sm text-gray-400 mb-4">
                  创建你的第一个投资组合，追踪收益表现～
                </p>
                <Link href="/tools/simulation">
                  <Button className="bg-macaron-pink hover:bg-macaron-pink/90">
                    开始模拟投资
                  </Button>
                </Link>
              </div>
            )}

            {activeTab === "following" && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {followingUsers.map((user) => (
                    <div
                      key={user.id}
                      className="p-4 bg-macaron-cream rounded-card hover:shadow-md transition-all cursor-pointer flex items-center gap-3"
                    >
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-macaron-green text-white font-cute">
                          {user.username.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">
                          {user.username}
                        </h3>
                        <p className="text-xs text-macaron-pink font-medium">
                          {user.level}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs border-macaron-pink/30 hover:bg-macaron-pink/10"
                      >
                        查看
                      </Button>
                    </div>
                  ))}
                </div>
                {followingUsers.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">还没有关注任何人</p>
                    <p className="text-sm text-gray-400 mt-1">
                      去社区发现有趣的小伙伴吧～
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "quotes" && (
              <div>
                <div className="grid grid-cols-1 gap-4">
                  {favoriteQuotes.length === 0 ? (
                    <div className="text-center py-12 relative">
                      {/* 花朵装饰 */}
                      <div className="absolute top-4 left-8 text-3xl animate-pulse-slow">🌸</div>
                      <div className="absolute top-4 right-8 text-3xl animate-pulse-slow" style={{ animationDuration: "2s" }}>🌺</div>
                      <div className="absolute bottom-4 left-12 text-2xl animate-bounce" style={{ animationDuration: "2.5s" }}>🌷</div>
                      <div className="absolute bottom-4 right-12 text-2xl animate-bounce" style={{ animationDuration: "3s" }}>🌼</div>

                      <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-2">还没有收藏任何句子</p>
                      <p className="text-sm text-gray-400">
                        去主页签到，发现喜欢的句子并收藏吧～
                      </p>
                    </div>
                  ) : (
                    favoriteQuotes.map((quoteId) => {
                      const quote = dailyQuotes.find((q) => q.id === quoteId);
                      if (!quote) return null;

                      return (
                        <div
                          key={quote.id}
                          className="p-6 bg-gradient-to-br from-macaron-cream to-macaron-pink/10 rounded-2xl border-2 border-macaron-pink/20 relative hover:shadow-md transition-all"
                        >
                          <button
                            onClick={() => toggleFavorite(quote.id)}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all bg-macaron-pink text-white shadow-md hover:scale-110"
                            title="取消收藏"
                          >
                            <Heart className="w-4 h-4 fill-current" />
                          </button>

                          <div className="text-4xl mb-3">{quote.emoji}</div>

                          <p className="text-lg text-gray-800 font-cute leading-relaxed mb-3">
                            "{quote.quote}"
                          </p>

                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">—— {quote.author}</p>
                            <div className="flex gap-2">
                              <span className="text-xs bg-macaron-pink/20 text-macaron-pink px-2 py-1 rounded-full">
                                {quote.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Logout Button */}
        <div className="mt-6 text-center">
          <Button variant="outline" className="gap-2">
            <LogOut className="w-4 h-4" />
            退出登录
          </Button>
        </div>
      </div>
    </div>
  );
}
