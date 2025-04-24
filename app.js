# 創建 app.js 檔案
echo 'const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello CI/CD World!");
});

app.listen(port, () => {
  console.log(`應用程式執行於 http://localhost:${port}`);
});

module.exports = app;' > app.js