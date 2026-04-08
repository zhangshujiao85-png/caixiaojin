import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const query = searchParams.get("query");
    const category = searchParams.get("category");
    const sort = searchParams.get("sort") || "daily_return";

    // 读取基金数据文件
    const filePath = join(process.cwd(), "data", "funds.json");
    const fileContents = await readFile(filePath, "utf-8");
    const fundsData = JSON.parse(fileContents);

    // 获取榜单
    if (action === "rankings") {
      return NextResponse.json({
        success: true,
        data: fundsData.rankings,
      });
    }

    // 获取分类列表
    if (action === "categories") {
      return NextResponse.json({
        success: true,
        data: fundsData.categories,
      });
    }

    // 搜索基金
    if (action === "search") {
      const searchQuery = query?.toLowerCase() || "";
      const funds = Object.values(fundsData.funds);

      const filtered = funds.filter((fund: any) => {
        const matchesSearch =
          fund.name.toLowerCase().includes(searchQuery) ||
          fund.code.toLowerCase().includes(searchQuery) ||
          fund.desc.toLowerCase().includes(searchQuery);

        const matchesCategory = !category || fund.type === category;

        return matchesSearch && matchesCategory;
      });

      // 排序
      const sorted = filtered.sort((a: any, b: any) => {
        if (sort === "daily_return") {
          return b.returns.daily_return - a.returns.daily_return;
        } else if (sort === "monthly_return") {
          return b.returns.monthly_return - a.returns.monthly_return;
        } else if (sort === "volatility") {
          return a.returns.volatility - b.returns.volatility;
        }
        return 0;
      });

      return NextResponse.json({
        success: true,
        data: sorted,
        total: sorted.length,
      });
    }

    // 获取单个基金详情
    if (action === "detail") {
      const code = searchParams.get("code");
      if (!code) {
        return NextResponse.json(
          { success: false, error: "缺少基金代码" },
          { status: 400 }
        );
      }

      const fund = fundsData.funds[code];
      if (!fund) {
        return NextResponse.json(
          { success: false, error: "基金不存在" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: fund,
      });
    }

    // 默认返回所有基金数据（兼容旧版本）
    return NextResponse.json({
      success: true,
      data: fundsData,
    });
  } catch (error) {
    console.error("读取基金数据失败:", error);
    return NextResponse.json(
      {
        success: false,
        error: "无法获取基金数据",
      },
      { status: 500 }
    );
  }
}
