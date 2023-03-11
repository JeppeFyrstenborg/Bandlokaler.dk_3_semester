import { assert } from "chai";
import { sortBookingsByWeek } from "../test/testJsFiler/updateTimeslotsForTest.js";
import Bandbox from "../models/bandbox.js";
import User from "../models/user.js";

describe(
  "sortBookingsByWeek() - Sorting a bandbox's bookings into arrays per week. " +
    "A week here starts at 06:00 on a Monday and ends at 06:00 on a Sunday.",
  () => {
    it("Should put the three MID-week bookings into the correctly named week-arrays.", () => {
      //Arrange
      let bandbox1 = new Bandbox("001", "Bandbox 1", "Aarhus", 6);
      let user1 = new User(
        "111",
        ["Aarhus"],
        "pw",
        "email@email.com",
        "The Livers"
      );
      let startTime1 = new Date("November 23, 2022 13:00:00") / 1000;
      let endTime1 = new Date("November 23, 2022 15:00:00") / 1000;
      let booking1 = bandbox1.createBooking("1", startTime1, endTime1, user1);
      let correctWeekNumber1 = 47;

      let startTime2 = new Date("November 30, 2022 09:00:00") / 1000;
      let endTime2 = new Date("November 30, 2022 11:00:00") / 1000;
      let booking2 = bandbox1.createBooking("2", startTime2, endTime2, user1);
      let correctWeekNumber2 = 48;

      let startTime3 = new Date("December 1, 2022 13:00:00") / 1000;
      let endTime3 = new Date("December 1, 2022 15:00:00") / 1000;
      let booking3 = bandbox1.createBooking("3", startTime3, endTime3, user1);
      let correctWeekNumber3 = 48;

      //Act
      let sortedBandbox = sortBookingsByWeek(bandbox1);

      //Assert
      assert.equal(
        sortedBandbox.bookingsByWeek[correctWeekNumber1][0],
        booking1
      );
      assert.equal(
        sortedBandbox.bookingsByWeek[correctWeekNumber2][0],
        booking2
      );
      assert.equal(
        sortedBandbox.bookingsByWeek[correctWeekNumber3][1],
        booking3
      );
    });

    it("END-of-week bookings into the correctly named week-arrays.", () => {
      //Arrange
      let bandbox1 = new Bandbox("001", "Bandbox 1", "Aarhus", 6);
      let user1 = new User(
        "111",
        ["Aarhus"],
        "pw",
        "email@email.com",
        "The Livers"
      );
      let startTime1 = new Date("December 11, 2022 22:00:00") / 1000;
      let endTime1 = new Date("December 11, 2022 00:00:00") / 1000;
      let booking1 = bandbox1.createBooking("1", startTime1, endTime1, user1);
      let correctWeekNumber1 = 49;

      let startTime2 = new Date("December 11, 2022 23:00:00") / 1000;
      let endTime2 = new Date("December 12, 2022 02:00:00") / 1000;
      let booking2 = bandbox1.createBooking("2", startTime2, endTime2, user1);
      let correctWeekNumber2 = 49;

      let startTime3 = new Date("December 12, 2022 04:00:00") / 1000;
      let endTime3 = new Date("December 12, 2022 06:00:00") / 1000;
      let booking3 = bandbox1.createBooking("3", startTime3, endTime3, user1);
      let correctWeekNumber3 = 49;

      //Act
      let sortedBandbox = sortBookingsByWeek(bandbox1);

      //Assert
      assert.equal(
        sortedBandbox.bookingsByWeek[correctWeekNumber1][0],
        booking1
      );
      assert.equal(
        sortedBandbox.bookingsByWeek[correctWeekNumber2][1],
        booking2
      );
      assert.equal(
        sortedBandbox.bookingsByWeek[correctWeekNumber3][2],
        booking3
      );
    });

    it("START-of-week bookings into the correctly named week-arrays.", () => {
      //Arrange
      let bandbox1 = new Bandbox("001", "Bandbox 1", "Aarhus", 6);
      let user1 = new User(
        "111",
        ["Aarhus"],
        "pw",
        "email@email.com",
        "The Livers"
      );
      let startTime1 = new Date("November 28, 2022 07:00:00") / 1000;
      let endTime1 = new Date("November 28, 2022 10:00:00") / 1000;
      let booking1 = bandbox1.createBooking("1", startTime1, endTime1, user1);
      let correctWeekNumber1 = 48;

      let startTime2 = new Date("November 28, 2022 06:00:00") / 1000;
      let endTime2 = new Date("November 28, 2022 09:00:00") / 1000;
      let booking2 = bandbox1.createBooking("2", startTime2, endTime2, user1);
      let correctWeekNumber2 = 48;

      let startTime3 = new Date("November 28, 2022 06:00:00") / 1000;
      let endTime3 = new Date("November 28, 2022 10:00:00") / 1000;
      let booking3 = bandbox1.createBooking("3", startTime3, endTime3, user1);
      let correctWeekNumber3 = 48;

      //Act
      let sortedBandbox = sortBookingsByWeek(bandbox1);

      //Assert
      assert.equal(
        sortedBandbox.bookingsByWeek[correctWeekNumber1][0],
        booking1
      );
      assert.equal(
        sortedBandbox.bookingsByWeek[correctWeekNumber2][1],
        booking2
      );
      assert.equal(
        sortedBandbox.bookingsByWeek[correctWeekNumber3][2],
        booking3
      );
    });

    it(
      "Bookings which are a part of two weeks (time from Sunday into Monday) " +
        "should be split into two bookings.",
      () => {
        //Arrange
        let bandbox1 = new Bandbox("001", "Bandbox 1", "Aarhus", 6);
        let user1 = new User(
          "111",
          ["Aarhus"],
          "pw",
          "email@email.com",
          "The Livers"
        );
        // Split start and end times will always be at 06:00
        let splitEndTime = new Date("November 28, 2022 06:00:00") / 1000;
        let splitStartTime = new Date("November 28, 2022 06:00:00") / 1000;

        let startTime1 = new Date("November 28, 2022 04:00:00") / 1000;
        let endTime1 = new Date("November 28, 2022 07:00:00") / 1000;
        let booking1 = bandbox1.createBooking("1", startTime1, endTime1, user1);
        let correctWeekNumber1SplitEarly = 47;
        let correctWeekNumber1SplitLate = 48;

        let startTime2 = new Date("November 28, 2022 05:00:00") / 1000;
        let endTime2 = new Date("November 28, 2022 10:00:00") / 1000;
        let booking2 = bandbox1.createBooking("2", startTime2, endTime2, user1);
        let correctWeekNumber2SplitEarly = 47;
        let correctWeekNumber2SplitLate = 48;

        //Act
        let sortedBandbox = sortBookingsByWeek(bandbox1);

        //Assert
        // Booking 1, early split
        assert.equal(
          sortedBandbox.bookingsByWeek[correctWeekNumber1SplitEarly][0]
            .startTime,
          startTime1
        );
        assert.equal(
          sortedBandbox.bookingsByWeek[correctWeekNumber1SplitEarly][0].endTime,
          splitEndTime
        );
        assert.equal(
          sortedBandbox.bookingsByWeek[correctWeekNumber1SplitEarly][0].user
            .userID,
          user1.userID
        );

        // Booking 1, late split
        assert.equal(
          sortedBandbox.bookingsByWeek[correctWeekNumber1SplitLate][0]
            .startTime,
          splitStartTime
        );
        assert.equal(
          sortedBandbox.bookingsByWeek[correctWeekNumber1SplitLate][0].endTime,
          endTime1
        );

        // Booking 2, early split
        assert.equal(
          sortedBandbox.bookingsByWeek[correctWeekNumber2SplitEarly][1]
            .startTime,
          startTime2
        );
        assert.equal(
          sortedBandbox.bookingsByWeek[correctWeekNumber2SplitEarly][1].endTime,
          splitEndTime
        );
        assert.equal(
          sortedBandbox.bookingsByWeek[correctWeekNumber2SplitEarly][1].user
            .userID,
          user1.userID
        );

        // Booking 2, late split
        assert.equal(
          sortedBandbox.bookingsByWeek[correctWeekNumber2SplitLate][1]
            .startTime,
          splitStartTime
        );
        assert.equal(
          sortedBandbox.bookingsByWeek[correctWeekNumber2SplitLate][1].endTime,
          endTime2
        );
      }
    );
  }
);
