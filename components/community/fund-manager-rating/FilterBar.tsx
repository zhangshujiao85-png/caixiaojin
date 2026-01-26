"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown } from "lucide-react";
import { useFundManagerStore } from "@/store/fundManagerStore";
import { FundProductTypeLabels, FundProductType } from "@/types/fundManager";
import { cn } from "@/lib/utils";

export function FilterBar() {
  const {
    searchQuery,
    selectedType,
    sortBy,
    setSearchQuery,
    setSelectedType,
    setSortBy,
  } = useFundManagerStore();

  const types: Array<{ value: FundProductType | "all"; label: string }> = [
    { value: "all", label: "全部" },
    { value: "stock", label: "股票型" },
    { value: "mix", label: "混合型" },
    { value: "bond", label: "债券型" },
    { value: "index", label: "指数型" },
    { value: "qdii", label: "QDII" },
  ];

  const sortOptions = [
    { value: "rating", label: "评分最高" },
    { value: "ratingsCount", label: "评分最多" },
    { value: "experience", label: "从业年限" },
    { value: "assets", label: "管理规模" },
  ];

  return (
    <div className="mb-6 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="搜索基金经理或公司..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Type Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {types.map((type) => (
          <Button
            key={type.value}
            variant={selectedType === type.value ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType(type.value)}
            className={cn(
              "flex-shrink-0 font-cute",
              selectedType === type.value
                ? "bg-macaron-pink hover:bg-macaron-pink/90 text-white"
                : "bg-white border-macaron-pink/30 hover:bg-macaron-pink/10"
            )}
          >
            {type.label}
          </Button>
        ))}
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <ArrowUpDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
        {sortOptions.map((option) => (
          <Button
            key={option.value}
            variant={sortBy === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy(option.value as any)}
            className={cn(
              "flex-shrink-0 font-cute text-sm",
              sortBy === option.value
                ? "bg-macaron-blue hover:bg-macaron-blue/90 text-white"
                : "bg-white border-macaron-blue/30 hover:bg-macaron-blue/10"
            )}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
