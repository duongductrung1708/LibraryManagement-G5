// Import required modules
const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");

// Import routers
const {
  AuthRouter,
  BookRouter,
  AuthorRouter,
  BorrowalRouter,
  GenreRouter,
  UserRouter,
  ReviewRouter,
} = require("./routes");

// Configure dotenv for environment variables in production
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Setup express
const app = express();
const PORT = process.env.PORT || 8080;

// Use morgan for logging
app.use(logger("dev"));

// Set middleware to process form data
app.use(express.urlencoded({ extended: false }));

// Connect to DB
const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to DB on MongoDB Atlas");
  })
  .catch((err) => console.log("DB connection error", err));

// Use CORS for Cross Origin Resource Sharing
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Set middleware to manage sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

// Parse cookies used for session management
app.use(cookieParser(process.env.SESSION_SECRET));

// Parse JSON objects in request bodies
app.use(express.json());

// Use passport authentication middleware
app.use(passport.initialize());
app.use(passport.session());

// Initialise passport as authentication middleware
const initializePassport = require("./passport-config");
initializePassport(passport);

// Implement routes for REST API
app.use("/api/auth", AuthRouter);
app.use("/api/book", BookRouter);
app.use("/api/author", AuthorRouter);
app.use("/api/borrowal", BorrowalRouter);
app.use("/api/genre", GenreRouter);
app.use("/api/user", UserRouter);
app.use("/api/review", ReviewRouter);

app.get("/", (req, res) => res.send("Welcome to Library Management System"));

app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));
