"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Coffee, ShoppingBag, Car, Utensils, Gamepad2, Sparkles, ArrowRight, Edit2, Check, Plus, Trash2, Star } from "lucide-react";
import { useFinanceCenterStore, CustomSavingItem } from "@/store/useFinanceCenterStore";
import { CoinStack } from "@/components/illustrations";

interface SavingItem {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  price: number;
  unit: string;
  frequencyLabel: string;
  multiplier: number;
}

const defaultSavingItems: SavingItem[] = [
  {
    id: "milktea",
    name: "奶茶探索",
    icon: Coffee,
    description: "每次喝奶茶的花费...",
    price: 17,
    unit: "杯",
    frequencyLabel: "每月次数",
    multiplier: 1,
  },
  {
    id: "takeout",
    name: "外卖探索",
    icon: Utensils,
    description: "每次点外卖的花费...",
    price: 20,
    unit: "顿",
    frequencyLabel: "每月次数",
    multiplier: 1,
  },
  {
    id: "shopping",
    name: "购物探索",
    icon: ShoppingBag,
    description: "每月冲动消费的金额...",
    price: 100,
    unit: "次",
    frequencyLabel: "每月次数",
    multiplier: 1,
  },
  {
    id: "taxi",
    name: "出行探索",
    icon: Car,
    description: "每次打车的花费...",
    price: 26,
    unit: "次",
    frequencyLabel: "每月次数",
    multiplier: 1,
  },
  {
    id: "game",
    name: "游戏探索",
    icon: Gamepad2,
    description: "每月游戏充值的金额...",
    price: 70,
    unit: "月",
    frequencyLabel: "每月次数",
    multiplier: 1,
  },
];

export function SavingExperimentTab() {
  const {
    savingExperiments,
    savingItemSettings,
    customSavingItems,
    updateSavingExperiment,
    updateSavingItemSettings,
    getSavingItemSettings,
    getTotalMonthlySavings,
    syncSavingsToInvestment,
    addCustomSavingItem,
    deleteCustomSavingItem,
    updateCustomSavingItem,
  } = useFinanceCenterStore();

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [tempSettings, setTempSettings] = useState<{ price: number; multiplier: number }>({
    price: 0,
    multiplier: 0,
  });
  const [newCustomItem, setNewCustomItem] = useState({
    name: "",
    price: 50,
    unit: "次",
    frequencyMultiplier: 1,
  });

  const handleItemChange = (id: string, frequency: number) => {
    updateSavingExperiment(id, frequency);
  };

  const getItemSettings = (itemId: string) => {
    const customSettings = getSavingItemSettings(itemId);
    const defaultItem = defaultSavingItems.find((i) => i.id === itemId);
    return {
      price: customSettings?.price ?? defaultItem?.price ?? 0,
      multiplier: customSettings?.frequencyMultiplier ?? defaultItem?.multiplier ?? 1,
    };
  };

  const startEditing = (itemId: string) => {
    const settings = getItemSettings(itemId);
    setTempSettings({
      price: settings.price,
      multiplier: settings.multiplier,
    });
    setEditingItemId(itemId);
  };

  const saveSettings = (itemId: string) => {
    updateSavingItemSettings({
      itemId,
      price: tempSettings.price,
      frequencyMultiplier: tempSettings.multiplier,
    });
    setEditingItemId(null);
  };

  const cancelEditing = () => {
    setEditingItemId(null);
  };

  const getFrequencyLabel = (multiplier: number) => {
    return "每月次数";
  };

  const calculateSavings = () => {
    let daily = 0;
    let monthly = 0;
    let yearly = 0;

    savingExperiments.forEach((exp) => {
      const customSettings = savingItemSettings.find((s) => s.itemId === exp.itemId);
      const defaultItem = defaultSavingItems.find((i) => i.id === exp.itemId);
      const customItem = customSavingItems.find((i) => i.id === exp.itemId);

      if (customItem && exp.frequency > 0) {
        monthly += customItem.price * exp.frequency * customItem.frequencyMultiplier;
      } else if (defaultItem || customSettings) {
        const multiplier = customSettings?.frequencyMultiplier ?? defaultItem?.multiplier ?? 1;
        const price = customSettings?.price ?? defaultItem?.price ?? 0;
        monthly += price * exp.frequency * multiplier;
      }
    });

    daily = monthly / 30;
    yearly = monthly * 12;

    return { daily, monthly, yearly };
  };

  const savings = calculateSavings();
  const hasSelection = savingExperiments.some((e) => e.frequency > 0);

  const handleSyncToInvestment = () => {
    syncSavingsToInvestment();
    alert("✅ 已同步！现在去「钱生钱模拟器」看看吧~ 🌟");
  };

  const handleAddCustomItem = () => {
    if (!newCustomItem.name.trim()) {
      alert("请输入项目名称");
      return;
    }
    addCustomSavingItem(newCustomItem);
    setNewCustomItem({
      name: "",
      price: 50,
      unit: "次",
      frequencyMultiplier: 1,
    });
    setShowAddCustom(false);
  };

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 font-cute mb-2">🔬 省钱实验</h2>
        <p className="text-sm text-gray-600">
          探索不同的消费选择，看看省下的钱可以做些什么 ✨
        </p>
      </div>

      {/* 温馨提示 */}
      <Card className="border-2 border-macaron-purple/20 bg-macaron-purple/10">
        <CardContent className="p-4">
          <p className="text-sm text-gray-700 text-center">
            💡 <span className="font-semibold">温馨小提示</span>：这不是关于限制，而是关于选择
          </p>
        </CardContent>
      </Card>

      {/* 节省项目列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 默认项目 */}
        {defaultSavingItems.map((item) => {
          const Icon = item.icon;
          const frequency = savingExperiments.find((e) => e.itemId === item.id)?.frequency || 0;
          const settings = getItemSettings(item.id);
          const isEditing = editingItemId === item.id;

          return (
            <Card
              key={item.id}
              className="border-2 border-macaron-green/30 hover:border-macaron-green/60 transition-all duration-300 bg-white/80 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-macaron-green/30 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-gray-700" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg text-gray-800 font-cute">
                        {item.name}
                      </h3>
                      <button
                        onClick={() => isEditing ? saveSettings(item.id) : startEditing(item.id)}
                        className="p-1 text-macaron-purple hover:text-macaron-pink transition-colors"
                        title={isEditing ? "保存设置" : "自定义设置"}
                      >
                        {isEditing ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                      </button>
                    </div>

                    {isEditing ? (
                      <div className="space-y-2 p-3 bg-macaron-purple/10 rounded-xl border-2 border-macaron-purple/20">
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-600 whitespace-nowrap">价格:</label>
                          <Input
                            type="number"
                            value={tempSettings.price}
                            onChange={(e) => setTempSettings({ ...tempSettings, price: Number(e.target.value) })}
                            className="flex-1 h-8 text-sm"
                            min="0"
                          />
                          <span className="text-xs text-gray-500">元/{item.unit}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-600 whitespace-nowrap">月倍数:</label>
                          <Input
                            type="number"
                            value={tempSettings.multiplier}
                            onChange={(e) => setTempSettings({ ...tempSettings, multiplier: Number(e.target.value) })}
                            className="flex-1 h-8 text-sm"
                            min="1"
                            max="365"
                          />
                          <span className="text-xs text-gray-500">×/月</span>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => saveSettings(item.id)}
                            className="flex-1 px-3 py-1 bg-macaron-green text-white text-xs rounded-lg hover:bg-macaron-green/90"
                          >
                            保存
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="flex-1 px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-lg hover:bg-gray-300"
                          >
                            取消
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* 数量选择器 */}
                <div className="flex items-center justify-between bg-macaron-cream rounded-xl p-3">
                  <span className="text-sm text-gray-600">{getFrequencyLabel(settings.multiplier)}：</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleItemChange(item.id, Math.max(0, frequency - 1))}
                      className="w-8 h-8 rounded-full bg-macaron-pink hover:bg-macaron-pink/80 text-white font-bold text-lg transition-colors flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-bold text-lg text-gray-800 font-cute">
                      {frequency}
                    </span>
                    <button
                      onClick={() => handleItemChange(item.id, Math.min(50, frequency + 1))}
                      className="w-8 h-8 rounded-full bg-macaron-green hover:bg-macaron-green/80 text-white font-bold text-lg transition-colors flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* 单项节省提示 */}
                {frequency > 0 && !isEditing && (
                  <div className="mt-3 p-2 bg-macaron-green/10 rounded-lg">
                    <p className="text-xs text-macaron-green text-center">
                      每月可省 ¥{(settings.price * frequency * settings.multiplier).toFixed(0)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {/* 自定义项目 */}
        {customSavingItems.map((item) => {
          const frequency = savingExperiments.find((e) => e.itemId === item.id)?.frequency || 0;
          const isEditing = editingItemId === item.id;

          return (
            <Card
              key={item.id}
              className="border-2 border-macaron-yellow/30 hover:border-macaron-yellow/60 transition-all duration-300 bg-white/80 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-macaron-yellow/30 flex items-center justify-center flex-shrink-0">
                    <Star className="w-6 h-6 text-macaron-yellow" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg text-gray-800 font-cute flex items-center gap-1">
                        {item.name}
                        <span className="text-xs text-macaron-purple">自定义</span>
                      </h3>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingItemId(isEditing ? null : item.id)}
                          className="p-1 text-macaron-purple hover:text-macaron-pink transition-colors"
                        >
                          {isEditing ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("确定要删除这个自定义项目吗？")) {
                              deleteCustomSavingItem(item.id);
                            }
                          }}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="space-y-2 p-3 bg-macaron-yellow/10 rounded-xl border-2 border-macaron-yellow/20">
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-600 whitespace-nowrap">名称:</label>
                          <Input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateCustomSavingItem(item.id, { name: e.target.value })}
                            className="flex-1 h-8 text-sm"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-600 whitespace-nowrap">价格:</label>
                          <Input
                            type="number"
                            value={item.price}
                            onChange={(e) => updateCustomSavingItem(item.id, { price: Number(e.target.value) })}
                            className="flex-1 h-8 text-sm"
                            min="0"
                          />
                          <span className="text-xs text-gray-500">元/{item.unit}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-600 whitespace-nowrap">月倍数:</label>
                          <Input
                            type="number"
                            value={item.frequencyMultiplier}
                            onChange={(e) => updateCustomSavingItem(item.id, { frequencyMultiplier: Number(e.target.value) })}
                            className="flex-1 h-8 text-sm"
                            min="1"
                            max="365"
                          />
                          <span className="text-xs text-gray-500">×/月</span>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => setEditingItemId(null)}
                            className="flex-1 px-3 py-1 bg-macaron-yellow text-white text-xs rounded-lg hover:bg-macaron-yellow/90"
                          >
                            完成
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* 数量选择器 */}
                <div className="flex items-center justify-between bg-macaron-cream rounded-xl p-3">
                  <span className="text-sm text-gray-600">{getFrequencyLabel(item.frequencyMultiplier)}：</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleItemChange(item.id, Math.max(0, frequency - 1))}
                      className="w-8 h-8 rounded-full bg-macaron-pink hover:bg-macaron-pink/80 text-white font-bold text-lg transition-colors flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-bold text-lg text-gray-800 font-cute">
                      {frequency}
                    </span>
                    <button
                      onClick={() => handleItemChange(item.id, Math.min(50, frequency + 1))}
                      className="w-8 h-8 rounded-full bg-macaron-green hover:bg-macaron-green/80 text-white font-bold text-lg transition-colors flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* 单项节省提示 */}
                {frequency > 0 && !isEditing && (
                  <div className="mt-3 p-2 bg-macaron-green/10 rounded-lg">
                    <p className="text-xs text-macaron-green text-center">
                      每月可省 ¥{(item.price * frequency * item.frequencyMultiplier).toFixed(0)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {/* 添加自定义项目按钮 */}
        {!showAddCustom && (
          <Card
            onClick={() => setShowAddCustom(true)}
            className="border-2 border-dashed border-macaron-purple/40 hover:border-macaron-purple/60 transition-all duration-300 bg-macaron-purple/10 cursor-pointer hover:bg-macaron-purple/20"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-3 text-macaron-purple">
                <Plus className="w-6 h-6" />
                <span className="font-cute font-bold text-lg">添加自定义项目</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 添加自定义项目表单 */}
        {showAddCustom && (
          <Card className="border-2 border-macaron-purple/30 bg-white/80">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-macaron-purple" />
                <h3 className="font-bold text-gray-800 font-cute">创建自定义省钱项目</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">项目名称</label>
                  <Input
                    type="text"
                    value={newCustomItem.name}
                    onChange={(e) => setNewCustomItem({ ...newCustomItem, name: e.target.value })}
                    placeholder="例如：咖啡、零食..."
                    className="w-full"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">价格</label>
                    <Input
                      type="number"
                      value={newCustomItem.price}
                      onChange={(e) => setNewCustomItem({ ...newCustomItem, price: Number(e.target.value) })}
                      min="0"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">单位</label>
                    <Input
                      type="text"
                      value={newCustomItem.unit}
                      onChange={(e) => setNewCustomItem({ ...newCustomItem, unit: e.target.value })}
                      placeholder="次/杯/份"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">月倍数</label>
                    <Input
                      type="number"
                      value={newCustomItem.frequencyMultiplier}
                      onChange={(e) => setNewCustomItem({ ...newCustomItem, frequencyMultiplier: Number(e.target.value) })}
                      min="1"
                      max="365"
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleAddCustomItem}
                    className="flex-1 px-4 py-2 bg-macaron-purple text-white font-cute rounded-lg hover:bg-macaron-purple/90"
                  >
                    <Plus className="w-4 h-4 inline mr-1" />
                    添加项目
                  </button>
                  <button
                    onClick={() => {
                      setShowAddCustom(false);
                      setNewCustomItem({
                        name: "",
                        price: 50,
                        unit: "次",
                        frequencyMultiplier: 1,
                      });
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300"
                  >
                    取消
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 计算结果 */}
      {hasSelection && (
        <Card className="border-2 border-macaron-pink/40 bg-gradient-to-br from-macaron-pink/10 to-macaron-yellow/10 overflow-hidden relative">
          {/* 装饰插画 */}
          <div className="absolute top-4 right-4 opacity-20">
            <CoinStack size={60} />
          </div>

          <CardContent className="p-8 relative">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-white/80 rounded-full px-6 py-2 mb-4">
                <Sparkles className="w-5 h-5 text-macaron-pink" />
                <span className="font-cute font-bold text-gray-800">
                  省下的钱可以做些什么？
                </span>
                <Sparkles className="w-5 h-5 text-macaron-pink" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* 每天节省 */}
              <div className="bg-white/80 rounded-2xl p-6 text-center backdrop-blur-sm">
                <p className="text-sm text-gray-600 mb-2">每天节省</p>
                <p className="text-3xl font-bold text-macaron-green font-cute">
                  ¥{savings.daily.toFixed(0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  ≈ {Math.floor(savings.daily / 20)} 杯奶茶
                </p>
              </div>

              {/* 每月节省 */}
              <div className="bg-white/80 rounded-2xl p-6 text-center backdrop-blur-sm">
                <p className="text-sm text-gray-600 mb-2">每月节省</p>
                <p className="text-3xl font-bold text-macaron-blue font-cute">
                  ¥{savings.monthly.toFixed(0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  ≈ {Math.floor(savings.monthly / 500)} 件衣服
                </p>
              </div>

              {/* 每年节省 */}
              <div className="bg-white/80 rounded-2xl p-6 text-center backdrop-blur-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-macaron-pink/20 to-macaron-yellow/20" />
                <div className="relative">
                  <p className="text-sm text-gray-600 mb-2">💎 每年节省</p>
                  <p className="text-4xl font-bold text-macaron-pink font-cute">
                    ¥{savings.yearly.toFixed(0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    可以买 {Math.floor(savings.yearly / 3000)} 个名牌包！
                  </p>
                </div>
              </div>
            </div>

            {/* 同步到投资模拟按钮 */}
            <div className="text-center">
              <button
                onClick={handleSyncToInvestment}
                className="px-8 py-3 bg-gradient-to-r from-macaron-pink to-macaron-purple hover:from-macaron-pink/90 hover:to-macaron-purple/90 text-white font-cute font-bold rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
              >
                <span>看看这笔钱如何生钱</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* 激励语 */}
            <div className="mt-6 text-center">
              <p className="text-gray-700 font-medium">
                {savings.yearly > 10000
                  ? "🎉 太棒了！你简直是省钱小能手，一年能省这么多！"
                  : savings.yearly > 5000
                  ? "💪 不错哦！坚持下去，财富自由不是梦！"
                  : "🌱 小小的改变，大大的收获，继续加油！"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {!hasSelection && (
        <Card className="border-2 border-dashed border-gray-300 bg-white/50">
          <CardContent className="py-12 text-center">
            <Coffee className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              选择你想探索的消费项目，算算能省下多少钱~
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
