"use client";

import { useState } from "react";
import { X, Plus, Trash2, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useExpenseTrackerStore } from "@/store/useExpenseTrackerStore";
import { cn } from "@/lib/utils";

interface ExpenseTrackerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const defaultCategories = [
  { id: 'food', name: '餐饮美食', emoji: '🍜', color: 'from-macaron-pink/20 to-macaron-pink/30' },
  { id: 'shopping', name: '购物消费', emoji: '🛍️', color: 'from-macaron-purple/20 to-macaron-purple/30' },
  { id: 'transport', name: '交通出行', emoji: '🚗', color: 'from-macaron-blue/20 to-macaron-blue/30' },
  { id: 'entertainment', name: '娱乐休闲', emoji: '🎮', color: 'from-macaron-green/20 to-macaron-green/30' },
  { id: 'beauty', name: '美妆护肤', emoji: '💄', color: 'from-macaron-orange/20 to-macaron-orange/30' },
  { id: 'study', name: '学习提升', emoji: '📚', color: 'from-macaron-yellow/20 to-macaron-yellow/30' },
  { id: 'social', name: '社交聚会', emoji: '👥', color: 'from-macaron-peach/20 to-macaron-peach/30' },
  { id: 'other', name: '其他支出', emoji: '💰', color: 'from-gray-200/20 to-gray-300/30' },
];

export function ExpenseTrackerModal({ open, onOpenChange }: ExpenseTrackerModalProps) {
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(defaultCategories[0]);
  const [note, setNote] = useState("");
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState("");

  const { entries, addEntry, deleteEntry, customCategories, addCustomCategory, getTotalAmount } = useExpenseTrackerStore();

  const allCategories = [...defaultCategories, ...customCategories.map(cat => ({
    id: cat,
    name: cat,
    emoji: '✨',
    color: 'from-macaron-pink/10 to-macaron-purple/10'
  }))];

  const handleAddExpense = () => {
    if (!amount || !selectedCategory) {
      alert("请填写金额和选择分类哦~");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert("请输入有效的金额");
      return;
    }

    addEntry({
      amount: numAmount,
      category: selectedCategory.name,
      note: note || undefined,
    });

    // 重置表单
    setAmount("");
    setSelectedCategory(defaultCategories[0]);
    setNote("");

    alert("✅ 记账成功！每一笔都值得被记录~");
  };

  const handleAddCustomCategory = () => {
    if (!customCategoryName.trim()) {
      alert("请输入分类名称");
      return;
    }

    if (allCategories.some(cat => cat.name === customCategoryName)) {
      alert("这个分类已经存在啦~");
      return;
    }

    addCustomCategory(customCategoryName);
    setCustomCategoryName("");
    setShowCustomCategory(false);

    // 选中新创建的分类
    const newCategory = {
      id: customCategoryName,
      name: customCategoryName,
      emoji: '✨',
      color: 'from-macaron-pink/10 to-macaron-purple/10'
    };
    setSelectedCategory(newCategory);
  };

  const totalAmount = getTotalAmount();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-macaron-purple/10 via-macaron-cream to-macaron-pink/10">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingDown className="w-6 h-6 text-macaron-pink" />
              <h2 className="text-2xl font-bold text-gray-800 font-cute">
                钱钱记账本 💸
              </h2>
            </div>
            <p className="text-sm text-gray-600 text-center">
              记住每一笔支出，看见钱去了哪里 ✨
            </p>
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* 总金额卡片 */}
          <Card className="border-2 border-macaron-pink/30 bg-gradient-to-br from-macaron-pink/20 to-macaron-purple/20">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-gray-600 mb-2">本月已支出</p>
              <p className="text-4xl font-bold text-macaron-pink mb-2">
                ¥{totalAmount.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                共 {entries.length} 笔记录
              </p>
            </CardContent>
          </Card>

          {/* 记账表单 */}
          <Card className="border-2 border-macaron-purple/30 bg-white/80">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-gray-800 text-lg mb-4">📝 记一笔</h3>

              {/* 金额输入 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  支出了多少钱 💰
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
                    ¥
                  </span>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="pl-8 text-lg h-12"
                  />
                </div>
              </div>

              {/* 分类选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  花在哪里了 🏷️
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {allCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        "p-3 rounded-xl border-2 transition-all text-center hover:scale-105",
                        selectedCategory.id === category.id
                          ? "border-macaron-pink bg-macaron-pink/20 shadow-md"
                          : "border-gray-200 hover:border-macaron-pink/50 hover:bg-macaron-pink/10"
                      )}
                    >
                      <div className="text-2xl mb-1">{category.emoji}</div>
                      <div className="text-xs text-gray-700">{category.name}</div>
                    </button>
                  ))}
                  <button
                    onClick={() => setShowCustomCategory(!showCustomCategory)}
                    className={cn(
                      "p-3 rounded-xl border-2 transition-all text-center hover:scale-105",
                      "border-dashed border-macaron-purple/50 hover:border-macaron-purple hover:bg-macaron-purple/10"
                    )}
                  >
                    <div className="text-2xl mb-1">➕</div>
                    <div className="text-xs text-macaron-purple">自定义</div>
                  </button>
                </div>

                {/* 自定义分类输入 */}
                {showCustomCategory && (
                  <div className="mt-2 p-3 bg-macaron-purple/10 rounded-xl border-2 border-macaron-purple/20">
                    <div className="flex gap-2">
                      <Input
                        value={customCategoryName}
                        onChange={(e) => setCustomCategoryName(e.target.value)}
                        placeholder="输入新分类名称..."
                        className="flex-1"
                      />
                      <Button
                        onClick={handleAddCustomCategory}
                        size="sm"
                        className="bg-macaron-purple hover:bg-macaron-purple/90 text-white"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* 备注输入 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  备注 📝
                </label>
                <Input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="比如：奶茶、午餐..."
                  className="w-full"
                />
              </div>

              {/* 提交按钮 */}
              <Button
                onClick={handleAddExpense}
                className="w-full bg-gradient-to-r from-macaron-pink to-macaron-purple hover:from-macaron-pink/90 hover:to-macaron-purple/90 text-white font-cute font-bold"
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                记一笔
              </Button>
            </CardContent>
          </Card>

          {/* 记账历史 */}
          {entries.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-gray-800 text-lg">📋 记账历史</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {entries.slice(0, 20).map((entry) => (
                  <Card
                    key={entry.id}
                    className="border border-gray-200 bg-white/60 hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-macaron-pink/20 to-macaron-purple/20 flex items-center justify-center">
                            <span className="text-lg">
                              {allCategories.find(c => c.name === entry.category)?.emoji || '💰'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{entry.category}</p>
                            <p className="text-xs text-gray-500">
                              {entry.note || '无备注'}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(entry.date).toLocaleDateString('zh-CN')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg text-macaron-pink">
                            -¥{entry.amount.toLocaleString()}
                          </span>
                          <button
                            onClick={() => {
                              if (confirm("确定要删除这条记录吗？")) {
                                deleteEntry(entry.id);
                              }
                            }}
                            className="p-1 text-gray-400 hover:text-macaron-pink transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {entries.length === 0 && (
            <Card className="border-2 border-dashed border-gray-300 bg-white/50">
              <CardContent className="py-8 text-center">
                <TrendingDown className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">还没有记账记录哦</p>
                <p className="text-gray-400 text-xs">开始记录你的每一笔支出吧~</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
