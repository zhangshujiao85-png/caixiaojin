"use client";

import { useState } from "react";
import { X, Plus, Trash2, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEmotionalLedgerStore, EmotionalEntry } from "@/store/useEmotionalLedgerStore";
import { cn } from "@/lib/utils";

interface EmotionalLedgerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EmotionalLedgerModal({ open, onOpenChange }: EmotionalLedgerModalProps) {
  const [ledgerAnxietyLevel, setLedgerAnxietyLevel] = useState(50);
  const [feeling, setFeeling] = useState("");
  const [action, setAction] = useState("");
  const [selectedMood, setSelectedMood] = useState<EmotionalEntry['mood']>("anxious");
  const [showLedgerForm, setShowLedgerForm] = useState(false);

  const { entries, addEntry, deleteEntry, getAverageAnxiety } = useEmotionalLedgerStore();

  const handleAddToLedger = () => {
    if (!feeling.trim() || !action.trim()) {
      alert("请填写完整的心情和行动哦~");
      return;
    }

    addEntry({
      anxietyLevel: ledgerAnxietyLevel,
      marketTrend: 'flat',
      feeling,
      action,
      mood: selectedMood,
    });

    // 重置表单
    setLedgerAnxietyLevel(50);
    setFeeling("");
    setAction("");
    setSelectedMood("anxious");
    setShowLedgerForm(false);

    alert("✅ 已记入情绪笔记本，记录是改变的开始！");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-macaron-blue via-macaron-cream to-macaron-purple">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="w-6 h-6 text-macaron-blue" />
              <h2 className="text-2xl font-bold text-gray-800 font-cute">
                情绪笔记本 📔
              </h2>
            </div>
            <p className="text-sm text-gray-600 text-center px-4 leading-relaxed">
              你的专属小树洞 🌳<br />
              在这里，你可以安全地倾诉每一次心跳，记录市场起伏下的真实情绪
            </p>
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* 统计卡片 */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-2 border-macaron-blue/30 bg-gradient-to-br from-macaron-blue/10 to-macaron-purple/10">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-macaron-blue">{entries.length}</p>
                <p className="text-xs text-gray-600">记录次数</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-macaron-purple/30 bg-gradient-to-br from-macaron-purple/10 to-macaron-pink/10">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-macaron-purple">{getAverageAnxiety()}</p>
                <p className="text-xs text-gray-600">平均焦虑值</p>
              </CardContent>
            </Card>
          </div>

          {/* 添加记录按钮 */}
          {!showLedgerForm ? (
            <Button
              onClick={() => setShowLedgerForm(true)}
              className="w-full bg-gradient-to-r from-macaron-blue to-macaron-purple hover:from-macaron-blue/90 hover:to-macaron-purple/90 text-white font-cute"
            >
              <Plus className="w-4 h-4 mr-2" />
              记一笔情绪
            </Button>
          ) : (
            <Card className="border-2 border-macaron-blue/30 bg-white/80">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-gray-800">记录今天的心情</h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowLedgerForm(false)}
                  >
                    取消
                  </Button>
                </div>

                {/* 焦虑值滑块 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    今天的焦虑值：{ledgerAnxietyLevel}
                  </label>
                  <Slider
                    value={[ledgerAnxietyLevel]}
                    onValueChange={(value) => setLedgerAnxietyLevel(value[0])}
                    min={1}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* 心情输入 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">你现在的心情</label>
                  <Input
                    value={feeling}
                    onChange={(e) => setFeeling(e.target.value)}
                    placeholder="比如：看到基金跌了，心里有点慌..."
                    className="w-full"
                  />
                </div>

                {/* 行动输入 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">你做了什么</label>
                  <Input
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    placeholder="比如：继续定投、查看收益..."
                    className="w-full"
                  />
                </div>

                {/* 整体情绪选择 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">整体情绪</label>
                  <div className="flex gap-2">
                    {[
                      { mood: "anxious" as const, emoji: "😰", label: "焦虑" },
                      { mood: "calm" as const, emoji: "😌", label: "平静" },
                      { mood: "hopeful" as const, emoji: "🌱", label: "有希望" },
                      { mood: "regretful" as const, emoji: "😔", label: "后悔" },
                    ].map((m) => (
                      <button
                        key={m.mood}
                        onClick={() => setSelectedMood(m.mood)}
                        className={cn(
                          "flex-1 px-3 py-2 rounded-xl border-2 transition-all text-xs",
                          selectedMood === m.mood
                            ? "border-macaron-blue bg-macaron-blue text-white"
                            : "border-gray-200 hover:border-macaron-blue/50 hover:bg-macaron-blue/10"
                        )}
                      >
                        <span className="text-lg">{m.emoji}</span>
                        <span className="ml-1">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleAddToLedger}
                  className="w-full bg-macaron-blue hover:bg-macaron-blue/90 text-white"
                >
                  记录到笔记本
                </Button>
              </CardContent>
            </Card>
          )}

          {/* 历史记录 */}
          {entries.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-bold text-gray-800">📋 历史记录</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {entries.map((entry) => (
                  <Card
                    key={entry.id}
                    className="border border-gray-200 bg-white/60 hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {entry.mood === "anxious" && "😰"}
                            {entry.mood === "calm" && "😌"}
                            {entry.mood === "hopeful" && "🌱"}
                            {entry.mood === "regretful" && "😔"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(entry.date).toLocaleDateString('zh-CN')}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-macaron-blue">
                          焦虑值: {entry.anxietyLevel}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-1">
                        <span className="font-medium">心情：</span>{entry.feeling}
                      </p>
                      <p className="text-sm text-gray-700 mb-2">
                        <span className="font-medium">行动：</span>{entry.action}
                      </p>
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            if (confirm("确定要删除这条记录吗？")) {
                              deleteEntry(entry.id);
                            }
                          }}
                          className="p-1 h-auto"
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

          {entries.length === 0 && (
            <Card className="border-2 border-dashed border-gray-300 bg-white/50">
              <CardContent className="py-8 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">笔记本还是空的呢~</p>
                <p className="text-gray-400 text-xs">把小树洞当作你的秘密花园，开始记录吧 🌱</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
