document.addEventListener("DOMContentLoaded", function() {
    const chatBtn = document.getElementById("chat-btn");
    const chatInput = document.getElementById("chat-input");
    const chatResponse = document.getElementById("chat-result");

    chatBtn.addEventListener("click", function() {
        const userMessage = chatInput.value.trim();
        if (!userMessage) {
            alert("请输入您的问题！");
            return;
        }

        chatResponse.innerHTML = "<p style='color: gray;'>正在计算中，请稍候...</p>";

        fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage })
        })
        .then(response => {
            // **检查是否返回 JSON**
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("服务器返回的不是 JSON 格式！");
            }
            return response.json();
        })
        .then(data => {
            chatResponse.innerHTML = `<p><strong>AI 预测：</strong></p><p>${data.response}</p>`;
        })
        .catch(err => {
            console.error("聊天接口出错：", err);
            chatResponse.innerHTML = "<p style='color:red;'>AI 接口出错，请稍后再试。</p>";
        });
    });
});
document.addEventListener("DOMContentLoaded", function() {
    const chatBtn = document.getElementById("chat-btn");
    const chatInput = document.getElementById("chat-input");
    const chatResponse = document.getElementById("chat-result");
    const chatLoading = document.getElementById("chat-loading");

    chatBtn.addEventListener("click", function() {
        const userMessage = chatInput.value.trim();
        if (!userMessage) {
            alert("请输入您的问题！");
            return;
        }

        // 显示“计算中”提示
        chatLoading.style.display = "block";
        chatResponse.innerHTML = ""; // 清空上次回答

        fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage })
        })
        .then(response => response.json())
        .then(data => {
            // 计算完成，隐藏“计算中”提示
            chatLoading.style.display = "none";
            chatResponse.innerHTML = `<p><strong>大师答：</strong></p><p>${data.response}</p>`;
        })
        .catch(err => {
            console.error("聊天接口出错：", err);
            chatLoading.style.display = "none";
            chatResponse.innerHTML = "<p style='color:red;'>AI 接口出错，请稍后再试。</p>";
        });
    });
});
