# 数据先知 — AI 赛博塔罗 🔮

赛博朋克风格的 AI 塔罗牌应用，融合传统塔罗智慧与未来主义美学。

## 功能

- **单张抽牌** — 每日一牌，AI 个性化解读
- **三牌阵** — 过去·现在·未来，综合分析
- **3D 翻牌动画** — 流畅的卡牌翻转效果
- **AI 解读** — 接入 Claude 大模型，赛博朋克风格的牌面解读
- **粒子网络背景** — Canvas 动态粒子连线
- **响应式设计** — 桌面端和移动端适配

## 技术栈

- **前端**: HTML + CSS + JavaScript（纯静态，无框架）
- **后端**: Python FastAPI + Uvicorn
- **AI**: Anthropic Claude API

## 本地运行

### 1. 安装依赖

```bash
pip install fastapi uvicorn anthropic
```

### 2. 设置 API Key

```bash
export ANTHROPIC_API_KEY="你的Anthropic API Key"
```

### 3. 启动后端

```bash
python api_server.py
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
└── api_server.py     # FastAPI 后端 + Claude AI 解读
```

## 自定义

| 想改什么 | 改哪个文件 |
|---------|-----------|
| 颜色、字体、动画 | `style.css` |
| 页面结构、文案 | `index.html` |
| 交互逻辑、翻牌效果 | `app.js` |
| 牌面数据 | `tarot-data.js` |
| AI 解读风格 | `api_server.py` 中的 `SYSTEM_PROMPT` |

## License

MIT
