"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AIAssistantPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-macaron-pink/20 via-macaron-cream to-macaron-purple/20 py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        {/* 返回按钮 */}
        <Link href="/tools" className="inline-flex items-center gap-2 text-macaron-pink hover:text-macaron-purple transition-colors mb-6 group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-cute font-medium">返回工具箱</span>
        </Link>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 text-center border-2 border-macaron-pink/30">
          <div className="text-6xl mb-6">🤖</div>
          <h1 className="text-3xl font-bold mb-4 font-cute text-gray-800">AI理财助手</h1>
          <p className="text-gray-600">AI助手即将上线，敬请期待...</p>
        </div>
      </div>
    </div>
  );
}
