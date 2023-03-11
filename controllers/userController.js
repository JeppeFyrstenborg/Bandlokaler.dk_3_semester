import db from "../db.js";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  query,
  where,
  setDoc,
} from "firebase/firestore";
import User from "../models/user.js";

// Contains all the user documents in the database
const usersCollection = collection(db, "Users");

/**
 *  Returns a single user from the database
 * @param userID - The docID of the user
 * @returns The specified user
 */
export async function getUserFromDB(userID) {
  const docRef = doc(db, "Users", userID);
  const usersQD = await getDoc(docRef);
  if (usersQD.data() == undefined) {
    throw Error("User not found")
  }
  const user = usersQD.data();
  user.docID = usersQD.id;
  return user;
}

/**
 * Gets all users from the database
 * @returns Array containing all the users
 */
export async function getUsersFromDB() {
  const usersQD = await getDocs(usersCollection);
  const usersDB = usersQD.docs.map((doc) => {
    const data = doc.data();
    data.docID = doc.id;
    return data;
  });
  return usersDB;
}

/**Function to create a user in the database.
 *
 * @param {*} user - JSON-object of a user.
 * @returns docID of the created.
 */
export async function addUser(user) {
  const docRef = await addDoc(collection(db, "Users"), user);
  return docRef.docID;
}

/**Function to update a user in the database.
 *
 * @param {*} userID - DocumentID for user to be updated
 * @param {*} data - data to update userID with
 */
export async function updateUser(userID, data) {
  const docRef = doc(db, "Users", userID);
  setDoc(docRef, data);
}
/**
 * Gets all users DB data for a specific city
 * @param {*} city City to get users for
 * @returns Array of DB data of users for the chosen city
 */
export async function getUsersForCity(city) {
  const queryUsersCity = query(
    collection(db, "Users"),
    where("cities", "array-contains", city)
  );
  const querySnapshot = await getDocs(queryUsersCity);
  const usersCity = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    data.docID = doc.id;
    usersCity.push(data);
  });
  return usersCity;
}
