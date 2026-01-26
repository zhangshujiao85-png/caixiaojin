"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useFundManagerStore } from "@/store/fundManagerStore";
import { ManagerCard } from "@/components/community/fund-manager-rating/ManagerCard";
import { FilterBar } from "@/components/community/fund-manager-rating/FilterBar";
import { useMemo } from "react";

export default function FundManagerRatingPage() {
  const { managers, selectedType, sortBy, searchQuery } = useFundManagerStore();

  const filteredManagers = useMemo(() => {
    let filtered = [...managers];

    // 按类型筛选
    if (selectedType !== "all") {
      filtered = filtered.filter((m) => m.productType === selectedType);
    }

    // 按搜索关键词筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.company.toLowerCase().includes(query)
      );
    }

    // 排序
    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case "ratingsCount":
        filtered.sort((a, b) => b.totalRatings - a.totalRatings);
        break;
      case "experience":
        filtered.sort((a, b) => b.experienceYears - a.experienceYears);
        break;
      case "assets":
        filtered.sort((a, b) => b.totalAssets - a.totalAssets);
        break;
    }

    return filtered;
  }, [managers, selectedType, sortBy, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-macaron-yellow/20 via-macaron-cream to-macaron-peach/20 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* 返回按钮 */}
        <Link
          href="/community"
          className="inline-flex items-center gap-2 text-macaron-pink hover:text-macaron-purple mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-cute">返回社区</span>
        </Link>

        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-cute text-gray-800 mb-2">
            ⭐ 基金经理评分 ⭐
          </h1>
          <p className="text-gray-600">
            为你信赖的基金经理打分，看看谁最受欢迎~
          </p>
        </div>

        {/* 筛选栏 */}
        <FilterBar />

        {/* 基金经理列表 */}
        {filteredManagers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">暂无相关基金经理</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredManagers.map((manager) => (
              <ManagerCard key={manager.id} manager={manager} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
