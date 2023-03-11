Date.prototype.getWeek = function () {
  var onejan = new Date(this.getFullYear(), 0, 1);
  var today = new Date(this.getFullYear(), this.getMonth(), this.getDate());
  var dayOfYear = ((today - onejan + 86400000) / 86400000);
  return Math.ceil(dayOfYear / 7)
};

let limitWeek = 0

//Constructs a date for each day in the week
let mondayDate = new Date(getDayOfCurrentWeek(1));
let tuesdayDate = new Date(getDayOfCurrentWeek(2));
let wednesdayDate = new Date(getDayOfCurrentWeek(3));
let thursdayDate = new Date(getDayOfCurrentWeek(4));
let fridayDate = new Date(getDayOfCurrentWeek(5));
let saturdayDate = new Date(getDayOfCurrentWeek(6));
let sundayDate = new Date(getDayOfCurrentWeek(7));

/* ------------------------ Create timeslots ----------------------*/
function createTimeSlots() {
  //- Makes an array of strings for each hour in a day in the format: [xx:xx]. Plus an array with their IDs.
  //- Starts at 6 and loops aroun at 24 (23, 24, 0, 1...)
  let hours = [];
  let IDs = [];
  for (let i = 6; i < 24; i++) {
    if (i < 10) hours.push("0" + i + ":00");
    else hours.push(i + ":00");
    IDs.push(i)
  }
  for (let i = 0; i < 6; i++) {
    hours.push("0" + i + ":00");
    IDs.push(i)
  }
  //- Using the hours array this makes a cell for each hour in the day 
  //- in the container called "gridHours".
  //- All cells have the classname "gridHour" and the id ["gridHour" + i].
  let gridHoursContainer = document.getElementById("gridHoursContainer");
  while(gridHoursContainer.firstChild)
    gridHoursContainer.removeChild(gridHoursContainer.firstChild)
  let i = 0;
  for (let hour of hours) {
    let cell = document.createElement("div");
    cell.innerHTML = hour;
    cell.className = "gridHour";
    cell.id = "gridHour" + IDs[i];
    i++;
    gridHoursContainer.appendChild(cell);
  }
  //- Makes 24 timeslot cells in each "gridTimeslotContainerWeekday".
  //- They all have className = ["weekdayCell" + day;].
  //- And id = ["weekdayCell" + day + i;].
  let weekdays = ["Man", "Tir", "Ons", "Tor", "Fre", "Loer", "Soen"]
  let index = 0;
  for (let day of weekdays) {
    let weekdayContainer = document.getElementById(
      "gridTimeslots" + day + "Container"
    );
    for (let i = 0; i < 24; i++) {
      let cell = document.createElement("div");
      cell.className = "weekdayCell" + day + " weekdayCell";
      cell.id = "weekdayCell" + day + IDs[i];
      if (mondayDate.getWeek() >= new Date().getWeek() || mondayDate.getFullYear() != new Date().getFullYear()) {
        cell.style.backgroundColor = "var(--grey)"

        if (i == 0) {
          cell.style.borderRadius = "10px 10px 0px 0px";
          cell.className = "weekdayCellOns weekdayCell"
          let aElement = document.createElement("a")
          let spanText = document.createElement("span");
          let spanIcon = document.createElement("span");
          spanText.setAttribute("class", "btn-inner--text")
          spanText.setAttribute("style", "color: var(--white)")
          spanText.innerText = "Ledig";
          aElement.appendChild(spanText)
          spanIcon = document.createElement("span")
          spanIcon.setAttribute("style", "float: right;")
          spanIcon.setAttribute("class", "btn-icon btn-icon-book btn-inner--icon bi-plus-circle")
          weekDates[index].setHours(IDs[i])
          spanIcon.setAttribute("onclick", "bookingModalSetup(), getPickedDate('" + weekDates[index] + "'), document.getElementById('id01').setAttribute('class', 'modal show-modal'), pickedSlotID = '" + cell.id.substring(11, 15) + "'")
          aElement.appendChild(spanIcon)
          cell.appendChild(aElement);
        }
        if (i == 24 - 1) {
          cell.style.marginBottom = "0.3rem";
          cell.style.borderRadius = "0px 0px 10px 10px";
        }
      } else {
        cell.style.backgroundColor = "transparent"
      }

     /* if (mondayDate.getWeek() > (new Date().getWeek())) {
        let prevWeek = document.getElementById("gridWeek2")
        prevWeek.setAttribute("class", "btn btn-arrow btn-icon")
      } else {
        let prevWeek = document.getElementById("gridWeek2")
        prevWeek.setAttribute("class", "btn btn-arrow btn-icon hide-element")
      }*/
      weekdayContainer.appendChild(cell)
    }
    index++
  }

  let prevWeek = document.getElementById("gridWeek2")
  let nextWeek = document.getElementById("gridWeek10")

  if (limitWeek >= 3) {
    prevWeek.setAttribute("class", "btn btn-arrow btn-icon")
    nextWeek.setAttribute("class", "btn btn-arrow btn-icon hide-element")
  } else if (limitWeek < 3) {
    prevWeek.setAttribute("class", "btn btn-arrow btn-icon")
    nextWeek.setAttribute("class", "btn btn-arrow btn-icon")
  }
}
/* ------------------------ Update timeslots ----------------------*/
/**
 * Updates the timeslots with new data
 */
function updateTimeslots() {
  if(selectedBandbox) {
    let weekdays = ["Man", "Tir", "Ons", "Tor", "Fre", "Loer", "Soen"]
    for (let day of weekdays) {
      let weekdayContainer = document.getElementById(
        "gridTimeslots" + day + "Container"
      );
      while (weekdayContainer.firstChild)
        weekdayContainer.removeChild(weekdayContainer.firstChild);
    }
    updateWeekDaysArray()
    createTimeSlots()
    sortBookingsByWeek(selectedBandbox);
    updateTimeslotsBandbox(getCurrentWeek(), selectedBandbox)
  }
}

/**
 * Function to retrieve weeknumber and year from calendar pick.
 * @param event Event of the calendar select.
 */
function getDateOfWeek(event) {
  let weekAndYear = event.target.value.toString().split("-W");
  let w = weekAndYear[1] - 0;
  let y = weekAndYear[0] - 0;
  let simple = new Date(y, 0, 1 + (w - 1) * 7);
  let dow = simple.getDay();
  let ISOweekStart = simple;
  if (dow <= 4) ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  return ISOweekStart;
}

/**
 * Function to retrieve monday of the current week.
 * @param days What day of the week to get. 1 is monday, 7 is sunday.
 */
function getDayOfCurrentWeek(days) {
  if (!typeof days == "number") return null;
  const today = new Date();
  const first = today.getDate() - today.getDay() + days;

  const monday = new Date(today.setDate(first));
  return monday;
}

//This function has been added as an onclick event on the button in calendar.pug "Pil til højre"
function nextWeek() {
  //Increments each day/date by 7
  mondayDate.setDate(mondayDate.getDate() + 7);
  tuesdayDate.setDate(tuesdayDate.getDate() + 7);
  wednesdayDate.setDate(wednesdayDate.getDate() + 7);
  thursdayDate.setDate(thursdayDate.getDate() + 7);
  fridayDate.setDate(fridayDate.getDate() + 7);
  saturdayDate.setDate(saturdayDate.getDate() + 7);
  sundayDate.setDate(sundayDate.getDate() + 7);
  limitWeek++;
  updateDateUI()
  updateTimeslots()
}

//This function has been added as an onclick event on the button in calendar.pug "Pil til venstre"
function previousWeek() {
  //Subtracts each day/date by 7
  mondayDate.setDate(mondayDate.getDate() - 7);
  tuesdayDate.setDate(tuesdayDate.getDate() - 7);
  wednesdayDate.setDate(wednesdayDate.getDate() - 7);
  thursdayDate.setDate(thursdayDate.getDate() - 7);
  fridayDate.setDate(fridayDate.getDate() - 7);
  saturdayDate.setDate(saturdayDate.getDate() - 7);
  sundayDate.setDate(sundayDate.getDate() - 7);
  limitWeek--;
  updateDateUI()
  updateTimeslots()
}

/**
 * Updates the calendar UI with the correct dates
 */
function updateDateUI() {
  //Making a string object for each of the dates, and splitting the strings by a space " "
  //So only the "number" of the date can be shown in calendar and not the year, timezone clock and so on.
  let mondayText = mondayDate.toString().split(" ");
  let tuesdayText = tuesdayDate.toString().split(" ");
  let wednesdayText = wednesdayDate.toString().split(" ");
  let thursdayText = thursdayDate.toString().split(" ");
  let fridayText = fridayDate.toString().split(" ");
  let saturdayText = saturdayDate.toString().split(" ");
  let sundayText = sundayDate.toString().split(" ");

  //Updates the gui
  document.getElementById("gridWeek3").innerText =
    mondayText[2] - 0 + "\n" + "Mandag";
  document.getElementById("gridWeek4").innerText =
    tuesdayText[2] - 0 + "\n" + "Tirsdag";
  document.getElementById("gridWeek5").innerText =
    wednesdayText[2] - 0 + "\n" + "Onsdag";
  document.getElementById("gridWeek6").innerText =
    thursdayText[2] - 0 + "\n" + "Tordag";
  document.getElementById("gridWeek7").innerText =
    fridayText[2] - 0 + "\n" + "Fredag";
  document.getElementById("gridWeek8").innerText =
    saturdayText[2] - 0 + "\n" + "Lørdag";
  document.getElementById("gridWeek9").innerText =
    sundayText[2] - 0 + "\n" + "Søndag";

  document.getElementById("gridWeek0").innerText = mondayDate.toLocaleString('en-us', { month: 'long' }) + " - Uge " + getCurrentWeek() + " | " + mondayDate.getFullYear()
}
//end of functions to go right and left in the calendar

/**
 * Function to update days in the view, and update day-dates in this document.
 * @param event Event of the calendar select.
 */
function getDateFromWeekAndYear(event) {
  mondayDate = new Date(getDateOfWeek(event));
  tuesdayDate.setDate(mondayDate.getDate() + 1);
  wednesdayDate.setDate(tuesdayDate.getDate() + 1);
  thursdayDate.setDate(wednesdayDate.getDate() + 1);
  fridayDate.setDate(thursdayDate.getDate() + 1);
  saturdayDate.setDate(fridayDate.getDate() + 1);
  sundayDate.setDate(saturdayDate.getDate() + 1);

  let mondayText = mondayDate.toString().split(" ");
  let tuesdayText = tuesdayDate.toString().split(" ");
  let wednesdayText = wednesdayDate.toString().split(" ");
  let thursdayText = thursdayDate.toString().split(" ");
  let fridayText = fridayDate.toString().split(" ");
  let saturdayText = saturdayDate.toString().split(" ");
  let sundayText = sundayDate.toString().split(" ");

  //Updates the gui
  document.getElementById("gridWeek3").innerText =
    mondayText[2] - 0 + "\n" + "Mandag";
  document.getElementById("gridWeek4").innerText =
    tuesdayText[2] - 0 + "\n" + "Tirdag";
  document.getElementById("gridWeek5").innerText =
    wednesdayText[2] - 0 + "\n" + "Onsdag";
  document.getElementById("gridWeek6").innerText =
    thursdayText[2] - 0 + "\n" + "Tordag";
  document.getElementById("gridWeek7").innerText =
    fridayText[2] - 0 + "\n" + "Fredag";
  document.getElementById("gridWeek8").innerText =
    saturdayText[2] - 0 + "\n" + "Lørdag";
  document.getElementById("gridWeek9").innerText =
    sundayText[2] - 0 + "\n" + "Søndag";
}

/**
 * Set calendar value to selected week.
 * @param
 */
function getCurrentWeek() {
  return mondayDate.getWeek()
}

/**
 * Updates the weekDates array used in bookings.js
 */
function updateWeekDaysArray() {
  weekDates = [
    mondayDate,
    tuesdayDate,
    wednesdayDate,
    thursdayDate,
    fridayDate,
    saturdayDate,
    sundayDate
  ]

  for(date of weekDates) {
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
  }
}

/* ---------------------- Run functions--------------------*/
// Get the modal
const modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.setAttribute("class", "modal hide-element")
  }
}
