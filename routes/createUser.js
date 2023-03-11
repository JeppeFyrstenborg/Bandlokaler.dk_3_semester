import express from "express";
import { findUserModel, getUserModel } from "../controllers/modelController.js";
import { addUser } from "../controllers/userController.js";
import { hashPassword } from "../controllers/hashingController.js";
const router = express.Router();

// ------------------------Start - CRUD HTTP methods---------------------
//To retrieve a resource, use GET.
router.get("/", async (request, response) => {
  response.render("createUser", {});
});

//To create a resource on the server, use POST.
router.post("/", async (request, response) => {
  let user = request.body;
  if (await findUserModel(user.email)) {
    response.status(200).json({ message: "User with email allready exist" });
  } else {
    const password = await hashPassword(user.password);
    const cities = [user.city.charAt(0).toUpperCase() + user.city.slice(1)];
    const bandName = user.bandName;
    const email = user.email;
    await addUser({
      bandName: bandName,
      cities: cities,
      email: email,
      password: password,
    });
    response.status(200).json({ message: "User does not exist" });
  }
});

//To change the state of a resource or to update it, use PUT.
router.put("/", (request, reresponses) => {});

//To remove or delete a resource, use DELETE.
router.delete("/", (request, response) => {});

// ------------------------End - CRUD HTTP methods---------------------

export default router;
