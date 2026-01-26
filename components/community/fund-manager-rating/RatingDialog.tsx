"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useFundManagerStore } from "@/store/fundManagerStore";
import { cn } from "@/lib/utils";

interface RatingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  managerId: string;
  managerName: string;
}

const ratingTags = [
  "长期主义",
  "稳健风格",
  "价值投资",
  "成长股猎手",
  "风控能力强",
  "新锐明星",
  "业绩稳健",
  "经验丰富",
];

export function RatingDialog({
  open,
  onOpenChange,
  managerId,
  managerName,
}: RatingDialogProps) {
  const { rateManager } = useFundManagerStore();
  const [selectedScore, setSelectedScore] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // 重置表单
  useEffect(() => {
    if (!open) {
      setSelectedScore(0);
      setSelectedTags([]);
      setComment("");
      setMessage(null);
    }
  }, [open]);

  const handleScoreClick = (score: number) => {
    setSelectedScore(score);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (selectedScore === 0) {
      setMessage({ type: "error", text: "请选择评分~" });
      return;
    }

    setIsSubmitting(true);
    const result = rateManager(managerId, selectedScore, comment, selectedTags);

    if (result.success) {
      setMessage({ type: "success", text: result.message });
      setTimeout(() => {
        onOpenChange(false);
      }, 1500);
    } else {
      setMessage({ type: "error", text: result.message });
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-cute text-2xl">
            为 {managerName} 评分
          </DialogTitle>
          <DialogDescription>
            选择1-10分，可选标签和填写评论
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 评分按钮 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              请评分 (1-10分)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                <Button
                  key={score}
                  type="button"
                  variant={selectedScore === score ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleScoreClick(score)}
                  className={cn(
                    "h-12 text-lg font-bold transition-all",
                    selectedScore === score
                      ? "bg-macaron-pink hover:bg-macaron-pink/90 text-white scale-105"
                      : "hover:bg-macaron-pink/10"
                  )}
                >
                  {score}
                </Button>
              ))}
            </div>
          </div>

          {/* 标签选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              选择标签（可选）
            </label>
            <div className="flex flex-wrap gap-2">
              {ratingTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                    selectedTags.includes(tag)
                      ? "bg-macaron-purple text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* 评论输入 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              写下你的想法（可选）
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="分享你对这位基金经理的看法..."
              rows={4}
              className="resize-none"
            />
          </div>

          {/* 提示消息 */}
          {message && (
            <div
              className={cn(
                "p-3 rounded-lg text-center",
                message.type === "success"
                  ? "bg-macaron-green/20 text-macaron-green"
                  : "bg-macaron-pink/20 text-macaron-pink"
              )}
            >
              {message.text}
            </div>
          )}

          {/* 提交按钮 */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || selectedScore === 0}
            className="w-full bg-macaron-pink hover:bg-macaron-pink/90 text-white font-cute py-6"
          >
            {isSubmitting ? "提交中..." : "提交评分"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
