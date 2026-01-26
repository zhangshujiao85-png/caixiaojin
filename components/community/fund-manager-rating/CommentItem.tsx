"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserRating } from "@/types/fundManager";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommentItemProps {
  rating: UserRating;
  canDelete: boolean;
  onDelete: (ratingId: string) => void;
}

export function CommentItem({ rating, canDelete, onDelete }: CommentItemProps) {
  const getRatingColor = (score: number) => {
    if (score >= 9) return "text-macaron-green";
    if (score >= 8) return "text-macaron-blue";
    if (score >= 7) return "text-macaron-purple";
    if (score >= 6) return "text-macaron-yellow";
    return "text-macaron-pink";
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "今天";
    if (diffDays === 1) return "昨天";
    if (diffDays < 7) return `${diffDays}天前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}月前`;
    return `${Math.floor(diffDays / 365)}年前`;
  };

  return (
    <Card className="border-macaron-pink/10 p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-macaron-pink to-macaron-purple flex items-center justify-center text-white text-sm font-bold">
            {rating.isAnonymous ? "匿" : "用"}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">
              {rating.isAnonymous ? "匿名用户" : "用户"}
            </p>
            <p className="text-xs text-gray-500">{formatTime(rating.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-lg font-bold",
              getRatingColor(rating.score)
            )}
          >
            {rating.score}分
          </span>
          {canDelete && (
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
              onClick={() => onDelete(rating.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {rating.comment && (
        <p className="text-gray-700 text-sm mb-2">{rating.comment}</p>
      )}

      {rating.ratingTags && rating.ratingTags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {rating.ratingTags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-macaron-purple/20 text-macaron-purple text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}
