
const db = require('../models/index.js')
const passport = require("passport");
const User = db.user;

const registerUser = async (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    //check user exists
    if (user) {
      return res.status(403).json({ success: false, message: "User already exists" });
    }
    //check pass
    if (!req.body.password && req.body.password.length < 6) {
      return res.status(400).json({ success: false, message: "`password` is required and min 6 characters" });
    }

    const newUser = new User(req.body);
    newUser.setPassword(req.body.password);
    newUser.save((err, user) => {
      if (err) {
        return res.status(400).json({ success: false, err});
      }
      return res.status(201).json({
        success: true,
        user
      });
    })

  })
}

const loginUser = async (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  // User.findOne({ email: req.body.email }, (err, user) => {
  //   if (err) {
  //     return res.status(500).json({ success: false, err });
  //   }
  //   if (!user) {
  //     return res.status(404).json({ success: false, message: "User not found" });
  //   }
  //   if (!user.isValidPassword(req.body.password)) {
  //     return res.status(401).json({ success: false, message: "Password incorrect" });
  //   }
  //   console.log(req.session)
  //   // delete user.hash
  //   // delete user.
  //   passport.authenticate("local", (err, user, info) => {
  //     // console.log(req.session)
  //     req.logIn(user, (err) => {// Initiate a login session for `user`.
  //       if (err) {
  //         throw err;
  //       }
  //       return res.status(200).json({
  //         success: true,
  //         user
  //       });
  //     });
  //   },)(req, res, next);

  // })
  passport.authenticate("local", (err, email, password, info) => {
    console.log("abc")
    console.log(email)
    console.log(password)
    req.logIn(user, (err) => {// Initiate a login session for `user`.
      if (err) {
        throw err;
      }
      return res.status(200).json({
        success: true,
        user
      });
    });
  },)(req, res, next);
}

const logoutUser = async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    // res.redirect('/login');
  });
  return res.status(200).json({ success: true, message: "User logged out" });
}

const authController ={
  registerUser,
  loginUser,
  logoutUser
}

module.exports = authController;
