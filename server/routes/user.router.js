const express = require("express")
const router = express.Router();

const {
  getUser,
  getAllUsers,
  getAllMembers,
  addUser,
  updateUser,
  deleteUser,
  importUsers
} = require('../controllers/user.controller')

router.get("/getAll", (req, res) => getAllUsers(req, res))

router.get("/getAllMembers", (req, res) => getAllMembers(req, res))

router.get("/get/:id", (req, res) => getUser(req, res))

router.post("/add", (req, res) => addUser(req, res))

router.put("/update/:id", (req, res) => updateUser(req, res))

router.delete("/delete/:id", (req, res) => deleteUser(req, res))

router.post("/import", (req, res) => importUsers(req, res))

module.exports = router;
