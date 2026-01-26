"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Target, Award, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WeeklyChallengeProps {
  onAccept: (points: number) => void;
}

export function WeeklyChallenge({ onAccept }: WeeklyChallengeProps) {
  const [accepted, setAccepted] = useState(false);

  const challenges = [
    {
      id: 1,
      title: "记账挑战",
      description: "记录一周的开支，找出3个可以节省的小钱",
      reward: 30,
      icon: "📔",
      color: "from-macaron-pink to-macaron-pink/80",
      completed: false,
    },
    {
      id: 2,
      title: "定投挑战",
      description: "坚持每天查看一次基金账户",
      reward: 20,
      icon: "💰",
      color: "from-macaron-green to-macaron-green/80",
      completed: false,
    },
    {
      id: 3,
      title: "学习挑战",
      description: "本周学习5篇理财知识",
      reward: 25,
      icon: "📚",
      color: "from-macaron-blue to-macaron-blue/80",
      completed: false,
    },
  ];

  return (
    <Card className="border-2 border-macaron-peach/30 bg-gradient-to-br from-macaron-peach/10 to-macaron-yellow/10">
      <div className="p-4 md:p-6">
        {/* 标题 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-macaron-pink" />
            <h3 className="font-bold text-gray-800 font-cute">本周挑战</h3>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600">剩余时间</p>
            <p className="text-lg font-bold text-macaron-pink font-cute">3天</p>
          </div>
        </div>

        {/* 挑战列表 */}
        <div className="space-y-2 md:space-y-3">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className={cn(
                "relative p-3 md:p-4 rounded-xl border-2 transition-all",
                !accepted && "border-macaron-pink/30 bg-white",
                accepted && "border-macaron-green/30 bg-macaron-green/10"
              )}
            >
              {/* 挑战内容 */}
              <div className="flex items-start gap-3">
                {/* 图标 */}
                <div className={cn(
                  "flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br",
                  challenge.color,
                  "flex items-center justify-center shadow-md"
                )}>
                  <span className="text-xl md:text-2xl">{challenge.icon}</span>
                </div>

                {/* 详情 */}
                <div className="flex-1 min-w-0">
                  <h4 className={cn(
                    "font-bold text-sm md:text-base mb-1",
                    "text-gray-800"
                  )}>
                    {challenge.title}
                  </h4>
                  <p className={cn(
                    "text-xs md:text-sm mb-2",
                    "text-gray-600 line-clamp-1"
                  )}>
                    {challenge.description}
                  </p>

                  {/* 奖励 */}
                  <div className="flex items-center gap-2">
                    <Award className="w-3 h-3 text-macaron-pink" />
                    <span className="text-xs font-medium text-macaron-pink">
                      +{challenge.reward} 积分
                    </span>
                  </div>
                </div>

                {/* 进度/按钮 */}
                <div className="flex-shrink-0">
                  {accepted ? (
                    <div className="text-xs text-macaron-green font-medium">
                      进行中
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => {
                        setAccepted(true);
                        onAccept(challenge.reward);
                      }}
                      className="bg-gradient-to-r from-macaron-pink to-macaron-purple hover:from-macaron-pink/90 hover:to-macaron-purple/90 text-white font-cute text-xs"
                    >
                      接受
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 底部提示 */}
        <div className="mt-3 md:mt-4 p-2 md:p-3 bg-white/50 rounded-xl">
          <p className="text-xs text-gray-600 text-center flex items-center justify-center gap-1">
            <TrendingUp className="w-3 h-3 text-macaron-pink" />
            完成挑战获得积分，解锁更多成就！
          </p>
        </div>
      </div>
    </Card>
  );
}
