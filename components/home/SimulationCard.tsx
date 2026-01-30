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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

// 基金类型定义
const fundTypes = [
  {
    id: "money",
    name: "超稳货币型",
    risk: "低风险",
    expectedReturn: "2-3%",
    icon: "💰",
  },
  {
    id: "bond",
    name: "稳中债券型",
    risk: "低风险",
    expectedReturn: "3-5%",
    icon: "📈",
  },
  {
    id: "index",
    name: "宽基指数型",
    risk: "中低风险",
    expectedReturn: "8-12%",
    icon: "📊",
  },
  {
    id: "mixed",
    name: "灵活混合型",
    risk: "中等风险",
    expectedReturn: "10-15%",
    icon: "🎯",
  },
];

interface Position {
  fundType: string;
  amount: number;
  shares: number;
  currentPrice: number;
  profitLoss: number;
  profitLossPercent: number;
}

interface Transaction {
  id: string;
  type: "buy" | "sell";
  fundType: string;
  amount: number;
  shares: number;
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

    const savedData = localStorage.getItem("simulationData");
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
          const newPrice = pos.currentPrice * (1 + change);
          const newProfitLoss = newPrice * pos.shares - pos.amount;
          const newProfitLossPercent = (newProfitLoss / pos.amount) * 100;

          return {
            ...pos,
            currentPrice: newPrice,
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
    localStorage.setItem("simulationData", JSON.stringify({ cashBalance, positions }));
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
              0成本练理财，虚拟资金练手，轻松掌握交易技巧 🚀
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
            实时行情
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

  // 从localStorage读取数据
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedData = localStorage.getItem("simulationData");
    if (savedData) {
      const data = JSON.parse(savedData);
      setCashBalance(data.cashBalance || 100000);
      setPositions(data.positions || []);
      setTransactions(data.transactions || []);
    }
  }, []);

  // 保存数据到localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem("simulationData", JSON.stringify({ cashBalance, positions, transactions }));
  }, [cashBalance, positions, transactions]);

  // 模拟价格波动
  useEffect(() => {
    const interval = setInterval(() => {
      setPositions((prev) =>
        prev.map((pos) => {
          const change = (Math.random() - 0.5) * 0.02;
          const newPrice = pos.currentPrice * (1 + change);
          const newProfitLoss = newPrice * pos.shares - pos.amount;
          const newProfitLossPercent = (newProfitLoss / pos.amount) * 100;

          return {
            ...pos,
            currentPrice: newPrice,
            profitLoss: newProfitLoss,
            profitLossPercent: newProfitLossPercent,
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // 买入
  const handleBuy = () => {
    if (!selectedFund || !buyAmount) return;

    const amount = Number(buyAmount);
    if (amount < 100 || amount > cashBalance) {
      alert("最低买入 100 元，且不能超过可用资金");
      return;
    }

    const fund = fundTypes.find((f) => f.id === selectedFund);
    if (!fund) return;

    const currentPrice = 1 + Math.random() * 0.5;
    const shares = amount / currentPrice;

    const existingPosition = positions.find((p) => p.fundType === selectedFund);
    if (existingPosition) {
      setPositions(
        positions.map((p) =>
          p.fundType === selectedFund
            ? {
                ...p,
                amount: p.amount + amount,
                shares: p.shares + shares,
                currentPrice,
              }
            : p
        )
      );
    } else {
      setPositions([
        ...positions,
        {
          fundType: selectedFund,
          amount,
          shares,
          currentPrice,
          profitLoss: 0,
          profitLossPercent: 0,
        },
      ]);
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      type: "buy",
      fundType: fund.name,
      amount,
      shares,
      date: new Date(),
    };
    setTransactions([transaction, ...transactions]);

    setCashBalance(cashBalance - amount);
    setBuyAmount("");
    setSelectedFund("");
    setShowBuySuccess(true);

    setTimeout(() => setShowBuySuccess(false), 2000);
  };

  // 卖出
  const handleSell = (fundType: string) => {
    const position = positions.find((p) => p.fundType === fundType);
    if (!position) return;

    const fund = fundTypes.find((f) => f.id === fundType);
    if (!fund) return;

    const sellAmount = position.currentPrice * position.shares;

    const transaction: Transaction = {
      id: Date.now().toString(),
      type: "sell",
      fundType: fund.name,
      amount: sellAmount,
      shares: position.shares,
      date: new Date(),
    };
    setTransactions([transaction, ...transactions]);

    setCashBalance(cashBalance + sellAmount);
    setPositions(positions.filter((p) => p.fundType !== fundType));
  };

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
          className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 标题 */}
          <div className="p-6 bg-gradient-to-r from-macaron-purple to-macaron-pink">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white font-cute mb-1">
                  🎮 模拟交易
                </h2>
                <p className="text-white/90 text-sm">0成本练理财，全程免费无风险</p>
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
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4 font-cute">
                    🎯 选择基金类型
                  </h3>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {fundTypes.map((fund) => (
                      <div
                        key={fund.id}
                        onClick={() => setSelectedFund(fund.id)}
                        className={cn(
                          "p-3 rounded-xl border-2 cursor-pointer transition-all hover:scale-105",
                          selectedFund === fund.id
                            ? "border-macaron-pink bg-macaron-pink/10"
                            : "border-gray-200 hover:border-macaron-pink/50"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{fund.icon}</span>
                          <span className="font-bold text-sm text-gray-800">{fund.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                            {fund.risk}
                          </span>
                          <span className="text-macaron-pink font-medium">
                            {fund.expectedReturn}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

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
                  positions.map((position) => {
                    const fund = fundTypes.find((f) => f.id === position.fundType);
                    if (!fund) return null;

                    return (
                      <div
                        key={position.fundType}
                        className="border-2 border-gray-100 rounded-xl p-4 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{fund.icon}</span>
                            <div>
                              <h4 className="font-bold text-gray-800">{fund.name}</h4>
                              <p className="text-xs text-gray-500">持有 {position.shares.toFixed(2)} 份</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleSell(position.fundType)}
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
                              ¥{(position.currentPrice * position.shares).toLocaleString()}
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
                      </div>
                    );
                  })
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
                          <span className="font-bold text-gray-800">{tx.fundType}</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(tx.date).toLocaleString()} · {tx.shares.toFixed(2)} 份
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
              ⚠️ 以上均为虚拟交易，无真实资金 · 建议学习后再真实投资
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
