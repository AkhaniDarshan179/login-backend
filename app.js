import "./config/passport.js";
import { validatePassword } from "./middleware/auth.js";
import bodyParser from "body-parser";
import connectDB from "./database/connectdb.js";
import cors from "cors";
import express from "express";
import passport from "passport";
import session from "express-session";
import userController from "./controllers/userController.js";
import employeeController from "./controllers/employeeController.js";

const app = express();
const port = 8000;
const DATABASE_URI = "mongodb://127.0.0.1:27017";

connectDB(DATABASE_URI);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

app.post("/api/signup", validatePassword, userController.createUser);
app.post("/api/login", userController.getUser);

app.post(
  "/api/employee",
  passport.authenticate("jwt"),
  employeeController.createEmployee
);
app.get(
  "/api/employees",
  passport.authenticate("jwt"),
  employeeController.getAllEmployee
);

app.post("/api/send-sms", userController.forgotPassword);
app.post("/api/verify-code", userController.verifyCode);
app.post("/api/change-password", userController.changePassword);

app.listen(port, () => {
  console.log(`Server is is on http://localhost:${port}`);
});
