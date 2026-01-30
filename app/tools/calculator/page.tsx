"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, ArrowLeft, Target, Plane, Home, Coffee, Map, Calendar, TrendingUp, Shield, Zap, AlertCircle, Plus } from "lucide-react";
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

export default function CalculatorPage() {
  // 愿望选择状态
  const [selectedWish, setSelectedWish] = useState<WishTemplate | null>(null);
  const [wishAmount, setWishAmount] = useState(80000);
  const [monthlySavings, setMonthlySavings] = useState(1000);
  const [calculationResult, setCalculationResult] = useState<WishCalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // 自定义愿望状态
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customWishName, setCustomWishName] = useState("");
  const [customWishAmount, setCustomWishAmount] = useState(50000);
  const [customWishDescription, setCustomWishDescription] = useState("");

  // 查看已保存愿望详情
  const [selectedSavedGoal, setSelectedSavedGoal] = useState<SavedGoal | null>(null);

  // 保存目标功能
  const { savedGoals, addGoal, deleteGoal, clearAllGoals } = useSavedGoalsStore();
  const [showSavedGoals, setShowSavedGoals] = useState(false);

  // 计算需要的时间并判定愿望属性
  const calculate = () => {
    setIsCalculating(true);

    // 计算实现愿望需要的基础年数（使用年化2%的保守估计）
    const baseRate = 0.02 / 12; // 月利率
    const totalMonths = Math.log(1 + (wishAmount * baseRate) / monthlySavings) / Math.log(1 + baseRate);
    const targetYears = Math.max(1, Math.ceil(totalMonths / 12));

    // 判定愿望属性
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

    // 计算三种方案需要的年数
    // 方案A：银行定期（年化2%）
    const planARate = 0.02 / 12;
    const planAMonths = Math.log(1 + (wishAmount * planARate) / monthlySavings) / Math.log(1 + planARate);
    const planAYears = Math.max(1, Math.ceil(planAMonths / 12));

    // 方案B：稳健增值（根据类型不同，年化2.5%-4.5%）
    const planBRate = wishType === 'short-term' ? 0.035 : wishType === 'medium-term' ? 0.035 : 0.035;
    const planBMonths = Math.log(1 + (wishAmount * planBRate) / monthlySavings) / Math.log(1 + planBRate);
    const planBYears = Math.max(1, Math.ceil(planBMonths / 12));

    // 方案C：积极成长（年化4%-8%）
    const planCRate = wishType === 'short-term' ? 0.06 : wishType === 'medium-term' ? 0.06 : 0.06;
    const planCMonths = Math.log(1 + (wishAmount * planCRate) / monthlySavings) / Math.log(1 + planCRate);
    const planCYears = Math.max(1, Math.ceil(planCMonths / 12));

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

    // 重置表单
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
    // 显示愿望详情
    setSelectedSavedGoal(savedGoal);

    // 同时加载到计算器
    setWishAmount(savedGoal.targetAmount);
    setMonthlySavings(savedGoal.monthlyInvestment);
    setCalculationResult(null);
    setShowSavedGoals(false);

    // 尝试匹配愿望模板
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-macaron-pink/20 via-macaron-cream to-macaron-green/20 py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        {/* 返回按钮 */}
        <Link href="/tools" className="inline-flex items-center gap-2 text-macaron-pink hover:text-macaron-purple transition-colors mb-6 group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-cute font-medium">返回工具箱</span>
        </Link>

        {/* 标题区域 */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-macaron-pink to-macaron-purple flex items-center justify-center shadow-lg animate-bounce" style={{ animationDuration: "2s" }}>
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 font-cute">
            ✨ 愿望计算器
          </h1>
          <p className="text-gray-600 text-base md:text-lg font-medium">
            画出你的梦想，我们帮你算算最佳实现路径 💫
          </p>
        </div>

        {/* 主卡片 */}
        <Card className="border-2 border-macaron-purple/30 bg-white/80 backdrop-blur-sm shadow-xl mb-8">
          <CardContent className="p-6 md:p-8 space-y-8">
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

            {/* 愿望选择 */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-700">🎨 选择你的愿望</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wishTemplates.map((wish) => {
                  const Icon = wish.icon;
                  const isSelected = selectedWish?.id === wish.id;
                  return (
                    <button
                      key={wish.id}
                      onClick={() => selectWish(wish)}
                      className={cn(
                        "relative overflow-hidden rounded-xl border-2 transition-all duration-300 text-left p-5",
                        isSelected
                          ? "border-macaron-purple bg-macaron-purple/10 shadow-md"
                          : "border-macaron-pink/20 hover:border-macaron-purple/50 bg-white hover:shadow-md"
                      )}
                    >
                      {/* 渐变背景 */}
                      <div className={cn(
                        "absolute inset-0 opacity-30 bg-gradient-to-br",
                        wish.imageColor
                      )} />

                      <div className="relative z-10">
                        <div className="flex items-start gap-3 mb-3">
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center text-2xl",
                            isSelected ? "bg-macaron-purple" : "bg-macaron-pink/20"
                          )}>
                            {wish.emoji}
                          </div>
                          <div className="flex-1">
                            <h3 className={cn(
                              "font-bold mb-1",
                              isSelected ? "text-macaron-purple" : "text-gray-800"
                            )}>
                              {wish.title}
                            </h3>
                            <p className="text-xs text-gray-600 leading-relaxed">
                              {wish.description}
                            </p>
                          </div>
                        </div>
                        <div className={cn(
                          "text-xs font-medium inline-block px-3 py-1 rounded-full",
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
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
                  <Target className="w-5 h-5 text-macaron-purple" />
                  <span>这个愿望需要多少钱？</span>
                </label>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl md:text-3xl font-bold text-macaron-purple min-w-fit">¥</span>
                <input
                  type="number"
                  value={wishAmount}
                  onChange={(e) => setWishAmount(Number(e.target.value))}
                  min="1000"
                  max="1000000"
                  step="1000"
                  className="flex-1 px-4 py-3 text-2xl md:text-3xl font-bold text-macaron-purple bg-white border-2 border-macaron-purple/30 rounded-xl focus:border-macaron-purple focus:outline-none transition-colors"
                  placeholder="80000"
                />
              </div>
            </div>

            {/* 每月能存多少 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
                  <Calendar className="w-5 h-5 text-macaron-green" />
                  <span>你每月能为它存下多少？</span>
                </label>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl md:text-3xl font-bold text-macaron-green min-w-fit">¥</span>
                <input
                  type="number"
                  value={monthlySavings}
                  onChange={(e) => setMonthlySavings(Number(e.target.value))}
                  min="100"
                  max="100000"
                  step="100"
                  className="flex-1 px-4 py-3 text-2xl md:text-3xl font-bold text-macaron-green bg-white border-2 border-macaron-green/30 rounded-xl focus:border-macaron-green focus:outline-none transition-colors"
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
          </CardContent>
        </Card>

        {/* 计算结果 */}
        {calculationResult && (
          <Card className="border-2 border-macaron-green/30 bg-gradient-to-br from-macaron-green/10 to-macaron-blue/10 shadow-xl animate-in fade-in zoom-in duration-500">
            <CardContent className="p-6 md:p-8 space-y-6">
              {/* 愿望展示 + 愿望属性判定 */}
              <div className="bg-white rounded-2xl p-6 border-2 border-macaron-purple/20">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{selectedWish?.emoji}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1 font-cute">
                        {selectedWish?.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium",
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
                  <div className="bg-gradient-to-r from-macaron-purple/10 to-macaron-pink/10 rounded-xl p-4 mt-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">愿望金额</p>
                        <p className="text-3xl md:text-4xl font-bold text-macaron-purple">
                          ¥{wishAmount.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">每月储蓄</p>
                        <p className="text-2xl font-bold text-macaron-green">
                          ¥{monthlySavings.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 推荐提示 */}
              <div className="bg-gradient-to-r from-macaron-purple/20 to-macaron-pink/20 rounded-2xl p-5 border-2 border-macaron-purple/30">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-6 h-6 text-macaron-purple flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">
                      💡 基于你的愿望类型，我们为你推荐<strong>方案{calculationResult.recommendedPlan}</strong>
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      这个方案最适合你的时间目标和风险承受能力，在实现愿望的路上能够让你既安心又高效。
                    </p>
                  </div>
                </div>
              </div>

              {/* 三方案对比表格 */}
              <div className="bg-white rounded-2xl p-6 border-2 border-macaron-yellow/30 overflow-x-auto">
                <h4 className="font-bold text-gray-800 mb-4 text-center">📊 三种方案全面对比</h4>

                {/* 表格 */}
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">方案</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">模拟组合描述</th>
                      <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">预期年化回报</th>
                      <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">预计实现时间</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">风险提示</th>
                      <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">适合谁</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* 方案A */}
                    <tr className={cn(
                      "border-b border-gray-100 transition-all",
                      calculationResult.recommendedPlan === 'A' && "bg-macaron-green/50"
                    )}>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {calculationResult.recommendedPlan === 'A' && (
                            <span className="text-macaron-green">⭐</span>
                          )}
                          <div>
                            <div className="font-bold text-gray-800">方案A：原地踏步法</div>
                            <div className="text-xs text-gray-500">100% 银行定期存款</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        银行定期存款，保本保息
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="font-semibold text-gray-600">1.5% - 2.5%</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-xl font-bold text-gray-600">{calculationResult.planAYears}年</span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        <div className="flex items-start gap-1">
                          <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <span>通胀风险：购买力可能下降</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center text-sm text-gray-600">
                        极度风险厌恶者
                      </td>
                    </tr>

                    {/* 方案B */}
                    <tr className={cn(
                      "border-b border-gray-100 transition-all",
                      calculationResult.recommendedPlan === 'B' && "bg-macaron-green/50"
                    )}>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {calculationResult.recommendedPlan === 'B' && (
                            <span className="text-macaron-green">⭐</span>
                          )}
                          <div>
                            <div className="font-bold text-gray-800">方案B：稳健增值法</div>
                            <div className="text-xs text-gray-500">货币基金 + 纯债基金</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        {calculationResult.planBDescription}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="font-semibold text-macaron-purple">2.5% - 4.5%</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-xl font-bold text-macaron-purple">
                          {Math.max(1, calculationResult.planAYears - Math.ceil(calculationResult.planAYears * 0.15))}年
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        <div className="flex items-start gap-1">
                          <Shield className="w-4 h-4 text-macaron-blue flex-shrink-0 mt-0.5" />
                          <span>短期波动：偶尔会有几天的小幅账面亏损</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center text-sm text-gray-600">
                        追求稳健，能接受轻微波动的你
                      </td>
                    </tr>

                    {/* 方案C */}
                    <tr className={cn(
                      "transition-all",
                      calculationResult.recommendedPlan === 'C' && "bg-macaron-green/50"
                    )}>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {calculationResult.recommendedPlan === 'C' && (
                            <span className="text-macaron-green">⭐</span>
                          )}
                          <div>
                            <div className="font-bold text-gray-800">方案C：积极成长法</div>
                            <div className="text-xs text-gray-500">指数基金 + 混合基金</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        {calculationResult.planCDescription}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="font-semibold text-macaron-pink">4.0% - 8.0%</span>
                        <div className="text-xs text-gray-500">波动大</div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-xl font-bold text-macaron-pink">
                          {Math.max(1, calculationResult.planAYears - Math.ceil(calculationResult.planAYears * 0.35))}年
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        <div className="flex items-start gap-1">
                          <Zap className="w-4 h-4 text-macaron-pink flex-shrink-0 mt-0.5" />
                          <span>显著波动：可能面临 -10% 至 -20% 的阶段性回调</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center text-sm text-gray-600">
                        为长期目标，愿意承受波动换取更高可能性的你
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 方案对比可视化 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 方案A卡片 */}
                <div className={cn(
                  "bg-white rounded-xl p-4 border-2 transition-all",
                  calculationResult.recommendedPlan === 'A'
                    ? "border-macaron-green shadow-md"
                    : "border-gray-200"
                )}>
                  <div className="text-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 mx-auto mb-2 flex items-center justify-center">
                      <span className="text-lg">🏦</span>
                    </div>
                    <h5 className="font-bold text-gray-800 text-sm">原地踏步</h5>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">实现时间</span>
                      <span className="font-bold">{calculationResult.planAYears}年</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-400 h-2 rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>
                </div>

                {/* 方案B卡片 */}
                <div className={cn(
                  "bg-white rounded-xl p-4 border-2 transition-all",
                  calculationResult.recommendedPlan === 'B'
                    ? "border-macaron-green shadow-md"
                    : "border-macaron-purple/30"
                )}>
                  <div className="text-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-macaron-purple/20 mx-auto mb-2 flex items-center justify-center">
                      <span className="text-lg">📈</span>
                    </div>
                    <h5 className="font-bold text-gray-800 text-sm">稳健增值</h5>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">实现时间</span>
                      <span className="font-bold text-macaron-purple">
                        {Math.max(1, calculationResult.planAYears - Math.ceil(calculationResult.planAYears * 0.15))}年
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-macaron-purple h-2 rounded-full"
                        style={{ width: `${85}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* 方案C卡片 */}
                <div className={cn(
                  "bg-white rounded-xl p-4 border-2 transition-all",
                  calculationResult.recommendedPlan === 'C'
                    ? "border-macaron-green shadow-md"
                    : "border-macaron-pink/30"
                )}>
                  <div className="text-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-macaron-pink/20 mx-auto mb-2 flex items-center justify-center">
                      <span className="text-lg">🚀</span>
                    </div>
                    <h5 className="font-bold text-gray-800 text-sm">积极成长</h5>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">实现时间</span>
                      <span className="font-bold text-macaron-pink">
                        {Math.max(1, calculationResult.planAYears - Math.ceil(calculationResult.planAYears * 0.35))}年
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-macaron-purple to-macaron-pink h-2 rounded-full"
                        style={{ width: `${65}%` }}
                      />
                    </div>
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
              <div className="bg-macaron-yellow/20 rounded-2xl p-4 border-2 border-macaron-yellow/30">
                <p className="text-sm text-gray-700 text-center leading-relaxed">
                  ⚠️ <strong>温馨提示：</strong>以上为基于历史数据的模拟计算，不同组合的实际收益会因市场波动而有所不同。
                  方案C虽然可能带来更高收益，但也伴随着更大的波动风险。请根据自身情况慎重选择！
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 自定义愿望表单弹窗 */}
        {showCustomForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
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
                {/* 愿望名称 */}
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

                {/* 愿望金额 */}
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

                {/* 愿望描述 */}
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

                {/* 提交按钮 */}
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
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
                {/* 愿望名称 */}
                <div className="bg-macaron-purple/10 rounded-xl p-4 border-2 border-macaron-purple/20">
                  <p className="text-sm text-gray-600 mb-1">愿望</p>
                  <p className="font-bold text-lg text-gray-800">{selectedSavedGoal.name}</p>
                </div>

                {/* 愿望信息 */}
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

                {/* 每月投资 */}
                <div className="bg-macaron-blue/10 rounded-xl p-4 border-2 border-macaron-blue/20">
                  <p className="text-sm text-gray-600 mb-1">每月需要</p>
                  <p className="font-bold text-2xl text-macaron-blue">
                    ¥{Math.round(selectedSavedGoal.monthlyInvestment).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">坚持{selectedSavedGoal.years}年就能实现~</p>
                </div>

                {/* 创建时间 */}
                <div className="text-center text-xs text-gray-500">
                  创建于 {new Date(selectedSavedGoal.createdAt).toLocaleDateString('zh-CN')}
                </div>

                {/* 操作按钮 */}
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
      </div>
    </div>
  );
}
