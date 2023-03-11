/**
 * Sends the selected city to the server and gets the citys bandboxes in return
 */
async function sendCityToServer(cityName) {
  let data
  if(cityName === "undefined") {
    data = { city: getCityName() } // Data to send to the server
  } else {
    document.getElementById("selectedCity").innerText = cityName;
    data = { city: cityName } // Data to send to the server
  }
  const response = await fetch("/calendar", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  try {
    const res = await response.json() // Data recieved from the server
    bandboxesFromServer = res.bandboxes
    cityChanged()
  } catch (error) {
    console.log(error)
  }
}

function getCityName() {
  let getDefaultCity = document.getElementById("selectedCity").innerText;
  getDefaultCity = getDefaultCity.toLowerCase()
  const cityName = getDefaultCity.charAt(0).toUpperCase() + getDefaultCity.slice(1);
  return cityName;
}

/**
 * Handles the creation of the bandbox buttons, depending on the city selected
 * @param serverBandboxes - The bandboxes recieved from the server 
 */
function cityChanged() {
  const gridTimeslotsContainer = document.getElementById("gridTimeslotsContainer")
  for(divChild of gridTimeslotsContainer.children) {
    divChild.innerHTML = "";
  }

  const cityBandboxes = bandboxesFromServer
  let bandboxes = []
  for (let bandbox of cityBandboxes) {
    bandboxes.push(bandbox)
  }

  const bandboxButtons = Array.from(document.getElementsByName("bandboxButtonUl"));
  for (box of bandboxButtons) { box.remove(); }

  const divBandboxBookings = document.getElementById("gridCalendarMenuContainer")
  let ul = document.createElement("ul")
  ul.setAttribute("name", "bandboxButtonUl")
  ul.setAttribute("class", "ul-bandboxButtons")
  ul.setAttribute("id", "gridCalendarMenu2")
  divBandboxBookings.appendChild(ul)

  let i = 1
  for(let bandbox of bandboxes) {
    i++
    let li = document.createElement("li")
    ul.appendChild(li)

    let a = document.createElement("a")
    a.setAttribute("class", "btn btn-sm btn-primary btn-icon btn-bandbox")
    a.setAttribute("role", "button")
    a.setAttribute("value", bandbox.boxName)
    a.setAttribute("name", "bandboxButton")
    a.onclick = () => {
      let buttons = document.getElementsByName("bandboxButton")
      for(const button of buttons) {
        button.setAttribute("class", "btn btn-sm btn-primary btn-icon btn-bandbox")
      }
      if (a.getAttribute("class") == "btn btn-sm btn-primary btn-icon btn-bandbox btn-isDisabled")
        a.setAttribute("class", "btn btn-sm btn-primary btn-icon btn-bandbox")
      else
        a.setAttribute("class", "btn btn-sm btn-primary btn-icon btn-bandbox btn-isDisabled")
      selectedBandbox = bandbox
      updateTimeslots()
    }
    li.appendChild(a)
    let spanIcon = document.createElement("span")
    let spanText = document.createElement("span")
    spanText.setAttribute("class", "btn-inner--text")
    spanText.innerText = bandbox.boxName + " - "
    spanIcon.setAttribute("class", "btn-inner--icon bi-people-fill")
    spanIcon.innerText = bandbox.maxPersons
    a.appendChild(spanText)
    a.appendChild(spanIcon)
  }
}

/**
 * Updates the timeslots with the bookings from the selected bandbox
 * @param {*} bandbox 
 */
function bandboxButtonOnClick(bandbox) {
  selectedBandbox = bandbox
  updateTimeslots()
}