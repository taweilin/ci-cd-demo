const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// 啟用 JSON 解析中間件
app.use(express.json());

// 基本路由
app.get("/", (req, res) => {
  res.send("Hello CI/CD World!");
});

// API 狀態端點
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'online', 
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date()
  });
});

// 簡單的用戶 API
const users = [
  { id: 1, name: "Alice", role: "admin" },
  { id: 2, name: "Bob", role: "user" },
  { id: 3, name: "Charlie", role: "user" }
];

// 獲取所有用戶
app.get('/api/users', (req, res) => {
  res.json(users);
});

// 獲取單個用戶
app.get('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ error: '找不到用戶' });
  }
  
  res.json(user);
});

// 創建新用戶 (POST 示例)
app.post('/api/users', (req, res) => {
  const { name, role } = req.body;
  
  if (!name || !role) {
    return res.status(400).json({ error: '需要 name 和 role 字段' });
  }
  
  const newUser = {
    id: users.length + 1,
    name,
    role
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
});

// 健康檢查端點
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date(),
    memory: process.memoryUsage()
  });
});

// 提供靜態文件 (如果需要)
app.use('/static', express.static('public'));

// 簡單的 HTML 頁面 (顯示用戶列表)
app.get('/users-page', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>用戶列表</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        h1 { color: #333; }
        .user-list { list-style: none; padding: 0; }
        .user-item { 
          padding: 10px; 
          margin-bottom: 10px; 
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .admin { background-color: #f8f8f8; }
      </style>
    </head>
    <body>
      <h1>用戶列表</h1>
      <ul class="user-list">
        ${users.map(user => `
          <li class="user-item ${user.role === 'admin' ? 'admin' : ''}">
            <strong>ID:</strong> ${user.id}<br>
            <strong>名稱:</strong> ${user.name}<br>
            <strong>角色:</strong> ${user.role}
          </li>
        `).join('')}
      </ul>
    </body>
    </html>
  `);
});

// 處理 404 錯誤
app.use((req, res) => {
  res.status(404).send('頁面不存在');
});

// 處理服務器錯誤
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('伺服器發生錯誤');
});

// 只有在直接執行此檔案時才啟動伺服器
if (require.main === module) {
  const server = app.listen(port, () => {
    console.log(`應用程式執行於 http://localhost:${port}`);
  });
}

module.exports = app;