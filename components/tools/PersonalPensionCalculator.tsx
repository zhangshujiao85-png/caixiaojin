'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Sparkles, TrendingDown, ArrowLeft } from 'lucide-react';

export const PersonalPensionCalculator: React.FC = () => {
  const [monthlyIncome, setMonthlyIncome] = useState([15000]);

  // 计算税率档位和节省税额
  const getTaxBracket = (income: number) => {
    const annualIncome = income * 12;
    if (annualIncome <= 60000) return { rate: 3, limit: 60000, savings: 360 };
    if (annualIncome <= 120000) return { rate: 10, limit: 120000, savings: 1200 };
    if (annualIncome <= 180000) return { rate: 20, limit: 180000, savings: 2400 };
    if (annualIncome <= 300000) return { rate: 25, limit: 300000, savings: 3000 };
    return { rate: 30, limit: 420000, savings: 3600 };
  };

  const taxInfo = getTaxBracket(monthlyIncome[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-macaron-pink/10 via-macaron-cream to-macaron-purple/10 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* 返回按钮 */}
        <Link href="/tools" className="inline-flex items-center gap-2 text-macaron-pink hover:text-macaron-purple transition-colors mb-6 group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-cute font-medium">返回工具箱</span>
        </Link>

        {/* 标题区域 */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce" style={{ animationDuration: '3s' }}>
            💊
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 font-cute">
            未来胶囊
          </h1>
          <p className="text-xl text-macaron-pink font-cute mb-4">
            个人养老金计划
          </p>
          <p className="text-gray-600 leading-relaxed">
            每年12,000元额度，节税又养老
          </p>
          <p className="text-gray-600 leading-relaxed">
            为未来的自己种下一颗金色种子 🌱
          </p>
        </div>

        {/* 省钱小算盘 */}
        <Card className="border-2 border-macaron-purple/30 shadow-xl mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-macaron-purple to-macaron-pink p-4">
            <h2 className="text-2xl font-bold text-white text-center font-cute flex items-center justify-center gap-2">
              <TrendingDown className="w-6 h-6" />
              省钱小算盘
            </h2>
            <p className="text-white/90 text-center text-sm mt-1">
              滑动看看能省多少税
            </p>
          </div>

          <div className="p-6 md:p-8">
            {/* 月收入显示 */}
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-macaron-purple font-cute mb-2">
                月收入 ¥{monthlyIncome[0].toLocaleString()}
              </div>
            </div>

            {/* 滑动条 */}
            <div className="mb-8">
              <Slider
                value={monthlyIncome}
                onValueChange={setMonthlyIncome}
                max={80000}
                min={5000}
                step={1000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-3">
                <span>¥5,000</span>
                <span>¥80,000</span>
              </div>
            </div>

            {/* 当前税率档位 */}
            <div className="bg-macaron-purple/10 rounded-2xl p-4 mb-6 text-center">
              <p className="text-gray-600 mb-2">当前税率档位</p>
              <p className="text-3xl font-bold text-macaron-purple font-cute">
                {taxInfo.rate}%
              </p>
            </div>

            {/* 省税金额 */}
            <div className="bg-gradient-to-r from-macaron-pink/20 to-macaron-purple/20 rounded-2xl p-6 mb-6 text-center">
              <p className="text-gray-700 mb-2">
                存入12,000元个人养老金，今年可省税
              </p>
              <p className="text-5xl font-bold text-macaron-pink font-cute mb-4">
                ¥{taxInfo.savings.toLocaleString()}
                <span className="text-2xl text-gray-600">/年</span>
              </p>
              <div className="bg-white/80 rounded-xl p-4 border-2 border-macaron-pink/20">
                <p className="text-gray-700 italic text-sm leading-relaxed">
                  "这不叫花钱，这叫把本来要上交的'管理费'存进自己的未来账户。"
                </p>
              </div>
            </div>

            {/* 省下的钱相当于 */}
            <div>
              <p className="text-gray-700 text-center mb-4 font-semibold">
                省下的钱相当于
              </p>
              <div className="grid grid-cols-2 gap-4">
                {taxInfo.savings >= 360 && (
                  <div className="bg-white rounded-xl p-4 border-2 border-macaron-pink/20 text-center hover:shadow-md transition-shadow">
                    <div className="text-3xl mb-2">💄</div>
                    <p className="text-gray-700 font-semibold">
                      {Math.floor(taxInfo.savings / 360)} 香奈儿口红
                    </p>
                  </div>
                )}
                {taxInfo.savings >= 1200 && (
                  <div className="bg-white rounded-xl p-4 border-2 border-macaron-pink/20 text-center hover:shadow-md transition-shadow">
                    <div className="text-3xl mb-2">🧘‍♀️</div>
                    <p className="text-gray-700 font-semibold">
                      {Math.floor(taxInfo.savings / 1200)} lululemon瑜伽裤
                    </p>
                  </div>
                )}
                {taxInfo.savings >= 1200 && (
                  <div className="bg-white rounded-xl p-4 border-2 border-macaron-pink/20 text-center hover:shadow-md transition-shadow">
                    <div className="text-3xl mb-2">☕</div>
                    <p className="text-gray-700 font-semibold">
                      {Math.floor(taxInfo.savings / 38)} 星巴克大杯拿铁
                    </p>
                  </div>
                )}
                {taxInfo.savings >= 1200 && (
                  <div className="bg-white rounded-xl p-4 border-2 border-macaron-pink/20 text-center hover:shadow-md transition-shadow">
                    <div className="text-3xl mb-2">🍲</div>
                    <p className="text-gray-700 font-semibold">
                      {Math.floor(taxInfo.savings / 400)} 海底捞四人餐
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* 什么是个人养老金 */}
        <Card className="border-2 border-macaron-blue/30 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-macaron-blue to-macaron-green p-4">
            <h2 className="text-2xl font-bold text-white text-center font-cute flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6" />
              什么是个人养老金？
            </h2>
          </div>

          <div className="p-6 md:p-8">
            {/* 专业解释 */}
            <div className="bg-macaron-cream rounded-2xl p-4 mb-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                <span className="font-bold text-macaron-blue">📚 专业话术：</span>
                个人养老金是国家推出的第三支柱养老保险，每年最多可存入12,000元，存入的钱可以抵扣个税。
              </p>
              <p className="text-gray-700 leading-relaxed">
                <span className="font-bold text-macaron-pink">💄 生活化语义平移：</span>
                想象一下，你现在的工资要交一部分"管理费"给国家（个税）。但如果把钱存入个人养老金账户，这笔"管理费"就可以暂时不交，等退休后再交（而且只要3%！）。
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">
                就像商家打折活动：现在不用交税（相当于100%折扣），退休取钱时才交3%的超低"税价"。
              </p>
            </div>

            {/* 核心要点 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-macaron-pink/20 rounded-xl p-4 text-center">
                <div className="text-4xl mb-2">💰</div>
                <p className="text-sm text-gray-600 mb-1">每年最高</p>
                <p className="text-2xl font-bold text-macaron-pink font-cute">
                  12,000元
                </p>
              </div>
              <div className="bg-macaron-purple/20 rounded-xl p-4 text-center">
                <div className="text-4xl mb-2">📉</div>
                <p className="text-sm text-gray-600 mb-1">取出时仅需</p>
                <p className="text-2xl font-bold text-macaron-purple font-cute">
                  3% 税率
                </p>
              </div>
              <div className="bg-macaron-blue/20 rounded-xl p-4 text-center">
                <div className="text-4xl mb-2">🎯</div>
                <p className="text-sm text-gray-600 mb-1">抵扣个税</p>
                <p className="text-2xl font-bold text-macaron-blue font-cute">
                  当年省税
                </p>
              </div>
            </div>

            {/* 总结 */}
            <div className="bg-gradient-to-r from-macaron-pink/20 to-macaron-purple/20 rounded-xl p-4 text-center">
              <p className="text-gray-700 italic">
                "把本来要上交的'管理费'存进自己的未来账户"
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PersonalPensionCalculator;
