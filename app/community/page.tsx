"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PostCard } from "@/components/community/PostCard";
import { CreatePostDialog } from "@/components/community/CreatePostDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Plus, Filter, Star, TrendingUp, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/store/useAuth";

// Mock data
const mockPosts = [
  {
    id: "1",
    title: "我的定投日记：坚持3个月啦",
    content: "从3个月前开始定投，每个月500块，虽然收益不多，但看到账户慢慢变多很有成就感！坚持就是胜利～\n\n刚开始的时候看到市场下跌还挺担心的，后来发现坚持定投真的能平滑波动。现在看到收益慢慢变正，很开心！",
    images: [],
    category: "定投心得",
    user: {
      id: "user1",
      username: "小财友",
    },
    likeCount: 234,
    commentCount: 45,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    title: "新手第一次买基金，求指点",
    content: "刚刚入手了第一只基金，有点紧张又有点期待。大家都定投的哪些呀？求推荐～\n\n我是上班族，每个月能拿出1000左右，想长期投资，不知道选什么类型的基金好。",
    images: [],
    category: "新手提问",
    user: {
      id: "user2",
      username: "理财小白",
    },
    likeCount: 156,
    commentCount: 67,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "3",
    title: "止盈了！半年赚了15%",
    content: "今天止盈了一部分，虽然不多，但这是我的第一笔收益！\n\n分享一下我的经验：坚持定投，设置好止盈点，达到目标就卖出一部分。这样既能保住收益，又能继续投资。",
    images: [],
    category: "收益分享",
    user: {
      id: "user3",
      username: "稳稳的幸福",
    },
    likeCount: 445,
    commentCount: 89,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: "4",
    title: "市场大跌，我是这么做的",
    content: "这几天市场跌了不少，我看到很多人都在恐慌。其实我是这样做的：\n\n1. 继续定投，不停止\n2. 甚至稍微加了一点定投金额\n3. 不看账户，避免情绪影响\n\n相信长期价值，不要被短期波动影响了判断！",
    images: [],
    category: "经验分享",
    user: {
      id: "user4",
      username: "长期主义者",
    },
    likeCount: 567,
    commentCount: 123,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
];

const categories = [
  { value: "all", label: "全部" },
  { value: "定投心得", label: "定投心得" },
  { value: "新手提问", label: "新手提问" },
  { value: "收益分享", label: "收益分享" },
  { value: "经验分享", label: "经验分享" },
];

export default function CommunityPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"all" | "following">("all");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [posts, setPosts] = useState(mockPosts);

  // 模拟关注的用户ID
  const followingUserIds = ["user1", "user3"];

  // 加载本地存储的帖子
  useEffect(() => {
    const storedPosts = localStorage.getItem("posts");
    if (storedPosts) {
      const parsedPosts = JSON.parse(storedPosts).map((post: any) => ({
        ...post,
        user: {
          id: user?.id || "current",
          username: user?.username || "我",
        },
        likeCount: 0,
        commentCount: 0,
        createdAt: new Date(post.createdAt),
      }));
      setPosts([...parsedPosts, ...mockPosts]);
    }
  }, [user]);

  const handlePostCreated = () => {
    // 重新加载帖子
    const storedPosts = localStorage.getItem("posts");
    if (storedPosts) {
      const parsedPosts = JSON.parse(storedPosts).map((post: any) => ({
        ...post,
        user: {
          id: user?.id || "current",
          username: user?.username || "我",
        },
        likeCount: 0,
        commentCount: 0,
        createdAt: new Date(post.createdAt),
      }));
      setPosts([...parsedPosts, ...mockPosts]);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesView =
      viewMode === "all" || followingUserIds.includes(post.user.id);
    return matchesCategory && matchesSearch && matchesView;
  });

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                理财社区
              </h1>
              <p className="text-gray-600">
                和小伙伴一起交流心得，分享经验
              </p>
            </div>
            <Button
              onClick={() => setShowCreatePost(true)}
              className="bg-macaron-pink hover:bg-macaron-pink/90 text-white gap-2"
            >
              <Plus className="w-4 h-4" />
              发帖
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="搜索帖子..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* View Mode Toggle & Category Filter */}
        <div className="mb-6 space-y-3">
          {/* 全部/关注切换 */}
          <div className="flex items-center gap-2 p-1 bg-macaron-cream rounded-2xl w-fit">
            <Button
              size="sm"
              onClick={() => setViewMode("all")}
              className={`rounded-xl font-cute ${
                viewMode === "all"
                  ? "bg-macaron-pink text-white shadow-md"
                  : "bg-transparent text-gray-600 hover:bg-white/50"
              }`}
            >
              💬 全部动态
            </Button>
            <Button
              size="sm"
              onClick={() => setViewMode("following")}
              className={`rounded-xl font-cute ${
                viewMode === "following"
                  ? "bg-macaron-green text-white shadow-md"
                  : "bg-transparent text-gray-600 hover:bg-white/50"
              }`}
            >
              ❤️ 关注的人
            </Button>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className={`flex-shrink-0 font-cute ${
                  selectedCategory === category.value
                    ? "bg-macaron-pink hover:bg-macaron-pink/90 text-white"
                    : "bg-white border-macaron-pink/30 hover:bg-macaron-pink/10"
                }`}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* 基金经理评分入口 */}
        <Card
          className="mb-8 border-2 border-macaron-pink/30 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-r from-macaron-pink/10 via-macaron-cream to-macaron-yellow/10"
          onClick={() => router.push("/community/fund-manager-rating")}
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-macaron-pink to-macaron-purple flex items-center justify-center shadow-lg">
                  <Star className="w-8 h-8 text-white fill-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 font-cute mb-1">
                    ⭐ 基金经理评分
                  </h2>
                  <p className="text-gray-600">为你信赖的基金经理打分，看看谁最受欢迎~</p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-3">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-macaron-green">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-bold">30+</span>
                  </div>
                  <p className="text-xs text-gray-500">基金经理</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-macaron-yellow">
                    <Award className="w-4 h-4" />
                    <span className="font-bold">真实</span>
                  </div>
                  <p className="text-xs text-gray-500">用户评价</p>
                </div>
                <Button className="bg-macaron-pink hover:bg-macaron-pink/90 text-white font-cute">
                  立即评分 →
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">暂无相关帖子</p>
          </div>
        )}
      </div>

      {/* 用户故事/案例 Section */}
      <section className="py-8 md:py-12 bg-gradient-to-br from-macaron-pink/10 to-macaron-purple/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 font-cute">
              💬 用户故事
            </h2>
            <p className="text-gray-600">真实案例，看看姐妹们的理财故事</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-macaron-pink/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-macaron-pink to-macaron-purple flex items-center justify-center text-white font-bold text-lg">
                  小
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">小财友</h3>
                  <p className="text-sm text-gray-500">理财新手 · 学习30天</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                "刚开始觉得理财很难，但跟着小财进每天学一点，现在已经坚持定投3个月了。虽然赚的不多，但看到账户慢慢变多，真的很有成就感！"
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>💰 累计定投: ¥1,500</span>
                <span>📈 收益: +5.2%</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-macaron-green/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-macaron-green to-macaron-blue flex items-center justify-center text-white font-bold text-lg">
                  理
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">理财达人</h3>
                  <p className="text-sm text-gray-500">稳健投资 · 学习1年</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                "之前总是追涨杀跌，亏了不少。学会了定投和止盈后，现在心态平和多了。投资最重要的是心态，不是技术！"
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>💰 总资产: ¥25,000</span>
                <span>📈 年收益: +8%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 热门话题榜单 */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 font-cute">
              🔥 热门话题
            </h2>
            <p className="text-gray-600">最受关注的内容</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { rank: 1, title: "定投到底怎么选？", heat: "2.3万", trend: "up", color: "from-macaron-pink to-macaron-pink/80" },
              { rank: 2, title: "新手买什么基金好？", heat: "1.8万", trend: "up", color: "from-macaron-orange to-macaron-orange/80" },
              { rank: 3, title: "基金亏了怎么办？", heat: "1.5万", trend: "same", color: "from-macaron-yellow to-macaron-yellow/80" },
            ].map((topic) => (
              <div
                key={topic.rank}
                className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border-2 border-macaron-pink/20 hover:scale-105 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full bg-gradient-to-br",
                    topic.color,
                    "flex items-center justify-center text-white font-bold text-sm shadow-md"
                  )}>
                    {topic.rank}
                  </div>
                  <div className="flex items-center gap-1">
                    {topic.trend === "up" && <span className="text-macaron-green text-xs">↑</span>}
                    {topic.trend === "same" && <span className="text-gray-400 text-xs">-</span>}
                  </div>
                </div>
                <p className="font-bold text-gray-800 text-sm mb-1">{topic.title}</p>
                <p className="text-xs text-gray-500">
                  <span className="text-macaron-pink font-medium">{topic.heat}</span> 人关注
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 发帖对话框 */}
      <CreatePostDialog
        open={showCreatePost}
        onOpenChange={setShowCreatePost}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
}
