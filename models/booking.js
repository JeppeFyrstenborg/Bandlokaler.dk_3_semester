export default class Booking {
  /**
   * Constructor must be called through [bandbox].createBooking() (only bandboxes should make bookings)
   */
  constructor(bookingID, startTime, endTime, user) {
    // Bookings created for a fixed booking has the fixed booking id + a number af a space. Eg. "[fixedBookingID] 1"
    this.bookingID = bookingID; 
    this.startTime = startTime; 
    this.endTime = endTime;
    this.user = user;

    // If the booking is one of a fixed time booking (which has a booking at the same weekday and hour each each week). 
    // Set to false by default
    this.fixedBooking = false 
  }
  toString() {
    return "Booking: " + this.startTime + " til " + this.endTime;
  }

  //-------------------- Link til User ------------------------

  // Association --> 1 User
  user; //Forced association (0..* --> 1) is set in this objects contructor
}
