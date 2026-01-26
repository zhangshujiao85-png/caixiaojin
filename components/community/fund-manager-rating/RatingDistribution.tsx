"use client";

import { RatingDistribution as RatingDistType } from "@/types/fundManager";
import { cn } from "@/lib/utils";

interface RatingDistributionProps {
  distribution: RatingDistType;
  totalRatings: number;
}

export function RatingDistribution({
  distribution,
  totalRatings,
}: RatingDistributionProps) {
  const ratings = [
    { key: "rating10", label: "10分", color: "from-macaron-green to-macaron-green/80" },
    { key: "rating9", label: "9分", color: "from-macaron-green/90 to-macaron-blue/90" },
    { key: "rating8", label: "8分", color: "from-macaron-blue to-macaron-blue/80" },
    { key: "rating7", label: "7分", color: "from-macaron-blue/90 to-macaron-purple/90" },
    { key: "rating6", label: "6分", color: "from-macaron-purple to-macaron-purple/80" },
    { key: "rating5", label: "5分", color: "from-macaron-purple/90 to-macaron-yellow/90" },
    { key: "rating4", label: "4分", color: "from-macaron-yellow to-macaron-yellow/80" },
    { key: "rating3", label: "3分", color: "from-macaron-yellow/90 to-macaron-orange/90" },
    { key: "rating2", label: "2分", color: "from-macaron-orange to-macaron-orange/80" },
    { key: "rating1", label: "1分", color: "from-macaron-orange/90 to-macaron-pink/90" },
  ];

  return (
    <div className="space-y-3">
      {ratings.map((rating) => {
        const count = distribution[rating.key as keyof RatingDistType];
        const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;

        return (
          <div key={rating.key} className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600 w-12">
              {rating.label}
            </span>
            <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full bg-gradient-to-r rounded-full transition-all duration-500",
                  rating.color,
                  percentage > 0 ? "min-w-[4px]" : ""
                )}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="text-sm text-gray-500 w-20 text-right">
              <span className="font-medium">{count}</span>
              <span className="text-xs ml-1">
                ({percentage.toFixed(1)}%)
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
