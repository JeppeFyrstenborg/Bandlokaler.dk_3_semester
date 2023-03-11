import { assert } from "chai";

import { verifyPasswordInput } from "../test/testJsFiler/passwordFunctionsForTest.js";

describe("Checking password for containing small and big letters, lenght of 8, a number and a speciel char.", function () {
  let password = "aA&12345";

  it("Password should contain all", function () {
    let res = verifyPasswordInput(password);
    assert.isTrue(res);
  });
  it("Password should not contain a capital letter but everything else.", function () {
    password = "a&123458";
    let res = verifyPasswordInput(password);
    assert.isFalse(res);
  });
  it("Password should not contain a small letter but everything else.", function () {
    password = "A&123456";
    let res = verifyPasswordInput(password);
    assert.isFalse(res);
  });
  it("Password should not contain a special char but everything else.", function () {
    password = "aA123456";
    let res = verifyPasswordInput(password);
    assert.isFalse(res);
  });
  it("Password should not contain a number but everything else.", function () {
    password = "aA&bbbbb";
    let res = verifyPasswordInput(password);
    assert.isFalse(res);
  });
  it("Password should not have a lenght of 8 but everything else.", function () {
    password = "aA&1234";
    let res = verifyPasswordInput(password);
    assert.isFalse(res);
  });
  it("8 blanks", function () {
    password = "         ";
    let res = verifyPasswordInput(password);
    assert.isFalse(res);
  });
  it("Lenght more than 30", function () {
    password = "aA&1234567891234567891234567891234";
    let res = verifyPasswordInput(password);
    assert.isFalse(res);
  });
});
