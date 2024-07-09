const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  isbn: {
    type: String,
    required: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: false
  },
  genreId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Genre',
    required: false
  },
  isAvailable: {
    type: Boolean,
    required: true
  },
  summary: {
    type: String,
    required: false
  },
  photoUrl: {
    type: String,
    required: false
  },
  pageUrls: {
    type: [String],
    required: false
  },
  position: {
    type: String,
    required: true
  },

},{
  versionKey:false
})


const Book = mongoose.model('Book', bookSchema)

module.exports = Book;