const request = require("supertest");
const app = require("../app");

// 保存伺服器實例以便後續關閉
let server;

// 測試前啟動伺服器
beforeAll(() => {
  server = app.listen(4000);
});

// 測試後關閉伺服器
afterAll((done) => {
  server.close(done);
});

describe("基本路由測試", () => {
  it("GET / - 應該回傳 Hello CI/CD World!", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello CI/CD World!");
  });

  it("GET /non-existent - 應該回傳 404", async () => {
    const response = await request(app).get("/non-existent");
    expect(response.status).toBe(404);
    expect(response.text).toBe("頁面不存在");
  });
});

describe("API 測試", () => {
  it("GET /api/status - 應該回傳 API 狀態", async () => {
    const response = await request(app).get('/api/status');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status');
    expect(response.body.status).toBe('online');
    expect(response.body).toHaveProperty('version');
    expect(response.body).toHaveProperty('timestamp');
  });

  it("GET /health - 應該回傳健康狀態", async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status');
    expect(response.body.status).toBe('healthy');
    expect(response.body).toHaveProperty('uptime');
    expect(response.body).toHaveProperty('memory');
  });
});

describe("用戶 API 測試", () => {
  it("GET /api/users - 應該回傳所有用戶", async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("GET /api/users/1 - 應該回傳特定用戶", async () => {
    const response = await request(app).get('/api/users/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('role');
  });

  it("GET /api/users/999 - 不存在的用戶應該回傳 404", async () => {
    const response = await request(app).get('/api/users/999');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

  it("POST /api/users - 應該創建新用戶", async () => {
    const newUser = {
      name: 'David',
      role: 'user'
    };
    
    const response = await request(app)
      .post('/api/users')
      .send(newUser)
      .set('Accept', 'application/json');
      
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('David');
    expect(response.body.role).toBe('user');
  });

  it("POST /api/users - 缺少必要字段應該回傳 400", async () => {
    const incompleteUser = {
      name: 'Eve'
      // 缺少 role 字段
    };
    
    const response = await request(app)
      .post('/api/users')
      .send(incompleteUser)
      .set('Accept', 'application/json');
      
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});

describe("HTML 頁面測試", () => {
  it("GET /users-page - 應該回傳包含用戶列表的 HTML", async () => {
    const response = await request(app).get('/users-page');
    expect(response.status).toBe(200);
    expect(response.text).toContain('<!DOCTYPE html>');
    expect(response.text).toContain('用戶列表');
  });
});