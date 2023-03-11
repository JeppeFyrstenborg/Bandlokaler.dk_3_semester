const disabledClass = "btn btn-lg btn-primary btn-icon btn-navbar btn-isDisabled"
if (window.location.pathname == "/calendar") {
  document.getElementById("menuButtonBooking").setAttribute("class", disabledClass)
} else if (window.location.pathname == "/myBookings") {
  document.getElementById("menuButtonMineTider").setAttribute("class", disabledClass)
} else if (window.location.pathname == "/editUser") {
  document.getElementById("menuButtonProfil").setAttribute("class", disabledClass)
}

function disableMenuButton() {
  let menuButtons = document.getElementsByName("menuButton")
  for (const button of menuButtons) {
    button.onclick = () => {
      for (const button of menuButtons) {
        button.setAttribute("class", "btn btn-lg btn-primary btn-icon btn-navbar")
      }
      if (button.getAttribute("class") == " btn btn-lg btn-primary btn-icon btn-navbar btn-isDisabled") {
        button.setAttribute("class", "btn btn-lg btn-primary btn-icon btn-navbar")
      }
      else {
        button.setAttribute("class", "btn btn-lg btn-primary btn-icon btn-navbar btn-isDisabled")
      }
    }
  }
}