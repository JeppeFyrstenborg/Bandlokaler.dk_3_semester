//QD = QueryDocs
//DB = Database
import db from "../db.js";
import {
  collection,
  getDocs,
  getDoc,
  query,
  where,
  doc,
  addDoc,
  deleteDoc
} from "firebase/firestore";
import { getUsersFromDB } from "./userController.js"; // Used for the getUserBookings function
import { getBandboxFromDB } from "./bandboxController.js"; // Used for the getBandboxBookings function

// Contains all the FIXED booking (bookings which repeat each week) documents in the database
const fixedBookingsCollection = collection(db, "FixedBookings");

/**
 *  Returns a single fixed booking from the database
 * @param fixedBookingID - The docID of the fixed booking
 * @returns The specified booking
 */
export async function getFixedBookingFromDB(fixedBookingID) {
  const docRef = doc(db, "FixedBookings", fixedBookingID);
  const fixedBookingsQD = await getDoc(docRef);
  const fixedBooking = fixedBookingsQD.data();
  fixedBooking.docID = fixedBookingsQD.id;
  return fixedBooking;
}

/**
 * Gets all fixed bookings from the database
 * @returns Array containing all the fixed bookings
 */
export async function getFixedBookingsFromDB() {
  const fixedBookingsQD = await getDocs(fixedBookingsCollection);
  const fixedBookingsDB = fixedBookingsQD.docs.map((doc) => {
    const data = doc.data();
    data.docID = doc.id;
    return data;
  });
  return fixedBookingsDB;
}

/**
 * Gets the fixed bookings that have a reference to the specified docID(bandbox)
 * @param bandboxID - The docID of the bandbox to retrieve fixed bookings from
 * @returns Array containing all the fixed bookings of the specified bandbox
 */
export async function getBandboxFixedBookings(bandboxID) {
  const bandboxRef = await getBandboxFromDB(bandboxID);
  const fixedBookings = await getFixedBookingsFromDB();
  const bandboxFixedBookings = [];

  for (const fixedBooking of fixedBookings) {
    if (
      fixedBooking.bandboxID._key.path.segments[6].substring(1) ===
      bandboxRef.docID
    ) {
      bandboxFixedBookings.push(fixedBooking);
    }
  }
  return bandboxFixedBookings;
}

/**
 * Gets a user's FIXED bookings in the form of DB data (meaning with doc-refs and not model object links)
 * @param {*} userID The ID of the user (as a number or String type)
 * @returns DB data for a user's FIXED bookings
 */
export async function getUserFixedBookings(userID) {
  const userDocRef = doc(db, "Users", userID);
  const queryUserFixedBookings = query(
    collection(db, "FixedBookings"),
    where("userID", "==", userDocRef)
  );
  const querySnapshot = await getDocs(queryUserFixedBookings);
  const userFixedBookings = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    data.docID = doc.id;
    userFixedBookings.push(data);
  });
  return userFixedBookings;
}

/**
 * Deletes the specified fixed booking from the database
 * @param fixedBookingID - bookingID aka. docID
 */
export async function deleteFixedBookingFromDB(fixedBookingID) {
  const deletedFixedBooking = await deleteDoc(
    doc(db, "FixedBookings", fixedBookingID)
  );
  console.log(deletedFixedBooking, " has been deleted from DB");
}

/**
 * Gets all FIXED-booking DB data for all bandboxes in the bandboxRefs array
 * @param {[]} bandboxRefs Array of bandbox docRefs for comparison with the FIXED-booking bandbox reference
 * @returns Array of DB data of FIXED-bookings for the chosen bandboxes
 */
export async function getFixedBookingsForBandboxes(bandboxRefs) {
  //Makes a query for finding all FIXED-bookings in the DB which are connected to a bandbox from the chosen bandboxes
  const queryFixedBooking = query(
    collection(db, "FixedBookings"),
    where("bandboxID", "in", bandboxRefs)
  );
  //Runs the above query (getting a snapshot from the DB)
  const fixedBookingsSnapshot = await getDocs(queryFixedBooking);

  const fixedBookings = [];
  fixedBookingsSnapshot.forEach((doc) => {
    const data = doc.data();
    data.docID = doc.id;
    fixedBookings.push(data);
  });
  return fixedBookings;
}

/**
 * Creates the specified FIXED booking in the database
 * @param fixedBooking
 */
export async function addFixedBookingToDB(fixedBooking) {
  fixedBooking.bandboxID = doc(db, "/Bandboxes/", fixedBooking.bandboxID);
  fixedBooking.userID = doc(db, "/Users/", fixedBooking.userID);

  const docRef = await addDoc(collection(db, "FixedBookings"), fixedBooking);
  return docRef.id;
}
