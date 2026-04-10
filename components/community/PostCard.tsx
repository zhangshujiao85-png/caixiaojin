"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Heart, MessageCircle, Bookmark, Share2 } from "lucide-react";
import { formatNumber, formatDate } from "@/lib/utils";
import Image from "next/image";
import { useSavedPostsStore } from "@/store/useSavedPostsStore";

export interface Post {
  id: string;
  title: string;
  content: string;
  images: string[];
  category: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
  likeCount: number;
  commentCount: number;
  createdAt: Date;
  isLiked?: boolean;
  isBookmarked?: boolean;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  user: {
    id: string;
    username: string;
  };
  createdAt: string;
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const { isPostSaved, toggleSavePost } = useSavedPostsStore();
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState<Comment[]>(post.comments || []);

  // 使用 store 中的收藏状态
  const isBookmarked = isPostSaved(post.id);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleBookmark = () => {
    toggleSavePost(post.id);
  };

  const handleAddComment = () => {
    if (!commentInput.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      content: commentInput,
      user: {
        id: "current",
        username: "我",
      },
      createdAt: new Date().toISOString(),
    };

    setComments([...comments, newComment]);
    setCommentInput("");
  };

  // 实际评论数
  const actualCommentCount = comments.length;

  return (
    <Card className="border-macaron-pink/20 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        <button
          onClick={() => router.push(`/user/${post.user.id}`)}
          className="flex-shrink-0"
        >
          <div className="w-10 h-10 rounded-full bg-macaron-green flex items-center justify-center hover:ring-2 hover:ring-macaron-pink transition-all">
            <span className="text-white font-medium">
              {post.user.username.charAt(0)}
            </span>
          </div>
        </button>
        <button
          onClick={() => router.push(`/user/${post.user.id}`)}
          className="flex-1 min-w-0 text-left"
        >
          <p className="font-medium text-gray-800 truncate hover:text-macaron-pink transition-colors">
            {post.user.username}
          </p>
          <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
        </button>
        <span className="px-3 py-1 rounded-full text-xs bg-macaron-pink/20 text-macaron-pink">
          {post.category}
        </span>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <h3 className="font-semibold text-gray-800 mb-2">{post.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-3">{post.content}</p>
      </div>

      {/* Images */}
      {post.images.length > 0 && (
        <div className="grid gap-1 px-4 pb-3">
          <div className="grid gap-1">
            {post.images.slice(0, 3).map((image, index) => (
              <div
                key={index}
                className="relative aspect-video rounded-lg overflow-hidden bg-gray-100"
              >
                <img
                  src={image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className="flex items-center gap-1.5 text-gray-600 hover:text-macaron-pink transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${isLiked ? "fill-macaron-pink text-macaron-pink" : ""}`}
              />
              <span className="text-sm">{formatNumber(likeCount)}</span>
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1.5 text-gray-600 hover:text-macaron-pink transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">{formatNumber(actualCommentCount)}</span>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleBookmark}
              className="text-gray-600 hover:text-macaron-pink transition-colors"
            >
              <Bookmark
                className={`w-5 h-5 ${isBookmarked ? "fill-macaron-pink text-macaron-pink" : ""}`}
              />
            </button>
            <button className="text-gray-600 hover:text-macaron-pink transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section (Expandable) */}
      {showComments && (
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <div className="space-y-4">
            {/* 评论列表 */}
            {comments.length > 0 && (
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-macaron-purple flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-medium">
                        {comment.user.username.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 bg-white rounded-lg p-3 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm text-gray-800">
                          {comment.user.username}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 添加评论 */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-macaron-blue flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-medium">我</span>
              </div>
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  placeholder="说点什么..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddComment();
                    }
                  }}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-macaron-pink"
                />
                <button
                  onClick={handleAddComment}
                  className="px-4 py-2 bg-macaron-pink text-white text-sm rounded-lg hover:bg-macaron-pink/90 transition-colors"
                >
                  发送
                </button>
              </div>
            </div>

            {comments.length === 0 && (
              <div className="text-center text-sm text-gray-500">
                暂无评论，快来抢沙发～
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
