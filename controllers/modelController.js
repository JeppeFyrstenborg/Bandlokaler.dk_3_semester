//DB = Database
import {
  getUserFromDB,
  getUsersForCity,
  getUsersFromDB,
} from "./userController.js";
import {
  getBandboxesForCity,
  getBandboxesFromDB,
} from "./bandboxController.js";
import {
  getAllBookingsFromDB,
  deleteBookingFromDB,
  getBookingsForBandboxes,
  getUserBookings,
} from "./bookingController.js";
import {
  getFixedBookingsForBandboxes,
  getUserFixedBookings,
  deleteFixedBookingFromDB
} from "./fixedBookingController.js";

import Bandbox from "../models/bandbox.js";
import User from "../models/user.js";
import { getDoc } from "firebase/firestore";

/* ------------------------ BANDBOX ----------------------*/

/**
 * Creates new bandbox model for each bandbox in the database.
 * @returns Array of all the bandbox models
 */
export async function getAllBandboxModels() {
  const bandboxesDB = await getBandboxesFromDB();
  const bandboxModels = [];
  for (const bandbox of bandboxesDB) {
    bandboxModels.push(
      new Bandbox(
        bandbox.docID,
        bandbox.boxName,
        bandbox.cityName,
        bandbox.maxPersons
      )
    );
  }
  return bandboxModels;
}

/**
 * Gets the bandbox models and their associated bookings
 * @returns bandbox models with bookings
 */
export async function getAllBandboxModelsWithBookings() {
  const bandboxModels = await getAllBandboxModels();
  const users = await getAllUserModels();
  const bookingsDB = await getAllBookingsFromDB();

  const bookingsForCity = [];
  for (let booking of bookingsDB) {
    let bandbox = bandboxModels.find(
      (bandbox) => bandbox.bandboxID === booking.bandboxID._key.path.segments[6]
    );

    let bookingForCity = bandbox.createBooking(
      booking.docID,
      booking.startTime.seconds,
      booking.endTime.seconds,
      users.find((user) => user.userID === booking.userID._key.path.segments[6])
    );
    bookingsForCity.push(bookingForCity);
  }
  return bandboxModels;
}

/**
 * Gets the bandboxes with their associated bookings and the booking's users for a specific city.
 * This function filters the query to the DB, so that we don't pull everything from DB and then filter it afterwards.
 * @returns bandboxes (with bookings and their users) for a specific city
 */
export async function getBandboxesModelForCity(city) {
  const usersCityModel = await getUsersForCityModel(city);
  const bandboxesCityModel = await getBandboxesForCityModel(city);
  // If no bandboxes are found then throw error
  if (bandboxesCityModel.length == 0)
    throw 'Error: No bandboxes found in city = "' + city + '"';

  //Creates an array only with bandbox refs from the bandboxes from the chosen city
  const bandboxRefs = [];
  bandboxesCityModel.forEach((bandbox) => {
    bandboxRefs.push(bandbox.dbRef);
    delete bandbox.dbRef;
  });

  const bookingsCityDataDB = await getBookingsForBandboxes(bandboxRefs);
  createBookingsWithBandboxesAndUsers(
    bookingsCityDataDB,
    bandboxesCityModel,
    usersCityModel
  );

  const numOfWeeks = 4; // THIS IS THE AMOUNT OF WEEKS TO CREATE FIXED BOOKINGS FOR

  const fixedBookingsCityDataDB = await getFixedBookingsForBandboxes(
    bandboxRefs
  );
  createFixedBookingsWithBandboxesAndUsers(
    fixedBookingsCityDataDB,
    bandboxesCityModel,
    usersCityModel,
    numOfWeeks
  );

  return bandboxesCityModel;
}

/* ------------------------ BANDBOX -> CITY ----------------------*/

/**
 * Loops through all the bandboxes in bandboxesModels and returns a list of all the cities
 * @returns Array of all the cities
 */
export async function getAllCities() {
  const bandboxes = await getAllBandboxModels();
  const cities = [];
  for (const bandbox of bandboxes) {
    if (!cities.includes(bandbox.city)) {
      cities.push(bandbox.city);
    }
  }
  return cities;
}

/**
 * Finds bandboxes for the specified city (filtering on query to DB).
 * Bandboxes also gets a "dbRef" attribute (for comparison with other objects later)
 * @param {*} city City to get bandboxes from
 * @returns Array of bandboxes from the chosen city
 */
export async function getBandboxesForCityModel(city) {
  const bandboxesCityDataDB = await getBandboxesForCity(city);
  let bandboxesCityModel = [];
  bandboxesCityDataDB.forEach((docData) => {
    let bandbox = new Bandbox(
      docData.docID,
      docData.boxName,
      docData.cityName,
      docData.maxPersons
    );
    bandbox.dbRef = docData.dbRef; //Sends along a reference field for comparing with another objects reference later
    bandboxesCityModel.push(bandbox);
  });
  return bandboxesCityModel;
}

/**
 * Gets a array of bandboxes from the chosen city, containing each bandbox's bookings
 * @param city - The city to get bandboxes from
 * @returns bandboxes with its bookings
 */
export async function getBandboxesWithBookingsforCity(city) {
  const bandboxes = [];
  for (const bandbox of await getAllBandboxModelsWithBookings()) {
    if (bandbox.city === city) {
      bandboxes.push(bandbox);
    }
  }
  return bandboxes;
}

/* ------------------------ BOOKINGS ----------------------*/

/**
 * Creates bookings from the given bandboxes and users. Modifies bandbox array, does not create a new array.
 *
 * Bandbox and user links are made by comparing the database booking references to bandbox and user, with the model version.
 * @param {*} bookingsCityDataDB Booking DB data for all bandboxes in a city
 * @param {*} bandboxesCityModel Array of bandboxes for a city
 * @param {*} usersCityModel Array of users for a city
 */
export async function createBookingsWithBandboxesAndUsers(
  bookingsCityDataDB,
  bandboxesCityModel,
  usersCityModel
) {
  bookingsCityDataDB.forEach((docData) => {
    // bandboxes.find(.....) finds the first bandbox with bandboxID = the booking's bandboxID from the database.
    // doc.data().bandbox._key.path.segments[6] has the booking's reference to it's bandbox (the booking's bandboxID)
    let bandbox = bandboxesCityModel.find(
      (bandbox) => bandbox.bandboxID === docData.bandboxID._key.path.segments[6]
    );

    // Creates a booking using the bandbox object which should contain the booking
    bandbox.createBooking(
      docData.docID,
      docData.startTime.seconds,
      docData.endTime.seconds,
      // finds the first user with userID = the booking's userID from the database.
      // doc.data().user._key.path.segments[6] finds the booking's reference to it's user (same as the userID)
      usersCityModel.find(
        (user) => user.userID === docData.userID._key.path.segments[6]
      )
    );
  });
}

/**
 * runs the deleteBookingFromDB function, no need to delete from bandbox models, since we create new each time we get them (no storage)
 * @param bookingID - bookingID used to delete booking
 */
export async function deleteBooking(bookingID) {
  await deleteBookingFromDB(bookingID);
}

/**
 * runs the deleteFixedBookingFromDB function, no need to delete from bandbox models, since we create new each time we get them (no storage)
 * @param bookingID - bookingID used to delete booking
 */
export async function deleteFixedBooking(bookingID) {
  await deleteFixedBookingFromDB(bookingID);
}

/**
 * Finds bookings for the specified city (filtering on query to DB)
 * @param {*} city City to get bookings from
 * @returns Array of bookings from the chosen city
 */
export async function getBookingsForCityModel(city) {
  const usersCityDataDB = await getUsersForCity(city);
  let usersCityModel = [];
  usersCityDataDB.forEach((docData) => {
    let user = new User(
      docData.docID,
      docData.cities,
      docData.password,
      docData.email,
      docData.bandName
    );
    usersCityModel.push(user);
  });
  return usersCityModel;
}

/**
 * Gets the bandboxes with their associated bookings and fixed bookings for a specific user.
 * @param {*} userID The user id of the user
 * @returns Array of bandboxes with bookings nested inside
 */
export async function getUserBandboxBookings(userID) {
  // Get user DB data
  const userDB = await getUserFromDB(userID);
  // Create user model object
  const userModel = new User(
    userDB.docID,
    userDB.cities,
    userDB.password,
    userDB.email,
    userDB.bandName
  );

  const bandboxRefs = {}; //Key = [bandboxID], value = bandbox DB reference
  const bandboxBookings = {}; //Key = [bandboxID], value = array of bookings (in the form of DB data)
  const bandboxFixedBookings = {}; //Key = [bandboxID], value = array of FIXED bookings (in the form of DB data)

  // -------------- For normal bookings -------------------

  const userBookingsDB = await getUserBookings(userID); //Get the users bookings in DB data form
  userBookingsDB.forEach((bookingDB) => {
    const bandboxID = bookingDB.bandboxID.path.split("/")[1]; //bandboxID from the ref
    if (!(bandboxID in bandboxRefs)) {
      bandboxRefs[bandboxID] = bookingDB.bandboxID; //Put the bandbox DB reference into bandboxRefs
      bandboxBookings[bandboxID] = []; //Create array for the bandbox
      bandboxFixedBookings[bandboxID] = []; //Create array for the bandbox
    }
    bandboxBookings[bandboxID].push(bookingDB); //Push the booking DB data
  });

  // -------------- For FIXED bookings -------------------

  const userFixedBookingsDB = await getUserFixedBookings(userID);
  userFixedBookingsDB.forEach((fixedBookingDB) => {
    const bandboxID = fixedBookingDB.bandboxID.path.split("/")[1]; //bandboxID from the ref
    if (!(bandboxID in bandboxRefs)) {
      bandboxRefs[bandboxID] = fixedBookingDB.bandboxID; //Put the bandbox DB reference into bandboxRefs
      bandboxFixedBookings[bandboxID] = []; //Create array for the bandbox
    }
    bandboxFixedBookings[bandboxID].push(fixedBookingDB); //Push the FIXED booking DB data
  });

  // -------------- Create model objects -------------------

  const bandboxesModel = [];
  // Create bandboxes and their bookings and fixed bookings
  for (const [bandboxRefsKey, bandboxRefsValue] of Object.entries(
    bandboxRefs
  )) {
    //Get bandbox DB data
    let bandboxDoc = await getDoc(bandboxRefsValue);
    //Create bandbox model object
    let bandboxModel = new Bandbox(
      bandboxDoc.id,
      bandboxDoc.data().boxName,
      bandboxDoc.data().cityName,
      bandboxDoc.data().maxPersons
    );
    bandboxesModel.push(bandboxModel);

    if (bandboxBookings[bandboxRefsKey] != undefined) {
      //Find the bandbox's array of bookings in bandboxBookings (using the bandboxID key)
      bandboxBookings[bandboxRefsKey].forEach((bookingDataDB) => {
        //Create each booking for the bandbox
        bandboxModel.createBooking(
          bookingDataDB.docID,
          bookingDataDB.startTime.seconds,
          bookingDataDB.endTime.seconds,
          userModel
        );
      });
    }

    if (bandboxFixedBookings[bandboxRefsKey] != undefined) {
      //Find the bandbox's array of FIXED bookings in bandboxFixedBookings (using the bandboxID key)
      bandboxFixedBookings[bandboxRefsKey].forEach((fixedBookingDataDB) => {
        //Create each FIXED booking for the bandbox
        const fixedBooking = bandboxModel.createBooking(
          fixedBookingDataDB.docID,
          fixedBookingDataDB.startTime,
          fixedBookingDataDB.endTime,
          userModel
        );
        fixedBooking.fixedBooking = true; //Set fixed booking attrivute to true
      });
    }
  }
  return bandboxesModel;
}

/* ------------------------ USER ----------------------*/

/**
 * Creates new user model for each user in the database.
 * @returns Array of all the user models
 */
export async function getAllUserModels() {
  const usersDB = await getUsersFromDB();
  const userModels = [];
  for (const user of usersDB) {
    userModels.push(
      new User(
        user.docID,
        user.cities,
        user.password,
        user.email,
        user.bandName
      )
    );
  }
  return userModels;
}

/**
 *
 * @param userIdentification - Can either be userID or email
 * @returns The specified user
 */
export async function getUserModel(userIdentification) {
  const users = await getAllUserModels();
  const user = users.find(
    (user) =>
      user.userID === userIdentification ||
      user.email.toLowerCase() === userIdentification.toLowerCase()
  );
  return user;
}

/**
 * Funtion to check if user exist or not.
 * @param userIdentification -Can either be userID or email
 * @returns True if found. False otherwise.
 */
export async function findUserModel(userIdentification) {
  const users = await getAllUserModels();
  const user = users.find(
    (user) =>
      user.userID === userIdentification ||
      user.email.toLowerCase() === userIdentification.toLowerCase()
  );

  if (user) {
    return true;
  }
  return false;
}

/**
 * Gets the users assigned cities
 * @param {string} userIdentification - userID or email
 * @returns users cities
 */
export async function getUserCities(userIdentification) {
  const user = await getUserModel(userIdentification);
  return user.cities;
}

/**
 * Finds users for the specified city (filtering on query to DB)
 * @param {*} city City to get users from
 * @returns Array of users from the chosen city
 */
export async function getUsersForCityModel(city) {
  const usersCityDataDB = await getUsersForCity(city);
  let usersCityModel = [];
  usersCityDataDB.forEach((docData) => {
    let user = new User(
      docData.docID,
      docData.cities,
      docData.password,
      docData.email,
      docData.bandName
    );
    usersCityModel.push(user);
  });
  return usersCityModel;
}

/* ---------------------- FIXED BOOKINGS --------------------*/

/**
 * Creates a given amount of bookings for each provided fixed booking from the DB.
 * @param {*} fixedBookingsCityDataDB FIXED-Booking DB data for all bandboxes in a city
 * @param {*} bandboxesCityModel Array of bandboxes for a city
 * @param {*} usersCityModel Array of users for a city
 * @param {*} futureWeeks The amount of weeks into the future to create bookings for
 */
export async function createFixedBookingsWithBandboxesAndUsers(
  fixedBookingsCityDataDB,
  bandboxesCityModel,
  usersCityModel,
  futureWeeks
) {
  fixedBookingsCityDataDB.forEach((docData) => {
    // bandboxes.find(.....) finds the first bandbox with bandboxID = the fixed booking's bandboxID from the database.
    // doc.data().bandbox._key.path.segments[6] has the fixed booking's reference to it's bandbox (the fixed booking's bandboxID)
    let bandbox = bandboxesCityModel.find(
      (bandbox) => bandbox.bandboxID === docData.bandboxID._key.path.segments[6]
    );

    // Create a date object from the fixed booking DB data
    const startArray = docData.startTime.split(" "); //index 0 = weekday, index 1 = hour
    const fixedBookingStartDate = createDateForFixedBooking(
      startArray[0],
      startArray[1]
    );
    const endArray = docData.endTime.split(" ");
    const fixedBookingEndDate = createDateForFixedBooking(
      endArray[0],
      endArray[1]
    );
    // Creates an amount (futureWeeks) of bookings using the bandbox object which should contain the fixed booking
    for (let i = 0; i < futureWeeks; i++) {
      // Add a week (7 days) to the date.
      let startDate;
      let endDate;
      /*if (i == 0) {
        startDate = fixedBookingStartDate.setDate(
          fixedBookingStartDate.getDate()
        );
        endDate = fixedBookingEndDate.setDate(fixedBookingEndDate.getDate());
      } else {
        startDate = fixedBookingStartDate.setDate(
          fixedBookingStartDate.getDate() + 7
        );
        endDate = fixedBookingEndDate.setDate(
          fixedBookingEndDate.getDate() + 7
        );
      }*/
      if (i == 1) {
        startDate = fixedBookingStartDate.setDate(fixedBookingStartDate.getDate());
        endDate = fixedBookingEndDate.setDate(fixedBookingEndDate.getDate());
      } else {
        startDate = fixedBookingStartDate.setDate(fixedBookingStartDate.getDate() + 7);
        endDate = fixedBookingEndDate.setDate(fixedBookingEndDate.getDate() + 7);
      }

      const booking = bandbox.createBooking(
        //each created booking has bookingID = the fixed booking ID + and a number after a space. Ex. "[fixedBookingID] 1"
        docData.docID + " " + (i + 1),
        //Divide by 1000 to get firebase timestamp format (date in seconds instead of miliseconds)
        Math.round(startDate / 1000),
        Math.round(endDate / 1000),
        // finds the first user with userID = the booking's userID from the database.
        // doc.data().user._key.path.segments[6] finds the booking's reference to it's user (same as the userID)
        usersCityModel.find(
          (user) => user.userID === docData.userID._key.path.segments[6]
        )
      );
      booking.fixedBooking = true;
    }
  });
}

/**
 * Return a date object for the next provided weekday and hour.
 * @param {String} weekday Format either "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" or "Sun"
 * @param {Number} hour Hour of the day in 24 hour format. Eg. "13"
 */
export function createDateForFixedBooking(weekday, hour) {
  let dateInteger;
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  if (weekdays.includes(weekday)) {
    let currentDate = new Date();
    let distanceToWeekday = weekdays.indexOf(weekday) - currentDate.getDay();
    dateInteger = currentDate.setDate(
      currentDate.getDate() + distanceToWeekday
    );
    dateInteger = new Date(dateInteger).setHours(hour);
  } else throw new Error("Weekday parameter is wrong format");
  return new Date(dateInteger);
}
