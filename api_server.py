#!/usr/bin/env python3
"""Tarot AI interpretation backend — supports multiple AI providers."""

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# ─── Provider registry ───────────────────────────────────────────────
# Each provider: { "name", "models": [...], "call": async fn(model, system, user_msg) -> str }

PROVIDERS = {}

# ── Anthropic (Claude) ──
def _init_anthropic():
    try:
        from anthropic import Anthropic
        client = Anthropic()

        async def call(model, system, user_msg):
            msg = client.messages.create(
                model=model,
                max_tokens=1024,
                system=system,
                messages=[{"role": "user", "content": user_msg}],
            )
            return msg.content[0].text

        PROVIDERS["anthropic"] = {
            "name": "Anthropic",
            "models": [
                {"id": "claude-sonnet-4-20250514", "label": "Claude Sonnet 4"},
                {"id": "claude-haiku-4-20250414", "label": "Claude Haiku 4"},
            ],
            "call": call,
        }
    except Exception:
        pass

# ── OpenAI (GPT) ──
def _init_openai():
    try:
        from openai import OpenAI
        client = OpenAI()

        async def call(model, system, user_msg):
            resp = client.chat.completions.create(
                model=model,
                max_tokens=1024,
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": user_msg},
                ],
            )
            return resp.choices[0].message.content

        PROVIDERS["openai"] = {
            "name": "OpenAI",
            "models": [
                {"id": "gpt-4o", "label": "GPT-4o"},
                {"id": "gpt-4o-mini", "label": "GPT-4o Mini"},
            ],
            "call": call,
        }
    except Exception:
        pass

# ── Google Gemini ──
def _init_google():
    try:
        import google.generativeai as genai
        api_key = os.environ.get("GOOGLE_API_KEY")
        if not api_key:
            return
        genai.configure(api_key=api_key)

        async def call(model, system, user_msg):
            m = genai.GenerativeModel(model, system_instruction=system)
            resp = m.generate_content(user_msg)
            return resp.text

        PROVIDERS["google"] = {
            "name": "Google",
            "models": [
                {"id": "gemini-2.0-flash", "label": "Gemini 2.0 Flash"},
                {"id": "gemini-2.5-pro-preview-06-05", "label": "Gemini 2.5 Pro"},
            ],
            "call": call,
        }
    except Exception:
        pass

# ── DeepSeek ──
def _init_deepseek():
    try:
        from openai import OpenAI
        api_key = os.environ.get("DEEPSEEK_API_KEY")
        if not api_key:
            return
        client = OpenAI(api_key=api_key, base_url="https://api.deepseek.com")

        async def call(model, system, user_msg):
            resp = client.chat.completions.create(
                model=model,
                max_tokens=1024,
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": user_msg},
                ],
            )
            return resp.choices[0].message.content

        PROVIDERS["deepseek"] = {
            "name": "DeepSeek",
            "models": [
                {"id": "deepseek-chat", "label": "DeepSeek V3"},
                {"id": "deepseek-reasoner", "label": "DeepSeek R1"},
            ],
            "call": call,
        }
    except Exception:
        pass

# ── Moonshot (Kimi) ──
def _init_moonshot():
    try:
        from openai import OpenAI
        api_key = os.environ.get("MOONSHOT_API_KEY")
        if not api_key:
            return
        client = OpenAI(api_key=api_key, base_url="https://api.moonshot.cn/v1")

        async def call(model, system, user_msg):
            resp = client.chat.completions.create(
                model=model,
                max_tokens=1024,
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": user_msg},
                ],
            )
            return resp.choices[0].message.content

        PROVIDERS["moonshot"] = {
            "name": "Kimi",
            "models": [
                {"id": "moonshot-v1-8k", "label": "Kimi v1"},
            ],
            "call": call,
        }
    except Exception:
        pass

# ── Zhipu (智谱 GLM) ──
def _init_zhipu():
    try:
        from openai import OpenAI
        api_key = os.environ.get("ZHIPU_API_KEY")
        if not api_key:
            return
        client = OpenAI(api_key=api_key, base_url="https://open.bigmodel.cn/api/paas/v4")

        async def call(model, system, user_msg):
            resp = client.chat.completions.create(
                model=model,
                max_tokens=1024,
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": user_msg},
                ],
            )
            return resp.choices[0].message.content

        PROVIDERS["zhipu"] = {
            "name": "智谱GLM",
            "models": [
                {"id": "glm-4-flash", "label": "GLM-4 Flash"},
            ],
            "call": call,
        }
    except Exception:
        pass

# Initialize all providers
_init_anthropic()
_init_openai()
_init_google()
_init_deepseek()
_init_moonshot()
_init_zhipu()

# ─── Tarot Prompt ─────────────────────────────────────────────────────

SYSTEM_PROMPT = """你是一位精通塔罗牌的赛博朋克风格 AI 占卜师，名叫「数据先知」。你的解读风格融合了传统塔罗牌的神秘智慧与赛博朋克的未来主义美学。

解读规则：
1. 用中文回答，语气神秘但不晦涩
2. 融入赛博朋克的意象（数据流、神经网络、虚拟现实等）
3. 给出具体、有启发性的建议
4. 如果是逆位，要特别说明逆位的含义
5. 如果是三牌阵，分别解读过去、现在、未来，最后给出综合分析
6. 控制在 300-500 字之间
7. 不要使用 markdown 格式符号（如 **、## 等），用纯文字和换行来组织内容"""

# ─── API Routes ───────────────────────────────────────────────────────

@app.get("/api/providers")
async def list_providers():
    """Return available AI providers and their models."""
    result = []
    for key, p in PROVIDERS.items():
        result.append({
            "id": key,
            "name": p["name"],
            "models": p["models"],
        })
    return result

class ReadingRequest(BaseModel):
    mode: str  # "single" or "three"
    cards: list[dict]  # [{name, name_en, number, is_reversed}]
    question: str = ""
    provider: str = ""  # provider id, e.g. "anthropic"
    model: str = ""     # model id, e.g. "claude-sonnet-4-20250514"

@app.post("/api/reading")
async def get_reading(req: ReadingRequest):
    # Build user message
    if req.mode == "single":
        card = req.cards[0]
        orientation = "逆位" if card["is_reversed"] else "正位"
        user_msg = f"请为我解读这张塔罗牌：{card['name']}（{card['name_en']}），{orientation}。"
        if req.question:
            user_msg += f"\n我的问题是：{req.question}"
    else:
        positions = ["过去", "现在", "未来"]
        card_desc = []
        for i, card in enumerate(req.cards):
            orientation = "逆位" if card["is_reversed"] else "正位"
            card_desc.append(f"{positions[i]}：{card['name']}（{card['name_en']}），{orientation}")
        user_msg = "请为我解读这个三牌阵：\n" + "\n".join(card_desc)
        if req.question:
            user_msg += f"\n我的问题是：{req.question}"

    # Resolve provider & model
    provider_id = req.provider
    model_id = req.model

    # Default to first available provider
    if not provider_id or provider_id not in PROVIDERS:
        if PROVIDERS:
            provider_id = next(iter(PROVIDERS))
        else:
            raise HTTPException(status_code=503, detail="没有可用的 AI 服务。请至少配置一个 API Key。")

    provider = PROVIDERS[provider_id]

    # Default to first model of the provider
    if not model_id:
        model_id = provider["models"][0]["id"]

    try:
        text = await provider["call"](model_id, SYSTEM_PROMPT, user_msg)
        return {"reading": text, "provider": provider["name"], "model": model_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI 解读失败：{str(e)}")

if __name__ == "__main__":
    import uvicorn
    print(f"✦ 已加载 AI 服务: {', '.join(p['name'] for p in PROVIDERS.values()) or '无（请配置 API Key）'}")
    uvicorn.run(app, host="0.0.0.0", port=8000)
