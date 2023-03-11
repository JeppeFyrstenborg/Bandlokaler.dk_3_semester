import request from "supertest";
import { assert } from "chai";
import app from "../app.js";

describe("Checking route to login-page. To url /login.", () => {
  it("get('/login')", async () => {
    let response = await request(app).get("/login").expect(200);
    assert.equal(response.status, 200);
  });
});
