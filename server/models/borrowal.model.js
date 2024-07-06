const mongoose = require('mongoose')

const borrowalSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestDate: {
    type: Date,
    required: false
  },
  borrowedDate: {
    type: Date,
    required: false
  },
  dueDate: {
    type: Date,
    required: false
  },
  status: {
    type: String,
    required: false
  },
  note: {
    type: String,
    required: false
  }
},{
  versionKey:false
})

const Borrowal = mongoose.model('Borrowal', borrowalSchema)

module.exports = Borrowal;