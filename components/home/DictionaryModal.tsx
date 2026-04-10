"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// 术语数据 - 用大白话解释
const terms = [
  {
    id: "dingtou",
    term: "定投",
    simpleExplain: "就像每个月发工资后自动存一笔钱买基金，不用管市场涨跌，长期持有就能攒钱。",
    example: "比如每月15号自动从工资卡扣500元买基金，就像交话费一样简单。",
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
  {
    id: "shengoufei",
    term: "申购费",
    simpleExplain: "买基金时收取的手续费，通常1%-1.5%，网上买能打1折。",
    example: "买10000元基金，银行收150元手续费，支付宝只收15元！",
    emoji: "💸",
    category: "费用",
  },
  {
    id: "guanlifei",
    term: "管理费",
    simpleExplain: "基金公司帮你打理资金收取的费用，每年从基金资产里直接扣。",
    example: "基金公司每年收1.5%作为打理费，从基金资产里自动扣除。",
    emoji: "📊",
    category: "费用",
  },
  {
    id: "shuhuanfei",
    term: "赎回费",
    simpleExplain: "卖基金时收的费用，持有少于7天收1.5%，超过1年通常免收。",
    example: "持有基金7天内卖出收1.5%赎回费，持有超过1年就不收了！",
    emoji: "🔄",
    category: "费用",
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
];

interface DictionaryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DictionaryModal({ open, onOpenChange }: DictionaryModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("全部");

  const categories = ["全部", ...new Set(terms.map((t) => t.category))];

  const filteredTerms = terms.filter((term) => {
    const matchesSearch =
      searchQuery === "" ||
      term.term.includes(searchQuery) ||
      term.simpleExplain.includes(searchQuery);
    const matchesCategory =
      selectedCategory === "全部" || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-macaron-blue/10 via-macaron-cream to-macaron-purple/10">
        <DialogHeader>
          {/* 标题区域 */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-macaron-blue to-macaron-purple flex items-center justify-center shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 font-cute">
              📖 术语词典
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              不懂术语？用大白话讲给你听~
            </p>
          </div>
        </DialogHeader>

        {/* 搜索框 */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="搜索术语，比如：定投、止盈..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 h-12 text-base rounded-full border-2 border-macaron-blue/30 focus:border-macaron-blue/60 bg-white shadow-sm"
          />
        </div>

        {/* 分类筛选 */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-cute transition-all duration-300",
                selectedCategory === category
                  ? "bg-macaron-blue text-white shadow-md"
                  : "bg-white border-2 border-macaron-blue/30 text-gray-600 hover:bg-macaron-blue/10"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 术语列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredTerms.map((term) => (
            <div
              key={term.id}
              className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border-2 border-macaron-blue/20 hover:border-macaron-blue/40"
            >
              {/* 术语头部 */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{term.emoji}</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 font-cute mb-0.5">
                      {term.term}
                    </h3>
                    <span className="text-xs text-gray-500 bg-macaron-blue/20 px-2 py-0.5 rounded-full">
                      {term.category}
                    </span>
                  </div>
                </div>
                <HelpCircle className="w-4 h-4 text-macaron-blue" />
              </div>

              {/* 大白话解释 */}
              <div className="mb-2">
                <p className="text-xs text-gray-600 mb-1">
                  <span className="font-bold text-macaron-pink">大白话解释：</span>
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">{term.simpleExplain}</p>
              </div>

              {/* 举例说明 */}
              <div className="bg-macaron-cream rounded-lg p-2 border-2 border-macaron-yellow/30">
                <p className="text-xs text-gray-600 mb-0.5">
                  💡 举个例子
                </p>
                <p className="text-xs text-gray-700">{term.example}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredTerms.length === 0 && (
          <div className="text-center py-8">
            <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">没有找到相关术语</p>
            <p className="text-sm text-gray-400">试试搜索其他关键词吧~</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
