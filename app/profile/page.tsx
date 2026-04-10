"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  X,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useLearningProgress } from "@/store/useLearningProgress";
import { useDailyCheckInStore } from "@/store/useDailyCheckInStore";
import { useSavedPostsStore } from "@/store/useSavedPostsStore";
import { dailyQuotes } from "@/data/dailyQuotes";
import { PostCard } from "@/components/community/PostCard";

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"collections" | "posts" | "portfolio" | "following" | "quotes" | "messages">(
    "collections"
  );
  const { totalPoints, level, currentLevelProgress, todayPoints, skills } = useLearningProgress();
  const { favoriteQuotes, toggleFavorite, isFavorite } = useDailyCheckInStore();
  const { savedPostIds } = useSavedPostsStore();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");

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

  // 所有可用的帖子数据（模拟"她说"社区的帖子）
  const allPosts = [
    {
      id: "1",
      title: "我的定投日记：坚持3个月啦",
      content: "从3个月前开始定投，每个月500块，虽然收益不多，但看到账户慢慢变多很有成就感！坚持就是胜利～",
      images: [],
      category: "定投心得",
      user: { id: "1", username: "小财友" },
      likeCount: 234,
      commentCount: 45,
      createdAt: new Date("2024-01-20"),
    },
    {
      id: "2",
      title: "新手第一次买基金，求指点",
      content: "刚刚入手了第一只基金，有点紧张又有点期待。大家都定投的哪些呀？求推荐～",
      images: [],
      category: "新手提问",
      user: { id: "2", username: "理财达人" },
      likeCount: 156,
      commentCount: 67,
      createdAt: new Date("2024-01-18"),
    },
    {
      id: "3",
      title: "止盈了！半年赚了15%",
      content: "今天止盈了一部分，虽然不多，但这是我的第一笔收益！分享一下我的经验：坚持定投，设置好止盈点，达到目标就卖出一部分。",
      images: [],
      category: "收益分享",
      user: { id: "3", username: "定投小能手" },
      likeCount: 445,
      commentCount: 89,
      createdAt: new Date("2024-01-15"),
    },
    {
      id: "4",
      title: "市场大跌，我是这么做的",
      content: "这几天市场跌了不少，我看到很多人都在恐慌。其实我是这样做的：继续定投，不停止。相信长期价值投资！",
      images: [],
      category: "经验分享",
      user: { id: "4", username: "投资新星" },
      likeCount: 567,
      commentCount: 123,
      createdAt: new Date("2024-01-10"),
    },
  ];

  // 根据收藏状态过滤帖子
  const savedPosts = allPosts.filter((post) => savedPostIds.includes(post.id));

  // 用户发布的帖子（模拟数据）
  const posts = [
    {
      id: "1",
      title: "我的定投日记：坚持3个月啦",
      content: "从3个月前开始定投，每个月500块，虽然收益不多，但看到账户慢慢变多很有成就感！坚持就是胜利～",
      likeCount: 234,
      commentCount: 45,
      createdAt: "2024-01-20",
    },
  ];

  // 初始对话数据
  const initialConversations = [
    {
      id: "1",
      userId: "2",
      username: "理财达人",
      avatar: null,
      lastMessage: "好的，我分享一下我的定投经验~",
      time: "5分钟前",
      unreadCount: 2,
      messages: [
        { id: "1", sender: "them", content: "你好！看到你发布的定投日记了", time: "10:30" },
        { id: "2", sender: "me", content: "谢谢！我坚持了3个月了", time: "10:32" },
        { id: "3", sender: "them", content: "太棒了！我也在定投，可以交流一下吗？", time: "10:35" },
        { id: "4", sender: "me", content: "当然可以！我想请教一下基金选择", time: "10:36" },
        { id: "5", sender: "them", content: "好的，我分享一下我的定投经验~", time: "10:38" },
      ],
    },
    {
      id: "2",
      userId: "3",
      username: "定投小能手",
      avatar: null,
      lastMessage: "谢谢你的建议！",
      time: "1小时前",
      unreadCount: 0,
      messages: [
        { id: "1", sender: "me", content: "你好，请问新手定投应该注意什么？", time: "09:00" },
        { id: "2", sender: "them", content: "建议先从指数基金开始，长期坚持", time: "09:15" },
        { id: "3", sender: "me", content: "明白了，我会坚持的", time: "09:20" },
        { id: "4", sender: "them", content: "有需要随时问我", time: "09:21" },
        { id: "5", sender: "me", content: "谢谢你的建议！", time: "09:25" },
      ],
    },
    {
      id: "3",
      userId: "4",
      username: "投资新星",
      avatar: null,
      lastMessage: "我们一起加油！",
      time: "昨天",
      unreadCount: 0,
      messages: [
        { id: "1", sender: "them", content: "你好呀，我也是理财新手", time: "昨天 15:00" },
        { id: "2", sender: "me", content: "你好！一起学习交流", time: "昨天 15:10" },
        { id: "3", sender: "them", content: "我们一起加油！", time: "昨天 15:12" },
      ],
    },
  ];

  // 初始化对话列表状态
  const [conversationsList, setConversationsList] = useState(initialConversations);

  // 发送消息函数
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: "me" as const,
      content: messageInput,
      time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
    };

    // 更新对话列表
    setConversationsList((prev) =>
      prev.map((conv) => {
        if (conv.id === selectedConversation) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: messageInput,
            time: "刚刚",
          };
        }
        return conv;
      })
    );

    // 清空输入框
    setMessageInput("");

    // 模拟对方自动回复
    setTimeout(() => {
      const autoReplies = [
        "好的，收到！",
        "明白了~",
        "好的，我看看",
        "谢谢你告诉我",
        "我们一起加油！",
      ];
      const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];

      const replyMessage = {
        id: (Date.now() + 1).toString(),
        sender: "them" as const,
        content: randomReply,
        time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
      };

      setConversationsList((prev) =>
        prev.map((conv) => {
          if (conv.id === selectedConversation) {
            return {
              ...conv,
              messages: [...conv.messages, replyMessage],
              lastMessage: randomReply,
              time: "刚刚",
            };
          }
          return conv;
        })
      );
    }, 1500);
  };

  const tabs = [
    { value: "collections", label: "知识", icon: BookOpen },
    { value: "portfolio", label: "帖子", icon: MessageSquare },
    { value: "quotes", label: "句子", icon: Heart },
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
          <Card
            className="hover:shadow-md transition-shadow cursor-pointer border-macaron-pink/20"
            onClick={() => setActiveTab("posts")}
          >
            <CardContent className="p-4 text-center">
              <MessageSquare className="w-8 h-8 text-macaron-green mx-auto mb-2" />
              <p className="font-medium text-sm">我的发布</p>
            </CardContent>
          </Card>
          <Card
            className="hover:shadow-md transition-shadow cursor-pointer border-macaron-pink/20"
            onClick={() => setActiveTab("messages")}
          >
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
            {activeTab !== "following" && (
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
            )}
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
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4 font-cute">
                  💖 收藏的帖子
                </h2>
                {savedPosts.length === 0 ? (
                  <Card className="border-2 border-dashed border-gray-300">
                    <CardContent className="py-12 text-center">
                      <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-2">还没有收藏任何帖子</p>
                      <p className="text-sm text-gray-400">
                        去"她说"社区看看吧～
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {savedPosts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                )}
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
                        onClick={() => router.push(`/user/${user.id}`)}
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

            {activeTab === "messages" && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4 font-cute">
                  💬 消息
                </h2>
                {conversationsList.length === 0 ? (
                  <Card className="border-2 border-dashed border-gray-300">
                    <CardContent className="py-12 text-center">
                      <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-2">还没有消息</p>
                      <p className="text-sm text-gray-400">
                        去社区和小伙伴交流吧～
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {conversationsList.map((conv) => (
                      <div
                        key={conv.id}
                        onClick={() => {
                          setSelectedConversation(conv.id);
                          // 清空未读消息
                          if (conv.unreadCount > 0) {
                            setConversationsList(prev =>
                              prev.map(c =>
                                c.id === conv.id ? { ...c, unreadCount: 0 } : c
                              )
                            );
                          }
                        }}
                        className="bg-macaron-cream rounded-2xl p-4 hover:shadow-md transition-all cursor-pointer border-2 border-transparent hover:border-macaron-pink/30"
                      >
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <div className="relative">
                            <Avatar className="w-12 h-12">
                              <AvatarFallback className="bg-macaron-purple text-white font-cute">
                                {conv.username.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            {conv.unreadCount > 0 && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-macaron-pink rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {conv.unreadCount}
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-gray-800">
                                {conv.username}
                              </h3>
                              <span className="text-xs text-gray-500">{conv.time}</span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {conv.lastMessage}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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

      {/* 对话详情弹窗 */}
      {selectedConversation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col">
            {/* 头部 */}
            <div className="p-4 bg-gradient-to-r from-macaron-blue to-macaron-purple border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-white text-macaron-purple font-bold">
                    {conversationsList.find(c => c.id === selectedConversation)?.username.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white font-cute">
                    {conversationsList.find(c => c.id === selectedConversation)?.username}
                  </h3>
                  <p className="text-white/80 text-xs">在线</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedConversation(null);
                    setMessageInput("");
                  }}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 消息内容 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {conversationsList.find(c => c.id === selectedConversation)?.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                      msg.sender === 'me'
                        ? 'bg-macaron-blue text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-blue-100' : 'text-gray-400'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 输入框 */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="输入消息..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                  className="flex-1 px-4 py-2 border-2 border-macaron-blue/20 rounded-full focus:outline-none focus:border-macaron-blue/50"
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-macaron-blue hover:bg-macaron-blue/90 rounded-full px-6"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
