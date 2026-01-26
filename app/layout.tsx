import type { Metadata } from "next";
import { Inter, Noto_Sans_SC, ZCOOL_KuaiLe, Long_Cang } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { TabBar } from "@/components/layout/TabBar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

// 可爱圆润的字体 - 用于标题
const zcoolKuaiLe = ZCOOL_KuaiLe({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-cute",
  display: "swap",
});

// 手写风格字体 - 用于特殊强调
const longCang = Long_Cang({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-handwriting",
  display: "swap",
});

export const metadata: Metadata = {
  title: "小财进 - 年轻女性理财知识科普",
  description: "去金融化的年轻女性理财知识科普网站，用最生活化的方式学理财",
  keywords: ["理财", "女性理财", "基金入门", "定投", "理财知识"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-macaron-cream font-sans antialiased pb-16 md:pb-0",
        notoSansSC.variable,
        inter.variable,
        zcoolKuaiLe.variable,
        longCang.variable
      )}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <TabBar />
      </body>
    </html>
  );
}
