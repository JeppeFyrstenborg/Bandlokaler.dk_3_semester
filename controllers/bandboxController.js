//QD = QueryDocs
//DB = Database
import db from "../db.js";
import { collection, getDocs, getDoc, doc, where, query } from "firebase/firestore";

// Contains all the bandbox documents in the database
const bandboxesCollection = collection(db, 'Bandboxes')

/**
 *  Returns a single bandbox from the database
 * @param bandboxID - The docID of the bandbox 
 * @returns The specified bandbox
 */
export async function getBandboxFromDB(bandboxID) {
  const docRef = doc(db, "Bandboxes", bandboxID);
  const bandboxQD = await getDoc(docRef);
  const bandbox = bandboxQD.data();
  bandbox.docID = bandboxQD.id;
  return bandbox;
}

/**
 * Gets all bandboxes from the database
 * @returns Array containing all the bandboxes
 */
export async function getBandboxesFromDB() {
  const bandboxesQD = await getDocs(bandboxesCollection);
  const bandboxesDB = bandboxesQD.docs.map((doc) => {
    const data = doc.data();
    data.docID = doc.id;
    return data;
  });
  return bandboxesDB;
}

/**
 * Gets all bandboxes DB data for a specific city (including a dbRef)
 * @param {*} city City to get bandboxes for
 * @returns Array of DB data of bandboxes for the chosen city (including a dbRef)
 */
export async function getBandboxesForCity(city) {
  const queryBandboxCity = query(collection(db, "Bandboxes"), where("cityName", "==", city))
  const querySnapshot = await getDocs(queryBandboxCity)
  const bandboxesCity = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    data.docID = doc.id;
    data.dbRef = doc.ref; //Sends along a reference field for comparing with another objects reference later
    bandboxesCity.push(data)
  })
  return bandboxesCity;
}
