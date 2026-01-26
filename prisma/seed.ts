import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('开始播种数据...');

  // 创建知识文章
  const articles = [
    {
      title: '定投是什么？像攒钱一样简单',
      summary: '定投就是在固定的时间，用固定的金额，买入同一只基金。简单说，就是每个月发工资后，自动拿出几百块买基金。',
      content: '# 定投是什么？像攒钱一样简单\n\n## 什么是定投？\n\n定投就是在固定的时间，用固定的金额，买入同一只基金。简单说，就是每个月发工资后，自动拿出几百块买基金。\n\n## 为什么要定投？\n\n1. **门槛低**：几百块就能开始\n2. **不用择时**：不用管市场涨跌\n3. **积少成多**：时间长了，钱就多了\n\n## 怎么开始？\n\n1. 选一只你认可的基金\n2. 设置每月自动扣款\n3. 坚持长期持有\n\n记住：定投最重要的是坚持！',
      difficulty: 'beginner',
      category: 'fund',
      tags: ['定投', '基金入门', '新手'],
      readTime: 3,
    },
    {
      title: '基金类型大盘点：股票、债券、混合怎么选？',
      summary: '买基金前先搞懂类型。股票型基金波动大收益高，债券型基金稳稳的幸福，混合型基金两者兼顾。',
      content: '# 基金类型大盘点\n\n## 股票型基金\n- 收益潜力大\n- 波动也大\n- 适合：能承受波动的你\n\n## 债券型基金\n- 收益稳定\n- 波动较小\n- 适合：追求稳健的你\n\n## 混合型基金\n- 股票债券都有\n- 风险收益平衡\n- 适合：想要均衡配置的你\n\n## 货币基金\n- 类似银行理财\n- 几乎无风险\n- 适合：放零用钱',
      difficulty: 'beginner',
      category: 'fund',
      tags: ['基金类型', '入门'],
      readTime: 4,
    },
    {
      title: '避开这些坑，新手不踩雷',
      summary: '追涨杀跌、频繁操作、只看历史业绩...这些新手常犯的错误，你中招了吗？',
      content: '# 新手常见避坑指南\n\n## ❌ 追涨杀跌\n看到涨了就买，跌了就卖，结果高买低卖。\n\n**✅ 正确做法**：坚持定投，不要被短期波动影响。\n\n## ❌ 频繁操作\n今天买明天卖，手续费都够亏的。\n\n**✅ 正确做法**：长期持有，至少1-3年。\n\n## ❌ 只看历史业绩\n"这只基金去年赚了50%！"——去年好不代表明年好。\n\n**✅ 正确做法**：看长期业绩，至少3年以上。\n\n## ❌ 一次性梭哈\n把所有钱都投进去，遇到大跌就慌了。\n\n**✅ 正确做法**：分批买入或定投。',
      difficulty: 'warning',
      category: 'risk',
      tags: ['避坑', '风险', '新手'],
      readTime: 3,
    },
    {
      title: '止盈是什么？该什么时候卖？',
      summary: '止盈就是达到目标收益后卖出，落袋为安。比如赚了20%就卖，保住胜利果实。',
      content: '# 止盈是什么？\n\n止盈就是在基金涨到一定幅度后，卖出部分或全部，锁定收益。\n\n## 常见止盈方法\n\n### 1. 目标收益率法\n设定一个目标，比如20%，达到就卖。\n\n### 2. 最大回撤法\n从最高点跌了一定比例就卖，比如从最高点跌10%。\n\n### 3. 分批止盈\n每涨10%就卖一部分，越涨越卖。\n\n## 注意事项\n\n- 止盈不是一次性全部卖出\n- 可以分多次止盈\n- 市场趋势好时可以适当放宽止盈点',
      difficulty: 'intermediate',
      category: 'strategy',
      tags: ['止盈', '卖出', '策略'],
      readTime: 4,
    },
    {
      title: '要不要抄底？下跌时该怎么做',
      summary: '市场大跌时，很多人想抄底。但抄底是技术活，新手建议继续定投，不要一次性买入。',
      content: '# 要不要抄底？\n\n## 什么是抄底？\n\n在市场或基金大跌时买入，等待反弹赚钱。\n\n## 新手建议\n\n### ❌ 不推荐一次性抄底\n- 你不知道底在哪里\n- 可能买在半山腰\n- 心理压力大\n\n### ✅ 继续定投\n- 下跌时同样金额能买到更多份额\n- 摊薄成本\n- 等待反弹收益更高\n\n## 可以做的\n\n1. **加仓定投金额**：原来每月500，现在每月1000\n2. **分批买入**：不要一次性，分3-5次买\n3. **保持冷静**：不要恐慌，相信长期价值',
      difficulty: 'intermediate',
      category: 'strategy',
      tags: ['抄底', '下跌', '策略'],
      readTime: 3,
    },
    {
      title: '基金费用大揭秘：申购费、管理费、赎回费',
      summary: '买基金要花钱？申购费、管理费、赎回费...这些费用怎么收？怎么买更省钱？',
      content: '# 基金费用大揭秘\n\n## 主要费用类型\n\n### 1. 申购费（买入时）\n- 买入时收取\n- 一般1-1.5%\n- 很多平台打1折\n\n### 2. 管理费（每年）\n- 基金公司收取\n- 从基金资产中扣除\n- 股票型1.5%左右，债券型0.5-1%\n\n### 3. 赎回费（卖出时）\n- 卖出时收取\n- 持有<7天收1.5%\n- 持有>1年一般免收\n\n## 省钱技巧\n\n1. **选平台**：大平台申购费打1折\n2. **长期持有**：避免高额赎回费\n3. **C类份额**：适合短期持有（<1年）',
      difficulty: 'beginner',
      category: 'knowledge',
      tags: ['费用', '省钱', '入门'],
      readTime: 4,
    },
  ];

  for (const article of articles) {
    await prisma.article.create({
      data: article,
    });
  }

  console.log('知识文章创建完成');

  // 创建示例用户
  const user1 = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      username: '小财友',
      passwordHash: 'demo_hash', // 实际应用中应该是加密后的密码
      level: 'beginner',
    },
  });

  // 创建模拟交易账户
  await prisma.simulationAccount.create({
    data: {
      userId: user1.id,
      totalAssets: 100000,
      cashBalance: 100000,
      profitLoss: 0,
    },
  });

  // 创建社区帖子
  const posts = [
    {
      title: '我的定投日记：坚持3个月啦',
      content: '从3个月前开始定投，每个月500块，虽然收益不多，但看到账户慢慢变多很有成就感！坚持就是胜利～',
      category: '定投心得',
      userId: user1.id,
      images: [],
    },
    {
      title: '新手第一次买基金，求指点',
      content: '刚刚入手了第一只基金，有点紧张又有点期待。大家都定投的哪些呀？求推荐～',
      category: '新手提问',
      userId: user1.id,
      images: [],
    },
  ];

  for (const post of posts) {
    await prisma.post.create({
      data: post,
    });
  }

  console.log('数据播种完成！');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
