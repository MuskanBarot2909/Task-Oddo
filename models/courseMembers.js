// app/models/courseMembers.js

const mongoose = require('mongoose');

const courseMembersSchema = new mongoose.Schema({
  courseId: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
});

const CourseMembers = mongoose.model('CourseMembers', courseMembersSchema);

module.exports = CourseMembers;
