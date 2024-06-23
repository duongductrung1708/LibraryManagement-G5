const LocalStrategy = require("passport-local");
const User = require("../models/user.model");

const initializePassport = (passport) => {
  const authenticateUser = (email, password, cb) => {

    User.findOne({ email: email })
    .select(' _id name email firstLogin isAdmin isLibrarian')
    .exec((err, user) => {
      if (err) {
        return cb(err, false);
      }
      if (!user) {
        return cb(null, false, { message: "User not found" });
      }
      else {
        return cb(null, user);
      }
    });
  };
  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
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
