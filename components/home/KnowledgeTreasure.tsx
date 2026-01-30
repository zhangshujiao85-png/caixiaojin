"use client";

import { useState } from "react";
import { Sparkles, CheckCircle2, Heart, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLearningProgress } from "@/store/useLearningProgress";

export interface TreasureBox {
  id: string;
  title: string;
  summary: string;
  content: string;
  difficulty: "beginner" | "intermediate" | "warning";
  category: string;
  tags: string[];
  readTime: number;
  isUnlocked: boolean;
  reward: {
    points: number;
    skill: string;
  };
}

interface KnowledgeTreasureProps {
  box: TreasureBox;
  onUnlock: (id: string) => void;
}

export function KnowledgeTreasure({ box, onUnlock }: KnowledgeTreasureProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const { favoriteArticles, toggleFavorite } = useLearningProgress();
  const isFavorite = favoriteArticles.includes(box.id);

  const handleClick = () => {
    if (!box.isUnlocked && !isOpening) {
      setIsOpening(true);
      setTimeout(() => {
        onUnlock(box.id);
        setIsOpening(false);
        setShowContent(true);
      }, 800);
    } else if (box.isUnlocked) {
      setShowContent(true);
    }
  };

  const getBoxColor = () => {
    switch (box.difficulty) {
      case "beginner":
        return "from-macaron-pink/60 via-macaron-pink/40 to-macaron-pink/60";
      case "intermediate":
        return "from-macaron-purple/60 via-macaron-purple/40 to-macaron-purple/60";
      case "warning":
        return "from-macaron-blue/60 via-macaron-blue/40 to-macaron-blue/60";
      default:
        return "from-macaron-green/60 via-macaron-green/40 to-macaron-green/60";
    }
  };

  // 为每个卡片分配一个独特的装饰样式索引（基于ID）
  const decorationIndex = parseInt(box.id) % 5;

  const getDecorations = () => {
    const decorations = [
      // 0: 星星雨
      [
        { icon: "⭐", top: "5%", left: "10%", delay: "0s" },
        { icon: "✨", top: "15%", right: "8%", delay: "0.5s" },
        { icon: "⭐", bottom: "20%", left: "5%", delay: "1s" },
        { icon: "✨", bottom: "8%", right: "12%", delay: "1.5s" },
      ],
      // 1: 爱心飘浮
      [
        { icon: "💖", top: "8%", left: "15%", delay: "0.3s" },
        { icon: "💕", top: "20%", right: "10%", delay: "0.8s" },
        { icon: "💗", bottom: "15%", left: "8%", delay: "1.3s" },
        { icon: "💝", bottom: "5%", right: "15%", delay: "1.8s" },
      ],
      // 2: 云朵和彩虹
      [
        { icon: "☁️", top: "5%", left: "12%", delay: "0s" },
        { icon: "🌈", top: "18%", right: "5%", delay: "0.6s" },
        { icon: "☁️", bottom: "18%", left: "5%", delay: "1.2s" },
        { icon: "✨", bottom: "5%", right: "10%", delay: "1.8s" },
      ],
      // 3: 闪亮宝石
      [
        { icon: "💎", top: "6%", left: "10%", delay: "0s" },
        { icon: "💠", top: "16%", right: "8%", delay: "0.4s" },
        { icon: "💎", bottom: "16%", left: "6%", delay: "0.8s" },
        { icon: "💠", bottom: "6%", right: "12%", delay: "1.2s" },
      ],
      // 4: 可爱组合
      [
        { icon: "🎀", top: "8%", left: "14%", delay: "0s" },
        { icon: "🌸", top: "20%", right: "6%", delay: "0.5s" },
        { icon: "🦋", bottom: "20%", left: "6%", delay: "1s" },
        { icon: "🌺", bottom: "8%", right: "14%", delay: "1.5s" },
      ],
    ];
    return decorations[decorationIndex];
  };

  return (
    <>
      <div
        onClick={handleClick}
        className={cn(
          "relative group cursor-pointer transition-all duration-300",
          isOpening && "animate-pulse"
        )}
      >
        {/* 未解锁状态 - 低饱和度可爱卡通风格 */}
        {!box.isUnlocked && !isOpening && (
          <div
            className={cn(
              "relative w-full aspect-square rounded-[2rem] bg-gradient-to-br",
              getBoxColor(),
              "shadow-xl hover:shadow-2xl transition-all duration-300",
              "hover:scale-105 active:scale-95",
              "flex flex-col items-center justify-center p-3",
              "border-4 border-white/60 overflow-hidden",
              "group"
            )}
          >
            {/* 卡通边框装饰 - 虚线 */}
            <div className="absolute inset-2 rounded-[1.5rem] border-2 border-dashed border-white/40 pointer-events-none" />

            {/* 浮动装饰元素 - 更小更可爱 */}
            {getDecorations().map((deco, i) => (
              <div
                key={i}
                className="absolute text-lg md:text-xl opacity-70 pointer-events-none"
                style={{
                  top: deco.top,
                  left: deco.left,
                  right: deco.right,
                  bottom: deco.bottom,
                  animation: `float ${2 + i * 0.3}s ease-in-out infinite`,
                  animationDelay: deco.delay,
                }}
              >
                {deco.icon}
              </div>
            ))}

            {/* 主礼物盒子 - 卡通可爱风格 */}
            <div className="relative z-10 flex flex-col items-center">
              {/* 礼物emoji - 可爱弹跳 */}
              <div className="relative mb-2">
                {/* 外圈光晕 */}
                <div className="absolute inset-0 rounded-full bg-white/20 blur-2xl animate-pulse" />

                {/* 礼物本体 */}
                <div
                  className="text-5xl md:text-6xl relative"
                  style={{ animation: "bounce 2s ease-in-out infinite" }}
                >
                  🎁
                </div>

                {/* 旋转星光 */}
                <div className="absolute -top-1 -right-1 text-lg animate-spin-slow opacity-80">
                  ✨
                </div>
                <div className="absolute -bottom-1 -left-1 text-base animate-spin-slow-reverse opacity-70">
                  ⭐
                </div>
              </div>

              {/* 标题 */}
              <h3 className="text-white font-cute font-bold text-sm mb-1 text-center drop-shadow-md">
                知识宝箱
              </h3>

              {/* 副标题 */}
              <p className="text-white/90 text-xs text-center mb-1 font-medium drop-shadow-sm">
                ✨ 点击开启惊喜 ✨
              </p>

              {/* 描述 */}
              <p className="text-white/85 text-xs text-center leading-tight drop-shadow-sm px-1">
                发现财富智慧
              </p>
            </div>

            {/* 底部装饰 */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              <span className="text-sm" style={{ animation: "bounce 1.5s ease-in-out infinite" }}>
                💎
              </span>
              <span className="text-sm" style={{ animation: "bounce 1.8s ease-in-out infinite", animationDelay: "0.2s" }}>
                ⭐
              </span>
              <span className="text-sm" style={{ animation: "bounce 2s ease-in-out infinite", animationDelay: "0.4s" }}>
                💎
              </span>
            </div>
          </div>
        )}

        {/* 开启中动画 */}
        {isOpening && (
          <div
            className={cn(
              "relative w-full aspect-square rounded-[2rem] bg-gradient-to-br",
              getBoxColor(),
              "shadow-xl flex flex-col items-center justify-center p-3",
              "border-4 border-white/60 overflow-hidden"
            )}
          >
            {/* 旋转装饰 */}
            <div className="absolute top-2 left-2 text-lg animate-spin-slow opacity-60">✨</div>
            <div className="absolute top-2 right-2 text-lg animate-spin-slow-reverse opacity-60">⭐</div>
            <div className="absolute bottom-2 left-2 text-lg animate-spin-slow-reverse opacity-60">💫</div>
            <div className="absolute bottom-2 right-2 text-lg animate-spin-slow opacity-60">✨</div>

            <div className="relative z-10 flex flex-col items-center gap-2">
              <Sparkles className="w-12 h-12 text-white animate-spin drop-shadow-xl" />
              <p className="text-white font-cute text-sm drop-shadow-md animate-pulse font-medium">
                ✨ 开启中... ✨
              </p>
            </div>
          </div>
        )}

        {/* 已解锁状态 */}
        {box.isUnlocked && !isOpening && (
          <div
            className={cn(
              "relative w-full aspect-square rounded-[2rem] bg-gradient-to-br",
              getBoxColor(),
              "shadow-xl hover:shadow-2xl transition-all duration-300",
              "hover:scale-105 active:scale-95",
              "flex flex-col items-center justify-center p-3",
              "border-4 border-white/60 overflow-hidden",
              "cursor-pointer group"
            )}
          >
            {/* 装饰元素 */}
            <div className="absolute top-2 left-2 text-base opacity-50" style={{animation: 'float 3s ease-in-out infinite'}}>✨</div>
            <div className="absolute top-2 right-2 text-base opacity-50" style={{animation: 'float 3s ease-in-out infinite', animationDelay: '0.5s'}}>⭐</div>
            <div className="absolute bottom-2 left-2 text-base opacity-50" style={{animation: 'float 3s ease-in-out infinite', animationDelay: '1s'}}>💫</div>
            <div className="absolute bottom-2 right-2 text-base opacity-50" style={{animation: 'float 3s ease-in-out infinite', animationDelay: '1.5s'}}>✨</div>

            <div className="relative z-10 flex flex-col items-center">
              <CheckCircle2 className="w-6 h-6 text-white mb-1 drop-shadow-md" />
              <p className="text-white font-cute text-xs text-center drop-shadow-sm font-bold leading-tight px-2">
                {box.title.length > 8 ? box.title.substring(0, 8) + "..." : box.title}
              </p>
              <div className="flex items-center gap-1 bg-white/40 backdrop-blur-sm rounded-full px-2 py-0.5 mt-1 shadow-sm">
                <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                <span className="text-white text-xs font-medium">已学习</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 内容弹窗 */}
      {showContent && (
        <KnowledgeContentModal
          box={box}
          onClose={() => setShowContent(false)}
        />
      )}
    </>
  );
}

interface KnowledgeContentModalProps {
  box: TreasureBox;
  onClose: () => void;
}

function KnowledgeContentModal({ box, onClose }: KnowledgeContentModalProps) {
  const { favoriteArticles, toggleFavorite } = useLearningProgress();
  const isFavorite = favoriteArticles.includes(box.id);

  const getGradientColor = () => {
    switch (box.difficulty) {
      case "beginner":
        return "from-pink-200 via-pink-100 to-pink-200";
      case "intermediate":
        return "from-purple-200 via-purple-100 to-purple-200";
      case "warning":
        return "from-blue-200 via-blue-100 to-blue-200";
      default:
        return "from-green-200 via-green-100 to-green-200";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className={cn(
          "p-6 bg-gradient-to-r",
          getGradientColor()
        )}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium bg-white/30 text-white"
                )}>
                  {box.difficulty === "beginner" && "🌱 小白入门"}
                  {box.difficulty === "intermediate" && "💪 轻松上手"}
                  {box.difficulty === "warning" && "⚠️ 避坑指南"}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white font-cute mb-2">
                {box.title}
              </h2>
              <div className="flex items-center gap-4 text-white/90 text-sm">
                <span>⏱️ {box.readTime} 分钟</span>
                <span>📚 {box.category}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center text-white font-bold text-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 内容区域 - 可滚动 */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* 摘要 */}
          <div className="rounded-2xl p-4 mb-6 bg-macaron-cream">
            <p className="leading-relaxed text-gray-700">{box.summary}</p>
          </div>

          {/* 详细内容 */}
          <div className="prose prose-sm max-w-none mb-6">
            <p className="leading-relaxed whitespace-pre-line text-gray-700">
              {box.content}
            </p>
          </div>

          {/* 标签 */}
          <div className="flex flex-wrap gap-2 mb-6">
            {box.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-sm bg-macaron-pink/20 text-macaron-pink"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 奖励展示 */}
          <div className="rounded-2xl p-4 bg-gradient-to-r from-macaron-yellow/30 to-macaron-peach/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">学习奖励</p>
                <p className="font-bold text-gray-800 font-cute text-lg">
                  +{box.reward.points} 积分
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">获得能力</p>
                <p className="font-bold text-macaron-pink font-cute">
                  {box.reward.skill}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="p-6 bg-white border-t border-gray-100">
          <div className="flex gap-3">
            <button
              onClick={() => toggleFavorite(box.id)}
              className={cn(
                "flex-1 py-3 rounded-full font-bold transition-all",
                isFavorite
                  ? "bg-red-400 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              <Heart className={cn("w-5 h-5 inline mr-1", isFavorite && "fill-current")} />
              {isFavorite ? "已收藏" : "收藏"}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-full bg-macaron-pink hover:bg-macaron-pink/90 text-white font-cute font-bold transition-colors"
            >
              完成 ✓
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Custom animations
const customStyles = `
  @keyframes shimmer {
    0% {
      transform: translateX(-100%) translateY(-100%) rotate(45deg);
    }
    100% {
      transform: translateX(200%) translateY(200%) rotate(45deg);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
      opacity: 1;
    }
    50% {
      transform: translateY(-10px) rotate(5deg);
      opacity: 0.8;
    }
  }

  @keyframes bounce-glow {
    0%, 100% {
      transform: translateY(0) scale(1);
    }
    50% {
      transform: translateY(-8px) scale(1.05);
    }
  }

  @keyframes spin-slow {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes spin-slow-reverse {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }

  @keyframes pulse-slow {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }

  .animate-shimmer {
    animation: shimmer 3s ease-in-out infinite;
  }

  .animate-float {
    animation: float 3s ease-in-out infinite;
  }

  .animate-bounce-glow {
    animation: bounce-glow 2.5s ease-in-out infinite;
  }

  .animate-spin-slow {
    animation: spin-slow 4s linear infinite;
  }

  .animate-spin-slow-reverse {
    animation: spin-slow-reverse 3.5s linear infinite;
  }

  .animate-pulse-slow {
    animation: pulse-slow 2s ease-in-out infinite;
  }
`;

// Inject custom styles
if (typeof document !== 'undefined') {
  const styleId = 'knowledge-treasure-custom-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = customStyles;
    document.head.appendChild(style);
  }
}
