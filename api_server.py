#!/usr/bin/env python3
"""Tarot AI interpretation backend using Anthropic Claude."""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from anthropic import Anthropic
import json

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

client = Anthropic()

class ReadingRequest(BaseModel):
    mode: str  # "single" or "three"
    cards: list[dict]  # [{name, name_en, number, is_reversed}]
    question: str = ""

SYSTEM_PROMPT = """你是一位精通塔罗牌的赛博朋克风格 AI 占卜师，名叫「数据先知」。你的解读风格融合了传统塔罗牌的神秘智慧与赛博朋克的未来主义美学。

解读规则：
1. 用中文回答，语气神秘但不晦涩
2. 融入赛博朋克的意象（数据流、神经网络、虚拟现实等）
3. 给出具体、有启发性的建议
4. 如果是逆位，要特别说明逆位的含义
5. 如果是三牌阵，分别解读过去、现在、未来，最后给出综合分析
6. 控制在 300-500 字之间
7. 不要使用 markdown 格式符号（如 **、## 等），用纯文字和换行来组织内容"""

@app.post("/api/reading")
async def get_reading(req: ReadingRequest):
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
        user_msg = f"请为我解读这个三牌阵：\n" + "\n".join(card_desc)
        if req.question:
            user_msg += f"\n我的问题是：{req.question}"

    message = client.messages.create(
        model="claude_sonnet_4_6",
        max_tokens=1024,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_msg}],
    )
    
    return {"reading": message.content[0].text}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
