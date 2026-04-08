"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  Filter,
  Trophy,
  Shield,
  Star,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

// 基金数据类型
interface FundData {
  code: string;
  name: string;
  type: string;
  desc: string;
  risk_level: string;
  latest_nav: number;
  latest_change: number;
  returns: {
    daily_return: number;
    weekly_return: number;
    monthly_return: number;
    quarterly_return: number;
    max_drawdown: number;
    volatility: number;
  };
}

interface RankingItem {
  code: string;
  name: string;
  value: number;
  risk?: string;
}

export default function FundMarketPage() {
  const [funds, setFunds] = useState<FundData[]>([]);
  const [rankings, setRankings] = useState<{
    daily_return: RankingItem[];
    monthly_return: RankingItem[];
    hot: RankingItem[];
    low_risk: RankingItem[];
  } | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("全部");
  const [sortBy, setSortBy] = useState<string>("daily_return");
  const [showRankings, setShowRankings] = useState(true);

  // 加载初始数据
  useEffect(() => {
    const loadData = async () => {
      try {
        // 加载榜单
        const rankingsRes = await fetch("/api/funds?action=rankings");
        const rankingsData = await rankingsRes.json();
        if (rankingsData.success) {
          setRankings(rankingsData.data);
        }

        // 加载分类
        const categoriesRes = await fetch("/api/funds?action=categories");
        const categoriesData = await categoriesRes.json();
        if (categoriesData.success) {
          setCategories(categoriesData.data);
        }

        // 加载基金列表
        await loadFunds();
      } catch (error) {
        console.error("加载数据失败:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 加载基金列表（支持搜索和筛选）
  const loadFunds = async (query?: string, category?: string) => {
    try {
      const params = new URLSearchParams({
        action: "search",
        sort: sortBy,
      });

      if (query) params.append("query", query);
      if (category && category !== "全部") params.append("category", category);

      const res = await fetch(`/api/funds?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setFunds(data.data);
      }
    } catch (error) {
      console.error("加载基金列表失败:", error);
    }
  };

  // 搜索处理
  useEffect(() => {
    const timer = setTimeout(() => {
      loadFunds(searchQuery, selectedCategory);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, sortBy]);

  // 获取风险等级颜色
  const getRiskColor = (level: string) => {
    switch (level) {
      case "R1": return "text-macaron-green";
      case "R2": return "text-macaron-blue";
      case "R3": return "text-macaron-yellow";
      case "R4": return "text-macaron-pink";
      default: return "text-gray-500";
    }
  };

  // 获取风险等级文字
  const getRiskLabel = (level: string) => {
    switch (level) {
      case "R1": return "低风险";
      case "R2": return "中低风险";
      case "R3": return "中等风险";
      case "R4": return "较高风险";
      default: return "未知";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-macaron-purple/20 via-macaron-cream to-macaron-pink/20">
      <div className="container mx-auto px-4 md:px-6 py-8 max-w-6xl">
        {/* 返回按钮 */}
        <Link href="/tools" className="inline-flex items-center gap-2 text-macaron-pink hover:text-macaron-purple transition-colors mb-6 group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-cute font-medium">返回工具箱</span>
        </Link>

        {/* 标题区域 */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-macaron-purple to-macaron-pink flex items-center justify-center shadow-lg animate-bounce" style={{ animationDuration: "2s" }}>
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 font-cute">
            📊 基金市场
          </h1>
          <p className="text-gray-600">
            {loading ? "加载中..." : `共 ${funds.length} 只基金`}
          </p>
          <p className="text-xs text-macaron-pink mt-2">
            数据来源: CMES ETF (已平滑处理)
          </p>
        </div>

        {/* 热门榜单 */}
        {showRankings && rankings && (
          <Card className="border-2 border-macaron-yellow/30 bg-macaron-yellow/10 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-macaron-yellow" />
                  热门榜单
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRankings(false)}
                  className="text-gray-500"
                >
                  收起
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 日收益榜 */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
                    <Star className="w-4 h-4 text-macaron-pink" />
                    今日收益榜
                  </h4>
                  <div className="space-y-2">
                    {rankings.daily_return.slice(0, 5).map((fund, index) => (
                      <div key={fund.code} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <span className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold",
                            index === 0 ? "bg-macaron-pink text-white" :
                            index === 1 ? "bg-macaron-purple text-white" :
                            index === 2 ? "bg-macaron-blue text-white" :
                            "bg-gray-100 text-gray-500"
                          )}>
                            {index + 1}
                          </span>
                          <span className="text-gray-700 truncate w-20">{fund.name}</span>
                        </span>
                        <span className="text-macaron-green font-medium">
                          +{fund.value.toFixed(2)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 月收益榜 */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-macaron-green" />
                    月收益榜
                  </h4>
                  <div className="space-y-2">
                    {rankings.monthly_return.slice(0, 5).map((fund, index) => (
                      <div key={fund.code} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <span className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold",
                            index === 0 ? "bg-macaron-pink text-white" :
                            index === 1 ? "bg-macaron-purple text-white" :
                            index === 2 ? "bg-macaron-blue text-white" :
                            "bg-gray-100 text-gray-500"
                          )}>
                            {index + 1}
                          </span>
                          <span className="text-gray-700 truncate w-20">{fund.name}</span>
                        </span>
                        <span className="text-macaron-green font-medium">
                          +{fund.value.toFixed(2)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 热门榜 */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
                    <Star className="w-4 h-4 text-macaron-purple" />
                    综合热门榜
                  </h4>
                  <div className="space-y-2">
                    {rankings.hot.slice(0, 5).map((fund, index) => (
                      <div key={fund.code} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <span className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold",
                            index === 0 ? "bg-macaron-pink text-white" :
                            index === 1 ? "bg-macaron-purple text-white" :
                            index === 2 ? "bg-macaron-blue text-white" :
                            "bg-gray-100 text-gray-500"
                          )}>
                            {index + 1}
                          </span>
                          <span className="text-gray-700 truncate w-20">{fund.name}</span>
                        </span>
                        <span className="text-macaron-green font-medium">
                          +{fund.value.toFixed(2)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 低风险榜 */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
                    <Shield className="w-4 h-4 text-macaron-blue" />
                    稳健收益榜
                  </h4>
                  <div className="space-y-2">
                    {rankings.low_risk.slice(0, 5).map((fund, index) => (
                      <div key={fund.code} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <span className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold",
                            index === 0 ? "bg-macaron-pink text-white" :
                            index === 1 ? "bg-macaron-purple text-white" :
                            index === 2 ? "bg-macaron-blue text-white" :
                            "bg-gray-100 text-gray-500"
                          )}>
                            {index + 1}
                          </span>
                          <span className="text-gray-700 truncate w-20">{fund.name}</span>
                        </span>
                        <span className="text-macaron-green font-medium">
                          +{fund.value.toFixed(2)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 搜索和筛选 */}
        <Card className="border-2 border-macaron-pink/30 mb-6">
          <CardContent className="p-6">
            {/* 搜索框 */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="搜索基金名称、代码..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            {/* 筛选选项 */}
            <div className="flex flex-wrap gap-3">
              {/* 分类筛选 */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">类型:</span>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={selectedCategory === "全部" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory("全部")}
                    className={selectedCategory === "全部" ? "bg-macaron-pink text-white" : ""}
                  >
                    全部
                  </Button>
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(cat)}
                      className={selectedCategory === cat ? "bg-macaron-pink text-white" : ""}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 排序 */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-gray-600">排序:</span>
                <Button
                  variant={sortBy === "daily_return" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy("daily_return")}
                  className={sortBy === "daily_return" ? "bg-macaron-purple text-white" : ""}
                >
                  日收益
                </Button>
                <Button
                  variant={sortBy === "monthly_return" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy("monthly_return")}
                  className={sortBy === "monthly_return" ? "bg-macaron-purple text-white" : ""}
                >
                  月收益
                </Button>
                <Button
                  variant={sortBy === "volatility" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy("volatility")}
                  className={sortBy === "volatility" ? "bg-macaron-purple text-white" : ""}
                >
                  低波动
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 基金列表 */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">加载中...</p>
          </div>
        ) : funds.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="py-12 text-center">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">没有找到匹配的基金</p>
              <p className="text-sm text-gray-400">试试其他搜索词吧~</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {funds.map((fund) => (
              <Link
                key={fund.code}
                href={`/tools/simulation?fund=${fund.code}`}
                className="block"
              >
                <Card className="border-2 hover:shadow-lg transition-all hover:border-macaron-pink/50 h-full">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 mb-1">{fund.name}</h4>
                        <p className="text-xs text-gray-500 mb-2">{fund.desc}</p>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 rounded-full bg-macaron-cream text-xs text-gray-600">
                            {fund.type}
                          </span>
                          <span className={cn("text-xs font-medium", getRiskColor(fund.risk_level))}>
                            {getRiskLabel(fund.risk_level)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-xs text-gray-500">净值</p>
                        <p className="font-bold text-gray-800 text-sm">
                          {fund.latest_nav.toFixed(4)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">日收益</p>
                        <p className={cn(
                          "font-bold text-sm",
                          fund.latest_change >= 0 ? "text-macaron-green" : "text-macaron-blue"
                        )}>
                          {fund.latest_change >= 0 ? "+" : ""}
                          {fund.latest_change.toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">月收益</p>
                        <p className={cn(
                          "font-bold text-sm",
                          fund.returns.monthly_return >= 0 ? "text-macaron-green" : "text-macaron-blue"
                        )}>
                          {fund.returns.monthly_return >= 0 ? "+" : ""}
                          {fund.returns.monthly_return.toFixed(2)}%
                        </p>
                      </div>
                    </div>

                    <Button className="w-full mt-3 bg-gradient-to-r from-macaron-pink to-macaron-purple hover:from-macaron-pink/90 hover:to-macaron-purple/90 text-white text-sm">
                      查看详情
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
