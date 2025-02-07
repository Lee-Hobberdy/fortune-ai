document.addEventListener("DOMContentLoaded", function() {
    // 1. 测字
    const predictBtn = document.getElementById("predict-btn");
    const charInput = document.getElementById("char-input");
    const predictResult = document.getElementById("predict-result");
  
    predictBtn.addEventListener("click", function() {
      const charVal = charInput.value.trim();
      if (!charVal) {
        alert("请输入一个汉字！");
        return;
      }
      fetch("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ char: charVal })
      })
        .then(response => response.json())
        .then(data => {
          predictResult.textContent = data.result;
        })
        .catch(err => {
          console.error("测字接口出错：", err);
          predictResult.textContent = "测字AI接口出错，请稍后再试。";
        });
    });
  
    // 2. 聊天
    const chatBtn = document.getElementById("chat-btn");
    const chatInput = document.getElementById("chat-input");
    const chatResponse = document.getElementById("chat-response");
  
    chatBtn.addEventListener("click", function() {
      const msg = chatInput.value.trim();
      if (!msg) {
        alert("请输入问题！");
        return;
      }
      fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg })
      })
        .then(response => response.json())
        .then(data => {
          chatResponse.textContent = data.response;
        })
        .catch(err => {
          console.error("聊天接口出错：", err);
          chatResponse.textContent = "聊天AI接口出错，请稍后再试。";
        });
    });
  });
  