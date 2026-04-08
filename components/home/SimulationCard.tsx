"use client";

import { useState, useEffect } from "react";
import {
  PiggyBank,
  TrendingUp,
  TrendingDown,
  Wallet,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  X,
  Search,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

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
    monthly_return: number;
  };
}

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

interface SimulationCardProps {
  onClick: () => void;
}

export function SimulationCard({ onClick }: SimulationCardProps) {
  const [cashBalance, setCashBalance] = useState(100000);
  const [positions, setPositions] = useState<Position[]>([]);

  // 从localStorage读取数据
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedData = localStorage.getItem("simulationData_v2");
    if (savedData) {
      const data = JSON.parse(savedData);
      setCashBalance(data.cashBalance || 100000);
      setPositions(data.positions || []);
    }

    // 模拟价格波动
    const interval = setInterval(() => {
      setPositions((prev) =>
        prev.map((pos) => {
          const change = (Math.random() - 0.5) * 0.02;
          const newPrice = pos.currentNav * (1 + change);
          const newProfitLoss = (newPrice - pos.amount / pos.shares) * pos.shares;
          const newProfitLossPercent = (newProfitLoss / pos.amount) * 100;

          return {
            ...pos,
            currentNav: newPrice,
            profitLoss: newProfitLoss,
            profitLossPercent: newProfitLossPercent,
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // 保存数据到localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem("simulationData_v2", JSON.stringify({ cashBalance, positions }));
  }, [cashBalance, positions]);

  return (
    <Card
      className="cursor-pointer border-2 border-macaron-purple/30 hover:border-macaron-purple/60 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-macaron-purple/20 via-macaron-cream to-macaron-blue/20 backdrop-blur-sm hover:scale-105 h-full"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-macaron-purple to-macaron-pink flex items-center justify-center text-3xl shadow-lg flex-shrink-0">
            🎮
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-800 text-lg font-cute">
                模拟交易
              </h3>
              <Sparkles className="w-4 h-4 text-macaron-purple flex-shrink-0" />
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">
              0成本练理财，19只精选基金虚拟交易，轻松掌握技巧 🚀
            </p>
          </div>

          {/* Arrow indicator */}
          <div className="flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-macaron-purple" />
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-2 mt-3">
          <span className="text-xs bg-macaron-purple/20 text-macaron-purple px-2 py-1 rounded-full">
            虚拟资金
          </span>
          <span className="text-xs bg-macaron-pink/20 text-macaron-pink px-2 py-1 rounded-full">
            0风险
          </span>
          <span className="text-xs bg-macaron-blue/20 text-macaron-blue px-2 py-1 rounded-full">
            真实数据
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// Modal组件
interface SimulationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SimulationModal({ open, onOpenChange }: SimulationModalProps) {
  const [cashBalance, setCashBalance] = useState(100000);
  const [positions, setPositions] = useState<Position[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<"home" | "positions" | "history">("home");
  const [buyAmount, setBuyAmount] = useState("");
  const [selectedFund, setSelectedFund] = useState("");
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
        const response = await fetch("/funds.json");
        const data = await response.json();

        if (data && data.funds) {
          setFundsData(data.funds);
          setFundsList(Object.values(data.funds));
        }
      } catch (error) {
        console.error("加载基金数据失败:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      loadFundsData();
    }
  }, [open]);

  // 从localStorage读取数据
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedData = localStorage.getItem("simulationData_v2");
    if (savedData) {
      const data = JSON.parse(savedData);
      setCashBalance(data.cashBalance || 100000);
      setPositions(data.positions || []);
      setTransactions(data.transactions || []);
    }
  }, [open]);

  // 保存数据到localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem("simulationData_v2", JSON.stringify({ cashBalance, positions, transactions }));
  }, [cashBalance, positions, transactions]);

  // 模拟价格波动
  useEffect(() => {
    const interval = setInterval(() => {
      setPositions((prev) =>
        prev.map((pos) => {
          const change = (Math.random() - 0.5) * 0.02;
          const newPrice = pos.currentNav * (1 + change);
          const avgCost = pos.amount / pos.shares;
          const newProfitLoss = (newPrice - avgCost) * pos.shares;
          const newProfitLossPercent = (newProfitLoss / pos.amount) * 100;

          return {
            ...pos,
            currentNav: newPrice,
            profitLoss: newProfitLoss,
            profitLossPercent: newProfitLossPercent,
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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

  // 过滤基金列表
  const filteredFunds = fundsList.filter((fund) => {
    const matchesSearch =
      fund.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fund.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (!open) return null;

  const totalProfit = positions.reduce((sum, p) => sum + p.profitLoss, 0);

  return (
    <>
      {/* 买入成功提示 */}
      {showBuySuccess && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] bg-macaron-green text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-cute">买入成功！</span>
        </div>
      )}

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      >
        <div
          className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 标题 */}
          <div className="p-6 bg-gradient-to-r from-macaron-purple to-macaron-pink">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white font-cute mb-1">
                  🎮 模拟交易
                </h2>
                <p className="text-white/90 text-sm">
                  基于 CMES 真实数据 · {loading ? "加载中..." : `共 ${fundsList.length} 只基金`}
                </p>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 资金卡片 */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/80 mb-1 flex items-center gap-2">
                    <Wallet className="w-3 h-3" />
                    虚拟小金库
                  </p>
                  <p className="text-2xl font-bold text-white">
                    ¥{cashBalance.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/80 mb-1">持仓收益</p>
                  <p className={cn(
                    "text-xl font-bold",
                    totalProfit >= 0 ? "text-white" : "text-red-200"
                  )}>
                    {totalProfit >= 0 ? "+" : ""}
                    ¥{Math.round(totalProfit).toLocaleString()}
                  </p>
                  <p className="text-xs text-white/70">{getProfitDescription(totalProfit)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 标签页切换 */}
          <div className="flex gap-2 p-4 bg-gray-50">
            <button
              onClick={() => setActiveTab("home")}
              className={cn(
                "flex-1 py-2 px-4 rounded-xl font-cute text-sm transition-all",
                activeTab === "home"
                  ? "bg-macaron-pink text-white shadow-md"
                  : "text-gray-600 hover:bg-white"
              )}
            >
              🏠 首页
            </button>
            <button
              onClick={() => setActiveTab("positions")}
              className={cn(
                "flex-1 py-2 px-4 rounded-xl font-cute text-sm transition-all",
                activeTab === "positions"
                  ? "bg-macaron-green text-white shadow-md"
                  : "text-gray-600 hover:bg-white"
              )}
            >
              📊 持仓
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={cn(
                "flex-1 py-2 px-4 rounded-xl font-cute text-sm transition-all",
                activeTab === "history"
                  ? "bg-macaron-blue text-white shadow-md"
                  : "text-gray-600 hover:bg-white"
              )}
            >
              📝 记录
            </button>
          </div>

          {/* 内容区域 - 可滚动 */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* 首页 - 买入 */}
            {activeTab === "home" && (
              <div className="space-y-6">
                {/* 基金搜索 */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800 font-cute">
                      🎯 选择基金买入
                    </h3>
                    <button
                      onClick={() => setShowFundSelector(!showFundSelector)}
                      className="text-sm text-macaron-pink hover:text-macaron-purple flex items-center gap-1"
                    >
                      <Store className="w-4 h-4" />
                      {showFundSelector ? "收起" : "浏览市场"}
                    </button>
                  </div>

                  {/* 基金选择器 */}
                  {showFundSelector && (
                    <div className="border-2 border-macaron-pink/30 rounded-2xl p-4 mb-4 max-h-80 overflow-y-auto">
                      <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="搜索基金名称、代码..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-macaron-pink focus:outline-none text-sm"
                        />
                      </div>

                      {loading ? (
                        <p className="text-center text-gray-400 py-4">加载中...</p>
                      ) : filteredFunds.length === 0 ? (
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
                                  <h4 className="font-bold text-gray-800 text-sm mb-1">{fund.name}</h4>
                                  <p className="text-xs text-gray-500 mb-2">{fund.desc}</p>
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded-full bg-macaron-cream text-xs text-gray-600">
                                      {fund.type}
                                    </span>
                                    <span className={cn("text-xs font-medium", getRiskColor(fund.risk_level))}>
                                      {getRiskLabel(fund.risk_level)}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right ml-4">
                                  <p className="text-xs text-gray-500">净值</p>
                                  <p className="font-bold text-gray-800 text-sm">
                                    {fund.latest_nav.toFixed(4)}
                                  </p>
                                  <p className={cn(
                                    "text-xs font-bold",
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
                    <div className="bg-macaron-green/10 border-2 border-macaron-green/30 rounded-2xl p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800 mb-1">{fundsData[selectedFund].name}</h4>
                          <p className="text-xs text-gray-500">{fundsData[selectedFund].desc}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="px-2 py-0.5 rounded-full bg-macaron-cream text-xs text-gray-600">
                              {fundsData[selectedFund].type}
                            </span>
                            <span className={cn("text-xs font-medium", getRiskColor(fundsData[selectedFund].risk_level))}>
                              {getRiskLabel(fundsData[selectedFund].risk_level)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-xs text-gray-500">当前净值</p>
                          <p className="text-xl font-bold text-gray-800">
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
                        <button
                          onClick={() => setSelectedFund("")}
                          className="ml-2 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 text-sm"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      输入买入金额（最低 100 元）
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="number"
                        value={buyAmount}
                        onChange={(e) => setBuyAmount(e.target.value)}
                        placeholder="输入金额"
                        min={100}
                        max={cashBalance}
                        className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-macaron-pink focus:outline-none text-lg"
                      />
                      <button
                        onClick={handleBuy}
                        disabled={!selectedFund || !buyAmount}
                        className="bg-gradient-to-r from-macaron-pink to-macaron-purple hover:from-macaron-pink/90 hover:to-macaron-purple/90 text-white font-cute font-bold px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        买入
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[500, 1000, 2000, 5000].map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setBuyAmount(amount.toString())}
                          className="py-2 px-3 border-2 border-gray-200 rounded-lg hover:border-macaron-pink hover:bg-macaron-pink/5 text-sm font-medium transition-all"
                        >
                          ¥{amount}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 持仓页面 */}
            {activeTab === "positions" && (
              <div className="space-y-3">
                {positions.length === 0 ? (
                  <div className="text-center py-12">
                    <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">还没有持仓哦</p>
                    <p className="text-sm text-gray-400">快去首页买点基金吧~</p>
                  </div>
                ) : (
                  positions.map((position) => (
                    <div
                      key={position.fundCode}
                      className="border-2 border-gray-100 rounded-xl p-4 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-bold text-gray-800">{position.fundName}</h4>
                            <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", getRiskColor(position.riskLevel))}>
                              {getRiskLabel(position.riskLevel)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">持有 {position.shares.toFixed(2)} 份 · 净值 {position.currentNav.toFixed(4)}</p>
                        </div>
                        <button
                          onClick={() => handleSell(position.fundCode)}
                          className="px-4 py-1.5 border-2 border-macaron-pink/50 text-macaron-pink hover:bg-macaron-pink hover:text-white rounded-lg text-sm font-medium transition-all"
                        >
                          卖出
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <p className="text-xs text-gray-600">投入</p>
                          <p className="text-base font-bold text-gray-800">
                            ¥{position.amount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">市值</p>
                          <p className="text-base font-bold text-gray-800">
                            ¥{(position.currentNav * position.shares).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">收益</p>
                          <p className={cn(
                            "text-base font-bold",
                            position.profitLoss >= 0 ? "text-macaron-green" : "text-macaron-blue"
                          )}>
                            {position.profitLoss >= 0 ? "+" : ""}
                            ¥{Math.round(position.profitLoss).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                          收益率：{position.profitLossPercent >= 0 ? "+" : ""}
                          {position.profitLossPercent.toFixed(2)}%
                          {position.profitLoss >= 0 && " 📈"}
                          {position.profitLoss < 0 && " 📉"}
                          · {getProfitDescription(position.profitLoss)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 交易记录 */}
            {activeTab === "history" && (
              <div className="space-y-3">
                {transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-2">还没有交易记录</p>
                    <p className="text-sm text-gray-400">开始交易后会在这里显示~</p>
                  </div>
                ) : (
                  transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="border-2 border-gray-100 rounded-xl p-4 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            tx.type === "buy"
                              ? "bg-macaron-pink/20 text-macaron-pink"
                              : "bg-macaron-green/20 text-macaron-green"
                          )}>
                            {tx.type === "buy" ? "买入" : "卖出"}
                          </span>
                          <span className="font-bold text-gray-800">{tx.fundName}</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(tx.date).toLocaleString()} · {tx.shares.toFixed(2)} 份 · 净值 {tx.nav.toFixed(4)}
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
                  ))
                )}
              </div>
            )}
          </div>

          {/* 底部提示 */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              ⚠️ 以上均为虚拟交易，无真实资金 · 数据来源：CMES ETF（已平滑处理）
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
