"use client";

import { useState, useEffect } from "react";
import { X, Music, BookOpen, Heart, TrendingUp, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { anxietyReliefArticles, AnxietyReliefArticle } from "@/data/anxietyReliefContent";

interface InvestmentAnxietyProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const investmentQuotes = [
  "复利的奇迹，不只存在于金钱，也存在于你每日的微小进步。",
  "分散投资，就像不要把你的幸福寄托在单一件事上。",
  "市场波动如四季，你的核心配置就是那件最耐穿的风衣。",
  "设定财务目标，就是为你的人生画一张航海图。",
  "应急金不是数字，是你生活中最踏实的一份\"保险\"。",
  "长期主义，是相信时间会站在理性与纪律这一边。",
  "消费是满足现在，投资是照顾未来。聪明的你，懂得平衡。",
  "了解自己的风险偏好，和了解自己的皮肤属性一样重要。",
  "记账不是束缚，是让你看清钱去往何处，让花销配得上你的努力。",
  "收益率就像天气，无法控制，但你可以决定自己带什么伞。"
];

export function InvestmentAnxietyModal({ open, onOpenChange }: InvestmentAnxietyProps) {
  const [anxietyLevel, setAnxietyLevel] = useState(50);
  const [showResult, setShowResult] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<AnxietyReliefArticle | null>(null);
  const [randomQuote, setRandomQuote] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  // Select random quote when modal opens
  useEffect(() => {
    if (open) {
      const randomIndex = Math.floor(Math.random() * investmentQuotes.length);
      setRandomQuote(investmentQuotes[randomIndex]);
      setIsFavorite(false); // Reset favorite state
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
    // 根据焦虑值选择合适的文章
    const suitableArticles = anxietyReliefArticles.filter(
      article => article.type === 'investment' &&
      (article.level === 'any' || article.level === 'low' || article.level === 'high')
    );

    if (suitableArticles.length > 0) {
      // 随机选择一篇
      const randomIndex = Math.floor(Math.random() * suitableArticles.length);
      setSelectedArticle(suitableArticles[randomIndex]);
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
    setSelectedArticle(null);
    setAnxietyLevel(50);
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-macaron-purple via-macaron-cream to-macaron-pink">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-6 h-6 text-macaron-purple" />
              <h2 className="text-2xl font-bold text-gray-800 font-cute">
                投资焦虑补丸
              </h2>
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
                {selectedArticle && (
                  <Card className="border-2 border-macaron-purple/30 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-macaron-purple flex items-center justify-center flex-shrink-0">
                          {selectedArticle.level === 'low' ? (
                            <BookOpen className="w-5 h-5 text-white" />
                          ) : selectedArticle.level === 'high' ? (
                            <Music className="w-5 h-5 text-white" />
                          ) : (
                            <Heart className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold text-gray-800">
                              {selectedArticle.title}
                            </h3>
                            <Badge className="bg-macaron-purple/20 text-macaron-purple hover:bg-macaron-purple/30">
                              {selectedArticle.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">点击标签可查看更多相关文章</p>
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

                {/* 金句标语 */}
                <div className="text-center -mt-6 mb-8">
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

                  <p className="text-lg font-medium bg-gradient-to-r from-macaron-purple to-macaron-pink bg-clip-text text-transparent leading-relaxed mb-4">
                    {randomQuote}
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
