"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PiggyBank,
  TrendingUp,
  TrendingDown,
  Wallet,
  Home,
  Settings,
  ChevronRight,
  Gift,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Activity,
  Store,
  Search,
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

// 交易记录类型
interface Transaction {
  id: string;
  type: "buy" | "sell";
  fundCode: string;
  fundName: string;
  amount: number;
  shares: number;
  nav: number;
  date: Date;
}

// 持仓类型
interface Position {
  fundCode: string;
  fundName: string;
  fundType: string;
  riskLevel: string;
  amount: number;
  shares: number;
  currentNav: number;
  profitLoss: number;
  profitLossPercent: number;
}

function SimulationPageContent() {
  const searchParams = useSearchParams();
  const preselectedFund = searchParams.get("fund");

  const [showGuide, setShowGuide] = useState(false);
  const [guideStep, setGuideStep] = useState(0);
  const [cashBalance, setCashBalance] = useState(100000);
  const [positions, setPositions] = useState<Position[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<"home" | "positions" | "history">("home");
  const [buyAmount, setBuyAmount] = useState("");
  const [selectedFund, setSelectedFund] = useState<string>(preselectedFund || "");
  const [showBuySuccess, setShowBuySuccess] = useState(false);

  // 基金数据状态
  const [fundsData, setFundsData] = useState<Record<string, FundData>>({});
  const [fundsList, setFundsList] = useState<FundData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFundSelector, setShowFundSelector] = useState(false);

  // 加载基金数据
  useEffect(() => {
    const loadFundsData = async () => {
      try {
        const response = await fetch("/caixiaojin/funds.json");
        const result = await response.json();

        if (result && result.funds) {
          setFundsData(result.funds);
          setFundsList(Object.values(result.funds));
        } else {
          console.error("获取基金数据失败: 数据格式不正确");
        }
      } catch (error) {
        console.error("加载基金数据出错:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFundsData();
  }, []);

  // 检查是否首次进入
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hasSeenGuide = localStorage.getItem("hasSeenSimulationGuide_v2");
    if (!hasSeenGuide) {
      setShowGuide(true);
    }

    // 从 localStorage 加载持仓和交易记录
    const savedPositions = localStorage.getItem("simulationPositions_v2");
    const savedTransactions = localStorage.getItem("simulationTransactions_v2");
    const savedCashBalance = localStorage.getItem("simulationCashBalance_v2");

    if (savedPositions) setPositions(JSON.parse(savedPositions));
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    if (savedCashBalance) setCashBalance(Number(savedCashBalance));
  }, []);

  // 保存数据到 localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem("simulationPositions_v2", JSON.stringify(positions));
    localStorage.setItem("simulationTransactions_v2", JSON.stringify(transactions));
    localStorage.setItem("simulationCashBalance_v2", cashBalance.toString());
  }, [positions, transactions, cashBalance]);

  // 引导步骤
  const guideSteps = [
    {
      icon: <Gift className="w-16 h-16 text-macaron-pink" />,
      title: "🎁 领取虚拟小金库",
      description: "我们已为你准备了 10 万元虚拟理财金，0 成本练理财，全程免费！",
      action: "领取资金",
    },
    {
      icon: <Store className="w-16 h-16 text-macaron-green" />,
      title: "🏪 浏览基金市场",
      description: "我们有 19 只精选基金，涵盖货币、债券、指数、行业等多种类型！",
      action: "进入市场",
    },
    {
      icon: <Activity className="w-16 h-16 text-macaron-purple" />,
      title: "📊 查看真实数据",
      description: "所有基金数据来自真实 ETF 市场，已进行平滑处理，让你体验真实波动！",
      action: "开始投资",
    },
  ];

  const handleGuideNext = () => {
    if (guideStep < guideSteps.length - 1) {
      setGuideStep(guideStep + 1);
    } else {
      setShowGuide(false);
      localStorage.setItem("hasSeenSimulationGuide_v2", "true");
    }
  };

  // 单次买入
  const handleBuy = () => {
    if (!selectedFund || !buyAmount) return;

    const amount = Number(buyAmount);
    if (amount < 100 || amount > cashBalance) {
      alert("最低买入 100 元，且不能超过可用资金");
      return;
    }

    const fund = fundsData[selectedFund];
    if (!fund) return;

    // 使用真实净值计算份额
    const currentNav = fund.latest_nav;
    const shares = amount / currentNav;

    // 更新持仓
    const existingPosition = positions.find((p) => p.fundCode === fund.code);
    if (existingPosition) {
      const newAmount = existingPosition.amount + amount;
      const newShares = existingPosition.shares + shares;
      const avgCost = newAmount / newShares;
      const newProfitLoss = (currentNav - avgCost) * newShares;
      const newProfitLossPercent = ((currentNav - avgCost) / avgCost) * 100;

      setPositions(
        positions.map((p) =>
          p.fundCode === fund.code
            ? {
                ...p,
                amount: newAmount,
                shares: newShares,
                currentNav,
                profitLoss: newProfitLoss,
                profitLossPercent: newProfitLossPercent,
              }
            : p
        )
      );
    } else {
      setPositions([
        ...positions,
        {
          fundCode: fund.code,
          fundName: fund.name,
          fundType: fund.type,
          riskLevel: fund.risk_level,
          amount,
          shares,
          currentNav,
          profitLoss: 0,
          profitLossPercent: 0,
        },
      ]);
    }

    // 添加交易记录
    const transaction: Transaction = {
      id: Date.now().toString(),
      type: "buy",
      fundCode: fund.code,
      fundName: fund.name,
      amount,
      shares,
      nav: currentNav,
      date: new Date(),
    };
    setTransactions([transaction, ...transactions]);

    // 更新余额
    setCashBalance(cashBalance - amount);
    setBuyAmount("");
    setSelectedFund("");
    setShowBuySuccess(true);

    setTimeout(() => setShowBuySuccess(false), 2000);
  };

  // 卖出
  const handleSell = (fundCode: string) => {
    const position = positions.find((p) => p.fundCode === fundCode);
    if (!position) return;

    const sellAmount = position.currentNav * position.shares;
    const profitLoss = position.profitLoss;

    // 添加交易记录
    const transaction: Transaction = {
      id: Date.now().toString(),
      type: "sell",
      fundCode: position.fundCode,
      fundName: position.fundName,
      amount: sellAmount,
      shares: position.shares,
      nav: position.currentNav,
      date: new Date(),
    };
    setTransactions([transaction, ...transactions]);

    // 更新余额和持仓
    setCashBalance(cashBalance + sellAmount);
    setPositions(positions.filter((p) => p.fundCode !== fundCode));
  };

  // 获取收益具象化文案
  const getProfitDescription = (profit: number) => {
    const absProfit = Math.abs(profit);
    if (absProfit < 50) return "够1杯奶茶 🧋";
    if (absProfit < 200) return "够几次美甲 💅";
    if (absProfit < 500) return "能买1支口红 💄";
    if (absProfit < 1000) return "够1顿大餐 🍜";
    if (absProfit < 2000) return "1次短途旅行 🚗";
    return "实现小梦想 🌟";
  };

  // 过滤基金列表
  const filteredFunds = fundsList.filter((fund) => {
    const matchesSearch =
      fund.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fund.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

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
      {/* 引导弹窗 */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in duration-300">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                {guideSteps[guideStep].icon}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 font-cute">
                {guideSteps[guideStep].title}
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {guideSteps[guideStep].description}
              </p>

              {/* 进度指示 */}
              <div className="flex justify-center gap-2 mb-6">
                {guideSteps.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-3 h-3 rounded-full transition-all",
                      i <= guideStep ? "bg-macaron-pink" : "bg-gray-200"
                    )}
                  />
                ))}
              </div>

              <Button
                onClick={handleGuideNext}
                className="w-full bg-gradient-to-r from-macaron-pink to-macaron-purple hover:from-macaron-pink/90 hover:to-macaron-purple/90 text-white font-cute font-bold py-6"
              >
                {guideSteps[guideStep].action}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* 买入成功提示 */}
      {showBuySuccess && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-macaron-green text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-cute">买入成功！</span>
        </div>
      )}

      <div className="container mx-auto px-4 md:px-6 py-8 max-w-6xl">
        {/* 返回按钮 */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/tools" className="inline-flex items-center gap-2 text-macaron-pink hover:text-macaron-purple transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-cute font-medium">返回工具箱</span>
          </Link>

          <Link
            href="/tools/fund-market"
            className="inline-flex items-center gap-2 px-4 py-2 bg-macaron-pink text-white rounded-full hover:bg-macaron-pink/90 transition-colors"
          >
            <Store className="w-4 h-4" />
            <span className="font-cute font-medium">基金市场</span>
          </Link>
        </div>

        {/* 标题区域 */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-macaron-purple to-macaron-pink flex items-center justify-center shadow-lg animate-bounce" style={{ animationDuration: "2s" }}>
              <PiggyBank className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 font-cute">
            🎮 模拟交易
          </h1>
          <p className="text-gray-600">基于真实市场数据，0成本练理财</p>
          {!loading && (
            <p className="text-xs text-macaron-pink mt-2">
              数据来源: CMES ETF (已平滑处理) · 共 {fundsList.length} 只基金
            </p>
          )}
        </div>

        {/* 资金卡片 */}
        <Card className="border-2 border-macaron-purple/30 bg-gradient-to-br from-macaron-purple/10 to-macaron-pink/10 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-macaron-purple" />
                  虚拟小金库
                </p>
                <p className="text-3xl font-bold text-macaron-purple">
                  ¥{cashBalance.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">可用资金</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">持仓收益</p>
                <p className={cn(
                  "text-2xl font-bold",
                  positions.reduce((sum, p) => sum + p.profitLoss, 0) >= 0
                    ? "text-macaron-green"
                    : "text-macaron-blue"
                )}>
                  {positions.reduce((sum, p) => sum + p.profitLoss, 0) >= 0 ? "+" : ""}
                  ¥{Math.round(positions.reduce((sum, p) => sum + p.profitLoss, 0)).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  浮动收益 · {getProfitDescription(positions.reduce((sum, p) => sum + p.profitLoss, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 标签页切换 */}
        <div className="flex gap-2 mb-6 bg-macaron-cream p-2 rounded-2xl">
          <Button
            onClick={() => setActiveTab("home")}
            variant={activeTab === "home" ? "default" : "ghost"}
            className={cn(
              "flex-1 font-cute",
              activeTab === "home"
                ? "bg-macaron-pink text-white shadow-md"
                : "text-gray-600 hover:bg-white/50"
            )}
          >
            <Home className="w-4 h-4 mr-2" />
            首页
          </Button>
          <Button
            onClick={() => setActiveTab("positions")}
            variant={activeTab === "positions" ? "default" : "ghost"}
            className={cn(
              "flex-1 font-cute",
              activeTab === "positions"
                ? "bg-macaron-green text-white shadow-md"
                : "text-gray-600 hover:bg-white/50"
            )}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            我的持仓
          </Button>
          <Button
            onClick={() => setActiveTab("history")}
            variant={activeTab === "history" ? "default" : "ghost"}
            className={cn(
              "flex-1 font-cute",
              activeTab === "history"
                ? "bg-macaron-blue text-white shadow-md"
                : "text-gray-600 hover:bg-white/50"
            )}
          >
            <Settings className="w-4 h-4 mr-2" />
            交易记录
          </Button>
        </div>

        {/* 首页 - 选择基金 */}
        {activeTab === "home" && (
          <div className="space-y-6">
            {/* 基金选择 */}
            <Card className="border-2 border-macaron-pink/30">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 font-cute">
                  🎯 选择基金买入
                </h3>

                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">正在加载基金数据...</p>
                  </div>
                ) : (
                  <>
                    {/* 基金搜索 */}
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="搜索基金名称、代码..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setShowFundSelector(true)}
                        className="pl-10 h-12"
                      />
                    </div>

                    {/* 基金选择器 */}
                    {showFundSelector && (
                      <div className="border-2 border-macaron-pink/30 rounded-2xl p-4 mb-4 max-h-96 overflow-y-auto">
                        <div className="flex justify-between items-center mb-3">
                          <p className="text-sm text-gray-600">选择一只基金</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setShowFundSelector(false);
                              setSearchQuery("");
                            }}
                          >
                            关闭
                          </Button>
                        </div>

                        {filteredFunds.length === 0 ? (
                          <p className="text-center text-gray-400 py-4">没有找到匹配的基金</p>
                        ) : (
                          <div className="space-y-2">
                            {filteredFunds.slice(0, 10).map((fund) => (
                              <div
                                key={fund.code}
                                onClick={() => {
                                  setSelectedFund(fund.code);
                                  setShowFundSelector(false);
                                  setSearchQuery("");
                                }}
                                className={cn(
                                  "p-3 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.02]",
                                  selectedFund === fund.code
                                    ? "border-macaron-pink bg-macaron-pink/10"
                                    : "border-gray-200 hover:border-macaron-pink/50"
                                )}
                              >
                                <div className="flex items-center justify-between">
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
                                  <div className="text-right ml-4">
                                    <p className="text-sm text-gray-500">净值</p>
                                    <p className="font-bold text-gray-800">
                                      {fund.latest_nav.toFixed(4)}
                                    </p>
                                    <p className={cn(
                                      "text-sm font-bold",
                                      fund.latest_change >= 0 ? "text-macaron-green" : "text-macaron-blue"
                                    )}>
                                      {fund.latest_change >= 0 ? "+" : ""}
                                      {fund.latest_change.toFixed(2)}%
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* 已选择的基金 */}
                    {selectedFund && fundsData[selectedFund] && (
                      <Card className="border-2 border-macaron-green/30 bg-macaron-green/10 mb-4">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-800 mb-1">{fundsData[selectedFund].name}</h4>
                              <p className="text-xs text-gray-500">{fundsData[selectedFund].desc}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="px-2 py-1 rounded-full bg-macaron-cream text-xs text-gray-600">
                                  {fundsData[selectedFund].type}
                                </span>
                                <span className={cn("text-xs font-medium", getRiskColor(fundsData[selectedFund].risk_level))}>
                                  {getRiskLabel(fundsData[selectedFund].risk_level)}
                                </span>
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <p className="text-sm text-gray-500">当前净值</p>
                              <p className="text-2xl font-bold text-gray-800">
                                {fundsData[selectedFund].latest_nav.toFixed(4)}
                              </p>
                              <p className={cn(
                                "text-sm font-bold",
                                fundsData[selectedFund].latest_change >= 0 ? "text-macaron-green" : "text-macaron-blue"
                              )}>
                                {fundsData[selectedFund].latest_change >= 0 ? "+" : ""}
                                {fundsData[selectedFund].latest_change.toFixed(2)}%
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedFund("")}
                              className="ml-2 text-gray-400 hover:text-gray-600"
                            >
                              ✕
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* 买入金额 */}
                    <div className="space-y-4">
                      <label className="text-sm font-medium text-gray-700">
                        输入买入金额（最低 100 元）
                      </label>
                      <div className="flex gap-3">
                        <Input
                          type="number"
                          value={buyAmount}
                          onChange={(e) => setBuyAmount(e.target.value)}
                          placeholder="输入金额"
                          min={100}
                          max={cashBalance}
                          className="flex-1 text-lg h-12"
                        />
                        <Button
                          onClick={handleBuy}
                          disabled={!selectedFund || !buyAmount}
                          className="bg-gradient-to-r from-macaron-pink to-macaron-purple hover:from-macaron-pink/90 hover:to-macaron-purple/90 text-white font-cute font-bold px-8"
                        >
                          买入
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        {[500, 1000, 2000, 5000].map((amount) => (
                          <Button
                            key={amount}
                            variant="outline"
                            size="sm"
                            onClick={() => setBuyAmount(amount.toString())}
                            className="flex-1"
                          >
                            ¥{amount}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* 新手小贴士 */}
            <Card className="border-2 border-macaron-yellow/30 bg-macaron-yellow/10">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-macaron-yellow" />
                  新手小贴士
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>💡 点击"基金市场"可以查看所有基金的详细信息和排行榜</li>
                  <li>💡 基金数据来自真实 ETF 市场，已进行平滑处理</li>
                  <li>💡 浮动收益不是实际收益，卖出后才会到账</li>
                  <li>💡 建议长期持有，不要频繁操作</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 持仓页面 */}
        {activeTab === "positions" && (
          <div className="space-y-4">
            {positions.length === 0 ? (
              <Card className="border-2 border-dashed border-gray-300">
                <CardContent className="py-12 text-center">
                  <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">还没有持仓哦</p>
                  <p className="text-sm text-gray-400">快去首页买点基金吧~</p>
                </CardContent>
              </Card>
            ) : (
              positions.map((position) => (
                <Card
                  key={position.fundCode}
                  className="border-2 hover:shadow-lg transition-all"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold text-gray-800 text-lg">{position.fundName}</h4>
                          <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getRiskColor(position.riskLevel))}>
                            {getRiskLabel(position.riskLevel)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          持有 {position.shares.toFixed(2)} 份 · 净值 {position.currentNav.toFixed(4)}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleSell(position.fundCode)}
                        size="sm"
                        variant="outline"
                        className="border-macaron-pink/50 text-macaron-pink hover:bg-macaron-pink hover:text-white"
                      >
                        卖出
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-600">投入本金</p>
                        <p className="text-lg font-bold text-gray-800">
                          ¥{position.amount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">当前市值</p>
                        <p className="text-lg font-bold text-gray-800">
                          ¥{(position.currentNav * position.shares).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">浮动收益</p>
                        <p className={cn(
                          "text-lg font-bold",
                          position.profitLoss >= 0 ? "text-macaron-green" : "text-macaron-blue"
                        )}>
                          {position.profitLoss >= 0 ? "+" : ""}
                          ¥{Math.round(position.profitLoss).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        收益率：{position.profitLossPercent >= 0 ? "+" : ""}
                        {position.profitLossPercent.toFixed(2)}%
                        {position.profitLoss >= 0 && " 📈"}
                        {position.profitLoss < 0 && " 📉"}
                        · {getProfitDescription(position.profitLoss)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* 交易记录 */}
        {activeTab === "history" && (
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <Card className="border-2 border-dashed border-gray-300">
                <CardContent className="py-12 text-center">
                  <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">还没有交易记录</p>
                  <p className="text-sm text-gray-400">开始交易后会在这里显示~</p>
                </CardContent>
              </Card>
            ) : (
              transactions.map((tx) => (
                <Card key={tx.id} className="border-2 border-gray-100">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            tx.type === "buy" ? "bg-macaron-pink/20 text-macaron-pink" : "bg-macaron-green/20 text-macaron-green"
                          )}>
                            {tx.type === "buy" ? "买入" : "卖出"}
                          </span>
                          <span className="font-bold text-gray-800">{tx.fundName}</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {tx.date.toLocaleString()} · {tx.shares.toFixed(2)} 份 · 净值 {tx.nav.toFixed(4)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={cn(
                          "text-lg font-bold",
                          tx.type === "buy" ? "text-macaron-pink" : "text-macaron-green"
                        )}>
                          {tx.type === "buy" ? "-" : "+"}
                          ¥{tx.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* 底部提示 */}
        <div className="text-center py-6 mt-8">
          <p className="text-xs text-gray-500 mb-2">
            ⚠️ 以上均为虚拟交易，无真实资金
          </p>
          <p className="text-xs text-gray-500">
            💡 基金数据来自 CMES ETF，已进行平滑处理 · 建议学习完成后，再进行真实投资哦~
          </p>
        </div>
      </div>
    </div>
  );
}

// 用 Suspense 包裹组件以支持静态导出
export default function SimulationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-macaron-pink mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    }>
      <SimulationPageContent />
    </Suspense>
  );
}
