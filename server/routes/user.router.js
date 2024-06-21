// Import required modules
const express = require("express")
const router = express.Router();
const middle = require('../middlewares/auth.middleware')

// Import functions from controller
const {
  getUser,
  getAllUsers,
  getAllMembers,
  addUser,
  updateUser,
  deleteUser
} = require('../controllers/user.controller')



router.get("/getAll", (req, res) => getAllUsers(req, res))

router.get("/getAllMembers", (req, res) => getAllMembers(req, res))

router.get("/get/:id", middle.adminMiddle, (req, res) => getUser(req, res))

router.post("/add", (req, res) => addUser(req, res))

router.put("/update/:id", (req, res) => updateUser(req, res))

router.delete("/delete/:id", (req, res) => deleteUser(req, res))

module.exports = router;
