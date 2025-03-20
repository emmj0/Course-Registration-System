const express = require('express');
const { getCourses, addCourse } = require('../controllers/studentController.js');
const router = express.Router();

router.get('/courses', getCourses);
router.post('/addCourse', addCourse);
// router.get("/registeredCourses/:rollNumber", getRegisteredCourses);

module.exports = router;