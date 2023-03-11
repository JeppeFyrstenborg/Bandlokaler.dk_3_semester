// This file handles all get/post/put/delete for /calendar.

// Import of the express, so we can get the router function.
import express from "express";
import {
  getUserCities,
  getBandboxesModelForCity,
  getUserModel,
} from "../controllers/modelController.js";
import { addBookingToDB, getUserBookings } from "../controllers/bookingController.js";
import { addFixedBookingToDB } from "../controllers/fixedBookingController.js";

const router = express.Router();
// ------------------------Start - CRUD HTTP methods---------------------
//To create a resource on the server, use POST.
router.post("/", async (request, response) => {
  if (request.body.city) {
    try {
      // Try/catch to handle cities with no bandboxes
      const city = request.body.city;
      const bandboxes = await getBandboxesModelForCity(city);
      response.status(200).json({ bandboxes: bandboxes });
    } catch (error) {
      console.log(error);
    }
  }

  if (request.body.booking) {
    request.body.booking.userID = request.session.user.userID; //request.session.user.userID
    const booking = request.body.booking;
    let newBooking = {};
    if (request.body.fixedBooking) {
      newBooking = await addFixedBookingToDB(booking);
    } else {
      newBooking = await addBookingToDB(booking);
    }
    response.json({ message: newBooking + " has been added successfully" });
  }
});

//To retrieve a resource, use GET.
//It checks if the request-session are logged in. If request.session.authorized are true. If not it will redirect to /login.
//If a user belonging to the session is logged in, it will then render calendar with that user's info. request.session.user.
router.get("/", async (request, response) => {
  if (!request.session.authorized) {
    request.session.authorized = false;
    response.status(401).redirect("login");
  } else if (request.session.authorized == true) {
    response.render("calendar", {
      cities: request.session.user.cities,
      user: request.session.user
    });
  } else {
    response.status(401).redirect("login");
  }
});

//To change the state of a resource or to update it, use PUT.
router.put("/", async (request, reresponses) => {});

//To remove or delete a resource, use DELETE.
router.delete("/", async (request, response) => {});

// ------------------------End - CRUD HTTP methods---------------------

// Export of the router.
// The module.exports or export default is a special object which is included in every JavaScript file
// in the Node.js application by default. The module is a variable that represents
//  the current module, and exports is an object that will be exposed as a module.
// So, whatever you assign to module.exports will be exposed as a module.
export default router;
