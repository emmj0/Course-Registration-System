const express = require('express');
const { getCourses, addCourse ,getCoursePrerequisites ,filterCourses, getPotentialSchedule} = require('../controllers/studentController.js');
const router = express.Router();

router.get('/courses', getCourses);
router.post('/addCourse', addCourse);
router.get('/getCoursePrerequisites/:courseId', getCoursePrerequisites);
router.get('/filterCourses', filterCourses);
router.post('/getPotentialSchedule', getPotentialSchedule);

module.exports = router;