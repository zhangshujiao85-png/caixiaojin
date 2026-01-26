import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Eye } from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface KnowledgeCardProps {
  title: string;
  summary: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "warning";
  category: string;
  tags: string[];
  readTime: number;
  viewCount: number;
  coverImage?: string;
}

const difficultyConfig = {
  beginner: { label: "小白入门", color: "bg-macaron-green text-green-700" },
  intermediate: { label: "轻松上手", color: "bg-macaron-blue text-blue-700" },
  advanced: { label: "稳中进阶", color: "bg-macaron-purple text-purple-700" },
  warning: { label: "避坑指南", color: "bg-orange-200 text-orange-700" },
};

export function KnowledgeCard({
  title,
  summary,
  difficulty,
  category,
  tags,
  readTime,
  viewCount,
  coverImage,
}: KnowledgeCardProps) {
  const config = difficultyConfig[difficulty];

  return (
    <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300">
      {coverImage && (
        <div className="relative h-40 overflow-hidden">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
              {config.label}
            </span>
          </div>
        </div>
      )}
      <CardHeader className={coverImage ? "pb-3" : ""}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <CardTitle className="text-lg leading-snug line-clamp-2 group-hover:text-macaron-pink transition-colors">
            {title}
          </CardTitle>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{summary}</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs bg-macaron-cream text-gray-700"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{readTime} 分钟</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>{formatNumber(viewCount)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
