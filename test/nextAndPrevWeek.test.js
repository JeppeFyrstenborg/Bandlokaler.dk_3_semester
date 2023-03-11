import { assert } from "chai";
import { nextWeekTest } from "../test/testJsFiler/calendarFunctionsForTests.js";
import { previousWeekTest } from "../test/testJsFiler/calendarFunctionsForTests.js";

//Setup up dates
let mondayDate = new Date("2022-11-21");
let tuesdayDate = new Date("2022-11-22");
let wednesdayDate = new Date("2022-11-23");
let thursdayDate = new Date("2022-11-24");
let fridayDate = new Date("2022-11-25");
let saturdayDate = new Date("2022-11-26");
let sundayDate = new Date("2022-11-27");

//Tests for next week
describe("When going in to next week", () => {
  it("Monday should be incremented by 7 days and still be correct if going into the next month", () => {
    //Calling function to be tested
    nextWeekTest(
      mondayDate,
      tuesdayDate,
      wednesdayDate,
      thursdayDate,
      fridayDate,
      saturdayDate,
      sundayDate
    );

    //Expected result
    const expectedResultMon = new Date("2022-11-28");

    //asserting dates are the same
    assert.deepEqual(mondayDate, expectedResultMon);
  });
  it("Tuesday should be incremented by 7 days and still be correct if going into the next month", () => {
    //Expected result
    const expectedResultTue = new Date("2022-11-29");

    //asserting dates are the same
    assert.deepEqual(tuesdayDate, expectedResultTue);
  });
  it("Wednesday should be incremented by 7 days and still be correct if going into the next month", () => {
    //Expected result
    const expectedResultWed = new Date("2022-11-30");

    //asserting dates are the same
    assert.deepEqual(wednesdayDate, expectedResultWed);
  });
  it("Thursday should be incremented by 7 days and still be correct if going into the next month", () => {
    //Expected result
    const expectedResultThur = new Date("2022-12-01");

    //asserting dates are the same
    assert.deepEqual(thursdayDate, expectedResultThur);
  });
});

//Tests for previous Week
describe("When going back to the previous week", () => {
  it("Monday should be rolled back by 7 days and still be correct if going back a month", () => {
    //Calling function to be tested
    previousWeekTest(
      mondayDate,
      tuesdayDate,
      wednesdayDate,
      thursdayDate,
      fridayDate,
      saturdayDate,
      sundayDate
    );

    //Expected result
    const expectedResultMon = new Date("2022-11-21");

    //asserting dates are the same
    assert.deepEqual(mondayDate, expectedResultMon);
  });
  it("Tuesday should be rolled back by 7 days and still be correct if going into the next month", () => {
    //Expected result
    const expectedResultTue = new Date("2022-11-22");

    //asserting dates are the same
    assert.deepEqual(tuesdayDate, expectedResultTue);
  });
  it("Wednesday should be rolled back by 7 days and still be correct if going into the next month", () => {
    //Expected result
    const expectedResultWed = new Date("2022-11-23");

    //asserting dates are the same
    assert.deepEqual(wednesdayDate, expectedResultWed);
  });
  it("Thursday should be rolled back by 7 days and still be correct if going into the next month", () => {
    //Expected result
    const expectedResultThur = new Date("2022-11-24");

    //asserting dates are the same
    assert.deepEqual(thursdayDate, expectedResultThur);
  });
});
