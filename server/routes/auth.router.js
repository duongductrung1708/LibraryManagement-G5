// Import required modules
const express = require("express")
const router = express.Router();
const middle = require('../middleware/validateUser.middleware')

// Import functions from controller
// const {
//   loginUser,
//   addUser,
//   logoutUser,
//   importUsers
// } = require('../controllers/auth.controller');
// const authController = require("../controllers/auth.controller");
const { authController } = require('../controllers')

router.post("/login", authController.loginUser)

router.post("/add", authController.addUser)

router.post("/import", authController.importUsers);

router.get("/logout", (req, res) => authController.logoutUser(req, res))


module.exports = router;


