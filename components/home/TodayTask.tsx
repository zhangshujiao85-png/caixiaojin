'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface TodayTaskProps {
  onAccept?: () => void;
}

export const TodayTask: React.FC<TodayTaskProps> = ({ onAccept }) => {
  return (
    <Card className="border-2 border-macaron-purple/30 bg-gradient-to-br from-macaron-purple/10 to-macaron-pink/10 overflow-hidden relative">
      <div className="p-4 md:p-6 relative">
        {/* 标题栏 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-macaron-purple" />
            <h3 className="font-bold text-gray-800 font-cute">今日任务</h3>
          </div>
          <span className="text-sm text-gray-500 bg-white/60 px-3 py-1 rounded-full">
            2分钟
          </span>
        </div>

        {/* 任务内容 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 border-2 border-macaron-purple/20">
          {/* 任务标题 */}
          <h4 className="text-lg font-bold text-gray-800 mb-3 font-cute">
            ### 超市价格猎人
          </h4>

          {/* 任务描述 */}
          <p className="text-gray-700 mb-4 leading-relaxed">
            下次逛超市时，对比同类商品的单价，思考为什么有些贵有些便宜——这就是'性价比'思维。
          </p>

          {/* 任务按钮 */}
          <button
            onClick={onAccept}
            className="w-full py-3 px-6 bg-gradient-to-r from-macaron-purple to-macaron-pink hover:from-macaron-purple/90 hover:to-macaron-pink/90 text-white font-cute font-bold rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            接受任务 +15 价值判断
          </button>
        </div>

        {/* 装饰 */}
        <div className="absolute -top-2 -right-2 text-4xl animate-bounce opacity-30" style={{ animationDuration: '3s' }}>
          🛒
        </div>
      </div>
    </Card>
  );
};

export default TodayTask;
