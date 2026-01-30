"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, Calendar, DollarSign, PieChart as PieChartIcon } from "lucide-react";
import { useFinanceCenterStore } from "@/store/useFinanceCenterStore";

// Line Chart Component (Pure SVG)
function LineChart({ data }: { data: Array<{ year: number; principal: number; return: number; total: number }> }) {
  if (!data || data.length === 0) return null;

  const width = 600;
  const height = 300;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const maxValue = Math.max(...data.map(d => d.total));
  const minValue = 0;

  // Generate points for the line
  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    const y = height - padding - ((d.total - minValue) / (maxValue - minValue)) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  // Generate points for area fill
  const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

  // Generate gradient stops
  const yearLabels = data.filter((_, i) => i % Math.ceil(data.length / 6) === 0 || i === data.length - 1);

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map((percent) => {
        const y = height - padding - (percent / 100) * chartHeight;
        return (
          <line
            key={percent}
            x1={padding}
            y1={y}
            x2={width - padding}
            y2={y}
            stroke="#e5e7eb"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        );
      })}

      {/* Area fill */}
      <polygon
        points={areaPoints}
        fill="url(#gradient)"
        opacity="0.3"
      />

      {/* Gradient definition */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFB5BA" />
          <stop offset="100%" stopColor="#FFB5BA" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke="#FFB5BA"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Data points */}
      {data.map((d, i) => {
        const x = padding + (i / (data.length - 1)) * chartWidth;
        const y = height - padding - ((d.total - minValue) / (maxValue - minValue)) * chartHeight;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="4"
            fill="#FFB5BA"
            stroke="white"
            strokeWidth="2"
          />
        );
      })}

      {/* Y-axis labels */}
      {[0, 25, 50, 75, 100].map((percent) => {
        const value = (minValue + (maxValue - minValue) * (percent / 100));
        const y = height - padding - (percent / 100) * chartHeight;
        return (
          <text
            key={percent}
            x={padding - 10}
            y={y + 4}
            textAnchor="end"
            fontSize="12"
            fill="#6b7280"
          >
            {value >= 10000
              ? `${(value / 10000).toFixed(1)}万`
              : value >= 1000
              ? `${(value / 1000).toFixed(1)}k`
              : value.toFixed(0)}
          </text>
        );
      })}

      {/* X-axis labels */}
      {yearLabels.map((d, i) => {
        const x = padding + (d.year - 1) / (data.length - 1) * chartWidth;
        return (
          <text
            key={d.year}
            x={x}
            y={height - padding + 20}
            textAnchor="middle"
            fontSize="12"
            fill="#6b7280"
          >
            第{d.year}年
          </text>
        );
      })}
    </svg>
  );
}

// Pie Chart Component (Pure SVG)
function PieChart({ principal, returnAmount }: { principal: number; returnAmount: number }) {
  const total = principal + returnAmount;
  if (total === 0) return null;

  const principalAngle = (principal / total) * 360;
  const returnAngle = (returnAmount / total) * 360;

  // Convert polar to cartesian
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  // Create arc path
  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    const d = [
      "M", x, y,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ");

    return d;
  };

  return (
    <svg width="100%" height="100%" viewBox="0 0 200 200">
      {/* Principal slice */}
      <path
        d={describeArc(100, 100, 80, 0, principalAngle)}
        fill="#C1E1C1"
        stroke="white"
        strokeWidth="2"
      />

      {/* Return slice */}
      <path
        d={describeArc(100, 100, 80, principalAngle, 360)}
        fill="#FFB5BA"
        stroke="white"
        strokeWidth="2"
      />

      {/* Center hole (donut) */}
      <circle cx="100" cy="100" r="40" fill="white" />

      {/* Center text */}
      <text x="100" y="95" textAnchor="middle" fontSize="12" fill="#6b7280" fontWeight="bold">
        总资产
      </text>
      <text x="100" y="115" textAnchor="middle" fontSize="14" fill="#FFB5BA" fontWeight="bold">
        {total >= 10000
          ? `${(total / 10000).toFixed(1)}万`
          : total >= 1000
          ? `${(total / 1000).toFixed(1)}k`
          : total.toFixed(0)}
      </text>
    </svg>
  );
}

export function InvestmentSimulationTab() {
  const {
    investmentSettings,
    updateInvestmentSettings,
    calculateCompoundInterest,
  } = useFinanceCenterStore();

  const [result, setResult] = useState(calculateCompoundInterest());

  useEffect(() => {
    setResult(calculateCompoundInterest());
  }, [investmentSettings]);

  const getResultMessage = () => {
    const { totalReturn, totalPrincipal } = result;

    if (totalReturn < 0) {
      return "试试调整参数，让钱更好地为你工作 💪";
    } else if (totalReturn < totalPrincipal * 0.3) {
      return "不错哦！坚持定投，小钱也能变大钱 ✨";
    } else if (totalReturn < totalPrincipal * 0.7) {
      return "哇！收益不错呢，这就是复利的魔力 🌟";
    } else {
      return "太棒了！坚持就是胜利，你的钱在努力工作 🎉";
    }
  };

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 font-cute mb-2">🌳 钱生钱模拟器</h2>
        <p className="text-sm text-gray-600">
          看看钱如何长大 ✨
        </p>
      </div>

      {/* Calculator Card */}
      <Card className="border-macaron-pink/20">
        <CardContent className="p-6 space-y-8">
          {/* Monthly Investment */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-macaron-pink" />
                每月定投金额
              </label>
              <span className="text-2xl font-bold text-macaron-pink font-cute">
                ¥{investmentSettings.monthlyAmount.toLocaleString()}
              </span>
            </div>
            <Slider
              value={[investmentSettings.monthlyAmount]}
              onValueChange={(value) => updateInvestmentSettings({ monthlyAmount: value[0] })}
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
                <Calendar className="w-4 h-4 text-macaron-pink" />
                定投时长
              </label>
              <span className="text-2xl font-bold text-macaron-pink font-cute">
                {investmentSettings.years} 年
              </span>
            </div>
            <Slider
              value={[investmentSettings.years]}
              onValueChange={(value) => updateInvestmentSettings({ years: value[0] })}
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
              <label className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-macaron-pink" />
                预期年化收益率
              </label>
              <span className="text-2xl font-bold text-macaron-pink font-cute">
                {investmentSettings.expectedReturn}%
              </span>
            </div>
            <Slider
              value={[investmentSettings.expectedReturn]}
              onValueChange={(value) => updateInvestmentSettings({ expectedReturn: value[0] })}
              min={3}
              max={8}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>3%</span>
              <span>8%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Result Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-macaron-green/30 bg-gradient-to-br from-macaron-green/10 to-transparent">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-gray-600 mb-2">总投入本金</p>
            <p className="text-2xl font-bold text-macaron-green font-cute">
              ¥{result.totalPrincipal.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}
            </p>
          </CardContent>
        </Card>

        <Card className="border-macaron-pink/30 bg-gradient-to-br from-macaron-pink/10 to-transparent">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-gray-600 mb-2">投资收益</p>
            <p className="text-2xl font-bold text-macaron-pink font-cute">
              ¥{result.totalReturn.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}
            </p>
          </CardContent>
        </Card>

        <Card className="border-macaron-purple/30 bg-gradient-to-br from-macaron-purple/10 to-transparent">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-gray-600 mb-2">总资产</p>
            <p className="text-2xl font-bold text-macaron-purple font-cute">
              ¥{result.totalAmount.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Message */}
      <Card className="border-macaron-yellow/30 bg-macaron-yellow/10">
        <CardContent className="p-4 text-center">
          <p className="text-lg text-gray-700 font-medium">{getResultMessage()}</p>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <Card className="border-macaron-blue/20">
          <CardContent className="p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-macaron-blue" />
              年度增长趋势
            </h3>
            <div className="h-64">
              <LineChart data={result.yearlyData} />
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="border-macaron-purple/20">
          <CardContent className="p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-macaron-purple" />
              本金 vs 收益
            </h3>
            <div className="h-48 flex items-center justify-center">
              <PieChart
                principal={result.totalPrincipal}
                returnAmount={result.totalReturn}
              />
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-macaron-green"></div>
                <span className="text-sm text-gray-600">本金</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-macaron-pink"></div>
                <span className="text-sm text-gray-600">收益</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card className="border-macaron-cream bg-macaron-cream/30">
        <CardContent className="p-4 space-y-2">
          <p className="text-sm text-gray-700">
            💡 <strong>什么是定投？</strong>定投就是"定期定额投资"，比如每月固定日期自动投入一定金额买基金。
            就像养电子宠物，每天定时喂食（投钱），它慢慢长大，长大后给你生更多小宠物（赚更多钱）✨
          </p>
          <p className="text-sm text-gray-700">
            💡 <strong>小贴士：</strong>以上计算基于预期年化收益率 {investmentSettings.expectedReturn}%，
            实际收益可能会有波动。建议坚持长期定投，平滑市场波动。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
