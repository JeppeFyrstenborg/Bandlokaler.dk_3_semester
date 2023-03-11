/**Function to delete a booking klientside, and send a request to the server.
 * @param {element} Element that have a value of a booking to delete, and can execute a function.
 */
async function deleteBooking(booking) {
  let arr = booking.split(" ")
  const isFixedBooking = arr[0]
  const bookingID = arr[1]
  console.log(isFixedBooking + "," + bookingID);
  if (confirm("Ønsker du at slette denne booking???" + bookingID)) {
    const data = {
      bookingID: bookingID,
      isFixedBooking: isFixedBooking
    };
    const response = await fetch("/myBookings", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.status !== 201) {
      alert("Noget gik galt");
      window.location.href = "/myBookings";
    } else {
      alert("Booking slettet!");
      window.location.href = "/myBookings";
    }
  }
}
