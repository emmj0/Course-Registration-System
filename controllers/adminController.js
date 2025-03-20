const Course = require('../models/course');
const Student = require('../models/student');
const Admin = require('../models/admin');

// Add Course
exports.addCourse = async (req, res) => {
  const { name, department, level, time, days, seats, prerequisites } = req.body;
  if (!name || !department || !level || !time || !days || !seats) {
    return res.status(400).json({ msg: "All fields are required" });
  }
  console.log(req.body);
  try {
    const course = new Course({ name, department, level, time, days, seats, prerequisites });
    await course.save();
    res.json({ msg: 'Course added successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Fetch Courses Data
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update Courses
exports.updateCourse = async (req, res) => {
  const { name, department, level, time, days, seats } = req.body;
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, {
      name, department, level, time, days, seats
    }, { new: true });
    console.log(course);
    res.json({ msg: 'Course updated successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete Course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ msg: "Course not found" });
    res.json({ msg: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Get Students
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Override Student Registration
exports.overrideRegistration = async (req, res) => {
  const { rollNumber, courseData } = req.body;
  console.log(req.body);
  try {
    const student = await Student.findOne({ rollNumber });
    const course = await Course.findById(courseData);
    if (!student || !course) {
      return res.status(404).json({ msg: "Student or Course not found" });
    }
    if (student.registeredCourses.includes(courseData)) {
      return res.status(400).json({ msg: "Student is already registered for this course" });
    }
    student.registeredCourses.push(courseData);
    await student.save();

    res.json({ msg: "Student registered to course successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Adjust Seats
exports.adjustSeats = async (req, res) => {
  const { seats } = req.body;
  try {
    const course = await Course.findByIdAndUpdate(req.params.courseId, { seats }, { new: true });
    if (!course) return res.status(404).json({ msg: "Course not found" });
    res.json({ msg: "Seats updated successfully", course });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Reports
exports.getReports = async (req, res) => {
  try {
    const registeredStudents = await Student.find({
      registeredCourses: { $not: { $size: 0 } }
    });
    const availableCourses = await Course.find();
    const UnregisteredStudents = await Student.find({ registeredCourses: { $size: 0 } });
    res.json({
      registeredStudents,
      availableCourses,
      UnregisteredStudents
    });
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({ msg: "Server error" });
  }
};