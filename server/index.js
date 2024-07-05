const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");
const initializePassport = require("./middleware/passport-config");
const MongoStore = require('connect-mongo');
require('./cron');

// Import routers
const routes = require("./routes");
// const initMiddleware = require("./middlewares/auth.middleware");

const cookieParser = require("cookie-parser");
const db = require("./models");
const createError = require("http-errors"); // Import http-errors

const {
  AuthRouter,
  BookRouter,
  AuthorRouter,
  BorrowalRouter,
  GenreRouter,
  UserRouter,
  ReviewRouter,
} = require("./routes");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Parse cookies used for session management
// app.use(cookieParser(process.env.SESSION_SECRET));

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie:{
      maxAge: 1000 * 64 * 10,
      sameSite: 'strict',
      // secure: true
    },
    store: new MongoStore({ 
      mongooseConnection: mongoose.connection,
      mongoUrl:process.env.MONGO_URI,
      collectionName: 'session',
      autoRemove: 'native', }),
      // stringify: false,
  })
);

app.use(passport.initialize());

app.use(passport.session());
// Initialise passport as authentication middleware
initializePassport(passport);
// Initialise middleware
// initMiddleware(app)
// Implement routes for REST API



app.use("/api/auth", AuthRouter);
app.use("/api/book", BookRouter);
app.use("/api/author", AuthorRouter);
app.use("/api/borrowal", BorrowalRouter);
app.use("/api/genre", GenreRouter);
app.use("/api/user", UserRouter);
app.use("/api/review", ReviewRouter);

app.use((req, res, next) => {
  // console.log("avx")
  // next(createError(404));
  res.status(404).json({
    success: false,
    message: 'Bad method'
  });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.get("/", (req, res) => res.send("Welcome to Library Management System"));

app.listen(process.env.PORT, process.env.HOST_NAME, () => {
  console.log("Server listening on port " + process.env.PORT);
  db.connectDB();
});
