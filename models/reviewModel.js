const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
  review: {
    type: String,
    required: [true, 'Review can not be empty'],
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be between 1 and 5'],
    max: [5, 'Rating must be between 1 and 5'],
    required: [true, 'Review must have a rating'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;