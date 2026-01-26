"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Sparkles, PiggyBank, TrendingUp, BookOpen, Pill } from "lucide-react";
import { FundTree, PiggyBankGirl, MoneyBag, CoinStack } from "@/components/illustrations";

const tools = [
  {
    title: "未来胶囊",
    description: "个人养老金计划！每年12,000元额度，节税又养老，算算能省多少税",
    icon: Pill,
    href: "/tools/pension",
    color: "bg-gradient-to-r from-macaron-purple to-macaron-pink",
    illustration: <CoinStack size={40} />,
  },
  {
    title: "模拟交易",
    description: "0成本练理财！虚拟资金练习投资，市场波动不担心，轻松掌握交易技巧",
    icon: TrendingUp,
    href: "/tools/simulation",
    color: "bg-macaron-pink",
    illustration: <FundTree size={40} />,
  },
  {
    title: "定投计算器",
    description: "算算定投能帮你攒多少钱，设置目标金额和时长，看看能达到什么效果",
    icon: Calculator,
    href: "/tools/calculator",
    color: "bg-macaron-purple",
    illustration: <FundTree size={40} />,
  },
  {
    title: "省钱小算盘",
    description: "日常开支能省多少？一杯奶茶、一次外卖，算算一年能攒下多少钱",
    icon: PiggyBank,
    href: "/tools/money-saver",
    color: "bg-macaron-green",
    illustration: <PiggyBankGirl size={40} />,
  },
  {
    title: "理财日记",
    description: "记录你的理财心得，追踪收支变化",
    icon: BookOpen,
    href: "/tools/diary",
    color: "bg-macaron-blue",
    illustration: <MoneyBag size={40} />,
  },
  {
    title: "小白术语词典",
    description: "看不懂专业术语？这里有最通俗易懂的解释",
    icon: Sparkles,
    href: "/tools/dictionary",
    color: "bg-macaron-yellow",
    illustration: <CoinStack size={40} />,
  },
  {
    title: "AI闺蜜",
    description: "7x24小时智能答疑，随时为你解答理财问题",
    icon: Sparkles,
    href: "/tools/ai-assistant",
    color: "bg-macaron-pink/80",
    illustration: <CoinStack size={40} />,
  },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-macaron-cream via-macaron-pink/10 to-macaron-green/10 py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6">
        {/* 标题区域 */}
        <div className="mb-8 md:mb-12 text-center">
          <div className="inline-block mb-4 animate-bounce" style={{ animationDuration: "2s" }}>
            <CoinStack size={60} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 font-cute">
            ✨ 理财小工具 ✨
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            算算账、存存钱，理财其实很简单~
          </p>
        </div>

        {/* 工具卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.href} href={tool.href}>
                <Card
                  className="h-full hover:shadow-2xl transition-all duration-300 border-2 border-macaron-pink/30 group cursor-pointer relative overflow-hidden bg-white/80 backdrop-blur-sm"
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                  }}
                >
                  {/* 装饰插画 */}
                  <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
                    {tool.illustration}
                  </div>

                  <CardHeader className="relative">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-16 h-16 rounded-2xl ${tool.color} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}
                      >
                        <Icon className="w-8 h-8 text-gray-700" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl font-cute group-hover:text-macaron-pink transition-colors">
                          {tool.title}
                        </CardTitle>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-macaron-pink text-sm">点击探索</span>
                          <span className="text-macaron-pink group-hover:translate-x-1 transition-transform">
                            →
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="relative">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {tool.description}
                    </p>
                  </CardContent>

                  {/* 悬浮装饰效果 */}
                  <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-br from-macaron-pink/20 to-macaron-purple/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Coming Soon Card */}
        <Card
          className="mt-8 border-2 border-dashed border-macaron-blue/30 bg-gradient-to-br from-macaron-blue/10 to-macaron-purple/10"
        >
          <CardContent className="py-12 text-center">
            <div className="flex justify-center gap-4 mb-4">
              <div style={{ animationDuration: "2s" }} className="animate-bounce">
                <CoinStack size={40} />
              </div>
              <div style={{ animationDuration: "2.5s", animationDelay: "0.3s" }} className="animate-bounce">
                <MoneyBag size={40} />
              </div>
              <div style={{ animationDuration: "3s", animationDelay: "0.6s" }} className="animate-bounce">
                <PiggyBankGirl size={40} />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2 font-cute">
              🚀 更多工具开发中...
            </h3>
            <p className="text-gray-500">
              资产分析、风险评估、投资组合等功能即将上线，敬请期待！
            </p>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
