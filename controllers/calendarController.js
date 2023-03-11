// import db from "../db.js";
// import {
//   collection,
//   getDocs,
//   getDoc,
//   doc,
//   deleteDoc,
//   addDoc,
//   query,
//   where,
// } from "firebase/firestore";
// import Bandbox from "../models/bandbox.js";
// import User from "../models/user.js";

// /**
//  * Gets bandboxes from a specific city from DB and creates the objects.
//  * @param {*} city City to get bandboxes from
//  * @returns Array of bandboxes from the chosen city
//  */
// export async function getBandboxesForCity(city) {
//   const queryBandboxCity = query(
//     collection(db, "Bandboxes"),
//     where("cityName", "==", city)
//   );

//   const bandboxesCityQuerySnapshot = await getDocs(queryBandboxCity);

//   let bandboxesCity = [];
//   bandboxesCityQuerySnapshot.docs.forEach((doc) => {
//     let bandbox = new Bandbox(
//       doc.id,
//       doc.data().boxName,
//       doc.data().cityName,
//       doc.data().maxPersons
//     );
//     bandbox.dbRef = doc.ref; //Sends along a reference field for comparing with another objects reference later
//     bandboxesCity.push(bandbox);
//   });
//   return bandboxesCity;
// }

// /**
//  * Gets users from a specific city from DB and creates the objects.
//  * @param {*} city City to get users from
//  * @returns Array of users from the chosen city
//  */
// export async function getUsersForCity(city) {
//   const queryUsersCity = query(
//     collection(db, "Users"),
//     where("cities", "array-contains", city)
//   );

//   const usersCityQuerySnapshot = await getDocs(queryUsersCity);

//   let usersCity = [];
//   usersCityQuerySnapshot.docs.forEach((doc) => {
//     let user = new User(
//       doc.id,
//       doc.data().cities,
//       doc.data().username,
//       doc.data().password,
//       doc.data().email,
//       doc.data().bandName
//     );
//     usersCity.push(user);
//   });
//   return usersCity;
// }

// /**
//  * Gets the model from a specific city. Data from DB --> creates the model objects.
//  * @param {*} city City to get the model from
//  * @returns Array of bandboxes from the chosen city (which means including users and bookings nested inside)
//  */
// export async function getBandboxesForCityWithLinkedObjects(city) {
//   let usersForCity = await getUsersForCity(city);
//   let bandboxesForCity = await getBandboxesForCity(city);

//   //Creates an array only with bandbox refs from the bandboxes from the chosen city
//   let bandboxRefs = [];
//   bandboxesForCity.forEach((bandbox) => {
//     bandboxRefs.push(bandbox.dbRef);
//     delete bandbox.dbRef;
//   });

//   //Makes a query for finding all bookings in the DB which are connected to a bandbox from the chosen city
//   const queryBooking = query(
//     collection(db, "Bookings"),
//     where("bandboxID", "in", bandboxRefs)
//   );

//   //Runs the above query (getting a snapshot from the DB)
//   const bookingsCityQuerySnapshot = await getDocs(queryBooking);

//   let bookingsForCity = [];
//   bookingsCityQuerySnapshot.docs.forEach((doc) => {
//     // bandboxes.find(.....) finds the first bandbox with bandboxID = the booking's bandboxID from the database.
//     // doc.data().bandbox._key.path.segments[6] finds the booking's reference to it's bandbox (same as the bandboxID)
//     let bandbox = bandboxesForCity.find(
//       (bandbox) =>
//         bandbox.bandboxID === doc.data().bandboxID._key.path.segments[6]
//     );

//     // Creates a booking using the bandbox object which should contain the booking
//     let bookingForCity = bandbox.createBooking(
//       doc.id,
//       doc.data().startTime.seconds,
//       doc.data().endTime.seconds,
//       // finds the first user with userID = the booking's userID from the database.
//       // doc.data().user._key.path.segments[6] finds the booking's reference to it's user (same as the userID)
//       usersForCity.find(
//         (user) => user.userID === doc.data().userID._key.path.segments[6]
//       )
//     );
//     bookingsForCity.push(bookingForCity);
//   });
//   return bandboxesForCity;
// }
//