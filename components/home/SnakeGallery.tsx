'use client';

import React, { useState } from 'react';
import { X, Search, Filter } from 'lucide-react';
import { SNAKE_VARIANTS, getRarityColor, getRarityStars, getCurrentFestivalSnake, SnakeVariant } from '@/constants/snakeVariants';
import { Snake } from '@/store/useSnakeProgress';

interface SnakeGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedVariants: string[];
  snakeCollection: Snake[];
  onSelectVariant?: (variantId: string) => void;
  mode?: 'view' | 'select';
}

type FilterType = 'all' | 'daily' | 'festival' | 'unlocked';
type RarityFilter = 'all' | 'common' | 'rare' | 'epic' | 'legendary';

export const SnakeGallery: React.FC<SnakeGalleryProps> = ({
  isOpen,
  onClose,
  unlockedVariants,
  snakeCollection,
  onSelectVariant,
  mode = 'view',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>('all');

  if (!isOpen) return null;

  const collectedVariantIds = new Set(snakeCollection.map(s => s.variant));
  const currentFestival = getCurrentFestivalSnake();

  const filteredVariants = SNAKE_VARIANTS.filter((variant) => {
    // Search filter
    if (searchQuery && !variant.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Type filter
    if (filterType === 'daily' && variant.theme !== 'daily') return false;
    if (filterType === 'festival' && variant.theme !== 'festival') return false;
    if (filterType === 'unlocked' && !collectedVariantIds.has(variant.id)) return false;

    // Rarity filter
    if (rarityFilter !== 'all' && variant.rarity !== rarityFilter) return false;

    return true;
  });

  const isUnlocked = (variantId: string): boolean => {
    return collectedVariantIds.has(variantId);
  };

  const getRarityLabel = (rarity: SnakeVariant['rarity']) => {
    const labels = {
      common: '普通',
      rare: '稀有',
      epic: '史诗',
      legendary: '传说',
    };
    return labels[rarity];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slideUp flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-macaron-pink to-macaron-purple p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span>📖</span>
              {mode === 'select' ? '选择新蛇蛇' : '所有蛇蛇图鉴'}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐍</span>
              <span>已收集: {snakeCollection.length}/{SNAKE_VARIANTS.length}</span>
            </div>
            {currentFestival && (
              <div className="flex items-center gap-2 animate-pulse">
                <span className="text-2xl">🎉</span>
                <span>当前节日: {currentFestival.festival}</span>
              </div>
            )}
          </div>
        </div>

        {/* Search and filters */}
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex gap-3 mb-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索蛇蛇..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-macaron-pink"
              />
            </div>
          </div>

          {/* Type filters */}
          <div className="flex gap-2 flex-wrap mb-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-macaron-pink text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setFilterType('daily')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filterType === 'daily'
                  ? 'bg-macaron-pink text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              日常款
            </button>
            <button
              onClick={() => setFilterType('festival')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filterType === 'festival'
                  ? 'bg-macaron-pink text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              节日限定
            </button>
            <button
              onClick={() => setFilterType('unlocked')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filterType === 'unlocked'
                  ? 'bg-macaron-pink text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              已解锁
            </button>
          </div>

          {/* Rarity filters */}
          <div className="flex gap-2 flex-wrap">
            {(['all', 'common', 'rare', 'epic', 'legendary'] as RarityFilter[]).map((rarity) => (
              <button
                key={rarity}
                onClick={() => setRarityFilter(rarity)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  rarityFilter === rarity
                    ? 'bg-gray-800 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {rarity === 'all' ? '全部稀有度' : getRarityLabel(rarity)}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredVariants.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">没有找到匹配的蛇蛇～</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredVariants.map((variant) => {
                const unlocked = isUnlocked(variant.id);
                const stars = getRarityStars(variant.rarity);
                const rarityColor = getRarityColor(variant.rarity);

                return (
                  <div
                    key={variant.id}
                    className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
                      unlocked
                        ? 'bg-white shadow-md hover:shadow-xl cursor-pointer hover:scale-105'
                        : 'bg-gray-100 grayscale opacity-60'
                    } ${mode === 'select' && unlocked ? 'cursor-pointer' : ''}`}
                    onClick={() => {
                      if (mode === 'select' && unlocked && onSelectVariant) {
                        onSelectVariant(variant.id);
                      }
                    }}
                    style={{
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      borderColor: unlocked ? rarityColor : '#e5e7eb',
                    }}
                  >
                    {/* Header */}
                    <div className="relative h-28 bg-gradient-to-br from-macaron-cream/50 to-macaron-pink/20 flex items-center justify-center">
                      {unlocked ? (
                        <span className="text-5xl">{variant.emoji.split('')[0]}</span>
                      ) : (
                        <div className="text-center">
                          <span className="text-5xl opacity-30">❓</span>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-3xl opacity-20">🐍</span>
                          </div>
                        </div>
                      )}

                      {/* Festival badge */}
                      {variant.theme === 'festival' && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          {variant.festival}
                        </div>
                      )}

                      {/* Rarity badge */}
                      <div
                        className="absolute bottom-2 left-2 text-white text-xs px-2 py-1 rounded-full font-medium"
                        style={{ backgroundColor: rarityColor }}
                      >
                        {getRarityLabel(variant.rarity)}
                      </div>

                      {/* Stars */}
                      <div className="absolute top-2 right-2 flex gap-0.5">
                        {Array.from({ length: stars }).map((_, i) => (
                          <span key={i} className="text-yellow-400 text-xs">⭐</span>
                        ))}
                      </div>

                      {/* Lock overlay */}
                      {!unlocked && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <span className="text-2xl">🔒</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <h3 className="font-bold text-gray-800 mb-1">{variant.name}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2">{variant.description}</p>
                      {mode === 'select' && unlocked && (
                        <button className="w-full mt-2 py-1.5 bg-macaron-pink text-white text-sm font-medium rounded-lg hover:bg-macaron-pink/80 transition-colors">
                          选择这只
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {filteredVariants.length} 个结果
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-macaron-purple text-white rounded-xl hover:bg-macaron-purple/80 transition-colors font-medium"
          >
            关闭
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SnakeGallery;
