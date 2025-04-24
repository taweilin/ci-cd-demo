const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello CI/CD World!");
});

// 只有在直接執行此檔案時才啟動伺服器
if (require.main === module) {
  app.listen(port, () => {
    console.log(`應用程式執行於 http://localhost:${port}`);
  });
}

module.exports = app;