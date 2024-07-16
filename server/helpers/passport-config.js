const LocalStrategy = require("passport-local");
const User = require("../models/user.model");

const initializePassport = (passport) => {
  const authenticateUser = (email, password, cb) => {
    console.log("asd123")
    User.findOne({ email: email })
    .select(' _id name email firstLogin isAdmin isLibrarian')
    .exec((err, user) => {
      if (err) {
        return cb(err, false);
      }
      if (!user) {
        return cb(null, false, { message: "User not found" });
      }
      if (!user.isValidPassword(password)) { return done(null, false, { message: 'Incorrect password.' })}
        return done(null, user);
    });
  };
  passport.use(new LocalStrategy({ usernameField: "email",  passwordField: 'password'}, authenticateUser));
  passport.serializeUser((user, done) => {
    done(null, user)
  });
  passport.deserializeUser((user, done) => {
    User.findById(user._id, (err, user) => {
      done(err, user);//ham done() nhan 2 tham so 
    });
  });
};

module.exports = initializePassport;
