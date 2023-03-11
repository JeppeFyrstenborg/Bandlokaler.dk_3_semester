import express from "express";
const router = express.Router();
import { getUserModel } from "../controllers/modelController.js";
import { verifyPasswordWithHash } from "../controllers/hashingController.js";

// ------------------------Start - CRUD HTTP methods---------------------
//To retrieve a resource, use GET.
router.get("/", async (request, response) => {
  response.render("loginView", {});
  // response.status(200);
  // response.sendStatus(200);
});

//To retrieve a resource, use GET.
router.get("/logOut", async (request, response) => {
  request.session.user = null;
  request.session.authorized = false;
  response.redirect("/login");
});

//To create a resource on the server, use POST.
//Checking if the entered e-mail exists the database. If it does, it then check wheater
//the password in the request matches the password, belonging to the e-mail.
//If the log in was successful, it thens sets the request.session.authorized to true, and the request.session.user to the specified user.
//Currently it sends a positive response and the klient then redirects to /calendar.
router.post("/", async (request, response) => {
  let { email, password } = request.body;
  let user = await getUserModel(email);
  if (typeof user !== "undefined") {
    if (await verifyPasswordWithHash(password, user.password)) {
      request.session.user = user;
      request.session.authorized = true;
      response.status(200).json({ message: "Log in success" });
    } else {
      response.status(200).json({
        message: "The email address or password is incorrect. Please retry...",
      });
    }
  } else {
    response.status(200).json({
      message: "The email address or password is incorrect. Please retry...",
    });
  }
});

//To change the state of a resource or to update it, use PUT.
router.put("/", (request, reresponses) => {});

//To remove or delete a resource, use DELETE.
router.delete("/", (request, response) => {});

// ------------------------End - CRUD HTTP methods---------------------

export default router;
