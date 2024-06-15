const Review = require('../models/review.model')

async function getReviewById(req, res,next) {
  try {
        const reviewid = req.params.id
        const review = await Review.findById(reviewid).populate("book", "name").populate("reviewedBy","name");
        res.status(200).json({review : review})
  } catch (error) {
      next(error)
  }
}

async function getReviewByBookId(req, res, next) {
    try {
        const book = req.params.bid // Kiểm tra giá trị của bookId
        const reviews = await Review.find({book: book })
            .populate("book", "name")
            .populate("reviewedBy", "name");

        if (reviews.length === 0) {
            return res.status(404).json({ message: "No reviews found for this book ID." });
        }

        res.status(200).json({ reviews: reviews });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        next(error); // Chuyển tiếp bất kỳ lỗi nào đến middleware xử lý lỗi
    }
}



async function getAllReviews (req, res,next) {
    try {
        const reviews = await Review.find({}).populate("book", "name").populate("reviewedBy","name");
        res.status(200).send(reviews)
    } catch (error) {
        next(error)
    }
}

async function addReview (req, res,next) {
    try {
        const userId = req.logIn.user._id
        const bookId = req.params.id
        if (!userId) return res.status(401).send('Unauthorized');
        const existingReview = await Review.findOne({ user: userId, book: req.params.id });
        if (existingReview) return res.status(400).send({ message: 'User already submitted a review for this book' });
        const newReview = new Review({
            user: userId,
            book: bookId,
            rating: req.body.rating,
            review: req.body.review
        });
        await Review.create(newReview);
        res.status(201).send({message: 'Review created successfully'});
    } catch (error) {
        next(error)
    }
}

async function updateReview (req, res,next){
try {
    const reviewId = req.params.id
    const updatedReview = req.body
    const newReview = await Review.findByIdAndUpdate(reviewId,updatedReview)
    res.status(200).send(await Review.findById(newReview.id))
} catch (error) {
    next(error)
}
}

async function deleteReview(req, res, next){
  try {
    const reviewId = req.params.id
    const deleteR = await Review.findByIdAndDelete(reviewId)
   res.status(204).send({message : "Review deleted successfully"})
  } catch (error) {
    next(error)
  }
}

module.exports = {
    getReviewById,
    getAllReviews,
    addReview,
    updateReview,
    deleteReview,
    getReviewByBookId
}
