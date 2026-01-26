"use client";

import { CommentItem } from "./CommentItem";
import { UserRating } from "@/types/fundManager";
import { MessageCircle } from "lucide-react";

interface CommentSectionProps {
  comments: UserRating[];
  currentUserId: string;
  onDeleteComment: (ratingId: string) => void;
}

export function CommentSection({
  comments,
  currentUserId,
  onDeleteComment,
}: CommentSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5 text-macaron-pink" />
        <h3 className="font-bold text-gray-800">
          用户评论 ({comments.length})
        </h3>
      </div>

      {comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">暂无评论，快来抢沙发~</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              rating={comment}
              canDelete={comment.userId === currentUserId}
              onDelete={onDeleteComment}
            />
          ))}
        </div>
      )}
    </div>
  );
}
