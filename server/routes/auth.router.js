// Import required modules
const express = require("express")
const router = express.Router();
const middle = require('../middleware/validateUser.middleware')

// Import functions from controller
const {
  loginUser,
  addUser,
  logoutUser,
  importUsers
} = require('../controllers/auth.controller')

router.post("/login", (req, res) => loginUser(req, res))

router.post("/add-user", (req, res) => addUser(req, res))

router.post("/import", (req, res) => importUsers(req, res));

router.get("/logout", (req, res) => logoutUser(req, res))


module.exports = router;


