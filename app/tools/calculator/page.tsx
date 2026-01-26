"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, Calendar, Coffee, Sparkles, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalculationResult {
  monthlyInvestment: number;
  years: number;
  months: number;
  expectedReturn: number;
  totalInvestment: number;
  estimatedReturns: number;
  totalValue: number;
}

export default function CalculatorPage() {
  const [monthlyAmount, setMonthlyAmount] = useState(500);
  const [years, setYears] = useState(3);
  const [expectedReturn, setExpectedReturn] = useState(8);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const calculate = () => {
    setIsAnimating(true);
    const monthlyRate = expectedReturn / 12 / 100;
    const totalMonths = years * 12;

    // SIP Future Value Formula: P × ({[1 + i]^n – 1} / i) × (1 + i)
    const totalValue =
      monthlyAmount *
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
      (1 + monthlyRate);

    const totalInvestment = monthlyAmount * totalMonths;
    const estimatedReturns = totalValue - totalInvestment;

    setResult({
      monthlyInvestment: monthlyAmount,
      years,
      months: totalMonths,
      expectedReturn,
      totalInvestment,
      estimatedReturns,
      totalValue,
    });

    setTimeout(() => setIsAnimating(false), 500);
  };

  const getResultMessage = () => {
    if (!result) return "";

    const { totalInvestment, estimatedReturns, months } = result;

    // 根据收益金额给出具象化的文案
    let rewardDescription = "";
    if (estimatedReturns < 200) {
      rewardDescription = "够买几次奶茶 🧋";
    } else if (estimatedReturns < 500) {
      rewardDescription = "刚好够1次美甲 💅";
    } else if (estimatedReturns < 1000) {
      rewardDescription = "能买1套护肤品 ✨";
    } else if (estimatedReturns < 2000) {
      rewardDescription = "够1次短途旅行 🚗";
    } else if (estimatedReturns < 5000) {
      rewardDescription = "半年奶茶自由 🧋";
    } else if (estimatedReturns < 10000) {
      rewardDescription = "1次豪华旅行 ✈️";
    } else {
      rewardDescription = "实现一个小梦想 🌟";
    }

    return `每月存 ¥${result.monthlyInvestment}，坚持 ${months} 个月，预估能赚 ¥${Math.round(estimatedReturns)} —— ${rewardDescription}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-macaron-pink/20 via-macaron-cream to-macaron-green/20 py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        {/* 返回按钮 */}
        <Link href="/tools" className="inline-flex items-center gap-2 text-macaron-pink hover:text-macaron-purple transition-colors mb-6 group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-cute font-medium">返回工具箱</span>
        </Link>

        {/* 标题区域 */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-macaron-pink to-macaron-purple flex items-center justify-center shadow-lg animate-bounce" style={{ animationDuration: "2s" }}>
              <Coffee className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 font-cute">
            💰 算算你的奶茶钱，能攒出多少惊喜
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            奶茶钱、美甲钱都可以，小钱也能变大钱~
          </p>
        </div>

        {/* 计算器卡片 */}
        <Card className="border-2 border-macaron-pink/30 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardContent className="p-6 md:p-8 space-y-8">
            {/* 每月定投金额 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
                  <Coffee className="w-5 h-5 text-macaron-pink" />
                  每月定投金额（奶茶钱/美甲钱）
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-2xl md:text-3xl font-bold text-macaron-pink">
                    ¥{monthlyAmount}
                  </span>
                </div>
              </div>
              <div className="px-2">
                <Slider
                  value={[monthlyAmount]}
                  onValueChange={(value) => setMonthlyAmount(value[0])}
                  min={100}
                  max={50000}
                  step={100}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 px-2">
                <span>¥100</span>
                <span className="text-macaron-pink font-medium">推荐：¥500-1000</span>
                <span>¥50,000</span>
              </div>
            </div>

            {/* 定投时长 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
                  <Calendar className="w-5 h-5 text-macaron-green" />
                  定投时长
                </label>
                <span className="text-2xl md:text-3xl font-bold text-macaron-green">
                  {years}年
                </span>
              </div>
              <div className="px-2">
                <Slider
                  value={[years]}
                  onValueChange={(value) => setYears(value[0])}
                  min={1}
                  max={30}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 px-2">
                <span>1年</span>
                <span className="text-macaron-green font-medium">推荐：3-5年</span>
                <span>30年</span>
              </div>
            </div>

            {/* 预期年化收益率 - 简化版，不显示slider */}
            <div className="bg-macaron-cream rounded-2xl p-4 border-2 border-macaron-yellow/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">预期年化收益率</p>
                  <p className="text-xs text-gray-500">基于历史数据估算</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-macaron-purple">{expectedReturn}%</p>
                  <p className="text-xs text-gray-500 mt-1">混合型基金平均</p>
                </div>
              </div>
            </div>

            {/* 计算按钮 */}
            <Button
              onClick={calculate}
              size="lg"
              className={cn(
                "w-full bg-gradient-to-r from-macaron-pink to-macaron-purple hover:from-macaron-pink/90 hover:to-macaron-purple/90 text-white font-cute font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300",
                isAnimating && "animate-pulse"
              )}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              开始计算
            </Button>
          </CardContent>
        </Card>

        {/* 结果卡片 */}
        {result && (
          <Card className="border-2 border-macaron-green/30 bg-gradient-to-br from-macaron-green/10 to-macaron-blue/10 shadow-xl animate-in fade-in zoom-in duration-500">
            <CardContent className="p-6 md:p-8 space-y-6">
              {/* 主要结果文案 */}
              <div className="bg-white rounded-2xl p-6 text-center border-2 border-macaron-pink/20">
                <div className="mb-4">
                  <TrendingUp className="w-12 h-12 text-macaron-pink mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-gray-800 mb-3 font-cute">
                    🎉 计算结果
                  </h3>
                </div>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
                  {getResultMessage()}
                </p>
              </div>

              {/* 详细数据 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-5 text-center border-2 border-macaron-blue/20">
                  <p className="text-sm text-gray-600 mb-2">投入本金</p>
                  <p className="text-2xl font-bold text-macaron-blue">
                    ¥{result.totalInvestment.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-5 text-center border-2 border-macaron-pink/20">
                  <p className="text-sm text-gray-600 mb-2">预估收益</p>
                  <p className="text-2xl font-bold text-macaron-pink">
                    +¥{Math.round(result.estimatedReturns).toLocaleString()}
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-5 text-center border-2 border-macaron-green/20">
                  <p className="text-sm text-gray-600 mb-2">总金额</p>
                  <p className="text-2xl font-bold text-macaron-green">
                    ¥{Math.round(result.totalValue).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* 风险提示 */}
              <div className="bg-macaron-yellow/20 rounded-2xl p-4 border-2 border-macaron-yellow/30">
                <p className="text-sm text-gray-700 text-center leading-relaxed">
                  ⚠️ <strong>温馨提示：</strong>以上为预估收益，理财有风险，稳一点更安心。
                  实际收益可能会因市场波动而有所不同，建议坚持长期定投，平滑市场波动~
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 底部提示 */}
        <div className="text-center py-4">
          <p className="text-xs text-gray-500">
            💡 小贴士：定投最重要的是坚持，不管市场涨跌都要保持投资节奏哦~
          </p>
        </div>
      </div>
    </div>
  );
}
