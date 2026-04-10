"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Heart, MessageSquare, Calendar, UserCheck, UserPlus, Send, X } from "lucide-react";
import { PostCard, Post } from "@/components/community/PostCard";
import { useAuth } from "@/store/useAuth";

interface UserProfilePageProps {
  userId: string;
}

export function UserProfilePage({ userId }: UserProfilePageProps) {
  const router = useRouter();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [messageContent, setMessageContent] = useState("");

  // Mock user data
  const mockUsers: Record<string, any> = {
    "1": {
      id: "1",
      username: "小财友",
      bio: "理财新手，正在学习中~",
      joinDate: "2024-01-15",
      level: 3,
      followerCount: 128,
      followingCount: 56,
      postCount: 12,
      avatar: null,
    },
    "2": {
      id: "2",
      username: "理财达人",
      bio: "稳健投资，长期持有",
      joinDate: "2024-01-10",
      level: 5,
      followerCount: 256,
      followingCount: 34,
      postCount: 23,
      avatar: null,
    },
    "3": {
      id: "3",
      username: "定投小能手",
      bio: "相信定投的力量",
      joinDate: "2024-01-01",
      level: 4,
      followerCount: 189,
      followingCount: 45,
      postCount: 18,
      avatar: null,
    },
    "4": {
      id: "4",
      username: "投资新星",
      bio: "学习理财的新手",
      joinDate: "2023-12-20",
      level: 2,
      followerCount: 67,
      followingCount: 78,
      postCount: 6,
      avatar: null,
    },
    "5": {
      id: "5",
      username: "稳健理财",
      bio: "稳扎稳打，慢慢积累",
      joinDate: "2023-12-15",
      level: 6,
      followerCount: 312,
      followingCount: 28,
      postCount: 31,
      avatar: null,
    },
  };

  // Mock posts data
  const mockPostsByUser: Record<string, Post[]> = {
    "1": [
      {
        id: "1",
        title: "我的定投日记：坚持3个月啦",
        content: "从3个月前开始定投，每个月500块，虽然收益不多，但看到账户慢慢变多很有成就感！坚持就是胜利～",
        images: [],
        category: "定投心得",
        user: { id: "1", username: "小财友" },
        likeCount: 234,
        commentCount: 45,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    ],
    "2": [
      {
        id: "2",
        title: "稳健投资策略分享",
        content: "分享一下我的稳健投资策略：分散投资、长期持有、定期调整。这样既能降低风险，又能获得稳定收益。",
        images: [],
        category: "经验分享",
        user: { id: "2", username: "理财达人" },
        likeCount: 189,
        commentCount: 67,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
    ],
    "3": [
      {
        id: "3",
        title: "定投3个月心得",
        content: "坚持定投3个月了，虽然收益不多，但是学会了坚持和耐心。理财最重要的是心态！",
        images: [],
        category: "定投心得",
        user: { id: "3", username: "定投小能手" },
        likeCount: 145,
        commentCount: 34,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    ],
    "4": [
      {
        id: "4",
        title: "新手求助：基金怎么选",
        content: "刚接触理财，想问问大家怎么选基金？有没有什么好的推荐？",
        images: [],
        category: "新手提问",
        user: { id: "4", username: "投资新星" },
        likeCount: 89,
        commentCount: 123,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
    ],
    "5": [
      {
        id: "5",
        title: "我的理财之路",
        content: "理财一年了，从最初的小白到现在的稳健投资，收获满满。分享一下我的经验：耐心、坚持、学习！",
        images: [],
        category: "经验分享",
        user: { id: "5", username: "稳健理财" },
        likeCount: 267,
        commentCount: 89,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
    ],
  };

  const profileUser = mockUsers[userId] || mockUsers["1"];
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
                    <div className="flex gap-2">
                      {/* 私信按钮 */}
                      <Button
                        onClick={() => {
                          if (!isAuthenticated) {
                            router.push("/auth");
                            return;
                          }
                          setShowMessageDialog(true);
                        }}
                        className="bg-macaron-pink hover:bg-macaron-pink/90"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        私信
                      </Button>

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
                    </div>
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

      {/* 私信对话框 */}
      {showMessageDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl animate-in fade-in zoom-in duration-300">
            {/* 头部 */}
            <div className="p-6 bg-gradient-to-r from-macaron-blue to-macaron-purple rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white font-cute flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    发送私信
                  </h3>
                  <p className="text-white/90 text-sm mt-1">
                    给 {profileUser.username} 发送消息
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowMessageDialog(false);
                    setMessageContent("");
                  }}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 内容 */}
            <div className="p-6">
              <textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="说点什么..."
                className="w-full h-32 p-4 border-2 border-macaron-blue/20 rounded-2xl focus:outline-none focus:border-macaron-blue/50 resize-none"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-2 text-right">
                {messageContent.length}/500
              </p>
            </div>

            {/* 底部按钮 */}
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <Button
                onClick={() => {
                  setShowMessageDialog(false);
                  setMessageContent("");
                }}
                variant="outline"
                className="flex-1"
              >
                取消
              </Button>
              <Button
                onClick={() => {
                  // 这里可以添加发送消息的逻辑
                  console.log("发送私信给", userId, ":", messageContent);

                  // 模拟发送成功
                  alert("消息已发送！");

                  // 关闭对话框并清空内容
                  setShowMessageDialog(false);
                  setMessageContent("");
                }}
                className="flex-1 bg-macaron-blue hover:bg-macaron-blue/90"
              >
                <Send className="w-4 h-4 mr-2" />
                发送
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
