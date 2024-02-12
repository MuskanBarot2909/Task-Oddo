// app/models/courseRating.js

const mongoose = require('mongoose');

const courseRatingSchema = new mongoose.Schema({
  courseId: mongoose.Schema.Types.ObjectId,
  rating: Number,
});

const CourseRating = mongoose.model('CourseRating', courseRatingSchema);

module.exports = CourseRating;
