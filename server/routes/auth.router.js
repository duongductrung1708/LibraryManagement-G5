// Import required modules
const express = require("express");
const router = express.Router();
const middle = require("../middleware/validateUser.middleware");

// Import functions from controller
// const {
//   loginUser,
//   addUser,
//   logoutUser,
//   importUsers
// } = require('../controllers/auth.controller');
// const authController = require("../controllers/auth.controller");
const { authController } = require("../controllers");

router.post("/login", authController.loginUser);

router.post("/add", authController.addUser);

router.post("/import", authController.importUsers);

router.post("/importBooks", authController.importBooks);

router.get("/logout", (req, res) => authController.logoutUser(req, res));

router.get("/totalBooks", authController.countTotalBooks);

router.get("/totalUsers", authController.countTotalUsers);

router.get("/returnedBooks", authController.countReturnedBooks);

router.get("/totalBorrowedBooks", authController.countTotalBorrowedBooks);

router.get('/returnChartData', authController.generateReturnChartData);

router.get('/borrowedChartData', authController.generateBorrowedChartData);

router.post('/forgot-password', authController.forgotPassword);

module.exports = router;
