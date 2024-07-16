const mongoose = require('mongoose');

const fineSchema = new mongoose.Schema({
  borrowalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Borrowal',
    required: true
  },
  fineAmount: {
    type: Number,
    required: true
  },
  daysOverdue: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['unpaid', 'paid'],
    default: 'unpaid'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  paidAt: {
    type: Date,
    required: false
  }
}, {
  versionKey: false
});

const Fine = mongoose.model('Fine', fineSchema);

module.exports = Fine;
