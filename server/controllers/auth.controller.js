
const db = require('../models/index.js')
const passport = require("passport");
const sendMail = require('../middleware/sendmaiil');
const User = db.user;

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
    if (!newUser.password && newUser.password.length < 6) {
      return res.status(400).json({ success: false, message: "`password` is required and min 6 characters" });
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
    return res.status(400).json({ success: false, err });
  }
}

const importUsers = async (req, res, next) => {
  //recive data
  const { users } = req.body;
  try {
    //create new array
    const results = [];
    // loop data contain users
    for (const userData of users) {
      const existUser = await User.findOne({ email: userData.email });
      //check user exist
      if (existUser) {
        results.push({
          email: userData.email,
          success: false,
          message: 'User already exists',
        });
        continue;
      }
       //check phone exist
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
        phone: userData.phone,
        photoUrl: userData.photoUrl || 'default-photo-url.png',
        isAdmin: userData.isAdmin || false,
        isLibrarian: userData.isLibrarian || false,
      });
      const password = userData.password || newUser.generateRandomPassword()
      newUser.setPassword(password)
      await newUser.save();

      sendMail({
        email: newUser.email,
        subject: 'Thông báo từ ethnic group library',
        html:`
            <p>Hello,<strong>${newUser.name}</strong></p><br>
            <p>Your account has been created.<br> Here are your credentials: Username: ${newUser.email} || Password: <span style="color: blue; font-weight: bold;">${password}</span> <br>Thanks for use our service <3 </p>
        `
      });

      results.push({ email: userData.email, success: true });
    }
    console.log('4')
    res.status(200).json({ results });
  } catch (error) {
    console.error('Error importing users:', error);
    res.status(400).json({ success: false, error: 'Error importing users' });
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
  loginUser,
  logoutUser
}

module.exports = authController;
