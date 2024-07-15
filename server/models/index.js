const mongoose = require("mongoose");
const Author = require("./author.model");
const Book = require("./book.model");
const Borrowal = require("./borrowal.model");
const Genre = require("./genre.model");
const Review = require("./review.model");
const Member = require("./member.model");
const User = require("./user.model");
const Fine = require("./fine.model")

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.author = Author;
db.book = Book;
db.borrowal = Borrowal;
db.genre = Genre;
db.review = Review;
db.member = Member;
db.user = User;
db.fine = Fine

db.connectDB = async () => {
  try {
    // Đặt cấu hình strictQuery trước khi kết nối
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
  }
};


module.exports = db;
