/**
 * global.js
 * 用于两页共用的“每日背景”逻辑
 * 在HTML中先加载global.js，然后再加载 measure.js/chat.js
 */

function setDailyBackground() {
    fetch("/daily-bg")
      .then(res => res.json())
      .then(data => {
        const url = data.url;
        // 这里将 body::before 改成这张图片
        document.body.style.setProperty("--bg-url", `url(${url})`);
        // 在 global.css 可以这样用:
        // body::before { background: var(--bg-url) no-repeat center/cover; }
        document.body.style.backgroundImage = `url(${url})`;
      })
      .catch(err => {
        console.error("获取每日背景出错：", err);
        // 如果失败，就用默认背景
      });
  }
  