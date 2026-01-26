// Snake variant definitions for the pet game
export interface SnakeVariant {
  id: string;
  name: string;
  emoji: string;
  colors: {
    head: string;
    body: string[];
    tail: string;
  };
  accessories: string[]; // Decorative elements
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  theme: 'daily' | 'festival';
  festival?: string; // Festival name
  description: string;
}

export const SNAKE_VARIANTS: SnakeVariant[] = [
  // Daily/Common Snakes
  {
    id: 'pink-basic',
    name: '粉粉蛇',
    emoji: '🐍💕',
    colors: {
      head: '#FFB5BA',
      body: ['#FFB5BA', '#FFC0CB', '#FFD6DC'],
      tail: '#FFB5BA',
    },
    accessories: ['小蝴蝶结', '腮红'],
    rarity: 'common',
    theme: 'daily',
    description: '温柔可爱的粉色小蛇，喜欢每天和你打招呼～',
  },
  {
    id: 'gold-snake',
    name: '招财蛇',
    emoji: '🐍💰',
    colors: {
      head: '#FFD700',
      body: ['#FFD700', '#FFA500', '#FF8C00'],
      tail: '#FFD700',
    },
    accessories: ['金币帽子', '红包'],
    rarity: 'rare',
    theme: 'daily',
    description: '带来好运的财富小蛇，据说能招来财运～',
  },
  {
    id: 'mint-snake',
    name: '薄荷蛇',
    emoji: '🐍🌿',
    colors: {
      head: '#C1E1C1',
      body: ['#C1E1C1', '#A8D8A8', '#8FCF8F'],
      tail: '#C1E1C1',
    },
    accessories: ['叶子装饰', '清新水滴'],
    rarity: 'common',
    theme: 'daily',
    description: '清新的薄荷小蛇，带来清爽的一天～',
  },
  {
    id: 'cream-snake',
    name: '奶油蛇',
    emoji: '🐍🥛',
    colors: {
      head: '#FFF9F0',
      body: ['#FFF9F0', '#FFF5E6', '#FFF0D9'],
      tail: '#FFF9F0',
    },
    accessories: ['奶滴装饰', '甜甜圈'],
    rarity: 'common',
    theme: 'daily',
    description: '软绵绵的奶油小蛇，看起来很好吃～',
  },
  {
    id: 'lavender-snake',
    name: '薰衣草蛇',
    emoji: '🐍💜',
    colors: {
      head: '#E0CCFF',
      body: ['#E0CCFF', '#D4B8FF', '#C8A4FF'],
      tail: '#E0CCFF',
    },
    accessories: ['星星装饰', '梦幻光环'],
    rarity: 'rare',
    theme: 'daily',
    description: '梦幻的薰衣草小蛇，带来甜甜的梦～',
  },
  {
    id: 'sky-snake',
    name: '天空蛇',
    emoji: '🐍☁️',
    colors: {
      head: '#C5D9F0',
      body: ['#C5D9F0', '#B0CEF5', '#9BC3FA'],
      tail: '#C5D9F0',
    },
    accessories: ['云朵', '雨滴'],
    rarity: 'common',
    theme: 'daily',
    description: '来自天空的小蛇，心情像天气一样好～',
  },
  {
    id: 'peach-snake',
    name: '蜜桃蛇',
    emoji: '🐍🍑',
    colors: {
      head: '#FFDAB9',
      body: ['#FFDAB9', '#FFCBA4', '#FFBB8F'],
      tail: '#FFDAB9',
    },
    accessories: ['桃子装饰', '花朵'],
    rarity: 'common',
    theme: 'daily',
    description: '甜甜的蜜桃小蛇，每天都很甜～',
  },
  {
    id: 'lemon-snake',
    name: '柠檬蛇',
    emoji: '🐍🍋',
    colors: {
      head: '#FFF4CC',
      body: ['#FFF4CC', '#FFEB99', '#FFE266'],
      tail: '#FFF4CC',
    },
    accessories: ['柠檬片', '阳光'],
    rarity: 'rare',
    theme: 'daily',
    description: '酸酸甜甜的柠檬小蛇，充满活力～',
  },
  {
    id: 'ocean-snake',
    name: '海洋蛇',
    emoji: '🐍🌊',
    colors: {
      head: '#64B5F6',
      body: ['#64B5F6', '#42A5F5', '#2196F3'],
      tail: '#64B5F6',
    },
    accessories: ['海浪', '贝壳'],
    rarity: 'rare',
    theme: 'daily',
    description: '来自海洋的小蛇，深蓝色的神秘～',
  },
  {
    id: 'sakura-snake',
    name: '樱花蛇',
    emoji: '🐍🌸',
    colors: {
      head: '#FFD1DC',
      body: ['#FFD1DC', '#FFB7C5', '#FF9DAF'],
      tail: '#FFD1DC',
    },
    accessories: ['樱花瓣', '粉色爱心'],
    rarity: 'epic',
    theme: 'daily',
    description: '樱花般美丽的小蛇，春天专属～',
  },

  // Festival Special Snakes
  {
    id: 'spring-festival',
    name: '年货蛇',
    emoji: '🐍🧧',
    colors: {
      head: '#E74C3C',
      body: ['#E74C3C', '#C0392B', '#A93226'],
      tail: '#E74C3C',
    },
    accessories: ['灯笼', '春联', '福字'],
    rarity: 'legendary',
    theme: 'festival',
    festival: '春节',
    description: '新春限定！带来满满福气～',
  },
  {
    id: 'valentine-snake',
    name: '爱心蛇',
    emoji: '🐍💖',
    colors: {
      head: '#FF69B4',
      body: ['#FF69B4', '#FF1493', '#DB7093'],
      tail: '#FF69B4',
    },
    accessories: ['玫瑰', '爱心箭', '巧克力'],
    rarity: 'epic',
    theme: 'festival',
    festival: '情人节',
    description: '情人节的甜蜜小蛇，爱意满满～',
  },
  {
    id: 'halloween-snake',
    name: '南瓜蛇',
    emoji: '🐍🎃',
    colors: {
      head: '#FF8C00',
      body: ['#FF8C00', '#FF6B00', '#FF5500'],
      tail: '#FF8C00',
    },
    accessories: ['南瓜', '蝙蝠', '幽灵'],
    rarity: 'epic',
    theme: 'festival',
    festival: '万圣节',
    description: '万圣节的调皮小蛇，不给糖就捣蛋～',
  },
  {
    id: 'christmas-snake',
    name: '圣诞蛇',
    emoji: '🐍🎄',
    colors: {
      head: '#2ECC71',
      body: ['#2ECC71', '#27AE60', '#1E8449'],
      tail: '#2ECC71',
    },
    accessories: ['铃铛', '雪花', '圣诞帽'],
    rarity: 'legendary',
    theme: 'festival',
    festival: '圣诞节',
    description: '圣诞节的快乐小蛇，带来礼物～',
  },
  {
    id: 'dragon-boat-snake',
    name: '龙舟蛇',
    emoji: '🐍🛶',
    colors: {
      head: '#3498DB',
      body: ['#3498DB', '#2980B9', '#1A5276'],
      tail: '#3498DB',
    },
    accessories: ['粽子', '龙舟', '艾草'],
    rarity: 'epic',
    theme: 'festival',
    festival: '端午节',
    description: '端午节的健康小蛇，驱邪避灾～',
  },
  {
    id: 'moon-snake',
    name: '月亮蛇',
    emoji: '🐍🌕',
    colors: {
      head: '#F5F5DC',
      body: ['#F5F5DC', '#FAF0E6', '#FFFAF0'],
      tail: '#F5F5DC',
    },
    accessories: ['月亮', '兔子', '桂花'],
    rarity: 'legendary',
    theme: 'festival',
    festival: '中秋节',
    description: '中秋节的团圆小蛇，月圆人团圆～',
  },
  {
    id: 'fireworks-snake',
    name: '烟花蛇',
    emoji: '🐍🎆',
    colors: {
      head: '#9B59B6',
      body: ['#9B59B6', '#8E44AD', '#7D3C98'],
      tail: '#9B59B6',
    },
    accessories: ['烟花', '星星', '彩带'],
    rarity: 'legendary',
    theme: 'festival',
    festival: '国庆节',
    description: '国庆节的璀璨小蛇，庆祝节日～',
  },
];

// Get current festival snake based on date
export function getCurrentFestivalSnake(): SnakeVariant | null {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  // Spring Festival (approximate, varies by year)
  if (month === 1 && day >= 20 && day <= 31) {
    return SNAKE_VARIANTS.find((s) => s.festival === '春节') || null;
  }
  // Valentine's Day
  if (month === 2 && day === 14) {
    return SNAKE_VARIANTS.find((s) => s.festival === '情人节') || null;
  }
  // Dragon Boat Festival (approximate, varies by year)
  if (month === 6 && day >= 15 && day <= 25) {
    return SNAKE_VARIANTS.find((s) => s.festival === '端午节') || null;
  }
  // Halloween
  if (month === 10 && day === 31) {
    return SNAKE_VARIANTS.find((s) => s.festival === '万圣节') || null;
  }
  // Christmas
  if (month === 12 && day >= 20 && day <= 31) {
    return SNAKE_VARIANTS.find((s) => s.festival === '圣诞节') || null;
  }
  // National Day (China)
  if (month === 10 && day === 1) {
    return SNAKE_VARIANTS.find((s) => s.festival === '国庆节') || null;
  }
  // Mid-Autumn Festival (approximate, varies by year)
  if (month === 9 && day >= 15 && day <= 25) {
    return SNAKE_VARIANTS.find((s) => s.festival === '中秋节') || null;
  }

  return null;
}

// Get random snake variant (excluding festival unless currently active)
export function getRandomSnakeVariant(): SnakeVariant {
  const festivalSnake = getCurrentFestivalSnake();
  if (festivalSnake && Math.random() < 0.3) {
    return festivalSnake;
  }

  const dailySnakes = SNAKE_VARIANTS.filter((s) => s.theme === 'daily');
  return dailySnakes[Math.floor(Math.random() * dailySnakes.length)];
}

// Get rarity color for UI
export function getRarityColor(rarity: SnakeVariant['rarity']): string {
  switch (rarity) {
    case 'common':
      return '#A0A0A0';
    case 'rare':
      return '#3498DB';
    case 'epic':
      return '#9B59B6';
    case 'legendary':
      return '#F39C12';
    default:
      return '#A0A0A0';
  }
}

// Get rarity stars
export function getRarityStars(rarity: SnakeVariant['rarity']): number {
  switch (rarity) {
    case 'common':
      return 1;
    case 'rare':
      return 2;
    case 'epic':
      return 3;
    case 'legendary':
      return 4;
    default:
      return 1;
  }
}
