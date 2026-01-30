"use client";

import { useState } from "react";
import { X, Heart, Sparkles, ArrowRight, Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { anxietyReliefArticles, AnxietyReliefArticle } from "@/data/anxietyReliefContent";
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
  const [selectedArticle, setSelectedArticle] = useState<AnxietyReliefArticle | null>(null);
  const [showTreeHole, setShowTreeHole] = useState(false);
  const [newEntry, setNewEntry] = useState("");
  const [selectedMood, setSelectedMood] = useState<TreeHoleEntry['mood']>("sad");

  const { entries, addEntry, deleteEntry, getEntriesByCategory } = useTreeHoleStore();

  const handleSourceSelect = (sourceId: string) => {
    setSelectedSource(sourceId);

    // Find matching article based on category
    const source = anxietySources.find(s => s.id === sourceId);
    if (source) {
      const matchingArticles = anxietyReliefArticles.filter(
        article => article.type === 'financial' && article.category === source.category
      );

      if (matchingArticles.length > 0) {
        setSelectedArticle(matchingArticles[0]);
      }
    }
  };

  const handleReset = () => {
    setSelectedSource(null);
    setSelectedArticle(null);
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
                {selectedArticle && (
                  <Card className="border-2 border-macaron-pink/30 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-macaron-pink to-macaron-purple flex items-center justify-center flex-shrink-0">
                          <Heart className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold text-gray-800">
                              {selectedArticle.title}
                            </h3>
                            <Badge className="bg-macaron-pink/20 text-macaron-pink hover:bg-macaron-pink/30">
                              {selectedArticle.category}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedArticle.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="prose prose prose-sm max-w-none">
                        <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                          {selectedArticle.content}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* 金句分享海报 */}
                <div className="bg-gradient-to-r from-macaron-pink/20 to-macaron-green/20 rounded-xl p-6 border-2 border-macaron-pink/30 text-center">
                  <h4 className="font-bold text-gray-800 mb-3">✨ 我的金句</h4>
                  <div className="bg-white rounded-xl p-4 mb-4 border-2 border-macaron-pink/20">
                    <p className="text-lg font-medium text-macaron-pink">
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

                {/* 小树洞功能 - 仅投资失败时显示 */}
                {selectedSource === 'investment-failed' && (
                  <Card className="border-2 border-macaron-purple/30 bg-gradient-to-br from-macaron-purple/10 to-macaron-blue/10">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                            🌳 小树洞
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            把你的委屈、不甘心都说出来，这里是安全的秘密基地
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => setShowTreeHole(!showTreeHole)}
                          variant={showTreeHole ? "default" : "outline"}
                          className={showTreeHole ? "bg-macaron-purple" : "border-macaron-purple text-macaron-purple"}
                        >
                          {showTreeHole ? "收起" : "展开"}
                        </Button>
                      </div>

                      {showTreeHole && (
                        <div className="space-y-4">
                          {/* 写日记区域 */}
                          <div className="bg-white/80 rounded-xl p-4 border-2 border-macaron-purple/20">
                            <textarea
                              value={newEntry}
                              onChange={(e) => setNewEntry(e.target.value)}
                              placeholder="把你的想法写下来...比如：我真的很难过，为什么别人都能赚钱..."
                              rows={3}
                              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-macaron-purple/50 focus:ring-2 focus:ring-macaron-purple/20 text-sm resize-none"
                            />

                            {/* 心情选择 */}
                            <div className="mt-3">
                              <p className="text-xs text-gray-600 mb-2">你现在的心情</p>
                              <div className="flex gap-2">
                                {[
                                  { mood: "sad", emoji: "😢", label: "难过" },
                                  { mood: "confused", emoji: "😕", label: "困惑" },
                                  { mood: "hopeful", emoji: "🌱", label: "有希望" },
                                  { mood: "relief", emoji: "😌", label: "释然" },
                                ].map((m) => (
                                  <button
                                    key={m.mood}
                                    onClick={() => setSelectedMood(m.mood as TreeHoleEntry['mood'])}
                                    className={cn(
                                      "flex-1 px-3 py-2 rounded-xl border-2 transition-all text-xs",
                                      selectedMood === m.mood
                                        ? "border-macaron-purple bg-macaron-purple text-white"
                                        : "border-gray-200 hover:border-macaron-purple/50 hover:bg-macaron-purple/10"
                                    )}
                                  >
                                    <span className="text-lg">{m.emoji}</span>
                                    <span className="ml-1">{m.label}</span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            <Button
                              onClick={handleAddToTreeHole}
                              disabled={!newEntry.trim()}
                              className="w-full mt-3 bg-macaron-purple hover:bg-macaron-purple/90 text-white"
                              size="sm"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              放入小树洞
                            </Button>
                          </div>

                          {/* 历史记录 */}
                          {getEntriesByCategory('investment-failure').length > 0 && (
                            <div className="space-y-3">
                              <p className="text-sm font-medium text-gray-700">📝 历史记录</p>
                              <div className="space-y-2 max-h-48 overflow-y-auto">
                                {getEntriesByCategory('investment-failure').map((entry) => (
                                  <Card
                                    key={entry.id}
                                    className="border border-gray-200 bg-white/60"
                                  >
                                    <CardContent className="p-3">
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <span className="text-lg">
                                              {entry.mood === "sad" && "😢"}
                                              {entry.mood === "confused" && "😕"}
                                              {entry.mood === "hopeful" && "🌱"}
                                              {entry.mood === "relief" && "😌"}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                              {new Date(entry.date).toLocaleDateString('zh-CN')}
                                            </span>
                                          </div>
                                          <p className="text-sm text-gray-700 line-clamp-2">{entry.content}</p>
                                        </div>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => {
                                            if (confirm("确定要删除这条记录吗？")) {
                                              deleteEntry(entry.id);
                                            }
                                          }}
                                          className="flex-shrink-0 p-1 h-auto"
                                        >
                                          <Trash2 className="w-3 h-3 text-gray-400" />
                                        </Button>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

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
