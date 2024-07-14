const db = require("../models/index.js");
const passport = require("passport");
const sendMail = require("../middleware/sendmaiil");
const User = db.user;
const Book = db.book;
const Borrowal = db.borrowal;

const addUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(403)
        .json({ success: false, message: "User already exists" });
    }

    const newUser = new User(req.body);
    if (newUser.password && newUser.password.length < 6) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password is required and must be at least 6 characters",
        });
    }
    const password = newUser.password || newUser.generateRandomPasswordtest(6);
    newUser.setPassword(password);
    await newUser.save();

    // Send mail
    await sendMail({
      email: newUser.email,
      subject: "Thông báo từ ethnic group library",
      html: `
          <p>Hello, <strong>${newUser.name}</strong></p><br>
          <p>Your account has been created.<br> Here are your credentials: Username: ${newUser.email} || Password: <span style="color: blue; font-weight: bold;">${password}</span> <br>Thanks for using our service <3 </p>
      `,
    });

    res.status(201).json({ success: true, newUser });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const importUsers = async (req, res) => {
  const { users } = req.body;

  try {
    const results = [];

    for (const userData of users) {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        results.push({
          email: userData.email,
          success: false,
          message: "User already exists",
        });
        continue;
      }

      const existPhone = await User.findOne({ phone: userData.phone });
      if (existPhone) {
        results.push({
          phone: userData.phone,
          success: false,
          message: "Phone already exists",
        });
        continue;
      }

      const newUser = new User({
        name: userData.name,
        email: userData.email,
        dob: userData.dob || null,
        phone: userData.phone || "N/A",
        photoUrl: userData.photoUrl || "default-photo-url.png",
        isAdmin: userData.isAdmin || false,
        isLibrarian: userData.isLibrarian || false,
      });

      const password = userData.password || newUser.generateRandomPassword();
      newUser.setPassword(password);

      await newUser.save();

      // Send email
      await sendMail({
        email: newUser.email,
        subject: "Thông báo từ ethnic group library",
        html: `
          <p>Hello, <strong>${newUser.name}</strong></p><br>
          <p>Your account has been created.<br> Here are your credentials: Username: ${newUser.email} || Password: <span style="color: blue; font-weight: bold;">${password}</span> <br>Thanks for using our service <3 </p>
        `,
      });

      results.push({ email: userData.email, success: true });
    }

    res.status(200).json({ results });
  } catch (error) {
    console.error("Error importing users:", error);
    res.status(500).json({ success: false, error: "Error importing users" });
  }
};

const importBooks = async (req, res) => {
  const { books } = req.body;

  try {
    const results = [];

    for (const bookData of books) {
      const existingBook = await Book.findOne({ isbn: bookData.isbn });
      if (existingBook) {
        results.push({
          isbn: bookData.isbn,
          success: false,
          message: "Book with this ISBN already exists",
        });
        continue;
      }

      const newBook = new Book({
        name: bookData.name,
        isbn: bookData.isbn,
        authorId: bookData.authorId || null,
        genreId: bookData.genreId || null,
        isAvailable:
          bookData.isAvailable !== undefined ? bookData.isAvailable : true,
        summary: bookData.summary || "",
        photoUrl: bookData.photoUrl || "default-photo-url.png",
        pageUrls: bookData.pageUrls || [],
        position: bookData.position || "",
      });

      await newBook.save();
      results.push({ isbn: bookData.isbn, success: true });
    }

    res.status(200).json({ results });
  } catch (error) {
    console.error("Error importing books:", error);
    res.status(500).json({ success: false, error: "Error importing books" });
  }
};

const loginUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!user.isValidPassword(req.body.password)) {
      return res
        .status(401)
        .json({ success: false, message: "Password incorrect" });
    }

    if (!user.status) {
      return res
        .status(401)
        .json({ success: false, message: "User is not active" });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      const redirectUrl = user.firstLogin
        ? "/change-password"
        : user.isAdmin
        ? "/dashboard"
        : "/books";
      return res.status(200).json({
        success: true,
        user,
        redirectUrl,
      });
    });
  } catch (err) {
    return next(err);
  }
};

const logoutUser = async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.status(200).json({ success: true, message: "User logged out" });
  });
};

const countTotalBooks = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    res.status(200).json({ totalBooks });
  } catch (error) {
    console.error("Error counting total books:", error);
    res
      .status(500)
      .json({ success: false, error: "Error counting total books" });
  }
};

const countTotalUsers = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.status(200).json({ totalUsers });
  } catch (error) {
    console.error("Error counting total users:", error);
    res
      .status(500)
      .json({ success: false, error: "Error counting total users" });
  }
};

const countReturnedBooks = async (req, res) => {
  try {
    const returnedBooks = await Borrowal.countDocuments({ status: "returned" });
    res.status(200).json({ returnedBooks });
  } catch (error) {
    console.error("Error counting returned books:", error);
    res
      .status(500)
      .json({ success: false, error: "Error counting returned books" });
  }
};

const countTotalBorrowedBooks = async (req, res) => {
  try {
    const totalBorrowedBooks = await Borrowal.countDocuments({
      status: { $ne: "returned" },
    });
    res.status(200).json({ totalBorrowedBooks });
  } catch (error) {
    console.error("Error counting total borrowed books:", error);
    res
      .status(500)
      .json({ success: false, error: "Error counting total borrowed books" });
  }
};

const authController = {
  addUser,
  importUsers,
  importBooks,
  loginUser,
  logoutUser,
  countTotalBooks,
  countTotalUsers,
  countReturnedBooks,
  countTotalBorrowedBooks,
};

module.exports = authController;
