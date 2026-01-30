"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Sparkles, Target, Plane, Home, Coffee, Map, Calendar, TrendingUp, Shield, Zap, AlertCircle, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSavedGoalsStore, SavedGoal } from "@/store/useSavedGoalsStore";

interface WishCalculationResult {
  wishAmount: number;
  monthlySavings: number;
  targetYears: number;
  wishType: 'short-term' | 'medium-term' | 'long-term';
  wishTypeLabel: string;
  planAYears: number;
  planBDescription: string;
  planCDescription: string;
  recommendedPlan: 'A' | 'B' | 'C';
  riskLevel: '极低风险' | '中低风险' | '中高风险';
}

interface WishTemplate {
  id: string;
  icon: React.ElementType;
  emoji: string;
  title: string;
  description: string;
  defaultAmount: number;
  imageColor: string;
  category: 'travel' | 'housing' | 'lifestyle' | 'freedom' | 'custom';
}

const wishTemplates: WishTemplate[] = [
  {
    id: 'aurora-trip',
    icon: Plane,
    emoji: '🌌',
    title: '带父母去北欧看极光',
    description: '一家三口，7天芬兰挪威之旅，包含极光屋、玻璃酒店...',
    defaultAmount: 80000,
    imageColor: 'from-purple-500/20 to-blue-500/20',
    category: 'travel',
  },
  {
    id: 'coffee-corner',
    icon: Coffee,
    emoji: '☕',
    title: '拥有自己的咖啡角',
    description: '一台意式咖啡机 + 精品豆子 + 舒适的沙发 + 温暖的灯光...',
    defaultAmount: 15000,
    imageColor: 'from-amber-500/20 to-orange-500/20',
    category: 'lifestyle',
  },
  {
    id: 'world-trip',
    icon: Map,
    emoji: '🌍',
    title: 'Gap Year环球旅行',
    description: '辞职一年，去10个国家，深度体验不同文化...',
    defaultAmount: 150000,
    imageColor: 'from-green-500/20 to-teal-500/20',
    category: 'freedom',
  },
  {
    id: 'mortgage-payoff',
    icon: Home,
    emoji: '🏠',
    title: '付清房贷尾款',
    description: '还清房贷，不再有月供压力，房子真正属于自己...',
    defaultAmount: 300000,
    imageColor: 'from-pink-500/20 to-rose-500/20',
    category: 'housing',
  },
  {
    id: 'custom-wish',
    icon: Sparkles,
    emoji: '✨',
    title: '自定义愿望',
    description: '写下你的小小心愿，无论大小，都值得被看见...',
    defaultAmount: 50000,
    imageColor: 'from-macaron-pink/20 to-macaron-purple/20',
    category: 'custom',
  },
];

interface WishCalculatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WishCalculatorModal({ open, onOpenChange }: WishCalculatorModalProps) {
  const [selectedWish, setSelectedWish] = useState<WishTemplate | null>(null);
  const [wishAmount, setWishAmount] = useState(80000);
  const [monthlySavings, setMonthlySavings] = useState(1000);
  const [calculationResult, setCalculationResult] = useState<WishCalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customWishName, setCustomWishName] = useState("");
  const [customWishAmount, setCustomWishAmount] = useState(50000);
  const [customWishDescription, setCustomWishDescription] = useState("");

  const [selectedSavedGoal, setSelectedSavedGoal] = useState<SavedGoal | null>(null);
  const { savedGoals, addGoal, deleteGoal, clearAllGoals } = useSavedGoalsStore();
  const [showSavedGoals, setShowSavedGoals] = useState(false);

  const calculate = () => {
    setIsCalculating(true);

    const baseRate = 0.02 / 12;
    const totalMonths = Math.log(1 + (wishAmount * baseRate) / monthlySavings) / Math.log(1 + baseRate);
    const targetYears = Math.max(1, Math.ceil(totalMonths / 12));

    let wishType: 'short-term' | 'medium-term' | 'long-term';
    let wishTypeLabel: string;
    let planBDescription: string;
    let planCDescription: string;
    let recommendedPlan: 'A' | 'B' | 'C';
    let riskLevel: '极低风险' | '中低风险' | '中高风险';

    if (targetYears <= 3) {
      wishType = 'short-term';
      wishTypeLabel = '短期灵活型';
      planBDescription = '货币基金(70%) + 纯债基金(30%)，追求稳健增值，本金安全有保障';
      planCDescription = '适合长期目标，短期使用可能导致较大波动风险';
      recommendedPlan = 'B';
      riskLevel = '极低风险';
    } else if (targetYears <= 5) {
      wishType = 'medium-term';
      wishTypeLabel = '中期稳健型';
      planBDescription = '货币基金(40%) + 纯债基金(50%) + 混合基金(10%)，平衡风险与收益';
      planCDescription = '指数基金(30%) + 混合基金(40%) + 债券基金(30%)，追求更高收益';
      recommendedPlan = 'B';
      riskLevel = '中低风险';
    } else {
      wishType = 'long-term';
      wishTypeLabel = '长期成长型';
      planBDescription = '货币基金(20%) + 纯债基金(50%) + 指数基金(30%)，稳健增值';
      planCDescription = '指数基金(50%) + 混合基金(40%) + 货币基金(10%)，追求长期成长';
      recommendedPlan = 'C';
      riskLevel = '中高风险';
    }

    const planARate = 0.02 / 12;
    const planAMonths = Math.log(1 + (wishAmount * planARate) / monthlySavings) / Math.log(1 + planARate);
    const planAYears = Math.max(1, Math.ceil(planAMonths / 12));

    setCalculationResult({
      wishAmount,
      monthlySavings,
      targetYears,
      wishType,
      wishTypeLabel,
      planAYears,
      planBDescription,
      planCDescription,
      recommendedPlan,
      riskLevel,
    });

    setTimeout(() => setIsCalculating(false), 800);
  };

  const selectWish = (wish: WishTemplate) => {
    if (wish.id === 'custom-wish') {
      setShowCustomForm(true);
    } else {
      setSelectedWish(wish);
      setWishAmount(wish.defaultAmount);
      setCalculationResult(null);
    }
  };

  const handleCustomWishSubmit = () => {
    if (!customWishName.trim() || !customWishAmount) {
      alert("请填写愿望名称和金额哦~");
      return;
    }

    const customWish: WishTemplate = {
      id: 'custom-' + Date.now(),
      icon: Sparkles,
      emoji: '✨',
      title: customWishName,
      description: customWishDescription || '我自己的小愿望',
      defaultAmount: customWishAmount,
      imageColor: 'from-macaron-pink/20 to-macaron-purple/20',
      category: 'custom',
    };

    setSelectedWish(customWish);
    setWishAmount(customWishAmount);
    setCalculationResult(null);
    setShowCustomForm(false);

    setCustomWishName("");
    setCustomWishAmount(50000);
    setCustomWishDescription("");
  };

  const saveCurrentWish = () => {
    if (!calculationResult || !selectedWish) return;

    addGoal({
      name: selectedWish.title,
      targetAmount: wishAmount,
      years: calculationResult.targetYears,
      monthlyInvestment: monthlySavings,
      category: selectedWish.category,
    });

    alert('✅ 愿望已保存！我们会帮你记住这个美好的目标~');
  };

  const loadSavedWish = (savedGoal: SavedGoal) => {
    setSelectedSavedGoal(savedGoal);
    setWishAmount(savedGoal.targetAmount);
    setMonthlySavings(savedGoal.monthlyInvestment);
    setCalculationResult(null);
    setShowSavedGoals(false);

    const matchedWish = wishTemplates.find(w => w.category === savedGoal.category);
    if (matchedWish) {
      setSelectedWish(matchedWish);
    }
  };

  const handleDeleteGoal = (id: string) => {
    if (confirm('确定要删除这个愿望吗？')) {
      deleteGoal(id);
    }
  };

  const getWishTypeBadge = (type: 'short-term' | 'medium-term' | 'long-term') => {
    switch (type) {
      case 'short-term':
        return { text: '短期灵活型', color: 'bg-blue-100 text-blue-800', icon: '⚡' };
      case 'medium-term':
        return { text: '中期稳健型', color: 'bg-green-100 text-green-800', icon: '🌱' };
      case 'long-term':
        return { text: '长期成长型', color: 'bg-purple-100 text-purple-800', icon: '🌳' };
    }
  };

  if (!open) return null;

  return (
    <>
      {/* 自定义愿望表单弹窗 */}
      {showCustomForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl p-6 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 font-cute flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-macaron-pink" />
                自定义你的愿望
              </h2>
              <button
                onClick={() => {
                  setShowCustomForm(false);
                  setCustomWishName("");
                  setCustomWishAmount(50000);
                  setCustomWishDescription("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  你的愿望 💫
                </label>
                <Input
                  value={customWishName}
                  onChange={(e) => setCustomWishName(e.target.value)}
                  placeholder="比如：买一台钢琴、学摄影..."
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  需要多少钱 💰
                </label>
                <Input
                  type="number"
                  value={customWishAmount}
                  onChange={(e) => setCustomWishAmount(Number(e.target.value))}
                  placeholder="50000"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  描述一下你的愿望 ✨
                </label>
                <textarea
                  value={customWishDescription}
                  onChange={(e) => setCustomWishDescription(e.target.value)}
                  placeholder="比如：一直想学钢琴，最近看中了一台..."
                  rows={3}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-macaron-pink/50 focus:ring-2 focus:ring-macaron-pink/20 text-sm resize-none"
                />
              </div>

              <Button
                onClick={handleCustomWishSubmit}
                className="w-full bg-gradient-to-r from-macaron-pink to-macaron-purple hover:from-macaron-pink/90 hover:to-macaron-purple/90 text-white font-cute"
              >
                <Plus className="w-4 h-4 mr-2" />
                开始规划
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 已保存愿望详情弹窗 */}
      {selectedSavedGoal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl p-6 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 font-cute flex items-center gap-2">
                <Target className="w-5 h-5 text-macaron-purple" />
                愿望详情
              </h2>
              <button
                onClick={() => setSelectedSavedGoal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-macaron-purple/10 rounded-xl p-4 border-2 border-macaron-purple/20">
                <p className="text-sm text-gray-600 mb-1">愿望</p>
                <p className="font-bold text-lg text-gray-800">{selectedSavedGoal.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-macaron-pink/10 rounded-xl p-4 border-2 border-macaron-pink/20">
                  <p className="text-sm text-gray-600 mb-1">目标金额</p>
                  <p className="font-bold text-lg text-macaron-pink">
                    ¥{selectedSavedGoal.targetAmount.toLocaleString()}
                  </p>
                </div>
                <div className="bg-macaron-green/10 rounded-xl p-4 border-2 border-macaron-green/20">
                  <p className="text-sm text-gray-600 mb-1">实现时间</p>
                  <p className="font-bold text-lg text-macaron-green">
                    {selectedSavedGoal.years}年
                  </p>
                </div>
              </div>

              <div className="bg-macaron-blue/10 rounded-xl p-4 border-2 border-macaron-blue/20">
                <p className="text-sm text-gray-600 mb-1">每月需要</p>
                <p className="font-bold text-2xl text-macaron-blue">
                  ¥{Math.round(selectedSavedGoal.monthlyInvestment).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">坚持{selectedSavedGoal.years}年就能实现~</p>
              </div>

              <div className="text-center text-xs text-gray-500">
                创建于 {new Date(selectedSavedGoal.createdAt).toLocaleDateString('zh-CN')}
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    loadSavedWish(selectedSavedGoal);
                    setSelectedSavedGoal(null);
                  }}
                  className="flex-1 bg-gradient-to-r from-macaron-purple to-macaron-pink hover:from-macaron-purple/90 hover:to-macaron-pink/90 text-white"
                >
                  重新计算
                </Button>
                <Button
                  onClick={() => {
                    if (confirm('确定要删除这个愿望吗？')) {
                      deleteGoal(selectedSavedGoal.id);
                      setSelectedSavedGoal(null);
                    }
                  }}
                  variant="outline"
                  className="flex-1 border-macaron-pink/30 text-macaron-pink hover:bg-macaron-pink/10"
                >
                  删除
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 主弹窗 */}
      {open && !showCustomForm && !selectedSavedGoal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => onOpenChange(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 标题色块 */}
            <div className="p-6 bg-gradient-to-r from-macaron-pink to-macaron-purple">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white font-cute">
                      ✨ 愿望计算器
                    </h2>
                  </div>
                  <p className="text-white/90 text-sm">
                    画出你的梦想，我们帮你算算最佳实现路径 💫
                  </p>
                </div>
                <button
                  onClick={() => onOpenChange(false)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 内容区域 */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
            {/* 已保存愿望 */}
            {savedGoals.length > 0 && (
              <button
                onClick={() => setShowSavedGoals(!showSavedGoals)}
                className="w-full p-4 rounded-xl border-2 border-macaron-blue/30 bg-macaron-blue/10 hover:bg-macaron-blue/20 transition-all duration-300"
              >
                <div className="flex items-center justify-center gap-2">
                  <Target className="w-5 h-5 text-macaron-blue" />
                  <span className="font-medium text-macaron-blue">
                    查看已保存的愿望 ({savedGoals.length})
                  </span>
                </div>
              </button>
            )}

            {showSavedGoals && savedGoals.length > 0 && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-700">🌟 我的愿望清单</h4>
                  <button
                    onClick={() => {
                      if (confirm('确定要清空所有愿望吗？')) {
                        clearAllGoals();
                      }
                    }}
                    className="text-xs text-macaron-pink hover:text-macaron-purple transition-colors"
                  >
                    清空全部
                  </button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {savedGoals.map((savedGoal) => (
                    <div
                      key={savedGoal.id}
                      className="bg-white rounded-xl p-4 border-2 border-macaron-pink/20 hover:border-macaron-purple/30 transition-all cursor-pointer hover:shadow-md"
                      onClick={() => setSelectedSavedGoal(savedGoal)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-800 mb-2">{savedGoal.name}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-600">
                            <span>¥{savedGoal.targetAmount.toLocaleString()}</span>
                            <span>·</span>
                            <span>{savedGoal.years}年</span>
                            <span>·</span>
                            <span>¥{Math.round(savedGoal.monthlyInvestment).toLocaleString()}/月</span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteGoal(savedGoal.id);
                          }}
                          className="p-2 text-gray-400 hover:text-macaron-pink transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!calculationResult ? (
              <>
                {/* 愿望选择 */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-700">🎨 选择你的愿望</label>
                  <div className="grid grid-cols-2 gap-4">
                    {wishTemplates.map((wish) => {
                      const Icon = wish.icon;
                      const isSelected = selectedWish?.id === wish.id;
                      return (
                        <button
                          key={wish.id}
                          onClick={() => selectWish(wish)}
                          className={cn(
                            "relative overflow-hidden rounded-xl border-2 transition-all duration-300 text-left p-4",
                            isSelected
                              ? "border-macaron-purple bg-macaron-purple/10 shadow-md"
                              : "border-macaron-pink/20 hover:border-macaron-purple/50 bg-white hover:shadow-md"
                          )}
                        >
                          <div className={cn(
                            "absolute inset-0 opacity-30 bg-gradient-to-br",
                            wish.imageColor
                          )} />

                          <div className="relative z-10">
                            <div className="flex items-start gap-2 mb-2">
                              <div className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center text-xl",
                                isSelected ? "bg-macaron-purple" : "bg-macaron-pink/20"
                              )}>
                                {wish.emoji}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className={cn(
                                  "font-bold text-sm mb-1 leading-tight",
                                  isSelected ? "text-macaron-purple" : "text-gray-800"
                                )}>
                                  {wish.title}
                                </h3>
                                <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                                  {wish.description}
                                </p>
                              </div>
                            </div>
                            <div className={cn(
                              "text-xs font-medium inline-block px-2 py-0.5 rounded-full",
                              isSelected
                                ? "bg-macaron-purple text-white"
                                : "bg-macaron-pink/20 text-macaron-pink"
                            )}>
                              ¥{wish.defaultAmount.toLocaleString()}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 愿望金额 */}
                <div className="space-y-3">
                  <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
                    <Target className="w-4 h-4 text-macaron-purple" />
                    <span>这个愿望需要多少钱？</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-macaron-purple">¥</span>
                    <input
                      type="number"
                      value={wishAmount}
                      onChange={(e) => setWishAmount(Number(e.target.value))}
                      min="1000"
                      max="1000000"
                      step="1000"
                      className="flex-1 px-4 py-2 text-2xl font-bold text-macaron-purple bg-white border-2 border-macaron-purple/30 rounded-xl focus:border-macaron-purple focus:outline-none transition-colors"
                      placeholder="80000"
                    />
                  </div>
                </div>

                {/* 每月能存多少 */}
                <div className="space-y-3">
                  <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4 text-macaron-green" />
                    <span>你每月能为它存下多少？</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-macaron-green">¥</span>
                    <input
                      type="number"
                      value={monthlySavings}
                      onChange={(e) => setMonthlySavings(Number(e.target.value))}
                      min="100"
                      max="100000"
                      step="100"
                      className="flex-1 px-4 py-2 text-2xl font-bold text-macaron-green bg-white border-2 border-macaron-green/30 rounded-xl focus:border-macaron-green focus:outline-none transition-colors"
                      placeholder="1000"
                    />
                    <span className="text-sm text-gray-500">/月</span>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    💡 小贴士：每天少点一杯奶茶，就能轻松攒下这个数~
                  </p>
                </div>

                {/* 计算按钮 */}
                <Button
                  onClick={calculate}
                  size="lg"
                  disabled={!selectedWish}
                  className={cn(
                    "w-full bg-gradient-to-r from-macaron-purple to-macaron-pink hover:from-macaron-purple/90 hover:to-macaron-pink/90 text-white font-cute font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300",
                    isCalculating && "animate-pulse",
                    !selectedWish && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {isCalculating ? "正在分析你的愿望..." : "开始计算我的愿望"}
                </Button>
              </>
            ) : (
              <>
                {/* 计算结果 */}
                <div className="space-y-6">
                  {/* 愿望展示 */}
                  <div className="bg-white rounded-2xl p-6 border-2 border-macaron-purple/20">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">{selectedWish?.emoji}</div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 mb-1 font-cute">
                            {selectedWish?.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-xs font-medium",
                              getWishTypeBadge(calculationResult.wishType).color
                            )}>
                              {getWishTypeBadge(calculationResult.wishType).icon} {calculationResult.wishTypeLabel}
                            </span>
                            <span className="text-xs text-gray-500">
                              风险偏好：{calculationResult.riskLevel}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-macaron-purple/10 to-macaron-pink/10 rounded-xl p-3">
                        <div className="flex items-baseline justify-between gap-4">
                          <div>
                            <p className="text-xs text-gray-600 mb-1">愿望金额</p>
                            <p className="text-2xl font-bold text-macaron-purple">
                              ¥{wishAmount.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-600 mb-1">每月储蓄</p>
                            <p className="text-lg font-bold text-macaron-green">
                              ¥{monthlySavings.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 推荐提示 */}
                  <div className="bg-gradient-to-r from-macaron-purple/20 to-macaron-pink/20 rounded-2xl p-4 border-2 border-macaron-purple/30">
                    <div className="flex items-start gap-2">
                      <TrendingUp className="w-5 h-5 text-macaron-purple flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-gray-800 mb-1 text-sm">
                          💡 基于你的愿望类型，我们为你推荐<strong>方案{calculationResult.recommendedPlan}</strong>
                        </h4>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          这个方案最适合你的时间目标和风险承受能力，在实现愿望的路上能够让你既安心又高效。
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 方案对比 */}
                  <div className="bg-white rounded-2xl p-4 border-2 border-macaron-yellow/30 overflow-x-auto">
                    <h4 className="font-bold text-gray-800 mb-3 text-center text-sm">📊 三种方案全面对比</h4>

                    <table className="w-full min-w-[500px] text-xs">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="py-2 px-2 text-left font-semibold text-gray-700">方案</th>
                          <th className="py-2 px-2 text-center font-semibold text-gray-700">预期年化</th>
                          <th className="py-2 px-2 text-center font-semibold text-gray-700">实现时间</th>
                          <th className="py-2 px-2 text-left font-semibold text-gray-700">风险提示</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className={cn("border-b border-gray-100", calculationResult.recommendedPlan === 'A' && "bg-macaron-green/50")}>
                          <td className="py-3 px-2">
                            <div className="font-bold text-gray-800 text-xs">原地踏步法</div>
                            <div className="text-xs text-gray-500">银行定期</div>
                          </td>
                          <td className="py-3 px-2 text-center font-semibold text-gray-600">1.5% - 2.5%</td>
                          <td className="py-3 px-2 text-center font-bold text-gray-600">{calculationResult.planAYears}年</td>
                          <td className="py-3 px-2 text-xs text-gray-700">通胀风险：购买力可能下降</td>
                        </tr>

                        <tr className={cn("border-b border-gray-100", calculationResult.recommendedPlan === 'B' && "bg-macaron-green/50")}>
                          <td className="py-3 px-2">
                            <div className="font-bold text-gray-800 text-xs">稳健增值法</div>
                            <div className="text-xs text-gray-500">货币+债券基金</div>
                          </td>
                          <td className="py-3 px-2 text-center font-semibold text-macaron-purple">2.5% - 4.5%</td>
                          <td className="py-3 px-2 text-center font-bold text-macaron-purple">
                            {Math.max(1, calculationResult.planAYears - Math.ceil(calculationResult.planAYears * 0.15))}年
                          </td>
                          <td className="py-3 px-2 text-xs text-gray-700">短期波动：偶尔会有几天的小幅账面亏损</td>
                        </tr>

                        <tr className={cn(calculationResult.recommendedPlan === 'C' && "bg-macaron-green/50")}>
                          <td className="py-3 px-2">
                            <div className="font-bold text-gray-800 text-xs">积极成长法</div>
                            <div className="text-xs text-gray-500">指数+混合基金</div>
                          </td>
                          <td className="py-3 px-2 text-center font-semibold text-macaron-pink">4.0% - 8.0%</td>
                          <td className="py-3 px-2 text-center font-bold text-macaron-pink">
                            {Math.max(1, calculationResult.planAYears - Math.ceil(calculationResult.planAYears * 0.35))}年
                          </td>
                          <td className="py-3 px-2 text-xs text-gray-700">显著波动：可能面临 -10% 至 -20% 的阶段性回调</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* 方案可视化 */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className={cn("bg-white rounded-lg p-3 border-2 text-center", calculationResult.recommendedPlan === 'A' ? "border-macaron-green shadow-md" : "border-gray-200")}>
                      <div className="text-2xl mb-1">🏦</div>
                      <div className="font-bold text-gray-800 text-xs mb-1">原地踏步</div>
                      <div className="text-xs text-gray-600 mb-1">{calculationResult.planAYears}年</div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-gray-400 h-1.5 rounded-full" style={{ width: '100%' }} />
                      </div>
                    </div>

                    <div className={cn("bg-white rounded-lg p-3 border-2 text-center", calculationResult.recommendedPlan === 'B' ? "border-macaron-green shadow-md" : "border-macaron-purple/30")}>
                      <div className="text-2xl mb-1">📈</div>
                      <div className="font-bold text-gray-800 text-xs mb-1">稳健增值</div>
                      <div className="text-xs text-macaron-purple mb-1 font-bold">
                        {Math.max(1, calculationResult.planAYears - Math.ceil(calculationResult.planAYears * 0.15))}年
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-macaron-purple h-1.5 rounded-full" style={{ width: '85%' }} />
                      </div>
                    </div>

                    <div className={cn("bg-white rounded-lg p-3 border-2 text-center", calculationResult.recommendedPlan === 'C' ? "border-macaron-green shadow-md" : "border-macaron-pink/30")}>
                      <div className="text-2xl mb-1">🚀</div>
                      <div className="font-bold text-gray-800 text-xs mb-1">积极成长</div>
                      <div className="text-xs text-macaron-pink mb-1 font-bold">
                        {Math.max(1, calculationResult.planAYears - Math.ceil(calculationResult.planAYears * 0.35))}年
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-gradient-to-r from-macaron-purple to-macaron-pink h-1.5 rounded-full" style={{ width: '65%' }} />
                      </div>
                    </div>
                  </div>

                  {/* 保存按钮 */}
                  <Button
                    onClick={saveCurrentWish}
                    className="w-full bg-gradient-to-r from-macaron-blue to-macaron-purple hover:from-macaron-blue/90 hover:to-macaron-purple/90 text-white"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    保存这个愿望
                  </Button>

                  {/* 温馨提示 */}
                  <div className="bg-macaron-yellow/20 rounded-xl p-3 border-2 border-macaron-yellow/30">
                    <p className="text-xs text-gray-700 text-center leading-relaxed">
                      ⚠️ <strong>温馨提示：</strong>以上为基于历史数据的模拟计算，不同组合的实际收益会因市场波动而有所不同。方案C虽然可能带来更高收益，但也伴随着更大的波动风险。请根据自身情况慎重选择！
                    </p>
                  </div>

                  {/* 重新计算按钮 */}
                  <Button
                    onClick={() => setCalculationResult(null)}
                    variant="outline"
                    className="w-full"
                  >
                    计算另一个愿望
                  </Button>
                </div>
              </>
            )}
          </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
