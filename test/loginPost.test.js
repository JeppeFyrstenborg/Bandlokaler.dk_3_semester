import request from "supertest";
import { assert } from "chai";
import { expect } from "chai";
import { should } from "chai";
import app from "../app.js";

describe("Posts from loginform to login route. Both not working and working username and password.", () => {
  let wrongUser = { email: "testuser", password: "testPassword1@" };
  it("post(/login)", async () => {
    let response = await request(app)
      .post("/login")
      .send(wrongUser)
      .set("Accept", "application/json")
      .expect(200)
      .expect("Content-Type", /json/);
    assert.equal(response.status, 200);
    response.body.message.should.be.equal(
      "The email address or password is incorrect. Please retry..."
    );
    let responseToCalendar = await request(app).get("/calendar").expect(200);
    assert.equal(responseToCalendar.status, 200);
  });
});
