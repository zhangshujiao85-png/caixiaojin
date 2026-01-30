"use client";

import { X, Wallet, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ExpenseLedgerTab } from "@/components/finance-center/ExpenseLedgerTab";
import { SavingExperimentTab } from "@/components/finance-center/SavingExperimentTab";
import { InvestmentSimulationTab } from "@/components/finance-center/InvestmentSimulationTab";

interface FinanceCenterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FinanceCenterModal({ open, onOpenChange }: FinanceCenterModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题 */}
        <div className="p-6 bg-gradient-to-r from-macaron-green to-macaron-blue">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white font-cute mb-1">
                💰 钱钱小管家
              </h2>
              <p className="text-white/90 text-sm">财务管理中心 - 温暖支持，轻松理财 ✨</p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 主内容 - 标签页 */}
        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="ledger" className="w-full">
            {/* 标签页导航 */}
            <div className="px-6 pt-6">
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
            </div>

            {/* 标签页内容 */}
            <div className="p-6">
              <TabsContent value="ledger">
                <ExpenseLedgerTab />
              </TabsContent>

              <TabsContent value="saving">
                <SavingExperimentTab />
              </TabsContent>

              <TabsContent value="investment">
                <InvestmentSimulationTab />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
