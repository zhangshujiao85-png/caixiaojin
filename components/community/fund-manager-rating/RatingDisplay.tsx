import { cn } from "@/lib/utils";

interface RatingDisplayProps {
  rating: number;
  totalRatings: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function RatingDisplay({
  rating,
  totalRatings,
  size = "md",
  showLabel = true,
}: RatingDisplayProps) {
  // 根据分数获取颜色
  const getRatingColor = (score: number) => {
    if (score >= 9.0) return "text-macaron-green";
    if (score >= 8.0) return "text-macaron-blue";
    if (score >= 7.0) return "text-macaron-purple";
    if (score >= 6.0) return "text-macaron-yellow";
    return "text-macaron-pink";
  };

  const sizeClasses = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-4xl",
  };

  const labelSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className="text-right">
      <div
        className={cn(
          "font-bold",
          sizeClasses[size],
          getRatingColor(rating)
        )}
      >
        {rating.toFixed(1)}
      </div>
      {showLabel && (
        <div className={cn("text-gray-500", labelSizeClasses[size])}>
          {totalRatings}人评分
        </div>
      )}
    </div>
  );
}
