//QD = QueryDocs
//DB = Database
import db from "../db.js";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  Timestamp,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { getUsersFromDB } from "./userController.js"; // Used for the getUserBookings function
import { getBandboxFromDB } from "./bandboxController.js"; // Used for the getBandboxBookings function

// Contains all the booking documents in the database
const bookingsCollection = collection(db, "Bookings");

/**
 *  Returns a single booking from the database
 * @param bookingID - The docID of the booking
 * @returns The specified booking
 */
export async function getBookingFromDB(bookingID) {
  const docRef = doc(db, "Bookings", bookingID);
  const bookingsQD = await getDoc(docRef);
  const booking = bookingsQD.data();
  booking.docID = bookingsQD.id;
  return booking;
}

/**
 * Gets all bookings from the database
 * @returns Array containing all the bookings
 */
export async function getAllBookingsFromDB() {
  const bookingsQD = await getDocs(bookingsCollection);
  const bookingsDB = bookingsQD.docs.map((doc) => {
    const data = doc.data();
    data.docID = doc.id;
    return data;
  });
  return bookingsDB;
}

/**
 * Gets the bookings that have a reference to the specified docID(bandbox)
 * @param bandboxID - The docID of the bandbox to retrieve bookings from
 * @returns Array containing all the bookings of the specified bandbox
 */
export async function getBandboxBookings(bandboxID) {
  const bandboxRef = await getBandboxFromDB(bandboxID);
  const bookings = await getAllBookingsFromDB();
  const bandboxBookings = [];

  for (const booking of bookings) {
    if (
      booking.bandboxID._key.path.segments[6].substring(1) === bandboxRef.docID
    ) {
      bandboxBookings.push(booking);
    }
  }
  return bandboxBookings;
}

/**
 * Gets a user's bookings in the form of DB data (meaning with doc-refs and not model object links)
 * @param {*} userID The ID of the user (as a number or String type)
 * @returns DB data for a user's bookings
 */
export async function getUserBookings(userID) {
  const userDocRef = doc(db, "Users", userID);
  const queryUserBookings = query(
    collection(db, "Bookings"),
    where("userID", "==", userDocRef)
  );
  const querySnapshot = await getDocs(queryUserBookings);
  const userBookings = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    data.docID = doc.id;
    userBookings.push(data);
  });
  return userBookings;
}

/**
 * Creates the specified booking in the database
 * @param booking
 */
export async function addBookingToDB(booking) {
  booking.bandboxID = doc(db, "/Bandboxes/", booking.bandboxID);
  booking.userID = doc(db, "/Users/", booking.userID);

  const startTime = new Date(booking.startTime);
  booking.startTime = Timestamp.fromDate(startTime);
  const endTime = new Date(booking.endTime);
  booking.endTime = Timestamp.fromDate(endTime);

  const docRef = await addDoc(collection(db, "Bookings"), booking);
  return docRef.id;
}

/**
 * Deletes the specified booking from the database
 * @param bookingID - bookingID aka. docID
 */
export async function deleteBookingFromDB(bookingID) {
  const deletedbooking = await deleteDoc(doc(db, "Bookings", bookingID));
  console.log(deletedbooking, " has been deleted from DB");
}

/**
 * Gets all booking DB data for all bandboxes in the bandboxRefs array
 * @param {[]} bandboxRefs Array of bandbox docRefs for comparison with the bookings bandbox reference
 * @returns Array of DB data of bookings for the chosen bandboxes
 */
export async function getBookingsForBandboxes(bandboxRefs) {
  //Makes a query for finding all bookings in the DB which are connected to a bandbox from the chosen bandboxes
  const queryBooking = query(
    collection(db, "Bookings"),
    where("bandboxID", "in", bandboxRefs)
  );
  //Runs the above query (getting a snapshot from the DB)
  const bookingsSnapshot = await getDocs(queryBooking);

  const bookings = [];
  bookingsSnapshot.forEach((doc) => {
    const data = doc.data();
    data.docID = doc.id;
    bookings.push(data);
  });
  return bookings;
}
