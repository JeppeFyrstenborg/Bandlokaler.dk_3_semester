let pickedEndHour = 1;
let newBooking;
let pickedDate;
let startTime;
let endTime;

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Sends the bookingID to get deleted, to the server.
 * @param bookingID
 */
async function deleteBooking(bookingID) {
  let data = { bookingID: bookingID }; // Data to send to the server
  const response = await fetch("/myBookings", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (response.status !== 201)
    // Deleted
    throw new Error(response.status);
  console.log("Deleted booking with ID:", bookingID); // TODO: Her skal der gøres noget i en anden task.
}

/**
 * Sends the bookingID to get created, to the server.
 * @param bookingID
 */
async function createBooking() {
  if (newBooking != "undefined") {
    let fixedBookingBoolean = false;
    if (document.getElementById("permTime").checked) {
      newBooking.startTime =
        newBooking.startTime.toLocaleString("en-us", { weekday: "short" }) +
        " " +
        startTime.getHours();
      newBooking.endTime =
        newBooking.endTime.toLocaleString("en-us", { weekday: "short" }) +
        " " +
        endTime.getHours();
      fixedBookingBoolean = true;
    }
    console.log(newBooking);
    let data = { booking: newBooking, fixedBooking: fixedBookingBoolean }; // Data to send to the server
    const response = await fetch("/calendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    try {
      const res = await response.json(); // Data recieved from the server
      console.log(res.message);
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Error");
  }
}

/**
 * Creates a booking object with the picked start-, endTime and selected bandboxID
 * @param {int} endTimeButtonPicked - Gets the value from the pressed button(1, 2 or 3)
 */
function bookingDuration(endTimeButtonPicked) {
  let pickedStartHour = document.getElementById("startTime").value;
  startTime = new Date(pickedDate);
  startTime.setHours(pickedStartHour.split(":")[0]);

  endTime = new Date(pickedDate);
  endTime.setHours(
    endTimeButtonPicked + parseInt(pickedStartHour.split(":")[0])
  );

  if (
    startTime.getDay() === 0 &&
    startTime.getHours() >= 0 &&
    startTime.getHours() < 6
  ) {
    startTime.setDate(startTime.getDate() + 1);
    endTime.setDate(endTime.getDate() + 1);
  } else if (
    endTimeButtonPicked + startTime.getHours() >= 0 &&
    startTime.getDay() === 1 &&
    pickedSlotID == "Soen"
  ) {
    startTime.setDate(startTime.getDate() + 7);
    endTime.setDate(endTime.getDate() + 7);
  }

  /*if ((endTimeButtonPicked + startTime.getHours()) >= 6 && startTime.getDay() === 1) {
        startTime.setDate(startTime.getDate() + 7)
        endTime.setDate(endTime.getDate() + 7)
    }*/

  newBooking = {
    bandboxID: selectedBandbox.bandboxID,
    startTime: startTime,
    endTime: endTime,
    userID: "",
  };
}

/**
 * Sets up the booking popup window
 */
function bookingModalSetup() {
  document.getElementById("permTime").checked = false;
  let divInputTime = document.getElementById("inputTime");
  while (divInputTime.firstChild)
    divInputTime.removeChild(divInputTime.firstChild);
  let inputTime = document.createElement("input");
  divInputTime.appendChild(inputTime);
  inputTime.setAttribute("type", "time");
  inputTime.setAttribute("name", "startTime");
  inputTime.setAttribute("id", "startTime");
  inputTime.setAttribute("step", "3600");

  const divPickBookingDuration = document.getElementById("pickBookingDuration");
  divPickBookingDuration.innerHTML = "";
  const bookButton = document.getElementById("bookButton");
  bookButton.setAttribute(
    "class",
    "btn btn-sm btn-primary btn-icon bookBtn hide-element"
  );
  let ul = document.createElement("ul");
  divPickBookingDuration.appendChild(ul);

  for (let i = 1; i <= 3; i++) {
    let li = document.createElement("li");
    ul.appendChild(li);

    let a = document.createElement("a");
    a.setAttribute(
      "class",
      "btn btn-sm btn-primary btn-dropdown-icon btn-dropdown"
    );
    a.setAttribute("role", "button");
    a.setAttribute("name", "endTime");
    a.setAttribute("value", i);
    a.onclick = () => {
      let buttons = document.getElementsByName("endTime");
      for (const button of buttons) {
        button.setAttribute(
          "class",
          "btn btn-sm btn-primary btn-dropdown-icon btn-dropdown"
        );
      }
      if (
        a.getAttribute("class") ==
        "btn btn-sm btn-primary btn-dropdown-icon btn-dropdown btn-isDisabled"
      ) {
        a.setAttribute(
          "class",
          "btn btn-sm btn-primary btn-dropdown-icon btn-dropdown"
        );
      } else {
        a.setAttribute(
          "class",
          "btn btn-sm btn-primary btn-dropdown-icon btn-dropdown btn-isDisabled"
        );
      }
      bookButton.setAttribute(
        "class",
        "btn btn-sm btn-primary btn-icon bookBtn"
      );
      bookButton.setAttribute(
        "onclick",
        "document.getElementById('id01').setAttribute('class', 'modal, hide-element'), createBooking()"
      );
      bookButton.setAttribute("href", "/myBookings")
      bookingDuration(i);
    };
    li.appendChild(a);
    let spanIcon = document.createElement("span");
    let spanText = document.createElement("span");
    spanText.setAttribute("class", "btn-inner--text");
    spanText.innerText = i + " time";
    spanIcon.setAttribute("class", "btn-inner--icon bi-clock");
    a.appendChild(spanText);
    a.appendChild(spanIcon);
  }
}

/**
 * Sets pickedDate to the correct day of the week, depending on what weekCell is selected
 * @param {Date} date - The selected weekCell date
 */
function getPickedDate(date) {
  pickedDate = new Date(date);
  let seconds = pickedDate.getHours() * 3600;
  const inputValue = new Date(seconds * 1000).toISOString().slice(11, 16);
  const startTimeInput = document.getElementById("startTime");
  startTimeInput.setAttribute("value", inputValue);
}
