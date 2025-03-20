const Student = require('../models/student');
const Course = require('../models/course');

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.addCourse = async (req, res) => {
  const { rollNumber, courseId } = req.body;

  try {
    const student = await Student.findOne({ rollNumber: rollNumber });
    if (!student) {
      return res.status(400).json({ msg: "Student not found" });
    }
    if (!student.registeredCourses.includes(courseId)) {
      student.registeredCourses.push(courseId);
      await student.save();
      return res.json({ msg: "Course added successfully" });
    } else {
      return res.status(400).json({ msg: "Course already registered" });
    }
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// exports.getRegisteredCourses = async (req, res) => {
//   const { rollNumber } = req.params;

//   try {
//     const student = await Student.findOne({ rollNumber }).populate('registeredCourses');

//     if (!student) {
//       return res.status(400).json({ msg: "Student not found" });
//     }

//     res.json(student.registeredCourses); // This now returns course details, not just IDs
//   } catch (err) {
//     res.status(500).json({ msg: "Server error" });
//   }
// };