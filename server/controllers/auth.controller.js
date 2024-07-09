const db = require('../models/index.js')
const passport = require("passport");
const sendMail = require('../middleware/sendmaiil');
const User = db.user;
const Book = db.book;

const addUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    //check user exists
    if (user) {
      return res.status(403).json({ success: false, message: "User already exists" });
    }

    //create user && add data
    const newUser = new User(req.body);
    //check pass
    if (newUser.password && newUser.password.length < 6) {
      return res.status(400).json({ success: false, message: "password is required and min 6 characters" });
    }
    const password = newUser.password || newUser.generateRandomPasswordtest(6);
    newUser.setPassword(password);
    await newUser.save((err, user) => {
      if (err) {
        return res.status(400).json({ success: false, err });
      }
    })
    //send mail
    sendMail({
      email: newUser.email,
      subject: 'Thông báo từ ethnic group library',
      html:`
          <p>Hello,<strong>${newUser.name}</strong></p><br>
          <p>Your account has been created.<br> Here are your credentials: Username: ${newUser.email} || Password: <span style="color: blue; font-weight: bold;">${password}</span> <br>Thanks for use our service <3 </p>
      `
    });
    res.status(201).json({ success: true, newUser });
  } catch (err) {
    console.log("asdf")
    return res.status(400).json({ success: false, message: err || "123" });
  }
}

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
          message: 'User already exists',
        });
        continue;
      }

      const existPhone = await User.findOne({ phone: userData.phone });
      if (existPhone) {
        results.push({
          phone: userData.phone,
          success: false,
          message: 'Phone already exists',
        });
        continue;
      }

      const newUser = new User({
        name: userData.name,
        email: userData.email,
        dob: userData.dob || null,
        phone: userData.phone || 'N/A',
        photoUrl: userData.photoUrl || 'default-photo-url.png',
        isAdmin: userData.isAdmin || false,
        isLibrarian: userData.isLibrarian || false,
      });

      const password = userData.password || newUser.generateRandomPassword();
      newUser.setPassword(password);

      await newUser.save();

      // Send email
      try {
        await sendMail({
          email: newUser.email,
          subject: 'Thông báo từ ethnic group library',
          html: `
            <p>Hello, <strong>${newUser.name}</strong></p><br>
            <p>Your account has been created.<br> Here are your credentials: Username: ${newUser.email} || Password: <span style="color: blue; font-weight: bold;">${password}</span> <br>Thanks for using our service <3 </p>
          `,
        });
        console.log(`Email sent to ${newUser.email}`);
      } catch (emailError) {
        console.error(`Failed to send email to ${newUser.email}:`, emailError);
      }

      results.push({ email: userData.email, success: true });
    }

    res.status(200).json({ results });
  } catch (error) {
    console.error('Error importing users:', error);
    res.status(400).json({ success: false, error: 'Error importing users' });
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
          message: 'Book with this ISBN already exists',
        });
        continue;
      }

      const newBook = new Book({
        name: bookData.name,
        isbn: bookData.isbn,
        authorId: bookData.authorId || null,
        genreId: bookData.genreId || null,
        isAvailable: bookData.isAvailable || true,
        summary: bookData.summary || '',
        photoUrl: bookData.photoUrl || 'default-photo-url.png',
        pageUrls: bookData.pageUrls || [],
        position: bookData.position || '',
      });

      await newBook.save();
      results.push({ isbn: bookData.isbn, success: true });
    }

    res.status(200).json({ results });
  } catch (error) {
    console.error('Error importing books:', error);
    res.status(400).json({ success: false, error: 'Error importing books' });
  }
};

const loginUser = async (req, res, next) => {

  const email = req.body.email
  const password = req.body.password

  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      err.status(500)
      next(err);
    }
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (!user.isValidPassword(req.body.password)) {
      return res.status(401).json({ success: false, message: "Password incorrect" });
    }
    if (!user.status) {
      return res.status(401).json({ success: false, message: "User is not active" });
    }
    passport.authenticate("local", (err, user, info) => {
      req.logIn(user, (err) => {
        if (err) {
          throw err;
        }
        const redirectUrl = user.firstLogin ? '/change-password' : user.isAdmin ? '/dashboard' : '/books';
        return res.status(200).json({
          success: true,
          user,
          redirectUrl
        });
      });
    },)(req, res, next);
  })
}

const logoutUser = async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
  });
  return res.status(200).json({ success: true, message: "User logged out" });
}

const authController = {
  addUser,
  importUsers,
  importBooks,
  loginUser,
  logoutUser
}

module.exports = authController;
