"use client";

import { useState } from "react";
import { X, Heart, Sparkles, ArrowRight, Plus, Trash2, CheckCircle2, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { userStories, UserStory } from "@/data/realUserStories";
import { useTreeHoleStore, TreeHoleEntry } from "@/store/useTreeHoleStore";
import { cn } from "@/lib/utils";

interface FinancialAnxietyProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const anxietySources = [
  {
    id: 'living-paycheck',
    emoji: '💸',
    title: '总是月光',
    description: '每个月钱都不够花',
    category: '月光族',
  },
  {
    id: 'cant-save',
    emoji: '🐷',
    title: '存不下钱',
    description: '想存但总是存不下来',
    category: '存不下钱',
  },
  {
    id: 'unemployment',
    emoji: '😰',
    title: '担心失业',
    description: '工作不稳定，心里发慌',
    category: '失业焦虑',
  },
  {
    id: 'comparison',
    emoji: '👀',
    title: '攀比焦虑',
    description: '同龄人好像都比我富有',
    category: '攀比心理',
  },
];

export function FinancialAnxietyModal({ open, onOpenChange }: FinancialAnxietyProps) {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<UserStory | null>(null);
  const [showTreeHole, setShowTreeHole] = useState(false);
  const [newEntry, setNewEntry] = useState("");
  const [selectedMood, setSelectedMood] = useState<TreeHoleEntry['mood']>("sad");

  const { entries, addEntry, deleteEntry, getEntriesByCategory } = useTreeHoleStore();

  const handleSourceSelect = (sourceId: string) => {
    setSelectedSource(sourceId);

    // 根据选择的类别匹配真实用户故事
    const source = anxietySources.find(s => s.id === sourceId);
    if (source) {
      const matchingStories = userStories.filter(
        story => story.type === 'financial' && story.category === source.category
      );

      if (matchingStories.length > 0) {
        // 随机选择一个故事
        const randomIndex = Math.floor(Math.random() * matchingStories.length);
        setSelectedStory(matchingStories[randomIndex]);
      }
    }
  };

  const handleReset = () => {
    setSelectedSource(null);
    setSelectedStory(null);
    setShowTreeHole(false);
    setNewEntry("");
    setSelectedMood("sad");
  };

  const handleAddToTreeHole = () => {
    if (!newEntry.trim()) return;

    addEntry({
      content: newEntry,
      mood: selectedMood,
      category: 'investment-failure',
    });

    setNewEntry("");
    alert("✅ 已放入小树洞，说出来就会好一点~");
  };

  const handleClose = () => {
    handleReset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-macaron-green via-macaron-cream to-macaron-blue">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart className="w-6 h-6 text-macaron-pink" />
              <h2 className="text-2xl font-bold text-gray-800 font-cute">
                财务焦虑？我们来做个心理按摩 💆
              </h2>
            </div>
            <p className="text-sm text-gray-600 text-center">
              把焦虑变成小行动，每天进步一点点 ✨
            </p>
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {!selectedSource ? (
            <>
              {/* 焦虑源头选择 */}
              <div className="space-y-4">
                <p className="text-center text-gray-700">
                  选择一个最让你焦虑的问题，我们陪你一起面对 👇
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {anxietySources.map((source) => (
                    <Card
                      key={source.id}
                      className="cursor-pointer border-2 border-macaron-green/30 hover:border-macaron-pink/50 hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm"
                      onClick={() => handleSourceSelect(source.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="text-4xl">{source.emoji}</div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-800 mb-1">
                              {source.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {source.description}
                            </p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-macaron-pink" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* 结果展示 */}
              <div className="space-y-6">
                {selectedStory && (
                  <Card className="border-2 border-macaron-pink/30 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      {/* 用户信息 */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-macaron-pink to-macaron-purple flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {selectedStory.avatarLetter}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">{selectedStory.username}</h3>
                          <p className="text-xs text-gray-500">
                            ❤️ {selectedStory.likes} 人点赞 · {selectedStory.createdAt}
                          </p>
                        </div>
                      </div>

                      {/* 故事标题 */}
                      <h4 className="text-lg font-bold text-gray-800 mb-3">
                        {selectedStory.title}
                      </h4>

                      {/* 故事内容 */}
                      <div className="prose prose-sm max-w-none mb-4">
                        <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                          {selectedStory.story}
                        </p>
                      </div>

                      {/* 可执行步骤 */}
                      <div className="bg-macaron-cream/50 rounded-xl p-4 border-2 border-macaron-yellow/30 mb-4">
                        <h5 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-macaron-green" />
                          TA 是这样做的：
                        </h5>
                        <ol className="space-y-2">
                          {selectedStory.actions.map((action, index) => (
                            <li key={index} className="flex gap-3 text-sm text-gray-700">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-macaron-pink text-white flex items-center justify-center text-xs font-bold">
                                {index + 1}
                              </span>
                              <span className="flex-1 pt-0.5">{action}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* 标签 */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {selectedStory.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* 金句分享海报 */}
                <div className="bg-gradient-to-r from-macaron-pink/20 to-macaron-green/20 rounded-xl p-6 border-2 border-macaron-pink/30 text-center">
                  <h4 className="font-bold text-gray-800 mb-3">✨ 我的金句</h4>
                  <div className="bg-white rounded-xl p-4 mb-4 border-2 border-macaron-pink/20">
                    <p className="text-base font-medium text-macaron-pink">
                      今天我面对了我的{selectedSource ? anxietySources.find(s => s.id === selectedSource)?.title : '财务焦虑'}，但我选择从小行动开始改变。
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      const text = `今天我面对了我的财务焦虑，但我选择从小行动开始改变。`;
                      navigator.clipboard?.writeText(text);
                      alert('金句已复制到剪贴板！快去分享吧~ ✨');
                    }}
                    size="sm"
                    className="bg-macaron-pink text-white hover:bg-macaron-pink/90"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    复制并分享
                  </Button>
                </div>

                {/* 重新开始按钮 */}
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full"
                >
                  选择另一个焦虑
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
