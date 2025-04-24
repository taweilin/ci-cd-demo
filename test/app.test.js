// 創建測試檔案
const request = require("supertest");
const app = require("../app");

describe("GET /", () => {
  it("應該回傳 Hello CI/CD World!", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello CI/CD World!");
  });
});