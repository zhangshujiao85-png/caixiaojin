"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Calendar, TrendingUp, PiggyBank, Plus, Edit3, Trash2, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface DiaryEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: "happy" | "neutral" | "sad";
  tags: string[];
}

export default function DiaryPage() {
  const [entries, setEntries] = useState<DiaryEntry[]>([
    {
      id: "1",
      date: "2024-01-15",
      title: "第一次定投",
      content: "今天开始了第一次定投，每月500元买入混合型基金。虽然有点紧张，但相信长期会有收获！",
      mood: "happy",
      tags: ["定投", "新手"],
    },
    {
      id: "2",
      date: "2024-01-20",
      title: "市场下跌了",
      content: "今天看到基金跌了，心里有点慌。但记得要淡定，继续定投！",
      mood: "neutral",
      tags: ["市场波动", "心理"],
    },
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);

  // 保存日记
  const handleSave = () => {
    if (!editingEntry) return;
    if (editingEntry.id) {
      setEntries(entries.map((e) => e.id === editingEntry.id ? editingEntry : e));
    } else {
      setEntries([...entries, { ...editingEntry, id: Date.now().toString() }]);
    }
    setIsEditing(false);
    setEditingEntry(null);
  };

  // 删除日记
  const handleDelete = (id: string) => {
    setEntries(entries.filter((e) => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-macaron-purple/20 via-macaron-cream to-macaron-pink/20 py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        {/* 返回按钮 */}
        <Link href="/tools" className="inline-flex items-center gap-2 text-macaron-pink hover:text-macaron-purple transition-colors mb-6 group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-cute font-medium">返回工具箱</span>
        </Link>

        {/* 标题区域 */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-macaron-purple to-macaron-pink flex items-center justify-center shadow-lg animate-bounce" style={{ animationDuration: "2s" }}>
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 font-cute">
            📔 理财日记
          </h1>
          <p className="text-gray-600 text-base md:text-lg mb-6">
            记录理财心得，见证成长轨迹
          </p>

          {/* 添加日记按钮 */}
          <Button
            onClick={() => {
              setIsEditing(true);
              setEditingEntry({
                id: "",
                date: new Date().toISOString().split("T")[0],
                title: "",
                content: "",
                mood: "neutral",
                tags: [],
              });
            }}
            className="bg-gradient-to-r from-macaron-purple to-macaron-pink hover:from-macaron-purple/90 hover:to-macaron-pink/90 text-white font-cute font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-6 py-3"
          >
            <Plus className="w-5 h-5 mr-2" />
            写日记
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="border-2 border-macaron-pink/30 bg-gradient-to-br from-macaron-pink/10 to-macaron-peach/10">
            <CardContent className="p-4 text-center">
              <BookOpen className="w-8 h-8 text-macaron-pink mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">{entries.length}</p>
              <p className="text-xs text-gray-600">总日记数</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-macaron-green/30 bg-gradient-to-br from-macaron-green/10 to-macaron-blue/10">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-macaron-green mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">连续记录</p>
              <p className="text-xs text-gray-600">3天</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-macaron-purple/30 bg-gradient-to-br from-macaron-purple/10 to-macaron-blue/10">
            <CardContent className="p-4 text-center">
              <PiggyBank className="w-8 h-8 text-macaron-purple mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">快乐占比</p>
              <p className="text-xs text-gray-600">67%</p>
            </CardContent>
          </Card>
        </div>

        {/* 日记列表 */}
        <div className="space-y-4">
          {entries.length === 0 && (
            <Card className="border-2 border-dashed border-gray-300 bg-white/50">
              <CardContent className="py-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">还没有写日记哦</p>
                <p className="text-sm text-gray-400">开始记录你的理财之旅吧~</p>
              </CardContent>
            </Card>
          )}

          {entries.map((entry) => (
            <Card
              key={entry.id}
              className={cn(
                "border-2 hover:shadow-lg transition-all duration-300",
                entry.mood === "happy" && "border-macaron-pink/30",
                entry.mood === "sad" && "border-macaron-blue/30",
                entry.mood === "neutral" && "border-macaron-green/30"
              )}
            >
              <CardContent className="p-4 md:p-5">
                {/* 头部 */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-xl",
                      entry.mood === "happy" && "bg-macaron-pink",
                      entry.mood === "sad" && "bg-macaron-blue",
                      entry.mood === "neutral" && "bg-macaron-green"
                    )}>
                      {entry.mood === "happy" && "😊"}
                      {entry.mood === "sad" && "😢"}
                      {entry.mood === "neutral" && "😐"}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm md:text-base mb-1">
                        {entry.title}
                      </h3>
                      <p className="text-xs text-gray-500">{entry.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setIsEditing(true);
                        setEditingEntry(entry);
                      }}
                      className="p-1 hover:bg-gray-100"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(entry.id)}
                      className="p-1 hover:bg-gray-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* 内容 */}
                <p className="text-gray-700 text-sm leading-relaxed mb-3">
                  {entry.content}
                </p>

                {/* 标签 */}
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-full bg-macaron-pink/20 text-macaron-pink text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 编辑/添加日记弹窗 */}
        {isEditing && editingEntry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl p-6 animate-in fade-in zoom-in duration-300">
              <h2 className="text-xl font-bold text-gray-800 mb-4 font-cute">
                {editingEntry.id ? "编辑日记" : "写新日记"}
              </h2>

              <div className="space-y-4">
                {/* 标题 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                  <Input
                    value={editingEntry.title}
                    onChange={(e) => setEditingEntry({ ...editingEntry, title: e.target.value })}
                    placeholder="今天发生了什么？"
                    className="w-full"
                  />
                </div>

                {/* 内容 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
                  <textarea
                    value={editingEntry.content}
                    onChange={(e) => setEditingEntry({ ...editingEntry, content: e.target.value })}
                    placeholder="记录你的理财心得..."
                    rows={4}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-macaron-pink/50 focus:ring-2 focus:ring-macaron-pink/20"
                  />
                </div>

                {/* 心情选择 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">今天的心情</label>
                  <div className="flex gap-2">
                    {[
                      { mood: "happy", emoji: "😊", label: "开心" },
                      { mood: "neutral", emoji: "😐", label: "平静" },
                      { mood: "sad", emoji: "😢", label: "失落" },
                    ].map((m) => (
                      <button
                        key={m.mood}
                        onClick={() => setEditingEntry({ ...editingEntry, mood: m.mood as any })}
                        className={cn(
                          "px-4 py-2 rounded-xl border-2 transition-all",
                          editingEntry.mood === m.mood
                            ? "border-macaron-pink bg-macaron-pink text-white"
                            : "border-gray-200 hover:border-macaron-pink/50 hover:bg-macaron-pink/10"
                        )}
                      >
                        <span className="text-xl">{m.emoji}</span>
                        <span className="text-xs">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 标签 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">标签</label>
                  <div className="flex flex-wrap gap-2">
                    {["定投", "新手", "市场波动", "心理", "收益", "风险"].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          const tags = editingEntry.tags || [];
                          if (tags.includes(tag)) {
                            setEditingEntry({
                              ...editingEntry,
                              tags: tags.filter((t) => t !== tag),
                            });
                          } else {
                            setEditingEntry({ ...editingEntry, tags: [...tags, tag] });
                          }
                        }}
                        className={cn(
                          "px-3 py-1 rounded-full border-2 text-xs transition-all",
                          (editingEntry.tags || []).includes(tag)
                            ? "border-macaron-pink bg-macaron-pink text-white"
                            : "border-gray-200 hover:border-macaron-pink/50 hover:bg-macaron-pink/10"
                        )}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="flex-1"
                >
                  取消
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-macaron-purple to-macaron-pink hover:from-macaron-purple/90 hover:to-macaron-pink/90 text-white font-cute"
                >
                  保存
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
