"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, HelpCircle, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

// 术语数据 - 用大白话解释
const terms = [
  {
    id: "dingtou",
    term: "定投",
    simpleExplain: "就像每个月发工资后自动存一笔钱买基金，不用管市场涨跌，长期持有就能攒钱。",
    example: "每月15号自动从工资卡扣500元买基金，就像交话费一样简单。",
    emoji: "💰",
    category: "基础概念",
  },
  {
    id: "zhuiying",
    term: "止盈",
    simpleExplain: "赚钱了就卖掉，把钱落袋为安。比如涨了20%就卖一部分，保住利润。",
    example: "买基金赚了20%，就卖出一部分，这样即使跌了也不会亏本。",
    emoji: "💎",
    category: "投资策略",
  },
  {
    id: "shishui",
    term: "止损",
    simpleExplain: "亏钱了就赶紧卖，防止亏更多。比如亏了10%就卖，避免越亏越多。",
    example: "买基金跌了10%，赶紧卖，这样至少还能保住90%的本金。",
    emoji: "🛡️",
    category: "风险控制",
  },
  {
    id: "shulx",
    term: "收益率",
    simpleExplain: "赚钱的比例，比如赚了20%，收益率就是20%。",
    example: "投入100元，赚了20元，收益率就是20%。",
    emoji: "📈",
    category: "基础概念",
  },
  {
    id: "huilu",
    term: "波动率",
    simpleExplain: "价格涨跌的幅度，波动大说明风险大，波动小说明比较稳。",
    example: "股票一天涨跌10%，波动就很大；债券一天只涨跌0.5%，波动很小。",
    emoji: "📊",
    category: "风险指标",
  },
  {
    id: "gupiao",
    term: "股票",
    simpleExplain: "买公司的股份，公司赚钱你也跟着赚钱，但波动大风险高。",
    example: "就像和朋友合伙做生意，赚了分红，亏了一起承担。",
    emoji: "📈",
    category: "基础概念",
  },
  {
    id: "zaiquan",
    term: "债券",
    simpleExplain: "借钱给政府或公司，他们定期还利息，到期还本金，比较稳。",
    example: "就像借钱给朋友，他每个月给你利息，到期还本金。",
    emoji: "📜",
    category: "基础概念",
  },
];

export function DictionarySection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("全部");

  const categories = ["全部", "基础概念", "投资策略", "风险控制", "风险指标"];

  const filteredTerms = terms.filter((term) => {
    const matchesSearch =
      searchQuery === "" ||
      term.term.includes(searchQuery) ||
      term.simpleExplain.includes(searchQuery);
    const matchesCategory =
      selectedCategory === "全部" || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 只显示前4个术语（或者搜索时显示所有）
  const displayTerms = searchQuery || selectedCategory !== "全部" ? filteredTerms : filteredTerms.slice(0, 4);

  return (
    <div className="mt-6">
      {/* 标题和搜索 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-macaron-purple" />
          <h3 className="font-bold text-gray-800 font-cute">小白术语词典 📖</h3>
        </div>
      </div>

      {/* 搜索框 */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder="搜索术语..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 h-10 text-sm rounded-full border-2 border-macaron-purple/20 focus:border-macaron-purple/50 bg-white/80"
        />
      </div>

      {/* 分类筛选 - 只在有搜索时显示 */}
      {searchQuery && (
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-cute transition-all duration-300",
                selectedCategory === category
                  ? "bg-macaron-purple text-white shadow-sm"
                  : "bg-white/80 border-2 border-macaron-purple/20 text-gray-600 hover:bg-macaron-purple/10"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* 术语卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {displayTerms.map((term) => (
          <div
            key={term.id}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border-2 border-macaron-purple/20 hover:border-macaron-purple/40"
          >
            {/* 术语头部 */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{term.emoji}</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 font-cute mb-0.5">
                    {term.term}
                  </h3>
                  <span className="text-xs text-gray-500 bg-macaron-purple/20 px-2 py-0.5 rounded-full">
                    {term.category}
                  </span>
                </div>
              </div>
              <HelpCircle className="w-4 h-4 text-macaron-purple" />
            </div>

            {/* 大白话解释 */}
            <p className="text-sm text-gray-700 mb-2 leading-relaxed">
              {term.simpleExplain}
            </p>

            {/* 举例说明 */}
            <div className="bg-macaron-cream/50 rounded-lg p-2 border border-macaron-yellow/30">
              <p className="text-xs text-gray-600 mb-0.5">
                💡 举个例子
              </p>
              <p className="text-xs text-gray-700">{term.example}</p>
            </div>
          </div>
        ))}
      </div>

      {displayTerms.length === 0 && (
        <div className="text-center py-6">
          <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">没有找到相关术语</p>
        </div>
      )}

      {/* 查看更多 */}
      {!searchQuery && selectedCategory === "全部" && (
        <div className="text-center mt-4">
          <a
            href="/tools/dictionary"
            className="inline-flex items-center gap-2 text-macaron-purple hover:text-macaron-pink transition-colors text-sm font-cute"
          >
            查看全部术语 →
          </a>
        </div>
      )}
    </div>
  );
}
