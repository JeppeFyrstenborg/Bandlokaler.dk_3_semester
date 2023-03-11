/**
 * Updates timeslots in the calender for the chosen week and bandbox.
 *
 * PRE: The bandbox must have a bookingsByWeek object (use sortBookingsByWeek() before using this function).
 * @param {*} weekNumberParam The week number you want to set the timeslots for
 * @param {*} bandboxParam The bandbox you want to set timeslots for
 */
export function updateTimeslotsBandbox(weekNumberParam, bandboxParam) {
  let weekdaysBeginSun = ["Soen", "Man", "Tir", "Ons", "Tor", "Fre", "Loer"];
  bandboxParam.bookingsByWeek[weekNumberParam].forEach((booking) => {
    let startTimeDate = new Date(booking.startTime * 1000);
    let endTimeDate = new Date(booking.endTime * 1000);
    // console.log("startTimeDate: " + startTimeDate);
    // console.log("endTimeDate: " + endTimeDate);
    // console.log("-------------------------------");

    // Finds the difference in hours between start and end of the booking
    let dateDiff = Math.abs(endTimeDate - startTimeDate); // dateDiff is in miliseconds
    let hoursDiff = Math.ceil(dateDiff / (1000 * 60 * 60)); // converts from ms to hours

    // Sets all timeSlot-cells used by the week's bookings to a white background color.
    // First time slot in a booking shows the hours of the booking [xx:00 - xx:00].
    let startTimeCopy = new Date(startTimeDate.getTime()); // startTimeCopy will be incremented in the loop
    for (let i = 0; i < hoursDiff; i++) {
      // FIrst we find the weekdayCell (timeslot) we want to put the booking into
      let weekdayCell;
      // Becuase the 24 timeslots in a day (in the view) are from 06:00 - 06:00 (the next day),
      // we have to adjust the timeslot ID to the former day if the booking is in the first 6 hours of a day.
      if (startTimeCopy.getHours() < 6 && startTimeCopy.getDay() == 1) {
        // If the booking starts in the first 6 hours of the day and its a Monday.
        // This means the booking actually starts on next week's Monday,
        // but our calendar shows the next week's 00:00 - 06:00 Monday times in the last timeslots on Sunday
        weekdayCell = document.getElementById(
          "weekdayCell" + weekdaysBeginSun[0] + startTimeCopy.getHours()
        );
      } else if (startTimeCopy.getHours() < 6) {
        // If the booking starts in the first 6 hours of another day than Monday
        weekdayCell = document.getElementById(
          "weekdayCell" +
            weekdaysBeginSun[subtractHours(24, startTimeCopy).getDay()] +
            startTimeCopy.getHours()
        );
      } else {
        // If the booking is in the other hours of the day
        weekdayCell = document.getElementById(
          "weekdayCell" +
            weekdaysBeginSun[startTimeCopy.getDay()] +
            startTimeCopy.getHours()
        );
      }

      // Now we put the booking into the right weekdayCells (timeslots)
      if (i == 0) {
        let prevWeekdayCell = document.getElementById(
          "weekdayCell" +
            weekdaysBeginSun[startTimeCopy.getDay()] +
            (startTimeCopy.getHours() - 1)
        );
        prevWeekdayCell.style.marginBottom = "0.3rem";
        prevWeekdayCell.style.borderRadius = "0px 0px 10px 10px";
        // If it's the first hour of the booking
        weekdayCell.style.borderRadius = "10px 10px 0px 0px";
        weekdayCell.innerHTML =
          startTimeDate.getHours() + ":00 - " + endTimeDate.getHours() + ":00";
      } else if (i == 1) {
        weekdayCell.innerHTML = booking.user.bandName;
      } else {
        weekdayCell.innerHTML = "";
      }

      if (i === hoursDiff - 1) {
        weekdayCell.style.marginBottom = "0.3rem";
        weekdayCell.style.borderRadius = "0px 0px 10px 10px";
      }
      // If it's the last hour of the booking we in some instances set the next timeslot to "Ledig":
      if (i == hoursDiff - 1) {
        let nextWeekdayCell;
        startTimeCopy = addHours(1, startTimeCopy);
        if (startTimeCopy.getHours() < 6) {
          // If the next timeslot is at hour 00:00 to 05:00, get the day before
          nextWeekdayCell = document.getElementById(
            "weekdayCell" +
              weekdaysBeginSun[subtractHours(24, startTimeCopy).getDay()] +
              startTimeCopy.getHours()
          );
        } else if (startTimeCopy.getHours() > 5) {
          // If the next timeslot is at 06:00 and above
          nextWeekdayCell = document.getElementById(
            "weekdayCell" +
              weekdaysBeginSun[startTimeCopy.getDay()] +
              startTimeCopy.getHours()
          );
        }
        if (nextWeekdayCell.innerHTML == "") {
          // If a booking isn't already in the nextWeekdayCell
          nextWeekdayCell.innerHTML = "Ledig";
          nextWeekdayCell.style.color = "white";
          nextWeekdayCell.style.backgroundColor = "var(--grey)";
          nextWeekdayCell.style.borderRadius = "10px 10px 0px 0px";
        }
      }
      weekdayCell.style.backgroundColor = "var(--red)";

      // Increment dateAdjusted by 1 hour (go to next hour of the booking)
      startTimeCopy = addHours(1, startTimeCopy);
    }
  });
}

/**
 * Adds a number of hours to a date object.
 * Returns a new date object (doesn't change the old).
 * @param {Number} numOfHours Hours to add
 * @param {Date} date Date object to add hours to
 * @returns
 */
export function addHours(numOfHours, date) {
  let copiedDate = new Date(date.getTime());
  // getTime() gets the number of milliseconds since the Unix Epoch.
  // numOfHours * 60 * 60 * 1000 converts parameter to miliseconds.
  copiedDate.setTime(copiedDate.getTime() + numOfHours * 60 * 60 * 1000);
  return copiedDate;
}

/**
 * Subtracts a number of hours from a date object.
 * Returns a new date object (doesn't change the old).
 * @param {Number} numOfHours Hours to subtract
 * @param {Date} date Date object to subtract hours from
 * @returns
 */
export function subtractHours(numOfHours, date) {
  let copiedDate = new Date(date.getTime());
  // getTime() gets the number of milliseconds since the Unix Epoch.
  // numOfHours * 60 * 60 * 1000 converts parameter to miliseconds
  copiedDate.setTime(copiedDate.getTime() - numOfHours * 60 * 60 * 1000);
  return copiedDate;
}

/**
 * Creates an object (bookingsByWeek) in the bandbox which contains an array for each week which has bookings.
 * BookingsByWeek contains the bookings for the week.
 *
 * PRE: A booking can not be more than 6 hours.
 * @param {Bandbox} bandboxParam A bandbox to sort bookings in
 * @returns The bandbox with a new bookingsByWeek object, which contains arrays for each week.
 */
export function sortBookingsByWeek(bandboxParam) {
  bandboxParam.bookingsByWeek = {};
  bandboxParam.bookings.forEach((booking) => {
    // Multiply by 1000 to convert from firebase timestamp to JavaScript Date
    let startTimeDate = new Date(booking.startTime * 1000);
    let endTimeDate = new Date(booking.endTime * 1000);
    // 6 hours is subtracted from the start time because our calendar week starts at
    // 06:00 Monday and ends at 06:00 next Monday
    // Example: a booking starting at Monday 05:00 is set to the previous week.
    let startTimeWeekNumber = getWeek(subtractHours(6, startTimeDate));

    // getDay() gets day of the week (0 = Sunday, 1 = Monday ...)
    // If start time is Monday from 00:00 to 05:00 AND end time is Monday from 07:00,
    // the booking has to be split into 2 bookings. One for each week.
    if (
      startTimeDate.getDay() == 1 &&
      startTimeDate.getHours() < 6 &&
      endTimeDate.getDay() == 1 &&
      endTimeDate.getHours() > 6
    ) {
      // Create copy of booking and set new times as the early part of the split booking
      let bookingEarly = structuredClone(booking);
      bookingEarly.endTime =
        new Date(bookingEarly.endTime * 1000).setHours(6) / 1000;

      // Set hours for late split part of booking
      let bookingLate = booking;
      bookingLate.startTime =
        new Date(bookingLate.startTime * 1000).setHours(6) / 1000;

      // Put the EARLY booking into the correct week array:
      let earlyBookingWeekNumber = startTimeWeekNumber;
      if (!(earlyBookingWeekNumber in bandboxParam.bookingsByWeek)) {
        // Create new week array if it doesn't exist already
        bandboxParam.bookingsByWeek[earlyBookingWeekNumber] = [];
        bandboxParam.bookingsByWeek[earlyBookingWeekNumber].push(bookingEarly);
      } else
        bandboxParam.bookingsByWeek[earlyBookingWeekNumber].push(bookingEarly);
      // Put the LATE booking into the correct week array:
      // Get the week number for the week after
      let lateBookingWeekNumber = getWeek(addHours(24, startTimeDate));
      if (!(lateBookingWeekNumber in bandboxParam.bookingsByWeek)) {
        bandboxParam.bookingsByWeek[lateBookingWeekNumber] = [];
        bandboxParam.bookingsByWeek[lateBookingWeekNumber].push(bookingLate);
      } else
        bandboxParam.bookingsByWeek[lateBookingWeekNumber].push(bookingLate);
    }
    // Otherwise dont split the booking
    else {
      if (!(startTimeWeekNumber in bandboxParam.bookingsByWeek)) {
        bandboxParam.bookingsByWeek[startTimeWeekNumber] = [];
        bandboxParam.bookingsByWeek[startTimeWeekNumber].push(booking);
      } else bandboxParam.bookingsByWeek[startTimeWeekNumber].push(booking);
    }
  });
  return bandboxParam;
}

/**
 * Finds the week number of the provided date.
 * @param {Date} date Date object to get week from
 * @returns
 */
export function getWeek(date) {
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  // January 4 is always in week 1.
  let week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
}

//------------------- Test run functions ------------------------
// sortBookingsByWeek(bandboxesFromServer);
// updateTimeslotsBandbox(47, bandboxes[0]);
