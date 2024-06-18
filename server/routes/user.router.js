// Import required modules
const express = require("express")
const router = express.Router();

// Import functions from controller
const {
  getUser,
  getAllUsers,
  getAllMembers,
  addUser,
  updateUser,
  deleteUser
} = require('../controllers/user.controller')

function isAuthenticated(req, res, next) {

  console.log("abc")
  console.log(req.isAuthenticated())
  if (req.session.passport ) {
    return next();
  } else {
    return next(req.session)
  }
}

router.get("/getAll", (req, res) => getAllUsers(req, res))

router.get("/getAllMembers", (req, res) => getAllMembers(req, res))

router.get("/get/:id",isAuthenticated, (req, res) => getUser(req, res))

router.post("/add", (req, res) => addUser(req, res))

router.put("/update/:id", (req, res) => updateUser(req, res))

router.delete("/delete/:id", (req, res) => deleteUser(req, res))

module.exports = router;
