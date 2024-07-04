
const db = require('../models/index.js')
const passport = require("passport");
const sendEmail = require('../middleware/mailer');
const User = db.user;

const addUser = async (req, res) => {
  const user = User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, err});
    }
  })

  //check user exists
  if (user) {
    return res.status(403).json({ success: false, message: "User already exists" });
  }
  //check pass
  if (!req.body.password && req.body.password.length < 6) {
    return res.status(400).json({ success: false, message: "`password` is required and min 6 characters" });
  }

  const newUser = new User(req.body);
  // newUser.setPassword(req.body.password);
  const password = newUser.password || newUser.generateRandomPasswordtest(6);
  newUser.setPassword(password);
  await newUser.save((err, user) => {
    if (err) {
      return res.status(400).json({ success: false, err});
    }
  })

  sendEmail(newUser.email, password)

  res.status(201).json({ success: true, newUser });
}

const importUsers = async (req, res, next) => {
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

      const newUser = new User({
        name: userData.name,
        email: userData.email,
        password: userData.password || user.generateRandomPassword(),
        dob: userData.dob || null,
        phone: userData.phone || 'N/A',
        photoUrl: userData.photoUrl || 'default-photo-url.png',
        isAdmin: userData.isAdmin || false,
        isLibrarian: userData.isLibrarian || false,
      });

      await newUser.save();

      req.emailDetails = { user: newUser, password: newUser.password };
      sendEmail(newUser, newUser.password);

      results.push({ email: userData.email, success: true });
    }

    res.status(200).json({ results });
  } catch (error) {
    console.error('Error importing users:', error);
    res.status(400).json({ success: false, error: 'Error importing users' });
  }
};

const loginUser = async (req, res, next) => {

  const email = req.body.email
  const password = req.body.password
 
  User.findOne({email: req.body.email}, (err, user) => {
    if (err) {
      return res.status(500).json({success: false, err});
    }
    if (!user) {
      return res.status(404).json({success: false, message: "User not found"});
    }
    if (!user.isValidPassword(req.body.password)) {
      return res.status(401).json({success: false, message: "Password incorrect"});
    }
    console.log(user)
    passport.authenticate("local", (err, user, info) => {
      console.log(user)
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

const authController ={
  addUser,
  importUsers,
  loginUser,
  logoutUser
}

module.exports = authController;
