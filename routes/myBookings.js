import express from "express";
import {
  deleteBooking,
  deleteFixedBooking,
  getBookingsForCityModel,
  getUserBandboxBookings
} from "../controllers/modelController.js";
import { getUserBookings } from "../controllers/bookingController.js";

const router = express.Router();

// ------------------------Start - CRUD HTTP methods---------------------
//To retrieve a resource, use GET.
router.get("/", async (request, response) => {
  if (!request.session.authorized) {
    request.session.authorized = false;
    response.status(401).redirect("login");
  } else if (request.session.authorized == true) {
    const bandboxes = await getUserBandboxBookings(request.session.user.userID);
    let userBookingsGlobal = []
    for (const bandbox of bandboxes) {
      for (const booking of bandbox.bookings) {
        if (booking.user.userID === request.session.user.userID) {
          userBookingsGlobal.push({booking: booking, bandbox: bandbox.boxName, city: bandbox.city})
        }
      }
    }
    //console.log(userBookingsGlobal);
    response.render("myBookings", {
      user: request.session.user,
      bookings: userBookingsGlobal
    });
  } else {
    response.status(401).redirect("login");
  }
});

//To create a resource on the server, use POST.
router.post("/", async (request, response) => {});

//To change the state of a resource or to update it, use PUT.
router.put("/", (request, reresponses) => {});

//To remove or delete a resource, use DELETE.
router.delete("/", async (request, response) => {
  const bookingID = request.body.bookingID;
  const isFixedBooking = request.body.isFixedBooking;
  console.log(isFixedBooking);
  console.log(bookingID);
  if (isFixedBooking == "true") {
    await deleteFixedBooking(bookingID);
  } else {
    console.log(bookingID);
    await deleteBooking(bookingID);
  }
  response.status(201);
  response.end();
});

// ------------------------End - CRUD HTTP methods---------------------

export default router;
