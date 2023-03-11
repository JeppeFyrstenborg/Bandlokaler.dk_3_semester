export default class User {
  /** 
   * Contructs a new user object.
   * @param {String} userID ID of user, must be unique
   * @param {[]} cities Array of cities this user can create bookings in
   * @param {*} password Password must be encrypted
   * @param {String} email Email shoukld also be unique?
   * @param {String} bandName Name of the users band
   */
  constructor(userID, cities, password, email, bandName) {
    this.userID = userID;
    this.cities = cities;
    this.password = password;
    this.email = email;
    this.bandName = bandName;
  }
  toString() {
    return "User: " + this.email;
  }
}