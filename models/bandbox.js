import Booking from "./booking.js";

export default class Bandbox {
  /**
   * Contructs a new bandbox object.
   * @param {String} bandboxID ID of bandbox, must be unique
   * @param {String} boxName Name of bandbox
   * @param {String} city City the bandbox is located in
   * @param {Number} maxPersons Max number of persons this bandbox can handle
   */
  constructor(bandboxID, boxName, city, maxPersons) {
    this.bandboxID = bandboxID;
    this.boxName = boxName;
    this.city = city;
    this.maxPersons = maxPersons;
  }
  toString() {
    return (
      "Bandbox: " + this.boxName + " (max " + this.maxPersons + " personer)"
    );
  }

  //-------------------- Link til Booking ------------------------

  // Composition -> 0..* Booking
  bookings = [];

  /**
   * Removes the booking from this bandbox and removes bandbox+user from the booking.
   * @param {Booking} booking The booking to remove
   */
  removeBooking(booking) {
    for (let i = this.bookings.length - 1; i >= 0; i--)
      //Finds the index of the booking to delete
      if (this.bookings[i] === booking) {
        {
          this.bookings.splice(i, 1); //Deletes the booking at "i" and refits the array
        }
      }
    booking.user = null;
  }

  /**
   * Creates a new booking linked to this bandbox and a user.
   * 
   * Bookings created for a fixed booking has the fixed booking id + a number af a space. Eg. "[fixedBookingID] 1".
   * Bookings gets an attribute "fixedBooking" which is set to false by default.
   * @param {String} bookingID ID of the new booking
   * @param {*} startTime start time for the booking (remember firebase timestamp is different from JS Date objects)
   * @param {*} endTime end time for the booking (remember firebase timestamp is different from JS Date objects)
   * @param {User} user The user object to be connected to the created booking
   * @returns 
   */
  createBooking(bookingID, startTime, endTime, user) {
    let booking = new Booking(bookingID, startTime, endTime, user);
    this.bookings.push(booking);
    return booking;
  }
}
