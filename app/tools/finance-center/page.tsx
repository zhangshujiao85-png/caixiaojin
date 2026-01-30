"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { MoneyTree, PiggyBankGirl } from "@/components/illustrations";
import { ExpenseLedgerTab } from "@/components/finance-center/ExpenseLedgerTab";
import { SavingExperimentTab } from "@/components/finance-center/SavingExperimentTab";
import { InvestmentSimulationTab } from "@/components/finance-center/InvestmentSimulationTab";

export default function FinanceCenterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-macaron-pink/20 via-macaron-cream to-macaron-green/20">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-5xl">
        {/* 返回按钮 */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-macaron-pink hover:text-macaron-purple transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-cute font-medium">返回首页</span>
        </Link>

        {/* 标题区域 */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="animate-bounce" style={{ animationDuration: "3s" }}>
              <MoneyTree size={80} />
            </div>
            <div className="animate-bounce" style={{ animationDuration: "3s", animationDelay: "0.5s" }}>
              <PiggyBankGirl size={80} />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 font-cute">
            钱钱小管家 💰
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            财务管理中心 - 温暖支持，轻松理财 ✨
          </p>
        </div>

        {/* 主内容 - 标签页 */}
        <Card className="border-2 border-macaron-pink/30 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardContent className="p-6">
            <Tabs defaultValue="ledger" className="w-full">
              {/* 标签页导航 */}
              <TabsList className="grid w-full grid-cols-3 bg-macaron-cream/50 border-2 border-macaron-pink/20">
                <TabsTrigger
                  value="ledger"
                  className="data-[state=active]:bg-macaron-pink data-[state=active]:text-white font-cute"
                >
                  📒 我的账本
                </TabsTrigger>
                <TabsTrigger
                  value="saving"
                  className="data-[state=active]:bg-macaron-pink data-[state=active]:text-white font-cute"
                >
                  🔬 省钱实验
                </TabsTrigger>
                <TabsTrigger
                  value="investment"
                  className="data-[state=active]:bg-macaron-pink data-[state=active]:text-white font-cute"
                >
                  🌳 钱生钱模拟器
                </TabsTrigger>
              </TabsList>

              {/* 标签页内容 */}
              <TabsContent value="ledger" className="mt-6">
                <ExpenseLedgerTab />
              </TabsContent>

              <TabsContent value="saving" className="mt-6">
                <SavingExperimentTab />
              </TabsContent>

              <TabsContent value="investment" className="mt-6">
                <InvestmentSimulationTab />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* 底部提示 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            💕 温馨提示：所有数据都会自动保存，下次访问时继续你的理财之旅~
          </p>
        </div>
      </div>
    </div>
  );
}
