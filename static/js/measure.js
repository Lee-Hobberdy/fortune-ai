document.addEventListener("DOMContentLoaded", function() {
    const measureBtn = document.getElementById("measure-btn");
    const charInput = document.getElementById("char-input");
    const measureResult = document.getElementById("measure-result");
    const modal = document.getElementById("result-modal");
    const closeModal = document.getElementById("close-modal");
    const gotoChatBtn = document.getElementById("goto-chat-btn");
    const loadingMessage = document.getElementById("loading-message");

    // 点击测字按钮
    measureBtn.addEventListener("click", function() {
        const charVal = charInput.value.trim();
        if (!charVal) {
            alert("请输入一个汉字！");
            return;
        }

        // 显示“计算中”提示
        loadingMessage.style.display = "block";
        measureResult.innerHTML = ""; // 清空上次结果
        modal.style.display = "none";

        fetch("/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ char: charVal })
        })
        .then(response => response.json())
        .then(data => {
            // 计算结束，隐藏“计算中”提示
            loadingMessage.style.display = "none";
            measureResult.innerHTML = `<p><strong>测字结果：</strong></p><p>${data.result}</p>`;
            modal.style.display = "block";  // 显示弹窗
        })
        .catch(err => {
            console.error("测字接口出错：", err);
            loadingMessage.style.display = "none";
            measureResult.innerHTML = "<p style='color:red;'>测字 AI 接口出错，请稍后再试。</p>";
            modal.style.display = "block";  // 仍然显示弹窗
        });
    });

    // 关闭弹窗
    closeModal.addEventListener("click", function() {
        modal.style.display = "none";
    });

    // 点击 "去与大师对话" 按钮，跳转到对话页面
    gotoChatBtn.addEventListener("click", function() {
        window.location.href = "/chatpage";
    });
});
