from flask import Flask, request, jsonify, render_template, Response
from openai import OpenAI  # 使用 SiliconFlowd 提供的 OpenAI 兼容库
import os
from dotenv import load_dotenv
import random

app = Flask(__name__)

###############################################################################
# 1) 配置 SiliconFlowd API
###############################################################################
# 加载 .env 文件
load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),  # 确保 .env 里是 "OPENAI_API_KEY"
    base_url="https://api.siliconflow.cn/v1"
)

###############################################################################
# 2) 首页 → 自动跳转到测字页面
###############################################################################
@app.route('/')
def index():
    return render_template('measure.html')

###############################################################################
# 3) 添加 "/chatpage" 路由 (修复 404 Not Found)
###############################################################################
@app.route('/chatpage')
def chat_page():
    """ 渲染与玄学大师对话的页面 chat.html """
    return render_template('chat.html')

###############################################################################
# 4) 測字接口 /predict
###############################################################################
@app.route('/predict', methods=['POST'])
def predict():
    """ 调用 SiliconFlowd API 进行测字预测 """
    data = request.get_json()
    char = data.get("char", "").strip()

    if not char:
        return jsonify({"result": "你没有输入任何字，请重新输入。"})

    system_prompt = (
        "你是一位古老的测字大师，精通易经、奇门遁甲、汉字文化。"
        "用户输入一个汉字，你需要从玄学角度进行分析。"
        "请分为三个部分：\n"
        "1. 字形解析（从字形、偏旁、易经角度展开）\n"
        "2. 玄学推测（结合易经、五行、八卦进行预兆推断）\n"
        "3. 指导建议（给用户提供一些可参考或验证的建议）\n"
    )

    try:
        response = client.chat.completions.create(
            model="deepseek-ai/DeepSeek-V2.5",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"测字：{char}。请按照上述格式分析。" }
            ],
            stream=False  # 测字不需要流式
        )

        result = response.choices[0].message.content.strip()
        return jsonify({"result": result})

    except Exception as e:
        print("调用 SiliconFlowd 测字出错:", e)
        return jsonify({"result": "测字 AI 接口出错，请稍后再试。"})

###############################################################################
# 5) 聊天接口 /chat
###############################################################################
@app.route('/chat', methods=['POST'])
def chat():
    """ 调用 SiliconFlowd API 进行对话 """
    data = request.get_json()
    user_message = data.get("message", "").strip()

    if not user_message:
        return jsonify({"response": "你没有输入任何问题，请重新输入。"})

    system_prompt = (
        "你是一位玄学大师，精通奇门遁甲、易经、梅花易数等术法。"
        "请始终按照以下三段式作答：\n"
        "1. 卦象分析（从易经、奇门遁甲角度说明你的解读思路）\n"
        "2. 综合推断（根据卦象给出的具体推理和结论）\n"
        "3. 验证建议（给出可操作的建议，让用户能尝试验证或参考）\n"
    )

    try:
        response = client.chat.completions.create(
            model="deepseek-ai/DeepSeek-V2.5",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            stream=False
        )

        result = response.choices[0].message.content.strip()
        return jsonify({"response": result})

    except Exception as e:
        print("调用 SiliconFlowd 聊天出错:", e)
        return jsonify({"response": "聊天 AI 接口出错，请稍后再试。"}), 500

###############################################################################
# 6) 每日老黄历背景图 API
###############################################################################
background_images = [
    "https://example.com/lunar1.jpg",
    "https://example.com/lunar2.jpg",
    "https://example.com/lunar3.jpg"
]

@app.route('/daily-bg')
def daily_bg():
    """返回每日老黄历背景图"""
    return jsonify({"bg_url": random.choice(background_images)})

###############################################################################
# 7) 启动 Flask 服务器
###############################################################################
if __name__ == "__main__":
    app.run(debug=True)
