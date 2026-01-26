'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { CoinFood } from '@/components/snake/CoinFood';
import { getRandomQuote } from '@/constants/snakeQuotes';

interface LoginRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  snakeName?: string;
  growthAmount?: number;
}

export const LoginRewardModal: React.FC<LoginRewardModalProps> = ({
  isOpen,
  onClose,
  snakeName = '小蛇',
  growthAmount = 1,
}) => {
  const [quote] = useState(() => getRandomQuote('login'));
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Trigger confetti after a short delay
      const timer = setTimeout(() => setShowConfetti(true), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fadeIn">
      {/* Confetti overlay */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="confetti absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                fontSize: `${12 + Math.random() * 16}px`,
              }}
            >
              {['🎉', '✨', '💫', '⭐', '🌟', '💖'][Math.floor(Math.random() * 6)]}
            </div>
          ))}
        </div>
      )}

      {/* Modal content */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-slideUp overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-macaron-pink/20 via-macaron-cream/50 to-macaron-purple/20 -z-10" />

        {/* Coin animation */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <CoinFood size={60} />
            <div className="absolute -top-2 -right-2 bg-green-500 text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center animate-pulse">
              +{growthAmount}
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          欢迎回来！
        </h2>

        {/* Snake name and message */}
        <p className="text-center text-gray-600 mb-4">
          <span className="font-semibold text-macaron-pink">{snakeName}</span>
          {quote.replace('小蛇', '')}
        </p>

        {/* Growth info */}
        <div className="bg-gradient-to-r from-macaron-pink/30 to-macaron-purple/30 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl">🐍</span>
            <div className="text-center">
              <p className="text-sm text-gray-600">本次登录奖励</p>
              <p className="text-2xl font-bold text-gray-800">
                +<span className="text-macaron-pink">{growthAmount}</span> 节
              </p>
            </div>
            <span className="text-4xl">✨</span>
          </div>
        </div>

        {/* Continue button */}
        <button
          onClick={onClose}
          className="w-full py-3 px-6 bg-gradient-to-r from-macaron-pink to-macaron-purple text-white font-semibold rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          太棒了！
        </button>

        {/* Footer decoration */}
        <div className="flex justify-center gap-2 mt-4 text-2xl opacity-50">
          <span>💕</span>
          <span>🌸</span>
          <span>✨</span>
          <span>🌸</span>
          <span>💕</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
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
        .confetti {
          animation: confettiFall 3s ease-out forwards;
        }
        @keyframes confettiFall {
          0% {
            transform: translateY(-100%) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginRewardModal;
