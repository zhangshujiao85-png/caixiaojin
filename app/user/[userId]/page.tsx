"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Heart, MessageSquare, Calendar, UserCheck, UserPlus } from "lucide-react";
import { PostCard, Post } from "@/components/community/PostCard";
import { useAuth } from "@/store/useAuth";

// 为静态导出生成参数
export async function generateStaticParams() {
  return [
    { userId: "user1" },
    { userId: "user2" },
    { userId: "user3" },
    { userId: "user4" },
  ];
}

// Mock user data
const mockUsers: Record<string, any> = {
  user1: {
    id: "user1",
    username: "小财友",
    bio: "理财新手，正在学习中~",
    joinDate: "2024-01-15",
    level: 3,
    followerCount: 128,
    followingCount: 56,
    postCount: 12,
    avatar: null,
  },
  user2: {
    id: "user2",
    username: "理财小白",
    bio: "新手求带！一起学习理财",
    joinDate: "2024-01-10",
    level: 2,
    followerCount: 45,
    followingCount: 89,
    postCount: 8,
    avatar: null,
  },
  user3: {
    id: "user3",
    username: "稳稳的幸福",
    bio: "稳健投资，长期持有",
    joinDate: "2024-01-01",
    level: 5,
    followerCount: 256,
    followingCount: 34,
    postCount: 23,
    avatar: null,
  },
  user4: {
    id: "user4",
    username: "长期主义者",
    bio: "相信复利的力量",
    joinDate: "2023-12-20",
    level: 6,
    followerCount: 312,
    followingCount: 28,
    postCount: 31,
    avatar: null,
  },
};

// Mock posts data
const mockPostsByUser: Record<string, Post[]> = {
  user1: [
    {
      id: "1",
      title: "我的定投日记：坚持3个月啦",
      content: "从3个月前开始定投，每个月500块，虽然收益不多，但看到账户慢慢变多很有成就感！坚持就是胜利～",
      images: [],
      category: "定投心得",
      user: { id: "user1", username: "小财友" },
      likeCount: 234,
      commentCount: 45,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ],
  user2: [
    {
      id: "2",
      title: "新手第一次买基金，求指点",
      content: "刚刚入手了第一只基金，有点紧张又有点期待。大家都定投的哪些呀？求推荐～",
      images: [],
      category: "新手提问",
      user: { id: "user2", username: "理财小白" },
      likeCount: 156,
      commentCount: 67,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  ],
  user3: [
    {
      id: "3",
      title: "止盈了！半年赚了15%",
      content: "今天止盈了一部分，虽然不多，但这是我的第一笔收益！",
      images: [],
      category: "收益分享",
      user: { id: "user3", username: "稳稳的幸福" },
      likeCount: 445,
      commentCount: 89,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  ],
  user4: [
    {
      id: "4",
      title: "市场大跌，我是这么做的",
      content: "这几天市场跌了不少，我看到很多人都在恐慌。其实我是这样做的：继续定投，不停止...",
      images: [],
      category: "经验分享",
      user: { id: "user4", username: "长期主义者" },
      likeCount: 567,
      commentCount: 123,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
  ],
};

export default function UserProfilePage({ params }: { params: { userId: string } }) {
  const router = useRouter();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);

  const userId = params.userId;
  const profileUser = mockUsers[userId] || mockUsers.user1;
  const userPosts = mockPostsByUser[userId] || [];

  // 检查是否已关注
  useEffect(() => {
    const following = JSON.parse(localStorage.getItem("following") || "[]");
    setIsFollowing(following.includes(userId));
  }, [userId]);

  const handleFollowToggle = () => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }

    const following = JSON.parse(localStorage.getItem("following") || "[]");

    if (isFollowing) {
      // 取消关注
      const newFollowing = following.filter((id: string) => id !== userId);
      localStorage.setItem("following", JSON.stringify(newFollowing));
      setIsFollowing(false);
    } else {
      // 关注
      following.push(userId);
      localStorage.setItem("following", JSON.stringify(following));
      setIsFollowing(true);
    }
  };

  const isOwnProfile = currentUser?.id === userId;

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        {/* 返回按钮 */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </Button>

        {/* 用户信息卡片 */}
        <Card className="border-2 border-macaron-pink/30 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* 头像 */}
              <Avatar className="w-24 h-24">
                <AvatarFallback className="bg-macaron-pink text-white text-3xl font-cute">
                  {profileUser.username.charAt(0)}
                </AvatarFallback>
              </Avatar>

              {/* 用户信息 */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-1 font-cute flex items-center gap-2">
                      {profileUser.username}
                      <span className="px-2 py-1 rounded-full bg-macaron-pink/20 text-macaron-pink text-xs">
                        Lv.{profileUser.level}
                      </span>
                    </h1>
                    <p className="text-gray-600 mb-2">{profileUser.bio}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      加入于 {profileUser.joinDate}
                    </p>
                  </div>

                  {/* 关注按钮 */}
                  {!isOwnProfile && (
                    <Button
                      onClick={handleFollowToggle}
                      variant={isFollowing ? "outline" : "default"}
                      className={
                        isFollowing
                          ? "border-macaron-pink/30 text-macaron-pink hover:bg-macaron-pink/10"
                          : "bg-macaron-pink hover:bg-macaron-pink/90"
                      }
                    >
                      {isFollowing ? (
                        <>
                          <UserCheck className="w-4 h-4 mr-2" />
                          已关注
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          关注
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {/* 统计信息 */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-macaron-cream rounded-xl">
                    <p className="text-2xl font-bold text-macaron-pink">
                      {profileUser.postCount}
                    </p>
                    <p className="text-xs text-gray-600">帖子</p>
                  </div>
                  <div className="text-center p-3 bg-macaron-cream rounded-xl">
                    <p className="text-2xl font-bold text-macaron-purple">
                      {profileUser.followerCount}
                    </p>
                    <p className="text-xs text-gray-600">粉丝</p>
                  </div>
                  <div className="text-center p-3 bg-macaron-cream rounded-xl">
                    <p className="text-2xl font-bold text-macaron-green">
                      {profileUser.followingCount}
                    </p>
                    <p className="text-xs text-gray-600">关注</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 帖子列表 */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4 font-cute">
            📝 发布的帖子
          </h2>

          {userPosts.length === 0 ? (
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="py-12 text-center">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">还没有发布帖子</p>
                <p className="text-sm text-gray-400">快去社区看看吧~</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {userPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
