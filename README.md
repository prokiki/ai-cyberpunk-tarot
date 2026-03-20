# 数据先知 — AI 赛博塔罗 🔮

赛博朋克风格的 AI 塔罗牌应用，融合传统塔罗智慧与未来主义美学。

## 功能

- **单张抽牌** — 每日一牌，AI 个性化解读
- **三牌阵** — 过去·现在·未来，综合分析
- **3D 翻牌动画** — 流畅的卡牌翻转效果
- **多 AI 引擎** — 支持 Claude / GPT / Gemini / DeepSeek / Kimi / 智谱GLM，自由切换
- **粒子网络背景** — Canvas 动态粒子连线
- **响应式设计** — 桌面端和移动端适配

## 技术栈

- **前端**: HTML + CSS + JavaScript（纯静态，无框架）
- **后端**: Python FastAPI + Uvicorn
- **AI**: 支持多个提供商（Anthropic / OpenAI / Google / DeepSeek / Moonshot / 智谱）

## 支持的 AI 模型

| 提供商 | 模型 | 环境变量 |
|--------|------|---------|
| Anthropic | Claude Sonnet 4, Claude Haiku 4 | `ANTHROPIC_API_KEY` |
| OpenAI | GPT-4o, GPT-4o Mini | `OPENAI_API_KEY` |
| Google | Gemini 2.0 Flash, Gemini 2.5 Pro | `GOOGLE_API_KEY` |
| DeepSeek | DeepSeek V3, DeepSeek R1 | `DEEPSEEK_API_KEY` |
| Moonshot | Kimi v1 | `MOONSHOT_API_KEY` |
| 智谱 | GLM-4 Flash | `ZHIPU_API_KEY` |

> 启动时自动检测哪些服务可用，前端只显示已配置的引擎。至少配置一个即可运行。

## 本地运行

### 1. 安装依赖

```bash
pip install fastapi uvicorn anthropic openai
# 如果要用 Google Gemini：
pip install google-generativeai
```

### 2. 设置 API Key（至少配置一个）

```bash
# Anthropic Claude
export ANTHROPIC_API_KEY="sk-ant-..."

# OpenAI GPT
export OPENAI_API_KEY="sk-..."

# Google Gemini
export GOOGLE_API_KEY="AIza..."

# DeepSeek
export DEEPSEEK_API_KEY="sk-..."

# Moonshot (Kimi)
export MOONSHOT_API_KEY="sk-..."

# 智谱 GLM
export ZHIPU_API_KEY="..."
```

### 3. 启动后端

```bash
python api_server.py
# 会自动显示已加载的 AI 服务
```

### 4. 启动前端

```bash
# 新开一个终端
python -m http.server 3000
```

### 5. 打开浏览器

访问 `http://localhost:3000`

> 注意：前端代码中 `app.js` 的 API 地址默认指向 `http://localhost:8000`，本地开发时无需修改。

## 项目结构

```
ai-tarot/
├── index.html        # 页面结构
├── base.css          # 基础样式重置
├── style.css         # 赛博朋克主题样式
├── app.js            # 交互逻辑、翻牌动画、粒子背景
├── tarot-data.js     # 22张大阿尔卡纳牌数据
└── api_server.py     # FastAPI 后端 + 多 AI 引擎支持
```

## 自定义

| 想改什么 | 改哪个文件 |
|---------|-----------|
| 颜色、字体、动画 | `style.css` |
| 页面结构、文案 | `index.html` |
| 交互逻辑、翻牌效果 | `app.js` |
| 牌面数据 | `tarot-data.js` |
| AI 解读风格 | `api_server.py` 中的 `SYSTEM_PROMPT` |
| 添加新 AI 服务 | `api_server.py` 中添加 `_init_xxx()` 函数 |

## 添加新的 AI 提供商

在 `api_server.py` 中添加一个 `_init_xxx()` 函数，参考已有的 DeepSeek/Kimi 实现。大多数国产模型都兼容 OpenAI API 格式，只需修改 `base_url` 和 API Key 环境变量即可。

## License

MIT
