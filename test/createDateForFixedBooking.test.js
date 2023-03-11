import { assert } from "chai";
import { createDateForFixedBooking } from "../controllers/modelController.js";

describe("createDateForFixedBooking() - Creating a date object from the provided weekday and hour from a fixed booking.", () => {
  it("Should return exeption if wrong weekday parameter format", () => {
    //Arrange
    const providedWeekday1 = "Søn";
    const providedWeekday2 = "Man";
    const providedWeekday3 = "Saturday";
    const expected = Error;

    //Act and assert
    assert.throws(
      () => createDateForFixedBooking(providedWeekday1, 11),
      expected
    );
    assert.throws(
      () => createDateForFixedBooking(providedWeekday2, 11),
      expected
    );
    assert.throws(
      () => createDateForFixedBooking(providedWeekday3, 11),
      expected
    );
  });

  it("Should return correct weekday and hour from a date object for a midweek weekday and hour", () => {
    //Arrange
    const providedWeekday = "Thu";
    const providedHour = 13;
    const date = new Date("December 8, 2022 13:00:00");
    const expectedWeekday = date.getDay();
    const expectedHour = date.getHours();

    //Act
    const createdDate = createDateForFixedBooking(
      providedWeekday,
      providedHour
    );
    const exerciseWeekday = createdDate.getDay();
    const exerciseHour = createdDate.getHours();

    //Assert
    assert.equal(exerciseWeekday, expectedWeekday);
    assert.equal(exerciseHour, expectedHour);
  });

  it("EARLY-week weekday and hour", () => {
    //Arrange
    const providedWeekday = "Mon";
    const providedHour1 = 0;
    const providedHour2 = 2;
    const date1 = new Date("December 5, 2022 00:00:00");
    const date2 = new Date("December 5, 2022 02:00:00");
    const expectedWeekday = date1.getDay();
    const expectedHour1 = date1.getHours();
    const expectedHour2 = date2.getHours();

    //Act
    const createdDate1 = createDateForFixedBooking(
      providedWeekday,
      providedHour1
    );
    const exerciseWeekday1 = createdDate1.getDay();
    const exerciseHour1 = createdDate1.getHours();

    const createdDate2 = createDateForFixedBooking(
      providedWeekday,
      providedHour2
    );
    const exerciseWeekday2 = createdDate2.getDay();
    const exerciseHour2 = createdDate2.getHours();

    //Assert
    assert.equal(exerciseWeekday1, expectedWeekday);
    assert.equal(exerciseHour1, expectedHour1);

    assert.equal(exerciseWeekday2, expectedWeekday);
    assert.equal(exerciseHour2, expectedHour2);
  });

  it("LATE-week weekday and hour", () => {
    //Arrange
    const providedWeekday1 = "Sun";
    const providedWeekday2 = "Sat";
    const providedHour1 = 23;
    const providedHour2 = 9;
    const date1 = new Date("December 11, 2022 23:00:00");
    const date2 = new Date("December 10, 2022 09:00:00");
    const expectedWeekday1 = date1.getDay();
    const expectedWeekday2 = date2.getDay();
    const expectedHour1 = date1.getHours();
    const expectedHour2 = date2.getHours();

    //Act
    const createdDate1 = createDateForFixedBooking(
      providedWeekday1,
      providedHour1
    );
    const exerciseWeekday1 = createdDate1.getDay();
    const exerciseHour1 = createdDate1.getHours();

    const createdDate2 = createDateForFixedBooking(
      providedWeekday2,
      providedHour2
    );
    const exerciseWeekday2 = createdDate2.getDay();
    const exerciseHour2 = createdDate2.getHours();

    //Assert
    assert.equal(exerciseWeekday1, expectedWeekday1);
    assert.equal(exerciseHour1, expectedHour1);

    assert.equal(exerciseWeekday2, expectedWeekday2);
    assert.equal(exerciseHour2, expectedHour2);
  });
});
