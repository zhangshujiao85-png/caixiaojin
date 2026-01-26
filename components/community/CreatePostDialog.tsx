"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Upload, Image as ImageIcon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostCreated?: () => void;
}

const categories = [
  { value: "定投心得", label: "定投心得", emoji: "💰" },
  { value: "新手提问", label: "新手提问", emoji: "🙋" },
  { value: "收益分享", label: "收益分享", emoji: "🎉" },
  { value: "经验分享", label: "经验分享", emoji: "💡" },
];

export function CreatePostDialog({ open, onOpenChange, onPostCreated }: CreatePostDialogProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("定投心得");
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }

    if (!title.trim() || !content.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 创建新帖子
      const newPost = {
        id: Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        images,
        category,
        createdAt: new Date(),
      };

      // 保存到localStorage
      const existingPosts = JSON.parse(localStorage.getItem("posts") || "[]");
      localStorage.setItem("posts", JSON.stringify([newPost, ...existingPosts]));

      // 重置表单
      setTitle("");
      setContent("");
      setCategory("定投心得");
      setImages([]);

      // 关闭对话框
      onOpenChange(false);
      onPostCreated?.();
    } catch (error) {
      console.error("创建帖子失败:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl border-2 border-macaron-pink/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-cute">
            <Sparkles className="w-5 h-5 text-macaron-pink" />
            发布新动态
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* 分类选择 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              选择分类
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={cn(
                    "px-4 py-2 rounded-full border-2 transition-all font-cute text-sm",
                    category === cat.value
                      ? "border-macaron-pink bg-macaron-pink/10 text-macaron-pink"
                      : "border-gray-200 hover:border-macaron-pink/50"
                  )}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 标题 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              标题
            </label>
            <Input
              placeholder="给你的帖子起个标题吧~"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={50}
              className="text-base"
            />
            <p className="text-xs text-gray-500 mt-1 text-right">{title.length}/50</p>
          </div>

          {/* 内容 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              内容
            </label>
            <Textarea
              placeholder="分享你的理财心得、提问或经验..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              maxLength={500}
              className="text-base resize-none"
            />
            <p className="text-xs text-gray-500 mt-1 text-right">{content.length}/500</p>
          </div>

          {/* 图片上传 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              图片 (可选)
            </label>
            <div className="space-y-2">
              {/* 已上传的图片 */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-macaron-pink/30">
                      <img
                        src={image}
                        alt={`上传的图片 ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 w-6 h-6 bg-macaron-pink text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* 上传按钮 */}
              {images.length < 3 && (
                <label className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-macaron-pink/30 rounded-lg cursor-pointer hover:border-macaron-pink hover:bg-macaron-pink/5 transition-all">
                  <ImageIcon className="w-5 h-5 text-macaron-pink" />
                  <span className="text-sm text-gray-600">点击上传图片</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
              <p className="text-xs text-gray-500">最多上传3张图片</p>
            </div>
          </div>

          {/* 提示信息 */}
          {!isAuthenticated && (
            <div className="bg-macaron-blue/10 border border-macaron-blue/30 text-macaron-blue px-4 py-2 rounded-lg text-sm">
              💡 发布内容需要先登录哦
            </div>
          )}

          {/* 提交按钮 */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              取消
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className="flex-1 bg-gradient-to-r from-macaron-pink to-macaron-purple hover:from-macaron-pink/90 hover:to-macaron-purple/90"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  发布中...
                </span>
              ) : (
                "发布"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
