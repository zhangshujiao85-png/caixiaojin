"use client";

import { useState, useEffect } from "react";
import { X, Music, BookOpen, Heart, TrendingUp, ArrowRight, CheckCircle2, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { userStories, UserStory } from "@/data/realUserStories";

interface InvestmentAnxietyProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack?: () => void;
}

export function InvestmentAnxietyModal({ open, onOpenChange, onBack }: InvestmentAnxietyProps) {
  const [anxietyLevel, setAnxietyLevel] = useState(50);
  const [showResult, setShowResult] = useState(false);
  const [selectedStory, setSelectedStory] = useState<UserStory | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Debug log to verify new code is running
  console.log('InvestmentAnxietyModal rendered, userStories count:', userStories.length);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      console.log('Modal opened, new code is running!');
      setIsFavorite(false);
    }
  }, [open]);

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      alert('已收藏到你的金句宝库 ❤️');
    } else {
      alert('已取消收藏');
    }
  };

  const handleSubmitAnxiety = () => {
    setShowResult(true);

    // 根据焦虑值确定焦虑级别
    let targetLevel: 'low' | 'high' = 'low';
    if (anxietyLevel <= 50) {
      targetLevel = 'low';
    } else {
      targetLevel = 'high';
    }

    // 筛选投资焦虑故事，匹配焦虑级别
    const suitableStories = userStories.filter(
      story => story.type === 'investment' &&
      (story.anxietyLevel === targetLevel || story.anxietyLevel === 'any')
    );

    if (suitableStories.length > 0) {
      // 随机选择一个故事
      const randomIndex = Math.floor(Math.random() * suitableStories.length);
      setSelectedStory(suitableStories[randomIndex]);
    }
  };

  const getAnxietyDescription = (level: number) => {
    if (level <= 30) {
      return "你的焦虑值较低，说明心态还不错！来看看一些经典投资心理文章吧。";
    } else if (level <= 70) {
      return "焦虑值中等，这是很正常的反应。让我们来化解一下吧。";
    } else {
      return "焦虑值较高，说明压力很大。别担心，我们来帮你做一次心理按摩。";
    }
  };

  const handleReset = () => {
    setShowResult(false);
    setSelectedStory(null);
    setAnxietyLevel(50);
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-macaron-purple via-macaron-cream to-macaron-pink">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {onBack && (
                  <button
                    onClick={onBack}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <div className="flex items-center justify-center gap-2 flex-1">
                  <TrendingUp className="w-6 h-6 text-macaron-purple" />
                  <h2 className="text-2xl font-bold text-gray-800 font-cute">
                    投资焦虑补丸
                  </h2>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 text-center mb-4">
              把心跳变成知识，把恐惧变成策略 💫
            </p>
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {!showResult ? (
            <>
              {/* 焦虑指数输入 */}
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-gray-700 mb-4">
                    现在的市场让你感到多焦虑？请输入你的焦虑指数（1-100）
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-3xl">😰</span>
                    <span className="text-3xl font-bold text-macaron-purple">{anxietyLevel}</span>
                    <span className="text-3xl">😰</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">1 = 很平静，100 = 非常焦虑</p>
                </div>

                <div className="px-4">
                  <Slider
                    value={[anxietyLevel]}
                    onValueChange={(value) => setAnxietyLevel(value[0])}
                    min={1}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>平静</span>
                    <span>焦虑</span>
                  </div>
                </div>

                <div className="bg-macaron-cream rounded-xl p-4 border-2 border-macaron-yellow/30">
                  <p className="text-sm text-gray-700 text-center">
                    {getAnxietyDescription(anxietyLevel)}
                  </p>
                </div>

                <Button
                  onClick={handleSubmitAnxiety}
                  size="lg"
                  className="w-full bg-gradient-to-r from-macaron-purple to-macaron-pink hover:from-macaron-purple/90 hover:to-macaron-pink/90 text-white font-cute font-bold"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  兑换我的心理补丸
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* 结果展示 */}
              <div className="space-y-6">
                {selectedStory && (
                  <Card className="border-2 border-macaron-purple/30 bg-white/80 backdrop-blur-sm">
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

                      {/* 专业见解 */}
                      {selectedStory.professionalInsight && (
                        <div className="bg-gradient-to-br from-macaron-purple/10 to-macaron-blue/10 rounded-xl p-4 border-2 border-macaron-purple/30">
                          <h5 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-macaron-purple" />
                            专业洞察
                          </h5>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {selectedStory.professionalInsight}
                          </p>
                        </div>
                      )}

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

                {/* 金句标语 */}
                <div className="text-center -mt-4 mb-6">
                  <p className="text-sm text-macaron-purple italic">
                    ✨ 今天我的投资焦虑值是 <span className="text-lg font-bold">{anxietyLevel}</span>，但我选择把它换算成一次深度学习。
                  </p>
                </div>

                {/* 分享按钮 */}
                <div className="bg-gradient-to-r from-macaron-purple/20 to-macaron-pink/20 rounded-xl p-6 border-2 border-macaron-purple/30 text-center relative">
                  {/* 右上角收藏按钮 */}
                  <button
                    onClick={handleToggleFavorite}
                    className="absolute top-3 right-3 p-2 rounded-full hover:bg-white/30 transition-all"
                  >
                    <Heart
                      className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-macaron-pink'}`}
                    />
                  </button>

                  <p className="text-base font-medium bg-gradient-to-r from-macaron-purple to-macaron-pink bg-clip-text text-transparent leading-relaxed mb-4">
                    "投资最重要的不是预测未来，而是做好自己能掌控的事。"
                  </p>

                  <Button
                    onClick={() => {
                      const text = `今天我的投资焦虑值是${anxietyLevel}，但我选择把它换算成一次深度学习。`;
                      navigator.clipboard?.writeText(text);
                      alert('金句已复制到剪贴板！快去分享吧~ 💫');
                    }}
                    size="sm"
                    className="bg-macaron-purple text-white hover:bg-macaron-purple/90"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    复制我的金句
                  </Button>
                </div>

                {/* 重新开始按钮 */}
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full"
                >
                  测量另一个焦虑值
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
