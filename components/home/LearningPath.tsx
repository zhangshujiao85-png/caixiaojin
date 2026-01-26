"use client";

import { Card } from "@/components/ui/card";
import { MapPin, Flag, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LearningPathProps {
  completedArticles: string[];
}

export function LearningPath({ completedArticles }: LearningPathProps) {
  const paths = [
    {
      level: 1,
      title: "新手村",
      color: "from-macaron-green to-macaron-green/80",
      bgColor: "bg-macaron-green",
      emoji: "🌱",
      nodes: [
        { id: "1", title: "什么是定投", completed: completedArticles.includes("1") },
        { id: "2", title: "基金类型", completed: completedArticles.includes("2") },
        { id: "3", title: "费用解析", completed: completedArticles.includes("6") },
      ],
    },
    {
      level: 2,
      title: "进阶镇",
      color: "from-macaron-blue to-macaron-blue/80",
      bgColor: "bg-macaron-blue",
      emoji: "💪",
      nodes: [
        { id: "4", title: "止盈策略", completed: completedArticles.includes("4") },
        { id: "5", title: "抄底技巧", completed: completedArticles.includes("5") },
      ],
    },
    {
      level: 3,
      title: "专家城",
      color: "from-macaron-purple to-macaron-purple/80",
      bgColor: "bg-macaron-purple",
      emoji: "⭐",
      nodes: [
        { id: "3", title: "避坑指南", completed: completedArticles.includes("3") },
      ],
    },
  ];

  return (
    <Card className="border-2 border-macaron-green/30 bg-gradient-to-br from-macaron-green/10 to-macaron-blue/10">
      <div className="p-4 md:p-6">
        {/* 标题 */}
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-macaron-pink" />
          <h3 className="font-bold text-gray-800 font-cute">学习路径</h3>
        </div>

        {/* 路径展示 */}
        <div className="space-y-4">
          {paths.map((path) => (
            <div key={path.level} className="flex items-start gap-3">
              {/* 等级标识 */}
              <div className={cn(
                "flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br",
                path.color,
                "flex items-center justify-center shadow-md"
              )}>
                <span className="text-2xl">{path.emoji}</span>
              </div>

              {/* 等级名称和节点 */}
              <div className="flex-1">
                <h4 className={cn(
                  "font-bold text-sm mb-2 font-cute",
                  "text-gray-800"
                )}>
                  {path.title}
                </h4>
                <div className="space-y-1">
                  {path.nodes.map((node, index) => (
                    <div
                      key={node.id}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-lg transition-all",
                        node.completed
                          ? "bg-macaron-green/20 border-2 border-macaron-green/40"
                          : "bg-gray-50 border-2 border-gray-200"
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0",
                        node.completed
                          ? "bg-macaron-green text-white"
                          : "bg-gray-300 text-gray-500"
                      )}>
                        {node.completed ? <CheckCircle2 className="w-3 h-3" /> : index + 1}
                      </div>
                      <span className={cn(
                        "text-xs font-medium",
                        node.completed ? "text-macaron-green" : "text-gray-600"
                      )}>
                        {node.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 提示 */}
        <div className="mt-4 p-3 bg-macaron-yellow/20 rounded-xl">
          <p className="text-xs text-gray-600 text-center">
            💡 完成前置学习才能解锁下一阶段哦~
          </p>
        </div>
      </div>
    </Card>
  );
}
