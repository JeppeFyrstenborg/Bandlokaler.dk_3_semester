//Import of different types. Declaration of app.
import express from "express";
const app = express();
import pug from "pug";
import session from "express-session";

//Middleware in general.
app.set("view engine", "pug");
app.use(express.static("assets"));
app.use(
  session({
    secret: "Some secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes. Import of routes. Routes are defined in the routes folder.
import calendarRoute from "./routes/calendar.js";
import createUserRoute from "./routes/createUser.js";
import editUserRoute from "./routes/editUser.js";
import loginRoute from "./routes/login.js";
import myBookingsRoute from "./routes/myBookings.js";

//Middleware in general.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "pug");
app.use(express.static("assets"));

//Destination of the server and what route it should take.
app.use("/calendar", calendarRoute);
app.use("/createUser", createUserRoute);
app.use("/editUser", editUserRoute);
app.use("/login", loginRoute);
app.use("/myBookings", myBookingsRoute);

//Info to console saying server is running.
app.listen(8080, () => {
  console.log("lytter på port 8080");
});

export default app;
