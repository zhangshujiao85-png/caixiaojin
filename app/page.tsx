"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { FundTree, PiggyBankGirl, MoneyBag, CoinStack } from "@/components/illustrations";
import { KnowledgeTreasure } from "@/components/home/KnowledgeTreasure";
import { DailyCheckInModal } from "@/components/home/DailyCheckInModal";
import { AnxietyReliefCard } from "@/components/home/AnxietyReliefCard";
import { WishCalculatorCard } from "@/components/home/WishCalculatorCard";
import { SimulationCard } from "@/components/home/SimulationCard";
import { FinanceCenterCard } from "@/components/home/FinanceCenterCard";
import { AnxietyReliefWrapper } from "@/components/home/AnxietyReliefWrapper";
import { SimulationModal } from "@/components/home/SimulationCard";
import { WishCalculatorModal } from "@/components/home/WishCalculatorModal";
import { FinanceCenterModal } from "@/components/home/FinanceCenterModal";
import { DailyCheckInButton } from "@/components/home/DailyCheckInButton";
import { DictionaryCard } from "@/components/home/DictionaryCard";
import { DictionaryModal } from "@/components/home/DictionaryModal";
import { useLearningProgress } from "@/store/useLearningProgress";
import { Card, CardContent } from "@/components/ui/card";

type DifficultyLevel = "all" | "beginner" | "intermediate" | "warning";

// Mock data - will be replaced with API calls later
const mockArticles = [
  {
    id: "1",
    title: "复利的力量：让钱自己生钱",
    summary: "爱因斯坦说复利是世界第八大奇迹。简单说，就是利滚利，时间越长，效果越惊人。",
    content: "📚 专业话术：\n复利是指在投资收益产生新收益的基础上，再投资并持续产生收益的过程。其核心在于时间价值，随着时间推移，指数级增长效应越显著。\n\n💄 生活化语义平移：\n想象一下，你养了一只会下金蛋的鹅🪿，金蛋孵出来的小鹅长大后也会下金蛋，小鹅的鹅又继续下蛋...这就是复利！\n\n就像滚雪球⛄，开始小小一个，越滚越大，最后变成大雪球！就像你种了一棵摇钱树，不仅树枝上挂满金币，掉在地上的金币还能长出新的摇钱树！\n\n💰 举个例子：\n你今天存100元，每年10%收益。\n• 第1年：110元\n• 第10年：259元\n• 第20年：673元\n• 第30年：1745元！\n\n✨ 复利三要素：\n1️⃣ 本金：开始投资的钱\n2️⃣ 收益率：每年赚多少%\n3️⃣ 时间：最重要！时间越长越明显\n\n💡 真正的秘诀：\n越早开始越好，保持耐心，不要中断。即使每月只存500元，30年后也可能变成百万！",
    difficulty: "beginner" as const,
    category: "入门必读",
    tags: ["复利", "时间价值", "新手"],
    readTime: 3,
    isUnlocked: false,
    reward: {
      points: 15,
      skill: "复利思维",
    },
  },
  {
    id: "2",
    title: "定投就像奶茶店办卡",
    summary: "每月自动买基金，就像每月奶茶店自动扣费。不知不觉攒下钱，时间到了收获惊喜。",
    content: "📚 专业话术：\n定期定额投资（定投）是指在固定时间以固定金额买入同一只基金的投资策略。通过长期持续投入，可以平摊持仓成本，降低市场波动风险。\n\n💄 生活化语义平移：\n定投就像你在奶茶店办了张会员卡💳，每个月发工资日自动扣费。\n\n• 每月自动扣费 → 每月自动买基金\n• 不用每次纠结喝不喝 → 不用管市场涨跌\n• 不好意思退卡 → 强制自己存钱\n• 时间到了一杯一杯喝 → 时间到了钱越攒越多\n\n就像养个电子宠物🐱，每天定时喂食（投钱），它慢慢长大，长大后给你生小宠物（赚更多钱）！\n\n✨ 定投的好处：\n1️⃣ 强制储蓄，不知不觉攒下钱\n2️⃣ 平摊成本，不用猜最低点\n3️⃣ 长期持有，享受复利增长\n4️⃣ 操作简单，设置自动扣款就行\n\n💡 小贴士：\n选择长期看好的基金，设置自动扣款，忘记它，3年后再看～",
    difficulty: "beginner" as const,
    category: "定投入门",
    tags: ["定投", "懒人理财", "新手"],
    readTime: 3,
    isUnlocked: false,
    reward: {
      points: 15,
      skill: "纪律性",
    },
  },
  {
    id: "3",
    title: "基金就像奶茶，选对口味很重要",
    summary: "股票型基金像全糖奶茶，甜但热量高；债券型基金像半糖，温和不腻；混合型基金自己调，随你喜欢。",
    content: "📚 专业话术：\n基金按投资标的可分为股票型（80%以上投资股票）、债券型（主要投资债券）和混合型（股债灵活配置）。不同类型风险收益特征不同，应根据风险承受能力选择。\n\n💄 生活化语义平移：\n买基金就像选奶茶🧋，每种口味不同：\n\n🧋 全糖奶茶 = 股票型基金\n• 80%以上投资股票\n• 口感「刺激」：波动大，像坐过山车🎢\n• 甜度高：可能赚很多，也可能亏很多\n• 适合：喜欢冒险的年轻小姐姐\n\n🧋 半糖奶茶 = 债券型基金\n• 主要投资债券\n• 口感「温和」：波动小，像喝温水🫖\n• 甜度低：收益稳定但不高\n• 适合：保守派、怕踩雷的姐妹\n\n🧋 自助调味 = 混合型基金\n• 股票+债券自己配\n• 口感随你喜欢，想甜就甜想淡就淡\n• 适合：大多数小仙女\n\n💡 新手建议：\n先从半糖（混合型）开始，慢慢找到自己喜欢的口味！就像选奶茶，先从小杯少糖试起～",
    difficulty: "beginner" as const,
    category: "基金入门",
    tags: ["基金类型", "新手"],
    readTime: 3,
    isUnlocked: false,
    reward: {
      points: 15,
      skill: "风险认知",
    },
  },
  {
    id: "4",
    title: "别做追涨杀跌的韭菜",
    summary: "看到涨了就买，跌了就卖？这是新手最容易犯的错误。教你如何避免成为被收割的韭菜。",
    content: "📚 专业话术：\n追涨杀跌是指在市场上涨时盲目追高买入，下跌时恐慌性抛售的非理性行为。这种行为往往导致高买低卖，是投资者亏损的主要原因之一。\n\n💄 生活化语义平移：\n追涨杀跌就像追星和脱粉🌟：\n\n😱 追涨：看到某个明星（基金）火了，赶紧当死忠粉（买入），怕错过\n😱 杀跌：明星爆个丑闻（跌了），马上脱粉回踩（卖出），怕被连累\n\n结果：高调入坑，低调退圈，总是亏钱当冤大头！\n\n❌ 为什么会这样？\n• 贪婪：看到涨了想赚更多，像看到限量款包包必须买\n• 恐惧：看到跌了怕亏更多，像护肤品过敏马上扔掉\n• 人性：跟风操作，没有主见，别人买什么你也买\n\n✅ 正确做法：\n\n1️⃣ 坚持定投\n• 不管涨跌，每月固定买\n• 跌的时候买到的份额更多（像打折季扫货！）\n• 长期看，成本被平均\n\n2️⃣ 设定止盈点\n• 比如：赚20%就卖一部分\n• 不要贪心，落袋为安（像打折买到手就收手）\n\n3️⃣ 忘记密码\n• 不要天天看账户\n• 给时间让基金成长（像等快递，天天查也没用）\n\n💡 记住：投资是马拉松，不是百米冲刺！",
    difficulty: "warning" as const,
    category: "避坑指南",
    tags: ["追涨杀跌", "韭菜", "心态"],
    readTime: 4,
    isUnlocked: false,
    reward: {
      points: 20,
      skill: "心态管理",
    },
  },
  {
    id: "5",
    title: "通货膨胀：你的钱在偷偷变少",
    summary: "为什么100元现在能买的东西，10年后买不到了？这就是通货膨胀的力量。",
    content: "📚 专业话术：\n通货膨胀是指货币供应量超过经济实际需要导致货币贬值、物价持续上涨的现象。通胀率通常为2%-3%，意味着如果不投资，现金购买力会持续下降。\n\n💄 生活化语义平移：\n通胀就是你的钱在偷偷变瘦💸，像减肥一样拦都拦不住！\n\n10年前：\n• 鸡蛋 2元/斤（能买50个）\n• 牛奶 3元/盒（能买33盒）\n\n现在：\n• 鸡蛋 6元/斤（只能买16个）\n• 牛奶 4元/盒（只能买25个）\n\n同样的100元，10年前能买一堆零食🍬，现在只能买几根棒棒糖🍭！你的钱就像被施了魔法，明明还是那些钱，就是买不到原来那么多东西了。\n\n就像你的闺蜜，10年前100块能让她开心一天，现在100块她可能看都不看一眼😂（物价涨了，标准也高了）\n\n📊 看数据：\n• 通胀率约2%-3%\n• 10年后的100元 ≈ 现在的70多元\n• 20年后 ≈ 现在的50多元\n\n✨ 如何对抗通胀？\n\n1️⃣ 投资理财（最重要的！）\n• 股票、基金长期收益率 > 通胀率\n• 钱生钱，让钱的速度超过通胀\n\n2️⃣ 买资产\n• 房产、黄金等保值资产（像买包包，经典款永远保值）\n\n3️⃣ 提升自己\n• 提高收入，比投资更稳（投资自己永远不会亏！）\n\n💡 记住：不投资，你的钱一定会缩水！",
    difficulty: "beginner" as const,
    category: "理财思维",
    tags: ["通胀", "理财", "入门"],
    readTime: 3,
    isUnlocked: false,
    reward: {
      points: 15,
      skill: "通胀意识",
    },
  },
  {
    id: "6",
    title: "止盈是什么？该什么时候卖",
    summary: "止盈就是达到目标收益后卖出，落袋为安。比如赚了20%就卖，保住胜利果实。",
    content: "📚 专业话术：\n止盈是指投资达到预期收益目标后，通过卖出部分或全部仓位锁定利润的行为。合理的止盈策略可以保护收益，避免市场反转导致利润回吐。\n\n💄 生活化语义平移：\n止盈就像减肥成功后赶紧拍照发朋友圈📸，把最美身材定格下来！\n\n想象一下：\n你买了基金，赚了20%，超开心！但如果市场反转，利润可能全部吐回去，就像减肥后反弹😭\n\n🎯 止盈策略：\n\n1️⃣ 目标收益率法\n• 设定目标（如20%、30%）\n• 达到后分批卖出\n• 例如：达20%卖1/3（先买套新衣服庆祝）\n• 30%再卖1/3（再买支口红）\n\n2️⃣ 估值止盈法\n• 指数估值过高时分批卖出\n• 可以参考估值百分位\n• 就像商场打折，打折时买，不打折时卖\n\n3️⃣ 时间止盈法\n• 持有达到一定时间（如3年）\n• 不管盈亏都考虑卖出\n• 就像谈恋爱，3年了该考虑要不要结婚（卖出）还是继续\n\n💡 温馨提示：\n止盈不是逃顶（不可能精准预测最高点），是保住胜利果实！就像减肥，不用等到最瘦才开始拍照，达到目标就值得庆祝！",
    difficulty: "intermediate" as const,
    category: "投资策略",
    tags: ["止盈", "卖出", "策略"],
    readTime: 4,
    isUnlocked: false,
    reward: {
      points: 25,
      skill: "止盈策略",
    },
  },
  {
    id: "7",
    title: "要不要抄底？下跌时该怎么做",
    summary: "市场大跌时，很多人想抄底。但抄底是技术活，新手建议继续定投，不要一次性买入。",
    content: "📚 专业话术：\n抄底是指在市场下跌过程中尝试预测最低点并买入的行为。由于市场底部难以精准预测，抄底存在较高风险。投资者应避免一次性大额投入，可采用分批建仓策略。\n\n💄 生活化语义平移：\n抄底就像接掉下来的水果刀🔪，接得好赚大钱，接不好手受伤！\n\n📉 市场大跌时：\n❌ 新手不要做的事：\n• 一次性全部买入（像梭哈买彩票，输了哭死）\n• 预测最低点（你又不是算命先生🔮）\n• 借钱抄底（这是要搞事情啊！）\n\n✅ 新手可以做的事：\n\n1️⃣ 继续定投\n• 跌得越多，同样的钱买到更多份额\n• 就像商场大促，打折时买更划算！\n• 长期看，可能是好机会\n\n2️⃣ 分批建仓\n• 把钱分成3-4份\n• 跌10%买一份，再跌10%再买\n• 就像买奶茶，先买小杯试试，好喝再买大杯\n\n3️⃣ 关注估值\n• 估值低时分批买入\n• 可以参考指数估值表\n• 就像挑水果，看成熟度再买\n\n💡 记住：\n没人能精准预测底部，定投最安全！就像恋爱，别想着找到完美男友，差不多就得了（划掉）——投资要稳，别想着抄到底部！",
    difficulty: "intermediate" as const,
    category: "投资策略",
    tags: ["抄底", "下跌", "策略"],
    readTime: 3,
    isUnlocked: false,
    reward: {
      points: 25,
      skill: "市场判断",
    },
  },
  {
    id: "8",
    title: "基金费用大揭秘：申购费、管理费、赎回费",
    summary: "买基金要花钱？申购费、管理费、赎回费...这些费用怎么收？怎么买更省钱？",
    content: "📚 专业话术：\n基金费用主要包括申购费（买入时支付，通常1%-1.5%）、管理费（年度按资产净值收取，股票型约1.5%）、赎回费（卖出时支付，持有期越低费率越高）及托管费等。\n\n💄 生活化语义平移：\n买基金要花钱？就像去奶茶店，除了奶茶钱还有各种费用💰：\n\n1️⃣ 申购费 = 门店费\n• 买的时候收\n• 通常1%-1.5%\n• 💡省钱技巧：第三方平台（如支付宝）打1折\n• 就像奶茶店外卖比门店便宜\n\n2️⃣ 管理费 = 服务费\n• 基金公司每年收的\n• 股票型1.5%，债券型0.5%左右\n• 从基金资产中直接扣除（你感觉不到）\n• 💡注意：指数基金通常更便宜（像自助餐比单点便宜）\n\n3️⃣ 赎回费 = 违约金\n• 持有<7天收1.5%（超级贵！）\n• 持有<1年可能收0.5%\n• 💡省钱技巧：持有超过1年或2年免赎回费\n• 就像健身卡，时间越长越划算\n\n4️⃣ 其他费用 = 餐具费、包装费\n• 托管费、销售服务费等\n• 虽然不多，但也要算进去\n\n🎯 省钱攻略：\n✓ 在第三方平台买（申购费打1折，像用外卖APP）\n✓ 选择指数基金（管理费低，像选性价比高的套餐）\n✓ 长期持有（免赎回费，像办年卡比单次便宜）",
    difficulty: "beginner" as const,
    category: "基础知识",
    tags: ["费用", "省钱", "入门"],
    readTime: 4,
    isUnlocked: false,
    reward: {
      points: 15,
      skill: "成本控制",
    },
  },
  {
    id: "9",
    title: "避开这些坑，新手不踩雷",
    summary: "追涨杀跌、频繁操作、只看历史业绩...这些新手常犯的错误，你中招了吗？",
    content: "📚 专业话术：\n新手投资常见误区包括：过度交易导致手续费损耗、盲目追逐历史业绩高位基金、缺乏风险承受能力评估、投资期限过短无法穿越市场周期等。\n\n💄 生活化语义平移：\n新手买基金最容易踩的5个坑⚠️，就像新手化妆容易手残一样：\n\n❌ 追涨杀跌 = 跟风买网红产品\n看到别人都说好（涨了）就买，结果买到的是智商税\n✅ 正确做法：坚持定投，长期持有\n\n❌ 频繁操作 = 天天换化妆品\n今天买明天卖，手续费亏大了（像护肤品试一次就扔，浪费钱！）\n✅ 正确做法：持有至少1年以上（给产品时间见效）\n\n❌ 只看历史业绩 = 只看网红推荐\n去年火热的化妆品（基金），今年可能烂脸（大跌）\n✅ 正确做法：看基金经理（品牌）、投资策略（成分）\n\n❌ 一次性梭哈 = 发工资全买化妆品\n把所有钱一次性投入，一点后路不留\n✅ 正确做法：分批买入，定期定投（先买小样试试）\n\n❌ 不止盈 = 妆画好了不拍照\n赚了20%不舍得卖，最后变亏损（化完妆不拍照，白化了！）\n✅ 正确做法：设置目标收益率（如20%，达到就收手）\n\n💡 总结：\n投资就像护肤，贵在坚持，不能急于求成！",
    difficulty: "warning" as const,
    category: "避坑指南",
    tags: ["避坑", "风险", "新手"],
    readTime: 3,
    isUnlocked: false,
    reward: {
      points: 20,
      skill: "风险意识",
    },
  },
  {
    id: "10",
    title: "基金类型大盘点：股票、债券、混合怎么选？",
    summary: "买基金前先搞懂类型。股票型基金波动大收益高，债券型基金稳稳的幸福，混合型基金两者兼顾。",
    content: "📚 专业话术：\n基金按投资标的可分为股票型（80%以上投资股票，预期收益高但波动大）、债券型（主要投资债券，收益稳定风险低）、混合型（股债灵活配置）三大类。\n\n💄 生活化语义平移：\n买基金就像选男友，每种类型不同👫：\n\n🔴 股票型基金 = 坏坏男友\n• 80%以上投资股票\n• 性格「刺激」：情绪波动大\n• 有时候超级甜（赚很多），有时候很作（亏很多）\n• 适合：喜欢刺激、心脏强大的小姐姐\n\n🔵 债券型基金 = 温柔暖男\n• 主要投资债券\n• 性格「稳定」：情绪波动小\n• 不会给你太多惊喜，但也不会吓你\n• 适合：想要稳稳幸福、怕受伤的姐妹\n\n🟣 混合型基金 = 均衡型男友\n• 股票+债券灵活配置\n• 性格随你调：想要刺激就刺激，想要温柔就温柔\n• 适合：大多数小仙女\n\n💡 新手建议：\n从均衡型（混合型）开始，慢慢找到适合自己的类型！就像谈恋爱，别一上来就找刺激的，先从温和的开始～",
    difficulty: "beginner" as const,
    category: "基金入门",
    tags: ["基金类型", "入门"],
    readTime: 4,
    isUnlocked: false,
    reward: {
      points: 15,
      skill: "资产配置",
    },
  },
  {
    id: "11",
    title: "定投是什么？像攒钱一样简单",
    summary: "定投就是在固定的时间，用固定的金额，买入同一只基金。简单说，就是每个月发工资后，自动拿出几百块买基金。",
    content: "📚 专业话术：\n定期定额投资（定投）是指投资者在固定时间（如每月）以固定金额（如500元）买入同一只基金的投资方式。通过长期持续投入，可有效平摊持仓成本，降低择时风险。\n\n💄 生活化语义平移：\n定投就像给你的钱「办健身卡」💪：\n\n• 每月固定时间扣费 → 每月固定投资\n• 不用每次想不想去 → 不用管市场涨跌\n• 坚持下去身材变好 → 坚持下去钱变多\n\n就像养电子宠物🐱：\n• 每天定时喂食（投钱）\n• 宠物慢慢长大（资产增值）\n• 长大后给你生蛋（赚更多钱）\n\n✨ 定投的好处：\n1️⃣ 强制储蓄，不知不觉攒下钱\n• 就像健身卡自动扣费，不去也心疼，所以你会坚持\n\n2️⃣ 平摊成本，不用猜最低点\n• 跌的时候买得多，涨的时候买得少\n• 长期平均下来，成本很合理\n• 就像买水果，有时贵有时便宜，长期下来平均价差不多\n\n3️⃣ 长期持有，享受复利增长\n• 时间越长，效果越明显\n• 就像滚雪球，越滚越大\n\n4️⃣ 操作简单，设置自动扣款就行\n• 设置好后完全不用管\n• 像Netflix自动续费一样省心\n\n💡 小贴士：\n选择长期看好的基金，设置自动扣款，忘记它，3年后再看～\n\n• 选择：找一只长期靠谱的基金（像找靠谱的健身房）\n• 设置：每月发工资日自动扣款（像自动续费）\n• 忘记：不要天天看（像健身，天天看镜子也没用）\n• 收获：3年后给你惊喜（像坚持健身后的身材）",
    difficulty: "beginner" as const,
    category: "基金入门",
    tags: ["定投", "基金入门", "新手"],
    readTime: 3,
    isUnlocked: false,
    reward: {
      points: 15,
      skill: "定投思维",
    },
  },
  {
    id: "12",
    title: "基金经理的隐藏技能",
    summary: "基金经理到底是做什么的？他们如何帮你赚钱？了解这个职业，选基金更安心。",
    content: "📚 专业话术：\n基金经理是专业的投资管理人员，负责管理基金资产，制定投资策略，进行投资决策，目标是实现基金的长期增值。\n\n💄 生活化语义平移：\n想象一下，基金经理就像你的「专属造型师」💇‍♀️：\n\n• 你不懂穿搭（不懂投资）→ 造型师帮你搭配（经理帮你选股票）\n• 你没时间研究（没空盯盘）→ 造型师持续关注（经理持续研究）\n• 你怕选错风格（怕买错基金）→ 专业造型师更靠谱（专业经理更懂行）\n\n🎯 基金经理每天都在做什么？\n\n1️⃣ 研究公司财报\n• 就像研究衣服面料和版型\n• 看哪些公司「质量好」「有潜力」\n\n2️⃣ 出席调研会议\n• 就像去服装厂看样衣\n• 实地了解公司真实情况\n\n3️⃣ 做投资决策\n• 就像决定买哪件衣服上架\n• 买哪些股票、卖哪些股票\n\n4️⃣ 风险控制\n• 就像控制库存风险\n• 不能把所有钱押在一个地方\n\n💡 如何选择好经理？\n\n✓ 看历史业绩：至少3-5年经验\n✓ 看投资风格：是否稳定（不频繁换风格）\n✓ 看最大回撤：最差时亏了多少（亏太多要谨慎）\n✓ 看从业背景：名校+大公司经验加分\n\n⚠️ 注意：\n不是业绩好的经理就永远好！有时候是运气好，有时候是市场好。要看长期表现，不要只看短期收益！",
    difficulty: "intermediate" as const,
    category: "进阶知识",
    tags: ["基金经理", "选基金", "进阶"],
    readTime: 4,
    isUnlocked: false,
    reward: {
      points: 20,
      skill: "专业判断",
    },
  },
];

export default function HomePage() {
  // 每日轮换逻辑：根据日期选择当天要显示的宝箱
  const getDailyArticles = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const startIndex = dayOfYear % mockArticles.length;
    const dailyArticles = [];

    for (let i = 0; i < 6; i++) {
      const index = (startIndex + i) % mockArticles.length;
      dailyArticles.push(mockArticles[index]);
    }

    return dailyArticles;
  };

  const [articles, setArticles] = useState(getDailyArticles());
  const { completeArticle } = useLearningProgress();

  // 弹窗状态
  const [dailyCheckInOpen, setDailyCheckInOpen] = useState(false);
  const [anxietyReliefOpen, setAnxietyReliefOpen] = useState(false);
  const [simulationOpen, setSimulationOpen] = useState(false);
  const [wishCalculatorOpen, setWishCalculatorOpen] = useState(false);
  const [financeCenterOpen, setFinanceCenterOpen] = useState(false);
  const [dictionaryOpen, setDictionaryOpen] = useState(false);

  const handleUnlock = (id: string) => {
    const article = articles.find((a) => a.id === id);
    if (article) {
      completeArticle(id, article.reward.points, article.reward.skill);
      setArticles((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, isUnlocked: true } : a
        )
      );
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Slogan */}
      <section className="relative bg-gradient-to-br from-macaron-pink/20 via-macaron-cream to-macaron-green/20 py-8 md:py-12 overflow-hidden">
        {/* Slogan Bar */}
        <div className="bg-gradient-to-r from-macaron-pink via-macaron-purple to-macaron-blue py-3 px-4 text-center">
          <p className="text-white font-cute text-sm md:text-base drop-shadow-md">
            💫 财务自由的起点，是知识自由。而你，已稳健启程。 ✨
          </p>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative py-12">
          {/* 装饰插画 - 左侧 */}
          <div className="absolute left-4 md:left-10 top-1/4 hidden md:block animate-bounce" style={{ animationDuration: "3s" }}>
            <FundTree size={100} />
          </div>

          {/* 中间标题 - 今日宝箱 */}
          <div className="text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 font-cute flex items-center justify-center gap-2">
              <Sparkles className="w-7 h-7 text-macaron-pink" />
              🎁 今日宝箱
              <Sparkles className="w-7 h-7 text-macaron-pink" />
            </h2>
            <p className="text-gray-600 font-cute text-lg">
              慢慢探索，不着急~
            </p>
          </div>

          {/* 装饰插画 - 右侧 */}
          <div className="absolute right-4 md:right-10 top-1/3 hidden md:block animate-bounce" style={{ animationDuration: "3.5s", animationDelay: "0.5s" }}>
            <PiggyBankGirl size={100} />
          </div>
        </div>
      </section>

      {/* 知识宝箱区域 - 可爱边框包裹 */}
      <section className="py-2 md:py-4 relative -mt-14 md:-mt-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* 可爱边框容器 */}
          <div className="relative bg-gradient-to-br from-macaron-cream/50 via-macaron-pink/10 to-macaron-purple/10 rounded-3xl p-4 md:p-6 border-4 border-dashed border-macaron-pink/40 shadow-lg">

            {/* 装饰性emoji - 左上 */}
            <div className="absolute -top-3 -left-3 text-4xl animate-bounce" style={{ animationDuration: "2s" }}>
              ✨
            </div>
            {/* 装饰性emoji - 右上 */}
            <div className="absolute -top-3 -right-3 text-4xl animate-bounce" style={{ animationDuration: "2.5s" }}>
              💫
            </div>
            {/* 装饰性emoji - 左下 */}
            <div className="absolute -bottom-3 -left-3 text-4xl animate-bounce" style={{ animationDuration: "2.2s" }}>
              🌸
            </div>
            {/* 装饰性emoji - 右下 */}
            <div className="absolute -bottom-3 -right-3 text-4xl animate-bounce" style={{ animationDuration: "2.8s" }}>
              🎀
            </div>

            {/* 今日宝箱 Section */}
            <div id="articles" className="relative mb-4">
              {/* 宝箱网格 - 悦投风格横向滚动 */}
              <div className="relative">
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                  {articles.map((article) => (
                    <KnowledgeTreasure
                      key={article.id}
                      box={article}
                      onUnlock={handleUnlock}
                    />
                  ))}
                </div>
              </div>

              {articles.length === 0 && (
                <div className="text-center py-12">
                  <PiggyBankGirl size={80} className="mx-auto mb-4 opacity-50" />
                  <p className="text-gray-500 font-cute text-lg">暂无相关内容</p>
                </div>
              )}
            </div>

            {/* 小白术语词典 */}
            <div className="mt-4">
              <DictionaryCard onClick={() => setDictionaryOpen(true)} />
            </div>
          </div>
        </div>
      </section>

      {/* 功能卡片 Section - 四大功能 2×2 Grid */}
      <section className="py-4 md:py-6 relative">
        <div className="container mx-auto px-4 md:px-6">
          {/* 可爱边框容器 */}
          <div className="relative bg-gradient-to-br from-macaron-cream/50 via-macaron-pink/10 to-macaron-purple/10 rounded-3xl p-4 md:p-6 border-4 border-dashed border-macaron-pink/40 shadow-lg">

            {/* 装饰性emoji - 左上 */}
            <div className="absolute -top-3 -left-3 text-4xl animate-bounce" style={{ animationDuration: "2s" }}>
              🌟
            </div>
            {/* 装饰性emoji - 右上 */}
            <div className="absolute -top-3 -right-3 text-4xl animate-bounce" style={{ animationDuration: "2.5s" }}>
              ⭐
            </div>
            {/* 装饰性emoji - 左下 */}
            <div className="absolute -bottom-3 -left-3 text-4xl animate-bounce" style={{ animationDuration: "2.2s" }}>
              💖
            </div>
            {/* 装饰性emoji - 右下 */}
            <div className="absolute -bottom-3 -right-3 text-4xl animate-bounce" style={{ animationDuration: "2.8s" }}>
              🎈
            </div>

            {/* 区域标题 */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-2xl">🎯</span>
              <h2 className="text-xl font-bold text-gray-800 font-cute">
                实用工具
              </h2>
              <span className="text-2xl">🛠️</span>
            </div>

            {/* 四大功能卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnxietyReliefCard onClick={() => setAnxietyReliefOpen(true)} />
              <WishCalculatorCard onClick={() => setWishCalculatorOpen(true)} />
              <SimulationCard onClick={() => setSimulationOpen(true)} />
              <FinanceCenterCard onClick={() => setFinanceCenterOpen(true)} />
            </div>
          </div>
        </div>
      </section>

      {/* 弹窗组件 */}
      <DailyCheckInModal open={dailyCheckInOpen} onOpenChange={setDailyCheckInOpen} />
      <AnxietyReliefWrapper open={anxietyReliefOpen} onOpenChange={setAnxietyReliefOpen} />
      <SimulationModal open={simulationOpen} onOpenChange={setSimulationOpen} />
      <WishCalculatorModal open={wishCalculatorOpen} onOpenChange={setWishCalculatorOpen} />
      <FinanceCenterModal open={financeCenterOpen} onOpenChange={setFinanceCenterOpen} />
      <DictionaryModal open={dictionaryOpen} onOpenChange={setDictionaryOpen} />

      {/* 浮动签到按钮 */}
      <DailyCheckInButton onClick={() => setDailyCheckInOpen(true)} />
    </div>
  );
}
