const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true, unique: true },
  registeredCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  potentialSchedule: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
});

module.exports = mongoose.model('Student', StudentSchema);