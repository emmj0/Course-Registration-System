const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true, unique: true },
  registeredCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  potentialSchedule: [{
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    days: { type: String },
    time: { type: String }
  }],
});

module.exports = mongoose.model('Student', StudentSchema);