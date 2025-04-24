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

describe("GET /", () => {
  it("應該回傳 Hello CI/CD World!", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello CI/CD World!");
  });

  // 在 test/app.test.js 中添加
  it('應該回傳 API 狀態', async () => {
    const response = await request(app).get('/api/status');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status');
    expect(response.body.status).toBe('online');
  });
});

