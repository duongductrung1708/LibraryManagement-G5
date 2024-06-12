const mongoose = require("mongoose");
const Author = require("./author.model");
const Book = require("./book.model");
const Borrowal = require("./borrowal.model");
const Genre = require("./genre.model");
const Review = require("./review.model");
const User = require("./user.model");

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.author = Author;
db.book = Book;
db.borrowal = Borrowal;
db.genre = Genre;
db.review = Review;
db.user = User;

db.connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
        secret: process.env.SESSION_SECRET,
    });
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
  }
};

module.exports = db;
