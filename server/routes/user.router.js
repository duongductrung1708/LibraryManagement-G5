const express = require("express");
const router = express.Router();
// const middle = require('../middleware/validateUser.middleware')
const sendEmail = require('../middleware/mailer');

const {
  getUser,
  getAllUsers,
  getAllMembers,
  addUser,
  updateUser,
  deleteUser,
  importUsers,
  changePassword,
} = require('../controllers/user.controller');


router.get("/getAll", (req, res) => getAllUsers(req, res));

router.get("/getAllMembers", (req, res) => getAllMembers(req, res));

// router.get("/get/:id", middle.adminMiddle, (req, res) => getUser(req, res))
router.get("/get/:id", (req, res) => getUser(req, res))

router.post("/add", addUser, sendEmail);

router.put("/update/:id", (req, res) => updateUser(req, res));

router.delete("/delete/:id", (req, res) => deleteUser(req, res));

router.post("/import", importUsers, sendEmail);

router.post("/change-password", (req, res) => changePassword(req, res));

module.exports = router;
