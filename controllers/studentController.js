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

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(400).json({ msg: "Course not found" });
    }

    if (!student.registeredCourses.includes(courseId)) {
      student.registeredCourses.push(courseId);
      student.potentialSchedule.push({
        courseId: course._id,
        days: course.days,
        time: course.time
      });

      await student.save();
      return res.json({ msg: "Course added successfully" });
    } else {
      return res.status(400).json({ msg: "Course already registered" });
    }
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getCoursePrerequisites = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId).populate('prerequisites');
    if (!course) {
      return res.status(400).json({ msg: "Course not found" });
    }
    res.json(course.prerequisites);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.filterCourses = async (req, res) => {
  const { department, level, time, days, openSeats } = req.query;

  try {
    const query = {};
    if (department) query.department = department;
    if (level) query.level = level;
    if (time) query.time = time;
    if (days) query.days = days;
    if (openSeats) query.seats = { $gt: 0 };

    const courses = await Course.find(query);
    res.json(courses);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getPotentialSchedule = async (req, res) => {
  const { rollNumber } = req.body;

  try {
    const student = await Student.findOne({ rollNumber }).populate('potentialSchedule');
    if (!student) {
      return res.status(400).json({ msg: "Student not found" });
    }
    const course = await Course.find();
    const conflict = student.potentialSchedule.some(c => {
      return c.time === course.time && c.days === course.days;
    });
    res.json(student.potentialSchedule);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

