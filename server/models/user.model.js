const mongoose = require("mongoose");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
  isLibrarian: {
    type: Boolean,
    required: true,
  },
  photoUrl: {
    type: String,
    required: false,
  },
  hash: {
    type:String,
    require: true
  },
  salt: {
    type:String,
    require: true
  },
  firstLogin: {
    type: Boolean,
    default: true,
  },
},{
  versionKey:false
});

// Method to set salt and hash the password for a user
UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
};

UserSchema.methods.isValidPassword = function (password) {
  const newhash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
    .toString(`hex`);
  return this.hash === newhash;
};

UserSchema.methods.generateRandomPassword = function (){
  return crypto.randomBytes(8).toString('hex');
};

UserSchema.methods.generateRandomPasswordtest = (length) => {
  return crypto.randomBytes(length / 2).toString('hex');
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
