"use client";

import { useState } from "react";
import { X, Sparkles, Calendar, TrendingUp, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InvestmentAnxietyModal } from "./AnxietyReliefModal";
import { FinancialAnxietyModal } from "./FinancialAnxietyModal";
import { EmotionalLedgerModal } from "./EmotionalLedgerModal";

interface AnxietyReliefWrapperProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type AnxietyType = 'investment' | 'financial' | 'ledger' | null;

export function AnxietyReliefWrapper({ open, onOpenChange }: AnxietyReliefWrapperProps) {
  const [selectedType, setSelectedType] = useState<AnxietyType>(null);

  const handleTypeSelect = (type: AnxietyType) => {
    setSelectedType(type);
  };

  const handleClose = () => {
    setSelectedType(null);
    onOpenChange(false);
  };

  return (
    <>
      {/* 主选择弹窗 */}
      {open && selectedType === null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 标题色块 */}
            <div className="p-6 bg-gradient-to-r from-macaron-pink to-macaron-purple">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-6 h-6 text-white" />
                    <h2 className="text-2xl font-bold text-white font-cute">
                      心理补丸 💊
                    </h2>
                  </div>
                  <p className="text-white/90 text-sm">
                    把焦虑变成知识，把恐惧变成行动 💫
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 内容区域 */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-4">
            <p className="text-center text-gray-700 mb-6">
              选择一种补丸，我们来帮你化解焦虑 👇
            </p>

            <div className="grid grid-cols-1 gap-4">
              {/* 投资焦虑 */}
              <Card
                className="cursor-pointer border-2 border-macaron-purple/30 hover:border-macaron-purple/60 hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:scale-105"
                onClick={() => handleTypeSelect('investment')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-macaron-purple to-macaron-pink flex items-center justify-center text-3xl shadow-lg">
                      📉
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg mb-1">
                        投资焦虑补丸
                      </h3>
                      <p className="text-sm text-gray-600">
                        市场跌了怎么办？心态崩了怎么调整？
                      </p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs bg-macaron-purple/20 text-macaron-purple px-2 py-1 rounded-full">
                          市场波动
                        </span>
                        <span className="text-xs bg-macaron-purple/20 text-macaron-purple px-2 py-1 rounded-full">
                          心理按摩
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 财务焦虑 */}
              <Card
                className="cursor-pointer border-2 border-macaron-green/30 hover:border-macaron-green/60 hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:scale-105"
                onClick={() => handleTypeSelect('financial')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-macaron-green to-macaron-blue flex items-center justify-center text-3xl shadow-lg">
                      💰
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg mb-1">
                        财务焦虑补丸
                      </h3>
                      <p className="text-sm text-gray-600">
                        月光、存不下钱、攀比焦虑怎么办？
                      </p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs bg-macaron-green/20 text-macaron-green px-2 py-1 rounded-full">
                          行动指南
                        </span>
                        <span className="text-xs bg-macaron-green/20 text-macaron-green px-2 py-1 rounded-full">
                          温暖陪伴
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 情绪笔记本 */}
              <Card
                className="cursor-pointer border-2 border-macaron-blue/30 hover:border-macaron-blue/60 hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:scale-105"
                onClick={() => handleTypeSelect('ledger')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-macaron-blue to-macaron-purple flex items-center justify-center text-3xl shadow-lg">
                      📔
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg mb-1">
                        情绪笔记本
                      </h3>
                      <p className="text-sm text-gray-600">
                        你的专属小树洞 🌳 安静地收藏每一个情绪瞬间
                      </p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs bg-macaron-blue/20 text-macaron-blue px-2 py-1 rounded-full">
                          秘密花园
                        </span>
                        <span className="text-xs bg-macaron-blue/20 text-macaron-blue px-2 py-1 rounded-full">
                          温暖陪伴
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 p-4 bg-macaron-cream/50 rounded-xl border-2 border-macaron-yellow/30">
              <p className="text-xs text-gray-600 text-center">
                💡 小贴士：焦虑是正常的情绪，重要的是我们如何面对它。选择一种补丸，开始你的心灵治愈之旅吧！
              </p>
            </div>
          </div>
            </div>
          </div>
        </div>
      )}

      {/* 投资焦虑弹窗 */}
      <InvestmentAnxietyModal
        open={open && selectedType === 'investment'}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedType(null);
            onOpenChange(false);
          }
        }}
      />

      {/* 财务焦虑弹窗 */}
      <FinancialAnxietyModal
        open={open && selectedType === 'financial'}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedType(null);
            onOpenChange(false);
          }
        }}
      />

      {/* 情绪账本弹窗 */}
      <EmotionalLedgerModal
        open={open && selectedType === 'ledger'}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedType(null);
            onOpenChange(false);
          }
        }}
      />
    </>
  );
}
