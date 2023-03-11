//nextWeekTest() takes 7 dates as input
export function nextWeekTest(mondayDate, tuesdayDate, wednesdayDate, thursdayDate, fridayDate, saturdayDate, sundayDate){
  //Increments each day/date by 7
  mondayDate.setDate(mondayDate.getDate()+7)
  tuesdayDate.setDate(tuesdayDate.getDate()+7)
  wednesdayDate.setDate(wednesdayDate.getDate()+7)
  thursdayDate.setDate(thursdayDate.getDate()+7)
  fridayDate.setDate(fridayDate.getDate()+7)
  saturdayDate.setDate(saturdayDate.getDate()+7)
  sundayDate.setDate(sundayDate.getDate()+7)

  //Making a string object for each of the dates, and splitting the strings by a space " "
  //So only the "number" of the date can be shown in calendar and not the year, timezone clock and so on. 
  let mondayText = mondayDate.toString().split(" ")
  let tuesdayText = tuesdayDate.toString().split(" ")
  let wednesdayText = wednesdayDate.toString().split(" ")
  let thursdayText = thursdayDate.toString().split(" ")
  let fridayText = fridayDate.toString().split(" ")
  let saturdayText = saturdayDate.toString().split(" ")
  let sundayText = sundayDate.toString().split(" ")

  //Updates the gui, to test the functionality these lines has been commented as we only we test 
  //if the dates are correct and not the GUI

  //document.getElementById("gridWeek3").innerText = mondayText[2] + "\n" + 'Mandag' 
  //document.getElementById("gridWeek4").innerText = tuesdayText[2] + "\n" + 'Tirsdag' 
  //document.getElementById("gridWeek5").innerText = wednesdayText[2] + "\n" + 'Onsdag' 
  //document.getElementById("gridWeek6").innerText = thursdayText[2] + "\n" + 'Torsdag' 
  //document.getElementById("gridWeek7").innerText = fridayText[2] + "\n" + 'Fredag' 
  //document.getElementById("gridWeek8").innerText = saturdayText[2] + "\n" + 'Lørdag' 
  //document.getElementById("gridWeek9").innerText = sundayText[2] + "\n" + 'Søndag'
}

//previousWeekTest() takes 7 dates as input
export function previousWeekTest(mondayDate, tuesdayDate, wednesdayDate, thursdayDate, fridayDate, saturdayDate, sundayDate){
  //Subtracts each day/date by 7
  mondayDate.setDate(mondayDate.getDate()-7)
  tuesdayDate.setDate(tuesdayDate.getDate()-7)
  wednesdayDate.setDate(wednesdayDate.getDate()-7)
  thursdayDate.setDate(thursdayDate.getDate()-7)
  fridayDate.setDate(fridayDate.getDate()-7)
  saturdayDate.setDate(saturdayDate.getDate()-7)
  sundayDate.setDate(sundayDate.getDate()-7)
  
  //Making a string object for each of the dates, and splitting the strings by a space " "
  //So only the "number" of the date can be shown in calendar and not the year, timezone clock and so on. 
  let mondayText = mondayDate.toString().split(" ")
  let tuesdayText = tuesdayDate.toString().split(" ")
  let wednesdayText = wednesdayDate.toString().split(" ")
  let thursdayText = thursdayDate.toString().split(" ")
  let fridayText = fridayDate.toString().split(" ")
  let saturdayText = saturdayDate.toString().split(" ")
  let sundayText = sundayDate.toString().split(" ")

  //Updates the gui, to test the functionality these lines has been commented as we only we test 
  //if the dates are correct and not the GUI
  //document.getElementById("gridWeek3").innerText = mondayText[2] + "\n" + 'Mandag' 
  //document.getElementById("gridWeek4").innerText = tuesdayText[2] + "\n" + 'Tirsdag' 
  //document.getElementById("gridWeek5").innerText = wednesdayText[2] + "\n" + 'Onsdag' 
  //document.getElementById("gridWeek6").innerText = thursdayText[2] + "\n" + 'Torsdag' 
  //document.getElementById("gridWeek7").innerText = fridayText[2] + "\n" + 'Fredag' 
  //document.getElementById("gridWeek8").innerText = saturdayText[2] + "\n" + 'Lørdag' 
  //document.getElementById("gridWeek9").innerText = sundayText[2] + "\n" + 'Søndag'
}