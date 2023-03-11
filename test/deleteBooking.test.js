import { assert } from "chai";
import db from "../db.js";
import { getFirestore, collection, getDocs, getDoc, doc, deleteDoc, addDoc, Timestamp} from "firebase/firestore";

let start = new Date('December 4, 2022 06:00:00') //pass in your milliseconds, this will return the js date object
let timestampStart = Timestamp.fromDate(start)

let end = new Date('December 4, 2022 09:00:00') //pass in your milliseconds, this will return the js date object
let timestampEnd = Timestamp.fromDate(end)

const bookingTest = [{
    bandboxID: "JvEu3OUd8atVkgaJjrjY",
    startTime: start,
    endTime: end,
    userID: "qWvamWj1Aj8lGGMOSp4m"
}]
let bookingID

async function addBooking(booking) {
    const docRef = await addDoc(collection(db, "testBookings"), booking);
    return docRef.id
}

async function deleteBooking(bookingID) {
    let deleted = await deleteBookingFromDB(bookingID)
}

async function deleteBookingFromDB(bookingID) {
    let deletedbooking = await deleteDoc(doc(db, "testBookings", bookingID))
}
bookingID = await addBooking(bookingTest[0]);

describe("When running deleteBooking", function () {
    it("Should delete the booking from DB", async function () {
        console.log('waiting 6 seconds');
        let res
        setTimeout(async function () {
            console.log('waiting over.');
            res = await deleteBooking(bookingID);
        }, 6000)
        assert.equal(res);
    });
});
