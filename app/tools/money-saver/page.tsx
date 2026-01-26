"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { PiggyBank, Coffee, ShoppingBag, Car, Utensils, Gamepad2, Sparkles, ArrowLeft } from "lucide-react";
import { CoinStack, PiggyBankGirl } from "@/components/illustrations";

interface SavingItem {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  defaultCost: number;
  altCost: number;
  unit: string;
}

const savingItems: SavingItem[] = [
  {
    id: "milktea",
    name: "奶茶",
    icon: Coffee,
    description: "把奶茶换成自己泡的茶或咖啡",
    defaultCost: 20,
    altCost: 3,
    unit: "杯",
  },
  {
    id: "takeout",
    name: "外卖",
    icon: Utensils,
    description: "每周少点2次外卖，自己做饭",
    defaultCost: 35,
    altCost: 15,
    unit: "顿",
  },
  {
    id: "shopping",
    name: "网购",
    icon: ShoppingBag,
    description: "控制冲动消费，只买必需品",
    defaultCost: 200,
    altCost: 100,
    unit: "月",
  },
  {
    id: "taxi",
    name: "打车",
    icon: Car,
    description: "短途选择地铁或公交",
    defaultCost: 30,
    altCost: 4,
    unit: "次",
  },
  {
    id: "game",
    name: "游戏充值",
    icon: Gamepad2,
    description: "减少不必要的游戏消费",
    defaultCost: 100,
    altCost: 30,
    unit: "月",
  },
];

export default function MoneySaverPage() {
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});

  const handleItemChange = (id: string, frequency: number) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: frequency,
    }));
  };

  const calculateSavings = () => {
    let totalDaily = 0;
    let totalMonthly = 0;
    let totalYearly = 0;

    Object.entries(selectedItems).forEach(([itemId, frequency]) => {
      const item = savingItems.find((i) => i.id === itemId);
      if (item && frequency > 0) {
        const savingPerUnit = item.defaultCost - item.altCost;
        totalDaily += savingPerUnit * frequency;
        totalMonthly += savingPerUnit * frequency * 30;
        totalYearly += savingPerUnit * frequency * 365;
      }
    });

    return { daily: totalDaily, monthly: totalMonthly, yearly: totalYearly };
  };

  const savings = calculateSavings();
  const hasSelection = Object.keys(selectedItems).some((key) => selectedItems[key] > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-macaron-green/20 via-macaron-cream to-macaron-pink/20 py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        {/* 返回按钮 */}
        <Link href="/tools" className="inline-flex items-center gap-2 text-macaron-pink hover:text-macaron-purple transition-colors mb-6 group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-cute font-medium">返回工具箱</span>
        </Link>

        {/* 标题区域 */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="animate-bounce" style={{ animationDuration: "2s" }}>
              <PiggyBankGirl size={70} />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 font-cute">
            💰 省钱小算盘 💰
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            小钱也能攒成大财富，算算你能省多少~
          </p>
        </div>

        {/* 节省项目列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {savingItems.map((item) => {
            const Icon = item.icon;
            const frequency = selectedItems[item.id] || 0;

            return (
              <Card
                key={item.id}
                className="border-2 border-macaron-green/30 hover:border-macaron-green/60 transition-all duration-300 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-macaron-green/30 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-gray-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800 font-cute mb-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-500">
                          原价 ¥{item.defaultCost}/{item.unit} →
                        </span>
                        <span className="text-macaron-green font-semibold">
                          ¥{item.altCost}/{item.unit}
                        </span>
                        <span className="text-macaron-pink font-semibold">
                          省 ¥{item.defaultCost - item.altCost}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 数量选择器 */}
                  <div className="flex items-center justify-between bg-macaron-cream rounded-xl p-3">
                    <span className="text-sm text-gray-600">每天/每周次数：</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleItemChange(item.id, Math.max(0, frequency - 1))
                        }
                        className="w-8 h-8 rounded-full bg-macaron-pink hover:bg-macaron-pink/80 text-white font-bold text-lg transition-colors flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-bold text-lg text-gray-800 font-cute">
                        {frequency}
                      </span>
                      <button
                        onClick={() =>
                          handleItemChange(item.id, Math.min(10, frequency + 1))
                        }
                        className="w-8 h-8 rounded-full bg-macaron-green hover:bg-macaron-green/80 text-white font-bold text-lg transition-colors flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 计算结果 */}
        {hasSelection && (
          <Card className="border-2 border-macaron-pink/40 bg-gradient-to-br from-macaron-pink/10 to-macaron-yellow/10 overflow-hidden relative">
            {/* 装饰插画 */}
            <div className="absolute top-4 right-4 opacity-20">
              <CoinStack size={60} />
            </div>

            <CardContent className="p-8 relative">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-white/80 rounded-full px-6 py-2 mb-4">
                  <Sparkles className="w-5 h-5 text-macaron-pink" />
                  <span className="font-cute font-bold text-gray-800">
                    你的省钱成果
                  </span>
                  <Sparkles className="w-5 h-5 text-macaron-pink" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 每天节省 */}
                <div className="bg-white/80 rounded-2xl p-6 text-center backdrop-blur-sm">
                  <p className="text-sm text-gray-600 mb-2">每天节省</p>
                  <p className="text-3xl font-bold text-macaron-green font-cute">
                    ¥{savings.daily.toFixed(0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    ≈ {Math.floor(savings.daily / 20)} 杯奶茶
                  </p>
                </div>

                {/* 每月节省 */}
                <div className="bg-white/80 rounded-2xl p-6 text-center backdrop-blur-sm">
                  <p className="text-sm text-gray-600 mb-2">每月节省</p>
                  <p className="text-3xl font-bold text-macaron-blue font-cute">
                    ¥{savings.monthly.toFixed(0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    ≈ {Math.floor(savings.monthly / 500)} 件衣服
                  </p>
                </div>

                {/* 每年节省 */}
                <div className="bg-white/80 rounded-2xl p-6 text-center backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-macaron-pink/20 to-macaron-yellow/20" />
                  <div className="relative">
                    <p className="text-sm text-gray-600 mb-2">💎 每年节省</p>
                    <p className="text-4xl font-bold text-macaron-pink font-cute">
                      ¥{savings.yearly.toFixed(0)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      可以买 {Math.floor(savings.yearly / 3000)} 个名牌包！
                    </p>
                  </div>
                </div>
              </div>

              {/* 激励语 */}
              <div className="mt-6 text-center">
                <p className="text-gray-700 font-medium">
                  {savings.yearly > 10000
                    ? "🎉 天呐！你简直是省钱小能手，一年能省这么多！"
                    : savings.yearly > 5000
                    ? "💪 不错哦！坚持下去，财富自由不是梦！"
                    : "🌱 小小的改变，大大的收获，继续加油！"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {!hasSelection && (
          <Card className="border-2 border-dashed border-gray-300 bg-white/50">
            <CardContent className="py-12 text-center">
              <PiggyBank className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                选择你想节省的项目，算算能省多少钱~
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
