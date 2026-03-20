// 22 Major Arcana with cyberpunk symbolism
const TAROT_CARDS = [
  {
    number: 0,
    name: "愚者",
    name_en: "The Fool",
    symbol: "🌀",
    keywords_up: "新开始 · 自由 · 冒险",
    keywords_rev: "鲁莽 · 冒进 · 无方向"
  },
  {
    number: 1,
    name: "魔术师",
    name_en: "The Magician",
    symbol: "⚡",
    keywords_up: "创造力 · 掌控 · 资源",
    keywords_rev: "操控 · 欺骗 · 才华浪费"
  },
  {
    number: 2,
    name: "女祭司",
    name_en: "The High Priestess",
    symbol: "🌙",
    keywords_up: "直觉 · 潜意识 · 神秘",
    keywords_rev: "秘密 · 脱节 · 沉默"
  },
  {
    number: 3,
    name: "女皇",
    name_en: "The Empress",
    symbol: "🌸",
    keywords_up: "丰盛 · 养育 · 自然",
    keywords_rev: "匮乏 · 依赖 · 窒息"
  },
  {
    number: 4,
    name: "皇帝",
    name_en: "The Emperor",
    symbol: "👑",
    keywords_up: "权威 · 结构 · 稳固",
    keywords_rev: "暴政 · 僵化 · 控制欲"
  },
  {
    number: 5,
    name: "教皇",
    name_en: "The Hierophant",
    symbol: "🔑",
    keywords_up: "传统 · 教导 · 信仰",
    keywords_rev: "叛逆 · 教条 · 挑战"
  },
  {
    number: 6,
    name: "恋人",
    name_en: "The Lovers",
    symbol: "💫",
    keywords_up: "爱情 · 和谐 · 选择",
    keywords_rev: "不平衡 · 分离 · 错位"
  },
  {
    number: 7,
    name: "战车",
    name_en: "The Chariot",
    symbol: "⚔️",
    keywords_up: "意志力 · 胜利 · 决心",
    keywords_rev: "失控 · 攻击性 · 阻碍"
  },
  {
    number: 8,
    name: "力量",
    name_en: "Strength",
    symbol: "🦁",
    keywords_up: "勇气 · 耐心 · 内在力量",
    keywords_rev: "软弱 · 自我怀疑 · 放纵"
  },
  {
    number: 9,
    name: "隐者",
    name_en: "The Hermit",
    symbol: "🔮",
    keywords_up: "内省 · 智慧 · 独处",
    keywords_rev: "孤立 · 偏执 · 逃避"
  },
  {
    number: 10,
    name: "命运之轮",
    name_en: "Wheel of Fortune",
    symbol: "⚙️",
    keywords_up: "命运 · 转折 · 好运",
    keywords_rev: "逆境 · 抗拒改变 · 坏运"
  },
  {
    number: 11,
    name: "正义",
    name_en: "Justice",
    symbol: "⚖️",
    keywords_up: "公正 · 真相 · 因果",
    keywords_rev: "不公 · 欺骗 · 逃避责任"
  },
  {
    number: 12,
    name: "倒吊人",
    name_en: "The Hanged Man",
    symbol: "🔄",
    keywords_up: "牺牲 · 等待 · 新视角",
    keywords_rev: "拖延 · 抗拒 · 无谓牺牲"
  },
  {
    number: 13,
    name: "死神",
    name_en: "Death",
    symbol: "💀",
    keywords_up: "结束 · 转变 · 重生",
    keywords_rev: "抗拒改变 · 停滞 · 依附"
  },
  {
    number: 14,
    name: "节制",
    name_en: "Temperance",
    symbol: "☯️",
    keywords_up: "平衡 · 耐心 · 适度",
    keywords_rev: "失衡 · 极端 · 不和谐"
  },
  {
    number: 15,
    name: "恶魔",
    name_en: "The Devil",
    symbol: "🔗",
    keywords_up: "束缚 · 欲望 · 阴暗面",
    keywords_rev: "解放 · 觉醒 · 突破"
  },
  {
    number: 16,
    name: "塔",
    name_en: "The Tower",
    symbol: "⚡",
    keywords_up: "崩塌 · 突变 · 觉醒",
    keywords_rev: "恐惧 · 逃避 · 延迟崩坏"
  },
  {
    number: 17,
    name: "星星",
    name_en: "The Star",
    symbol: "✨",
    keywords_up: "希望 · 灵感 · 平静",
    keywords_rev: "失望 · 悲观 · 断开连接"
  },
  {
    number: 18,
    name: "月亮",
    name_en: "The Moon",
    symbol: "🌑",
    keywords_up: "幻觉 · 直觉 · 潜意识",
    keywords_rev: "困惑 · 恐惧 · 误解"
  },
  {
    number: 19,
    name: "太阳",
    name_en: "The Sun",
    symbol: "☀️",
    keywords_up: "成功 · 快乐 · 生命力",
    keywords_rev: "消极 · 过度乐观 · 受挫"
  },
  {
    number: 20,
    name: "审判",
    name_en: "Judgement",
    symbol: "📯",
    keywords_up: "审判 · 重生 · 召唤",
    keywords_rev: "自我怀疑 · 拒绝改变 · 逃避"
  },
  {
    number: 21,
    name: "世界",
    name_en: "The World",
    symbol: "🌐",
    keywords_up: "完成 · 整合 · 成就",
    keywords_rev: "未完成 · 空虚 · 缺乏闭合"
  }
];
