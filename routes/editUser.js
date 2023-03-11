// This file handles all get/post/put/delete for /calendar.

// Import of the express, so we can get the router function.
import express, { response } from "express";
import { updateUser } from "../controllers/userController.js";
import { hashPassword } from "../controllers/hashingController.js";

const router = express.Router();
// ------------------------Start - CRUD HTTP methods---------------------
//To create a resource on the server, use POST.
router.post("/", async (request, response) => {});

//To retrieve a resource, use GET.
router.get("/", async (request, response) => {
  if (!request.session.authorized) {
    request.session.authorized = false;
    response.status(401).redirect("login");
  } else if (request.session.authorized == true) {
    let user = request.session.user;
    response.render("editUser", { user });
  } else {
    response.status(401).redirect("login");
  }
});

//To change the state of a resource or to update it, use PUT.
router.put("/", async (request, reresponses) => {
  let data = request.body;
  data.password = await hashPassword(data.password);
  updateUser(request.session.user.userID, data);
  response.status(201);
  response.end();
});

//To remove or delete a resource, use DELETE.
router.delete("/", async (request, response) => {});

// ------------------------End - CRUD HTTP methods---------------------

// Export of the router.
// The module.exports or export default is a special object which is included in every JavaScript file
// in the Node.js application by default. The module is a variable that represents
//  the current module, and exports is an object that will be exposed as a module.
// So, whatever you assign to module.exports will be exposed as a module.
export default router;
