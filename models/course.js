const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  level: { type: String, required: true },
  time: { type: String, required: true },
  days: { type: String, required: true },
  seats: { type: Number, required: true },
  prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
});

module.exports = mongoose.model('Course', CourseSchema);