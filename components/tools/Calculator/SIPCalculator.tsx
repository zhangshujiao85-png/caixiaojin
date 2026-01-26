"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, Calendar, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface CalculationResult {
  monthlyInvestment: number;
  years: number;
  expectedReturn: number;
  totalInvestment: number;
  estimatedReturns: number;
  totalValue: number;
}

export function SIPCalculator() {
  const [monthlyAmount, setMonthlyAmount] = useState(1000);
  const [years, setYears] = useState(5);
  const [expectedReturn, setExpectedReturn] = useState(10);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculate = () => {
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
      expectedReturn,
      totalInvestment,
      estimatedReturns,
      totalValue,
    });
  };

  const getResultMessage = () => {
    if (!result) return "";

    const { totalInvestment, estimatedReturns, totalValue } = result;

    if (estimatedReturns < 0) {
      return "哎呀，这个收益率不太理想呢～要不要试试其他配置？";
    } else if (estimatedReturns < totalInvestment * 0.3) {
      return "不错哦！坚持定投，小钱也能变大钱～";
    } else if (estimatedReturns < totalInvestment * 0.7) {
      return "哇！收益不错呢，这就是复利的魔力～";
    } else {
      return "太棒了！坚持就是胜利，你的钱在努力工作～";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Calculator Card */}
      <Card className="border-macaron-pink/20">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-macaron-pink" />
            定投计算器
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Monthly Investment */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                每月定投金额
              </label>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-macaron-pink">
                  {formatCurrency(monthlyAmount)}
                </span>
              </div>
            </div>
            <Input
              type="number"
              value={monthlyAmount}
              onChange={(e) => setMonthlyAmount(Number(e.target.value))}
              min={100}
              max={50000}
              step={100}
              className="text-lg"
            />
            <Slider
              value={[monthlyAmount]}
              onValueChange={(value) => setMonthlyAmount(value[0])}
              min={100}
              max={50000}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>¥100</span>
              <span>¥50,000</span>
            </div>
          </div>

          {/* Investment Duration */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                投资时长
              </label>
              <span className="text-2xl font-bold text-macaron-pink">
                {years} 年
              </span>
            </div>
            <Slider
              value={[years]}
              onValueChange={(value) => setYears(value[0])}
              min={1}
              max={30}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1年</span>
              <span>30年</span>
            </div>
          </div>

          {/* Expected Return */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">预期年化收益率</label>
              <span className="text-2xl font-bold text-macaron-pink">
                {expectedReturn}%
              </span>
            </div>
            <Slider
              value={[expectedReturn]}
              onValueChange={(value) => setExpectedReturn(value[0])}
              min={1}
              max={20}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1%</span>
              <span>20%</span>
            </div>
          </div>

          <Button
            onClick={calculate}
            size="lg"
            className="w-full bg-macaron-pink hover:bg-macaron-pink/90 text-white"
          >
            开始计算
          </Button>
        </CardContent>
      </Card>

      {/* Result Card */}
      {result && (
        <Card className="border-macaron-green/30 bg-gradient-to-br from-macaron-green/10 to-transparent">
          <CardHeader>
            <CardTitle className="text-xl">计算结果</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary Message */}
            <div className="bg-white rounded-card p-4 text-center">
              <p className="text-lg text-gray-700">{getResultMessage()}</p>
            </div>

            {/* Numbers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-card p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">投入本金</p>
                <p className="text-xl font-bold text-gray-800">
                  {formatCurrency(result.totalInvestment)}
                </p>
              </div>
              <div className="bg-white rounded-card p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">预期收益</p>
                <p className="text-xl font-bold text-macaron-pink">
                  {formatCurrency(result.estimatedReturns)}
                </p>
              </div>
              <div className="bg-white rounded-card p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">总金额</p>
                <p className="text-xl font-bold text-macaron-green">
                  {formatCurrency(result.totalValue)}
                </p>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-macaron-yellow/30 rounded-card p-4">
              <p className="text-sm text-gray-700">
                💡 <strong>小贴士：</strong>以上计算基于预期年化收益率
                {result.expectedReturn}%，实际收益可能会有波动。建议坚持长期定投，平滑市场波动。
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
