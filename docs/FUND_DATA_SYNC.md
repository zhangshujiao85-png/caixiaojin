# 小财进 - 基金数据集成方案

## 📊 方案概述

本项目采用**混合模式**获取基金数据：
- **短期**：使用 CMES ETF 数据进行平滑处理
- **长期**：计划接入真实公募基金数据源

### 为什么使用 ETF 数据？

1. **CMES 不提供公募基金数据**，只提供股票、ETF、指数、可转债数据
2. **ETF 是指数基金的场内版本**，走势高度相关
3. **通过平滑处理**，可以让 ETF 数据更接近场外指数基金的表现

---

## 🚀 快速开始

### 1. 手动同步数据

```bash
# 同步基金数据
npm run funds:sync

# 或者直接运行 Python 脚本
python scripts/sync_etf_data.py
```

### 2. 查看同步结果

数据会保存到 `data/funds.json` 文件中，包含：
- 4 种基金类型的最新净值
- 最近 30 天的历史数据
- 数据来源说明

---

## 📡 数据流程

```
CMES API (ETF数据)
    ↓
平滑处理算法
    ↓
data/funds.json
    ↓
Next.js API (/api/funds)
    ↓
前端模拟交易页面
```

---

## 🔄 设置定时同步

### 方案一：使用 Windows 任务计划程序

1. 打开"任务计划程序"
2. 创建基本任务
3. 设置每天 18:00 运行（收盘后）
4. 操作：运行 `npm run funds:sync`

### 方案二：使用 GitHub Actions（适合部署到 Vercel）

创建 `.github/workflows/sync-funds.yml`：

```yaml
name: Sync Fund Data

on:
  schedule:
    # 每天 UTC 10:00 (北京时间 18:00) 运行
    - cron: '0 10 * * 1-5'
  workflow_dispatch: # 允许手动触发

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: pip install cmesdata pandas
      - name: Sync fund data
        run: python scripts/sync_etf_data.py
        env:
          CMES_TOKEN: ${{ secrets.CMES_TOKEN }}
      - name: Commit changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add data/funds.json
          git diff --quiet && git diff --staged --quiet || git commit -m "chore: sync fund data"
          git push
```

### 方案三：使用 Node.js 定时任务（生产环境推荐）

安装依赖：
```bash
npm install node-cron
```

创建 `scripts/scheduler.js`：
```javascript
const cron = require('node-cron');
const { exec } = require('child_process');

// 每天下午 6 点运行（交易日收盘后）
cron.schedule('0 18 * * 1-5', () => {
  console.log('开始同步基金数据...');
  exec('python scripts/sync_etf_data.py', (error, stdout, stderr) => {
    if (error) {
      console.error(`同步失败: ${error}`);
      return;
    }
    console.log(`同步成功: ${stdout}`);
  });
});

console.log('定时任务已启动，将在每个交易日 18:00 同步数据');
```

---

## 📊 数据平滑处理算法

### 核心逻辑

```python
# 波动系数：控制真实市场波动的影响程度
volatility_factor = 0.6  # 0.1-0.8，越小越稳定

# 基础收益率：基金的长期平均收益
base_return = 0.002  # 约 0.2% 每天

# 平滑后的日收益率
daily_return = (etf_change * volatility_factor) + (base_return * (1 - volatility_factor))
```

### 基金类型配置

| 类型 | 波动系数 | 基础日收益 | 跟踪 ETF |
|------|---------|-----------|---------|
| 货币型 | 0.1 | 0.02% | 银华日利 (SH.511880) |
| 债券型 | 0.3 | 0.08% | 国债ETF (SH.511010) |
| 指数型 | 0.6 | 0.20% | 沪深300ETF (SH.510300) |
| 混合型 | 0.8 | 0.30% | 中证500ETF (SH.510500) |

---

## 🔧 配置说明

### 修改 CMES Token

编辑 `scripts/sync_etf_data.py`：

```python
CMES_TOKEN = "your_token_here"
```

### 修改基金映射

在 `scripts/sync_etf_data.py` 中的 `ETF_MAPPING` 字典中修改：

```python
ETF_MAPPING = {
    "货币型": {
        "code": "SH.511880",      # ETF 代码
        "name": "银华日利",       # ETF 名称
        "fund_name": "小财进·超稳货币宝",  # 显示名称
        "volatility_factor": 0.1,  # 波动系数
        "base_return": 0.0002      # 基础日收益
    },
    // ... 其他配置
}
```

---

## 📈 API 接口

### 获取基金数据

**接口**：`GET /api/funds`

**响应示例**：
```json
{
  "success": true,
  "data": {
    "update_time": "2026-04-08T15:28:32.738824",
    "data_source": "CMES (平滑处理)",
    "funds": {
      "货币型": {
        "code": "XF001",
        "name": "小财进·超稳货币宝",
        "etf_code": "SH.511880",
        "etf_name": "银华日利",
        "type": "货币型",
        "latest_nav": 1.0108,
        "latest_change": 0.02,
        "history": [...]
      }
    }
  }
}
```

---

## ⚠️ 注意事项

1. **交易时间**：ETF 数据在交易时间段更新，收盘后数据最完整
2. **数据延迟**：CMES 可能有 15-20 分钟延迟
3. **平滑处理**：已将 ETF 波动降低，更接近场外基金
4. **仅供学习**：模拟数据不构成投资建议

---

## 🔄 数据更新策略

### 当前状态
- ✅ 支持手动同步
- ⏳ 待添加定时任务

### 建议更新频率
- **开发阶段**：手动同步即可
- **测试阶段**：每天收盘后同步一次
- **生产环境**：交易日 18:00 自动同步

---

## 🛠️ 故障排查

### 问题 1：数据同步失败

**检查**：
- CMES Token 是否有效
- 网络连接是否正常
- Python 环境是否安装了 `cmesdata` 库

**解决**：
```bash
pip install cmesdata -U
```

### 问题 2：前端显示旧数据

**检查**：
- `data/funds.json` 文件是否更新
- 浏览器缓存是否需要清除

**解决**：
```bash
# 重新同步数据
npm run funds:sync

# 清除浏览器缓存并刷新
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

### 问题 3：API 返回 500 错误

**检查**：
- `data/funds.json` 文件是否存在
- 文件格式是否正确（JSON 格式）

**解决**：
```bash
# 检查文件
cat data/funds.json

# 如果文件损坏，重新同步
npm run funds:sync
```

---

## 📞 技术支持

如有问题，请查看：
- 项目 Issues
- CMES 官方文档：https://cmes-data.com/api.html
- Next.js API 文档：https://nextjs.org/docs/api-routes/introduction

---

## 🎯 未来计划

### 短期（1-2 个月）
- [ ] 添加更多基金类型
- [ ] 优化平滑算法
- [ ] 添加基金详情页

### 中期（3-6 个月）
- [ ] 接入真实公募基金 API（天天基金、蚂蚁财富）
- [ ] 添加基金筛选和对比功能
- [ ] 实现智能投顾建议

### 长期（6-12 个月）
- [ ] 支持自定义基金组合
- [ ] 添加定投计算器
- [ ] 实现真实基金购买对接

---

**最后更新**：2026-04-08
**维护者**：小财进团队
