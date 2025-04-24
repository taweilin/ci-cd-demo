const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello CI/CD World!");
});

// 在 app.js 中添加新的路由
app.get('/api/status', (req, res) => {
    res.json({ status: 'online', version: '1.0.0' });
  });
  
// 添加簡單的 404 處理
app.use((req, res) => {
res.status(404).send('頁面不存在');
});

// 只有在直接執行此檔案時才啟動伺服器
if (require.main === module) {
  app.listen(port, () => {
    console.log(`應用程式執行於 http://localhost:${port}`);
  });
}

module.exports = app;