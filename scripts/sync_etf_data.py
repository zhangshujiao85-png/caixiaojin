#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
小财进 - 完整 ETF 数据同步系统
最大化利用 CMES 数据
"""
import sys
import io
import os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from cmesdata import *
import pandas as pd
import json
from datetime import datetime, timedelta
from typing import List, Dict, Tuple
import numpy as np

# CMES Token
CMES_TOKEN = "78016cb83f5e45a6b807ecb3d708db27"

# 完整的 ETF 列表（按类型分类）
ETF_LIST = {
    "货币型": [
        {"code": "SH.511880", "name": "银华日利", "desc": "货币基金ETF龙头，流动性好"},
        {"code": "SH.511890", "name": "交易型货币", "desc": "交易便利，适合短期理财"},
        {"code": "SZ.159001", "name": "招商保证金A", "desc": "保证金理财首选"},
    ],
    "债券型": [
        {"code": "SH.511010", "name": "国债ETF", "desc": "跟踪国债指数，几乎零风险"},
        {"code": "SH.511260", "name": "十年国债", "desc": "长期国债，稳健收益"},
        {"code": "SH.511030", "name": "平安债", "desc": "综合债券指数"},
        {"code": "SZ.159926", "name": "可转债ETF", "desc": "可转债指数，进可攻退可守"},
    ],
    "指数型": [
        {"code": "SH.510300", "name": "沪深300ETF", "desc": "大盘蓝筹代表，A股核心指数"},
        {"code": "SH.510500", "name": "中证500ETF", "desc": "中小盘代表，成长性强"},
        {"code": "SZ.159915", "name": "创业板ETF", "desc": "科技成长，波动较大"},
        {"code": "SH.588000", "name": "科创50ETF", "desc": "硬核科技，高风险高收益"},
        {"code": "SH.512100", "name": "中证1000ETF", "desc": "小盘股代表"},
        {"code": "SH.510810", "name": "上海国企", "desc": "国企改革主题"},
    ],
    "行业主题": [
        {"code": "SZ.159928", "name": "消费ETF", "desc": "消费龙头，防御性强"},
        {"code": "SZ.159934", "name": "新能源车", "desc": "新能源车产业链"},
        {"code": "SH.512480", "name": "计算机", "desc": "科技主题"},
        {"code": "SH.512690", "name": "券商ETF", "desc": "券商板块，牛市先锋"},
        {"code": "SH.515030", "name": "新能源ETF", "desc": "新能源产业"},
        {"code": "SZ.159949", "name": "创业板50", "desc": "创业板龙头"},
        {"code": "SH.516160", "name": "新能源", "desc": "新能源龙头"},
    ],
    "混合型": [
        {"code": "SH.510400", "name": "沪深300价值", "desc": "价值投资风格"},
        {"code": "SZ.159919", "name": "沪深300指", "desc": "经典指数基金"},
    ]
}

# 基金类型配置
FUND_CONFIG = {
    "货币型": {
        "volatility_factor": 0.1,
        "base_return": 0.0002,
        "risk_level": "R1",
        "min_amount": 100,
    },
    "债券型": {
        "volatility_factor": 0.3,
        "base_return": 0.0008,
        "risk_level": "R2",
        "min_amount": 100,
    },
    "指数型": {
        "volatility_factor": 0.6,
        "base_return": 0.002,
        "risk_level": "R3",
        "min_amount": 100,
    },
    "行业主题": {
        "volatility_factor": 0.7,
        "base_return": 0.0025,
        "risk_level": "R4",
        "min_amount": 100,
    },
    "混合型": {
        "volatility_factor": 0.5,
        "base_return": 0.0018,
        "risk_level": "R3",
        "min_amount": 100,
    },
}


def login_cmes():
    """登录 CMES"""
    try:
        result = login(CMES_TOKEN)
        print(f"✅ CMES 登录成功")
        return True
    except Exception as e:
        print(f"❌ CMES 登录失败: {e}")
        return False


def get_etf_history(etf_code: str, days: int = 90) -> pd.DataFrame:
    """
    获取 ETF 历史数据

    Args:
        etf_code: ETF 代码
        days: 获取天数

    Returns:
        DataFrame: 历史数据
    """
    end_date = datetime.now().strftime("%Y-%m-%d")
    start_date = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")

    try:
        df = get_history_data(etf_code, start_date, end_date, "D")
        if df is not None and not df.empty:
            return df.sort_values('时间').reset_index(drop=True)
        return pd.DataFrame()
    except Exception as e:
        print(f"   ⚠️  获取 {etf_code} 失败: {e}")
        return pd.DataFrame()


def calculate_returns(df: pd.DataFrame) -> Dict:
    """
    计算各种收益率指标

    Args:
        df: 历史数据

    Returns:
        Dict: 收益率指标
    """
    if df.empty or len(df) < 2:
        return {
            "daily_return": 0,
            "weekly_return": 0,
            "monthly_return": 0,
            "quarterly_return": 0,
            "max_drawdown": 0,
            "volatility": 0,
        }

    # 计算日收益率
    df['收益率'] = df['收盘价'].pct_change()

    # 日收益率
    daily_return = df['收益率'].iloc[-1] if not pd.isna(df['收益率'].iloc[-1]) else 0

    # 周收益率（最近5个交易日）
    if len(df) >= 5:
        weekly_return = (df['收盘价'].iloc[-1] / df['收盘价'].iloc[-5] - 1)
    else:
        weekly_return = 0

    # 月收益率（最近20个交易日）
    if len(df) >= 20:
        monthly_return = (df['收盘价'].iloc[-1] / df['收盘价'].iloc[-20] - 1)
    else:
        monthly_return = 0

    # 季度收益率（最近60个交易日）
    if len(df) >= 60:
        quarterly_return = (df['收盘价'].iloc[-1] / df['收盘价'].iloc[-60] - 1)
    else:
        quarterly_return = 0

    # 最大回撤
    df['累计净值'] = (1 + df['收益率'].fillna(0)).cumprod()
    df['滚动最大'] = df['累计净值'].cummax()
    df['回撤'] = (df['累计净值'] - df['滚动最大']) / df['滚动最大']
    max_drawdown = df['回撤'].min()

    # 波动率（年化）
    volatility = df['收益率'].std() * np.sqrt(252) if len(df) > 1 else 0

    return {
        "daily_return": round(daily_return * 100, 2),
        "weekly_return": round(weekly_return * 100, 2),
        "monthly_return": round(monthly_return * 100, 2),
        "quarterly_return": round(quarterly_return * 100, 2),
        "max_drawdown": round(max_drawdown * 100, 2),
        "volatility": round(volatility * 100, 2),
    }


def smooth_etf_data(df: pd.DataFrame, config: Dict) -> Tuple[List[Dict], float]:
    """
    将 ETF 数据平滑处理，模拟基金净值

    Args:
        df: ETF 原始数据
        config: 基金配置

    Returns:
        Tuple: (平滑后的数据列表, 最新净值)
    """
    if df.empty:
        return [], 1.0

    result = []
    volatility_factor = config.get("volatility_factor", 0.5)
    base_return = config.get("base_return", 0.001)

    df = df.sort_values('时间').reset_index(drop=True)
    df['涨跌幅'] = df['收盘价'].pct_change()

    nav = 1.0

    for _, row in df.iterrows():
        date = row['时间']
        etf_change = row['涨跌幅']

        if pd.isna(etf_change):
            daily_return = base_return
        else:
            daily_return = (etf_change * volatility_factor) + (base_return * (1 - volatility_factor))

        nav = nav * (1 + daily_return)

        if isinstance(date, str):
            date_str = date.split(' ')[0]
        else:
            date_str = date.strftime("%Y-%m-%d")

        result.append({
            "date": date_str,
            "nav": round(nav, 4),
            "change": round(daily_return * 100, 2),
        })

    return result, nav


def generate_fund_data() -> Dict:
    """
    生成所有基金的完整数据

    Returns:
        Dict: 所有基金数据
    """
    print("\n" + "=" * 70)
    print("开始生成完整基金数据...")
    print("=" * 70)

    all_funds = []
    fund_data_dict = {}

    for fund_type, etf_list in ETF_LIST.items():
        print(f"\n📊 处理【{fund_type}】类别，共 {len(etf_list)} 只基金...")

        config = FUND_CONFIG.get(fund_type, FUND_CONFIG["指数型"])

        for etf_info in etf_list:
            etf_code = etf_info["code"]
            etf_name = etf_info["name"]
            etf_desc = etf_info["desc"]

            print(f"   🔄 处理: {etf_name} ({etf_code})")

            # 获取历史数据
            df = get_etf_history(etf_code, days=90)

            if df.empty:
                print(f"      ⚠️  无数据，跳过")
                continue

            # 计算收益率指标
            returns = calculate_returns(df)

            # 平滑处理
            history, latest_nav = smooth_etf_data(df, config)

            fund_data = {
                "code": f"XF{len(all_funds) + 1:03d}",  # 生成虚拟代码
                "etf_code": etf_code,
                "name": etf_name,
                "type": fund_type,
                "desc": etf_desc,
                "risk_level": config["risk_level"],
                "latest_nav": round(latest_nav, 4),
                "latest_change": returns["daily_return"],
                "returns": returns,
                "history": history[-60:],  # 保留最近60天
                "volatility_factor": config["volatility_factor"],
            }

            all_funds.append(fund_data)
            fund_data_dict[fund_data["code"]] = fund_data

            print(f"      ✅ 净值: {latest_nav:.4f}, 日涨跌: {returns['daily_return']:.2f}%")

    # 生成榜单数据
    print(f"\n📈 生成榜单数据...")

    # 收益榜（日收益率）
    daily_ranking = sorted(all_funds, key=lambda x: x["returns"]["daily_return"], reverse=True)[:10]

    # 收益榜（月收益率）
    monthly_ranking = sorted(all_funds, key=lambda x: x["returns"]["monthly_return"], reverse=True)[:10]

    # 热门榜（综合考虑）
    hot_ranking = sorted(all_funds, key=lambda x: (
        x["returns"]["daily_return"] * 0.3 +
        x["returns"]["monthly_return"] * 0.7
    ), reverse=True)[:10]

    # 低风险榜
    low_risk_ranking = sorted(all_funds, key=lambda x: (
        x["volatility_factor"],
        -x["returns"]["monthly_return"]
    ))[:10]

    rankings = {
        "daily_return": [{"code": f["code"], "name": f["name"], "value": f["returns"]["daily_return"]} for f in daily_ranking],
        "monthly_return": [{"code": f["code"], "name": f["name"], "value": f["returns"]["monthly_return"]} for f in monthly_ranking],
        "hot": [{"code": f["code"], "name": f["name"], "value": round(f["returns"]["daily_return"] * 0.3 + f["returns"]["monthly_return"] * 0.7, 2)} for f in hot_ranking],
        "low_risk": [{"code": f["code"], "name": f["name"], "risk": f["risk_level"], "value": f["returns"]["monthly_return"]} for f in low_risk_ranking],
    }

    print(f"\n✅ 共生成 {len(all_funds)} 只基金数据")

    return {
        "funds": fund_data_dict,
        "list": all_funds,
        "rankings": rankings,
        "categories": list(ETF_LIST.keys()),
    }


def save_to_json(data: Dict, output_path: str):
    """保存数据到 JSON 文件"""
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    output_data = {
        "update_time": datetime.now().isoformat(),
        "update_timestamp": int(datetime.now().timestamp()),
        "data_source": "CMES (平滑处理)",
        "total_funds": len(data["list"]),
        "categories": data["categories"],
        "rankings": data["rankings"],
        "funds": data["funds"],
    }

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"\n✅ 数据已保存到: {output_path}")
    print(f"   文件大小: {os.path.getsize(output_path) / 1024:.2f} KB")


def logout_cmes():
    """退出 CMES 登录"""
    try:
        login_out()
        print("✅ 已退出 CMES 登录")
    except:
        pass


def main():
    """主函数"""
    print("\n" + "=" * 70)
    print("📈 小财进 - 完整 ETF 数据同步系统")
    print("=" * 70)
    print(f"⏰ 开始时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"📊 将同步 {sum(len(v) for v in ETF_LIST.values())} 只 ETF 数据")

    # 登录
    if not login_cmes():
        print("\n❌ 无法登录 CMES，退出")
        return

    # 生成数据
    fund_data = generate_fund_data()

    # 保存
    output_path = os.path.join(
        os.path.dirname(__file__),
        "..",
        "data",
        "funds.json"
    )

    save_to_json(fund_data, output_path)

    # 退出登录
    logout_cmes()

    # 统计信息
    print("\n" + "=" * 70)
    print("✅ 数据同步完成！")
    print("=" * 70)

    print(f"\n📊 数据统计:")
    print(f"   - 基金总数: {fund_data['list'].__len__()} 只")
    print(f"   - 类别数量: {len(fund_data['categories'])} 个")
    print(f"\n📈 榜单预览:")
    print(f"   - 日收益榜 TOP3: {', '.join([f['name'] for f in fund_data['rankings']['daily_return'][:3]])}")
    print(f"   - 月收益榜 TOP3: {', '.join([f['name'] for f in fund_data['rankings']['monthly_return'][:3]])}")
    print(f"   - 热门榜 TOP3: {', '.join([f['name'] for f in fund_data['rankings']['hot'][:3]])}")

    print(f"\n⏰ 完成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")


if __name__ == "__main__":
    main()
