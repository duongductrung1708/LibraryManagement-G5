// Import required modules
const express = require("express")
const router = express.Router()

const {loginUser} = require("../controllers/auth.controller")
// Import functions from controller
const {
    getReview,
    getAllReviews,
    addReview,
    updateReview,
    deleteReview
} = require('../controllers/review.controller')

router.get("/getAll",getAllReviews)   

router.get("/get/:id",getReview)

router.post("/add/:id",addReview)

router.put("/update/:id",updateReview)

router.delete("/delete/:id",deleteReview)

module.exports = router;
