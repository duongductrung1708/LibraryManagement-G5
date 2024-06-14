const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    bookID: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "book",
        required: true
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "user",
        required: true
    },
    reviewedAt: {
        type: Date,
        required: "reviewedAt",
    },
    star: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: "rating is required"
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
   
},
{
    timestamps: true
})

module.exports = mongoose.model('Review', reviewSchema)
